"use client";

import { useRef } from "react";
import { gsap, useGSAP, NO_REDUCE } from "@/lib/motion";
import { fmtIntPl } from "@/lib/typography";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** formatowanie pl-PL z separatorem tysięcy (spacja nierozdzielająca) */
  format?: boolean;
};

/** Licznik v2 (motion-craft „Kalibracja scrubów"): wartość BINDOWANA do progresu
 *  scrollu (scrub .8, okno top 85%→55%) + twardy snap do wartości końcowej po
 *  opuszczeniu okna — żadnych wartości pośrednich po wyjściu, żadnego timera.
 *  Prefiks/sufiks w OSOBNYCH spanach (koniec z „−6+58" przy sklejaniu).
 *  SSR/no-JS/reduced-motion: od razu wartość końcowa. */
export function Counter({ value, prefix = "", suffix = "", className = "", format = true }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => (format ? fmtIntPl(Math.round(n)) : String(Math.round(n)));

  useGSAP(
    () => {
      const el = numRef.current;
      const trigger = ref.current;
      if (!el || !trigger) return;
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const obj = { v: 0 };
        const render = () => {
          el.textContent = fmt(obj.v);
        };
        gsap.fromTo(
          obj,
          { v: 0 },
          {
            v: value,
            ease: "none",
            onUpdate: render,
            scrollTrigger: {
              trigger,
              start: "top 85%",
              end: "top 55%",
              scrub: 0.8,
              invalidateOnRefresh: true,
              // twardy snap: poza oknem NIGDY nie zostaje wartość pośrednia
              onLeave: () => {
                obj.v = value;
                render();
              },
              onLeaveBack: () => {
                obj.v = 0;
                render();
              },
            },
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <span ref={ref} data-counter data-final={fmt(value)} className={`num ${className}`}>
      {prefix && <span>{prefix}</span>}
      <span ref={numRef} data-counter-num>{fmt(value)}</span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
