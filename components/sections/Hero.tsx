"use client";

import { useRef } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Button } from "@/components/ui/Button";
import { ChatDemo } from "@/components/sections/ChatDemo";
import { gsap, useGSAP, SplitText, NO_REDUCE, REDUCE, FINE_POINTER, EASE, STAG, attachMagnet } from "@/lib/motion";
import { useGLView } from "@/lib/glRegistry";

/** Hero v3 (motion.md §3, features §L17): particle core + mask-reveal H1 + żywy czat.
 *  Rdzeń oddycha (puls 1,2 s), reaguje na kursor i rozprasza się przy scrollu. */
export function Hero() {
  const t = pl.hero;
  const scope = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const { ref: coreRef, glState } = useGLView("hero-core", "core");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(NO_REDUCE, () => {
        // Fast-path LCP: H1 i lead są widoczne od SSR. Pełna choreografia gra tylko,
        // gdy hydracja dogoniła pierwszy paint (<700 ms po FCP) — na wolnych maszynach
        // namalowanej treści już NIE dotykamy (każdy późny tween = późny kandydat LCP).
        const fcp =
          performance.getEntriesByType("paint").find((e) => e.name === "first-contentful-paint")
            ?.startTime ?? 0;
        const fast = fcp > 0 && performance.now() - fcp < 700;
        const lines = gsap.utils.toArray<HTMLElement>(".hero-line", scope.current!);
        let split: SplitText | null = null;
        let played = false;

        if (!lines.length || !scope.current) return;
        split = SplitText.create(lines, {
          type: "lines,words",
          mask: "lines",
          autoSplit: true,
          aria: "none", // aria-label na <span> = prohibited attr (axe); h1 czyta się z treści
          onSplit(self) {
            const nigdy = self.words.find((w) => (w.textContent ?? "").trim().toLowerCase() === "nigdy");
            nigdy?.classList.add("hero-nigdy");
            if (played || !fast) {
              played = true;
              gsap.set(self.lines, { yPercent: 0 });
              return;
            }
            played = true;
            const tl = gsap.timeline({ delay: 0.1 });
            tl.from(self.lines, { yPercent: 112, duration: 0.9, ease: EASE.out, stagger: STAG.base });
            if (nigdy) {
              tl.to(nigdy, { duration: 0.6, scrambleText: { text: "nigdy", chars: "nigdyśpi", speed: 1.6 } }, 0.55);
            }
            return tl;
          },
        });

        // --- Reszta choreografii wejścia (< 1,4 s łącznie) ---
        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.soft } });
        tl.fromTo(".hero-glow", { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0);
        // lead: sam transform — element pozostaje namalowany (LCP), tylko dojeżdża
        if (fast) {
          tl.fromTo(".hero-lead", { y: 20 }, { y: 0, duration: 0.7, clearProps: "transform" }, 0.3);
        }
        tl.fromTo(
          [".hero-eyebrow", ".hero-cta", ".hero-proof", ".hero-cue"],
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: STAG.base },
          0.38
        ).fromTo(
          ".hero-demo",
          { y: 48, opacity: 0, scale: 0.98 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, clearProps: "transform" },
          0.55
        );
        tl.play();

        // --- Rdzeń: dyspersja i odpłynięcie przy scrollu (uniform, nie DOM) ---
        gsap.to(glState, {
          progress: 1,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom 30%", scrub: true },
        });

        return () => split?.revert();
      });

      mm.add(REDUCE, () => {
        gsap.set([".hero-el", ".hero-glow", ".hero-line"], { clearProps: "all", opacity: 1 });
      });

      // Magnetic CTA — tylko desktop z myszą (max 4 px w hero)
      mm.add(FINE_POINTER, () => {
        if (!ctaRef.current) return;
        return attachMagnet(ctaRef.current, 4);
      });

      // Dyskretny parallax glow + zanikanie scroll cue
      mm.add(NO_REDUCE, () => {
        gsap.to(".hero-glow", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
        });
        gsap.to(".hero-cue", {
          opacity: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: { start: 10, end: 180, scrub: true },
        });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="top" className="relative flex min-h-svh items-center overflow-hidden pt-[72px]">
      {/* Tło: glow (poster do czasu WebGL) + siatka kropek */}
      <div className="hero-glow glow-bg absolute inset-x-0 -top-24 h-[130%]" aria-hidden="true" />
      <div className="dot-grid absolute inset-0" aria-hidden="true" />

      {/* Track rdzenia — scena `core` rysowana na globalnym canvasie (z-0, za treścią) */}
      <div
        ref={coreRef}
        aria-hidden="true"
        className="pointer-events-none absolute -top-[20%] bottom-[-20%] left-[-30%] right-[-30%] md:-top-[22%] md:bottom-[-22%] md:left-[34%] md:right-[-16%]"
      />

      <div className="container-hms relative grid w-full items-center gap-14 py-16 md:py-20 lg:grid-cols-[55fr_45fr]">
        <div>
          <p className="hero-eyebrow hero-el label">{t.eyebrow}</p>
          <h1
            className="mt-5 font-display font-bold tracking-[-0.03em] text-ink"
            style={{ fontSize: "var(--text-hero)", lineHeight: 1.05 }}
          >
            {/* bez .hero-el — H1 to kandydat LCP, musi malować się od SSR */}
            <span className="hero-line block">{t.h1Line1}</span>
            <span className="hero-line block">{t.h1Line2}</span>
          </h1>
          <p
            className="hero-lead mt-6 max-w-[36rem] text-sub"
            style={{ fontSize: "var(--text-lead)", lineHeight: 1.6 }}
          >
            {t.lead}
          </p>
          <div className="hero-cta hero-el mt-9 flex flex-wrap items-center gap-4">
            <div ref={ctaRef} className="will-change-transform">
              <Button href="#demo" size="lg">
                {t.ctaPrimary}
              </Button>
            </div>
            <a
              href="#chat-demo"
              className="group inline-flex items-center gap-2 py-3 text-sm font-medium text-sub hover:text-ink"
            >
              {t.ctaSecondary}
              <Glyph name="arrow-right" size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </a>
          </div>
          <p className="hero-proof hero-el mt-7 text-sm text-mute">{t.proof}</p>
        </div>

        <div id="chat-demo" className="hero-demo" data-cursor-label={pl.ui.cursorDemo}>
          <ChatDemo />
        </div>
      </div>

      {/* Wskaźnik przewijania — znika po pierwszych ~180px scrolla */}
      <a
        href="#produkt"
        className="hero-cue hero-el absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-mute transition-colors duration-150 hover:text-sub md:flex"
        aria-label="Przewiń do sekcji Produkt"
      >
        <span className="label">{t.scrollCue}</span>
        <span className="cue-bob flex h-9 w-9 items-center justify-center rounded-full border border-hairline">
          <Glyph name="chevron-down" size={16} />
        </span>
      </a>
    </section>
  );
}
