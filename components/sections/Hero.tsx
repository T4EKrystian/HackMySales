"use client";

import { useRef } from "react";
import type { CSSProperties } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Button } from "@/components/ui/Button";
import { HeroGridTexture } from "@/components/ui/kit";
import { ChatDemo } from "@/components/sections/ChatDemo";
import { HeroChatMobile } from "@/components/mobile/HeroChatMobile";
import {
  gsap,
  useGSAP,
  SplitText,
  NO_REDUCE,
  REDUCE,
  FINE_POINTER,
  EASE,
  STAG,
  attachMagnet,
} from "@/lib/motion";
import { armIntroGate, markIntroDone } from "@/lib/introGate";

/** Hero v2 (redesign, paper): siatka linii + ciepła poświata (zamiast GL), H1 z akcentem
 *  serif (Fraunces italic), żywy czat Magdy + 3 pływające chipy statystyk (ref-3).
 *  Choreografia wejścia ≤1,6 s — jedyny orkiestrowany moment strony.
 *  LCP: H1 malowany od SSR; late tweeny tylko na dekoracjach; czat budzi bramka intro. */
export function Hero() {
  const t = pl.hero;
  const scope = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const CHIP_POS: CSSProperties[] = [
    { top: "-3%", left: "-13%" }, // +18% konwersji — satelita nad rogiem, w rynnie (nie zasłania avatara)
    { top: "40%", right: "-4%" }, // < 3 s — prawa krawędź, lekki wysun
    { bottom: "6%", left: "-13%" }, // 24/7 — satelita dolny-lewy, w rynnie
  ];
  const CHIP_DEPTH = [0.9, 0.5, 1.1];

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
        if (!lines.length || !scope.current) {
          markIntroDone();
          return;
        }
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

        // Choreografia (~1,45 s): poświata + siatka → treść → artefakt → chipy
        const tl = gsap.timeline({
          paused: true,
          defaults: { ease: EASE.soft },
          onComplete: markIntroDone,
        });
        tl.fromTo(".hero-glow", { opacity: 0 }, { opacity: 1, duration: 1.1 }, 0);
        tl.fromTo(".hero-grid", { opacity: 0 }, { opacity: 1, duration: 0.8 }, 0);
        if (fast) tl.fromTo(".hero-lead", { y: 20 }, { y: 0, duration: 0.7, clearProps: "transform" }, 0.3);
        tl.fromTo(
          [".hero-eyebrow", ".hero-cta", ".hero-proof"],
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: STAG.base },
          0.38
        );
        tl.fromTo(
          ".hero-demo",
          { y: 40, opacity: 0, scale: 0.97 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, clearProps: "transform" },
          0.5
        );
        tl.fromTo(
          ".hero-chip-outer",
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)", stagger: 0.08 },
          0.85
        );
        tl.play();

        return () => split?.revert();
      });

      mm.add(REDUCE, () => {
        gsap.set(
          [
            ".hero-eyebrow",
            ".hero-lead",
            ".hero-cta",
            ".hero-proof",
            ".hero-demo",
            ".hero-line",
            ".hero-glow",
            ".hero-grid",
            ".hero-chip-outer",
          ],
          { clearProps: "all", opacity: 1 }
        );
        markIntroDone();
      });

      // Magnetic CTA + parallax chipów (tylko desktop z myszą)
      mm.add(FINE_POINTER, () => {
        const cleanupMagnet = ctaRef.current ? attachMagnet(ctaRef.current, 4) : undefined;
        const chips = gsap.utils.toArray<HTMLElement>(".hero-chip-outer", scope.current!);
        const movers = chips.map((c) => ({
          x: gsap.quickTo(c, "x", { duration: 0.6, ease: "power3.out" }),
          y: gsap.quickTo(c, "y", { duration: 0.6, ease: "power3.out" }),
          depth: Number(c.dataset.depth || 0.5),
        }));
        const onMove = (e: PointerEvent) => {
          const el = scope.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          movers.forEach((m) => {
            m.x(nx * 16 * m.depth);
            m.y(ny * 16 * m.depth);
          });
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => {
          cleanupMagnet?.();
          window.removeEventListener("pointermove", onMove);
        };
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="top" className="relative flex min-h-svh items-start overflow-hidden pt-[112px] pb-16 md:items-center md:pt-[128px]">
      {/* Ciepła poświata radialna (paper-deep → transparent) + siatka cienkich linii */}
      <div className="hero-glow glow-bg absolute inset-x-0 -top-24 h-[130%]" aria-hidden="true" />
      <HeroGridTexture />

      <div className="container-hms relative grid w-full items-center gap-10 py-6 md:gap-14 md:py-10 lg:grid-cols-[58fr_42fr]">
        {/* LEWA kolumna */}
        <div className="min-w-0">
          <p className="hero-eyebrow text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-mute">
            {t.eyebrow}
          </p>
          <h1 className="t-hero mt-5 font-display font-semibold text-ink">
            {/* 3 linie: łamanie kontrolowane (bez sieroty „Twój"), akcent serif w osobnej linii.
                H1 to kandydat LCP — malowany od SSR; maska tylko dla animacji. */}
            <span className="hero-line block">{t.h1.pre}</span>
            <span className="hero-line block">
              <em className="font-serif font-normal italic tracking-[-0.01em]">{t.h1.accent}</em>
            </span>
            <span className="hero-line block">{t.h1.post}</span>
          </h1>
          <p className="hero-lead t-lead mt-6 max-w-[38rem] text-sub">{t.lead}</p>
          <div className="hero-cta mt-9 flex flex-wrap items-center gap-5">
            <div ref={ctaRef} className="will-change-transform">
              <Button href="#cennik" size="lg">
                {t.ctaPrimary}
              </Button>
            </div>
            <a
              href="#chat-demo"
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
          <p className="hero-proof mt-7 text-sm text-mute">{t.proof}</p>
        </div>

        {/* PRAWA kolumna — artefakt + orbitujące chipy */}
        <div id="chat-demo" className="relative min-w-0">
          <div className="hero-demo relative">
            <div className="hidden md:block">
              <ChatDemo />
            </div>
            <div className="md:hidden">
              <HeroChatMobile />
            </div>
          </div>

          {/* Desktop (lg = układ 2-kolumnowy): 3 pływające chipy (dryf CSS + parallax myszy) */}
          <div className="pointer-events-none absolute inset-0 z-20 hidden lg:block" aria-hidden="true">
            {t.chips.map((c, i) => (
              <div
                key={c.label}
                className="hero-chip-outer absolute will-change-transform"
                data-depth={CHIP_DEPTH[i]}
                style={CHIP_POS[i]}
              >
                <div className="hero-chip" style={{ animationDelay: `${i * -1.7}s` }}>
                  <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-l1 px-3.5 py-2 shadow-[var(--shadow-float)]">
                    <span className="num text-sm font-medium text-ink">{c.value}</span>
                    <span className="text-xs text-mute">{c.label}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Poniżej lg: chipy w jednym rzędzie pod kartą */}
          <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
            {t.chips.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-l1 px-3 py-1.5"
              >
                <span className="num text-xs font-medium text-ink">{c.value}</span>
                <span className="text-xs text-mute">{c.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Wskaźnik przewijania — znika po ~180 px scrolla */}
      <a
        href="#produkt"
        className="hero-cue absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-mute transition-colors duration-150 hover:text-sub md:flex"
        aria-label="Przewiń do sekcji Produkt"
      >
        <span className="text-[0.8125rem] uppercase tracking-[0.14em]">{t.scrollCue}</span>
        <span className="cue-bob flex h-9 w-9 items-center justify-center rounded-full border border-hairline">
          <Glyph name="chevron-down" size={16} />
        </span>
      </a>
    </section>
  );
}
