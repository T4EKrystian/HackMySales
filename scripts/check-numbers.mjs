/**
 * V6-F2: bramka spójności liczb (brief Faza 2).
 * (a) components/**.tsx: ZERO literałów KWOT (zł) w kodzie oraz zero procentów
 *     w pozycji TEKSTU JSX — liczby wchodzą wyłącznie przez dict (pl.ts) /
 *     truth-table (content/demo-data.ts). Techniczne stringi GSAP ("top 80%",
 *     style top:"22%") są konfiguracyjne, nie treściowe — legalne.
 * (b) content/pl.ts: każda liczba przy zł/% w STRINGACH musi istnieć w truth-table
 *     (proza decku nie może rozjechać się z licznikami).
 * Użycie: node scripts/check-numbers.mjs  ·  npm run check:numbers
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { demoValues } from "../content/demo-data.ts";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const problems = [];

/* ---------- (a) komponenty ---------- */

async function* tsxFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* tsxFiles(p);
    else if (e.name.endsWith(".tsx")) yield p;
  }
}

function stripNonContent(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "")
    .replace(/className=\{`[\s\S]*?`\}/g, "")
    .replace(/className="[^"]*"/g, "")
    .replace(/\[[^\]\n]*%\]/g, "");
}

const CURRENCY = /\d[\d\s  ]*(?:,\d+)?\s?zł/;
const JSX_TEXT_PCT = />[^<{}\n]*\d[\d\s  ]*\s?%/;

for await (const file of tsxFiles(path.join(ROOT, "components"))) {
  const src = stripNonContent(await readFile(file, "utf8"));
  src.split("\n").forEach((line, i) => {
    for (const re of [CURRENCY, JSX_TEXT_PCT]) {
      const m = line.match(re);
      if (m) problems.push({ where: `${path.relative(ROOT, file)}:${i + 1}`, co: `literał "${m[0].trim()}" w JSX` });
    }
  });
}

/* ---------- (b) pl.ts: proza vs truth-table ---------- */

const plSrc = await readFile(path.join(ROOT, "content/pl.ts"), "utf8");
const known = demoValues();
const strings = [...plSrc.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);

const seen = new Map();
for (const s of strings) {
  for (const m of s.matchAll(/(\d[\d\s  ]*(?:,\d+)?)\s?(zł|%)/g)) {
    const num = Number(m[1].replace(/[\s  ]/g, "").replace(",", "."));
    if (!known.has(num) && !seen.has(num)) {
      seen.set(num, `…${s.slice(Math.max(0, m.index - 18), m.index + 16)}…`);
    }
  }
}
for (const [num, ctx] of seen) {
  problems.push({ where: "content/pl.ts", co: `${num} ("${ctx}") — brak w demo-data` });
}

if (problems.length) {
  console.table(problems);
  console.log(`CHECK-NUMBERS: FAIL (${problems.length})`);
  process.exit(1);
}
console.log("CHECK-NUMBERS: PASS — JSX bez literałów kwot; proza pl.ts pokryta truth-table");
