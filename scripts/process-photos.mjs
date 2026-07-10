/**
 * V5-F1: pipeline foto produktowych (deck: hms-design-dna „Fotografia produktowa").
 * assets-src/*.jpg → /public/products/<slug>.webp (800×800 q80) + <slug>-112.webp
 * + /public/team/magda.webp (256×256).
 * Grade: crop 1:1 (attention lub manualny region), desaturacja −8%. Winieta 3% = CSS.
 * Uruchom: node scripts/process-photos.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "assets-src";
const OUT = "public/products";
const OUT_TEAM = "public/team";

// region: ułamki {l, t, s} względem (w, h, min(w,h)) — ręczny kadr zamiast attention.
const PHOTOS = [
  { slug: "m-city", file: "m-city__11524787.jpg" },
  // attention łapał korony drzew — kadr na rower
  { slug: "m29", file: "m29-alt__32910927.jpg", region: { l: 0.3, t: 0.585, s: 0.51 } },
  { slug: "kask-ridge", file: "kask-ridge__15292264.jpg" },
  { slug: "kask-core", file: "kask-a__u-rw8jnGPJpho.jpg" },
  // pełny but; napis nieczytelny w rozmiarach użycia (thumby ≤112 px) — patrz SOURCES.md
  { slug: "x-trail-2", file: "x-trail-2__29603275.jpg" },
  { slug: "x-trail-mid", file: "x-trail-mid-alt__16562750.jpg" },
  // flat lay: detal kaptur+tors kurtki (sąsiednie obiektywy poza kadrem)
  { slug: "kurtka-3l", file: "kurtka-3l-b__u-UjzJzuCHZDU.jpg", region: { l: 0.7125, t: 0.12, s: 0.4125 } },
  // ciasny kadr na zapięciu (bagażnik)
  { slug: "u-lock", file: "u-lock__11145678.jpg", region: { l: 0.2, t: 0.48, s: 0.72 } },
  // ciasny kadr na plecak — foto-gate V6: szerokie szare tło zbijało entropię (thumb 2.15)
  { slug: "plecak", file: "plecak__13869858.jpg", region: { l: 0.265, t: 0.315, s: 0.43 } },
  // kadr na misiową kurtkę z kapturem (attention uciekał na drążek)
  { slug: "kurtka-kids", file: "kurtka-kids__28259750.jpg", region: { l: 0.4, t: 0.33, s: 0.58 } },
  { slug: "spodnie-junior", file: "spodnie-junior__28259747.jpg", region: { l: 0.22, t: 0.35, s: 0.5 } },
  { slug: "komplet-termo", file: "komplet-termo__30569741.jpg" },
  // prawa manekinka z koronkową sukienką
  { slug: "sukienka", file: "sukienka__8618977.jpg", region: { l: 0.32, t: 0.08, s: 0.92 } },
  // lampa + marmurowy stolik, oddech ściany
  { slug: "dom", file: "dom__6825311.jpg", region: { l: 0.26, t: 0.5, s: 0.98 } },
  // ciasny kadr na muszle słuchawek — foto-gate V6 (biel tła zbijała entropię 800px)
  { slug: "elektronika", file: "elektronika__7772548.jpg", region: { l: 0.14, t: 0.5, s: 0.58 } },
  { slug: "b2b", file: "b2b__38195854.jpg" },
];

const MAGDA = { file: "magda-alt2__30468665.jpg", size: 256 };

async function cut(file, region, size, dest) {
  const src = path.join(SRC, file);
  let img = sharp(src);
  if (region) {
    const { width, height } = await img.metadata();
    const side = Math.round(Math.min(region.s * Math.min(width, height), width, height));
    const left = Math.min(Math.round(region.l * width), width - side);
    const top = Math.min(Math.round(region.t * height), height - side);
    img = img.extract({ left: Math.max(0, left), top: Math.max(0, top), width: side, height: side });
  }
  await img
    .resize(size, size, { fit: "cover", position: region ? "centre" : sharp.strategy.attention })
    .modulate({ saturation: 0.92 })
    .webp({ quality: 80 })
    .toFile(dest);
}

await mkdir(OUT, { recursive: true });
await mkdir(OUT_TEAM, { recursive: true });

for (const p of PHOTOS) {
  await cut(p.file, p.region, 800, path.join(OUT, `${p.slug}.webp`));
  await cut(p.file, p.region, 112, path.join(OUT, `${p.slug}-112.webp`));
  console.log(`✓ ${p.slug}`);
}

await cut(MAGDA.file, undefined, MAGDA.size, path.join(OUT_TEAM, "magda.webp"));
console.log("✓ team/magda");
console.log("done");
