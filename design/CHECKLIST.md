# Design QA Checklist — HackMySales

Run after EVERY section build, on screenshots from `npm run shoot`
(390 / 768 / 1440; before each STOP-GATE also `--reduced`).
Every item must PASS. A FAIL on item 1 or 20 means redesign, not patch.

1. **Template test** — could this section be mistaken for an existing SaaS
   template? If yes: FAIL, name the offending pattern.
2. **Acid budget** — acid (#D6F94B) appears max 2× per viewport on paper
   sections; never as small text on paper.
3. **Serif budget** — Fraunces italic accent words: max 3 occurrences on the page.
4. **Layout variety** — no two adjacent sections share the same layout skeleton.
5. **Rhythm** — section vertical padding uses the spacing scale only
   (clamp(6rem, 10vw, 10.5rem)); no rogue values.
6. **Radii** — every rounded element uses the 12 / 20 / 28 px scale.
7. **Hairlines** — separators are 1px, `--line` on paper / `--line-dark` on
   forest, consistent everywhere.
8. **Type scale** — no font sizes outside the defined tokens.
9. **Orphans/widows** — none in display text at any of the 3 breakpoints.
10. **Diacritics** — ą ę ś ż ź ó ł ć ń render correctly in BOTH families.
11. **Tabular numbers** — all stats and prices use tabular-nums.
12. **Copy** — real Polish everywhere; zero lorem, zero English leftovers.
13. **No emoji** — anywhere in UI or copy (custom SVG glyphs only).
14. **States** — every interactive element has hover + focus-visible + active.
15. **Contrast** — AA verified for every text/background pair in the section.
16. **Motion economy** — nothing animates that the eye doesn't need; loops
    pause off-screen and on hidden tab; reduced-motion variant verified.
17. **390px** — no horizontal scroll; hero artifact legible; tap targets ≥ 44px.
18. **Dark bands** — forest sections carry noise + hairlines, never flat fills.
19. **Evidence** — screenshot paths attached for every claim in the report.
20. **The screenshot test** — would a designer seeing only this screenshot ask
    "who made this?" If not: what exactly is missing — name it, fix it.
21. **Core Web Vitals** — LCP ≤ 2.0 s (mobile, throttled) AND the LCP element is
    the hero headline (named in the trace, not the chat artifact); CLS ≤ 0.05;
    TBT ≤ 200 ms; first-load JS ≤ 160 kB gz. Attach the Lighthouse trace as evidence.
