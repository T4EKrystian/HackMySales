"use client";

import { useRef } from "react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { gsap, useGSAP, useReveal, NO_REDUCE } from "@/lib/motion";

export function HowItWorks() {
  const t = pl.how;
  const ref = useReveal<HTMLElement>();
  const lineRef = useRef<SVGLineElement>(null);

  // Linia łącząca kroki — rysowana raz przy scrollu (stroke-dashoffset)
  useGSAP(
    () => {
      const line = lineRef.current;
      if (!line) return;
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        gsap.fromTo(
          line,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.4,
            ease: "power2.inOut",
            scrollTrigger: { trigger: line, start: "top 80%", once: true },
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="section-pad bg-surface">
      <Container>
        <SectionLabel>{t.label}</SectionLabel>
        <SectionH2>{t.h2}</SectionH2>

        <div className="relative mt-16">
          {/* Linia (desktop) */}
          <svg
            className="absolute left-0 right-0 top-5 hidden h-[2px] w-full md:block"
            aria-hidden="true"
            preserveAspectRatio="none"
            viewBox="0 0 100 2"
          >
            <line
              ref={lineRef}
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              pathLength="1"
              stroke="var(--border-strong)"
              strokeWidth="2"
              strokeDasharray="1"
              strokeDashoffset="1"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
            {t.steps.map((step, i) => (
              <li key={i} className="js-reveal relative">
                <span className="num relative z-10 inline-flex h-10 items-center rounded-full border border-strongline bg-card px-4 text-sm text-blue-soft">
                  0{i + 1}
                </span>
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-ink">{step.title}</h3>
                <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-sub">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <p className="js-reveal mt-14 text-sm text-mute">{t.note}</p>
      </Container>
    </section>
  );
}
