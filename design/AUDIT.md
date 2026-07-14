# design/AUDIT.md — HackMySales redesign audit

**Phase 0 deliverable.** What the current site does, why it reads as derivative, and which
reference technique (recolored into our tokens) replaces it. Read alongside `design/CHECKLIST.md`,
`design/anti-slop.md`, and the approved plan.

## Baseline evidence (current "Apple iPhone-Air" build)

Captured `2026-07-14` from the static export (`npm run build && npm run serve:out` → :5343):

| Shot | Dimensions |
|---|---|
| `design/shots/home-1440.png` | 1440 × **31 828** px (~35 desktop viewports) |
| `design/shots/home-768.png` | 768-wide full page |
| `design/shots/home-390.png` | 390 × **20 925** px (**~24.8 mobile screens** — over the ≤22 gate) |
| `+ *-rm.png` | reduced-motion variants (deterministic) |

Honest read: this is **not a cheap template** — it is a bespoke, well-engineered build. But its
*visual language* is **Apple-derivative light SaaS** (cool-grey `#F5F5F7`, single Apple-blue
`#0071E3`, Geist, stacked white dashboard cards, one near-black band). A designer seeing it would
say "looks Apple-inspired," not "who made this?" → **fails CHECKLIST #1 (reads as a known aesthetic)
and #20 (no ownable signature)**. The transformation gives it owned character: warm paper editorial
+ deep forest + one acid accent + Fraunces voice.

---

## A. Reference techniques to steal (recolored into our tokens)

Steal *techniques*, never layouts; the result must not trace to any single ref. Refs live in
`design/refs/ref-1…5.webp`.

- **ref-1 (Volt / fintech, light):** ① real-DOM dashboard on the page in light browser chrome
  (bar charts, stat tiles, circular progress) → **S5 Showcase**. ② tonal emphasis on one headline
  word (they use blue → **Fraunces italic** for us). ③ monochrome even-sized logo row, no boxes → S2.
  *Reject:* the 🚀 emoji, centered-stack monotony, real famous logos.
- **ref-2 (Paydo / banking):** the palette-discipline north star. ① warm bone paper + subtle paper
  texture + **one deep-forest full-bleed band** → validates our exact paper/forest polarity. ② the
  **single dark card among light ones** (10X/18%/10% row) → **S8 Growth card** + S4 bento accent.
  ③ oversized left-aligned headline, huge whitespace. Confirms paper+forest+lime is proven premium.
- **ref-3 (Euphoria / cross-border):** ① **dark hero + fine grid texture + radial glow** → the
  forest-hero option at STOP-GATE 2. ② chips **orbiting a central artifact at parallax depths** →
  **S1 floating stat chips**. ③ stat with a single unit tinted ("768**K**") → **S6 acid digit**.
  ④ *invented* typographic logos → the correct model for our fictional **S2 logo wall**.
- **ref-4 (Airtab):** ① one **acid CTA** popping, used sparingly → "acid ≤ 2× / viewport". ② **thin-
  line hairline FAQ accordion** with chevrons, no boxes → **S9**. ③ big-serif editorial testimonial
  + grayscale portrait → **S7**. ④ browser-chrome product frames → S5. *Reject:* the blue hero, the
  real famous logos (aws/Walmart/HBO/TIME).
- **ref-5 (Basecom):** **composition + type scale only** (palette is banned purple). ① hero-scale
  headline, tight leading. ② **ultra-fine flowing-line texture** on dark (→ `--line-dark` on forest)
  → hero + S10. ③ **stats anchored in the hero's bottom edge**. ④ masked-edge marquee.
  *Reject:* the entire purple/black palette, the glassmorphism card.

---

## B. Generic / derivative patterns → replacement

| # | Current pattern | Why it reads as derivative | Replacement (ref → our tokens) | CHECKLIST |
|---|---|---|---|---|
| 1 | Cool-grey `#F5F5F7` + white cards canvas | The default Apple/AI-SaaS light look; not ownable | **Warm paper** `#F7F5EF` / `#EFEBE0` base; ink `#101613` (ref-2) | #1 #20 |
| 2 | Apple-blue `#0071E3` as the single accent | "AI SaaS blue"; on the banlist | **Acid** `#D6F94B`, ≤2×/viewport, never body text on paper (ref-4) | #2 |
| 3 | Geist sans everywhere, no display voice | No typographic character; template-neutral | **Fraunces** italic accent words + **General Sans** body; weights 400/500/600 (ref-1/5) | #3 #8 |
| 4 | ~25 mobile screens, uniform vertical rhythm | Length + sameness reads as generated | **Hybrid spine** consolidation; `clamp(6rem,10vw,10.5rem)` rhythm; cut Comparison/ForWho/Integrations/TeamNote | #4 #5 |
| 5 | Near-black night band (Apple dark) | Flat dark, no material | **Forest-950** bands + noise + hairlines, never flat (ref-2/3) | #18 |
| 6 | Stacked white dashboard/card blocks, mostly centered | Card-grid monotony; adjacent sameness | Asymmetric **bento** with live micro-vignettes (S4) + **sticky-split showcase** (S5), 55/45 splits (ref-1/2) | #4 |
| 7 | Boxed cards separated by fills/shadows | Boxy, SaaS-kit feel | **1px `--line` hairlines** + tint; one elevated-shadow token for floating artifacts only (ref-2/4) | #7 |
| 8 | WebGL particle core / ambient field | Generic "AI particles"; perf cost; banlisted stock-3D vibe | **Remove three.js**; hero **fine line-grid + radial warm glow** (ref-3/5) | #16 |
| 9 | Blue-gradient hero glow / text gradient | Gradient cliché | Only 2 gradients allowed: hero warm radial, forest 950→900 | #1 |
| 10 | Social proof as ticker + control panel; no human quote | Missing the editorial testimonial beat | **S7** one big Fraunces quote + grayscale portrait + progress dashes (ref-4) | #4 |
| 11 | Custom cursor + global film grain | Banlisted cursor; grain everywhere | Remove custom cursor; scope noise to **forest bands only** | #16 |

---

## C. Keep (already good — do not rebuild)

- **`design/anti-slop.md`** already bans purple/aurora gradients, pure white, glassmorphism-on-
  everything, emoji, identical bordered rows, fake testimonials, lorem → ~80% of the brief's banlist
  is enforced. Extend, don't replace.
- **Chat engine** `components/chat/*` — scripted, deterministic (no `Math.random`), typing physics,
  in-bubble product card, Magda persona. Reuse; recolor to paper/forest/acid (**S1**).
- **Counters** `components/ui/Counter.tsx` (final-invariant) + `RollingNumber.tsx` (odometer). Reuse.
- **Motion engine** `lib/motion.ts` (GSAP + ScrollTrigger + SplitText + Flip + `useReveal`,
  `attachMagnet`, `REDUCE`) + Lenis `SmoothScroll.tsx`. Reuse.
- **Copy decks** `content/pl.ts` + `content/demo-data.ts` — truthful, numbered, PL. Keep skeleton.
- **QA harness** — 8 Playwright projects + visual baselines (re-baseline after re-skin), `check:numbers`,
  `check:photos`, Lighthouse. Reuse as the gate.
- **Logo** `components/ui/Logo.tsx` — bespoke, bake-off winner. Keep; recolor blue→ink/acid.
- **Strict token discipline** — only 6 neutral hex literals in components; migrate at the token layer.

---

## D. Net transformation

From a **well-built but Apple-derivative light SaaS** → an **ownable warm-paper editorial** landing:
paper/ink canvas 85% of every viewport, deep-forest bands as tentpoles (stats, Growth card, final
CTA, the night moment), one acid accent used with discipline, a Fraunces italic voice, hairline
separation instead of boxes, real-DOM dashboards instead of particles, and a consolidated spine that
drops the page under the mobile length gate. Infrastructure (chat, motion, counters, QA, copy) is
reused; only the visual language is rebuilt.
