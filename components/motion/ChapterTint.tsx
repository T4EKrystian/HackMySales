"use client";

import { useGSAP, gsap, DESKTOP_MOTION } from "@/lib/motion";

/** Przejścia rozdziałów (V6-F4D, „niewidoczna ręka"): między makro-blokami
 *  strony tło przesuwa się o 2–3% ku akcentowi — scrub przez wysokość sekcji
 *  GRANICZNEJ, bez skoków. Body: color-mix na var(--chapter-tint) (globals).
 *  Sekcje z własnym bg-surface świadomie przykrywają tint (rytm elewacji).
 *  Reduced-motion/mobile: brak (tint = czysta dekoracja). */

const BOUNDARIES: { selector: string; from: number; to: number }[] = [
  // problem → rozwiązanie (Manifest jest kickerem-oddechem między nimi)
  { selector: "[data-ambient='problem']", from: 0, to: 1.6 },
  // rozwiązanie → dowody (Kanały otwierają blok dowodów)
  { selector: "#kanaly", from: 1.6, to: 0.8 },
  // dowody → oferta (Kontrola poprzedza cennik)
  { selector: "[data-ambient='kontrola']", from: 0.8, to: 2.4 },
];

export function ChapterTint() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(DESKTOP_MOTION, () => {
      const body = document.body;
      for (const b of BOUNDARIES) {
        const el = document.querySelector(b.selector);
        if (!el) continue;
        gsap.fromTo(
          body,
          { "--chapter-tint": `${b.from}%` },
          {
            "--chapter-tint": `${b.to}%`,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      }
    });
  });

  return null;
}
