# HackMySales — project memory

## What this is
Polish marketing site for "Magda" — an AI sales advisor for e-commerce.
React 19 + Vite + Tailwind v4 (tokens in CSS @theme). GSAP + ScrollTrigger for motion.
All UI copy in Polish. Design direction: warm paper editorial + deep forest bands +
one acid accent. Full spec lives in PLAN.md and design/CHECKLIST.md — read both
before touching UI.

## Hard rules
- Never proceed past a STOP-GATE without an explicit "GO" from the user.
- Never claim visual work is done without Playwright screenshots (npm run shoot)
  read and critiqued against design/CHECKLIST.md.
- Tokens only: no hardcoded hex/px in components; use @theme variables and the
  12/20/28 radius scale, 8pt spacing.
- Acid (#D6F94B) max twice per viewport on paper; never as small text on paper.
- No purple/blue/indigo, no emoji, no lorem, no English UI strings, no Tailwind
  default shadows, no dot-grids, no 3D tilt, no custom cursor, no exclamation marks.
- Fraunces italic accent words: max 3 per page. Font weights 400/500/600 only.
- Every animation: transform/opacity only, respects prefers-reduced-motion,
  pauses off-screen. One orchestrated moment per page (Home = hero load).
- Polish typography: „" quotes, nbsp after i/w/z/a/o/u and inside "300 zł".
- Atomic commits per section: feat(landing): <section> — <change>.
- When context gets heavy, re-read PLAN.md + design/AUDIT.md instead of guessing.

## Commands
- dev: npm run dev
- screenshots: npm run shoot  (full-page 390/768/1440 → design/shots/)
- lint/build must pass before any commit.
