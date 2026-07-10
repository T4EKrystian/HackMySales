"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const REDUCE = "(prefers-reduced-motion: reduce)";
export const NO_REDUCE = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/** Standardowy reveal sekcji (design/motion.md §3): elementy z klasą .js-reveal
 *  wjeżdżają y:32→0 ze staggerem, raz, przy top 78%. Reduced-motion: od razu widoczne. */
export function useReveal<T extends HTMLElement = HTMLElement>(stagger = 0.1) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const targets = el.querySelectorAll<HTMLElement>(".js-reveal");
      if (!targets.length) return;

      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        gsap.fromTo(
          targets,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger,
            // uwaga: NIE czyścimy opacity — CSS trzyma stan startowy 0 pod .js
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 78%", once: true },
          }
        );
      });
      mm.add(REDUCE, () => {
        gsap.set(targets, { clearProps: "all", opacity: 1 });
      });
    },
    { scope: ref }
  );

  return ref;
}

export { gsap, ScrollTrigger, useGSAP };
