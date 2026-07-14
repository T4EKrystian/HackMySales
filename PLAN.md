# PLAN.md — HackMySales redesign (Paper / Forest / Acid)

The full spec `CLAUDE.md` points to. Read with `design/CHECKLIST.md` (21-item QA gate),
`design/AUDIT.md` (what we're replacing and why), and `design/anti-slop.md`.
Revised once after a tri-role critique (art director · performance engineer · conversion
strategist) — see **Self-critique & critique log** at the end.

Direction in five words: **editorial, assured, warm-technical, expensive, quiet.**
We flip the category: every AI-SaaS competitor is dark or Apple-blue-light. We are a **warm paper
editorial base** with **deep-forest bands** and **one acid accent** — matched to Magda, a human
persona, not a robot. Steal techniques from `design/refs/`, never layouts.

## Signature device (the ownership anchor)

The critique's sharpest point: assembling every borrowed move (paper hero + forest full-bleed +
single-dark-card + orbiting chips + acid-tinted digit + DOM dashboard) reverse-engineers the page
back to ref-2 (Paydo) + ref-3 (Euphoria) — the fintech cliché. We defeat that with **one structural
device that appears in none of the refs**, and it doubles as our most ownable asset:

**Magda authors the page.** Not a chat widget bolted into a hero — a first-person voice threaded
through the scroll:
- A persistent **editorial left margin** carrying section folios in mono numerals + short
  hand-signed Magda annotations beside the dashboards ("to ja odpowiedziałam o 2:14").
- Her voice at **display scale in Fraunces** at the manifesto (S3) and one mid-page crescendo.
- Reply fragments as connective tissue between sections; a recurring signature glyph.
- **Acid = Magda's highlighter** — its primary paper expression is a hand-drawn underline / marker
  swipe, not a fill button (a placement no ref owns). Fill-acid is reserved for forest surfaces.

This is where design budget goes — not a sixth bento vignette. It is what makes a five-second read
land on "who made this?" rather than "polished forest/lime fintech landing" (CHECKLIST #1, #20).

## Locked decisions

1. **Hybrid spine** — brief's structure as skeleton; fold the best existing interactions in.
   Post-critique: **fold, don't delete** the conversion-critical sources (Comparison→pricing lead-in,
   ForWho→bento vignette, Integrations→platform wall + pre-pricing finder). Only TeamNote is cut.
2. **Single page + anchors** — no new routes; "subpages" become in-page hero-moments.
3. **Keep + recolor the logo** (`components/ui/Logo.tsx`), Apple-blue → ink/acid.
   **Hero polarity = PAPER** (locked at STOP-GATE 2). Forest stays scarce (stats/Growth/CTA/night).
4. Per the brief: blue retired; **next/font/local** Fraunces + General Sans (retire Geist);
   **keep a mono for numerals** (the anti-slop signature — reversed from v1); remove three.js/GL;
   drop `[data-theme=dark]` toggle; remove custom cursor; noise scoped to forest only.

## Design tokens — the sheet

Source of truth `design/tokens.css` (`:root`); Tailwind utilities remapped in `app/globals.css`
`@theme inline` so existing classes flip color with minimal markup churn.

```
--paper:      #F7F5EF;   --paper-deep: #EFEBE0;
--ink:        #101613;   --ink-soft:   #3D4640;   --ink-mute: #6B756E;
--forest-950: #0A1F16;   --forest-900: #0E2A1E;   --forest-700: #1C4632;
--sage-200:   #D8DFD3;
--acid:       #D6F94B;   --acid-press: #C4EB35;
--line:       rgb(16 22 19 / .10);        --line-dark: rgb(247 245 239 / .12);
--shadow-float: 0 1px 2px rgb(16 22 19/.06), 0 12px 32px -12px rgb(16 22 19/.18);
```

Utility remap: `bg-page`→paper, alt→paper-deep · `text-ink`→ink, `text-sub`→ink-soft,
`text-mute`→ink-mute · forest surfaces `bg-forest-950/900` · `border-hairline`→line/line-dark.
Remove the dark-theme block.

Rules of engagement (enforced at every gate):
- 85% of any viewport is paper/ink. **Acid ≤ 2× per viewport** on paper (as the highlighter mark +
  one CTA), **never body text on paper**. On forest it may be large display / fill.
- **Full-bleed forest is a tentpole — used sparingly.** ONE climactic full-bleed band (the Stats/ROI
  or night moment). Other "forest" beats are expressed lighter (a forest rule, a forest numeral, the
  single Growth card) so the tentpole keeps its weight.
- Only two gradients: hero warm radial (paper-deep→transparent) and forest 950→900. No purple/blue.
- Separation = **1px `--line` + tint**, not drop shadows. `--shadow-float` for floating artifacts only.
- Radius **12** (buttons/inputs) / **20** (cards) / **28** (large artifacts). Never mixed per component.
- Section padding `clamp(6rem, 10vw, 10.5rem)`; 8pt grid; container 1240px; full-bleed bands share
  the same inner container.

## Typography

**Load via `next/font/local`** (not @fontsource + @font-face + the postbuild regex, which cannot
match Fraunces/italic/General-Sans and leaves the body font unpreloaded). `next/font/local` auto-
emits `<link rel=preload>` for the exact files, self-hosts under `_next/static/media`, scopes
subsets, and generates a **metric-matched fallback (`adjustFontFallback`) → protects the CLS budget**
on the clamp() hero headline.

- **Display serif — Fraunces:** ship a **static-instanced** cut (fonttools `varLib.instancer` pin
  opsz/SOFT/WONK + one wght; include the **italic** instance for the hero word), then `pyftsubset`
  to **latin-ext** (~15–25 kB, vs ~100 kB for the full variable file). Roles: structural — section
  folios, a drop-cap manifesto opener, the S6 pull-quote at true display scale, Magda's first-person
  lines. **Italic word-painting used exactly once (hero); max 3 serif-italic / page** (#3).
- **Sans — General Sans:** Fontshare woff2 → subset to latin-ext (`pyftsubset`), loaded via
  next/font/local. Fallback the installed Schibsted Grotesk. Weights **400/500/600 only**.
- **Mono numerals — the signature (kept):** JetBrains Mono for stats / prices / KPIs / folios only
  (`anti-slop.md §WYMAGANE`). Not LCP-critical (below fold, count-up) → existing @fontsource import is
  fine. Body/UI numbers stay sans `tabular-nums`.
- Retire the Geist import in `app/layout.tsx`.

Scale tokens (`--text-*`): hero `clamp(3.2rem,7.2vw,6.8rem)` lh .98 ls -.035em · h2
`clamp(2.1rem,4.4vw,3.6rem)` · h3 `clamp(1.35rem,2vw,1.7rem)` · body 1.0625–1.125rem lh 1.65 max 62ch ·
caption .8125rem ls +.06em uppercase ink-mute · stat `clamp(3.5rem,8vw,7rem)` mono, tabular-nums.

Verify `ą ę ś ż ź ó ł ć ń ĄĘŚŻŹÓŁĆŃ` in **both** families at display + body sizes in the style-tile
shot (CHECKLIST #10).

## Motion system + inventory

Reuse Lenis (`SmoothScroll.tsx`) + `lib/motion.ts`, but **trim `lib/motion.ts` to
`registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP)`** — delete the unused Club plugins
(ScrambleText, DrawSVG, MotionPath ≈40 kB, and licensed) that currently ship in the shared chunk.
Tokens: durations 0.5/0.8/1.1s; ease power3.out (reveals), expo.out (hero + counters),
back.out(1.4) (chips only); stagger 0.07; default reveal y24→0 + opacity, cards add clip-path inset.

**Two orchestrated moments** (not one): the hero load, and one **mid-page crescendo** — the forest
Stats/ROI band (or the night moment) staged as a real tonal shift (scale jump + a Magda line landing
at full Fraunces), not a 2×2 count-up. Everything else quiet. No section combines > 2 simultaneous
animation types. `will-change` on enter, removed after. All loops pause on hidden tab
(`visibilitychange`) + off-screen (IntersectionObserver).

**Chat-loop perf fix (`useChatPlayback`):** the `follow()` rAF currently reads
`getBoundingClientRect()` twice + conditional `scrollTo` every frame during the LCP/INP window. Gate
it to run only while the log overflows AND `pinned`; short-circuit the rAF when the timeline is
paused/off-screen; cache `body.getBoundingClientRect()` once per frame.

| Section | Motion |
|---|---|
| Hero (orchestrated ≤1.6s) | headline mask-reveal (SplitText y110%→0, 80ms stagger, expo.out) → subcopy/CTA fade-rise → artifact scale .96→1 → chips back.out(1.4). Chat loop reuses fixed `useChatPlayback`. |
| Manifesto | scrub word-fill (ink 15%→100% as block crosses vp); static < 768px if it janks |
| Showcase | sticky pin; dashboard crossfade + scale 1.02→1; degrade to stacked < 1024px |
| Stats/ROI (crescendo) | count-up (mono, expo.out 1.2s, snap) via `Counter`; Magda line at display scale; ROI odometer via `RollingNumber` |
| Control & Trust | tone toggle swaps preview ≤300ms; "Zmyślanie OFF" inert lock |
| Pricing | segmented toggle animated thumb; price 300ms morph (`RollingNumber`) |
| FAQ | height-auto reveal (grid-rows 0fr→1fr), +/- glyph rotate 45° |
| else | reveal at 70% vp, once. Interactions: magnetic CTA (desktop, strength .25 r90) + press .98; link underline draw 250ms; card lift 2px + border shift. No 3D tilt, cursor blobs, custom cursor. |

reduced-motion: reveals → instant opacity; chat → final frame; floats/magnetic/marquee off.

## Component architecture

- **Reuse (recolor):** `components/ui/{Counter,RollingNumber,Logo}.tsx`, `SmoothScroll.tsx`,
  `content/{pl,demo-data}.ts`, QA harness.
- **Magda as a system (not just recolor):** extend `components/chat/*` + add margin-annotation +
  signature-glyph primitives so her voice threads the page (see Signature device).
- **Rebuild/restructure:** `Nav`, `Hero`(+chat), `ProofTicker`→platform wall, `Problem`+`Manifest`
  →Manifesto, `Pillars`/`GoldMines`/`Channels`+`ForWho`→Bento, `MorningPanel`+`HowItWorks`→Showcase,
  `Trust`→Control&Trust, `Results`(ROI)+NightShift→Stats/ROI crescendo, `Comparison`→Pricing lead-in,
  `Integrations`(.finder)→pre-pricing control, `Pricing`, `Faq`, `FinalCta`, `Footer`.
- **Remove:** `components/gl/*`, `<GLStage/>` in `layout.tsx`, the 4 `useGLView` calls,
  `components/motion/Cursor.tsx`, unused GSAP plugins; deps `three`/`@react-three/*`/`maath`
  (verify gone with `depcheck` + bundle diff — note they were already `dynamic()`-split, so this is a
  transfer/idle-cost win, not a first-load-JS win); global `.grain`→forest-scoped.
- **Cut entirely:** `TeamNote`.
- **New primitives:** `SectionShell`, `Container`, `Eyebrow`, `Folio` (mono numeral), `AcidMark`
  (highlighter underline SVG), acid `CheckGlyph`, `NoiseOverlay` (forest), `HeroGridTexture`.

## Home spine (conversion order: proof before price, objection-clear before ask)

| # | id | Source | Layout & signature | Key AC |
|---|---|---|---|---|
| Nav | — | `Nav` | 64px slim; logo (kept, recolored); links + ghost "Zaloguj się" + acid CTA; transparent→paper/85 blur+hairline after 24px; mobile full-screen overlay | no CLS on state; focus-visible; overlay locks scroll; CTA verb = primary (below) |
| S1 Hero | `#top` | `Hero`+chat | asymmetric 55/45; serif-italic headline (the ONE word-paint); **primary CTA "Wypróbuj za darmo · bez karty"**, secondary text-link "Zobacz demo · 2 min"; middle-dot trust row (no chips); live chat artifact (28px radius, forest header, in-bubble product card); 3 orbiting stat chips; hero grid texture + radial glow | **headline is LCP — proven via Lighthouse trace, not asserted**; chat images width/height-capped, `loading=lazy decoding=async`, not preloaded, below mobile fold; reduced = final frame; usable at 390px |
| S2 Platform-fit + credibility | — | `ProofTicker`+`Integrations` | **REAL platform wordmarks** (Shoper/IdoSell/PrestaShop/WooCommerce/Shopify/Magento — mono, nominative, allowed by anti-slop) + caption "Time4Ecommerce — w e-commerce od 2017, ponad 40 sklepów" | mono only, no boxes, equal optical size; NO invented logos |
| S3 Manifesto | — | `Problem`+`Manifest` | paper-deep, left-aligned, h2+; Fraunces drop-cap; scrub word-fill; **Magda first-person line**; source footnote | reversible scrub; readable mid-anim; static < 768px if janks |
| S4 Bento (+ForWho fold) | `#funkcje` | `Pillars`/`GoldMines`/`Channels`+`ForWho` | asymmetric bento **3–4 weighted cells** (not 6); every cell a live micro-vignette; **ForWho folded as a segmented-tab vignette** (Moda/Dom/Elektronika/B2B → one live example + its quantified chip: −30% zwrotów, +38% koszyka) | no dead cells; vignettes CSS/SVG; readable without hover; holds at 768px |
| S5 Showcase | `#produkt` | `MorningPanel`+`HowItWorks` | sticky split; 3 step blocks (active ink / inactive 35%); **browser-chrome DOM dashboards** + Magda margin annotations | pin ≥700px; degrade stacked < 1024px; no scroll hijack; realistic PL data |
| S6 Control & Trust | — | `Trust` | the **security/anti-hallucination objection block** folded truthfully: tone toggle + "Zmyślanie OFF — zablokowane" + RODO/hosting-UE badge + live answer preview; ONE Fraunces **product-truth** pull-quote ("Odpowiada wyłącznie na podstawie Twojego katalogu") — **NOT a fabricated customer quote** | no invented testimonials/stars; toggle ≤300ms; lock inert (aria-disabled); objection-clear before price |
| S7 Stats + ROI (crescendo) | `#wyniki` | `Results`/ROI + NightShift | **the one full-bleed forest band** + noise; 4 stats (mono, one acid digit each); a Magda line at display scale; **ROI calculator is the LAST beat before pricing** (cost tick = plan Growth; "zwraca się X razy") | counts fire once; acid ≤1/stat; calc precedes Pricing; AA footnote |
| S8 Pricing (+Comparison lead-in) | `#cennik` | `Pricing`+`Comparison` | **Comparison 6-row hairline strip** ("czatbot z FAQ ≠ handlowiec") as the lead-in; 3 cards, Growth = single forest card + acid CTA; segmented billing toggle; hairline rows + acid `CheckGlyph`; `integrations.finder` one-liner ("Wpisz platformę → ~15 min / REST API") | anchor line "zwraca się z jednej uratowanej transakcji dziennie" above cards; **"nic nie wyłączamy" overage note**; per-plan limits (1 000 / 5 000 / bez limitu) visible; equal height; dark card AA; 300ms price morph |
| S9 FAQ | `#faq` | `Faq` | thin-line accordion (no boxes), +/- rotate; 2-col sticky intro left | full keyboard; aria-expanded; one open; no CLS |
| S10 CTA | `#demo` | `FinalCta` | forest full-bleed; hero grid texture in line-dark; two-line headline; **single primary CTA "Wypróbuj za darmo"** ≥56px; microcopy "Bez karty. Anulujesz jednym kliknięciem." | calm — ≤2 animated elements |
| S11 Footer | — | `Footer` | paper; 4 columns + newsletter (acid submit); giant `--sage-200` watermark wordmark cropped by edge | watermark aria-hidden; no horizontal scroll |

**CTA lock:** primary path = free trial, one verb everywhere — **"Wypróbuj za darmo" / "· bez karty"**
(aligns brief + deck). Secondary = **"Zobacz demo"** (watch, low commitment). "Umów wdrożenie" only
as a tertiary in-pricing option. Fix the current "Wypróbuj demo" vs deck "Umów demo" mismatch.

Subpage hero-moments (single-page): `#funkcje` (S4) opens with the tone-toggle vignette; `#cennik`
(S8) promoted with the comparison strip + finder; "jak działa" = the S5 showcase steps. Recomposition
only — no new tokens or animation types.

## Assets
Static-instanced + latin-ext-subset **Fraunces** (incl. italic) and **General Sans** woff2 in the
repo, loaded via `next/font/local` · JetBrains Mono (existing) for numerals · forest noise (SVG
turbulence / tiny tiling PNG, 2–3%) · **real platform wordmarks** (SVG) for S2 · product photos +
Magda avatar exist (`public/products/*.webp`, `public/team/magda.webp`) · OG image regen (placeholder).

## QA protocol
- `npm run shoot` (default :5343 static serve; `home` + `style-tile`; `--reduced` at gates). Loop per
  section: build → shoot 390/768/1440 → Read PNGs → critique vs `design/CHECKLIST.md` → fix → re-shoot.
  Min 2 rounds/section, **3 for Hero**. Then design-critic subagent on the shots.
- **CWV gate (new):** extend `scripts/qa-lighthouse.mjs` with numeric budgets, fail on breach —
  **LCP ≤ 2.0 s (mobile, throttled), CLS ≤ 0.05, TBT ≤ 200 ms, first-load JS ≤ 160 kB gz**, and assert
  the **LCP element node == the hero headline** (attach trace). Added as `design/CHECKLIST.md` **#21**.
- Gate suites: `qa:interactions qa:scroll:suite qa:mobile qa:console qa:perf`; re-baseline
  `qa:visual:baseline` after re-skin; `qa:all` green before STOP-GATE 5.
- Grep BANNED before each gate: emoji · lorem · English UI · purple/indigo/blue · Tailwind default
  shadows · dot-grid · checkmark chips · fake testimonials/star graphics · `!` in copy · weight ≥700.

## Build order & gates
PHASE 0 ✓ (shoot fix, baseline, AUDIT). PHASE 1 ✓ (PLAN.md + tri-role critique). **PHASE 2** tokens +
next/font fonts + trimmed motion + primitives + `/style-tile` (hero **paper vs forest side-by-side in
one shot**; diacritics line both families ×2 sizes) → **STOP-GATE 2**. PHASE 3 Home S1→Nav→S2→…→S11,
per-section QA, atomic commits → **3a after Hero, 3b after Home**. PHASE 4 subpage moments →
**STOP-GATE 4**. PHASE 5 motion/perf/a11y/PL-typo/reduced-motion + re-baseline + design-critic +
**CWV budgets green** → **STOP-GATE 5 = done**. Never pass a gate without explicit "GO".

## Risks & mitigations
- **Font LCP/CLS** → `next/font/local` (auto preload + `adjustFontFallback` size-adjust); static-instanced
  latin-ext-subset payloads; prove LCP element == headline in `qa:perf`.
- **three.js removal over-credited** → it's already `dynamic()`-split; measure first-load JS + TBT
  BEFORE removal; real mobile-79 contributors are Lenis + GSAP plugins + motion — budget those; gate
  on the numbers, don't narrate a false win.
- Fontshare blocked → fallback installed Schibsted Grotesk (flag at gate 2).
- Visual baselines invalidated → re-baseline is planned (Phase 5).
- Acid AA on paper → never body text on paper (enforced); primary paper use is the highlighter mark.
- Scope: fold-not-delete keeps conversion signals but risks re-bloat → folds are compact strips/
  vignettes (not full sections); consolidation keeps the page under the ≤22 mobile-screen gate.
- **Brief deviations to confirm at gates** (truth/conversion-driven): S2 real platform logos (not
  fictional client names), S6 truthful Control&Trust (not fabricated testimonials). Both align
  `anti-slop.md`; flagged for user veto before those sections build in Phase 3.

## Self-critique & critique log
v1 self-critique resolved 7 issues (LCP element, bento dead cells, section-count drift, pin
fragility, subpage routes, build ordering, acid overrun). v2 revision incorporated a tri-role critique:
- **Art director:** added the Magda-as-spine signature device + acid-as-highlighter; **kept mono
  numerals** (reversed the drop); reduced full-bleed forest to ONE tentpole; added a 2nd orchestrated
  crescendo; bento 6→3–4 cells; Fraunces given structural roles, italic word-paint used once.
- **Performance engineer:** switched fonts to `next/font/local` (preload + size-adjust fallback);
  static-instanced + subset Fraunces/General-Sans; trimmed `lib/motion.ts` plugins; fixed chat
  `follow()` layout thrash; reframed the three.js win; **added CWV numeric gate + CHECKLIST #21**.
- **Conversion strategist:** S7 fabricated testimonials → truthful **Control & Trust** (RODO / no-
  hallucination); **folded** Comparison (pricing lead-in), ForWho (bento vignette), Integrations
  (platform wall + finder) instead of cutting; S2 → real platform-fit + credibility wall; **locked one
  primary CTA verb** (free trial · bez karty) + surfaced the low-friction path; placed the ROI
  calculator as the last beat before pricing; added pricing anchor + overage + limits to S8 AC.
