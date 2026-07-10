"use client";

import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { useReveal } from "@/lib/motion";

/** Nota od zespołu (features.md §L15) — jedyny ludzki dowód do czasu case studies. */
export function TeamNote() {
  const t = pl.teamNote;
  const ref = useReveal<HTMLElement>(0.05);

  return (
    <section ref={ref} className="section-pad bg-surface">
      <Container>
        <div className="max-w-[62ch]">
          <p className="js-reveal label">{t.label}</p>
          <p className="js-reveal mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-ink md:text-3xl">
            {t.body}
          </p>
          <p className="js-reveal num mt-8 text-sm text-mute">{t.signature}</p>
        </div>
      </Container>
    </section>
  );
}
