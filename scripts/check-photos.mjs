/**
 * V6-F1: FOTO-GATE (brief: bramka akceptacyjna). Dla każdego wpisu z
 * public/products/products.json (+ team) otwiera <slug>.webp i <slug>-112.webp,
 * liczy: entropię (sharp.stats) i udział pikseli o saturacji >55 (skala 0–255).
 * Fotografia przechodzi, płaski placeholder/ikona NIE. Kalibracja progów:
 * syntetyczny negatyw (kafel inicjałowy jak stary ProductVisual) musi OBLAĆ.
 * Wyjście: tabela + exit code (≠0 gdy jakikolwiek slot nie przechodzi).
 * Użycie: node scripts/check-photos.mjs [--verbose]
 */
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.dirname(new URL(import.meta.url).pathname) + "/..";
const DIR = path.join(ROOT, "public/products");

// Progi skalibrowane na V6-secie (patrz tabela --verbose):
// - realne foto 800px: entropy 5.2–7.6; thumby 112px: 4.8–7.6 (downsampling
//   wygładza fakturę — mono-packshoty tracą ~1.5 pkt entropii),
// - syntetyczny kafel-inicjał: entropy ~0.4; kafel z szumem (ProductVisual-like): ~3.4.
// Fotografia = entropy ≥ MIN ORAZ (satShare ≥ 0.002 LUB entropy ≥ MONO_OK);
// druga gałąź: packshoty niemal monochromatyczne (czarny kask na ciemnym tle).
const MIN_ENTROPY = 4.2;
const MIN_SAT_SHARE = 0.002;
const MONO_OK_ENTROPY = { full: 5.0, thumb: 4.6 }; // thumb: margines ~1.2 pkt nad noisy-tile
const SAT_THRESHOLD = 55;

async function metrics(file) {
  const img = sharp(file);
  const [{ entropy }, raw] = await Promise.all([
    img.stats(),
    img.raw().toBuffer({ resolveWithObject: true }),
  ]);
  const { data, info } = raw;
  const ch = info.channels;
  let saturated = 0;
  const px = info.width * info.height;
  for (let i = 0; i < data.length; i += ch) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    if (sat > SAT_THRESHOLD) saturated++;
  }
  return { entropy, satShare: saturated / px };
}

function verdict(m, kind = "full") {
  const monoOk = MONO_OK_ENTROPY[kind] ?? MONO_OK_ENTROPY.full;
  return m.entropy >= MIN_ENTROPY && (m.satShare >= MIN_SAT_SHARE || m.entropy >= monoOk);
}

/** Negatyw kalibracyjny: płaski kafel z inicjałem (jak stary placeholder). */
async function syntheticNegative() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800">
    <rect width="800" height="800" fill="#141824"/>
    <rect x="0" y="0" width="800" height="800" fill="#1A2033" rx="64"/>
    <text x="400" y="470" font-family="monospace" font-size="220" fill="#5C77FF" text-anchor="middle">XT</text>
  </svg>`;
  const buf = await sharp(Buffer.from(svg)).webp().toBuffer();
  return metrics(buf);
}

const verbose = process.argv.includes("--verbose");
const manifest = JSON.parse(await readFile(path.join(DIR, "products.json"), "utf8"));

const rows = [];
let failures = 0;

for (const p of manifest.products) {
  for (const suffix of ["", "-112"]) {
    const file = path.join(DIR, `${p.slug}${suffix}.webp`);
    try {
      const m = await metrics(file);
      const ok = verdict(m, suffix ? "thumb" : "full");
      if (!ok) failures++;
      rows.push({ slot: `${p.slug}${suffix}`, entropy: m.entropy.toFixed(2), "sat>55": (m.satShare * 100).toFixed(2) + "%", foto: ok ? "✓" : "✗ FAIL" });
    } catch {
      failures++;
      rows.push({ slot: `${p.slug}${suffix}`, entropy: "—", "sat>55": "—", foto: "✗ BRAK PLIKU" });
    }
  }
}
for (const t of manifest.team ?? []) {
  const file = path.join(ROOT, "public", t.file);
  try {
    const m = await metrics(file);
    const ok = verdict(m);
    if (!ok) failures++;
    rows.push({ slot: t.file, entropy: m.entropy.toFixed(2), "sat>55": (m.satShare * 100).toFixed(2) + "%", foto: ok ? "✓" : "✗ FAIL" });
  } catch {
    failures++;
    rows.push({ slot: t.file, entropy: "—", "sat>55": "—", foto: "✗ BRAK PLIKU" });
  }
}

// samotest bramki: syntetyczny kafel MUSI oblać (inaczej progi są bezwartościowe)
const neg = await syntheticNegative();
const negPass = verdict(neg);
rows.push({ slot: "(negatyw syntetyczny)", entropy: neg.entropy.toFixed(2), "sat>55": (neg.satShare * 100).toFixed(2) + "%", foto: negPass ? "✗ BRAMKA ŚLEPA" : "odrzucony ✓" });
if (negPass) failures++;

if (verbose || failures > 0) console.table(rows);
console.log(failures === 0 ? `FOTO-GATE: PASS (${rows.length - 1} slotów + negatyw odrzucony)` : `FOTO-GATE: FAIL (${failures})`);
process.exit(failures === 0 ? 0 : 1);
