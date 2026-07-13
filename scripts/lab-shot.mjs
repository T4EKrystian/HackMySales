// Lab bake-off screenshotter (Faza A) — throwaway, usuwane z labem.
// Uruchamiaj Z KATALOGU REPO: node scripts/lab-shot.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.LAB_BASE || "http://localhost:5341";
const OUT = process.env.LAB_OUT || "/tmp/lab-shots";
const VARIANTS = process.env.LAB_VARIANTS
  ? process.env.LAB_VARIANTS.split(",")
  : ["aurora-dark", "aurora-light", "editorial-dark", "editorial-light"];
const VIEWPORTS = [
  { key: "desktop", width: 1440, height: 900 },
  { key: "mobile", width: 390, height: 844 },
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    reducedMotion: "reduce", // determinizm: czat pokazuje pełną rozmowę statycznie
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  for (const v of VARIANTS) {
    const url = `${BASE}/lab/hero#${v}:bare`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
    // twarde ustawienie wariantu (na wypadek, gdyby hash nie wyzwolił efektu)
    await page.evaluate((id) => {
      if (location.hash !== `#${id}:bare`) location.hash = `${id}:bare`;
    }, v);
    await page.waitForTimeout(1400);
    const file = `${OUT}/${v}-${vp.key}.png`;
    await page.screenshot({ path: file });
    console.log("saved", file);
  }
  await ctx.close();
}

await browser.close();
console.log("done");
