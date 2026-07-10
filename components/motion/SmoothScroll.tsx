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
      lenis.scrollTo(el, { offset: -88 });
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
