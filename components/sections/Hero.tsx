"use client";

import { useRef } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Button } from "@/components/ui/Button";
import { HeroDemo } from "@/components/sections/HeroDemo";
import {
  gsap,
  useGSAP,
  SplitText,
  NO_REDUCE,
  REDUCE,
  EASE,
  STAG,
} from "@/lib/motion";
import { armIntroGate, markIntroDone } from "@/lib/introGate";

/** Hero (redesign, paper): H1 właściciela (hak ROAS w italiku Fraunces), żywy artefakt
 *  3 funkcji (HeroDemo: wyszukiwarka · rekomendacje · chat). Cały tekst od SSR, widoczny
 *  natychmiast — jedyny orkiestrowany ruch to mask-reveal H1 (gdy FCP świeży) + wjazd
 *  artefaktu; eyebrow/lead/CTA/proof są STATYCZNE (owner: „cały tekst od razu widoczny"). */
export function Hero() {
  const t = pl.hero;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(NO_REDUCE, () => {
        armIntroGate(2600);
        const fcp =
          performance.getEntriesByType("paint").find((e) => e.name === "first-contentful-paint")
            ?.startTime ?? 0;
        const fast = fcp > 0 && performance.now() - fcp < 700;
        const lines = gsap.utils.toArray<HTMLElement>(".hero-line", scope.current!);
        let split: SplitText | null = null;
        let played = false;
        if (lines.length && scope.current) {
          split = SplitText.create(lines, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            aria: "none",
            onSplit(self) {
              if (played || !fast) {
                played = true;
                gsap.set(self.lines, { yPercent: 0 });
                return;
              }
              played = true;
              const tl = gsap.timeline({ delay: 0.1 });
              tl.from(self.lines, { yPercent: 112, duration: 0.9, ease: EASE.out, stagger: STAG.base });
              return tl;
            },
          });
        }

        // Choreografia (~1,2 s): poświata + wjazd artefaktu; treść już widoczna od SSR
        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.soft }, onComplete: markIntroDone });
        tl.fromTo(".hero-glow", { opacity: 0 }, { opacity: 1, duration: 1.1 }, 0);
        tl.fromTo(
          ".hero-demo",
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, clearProps: "transform" },
          0.28
        );
        tl.play();

        return () => split?.revert();
      });

      mm.add(REDUCE, () => {
        gsap.set([".hero-demo", ".hero-line", ".hero-glow"], { clearProps: "all", opacity: 1 });
        markIntroDone();
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="top" className="relative flex min-h-svh items-start overflow-hidden pt-[96px] pb-14 md:items-center md:pt-[112px]">
      {/* Ciepła poświata radialna (paper-deep → transparent) */}
      <div className="hero-glow glow-bg absolute inset-x-0 -top-24 h-[130%]" aria-hidden="true" />

      <div className="container-hms relative grid w-full items-center gap-8 py-4 md:gap-12 md:py-8 lg:grid-cols-[55fr_45fr]">
        {/* LEWA kolumna — treść (statyczna, widoczna od SSR) */}
        <div className="min-w-0">
          <p className="hero-eyebrow t-meta font-medium uppercase tracking-[0.14em] text-mute">
            {t.eyebrow}
          </p>
          <h1 className="t-hero mt-5 font-display font-semibold text-ink">
            {/* 3 linie: pre / akcent serif / post. H1 = kandydat LCP — malowany od SSR;
                maska tylko dla mask-reveal (gdy FCP świeży). */}
            <span className="hero-line block">{t.h1.pre}</span>
            <span className="hero-line block">
              <em className="font-serif font-normal italic tracking-[-0.01em]">{t.h1.accent}</em>
            </span>
            {t.h1.post && <span className="hero-line block">{t.h1.post}</span>}
          </h1>
          <p className="hero-lead t-lead mt-6 max-w-[38rem] text-sub">{t.lead}</p>
          <div className="hero-cta mt-8 flex flex-wrap items-center gap-5">
            <Button href="#demo" size="lg">
              {t.ctaPrimary}
            </Button>
            <a
              href="#funkcje"
              className="group inline-flex items-center gap-2 py-3 text-sm font-medium text-sub transition-colors duration-150 hover:text-ink"
            >
              {t.ctaSecondary}
              <Glyph
                name="arrow-right"
                size={16}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </a>
          </div>
          {/* Hak do dowodów — 10/10 badań jako inline text-link (nie trzeci przycisk) */}
          <a
            href={t.studiesHook.href}
            className="mt-7 inline-flex items-center gap-2 text-sm text-sub transition-colors duration-150 hover:text-ink"
          >
            <span className="num font-semibold text-ink">{t.studiesHook.value}</span>
            <span>{t.studiesHook.label}</span>
            <Glyph name="arrow-right" size={13} className="text-mute" />
          </a>
          <p className="hero-proof mt-4 text-sm text-mute">{t.proof}</p>
        </div>

        {/* PRAWA kolumna — żywy artefakt 3 funkcji (desktop + mobile) */}
        <div className="relative min-w-0">
          <div className="hero-demo relative z-10">
            <HeroDemo />
          </div>
        </div>
      </div>

      {/* Wskaźnik przewijania — znika po ~180 px scrolla */}
      <a
        href="#funkcje"
        className="hero-cue absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-mute transition-colors duration-150 hover:text-sub md:flex"
        aria-label="Przewiń do sekcji Funkcje"
      >
        <span className="t-meta uppercase tracking-[0.14em]">{t.scrollCue}</span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline">
          <Glyph name="chevron-down" size={16} />
        </span>
      </a>
    </section>
  );
}
