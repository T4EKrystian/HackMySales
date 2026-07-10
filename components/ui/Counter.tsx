"use client";

import { useRef } from "react";
import { gsap, useGSAP, NO_REDUCE } from "@/lib/motion";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** formatowanie pl-PL z separatorem tysięcy (spacja nierozdzielająca) */
  format?: boolean;
  duration?: number;
};

import { fmtIntPl } from "@/lib/typography";

/** Licznik scrollowy (design/motion.md §5). SSR renderuje wartość końcową
 *  (SEO/no-JS); animacja startuje od 0 dopiero przy wejściu w viewport. */
export function Counter({ value, prefix = "", suffix = "", className = "", format = true, duration = 1.2 }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const text = (n: number) => `${prefix}${format ? fmtIntPl(n) : Math.round(n)}${suffix}`;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const obj = { v: 0 };
        gsap.fromTo(
          obj,
          { v: 0 },
          {
            v: value,
            duration,
            ease: "power2.out",
            onStart: () => { el.textContent = text(0); },
            onUpdate: () => { el.textContent = text(obj.v); },
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} className={`num ${className}`}>
      {text(value)}
    </span>
  );
}
