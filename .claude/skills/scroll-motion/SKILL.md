---
name: scroll-motion
description: GSAP + ScrollTrigger + Lenis patterns for the HackMySales landing (Next.js App Router). Use whenever implementing scroll animations, pinned sections, counters, marquees, or the hero chat timeline.
---

# Scroll motion — implementation patterns

Spec lives in `design/motion.md` (what/when). This skill is the HOW. Full choreography values (durations, eases, distances) come from the spec — patterns below show correct wiring.

## Setup (once)

```bash
npm i gsap @gsap/react lenis
```

`components/motion/SmoothScroll.tsx` — client component mounted in `app/layout.tsx`:

```tsx
"use client";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenis = useLenis(ScrollTrigger.update);
  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
    return () => ScrollTrigger.killAll();
  }, []);
  return <ReactLenis root options={{ lerp: 0.1 }}>{children}</ReactLenis>;
}
```

## Golden rules

1. Every animation lives inside `useGSAP(() => {...}, { scope: containerRef })` — automatic cleanup on unmount (React StrictMode safe).
2. Wrap EVERYTHING in `gsap.matchMedia()` with three contexts: desktop `(min-width: 768px) and (prefers-reduced-motion: no-preference)`, mobile `(max-width: 767px) and (prefers-reduced-motion: no-preference)`, and `(prefers-reduced-motion: reduce)` → `gsap.set(targets, { clearProps: "all" })`, no triggers.
3. Hidden-before-reveal via CSS class toggled by JS presence (`<html class="js">` set in inline script), e.g. `.js .js-reveal { opacity: 0; }` — content visible without JS.
4. `once: true` on reveals. No scrub except: problem-kicker text, pillar progress, parallax glow.

## Pattern: section reveal

```tsx
useGSAP(() => {
  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    gsap.from(ref.current!.querySelectorAll(".js-reveal"), {
      y: 32, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
    });
  });
  mm.add("(prefers-reduced-motion: reduce)", () => {
    gsap.set(ref.current!.querySelectorAll(".js-reveal"), { clearProps: "all" });
  });
}, { scope: ref });
```

## Pattern: pinned pillars (desktop only)

```tsx
mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: ref.current, pin: true, start: "top top", end: "+=250%", scrub: 0.6 },
  });
  panels.forEach((p, i) => {
    if (i === 0) return;
    tl.to(panels[i - 1], { autoAlpha: 0, y: -16, duration: 0.4 })
      .fromTo(p, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.1")
      .to(indicator, { yPercent: 100 * i, duration: 0.4 }, "<");
  });
});
```

Mobile fallback: plain stacked blocks, standard reveal pattern.

## Pattern: counter (PL number formatting)

```tsx
const fmt = new Intl.NumberFormat("pl-PL"); // 47 218 — non-breaking spaces
gsap.fromTo(obj, { v: 0 }, {
  v: target, duration: 1.2, ease: "power2.out",
  onUpdate: () => { el.textContent = fmt.format(Math.round(obj.v)); },
  scrollTrigger: { trigger: el, start: "top 75%", once: true },
});
```

Reduced motion: set `el.textContent = fmt.format(target)` immediately.

## Pattern: hero chat timeline

Build one `gsap.timeline({ paused: true })`; play when hero enters viewport (`once`). Steps per message: show typing dots (`autoAlpha 1`, pulse via `repeat: -1, yoyo` child tween) → hold 0.6–0.9s → kill pulse, hide dots → message `fromTo {y:16, autoAlpha:0, scale:0.97}` → `{y:0, autoAlpha:1, scale:1, duration:0.45, ease:"back.out(1.4)"}` → hold proportional to text length (`Math.min(2.2, chars * 0.03)`). Expose `restart()` for the replay button. Scroll chat container via `scrollTo` tween on each message. Reduced motion: render full conversation statically, no timeline.

## Pattern: marquee (Radar ticker)

CSS-only: duplicate track content, `@keyframes marquee { to { transform: translateX(-50%) } }`, ~40s linear infinite, `:hover { animation-play-state: paused }`, `@media (prefers-reduced-motion: reduce) { animation: none }` + static list. No JS needed.

## Verify (after every animated section)

Fast-scroll test (no jank/flash), reduced-motion ON in DevTools (everything visible, nothing moves), mobile viewport (no pins), console clean of ScrollTrigger warnings.
