# HackMySales — Landing Page

Marketing landing for HackMySales: AI chat + search + recommendations for e-commerce stores (product by Time4Ecommerce, Polish market). Dark, restrained, Apple-level craft. The customer portal (dark UI, blue #3D5BFC) is the visual sibling of this page.

**STATUS: the page IS BUILT** (16 sections, axe-core clean, Lighthouse A11y/BP/SEO 100, git history on `main`). Do NOT re-scaffold or rewrite working sections. Current work = the backlog in `PROMPT.md`. Spec-first workflow: copy/features specs get updated BEFORE code.

## Read before writing any code

1. `PROMPT.md` — current backlog and working rules (the original build brief is fulfilled)
2. `design/tokens.css` — design tokens (single source of truth for color/type/spacing)
3. `design/brand.md` — logo, typography, voice
4. `design/motion.md` — animation spec (GSAP choreography per section)
5. `design/anti-slop.md` — quality gate, checked before completing every section
6. `content/copy-pl.md` — ALL copy, verbatim
7. `content/features.md` — interactive landing elements L1–L14
8. `content/seo.md` — meta, JSON-LD, performance targets

## Stack

Next.js 15 (App Router, TypeScript, static output) · Tailwind CSS v4 · GSAP + @gsap/react + ScrollTrigger · Lenis (smooth scroll) · lucide-react (icons) · next/font/google.

Commands: `npm run dev` · `npm run build` · `npm run lint`. Build must pass after every section.

## Hard rules

- **Copy:** only from `content/copy-pl.md`, verbatim. Never write your own Polish marketing copy. All strings live in `content/pl.ts` dictionary (typed), components consume the dictionary — ready for future EN locale. Mockup mode: UI renders demo numbers WITHOUT brackets; `PLACEHOLDERS.md` is the registry of values to swap before production (deck keeps brackets as editorial marks).
- **Color/spacing/type:** only via tokens from `design/tokens.css` (map them into Tailwind theme). Zero hardcoded hex values in components. One accent color (blue). No purple/pink gradients, ever.
- **Fonts:** self-hosted via `@fontsource-variable` packages (Schibsted Grotesk display, Inter body, JetBrains Mono numbers/labels) — deterministic, GDPR-friendly, includes latin-ext. Do NOT switch to next/font/google. All numbers/KPI/prices render in mono; use `fmtIntPl` for thousands grouping (groups 4-digit numbers too, per copy deck style).
- **Motion:** follow `design/motion.md` exactly. `useGSAP` hook for cleanup. `prefers-reduced-motion` support is mandatory, not optional. Animate only transform/opacity. Content must be fully visible without JS.
- **Polish typography:** apply `.claude/skills/pl-typography` to every rendered string (non-breaking spaces after single-letter words, proper quotes „”, nbsp before zł/units).
- **A11y:** semantic landmarks, one h1, focus-visible rings on everything interactive, skip link, aria for accordion/mobile menu, contrast ≥ 4.5:1 for text.
- **Honesty:** no fake testimonials, no invented client logos, no fabricated ratings. Placeholder sections stay hidden or clearly marked.
- **No stock assets:** all visuals are live HTML/CSS product UI (chat window, revenue panel) built from tokens. No PNG mockups, no 3D illustrations, no emoji.

## Definition of done (per section and final)

Run `.claude/skills/design-qa` checklist: build passes, section matches copy deck, anti-slop gate clean, reduced-motion works, mobile layout works (<768px: no pinning, simple reveals), Lighthouse targets from `content/seo.md`.

## Repo layout

`design/` + `content/` + `assets/` are the spec (do not edit unless asked — they are the client's source of truth). App code: standard Next.js at repo root (`app/`, `components/`, `lib/`). Landing sections as separate components: `components/sections/Hero.tsx`, `Problem.tsx`, `Pillars.tsx`, `GoldMines.tsx`, `HowItWorks.tsx`, `Results.tsx`, `Integrations.tsx`, `Trust.tsx`, `Pricing.tsx`, `Faq.tsx`, `FinalCta.tsx`, `Footer.tsx`.
