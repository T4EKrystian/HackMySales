"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";
import { fmtIntPl } from "@/lib/typography";

/** Rolkowy odometer (motion.md §3, copy §6b): każda cyfra to kolumna 0–9,
 *  zmiana wartości kręci kolumnami ze sprężynką. Czytniki ekranu dostają
 *  zwykłą liczbę (sr-only), wizual jest aria-hidden. Reduced-motion: bez animacji. */

function Digit({ d, instant }: { d: number; instant: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const first = useRef(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // jednostki spójne z inline stylem (em) — mieszanie % z yPercent składa transformy
    gsap.to(el, {
      y: `${-d}em`,
      duration: instant || first.current ? 0 : 0.55,
      ease: "back.out(1.35)",
      overwrite: true,
    });
    first.current = false;
  }, [d, instant]);

  return (
    <span className="inline-block h-[1em] overflow-hidden">
      <span
        ref={ref}
        className="flex flex-col"
        style={{ transform: `translateY(${-d}em)`, lineHeight: 1 }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i} className="h-[1em]">
            {i}
          </span>
        ))}
      </span>
    </span>
  );
}

export function RollingNumber({ value, className = "" }: { value: number; className?: string }) {
  const str = fmtIntPl(Math.max(0, Math.round(value)));
  const instant =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <span className={`num ${className}`}>
      <span className="sr-only">{str}</span>
      <span aria-hidden="true" className="inline-flex" style={{ lineHeight: 1 }}>
        {str.split("").map((ch, i) =>
          /\d/.test(ch) ? (
            <Digit key={`${str.length}-${i}`} d={Number(ch)} instant={instant} />
          ) : (
            <span key={`${str.length}-${i}`} className="inline-block h-[1em] w-[0.5ch]">
              {" "}
            </span>
          )
        )}
      </span>
    </span>
  );
}
