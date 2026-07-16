"use client";

import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { useReveal } from "@/lib/motion";

/** Dowód społeczny — STRUKTURA do uzupełnienia realnymi danymi (drugi najczęstszy blocker
 *  w teście person po cenie). Loga/cytaty/mini-case to placeholdery [...] — właściciel podmienia
 *  za zgodą klientów. Do tego czasu sekcja jasno sygnalizuje „w przygotowaniu" (bez fałszywego proof). */
export function SocialProof() {
  const t = pl.proof;
  const ref = useReveal<HTMLElement>(0.05);
  return (
    <section ref={ref} id="referencje" className="section-pad bg-page">
      <Container>
        <SectionLabel>{t.label}</SectionLabel>
        <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>
        <p className="js-reveal mt-3 text-sm text-mute">{t.editorial}</p>

        {/* pas logotypów — placeholder (obrys przerywany sygnalizuje „do uzupełnienia") */}
        <ul className="js-reveal mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {t.logos.map((l, i) => (
            <li
              key={i}
              className="flex h-16 items-center justify-center rounded-md border border-dashed border-strongline text-xs text-mute"
            >
              {l}
            </li>
          ))}
        </ul>

        {/* cytaty właścicieli */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {t.quotes.map((q, i) => (
            <figure key={i} className="js-reveal flex flex-col gap-4 rounded-lg border border-hairline bg-surface p-6">
              <p className="num text-2xl font-semibold text-forest-700">{q.metric}</p>
              <blockquote className="leading-relaxed text-sub">{q.body}</blockquote>
              <figcaption className="mt-auto text-sm text-ink">
                <span className="font-medium">{q.author}</span>
                <span className="mt-0.5 block text-mute">{q.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* mini-case przed/po */}
        <div className="js-reveal mt-6 grid gap-6 rounded-lg border border-hairline bg-surface p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
          <div>
            <p className="label text-blue-soft">{t.caseLabel}</p>
            <p className="mt-3 text-sm text-ink">{t.caseData.shop}</p>
            <p className="mt-3 text-sm leading-relaxed text-sub">
              <span className="text-mute">Przed:</span> {t.caseData.before}
            </p>
          </div>
          <p className="self-end text-sm leading-relaxed text-sub">
            <span className="text-mute">Po:</span> {t.caseData.after}
          </p>
        </div>
      </Container>
    </section>
  );
}
