"use client";

import { pl } from "@/content/pl";
import { Glyph } from "@/components/ui/Glyph";
import { Logo } from "@/components/ui/Logo";
import { CheckGlyph } from "@/components/ui/kit";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { useReveal } from "@/lib/motion";

/** S? Różnica (redesign): dawną pinowaną „arenę" (4 rundy, ~3,4 ekranu pustki) zwijamy
 *  do GĘSTEJ tabeli hairline — „czatbot z FAQ ≠ handlowiec" wiersz po wierszu, bez
 *  boxów, bez pinu. Zwykły czatbot (X, wyciszony) vs HackMySales (check leśny, atrament). */
export function Comparison() {
  const t = pl.comparison;
  const ref = useReveal<HTMLElement>(0.05);

  return (
    <section ref={ref} id="roznica" className="section-pad relative bg-page">
      <Container className="max-w-[980px]">
        <SectionLabel num="04">{t.label}</SectionLabel>
        <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>

        {/* Nagłówek kolumn */}
        <div className="mt-14 grid grid-cols-2 gap-6 border-b border-hairline pb-4 sm:gap-14">
          <p className="label">{t.colLeft}</p>
          <p className="label flex items-center gap-2 text-ink">
            <Logo withWord={false} markSize={16} />
            {t.colRight}
          </p>
        </div>

        {/* Wiersze — separacja hairline (nie boxy) */}
        <div>
          {t.rows.map((row, i) => (
            <div
              key={i}
              className="js-reveal grid grid-cols-2 items-start gap-6 border-b border-hairline py-5 sm:gap-14"
            >
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-mute">
                <Glyph name="x" size={15} className="mt-0.5 shrink-0" />
                {row.left}
              </p>
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-ink">
                <CheckGlyph className="mt-1 shrink-0 text-forest-700" />
                {row.right}
              </p>
            </div>
          ))}
        </div>

        <p className="js-reveal mt-10 text-sm text-mute">{t.footer}</p>
      </Container>
    </section>
  );
}
