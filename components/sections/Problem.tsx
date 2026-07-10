"use client";

import { useRef } from "react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { gsap, useGSAP, DESKTOP_MOTION, REDUCE } from "@/lib/motion";
import { useGLView } from "@/lib/glRegistry";

/** Problem v3 (motion.md §3): pin 300% — trzy statystyki KOLEJNO jako gigantyczne
 *  liczby scrubowane progresem, w tle pole kropek-klientów, które gasną falami
 *  (scena `field`). Progress-rail 01→03. Zero kart, zero ikon.
 *  Mobile / reduced-motion: trzy pełnoekranowe bloki z counterami on-enter. */
export function Problem() {
  const t = pl.problem;
  const scope = useRef<HTMLElement>(null);
  const { ref: fieldRef, glState } = useGLView("problem-field", "field");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Nagłówek (label + H2) — standardowy reveal w obu wariantach layoutu
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          scope.current!.querySelectorAll<HTMLElement>(".js-reveal"),
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.1,
            clearProps: "transform",
            scrollTrigger: { trigger: scope.current, start: "top 80%", once: true },
          }
        );
      });
      mm.add(REDUCE, () => {
        gsap.set(scope.current!.querySelectorAll<HTMLElement>(".js-reveal"), { clearProps: "all", opacity: 1 });
      });

      mm.add(DESKTOP_MOTION, () => {
        const root = scope.current!;
        const stage = root.querySelector<HTMLElement>(".prob-stage");
        const stats = gsap.utils.toArray<HTMLElement>(".prob-stat", root);
        const railSegs = gsap.utils.toArray<HTMLElement>(".prob-rail-seg", root);
        const railLine = root.querySelector<HTMLElement>(".prob-rail-line");
        if (!stage || stats.length < 3) return;

        gsap.set(stats, { autoAlpha: 0, yPercent: 12, filter: "blur(8px)" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: "top top",
            invalidateOnRefresh: true,
            end: "+=300%",
            scrub: 0.5,
            onUpdate(self) {
              const idx = Math.min(2, Math.floor(self.progress * 3));
              railSegs.forEach((el, i) => el.setAttribute("data-active", String(i === idx)));
            },
          },
        });

        // Pole kropek gaśnie przez cały pin; rail rośnie równolegle
        tl.to(glState, { progress: 1, duration: 9 }, 0);
        if (railLine) {
          tl.fromTo(railLine, { scaleY: 0 }, { scaleY: 1, duration: 9, transformOrigin: "top" }, 0);
        }

        stats.forEach((stat, i) => {
          const at = i * 3 + 0.2;
          const numEl = stat.querySelector<HTMLElement>(".prob-num");
          const proxy = { v: 0 };
          tl.to(stat, { autoAlpha: 1, yPercent: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }, at);
          tl.to(
            proxy,
            {
              v: t.cards[i].value,
              duration: 1.5,
              onUpdate() {
                if (numEl) numEl.textContent = String(Math.round(proxy.v));
              },
            },
            at + 0.3
          );
          if (i < stats.length - 1) {
            tl.to(stat, { autoAlpha: 0, yPercent: -10, duration: 0.45, ease: "power2.in" }, at + 2.35);
          }
        });
      });

      // Reduced-motion: pole „utraty" pokazuje stan końcowy (gdyby GL istniał — nie istnieje),
      // countery i layout załatwia wariant stackowany + komponent Counter.
      mm.add(REDUCE, () => {
        glState.progress = 1;
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative">
      {/* Desktop: pinowana scena 300% */}
      <div className="hidden md:block motion-reduce:md:hidden">
        <div className="prob-stage relative h-svh overflow-hidden">
          {/* Pole kropek-klientów (WebGL, scissorowane do tego DIV-a) */}
          <div ref={fieldRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-[4%] top-[10%]" />

          <Container className="relative flex h-full flex-col pb-16 pt-28">
            <div>
              <SectionLabel num="01">{t.label}</SectionLabel>
              <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>
            </div>

            <div className="relative flex-1">
              {t.cards.map((c, i) => (
                <div key={i} className="prob-stat absolute inset-0 flex flex-col justify-center will-change-[filter,transform]">
                  <p className="text-ink">
                    <span className="prob-num num text-[15vw] font-bold leading-[0.95] tracking-[-0.04em]">0</span>
                    <span className="num ml-4 text-[clamp(1.5rem,3vw,2.6rem)] text-blue-soft">
                      {c.suffix.trim()}
                    </span>
                  </p>
                  <p className="mt-7 max-w-[44ch] text-sub" style={{ fontSize: "var(--text-lead)", lineHeight: 1.55 }}>
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </Container>

          {/* Progress-rail 01→03 */}
          <div className="prob-rail absolute left-7 top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden="true">
            <div className="relative h-64 w-px bg-hairline">
              <div className="prob-rail-line absolute inset-0 origin-top bg-blue" style={{ transform: "scaleY(0)" }} />
              {["01", "02", "03"].map((n, i) => (
                <span
                  key={n}
                  data-active={i === 0 ? "true" : "false"}
                  className="prob-rail-seg num absolute left-4 -translate-y-1/2 text-xs text-mute transition-colors duration-300 data-[active=true]:text-blue-soft"
                  style={{ top: `${i * 50}%` }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile + desktop reduced-motion: trzy pełnoekranowe bloki */}
      <div className="md:hidden motion-reduce:md:block">
        <Container className="pt-24 md:pt-32">
          <SectionLabel num="01">{t.label}</SectionLabel>
          <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>
          {t.cards.map((c, i) => (
            <div
              key={i}
              className={`flex min-h-[62svh] flex-col justify-center ${i < t.cards.length - 1 ? "border-b border-hairline" : ""}`}
            >
              <p className="text-ink">
                <Counter value={c.value} className="text-[24vw] font-bold leading-none tracking-[-0.04em] md:text-[10rem]" />
                <span className="num ml-3 text-xl text-blue-soft">{c.suffix.trim()}</span>
              </p>
              <p className="mt-5 max-w-[44ch] text-sm leading-relaxed text-sub">{c.text}</p>
            </div>
          ))}
        </Container>
      </div>
    </section>
  );
}
