"use client";

import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { useReveal } from "@/lib/motion";

/** Wyniki (rewizja 2): bez interaktywnego kalkulatora — zostaje pas 4 twardych
 *  statystyk (spójna listwa danych z hairline-dzielnikami, nie 4 identyczne karty).
 *  Liczby count-up on-enter; „24/7" statyczne. */
export function Results() {
  const t = pl.results;
  const ref = useReveal<HTMLElement>(0.08);

  return (
    <section ref={ref} id="wyniki" className="section-pad">
      <Container>
        <SectionLabel>{t.label}</SectionLabel>
        <SectionH2 className="max-w-[22ch]">{t.h2}</SectionH2>

        {/* Pas metryk (jeden panel, 4 kolumny z hairline-dzielnikami) */}
        <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-[var(--radius-lg)] border border-hairline bg-card md:mt-14 lg:grid-cols-4">
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
              <p className="mt-3 text-sm leading-relaxed text-sub">{c.label}</p>
            </div>
          ))}
        </div>
        <p className="js-reveal mt-4 text-xs text-mute">{t.countersCaption}</p>
      </Container>
    </section>
  );
}
