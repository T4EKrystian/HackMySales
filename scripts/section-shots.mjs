// Per-section light screenshots (Faza B audit). Run from repo dir. reduced-motion = deterministyczne
// (czat pełny, GL ukryty). Uruchamiaj: OUT=... node scripts/section-shots.mjs
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const BASE = process.env.BASE || "http://localhost:5341";
const OUT = process.env.OUT || "/tmp/sections";
const VP = process.env.MOBILE ? { width: 390, height: 844 } : { width: 1440, height: 1000 };
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const c = await b.newContext({ viewport: VP, reducedMotion: "reduce", deviceScaleFactor: 1 });
const p = await c.newPage();
await p.goto(BASE + "/", { waitUntil: "networkidle", timeout: 60000 });
await p.waitForTimeout(1200);
const secs = await p.evaluate(() => {
  const out = [];
  document.querySelectorAll("header, main > section, footer").forEach((el, i) => {
    const id = el.id || el.getAttribute("data-ambient") || `sec${i}`;
    out.push({ id, tag: el.tagName.toLowerCase() });
  });
  return out;
});
const handles = await p.$$("header, main > section, footer");
let idx = 0;
for (const h of handles) {
  const meta = secs[idx++];
  await h.scrollIntoViewIfNeeded().catch(() => {});
  await p.waitForTimeout(250);
  const box = await h.boundingBox();
  if (!box || box.height < 8) { console.log("skip", meta.id); continue; }
  // clip capped to a sane height (very tall sections → cap 2600)
  const clip = { x: 0, y: box.y, width: VP.width, height: Math.min(box.height, 2600) };
  const suffix = process.env.MOBILE ? "-m" : "";
  await p.screenshot({ path: `${OUT}/${String(idx).padStart(2,"0")}-${meta.id}${suffix}.png`, clip });
  console.log("saved", meta.id, Math.round(box.height));
}
await b.close();
