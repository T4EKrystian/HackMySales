"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { gsap, useReveal } from "@/lib/motion";
import { fmtIntPl } from "@/lib/typography";
import { setAmbientValue } from "@/lib/ambient";

/** Pole kalkulatora — top-level (stabilna tożsamość komponentu; definicja wewnątrz
 *  RoiCalculator remountowałaby inputy przy każdym renderze i zabijała fokus). */
function Field({
  id, label, value, min, max, step, display, onChange,
}: {
  id: string; label: string; value: number; min: number; max: number; step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const fill = `${(((value - min) / (max - min)) * 100).toFixed(2)}%`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-sub">{label}</label>
        <input
          type="number"
          id={id}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="num w-28 min-h-11 rounded-lg border border-hairline bg-field px-3 py-1.5 text-right text-sm text-ink md:min-h-0"
        />
      </div>
      <div className="range-wrap mt-4" style={{ "--fill": fill } as React.CSSProperties}>
        <span className="range-bubble" aria-hidden="true">{display}</span>
        <input
          type="range"
          aria-label={label}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="range-hms"
          style={{ "--fill": fill } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

/** Kalkulator ROI v3 (features §L2 + copy §6b): custom slidery z bąblem wartości,
 *  rolkowy odometer, pasek i mnożnik ×N vs koszt planu Growth, pojedynczy rozbłysk
 *  przy przekroczeniu progu (bez konfetti). Liczy wyłącznie client-side. */
function RoiCalculator() {
  const t = pl.results.calc;
  const [visits, setVisits] = useState(20000);
  const [aov, setAov] = useState(180);
  const [conv, setConv] = useState(1.8);
  const [methodOpen, setMethodOpen] = useState(false);
  const resultBoxRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const prevGain = useRef(0);

  // Założenia jawne (opisane pod wynikiem): +0,5 p.p. konwersji, +10% AOV
  const gain = useMemo(() => {
    const current = visits * (conv / 100) * aov;
    const uplift = visits * ((conv + 0.5) / 100) * aov * 1.1;
    return Math.max(0, Math.round((uplift - current) / 100) * 100);
  }, [visits, aov, conv]);

  const mult = Math.max(1, Math.round((gain * 12) / (t.costMonthly * 12)));
  const barFill = Math.min(1, mult / 16);

  // Glow-burst raz przy przekroczeniu progu w górę (motion.md §3)
  useEffect(() => {
    // v5: gęstość ambientu w strefie „wyniki" rośnie z odzyskiem (0.3→0.5 przy 2× progu)
    setAmbientValue("wyniki", gain / (t.glowThreshold * 2));
    const crossed = prevGain.current < t.glowThreshold && gain >= t.glowThreshold;
    prevGain.current = gain;
    if (!crossed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (resultBoxRef.current) {
      gsap.fromTo(
        resultBoxRef.current,
        { boxShadow: "0 0 0 0 var(--blue-glow)" },
        { boxShadow: "0 0 0 22px transparent", duration: 0.9, ease: "power2.out" }
      );
    }
    if (ctaRef.current) {
      gsap.fromTo(ctaRef.current, { scale: 1 }, { scale: 1.04, duration: 0.18, yoyo: true, repeat: 3, ease: "power1.inOut" });
    }
  }, [gain, t.glowThreshold]);

  return (
    <div className="js-reveal rounded-[var(--radius-xl)] border border-hairline bg-card p-6 shadow-card md:p-10">
      <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">{t.heading}</h3>
      <div className="mt-6 grid gap-7 md:mt-8 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col gap-6 md:gap-8">
          <Field id="roi-visits" label={t.fields.visits} value={visits} min={1000} max={500000} step={1000} display={fmtIntPl(visits)} onChange={setVisits} />
          <Field id="roi-aov" label={t.fields.aov} value={aov} min={30} max={2000} step={10} display={`${fmtIntPl(aov)} zł`} onChange={setAov} />
          <Field id="roi-conv" label={t.fields.conv} value={conv} min={0.2} max={6} step={0.1} display={`${String(conv).replace(".", ",")}%`} onChange={setConv} />
        </div>

        <div ref={resultBoxRef} className="flex flex-col justify-center rounded-[var(--radius-lg)] border border-hairline bg-surface p-6 md:p-7">
          <p className="text-sm leading-relaxed text-sub">{t.resultIntro}</p>
          <p aria-live="polite" className="mt-4 font-display font-bold tracking-tight text-ink">
            <span className="num text-4xl md:text-5xl">
              +<RollingNumber value={gain} /> zł
            </span>
            <span className="ml-2 text-base font-normal text-sub">{t.resultSuffix}</span>
          </p>

          {/* Pasek: ile razy odzysk przekracza koszt narzędzia (§6b) */}
          <div className="mt-6" aria-hidden="true">
            <div className="relative h-1 rounded-full bg-elevated">
              <div
                className="absolute inset-y-0 left-0 origin-left rounded-full bg-blue transition-transform duration-500"
                style={{ width: "100%", transform: `scaleX(${barFill})`, transitionTimingFunction: "var(--ease-out)" }}
              />
              <span className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-strongline" style={{ left: `${(1 / 16) * 100}%` }} />
            </div>
            <p className="num mt-2 text-[13px] md:text-[10px] uppercase tracking-[0.08em] text-mute" style={{ marginLeft: `${(1 / 16) * 100}%` }}>
              {t.costTick}
            </p>
          </div>

          <p className="mt-5 flex items-baseline gap-3">
            <span className="num text-3xl font-bold tracking-tight text-blue-soft">×{mult}</span>
            <span className="max-w-[24ch] text-xs leading-snug text-mute">{t.roiCaption}</span>
          </p>

          {/* Popover metodologii (copy §6b) — wiarygodność przy dużych mnożnikach */}
          <div className="relative mt-5">
            <button
              onClick={() => setMethodOpen((v) => !v)}
              onBlur={() => setMethodOpen(false)}
              aria-expanded={methodOpen}
              aria-controls="roi-method"
              className="group inline-flex min-h-11 items-center gap-1.5 text-xs text-mute transition-colors duration-150 hover:text-sub md:min-h-0"
            >
              {t.methodLabel}
              <Glyph name="arrow-right" size={12} className="transition-transform duration-150 group-hover:translate-x-0.5" />
            </button>
            <div
              id="roi-method"
              role="note"
              className={`absolute bottom-[calc(100%+8px)] left-0 z-10 w-[minmax(0,1fr)] min-w-[260px] max-w-[340px] rounded-xl border border-line-2 bg-l3 p-4 text-xs leading-relaxed text-sub shadow-card transition-opacity duration-200 ${
                methodOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {t.methodText}
            </div>
          </div>
          <a
            ref={ctaRef}
            href="#demo"
            className="group mt-4 inline-flex min-h-11 w-fit items-center gap-2 text-sm font-medium text-blue-soft hover:text-ink md:mt-6 md:min-h-0"
          >
            {t.cta}
            <Glyph name="arrow-right" size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function Results() {
  const t = pl.results;
  const ref = useReveal<HTMLElement>(0.08);

  return (
    <section ref={ref} id="wyniki" className="section-pad">
      <Container>
        <SectionLabel num="09">{t.label}</SectionLabel>
        <SectionH2>{t.h2}</SectionH2>

        {/* Kolejność bloków: kalkulator → nocna zmiana → liczniki (motion.md, 2026-07-10) */}
        <div className="mt-10 md:mt-14">
          <RoiCalculator />
        </div>

        {/* Licznik nocnej zmiany (features.md §L4) */}
        <div className="js-reveal mt-5 rounded-[var(--radius-lg)] border border-hairline bg-card p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-ink">
              <Glyph name="moon" size={20} className="text-blue-soft" />
              {t.night.title}
            </p>
            <dl className="grid grid-cols-3 gap-8">
              {t.night.stats.map((s, i) => (
                <div key={i}>
                  <dd className="font-display text-2xl font-bold tracking-tight text-ink">
                    <Counter value={s.value} suffix={s.unit ? ` ${s.unit}` : ""} />
                  </dd>
                  <dt className="mt-1 text-xs text-mute">{s.label}</dt>
                </div>
              ))}
            </dl>
            <p className="label">{t.night.caption}</p>
          </div>
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
                  <span className="num text-3xl font-bold tracking-tight md:text-4xl">{c.static}</span>
                ) : (
                  <Counter
                    value={(c as { value: number }).value}
                    prefix={(c as { prefix?: string }).prefix}
                    suffix={(c as { suffix?: string }).suffix}
                    className="text-3xl font-bold tracking-tight md:text-4xl"
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
