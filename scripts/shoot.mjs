// scripts/shoot.mjs — full-page screenshots for design QA
//
// Usage:
//   node scripts/shoot.mjs                     # home (the whole single-page landing), all viewports
//   node scripts/shoot.mjs home --reduced      # prefers-reduced-motion variant
//   node scripts/shoot.mjs style-tile          # the /style-tile route (Phase 2)
//   SHOOT_URL=http://localhost:5341 node scripts/shoot.mjs   # non-default server (e.g. live `next dev`)
//
// Server: defaults to the static export on :5343 (`npm run build && npm run serve:out`).
// Requires: playwright (already a devDependency).
// Output:   design/shots/<route>-<viewport>[-rm].png

import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const BASE = process.env.SHOOT_URL ?? 'http://localhost:5343';
const OUT = 'design/shots';

// Single-page app: /funkcje, /cennik, … are #anchors, not routes.
// `home` = the whole landing; `style-tile` = the Phase-2 design-system route.
const ROUTES = {
  home: '/',
  'style-tile': '/style-tile',
};

const VIEWPORTS = {
  390: { width: 390, height: 844 },
  768: { width: 768, height: 1024 },
  1440: { width: 1440, height: 900 },
};

const args = process.argv.slice(2);
const reduced = args.includes('--reduced');
const picked = args.filter((a) => !a.startsWith('--'));
const routes = picked.length
  ? picked
  : Object.keys(ROUTES).filter((r) => r !== 'style-tile');

for (const r of routes) {
  if (!(r in ROUTES)) {
    console.error(`Unknown route "${r}". Known: ${Object.keys(ROUTES).join(', ')}`);
    process.exit(1);
  }
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();

try {
  for (const route of routes) {
    for (const [label, viewport] of Object.entries(VIEWPORTS)) {
      const ctx = await browser.newContext({
        viewport,
        deviceScaleFactor: 1,
        reducedMotion: reduced ? 'reduce' : 'no-preference',
      });
      const page = await ctx.newPage();
      await page.goto(BASE + ROUTES[route], {
        waitUntil: 'networkidle',
        timeout: 30_000,
      });

      // Wait for webfonts, then scroll through the page so scroll-linked
      // reveals (GSAP ScrollTrigger) fire before the full-page capture.
      await page.evaluate(async () => {
        await (document.fonts?.ready ?? Promise.resolve());
        await new Promise((resolve) => {
          let y = 0;
          const step = () => {
            y += window.innerHeight * 0.7;
            window.scrollTo(0, y);
            if (y < document.body.scrollHeight) {
              setTimeout(step, 180);
            } else {
              window.scrollTo(0, 0);
              setTimeout(resolve, 700);
            }
          };
          step();
        });
      });

      const file = `${OUT}/${route}-${label}${reduced ? '-rm' : ''}.png`;
      await page.screenshot({ path: file, fullPage: true });
      console.log('saved', file);
      await ctx.close();
    }
  }
} finally {
  await browser.close();
}
