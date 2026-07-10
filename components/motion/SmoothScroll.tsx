"use client";

import { ReactLenis, type LenisRef } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/** Lenis (smooth scroll) spięty z tickerem GSAP + obsługa kotwic z offsetem pod nav.
 *  prefers-reduced-motion → natywny scroll (Lenis wyłączony). */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (!lenis) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lenis.destroy();
      return;
    }

    lenis.on("scroll", ScrollTrigger.update);
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

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

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.1, autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
