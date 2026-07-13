import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
const OUT = process.env.OUT || "/tmp/live";
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const c = await b.newContext({ viewport:{width:1440,height:900} });
const p = await c.newPage();
await p.goto("http://localhost:5341/", { waitUntil:"networkidle", timeout:60000 });
await p.waitForTimeout(4000); // intro ~1.45s + chat autoplay settle
await p.screenshot({ path: `${OUT}/hero-live-desktop.png` });
console.log("saved live hero");
await b.close();
