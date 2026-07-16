"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap, EASE } from "@/lib/motion";
import { fmtIntPl } from "@/lib/typography";

type CounterProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  /** formatowanie pl-PL z separatorem tysięcy (spacja nierozdzielająca) */
  format?: boolean;
  /** liczba miejsc po przecinku (pl-PL, przecinek dziesiętny). 0 = liczba całkowita. */
  decimals?: number;
  /** once (default): dip 0.7×→1× odpalany IntersectionObserverem — bez ScrollTriggera.
   *  scrub: wartość bindowana do scrolla + snap (opcja dla pinów narracyjnych). */
  mode?: "once" | "scrub";
};

/** Licznik v4 (V7-F2). INWARIANT: DOM od SSR do końca życia pokazuje wartość
 *  FINALNĄ — animacja jest ozdobą, nie nośnikiem stanu. Poprzednio `gsap.fromTo`
 *  (immediateRender:true) kasował SSR „98"→„0" na mount i uzależniał powrót od
 *  kruchego once-ScrollTriggera na inline-spanie → na mobile zostawało „samo %".
 *  Teraz tween powstaje DOPIERO w callbacku IntersectionObservera (dip od −30%);
 *  jak IO nie strzeli (szybki/urwany scroll, tab w tle) — stoi finalna.
 *  Reduced-motion/no-JS: od razu final. */
export function Counter({ value, prefix = "", suffix = "", className = "", format = true, decimals = 0, mode = "once" }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const fmt = useCallback(
    (n: number) =>
      decimals > 0
        ? n.toLocaleString("pl-PL", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
        : format
          ? fmtIntPl(Math.round(n))
          : String(Math.round(n)),
    [format, decimals]
  );

  useEffect(() => {
    const el = numRef.current;
    const trigger = ref.current;
    if (!el || !trigger) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // final stoi

    if (mode === "scrub") {
      // scrub zachowany w API (pin narracyjny); SSR=final, immediateRender:false →
      // wartość nie jest niszczona na mount, dopiero scrub ją prowadzi
      const obj = { v: value };
      const tw = gsap.fromTo(
        obj,
        { v: 0 },
        {
          v: value,
          ease: "none",
          immediateRender: false,
          onUpdate: () => (el.textContent = fmt(obj.v)),
          scrollTrigger: {
            trigger,
            start: "top 85%",
            end: "top 55%",
            scrub: 0.8,
            invalidateOnRefresh: true,
            onLeave: () => (el.textContent = fmt(value)),
            onLeaveBack: () => (el.textContent = fmt(0)),
          },
        }
      );
      return () => {
        tw.scrollTrigger?.kill();
        tw.kill();
        el.textContent = fmt(value);
      };
    }

    // once: dip 0.7×→1× dopiero po wejściu w viewport (IntersectionObserver).
    // Do tego czasu DOM = final (SSR nietknięty). Działa też w poziomym snap-x
    // (IO mierzy przecięcie niezależnie od osi).
    const obj = { v: value };
    let tween: gsap.core.Tween | null = null;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return;
        io.disconnect();
        obj.v = value * 0.7;
        el.textContent = fmt(obj.v);
        tween = gsap.to(obj, {
          v: value,
          duration: 1.0,
          ease: EASE.out,
          onUpdate: () => (el.textContent = fmt(obj.v)),
          onComplete: () => {
            obj.v = value;
            el.textContent = fmt(value);
          },
        });
      },
      { threshold: 0.6 }
    );
    io.observe(trigger);
    return () => {
      io.disconnect();
      tween?.kill();
      el.textContent = fmt(value);
    };
  }, [value, mode, fmt]);

  return (
    <span ref={ref} data-counter data-final={fmt(value)} className={`num ${className}`}>
      {prefix && <span>{prefix}</span>}
      <span ref={numRef} data-counter-num>
        {fmt(value)}
      </span>
      {suffix && <span>{suffix}</span>}
    </span>
  );
}
