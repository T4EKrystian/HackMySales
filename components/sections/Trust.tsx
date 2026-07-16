"use client";

import { useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { gsap } from "@/lib/motion";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { ChatShell } from "@/components/chat/ChatShell";
import { trustPreviewToScript } from "@/components/chat/script";
import { PersonaRow } from "@/components/chat/parts";
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
      // aria-disabled zamiast disabled: kłódka ma reagować mikro-shake'iem na klik (F4)
      aria-disabled={locked || undefined}
      aria-label={label}
      onClick={onClick}
      className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors duration-200 before:absolute before:-inset-2.5 before:content-[''] ${
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
  const lockRef = useRef<HTMLDivElement>(null);

  // Kłódka: mikro-shake przy próbie kliknięcia (to nie opcja — to konstrukcja)
  const shakeLock = () => {
    if (!lockRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(lockRef.current, { x: -3 }, { x: 3, duration: 0.06, repeat: 3, yoyo: true, clearProps: "x" });
  };

  const answer = tone === 0 ? p.answers.formal : p.answers.casual;
  const followUp = esc ? p.answers.escalationOn : p.answers.escalationOff;
  const [noInvent, humanHandoff, rodo, toneItem] = [t.items[0], t.items[1], t.items[2], t.items[3]];

  return (
    <section ref={ref} data-ambient="kontrola" className="section-pad">
      <Container>
        <SectionLabel>{t.label}</SectionLabel>
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
                      className={`inline-flex min-h-11 items-center justify-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 md:min-h-0 ${
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
                  <span className="label ml-3 rounded-full border border-hairline px-2.5 py-1">
                    {p.inventOff}
                  </span>
                </p>
                <div ref={lockRef}>
                  <Toggle on={false} locked label={p.inventLabel} onClick={shakeLock} />
                </div>
              </div>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-sub">{noInvent.body}</p>
            </div>

            {/* RODO */}
            <div className="js-reveal p-6">
              <div className="flex items-center justify-between gap-4">
                <p className="font-display text-base font-semibold tracking-tight text-ink">{rodo.title}</p>
                <span className="rounded-full bg-blue-tint px-3 py-1.5 t-meta text-blue-deep">{p.rodoBadge}</span>
              </div>
              <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-sub">{rodo.body}</p>
            </div>
          </div>

          {/* Żywy podgląd — odpowiedź zmienia się przy każdym przełączeniu (v5: ChatShell + Magda) */}
          <div className="js-reveal frame-l2 relative overflow-hidden lg:sticky lg:top-24">
            <div className="glass-head absolute inset-x-0 top-0 z-10 flex items-center justify-between rounded-t-[19px] px-5 py-3.5">
              <PersonaRow presence={pl.hero.chat.persona.status} />
              <p className="label">{p.previewLabel}</p>
            </div>
            <div
              key={`${tone}-${esc ? 1 : 0}`}
              role="status"
              aria-live="polite"
              className="fade-in-fast"
            >
              <ChatShell
                chrome="bare"
                mode="static"
                skin="onsite"
                script={trustPreviewToScript(p.question, answer, followUp)}
                bodyClassName="min-h-[300px] p-5 pt-[70px]"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
