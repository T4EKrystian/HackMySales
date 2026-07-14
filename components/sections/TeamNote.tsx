"use client";

import { useRef } from "react";
import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { gsap, useGSAP, SplitText, DESKTOP_MOTION, REDUCE, EASE, STAG } from "@/lib/motion";

/** Founder note v3 (features §L15, motion.md §3): full-bleed editorial — pull-quote
 *  wjeżdża liniami spod maski, w tle gigantyczny watermark „2017 / 40+" na parallaxie.
 *  Fakty bez zmian (copy §10b) — żadnych opinii, gwiazdek, logotypów. */
export function TeamNote() {
  const t = pl.teamNote;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const quote = scope.current!.querySelector<HTMLElement>(".tn-quote");
        let split: SplitText | null = null;

        document.fonts.ready.then(() => {
          if (!quote || !scope.current) return;
          split = SplitText.create(quote, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            aria: "none", // aria-label na spanach = prohibited (axe); blockquote czyta się z treści
            onSplit(self) {
              gsap.set(quote, { opacity: 1 });
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: 0.9,
                ease: EASE.out,
                stagger: STAG.base,
                scrollTrigger: { trigger: quote, start: "top 78%", once: true },
              });
            },
          });
        });

        // Watermark: dyskretny parallax w kontrze do scrolla
        gsap.fromTo(
          ".tn-mark",
          { yPercent: 18 },
          {
            yPercent: -18,
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top bottom", end: "bottom top", scrub: true },
          }
        );

        gsap.fromTo(
          [".tn-label", ".tn-sign"],
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: EASE.soft,
            scrollTrigger: { trigger: scope.current, start: "top 75%", once: true },
          }
        );

        return () => split?.revert();
      });

      mm.add("(max-width: 767px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          [".tn-label", ".tn-quote", ".tn-sign"],
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.12,
            ease: EASE.soft,
            scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
          }
        );
      });

      mm.add(REDUCE, () => {
        gsap.set([".tn-label", ".tn-quote", ".tn-sign"], { clearProps: "all", opacity: 1 });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative overflow-hidden bg-surface">
      {/* Watermark faktów — 2017 / 40+ */}
      <div
        className="tn-mark pointer-events-none absolute inset-y-0 right-[-4%] hidden select-none flex-col items-end justify-center md:flex"
        aria-hidden="true"
      >
        <span className="num text-[22vw] font-bold leading-[0.85] text-ink opacity-[0.08]">2017</span>
        <span className="num text-[22vw] font-bold leading-[0.85] text-ink opacity-[0.08]">40+</span>
      </div>

      <Container className="relative py-16 md:py-32">
        <p className="tn-label label js-reveal">{t.label}</p>
        <blockquote
          className="t-quote tn-quote js-reveal mt-8 max-w-[24ch] font-display font-semibold text-ink"
        >
          {t.body}
        </blockquote>
        <p className="tn-sign js-reveal num mt-10 text-sm text-mute">{t.signature}</p>
      </Container>
    </section>
  );
}
