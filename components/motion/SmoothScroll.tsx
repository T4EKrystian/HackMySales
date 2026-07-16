"use client";

import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Musi być dzieckiem ReactLenis (kontekst). Spina Lenis ze ScrollTriggerem,
 *  obsługuje kotwice i wyłącza smooth przy prefers-reduced-motion.
 *  Lenis jeździ na własnym rAF (autoRaf, domyślne) — zero zależności od tickera GSAP. */
function LenisBridge() {
  const lenis = useLenis(ScrollTrigger.update);

  // Higiena pinów (motion-craft): fonty doładowują się PO inicjalizacji triggerów
  // i zmieniają wysokości sekcji → stale pin-spacery = martwy scroll za footerem.
  // refresh() to długi task — odpalamy w idle, żeby nie lądował w oknie TBT.
  useEffect(() => {
    let idle: number | undefined;
    let t: number | undefined;
    document.fonts.ready.then(() => {
      const run = () => ScrollTrigger.refresh();
      if (typeof window.requestIdleCallback === "function") {
        idle = window.requestIdleCallback(run, { timeout: 3000 });
      } else {
        t = window.setTimeout(run, 300);
      }
    });
    return () => {
      if (idle !== undefined) window.cancelIdleCallback(idle);
      window.clearTimeout(t);
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis.destroy(); // natywny scroll; kotwice łapie scroll-margin-top z CSS
      return;
    }

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const el = document.querySelector<HTMLElement>(id);
      if (!el) return;
      e.preventDefault();
      // kotwice: dłuższy, wyciszony dojazd (expo-out) zamiast szarpnięcia lerpem
      lenis.scrollTo(el, { offset: -88, duration: 1.0, easing: (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x)) });
      history.pushState(null, "", id);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [lenis]);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1 }}>
      <LenisBridge />
      {children}
    </ReactLenis>
  );
}
