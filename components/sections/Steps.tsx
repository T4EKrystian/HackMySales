"use client";

import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { useReveal } from "@/lib/motion";

/** Wdrożenie — 3 kroki, hairline, „zero developera". Rozbraja obiekcję „ile to roboty
 *  i czy potrzebuję programisty" (najczęstsza w teście person). Statyczne, reveal jak reszta. */
export function Steps() {
  const t = pl.how;
  const ref = useReveal<HTMLElement>(0.05);
  return (
    <section ref={ref} id="wdrozenie" className="section-pad bg-page">
      <Container>
        <SectionLabel>{t.label}</SectionLabel>
        <SectionH2 className="max-w-[20ch]">{t.h2}</SectionH2>
        <ol className="mt-14 grid gap-8 md:grid-cols-3 md:gap-10">
          {t.steps.map((s, i) => (
            <li key={i} className="js-reveal border-t border-hairline pt-6">
              <p className="num text-xs text-forest-700">0{i + 1}</p>
              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">{s.title}</h3>
              <p className="mt-2 max-w-[42ch] leading-relaxed text-sub">{s.body}</p>
            </li>
          ))}
        </ol>
        <p className="js-reveal mt-10 text-sm text-mute">{t.note}</p>
      </Container>
    </section>
  );
}
