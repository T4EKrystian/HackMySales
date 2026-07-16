"use client";

import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { useReveal } from "@/lib/motion";

/** Wyniki v3 (E5): dowód rachunkowy zamiast generycznego stat-gridu.
 *  Nagłówek → interaktywny kalkulator ROI → pas 4 liczników → JEDNA uczciwa nota.
 *  Liczby count-up on-enter; „24/7” statyczne. Kalkulator liczy tylko client-side. */
export function Results() {
  const t = pl.results;
  const ref = useReveal<HTMLElement>(0.08, { y: 12 });

  return (
    <section ref={ref} id="wyniki" className="section-pad">
      <Container>
        <SectionLabel>{t.label}</SectionLabel>
        <SectionH2 className="max-w-[18ch]">{t.h2}</SectionH2>

        {/* Kalkulator ROI — sedno dowodu rachunkowego */}
        <div className="mt-10 md:mt-14">
          <RoiCalculator />
        </div>

        {/* Pas metryk (jeden panel, 4 kolumny z hairline-dzielnikami) — anti-slop:
            NIE 4 identyczne karty z obrysem, tylko spójna listwa danych */}
        <div className="mt-5 grid grid-cols-2 overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-card lg:grid-cols-4">
          {t.counters.map((c, i) => (
            <div
              key={i}
              className="js-reveal border-hairline p-5 md:p-7 [&:nth-child(-n+2)]:border-b [&:nth-child(odd)]:border-r lg:border-b-0 lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(even)]:border-r"
            >
              <p className="font-display text-ink">
                {"static" in c && c.static ? (
                  <span className="t-stat-sm font-semibold">{c.static}</span>
                ) : (
                  <Counter
                    value={(c as { value: number }).value}
                    prefix={(c as { prefix?: string }).prefix}
                    suffix={(c as { suffix?: string }).suffix}
                    className="t-stat-sm font-semibold"
                  />
                )}
              </p>
              <p className="mt-3 t-ui leading-relaxed text-sub">{c.label}</p>
            </div>
          ))}
        </div>

        {/* JEDNA uczciwa nota zamykająca — koniec hedgingu rozsianego po sekcji */}
        <p className="js-reveal mt-5 max-w-[62ch] t-meta text-mute">{t.note}</p>
      </Container>
    </section>
  );
}
