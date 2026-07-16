# HackMySales — project memory

## What this is
Polish marketing site for "Magda" — an AI sales advisor for e-commerce.
Next.js 15 (App Router) + React 19 + Tailwind v4 (tokens in CSS @theme). GSAP + ScrollTrigger + Lenis for motion.
All UI copy in Polish. Design direction (od 2026-07-16, kolorystyka właściciela):
biel / chłodna biel + firmowy niebieski (#2858F0) + granatowe pasma. Full spec lives
in PLAN.md and design/CHECKLIST.md — read both before touching UI.

## Hard rules
- Never proceed past a STOP-GATE without an explicit "GO" from the user.
- Never claim visual work is done without Playwright screenshots (npm run shoot)
  read and critiqued against design/CHECKLIST.md.
- Tokens only: no hardcoded hex/px in components; use @theme variables and the
  8/12/20/28 radius scale, 8pt spacing.
- Akcent = firmowy niebieski (#2858F0): CTA + akcenty; oszczędnie, nie jako duże
  krzyczące tła na jasnym. Granat (#0B1533) na ciemne pasma.
- No purple/violet, no emoji, no lorem, no English UI strings, no Tailwind
  default shadows, no dot-grids, no 3D tilt, no custom cursor, no exclamation marks.
- Fraunces italic accent words: max 3 per page. Font weights 400/500/600 only.
- Every animation: transform/opacity only, respects prefers-reduced-motion,
  pauses off-screen. Max jeden moment orkiestrowany na etap podróży; Home ma
  dokładnie dwa: wejście (hero load) i sedno (Crescendo scroll-pin) — nigdy
  jednocześnie w viewporcie; reszta to reveals i mikro-momenty.
- Polish typography: „" quotes, nbsp after i/w/z/a/o/u and inside "300 zł".
- Atomic commits per section: feat(landing): <section> — <change>.
- When context gets heavy, re-read PLAN.md + design/AUDIT.md instead of guessing.

## Commands
- dev: npm run dev
- screenshots: npm run shoot  (full-page 390/768/1440 → design/shots/)
- lint/build must pass before any commit.
