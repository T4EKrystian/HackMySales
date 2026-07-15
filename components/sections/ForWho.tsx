"use client";

import { useState } from "react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { ChatShell } from "@/components/chat/ChatShell";
import { exchangeToScript } from "@/components/chat/script";
import { PersonaRow } from "@/components/chat/parts";
import { useReveal } from "@/lib/motion";

/** Sekcja „Dla kogo” (copy §3c, features §L12): 4 branże, każda z bólem, przykładową
 *  wymianą i chipem efektu. Zmiana zakładki = CSS fade-up. v2 (kom. klienta): bez packshotu
 *  — editorialny label branży + ból prowadzą, ramka lżejsza (koniec „AI-mockup"). */
export function ForWho() {
  const t = pl.forWho;
  const ref = useReveal<HTMLElement>(0.08);
  const [active, setActive] = useState(0);
  const seg = t.segments[active];

  return (
    <section ref={ref} id="branze" className="section-pad bg-surface">
      <Container className="max-w-[980px]">
        <SectionLabel num="06">{t.label}</SectionLabel>
        <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>

        {/* Zakładki */}
        <div className="js-reveal mt-10 flex flex-wrap gap-2" role="group" aria-label="Wybierz branżę">
          {t.segments.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
              className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-150 md:min-h-0 ${
                i === active
                  ? "border-blue bg-blue-tint text-blue-soft"
                  : "border-hairline text-sub hover:border-strongline hover:bg-elevated"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Panel branży */}
        <div className="js-reveal mt-6 rounded-[var(--radius-xl)] border border-hairline bg-surface p-7 md:p-9">
          <div key={seg.key} className="fade-in-panel grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="label text-forest-700">{seg.label}</p>
              <p className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight text-ink md:text-2xl">
                {seg.pain}
              </p>
              <p className="num mt-6 inline-block rounded-full bg-blue-tint px-3.5 py-1.5 text-xs text-blue-soft">
                {seg.chip}
              </p>
            </div>
            <div className="min-w-0">
              {/* v6: Magda w headerze każdej rozmowy branżowej (brief F5 pkt 10) */}
              <div className="mb-4 border-b border-hairline pb-3">
                <PersonaRow presence={pl.hero.chat.persona.status} />
              </div>
              <ChatShell
                chrome="bare"
                mode="static"
                skin="onsite"
                script={exchangeToScript(seg.key, { user: seg.user, bot: seg.bot })}
                bodyClassName="gap-3"
              />
            </div>
          </div>
        </div>

        <p className="js-reveal mt-6 text-sm text-mute">{t.caption}</p>
      </Container>
    </section>
  );
}
