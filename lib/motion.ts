"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { useGSAP } from "@gsap/react";

// Dieta pluginów: aktywne tylko ScrollTrigger + SplitText + Flip (reszta usunięta z martwym kodem).
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

export const REDUCE = "(prefers-reduced-motion: reduce)";
export const NO_REDUCE = "(prefers-reduced-motion: no-preference)";
export const DESKTOP_MOTION = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
export const MOBILE_MOTION = "(max-width: 767px) and (prefers-reduced-motion: no-preference)";
export const FINE_POINTER = "(min-width: 768px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** Tokeny ruchu (design/motion.md v3 §1) — wszystkie animacje biorą wartości stąd. */
export const EASE = {
  out: "expo.out", // wejścia, reveals
  soft: "power3.out", // drobne przesunięcia, wskaźniki
  inOut: "power2.inOut", // rysowanie linii, scruby
} as const;

export const DUR = { fast: 0.3, base: 0.6, slow: 1.2 } as const;
export const STAG = { tight: 0.06, base: 0.08, loose: 0.09 } as const;

/** Standardowy reveal sekcji: elementy .js-reveal wjeżdżają y→0 ze staggerem,
 *  raz, przy top 78%. Reduced-motion: od razu widoczne.
 *  Rodziny wejść (E8): wiersze danych `y:12` tight, ciemne pasma `y:24` wolniej —
 *  stan KOŃCOWY zawsze identyczny (y:0, opacity:1, transform czyszczony) → reduced-motion 0 diff. */
export function useReveal<T extends HTMLElement = HTMLElement>(
  stagger: number = STAG.base,
  opts?: { y?: number; duration?: number }
) {
  const ref = useRef<T>(null);
  const y = opts?.y ?? 16;
  const duration = opts?.duration ?? 0.7;

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
          { y, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration,
            ease: EASE.soft,
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

/** Dopisuje do timeline'a pisanie tekstu znak po znaku (data-full jako źródło,
 *  SSR trzyma pełny tekst dla no-JS). Wspólne dla czatu, wyszukiwarki, areny, raportu. */
export function typeInto(
  tl: gsap.core.Timeline,
  el: HTMLElement | null,
  opts?: { caret?: HTMLElement | null; speed?: number; max?: number }
) {
  if (!el) return;
  const full = el.dataset.full ?? el.textContent ?? "";
  const proxy = { i: 0 };
  tl.call(() => {
    el.textContent = "";
    if (opts?.caret) opts.caret.style.display = "inline-block";
  })
    .to(proxy, {
      i: full.length,
      duration: Math.min(opts?.max ?? 1.6, Math.max(0.4, full.length * (opts?.speed ?? 0.035))),
      ease: "none",
      onUpdate: () => {
        el.textContent = full.slice(0, Math.round(proxy.i));
      },
    })
    .call(() => {
      if (opts?.caret) opts.caret.style.display = "none";
    });
}

/** Rytm pisania z DNA „Chat authenticity": 40–70 ms/znak + pauza 250–400 ms po [.?!,].
 *  Deterministyczny (seed = indeks znaku) — bez Math.random, stabilny między replayami.
 *  typeInto zostaje dla wyszukiwarki/areny/raportu (szybkie „maszynowe" pisanie). */
export function typeIntoPunct(
  tl: gsap.core.Timeline,
  el: HTMLElement | null,
  opts?: { caret?: HTMLElement | null; max?: number; onTick?: () => void }
) {
  if (!el) return;
  const full = el.dataset.full ?? el.textContent ?? "";
  const rand = (n: number) => {
    const x = Math.sin(n * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  };
  // mapa czasu skumulowanego per znak
  const times: number[] = [];
  let acc = 0;
  for (let i = 0; i < full.length; i++) {
    acc += 0.04 + 0.03 * rand(i);
    if (/[.?!,]/.test(full[i])) acc += 0.25 + 0.15 * rand(i + 997);
    times.push(acc);
  }
  const total = Math.min(acc, opts?.max ?? 3.6);
  const proxy = { t: 0 };
  let lastN = -1;
  tl.call(() => {
    el.textContent = "";
    lastN = -1;
    if (opts?.caret) opts.caret.style.display = "inline-block";
  })
    .to(proxy, {
      t: acc,
      duration: total,
      ease: "none",
      onUpdate: () => {
        let n = 0;
        while (n < times.length && times[n] <= proxy.t) n++;
        if (n !== lastN) {
          lastN = n;
          el.textContent = full.slice(0, n);
          // stick-to-bottom przy każdym dołożonym znaku (bąbel usera rośnie przy zawijaniu)
          opts?.onTick?.();
        }
      },
      onComplete: () => {
        el.textContent = full;
        opts?.onTick?.();
      },
    })
    .call(() => {
      if (opts?.caret) opts.caret.style.display = "none";
    });
}

export { gsap, ScrollTrigger, SplitText, Flip, useGSAP };
