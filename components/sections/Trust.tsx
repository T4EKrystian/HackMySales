"use client";

import { useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Logo } from "@/components/ui/Logo";
import { useReveal } from "@/lib/motion";

/** Kontrola v3 (copy §8 + §8b): zamiast czterech boxów — działający panel sterowania.
 *  Lewa: realne kontrolki podpisane treścią punktów §8 (ton, eskalacja, zablokowane
 *  „Zmyślanie: OFF", RODO). Prawa: podgląd czatu zmieniający odpowiedź na żywo. */

function Toggle({
  on,
  onClick,
  label,
  locked = false,
}: {
  on: boolean;
  onClick?: () => void;
  label: string;
  locked?: boolean;
}) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={locked}
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 ${
        on ? "border-blue bg-blue" : "border-strongline bg-elevated"
      } ${locked ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <span
        aria-hidden="true"
        className={`absolute top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-card transition-transform duration-200 ${
          on ? "translate-x-[22px]" : "translate-x-[3px]"
        }`}
        style={{ transitionTimingFunction: "var(--ease-out)" }}
      >
        {locked && <Glyph name="lock" size={9} className="text-mute" />}
      </span>
    </button>
  );
}

export function Trust() {
  const t = pl.trust;
  const p = t.panel;
  const ref = useReveal<HTMLElement>(0.08);
  const [tone, setTone] = useState(0); // 0 = formalny, 1 = luźny
  const [esc, setEsc] = useState(true);

  const answer = tone === 0 ? p.answers.formal : p.answers.casual;
  const followUp = esc ? p.answers.escalationOn : p.answers.escalationOff;
  const [noInvent, humanHandoff, rodo, toneItem] = [t.items[0], t.items[1], t.items[2], t.items[3]];

  return (
    <section ref={ref} className="section-pad">
      <Container>
        <SectionLabel num="10">{t.label}</SectionLabel>
        <SectionH2 className="max-w-[22ch]">{t.h2}</SectionH2>

        <div className="mt-14 grid items-start gap-8 lg:grid-cols-[1.05fr_1fr]">
          {/* Panel kontrolny — pokazujemy kontrolę zamiast o niej pisać */}
          <div className="flex flex-col divide-y divide-[var(--border-hairline)] rounded-[var(--radius-xl)] border border-hairline bg-card">
            {/* Ton */}
            <div className="js-reveal p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-display text-base font-semibold tracking-tight text-ink">{toneItem.title}</p>
                <div className="flex rounded-full border border-hairline p-0.5" role="group" aria-label={p.toneLabel}>
                  {p.tones.map((tn, i) => (
                    <button
                      key={tn}
                      onClick={() => setTone(i)}
                      aria-pressed={tone === i}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                        tone === i ? "bg-blue text-onblue" : "text-sub hover:text-ink"
                      }`}
                    >
                      {tn}
                    </button>
                  ))}
                </div>
              </div>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-sub">{toneItem.body}</p>
            </div>

            {/* Eskalacja */}
            <div className="js-reveal p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-display text-base font-semibold tracking-tight text-ink">{humanHandoff.title}</p>
                <Toggle on={esc} onClick={() => setEsc((v) => !v)} label={p.escalationLabel} />
              </div>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-sub">{humanHandoff.body}</p>
            </div>

            {/* Zmyślanie — zablokowane (to nie opcja, to konstrukcja) */}
            <div className="js-reveal p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-display text-base font-semibold tracking-tight text-ink">
                  {noInvent.title}
                  <span className="num ml-3 rounded-full border border-hairline px-2.5 py-1 text-[10px] uppercase tracking-[0.08em] text-mute">
                    {p.inventOff}
                  </span>
                </p>
                <Toggle on={false} locked label={p.inventLabel} />
              </div>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-sub">{noInvent.body}</p>
            </div>

            {/* RODO */}
            <div className="js-reveal p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-display text-base font-semibold tracking-tight text-ink">{rodo.title}</p>
                <span className="num rounded-full bg-blue-tint px-3 py-1.5 text-[11px] text-blue-soft">{p.rodoBadge}</span>
              </div>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-sub">{rodo.body}</p>
            </div>
          </div>

          {/* Żywy podgląd — odpowiedź zmienia się przy każdym przełączeniu */}
          <div className="js-reveal frame-l2 relative overflow-hidden lg:sticky lg:top-24">
            <div className="glass-head absolute inset-x-0 top-0 z-10 flex items-center justify-between rounded-t-[19px] px-5 py-3.5">
              <div className="flex items-center gap-3">
                <Logo withWord={false} markSize={20} />
                <p className="text-sm font-medium text-ink">{pl.hero.chat.title}</p>
              </div>
              <p className="label">{p.previewLabel}</p>
            </div>
            <div className="flex min-h-[300px] flex-col gap-4 p-5 pt-[70px]">
              <div className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-blue px-4 py-3 text-sm leading-relaxed text-onblue">
                {p.question}
              </div>
              <div
                key={`${tone}-${esc ? 1 : 0}`}
                role="status"
                aria-live="polite"
                className="fade-in-panel flex max-w-[88%] flex-col gap-2 self-start"
              >
                <div className="rounded-2xl rounded-bl-md bg-elevated px-4 py-3 text-sm leading-relaxed text-ink">
                  {answer}
                </div>
                <div className="rounded-2xl rounded-bl-md bg-elevated px-4 py-3 text-sm leading-relaxed text-sub">
                  {followUp}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
