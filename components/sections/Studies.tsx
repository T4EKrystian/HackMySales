"use client";

import { useState } from "react";
import { pl } from "@/content/pl";
import { studies, type StudyGroup } from "@/content/studies";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { Glyph } from "@/components/ui/Glyph";
import { useReveal } from "@/lib/motion";

/** S5 Desire — 10 badań naukowych. 3 duże liczby count-up (dowód siły) + rozwijana
 *  lista hairline pogrupowana wg funkcji, z linkami DOI. Domyślnie widoczne 3 badania
 *  flagowe (echo liczb); toggle odsłania pozostałe. Anti-choice-overload: nie wall-at-once. */
export function Studies() {
  const t = pl.studies;
  const ref = useReveal<HTMLElement>(0.06);
  const [expanded, setExpanded] = useState(false);

  const byGroup = (key: StudyGroup) => studies.filter((s) => s.group === key);

  return (
    <section ref={ref} id="badania" className="section-pad bg-page">
      <Container>
        <SectionLabel>{t.label}</SectionLabel>
        <SectionH2 className="max-w-[26ch]">{t.h2}</SectionH2>
        <p className="js-reveal t-lead mt-5 max-w-[60ch] text-sub">{t.lead}</p>

        {/* 3 liczby flagowe — count-up on-enter */}
        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
          {t.stats.map((s, i) => (
            <div key={i} className="js-reveal border-t border-hairline pt-6">
              <p className="text-ink">
                <Counter
                  value={s.value}
                  decimals={s.decimals}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  className="t-stat"
                />
              </p>
              <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-sub">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Lista badań pogrupowana wg funkcji */}
        <div className="mt-16">
          {t.groups.map((g) => {
            const rows = byGroup(g.key as StudyGroup).filter((s) => expanded || s.featured);
            return (
              <div key={g.key} className="mt-8 first:mt-0">
                <h3 className="label">{g.label}</h3>
                <ul className="mt-3">
                  {rows.map((s) => (
                    <li
                      key={s.id}
                      className="grid grid-cols-1 gap-x-6 gap-y-2 border-t border-hairline py-5 md:grid-cols-[9.5rem_1fr_auto] md:items-baseline"
                    >
                      <span className="num text-sm font-medium text-forest-700">{s.metric ?? ""}</span>
                      <div className="min-w-0">
                        <p className="leading-snug text-ink">{s.finding}</p>
                        <p className="mt-1.5 text-xs leading-relaxed text-mute">{s.title}</p>
                      </div>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex shrink-0 items-center gap-1.5 text-sm text-sub transition-colors duration-150 hover:text-ink"
                      >
                        {t.sourceLabel}
                        <span className="num text-xs text-mute">{s.urlType}</span>
                        <Glyph name="arrow-right" size={14} className="-rotate-45 transition-transform duration-150 group-hover:translate-x-0.5" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              className="inline-flex items-center gap-2 rounded-full border border-hairline px-4 py-2 text-sm text-ink transition-colors duration-150 hover:border-strongline hover:bg-paper-deep"
            >
              {expanded ? t.lessLabel : t.moreLabel}
              <Glyph name={expanded ? "minus" : "plus"} size={14} />
            </button>
            <p className="max-w-[52ch] text-xs leading-relaxed text-mute">{t.disclaimer}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
