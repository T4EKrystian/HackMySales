"use client";

import { Check, X } from "lucide-react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Logo } from "@/components/ui/Logo";
import { useReveal } from "@/lib/motion";

/** Sekcja „Różnica” (copy §4b, features §L7): zwykły czatbot vs HackMySales.
 *  Bez fajerwerków — treść i kontrast kolumn robią robotę. */
export function Comparison() {
  const t = pl.comparison;
  const ref = useReveal<HTMLElement>(0.07);

  return (
    <section ref={ref} id="roznica" className="section-pad">
      <Container className="max-w-[980px]">
        <SectionLabel>{t.label}</SectionLabel>
        <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>

        <div className="js-reveal mt-14 overflow-hidden rounded-[var(--radius-lg)] border border-hairline">
          {/* Nagłówki kolumn */}
          <div className="grid grid-cols-2 border-b border-hairline">
            <p className="flex items-center gap-2 bg-card px-5 py-4 text-sm font-medium text-mute md:px-8">
              {t.colLeft}
            </p>
            <p className="flex items-center gap-2 border-l border-hairline bg-elevated px-5 py-4 text-sm font-medium text-ink md:px-8">
              <Logo withWord={false} markSize={16} />
              {t.colRight}
            </p>
          </div>

          {t.rows.map((row, i) => (
            <div key={i} className={`js-reveal grid grid-cols-2 ${i > 0 ? "border-t border-hairline" : ""}`}>
              <div className="flex items-start gap-3 bg-card px-5 py-5 md:px-8">
                <X size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-mute" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-mute">{row.left}</p>
              </div>
              <div className="flex items-start gap-3 border-l border-hairline bg-elevated px-5 py-5 md:px-8">
                <Check size={15} strokeWidth={2} className="mt-0.5 shrink-0 text-blue" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-ink">{row.right}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="js-reveal mt-8 text-sm text-mute">{t.footer}</p>
      </Container>
    </section>
  );
}
