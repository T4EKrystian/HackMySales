"use client";

import { useRef } from "react";
import { gsap, useGSAP, NO_REDUCE, EASE } from "@/lib/motion";
import { fmtIntPl } from "@/lib/typography";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** formatowanie pl-PL z separatorem tysięcy (spacja nierozdzielająca) */
  format?: boolean;
  /** once (default): count-up 1,2 s raz przy wejściu — karty/statystyki
   *  (mid-scrub na screenshotach mylił audyt: „36 031 vs 47 218").
   *  scrub: wartość bindowana do scrolla + twardy snap — wyłącznie narracyjne piny. */
  mode?: "once" | "scrub";
};

/** Licznik v3 (V6-F2): tryb once domyślnie; scrub (motion-craft „Kalibracja
 *  scrubów") zostaje jako opcja dla pinów. Prefiks/sufiks w OSOBNYCH spanach
 *  (koniec z „−6+58"). SSR/no-JS/reduced-motion: od razu wartość końcowa. */
export function Counter({ value, prefix = "", suffix = "", className = "", format = true, mode = "once" }: CounterProps) {
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

        if (mode === "once") {
          // count-up raz; onComplete twardo ustawia final (nigdy wartość pośrednia)
          gsap.fromTo(obj, { v: 0 }, {
            v: value,
            duration: 1.2,
            ease: EASE.out,
            onUpdate: render,
            onComplete: () => {
              obj.v = value;
              render();
            },
            scrollTrigger: { trigger, start: "top 80%", once: true },
          });
          return;
        }

        gsap.fromTo(obj, { v: 0 }, {
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
        });
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
