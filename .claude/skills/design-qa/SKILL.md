---
name: design-qa
description: Visual QA gate for the HackMySales landing. Run after completing each section and before declaring the project done — build, screenshots, contrast, motion, a11y, anti-slop review.
---

# Design QA — bramka jakości

Run this before marking any section (and the whole page) as done. Do not skip steps; report results honestly.

## 1. Build & console

```bash
npm run build && npm run lint
```

Zero errors, zero TS/ESLint warnings. Dev console clean (no hydration mismatches, no GSAP/ScrollTrigger warnings).

## 2. Screenshots (look at your own work)

Use Playwright to capture and REVIEW (open and actually look at the images):

```bash
npx playwright screenshot --viewport-size=1440,900 http://localhost:3000 shots/desktop.png --full-page
npx playwright screenshot --viewport-size=390,844 http://localhost:3000 shots/mobile.png --full-page
```

(If Playwright unavailable: `npx playwright install chromium` first.)

Review checklist on the screenshots:
- Spacing rhythm consistent (section padding from tokens, no random gaps)
- Nothing overflows horizontally on mobile; headings wrap without orphans
- Zoom-out test: thumbnail of full page has visual rhythm (varied section shapes, not identical slabs)
- Numbers/prices render in mono; Polish diacritics render (ą, ę, ł, ż — if boxes/fallback font appear, the `latin-ext` subset is missing)

## 3. Tokens & consistency audit

```bash
grep -rn "#[0-9a-fA-F]\{3,8\}" app components --include="*.tsx" | grep -v "tokens"
```

Expected: no hardcoded hexes. Also verify: only token radii used, one accent color, borders are hairline tokens.

## 4. Motion audit

- DevTools → Rendering → emulate `prefers-reduced-motion` → reload: all content visible, nothing animates, counters show final values.
- Fast scroll top→bottom→top: no flashes, no elements stuck hidden, pinned section releases correctly.
- Disable JS (DevTools) → reload: full content visible and readable.
- Mobile viewport: no pinned sections, no horizontal scroll.

## 5. A11y quick pass

- Tab through the page: visible focus ring on every interactive element, logical order, skip link works.
- One `<h1>`; heading levels don't skip; accordion/menu have correct aria-expanded.
- Contrast spot-check (text-secondary on bg-card, muted labels): ≥ 4.5:1 body, ≥ 3:1 large text.

## 6. Copy fidelity & anti-slop

- Diff rendered text against `content/copy-pl.md` — verbatim match (allowing typographic post-processing from pl-typography skill).
- Walk `design/anti-slop.md` ZAKAZANE list — zero hits.
- `PLACEHOLDERS.md` lists every remaining `[placeholder]` with file/line.

## 7. Performance (final pass only)

Lighthouse (mobile + desktop) against `content/seo.md` targets: Perf ≥ 90, SEO 100, A11y 100, BP 100. LCP element = hero H1 (not an image). No layout shift from font swap (`display: swap` + matched fallback metrics).

## Report format

After the run, output a short table: check → pass/fail → fix applied. Fails without fixes = section is NOT done.
