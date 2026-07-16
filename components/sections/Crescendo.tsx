"use client";

import { useRef } from "react";
import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Glyph } from "@/components/ui/Glyph";
import {
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  DESKTOP_MOTION,
  MOBILE_MOTION,
  EASE,
  STAG,
} from "@/lib/motion";
import { whenIntroDone } from "@/lib/introGate";

/** requestIdleCallback z bezpiecznym fallbackiem (SSR-safe: window czytane dopiero
 *  przy wywołaniu, wewnątrz useGSAP = klient). */
const ric = (cb: () => void): number =>
  typeof window.requestIdleCallback === "function"
    ? window.requestIdleCallback(cb, { timeout: 1500 })
    : window.setTimeout(cb, 1000);
const cancelIdle = (id: number) => {
  if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(id);
  else clearTimeout(id);
};

/** Crescendo (E9) — sygnaturowa scena: JEDYNY scroll-pin strony (motion.md §7,
 *  usankcjonowany drugi moment i jedyny scrub tekstu). Ciemne pasmo
 *  „Płacisz za ruch, który płaci Tobie." scrubuje składanie zdania słowo-po-słowie,
 *  potem druga poświata, potem sub + CTA „Zobacz dowody"→#badania — oddaje ruch do dowodów.
 *
 *  Fazy scrubu (data-phase na .cres-stage = kontrakt dwellu QA):
 *   0 (0–0,50): SplitText words (BEZ mask — zwisy Fraunces italic), opacity 0,12→1, y 24→0,
 *   1 (0,50–0,75): druga warstwa poświaty opacity 0→0,5 (tylko opacity),
 *   2 (0,75–1,0): sub + CTA wjeżdżają, CTA widoczne do końca pinu.
 *  Pin 280% @vh900 → 1050/525/525 ms @1200 px/s (każda faza ≥500 ms).
 *
 *  Mobile <768: bez pinu — jednorazowy IO-stagger słów. Reduced-motion: statyczny układ
 *  1:1 (bez pinu/SplitText/min-h — min-h gated CSS-em pod desktop+no-preference). Bez fałszywych liczb. */
export function Crescendo() {
  const t = pl.crescendo;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = scope.current;
      if (!section) return;
      const stage = section.querySelector<HTMLElement>(".cres-stage");
      const line = section.querySelector<HTMLElement>(".cres-line");
      if (!stage || !line) return;

      const mm = gsap.matchMedia();

      // ---- Desktop ≥768 + no-preference: signature scroll-pin ----
      mm.add(DESKTOP_MOTION, () => {
        let split: SplitText | null = null;
        let trigger: ScrollTrigger | null = null;
        let idleId = 0;
        let inited = false;

        const init = () => {
          if (inited || !section.isConnected) return;
          inited = true;
          window.removeEventListener("scroll", onFirstScroll);
          if (idleId) cancelIdle(idleId);

          // aria domyślne (auto): aria-label na h2, fragmenty słów aria-hidden — NIE aria:"none"
          split = SplitText.create(line, { type: "words" });
          const words = split.words;
          const eyebrow = section.querySelector<HTMLElement>(".cres-eyebrow");
          const glow2 = section.querySelector<HTMLElement>(".cres-glow2");
          const sub = section.querySelector<HTMLElement>(".cres-sub");
          const cta = section.querySelector<HTMLElement>(".cres-cta");

          stage.dataset.phase = "0";

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "+=280%",
              pin: true,
              scrub: true, // BEZ smoothing — Lenis wygładza
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const p = self.progress;
                const phase = p < 0.5 ? "0" : p < 0.75 ? "1" : "2";
                if (stage.dataset.phase !== phase) stage.dataset.phase = phase;
              },
            },
          });
          // faza 0 (0–0,50): eyebrow + słowa składają się kolejno (opacity/transform only)
          if (eyebrow) tl.from(eyebrow, { opacity: 0, y: 8, duration: 0.12 }, 0);
          tl.from(words, { opacity: 0.12, y: 24, ease: EASE.inOut, duration: 0.2, stagger: STAG.tight }, 0);
          // faza 1 (0,50–0,75): druga warstwa poświaty — TYLKO opacity
          if (glow2) tl.fromTo(glow2, { opacity: 0 }, { opacity: 0.5, ease: "none", duration: 0.25 }, 0.5);
          // faza 2 (0,75–1,0): sub + CTA wjeżdżają y 12→0 + opacity; CTA do końca pinu
          const tail = [sub, cta].filter(Boolean) as HTMLElement[];
          if (tail.length) tl.from(tail, { opacity: 0, y: 12, ease: EASE.soft, duration: 0.15, stagger: 0.1 }, 0.75);

          trigger = tl.scrollTrigger ?? null;
        };

        const onFirstScroll = () => init();

        // Pin musi powstać ZANIM user dojedzie (sekcja ~4 viewporty w dół):
        // idle po intro + bezpiecznik pierwszego scrolla (cokolwiek pierwsze; init idempotentny).
        const offIntro = whenIntroDone(() => {
          idleId = ric(init);
        });
        window.addEventListener("scroll", onFirstScroll, { once: true, passive: true });

        return () => {
          offIntro();
          window.removeEventListener("scroll", onFirstScroll);
          if (idleId) cancelIdle(idleId);
          trigger?.kill();
          split?.revert();
        };
      });

      // ---- Mobile <768 + no-preference: bez pinu, jednorazowy IO-stagger słów ----
      mm.add(MOBILE_MOTION, () => {
        const split = SplitText.create(line, { type: "words" });
        gsap.set(split.words, { opacity: 0.12, y: 16 });
        const st = ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          once: true,
          onEnter: () =>
            gsap.to(split.words, { opacity: 1, y: 0, ease: EASE.out, duration: 0.6, stagger: STAG.tight }),
        });
        return () => {
          st.kill();
          split.revert();
        };
      });

      // Reduced-motion: brak gałęzi — elementy widoczne domyślnie (statyczny układ 1:1).
    },
    { scope }
  );

  return (
    <section
      ref={scope}
      className="cres-section section-pad relative overflow-hidden bg-forest-950 text-onforest"
    >
      <div className="noise-forest" aria-hidden="true" />
      {/* poświata bazowa — głębia granatu */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(70% 120% at 15% 0%, rgb(40 88 240 / 0.08), transparent 60%)" }}
      />
      {/* druga warstwa poświaty — scrubowana w fazie 1 (domyślnie niewidoczna → reduced-motion 0-diff) */}
      <div
        className="cres-glow2 pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          opacity: 0,
          background:
            "radial-gradient(80% 120% at 85% 100%, color-mix(in srgb, var(--blue-500) 12%, transparent), transparent 62%)",
        }}
      />
      <Container className="cres-stage relative z-[1] max-w-[920px]">
        <p className="cres-eyebrow label !text-onforest/55">{t.eyebrow}</p>
        <h2
          className="cres-line mt-6 max-w-[16ch] font-display font-semibold text-onforest"
          style={{ fontSize: "var(--text-hero)", lineHeight: 1.0, letterSpacing: "-0.03em" }}
        >
          {t.line1}{" "}
          <em className="font-serif font-normal italic text-blue-soft">{t.accent}</em>
        </h2>
        <p className="cres-sub t-lead mt-8 max-w-[54ch] text-onforest/75">{t.sub}</p>
        <a
          href={t.cta.href}
          className="cres-cta group mt-9 inline-flex items-center gap-2 text-sm font-medium text-onforest transition-colors duration-150 hover:text-blue-soft"
        >
          {t.cta.label}
          <Glyph name="arrow-right" size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
        </a>
      </Container>
    </section>
  );
}
