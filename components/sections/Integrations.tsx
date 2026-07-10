"use client";

import { pl } from "@/content/pl";
import { Container, SectionH2 } from "@/components/ui/Section";
import { useReveal } from "@/lib/motion";

/** Integracje — czyste, typograficzne kafle (bez fejkowych logotypów SVG). */
export function Integrations() {
  const t = pl.integrations;
  const ref = useReveal<HTMLElement>(0.05);

  return (
    <section ref={ref} className="section-pad bg-surface">
      <Container>
        <SectionH2 className="mt-0">{t.h2}</SectionH2>

        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {t.platforms.map((p) => (
            <li
              key={p}
              className="js-reveal flex h-20 items-center justify-center rounded-[var(--radius-md)] border border-hairline bg-card px-4 transition-colors duration-150 hover:border-strongline hover:bg-elevated"
            >
              <span className="font-display text-base font-semibold tracking-tight text-sub">{p}</span>
            </li>
          ))}
        </ul>

        <p className="js-reveal mt-10 max-w-[75ch] text-sm leading-relaxed text-mute">{t.note}</p>
      </Container>
    </section>
  );
}
