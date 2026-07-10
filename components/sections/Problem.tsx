"use client";

import { useRef } from "react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { gsap, useGSAP, useReveal, NO_REDUCE } from "@/lib/motion";

export function Problem() {
  const t = pl.problem;
  const ref = useReveal<HTMLElement>();
  const kickerRef = useRef<HTMLQuoteElement>(null);

  // Kicker: rozjaśnianie słów na scrubie — jedyny scrub tekstu na stronie (motion.md §3)
  useGSAP(
    () => {
      const el = kickerRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        gsap.fromTo(
          el.querySelectorAll<HTMLElement>(".kicker-word"),
          { color: "var(--text-muted)" },
          {
            color: "var(--text-primary)",
            stagger: 0.06,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 75%", end: "+=60vh", scrub: true },
          }
        );
      });
    },
    { scope: kickerRef }
  );

  const words = t.kicker.split(" ");

  return (
    <section ref={ref} className="section-pad">
      <Container>
        <SectionLabel>{t.label}</SectionLabel>
        <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {t.cards.map((card, i) => (
            <div
              key={i}
              className="js-reveal rounded-[var(--radius-lg)] border border-hairline bg-card p-7 transition-colors duration-150 hover:border-strongline hover:bg-elevated"
            >
              <p className="font-display text-ink">
                <Counter value={card.value} className="text-[2.75rem] font-bold leading-none tracking-tight" />
                <span className="num text-[1.35rem] text-sub">{card.suffix}</span>
              </p>
              <p className="mt-4 text-sm leading-relaxed text-sub">{card.text}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Kicker pełnej szerokości — oddech w rytmie strony */}
      <Container className="mt-28 md:mt-36">
        <blockquote
          ref={kickerRef}
          className="mx-auto max-w-[26ch] text-center font-display font-semibold tracking-tight text-mute"
          style={{ fontSize: "var(--text-h2)", lineHeight: 1.25 }}
        >
          {words.map((w, i) => (
            <span key={i} className="kicker-word">
              {w}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </blockquote>
      </Container>
    </section>
  );
}
