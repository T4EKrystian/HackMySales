"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRight, MoonStar } from "lucide-react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { gsap, useGSAP, useReveal } from "@/lib/motion";

import { fmtIntPl as fmtNum } from "@/lib/typography";

/** Kalkulator ROI (features.md §L2) — liczy wyłącznie client-side. */
function RoiCalculator() {
  const t = pl.results.calc;
  const [visits, setVisits] = useState(20000);
  const [aov, setAov] = useState(180);
  const [conv, setConv] = useState(1.8);
  const resultRef = useRef<HTMLSpanElement>(null);
  const shown = useRef(0);

  // Założenia jawne (opisane pod wynikiem): +0,5 p.p. konwersji, +10% AOV
  const gain = useMemo(() => {
    const current = visits * (conv / 100) * aov;
    const uplift = visits * ((conv + 0.5) / 100) * aov * 1.1;
    return Math.max(0, Math.round((uplift - current) / 100) * 100);
  }, [visits, aov, conv]);

  // Animowane odliczanie do nowej wartości (reduced-motion: bez tweenu)
  useGSAP(() => {
    const el = resultRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      shown.current = gain;
      el.textContent = fmtNum(gain);
      return;
    }
    const obj = { v: shown.current };
    gsap.to(obj, {
      v: gain,
      duration: 0.5,
      ease: "power2.out",
      onUpdate: () => { el.textContent = fmtNum(obj.v); },
      onComplete: () => { shown.current = gain; },
    });
  }, [gain]);

  const Field = ({
    id, label, value, min, max, step, onChange,
  }: {
    id: string; label: string; value: number; min: number; max: number; step: number;
    onChange: (v: number) => void;
  }) => (
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
          className="num w-28 rounded-lg border border-hairline bg-field px-3 py-1.5 text-right text-sm text-ink"
        />
      </div>
      <input
        type="range"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--blue-500)]"
      />
    </div>
  );

  return (
    <div className="js-reveal rounded-[var(--radius-xl)] border border-hairline bg-card p-8 shadow-card md:p-10">
      <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">{t.heading}</h3>
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-7">
          <Field id="roi-visits" label={t.fields.visits} value={visits} min={1000} max={500000} step={1000} onChange={setVisits} />
          <Field id="roi-aov" label={t.fields.aov} value={aov} min={30} max={2000} step={10} onChange={setAov} />
          <Field id="roi-conv" label={t.fields.conv} value={conv} min={0.2} max={6} step={0.1} onChange={setConv} />
        </div>
        <div className="flex flex-col justify-center rounded-[var(--radius-lg)] border border-hairline bg-surface p-7">
          <p className="text-sm leading-relaxed text-sub">{t.resultIntro}</p>
          <p aria-live="polite" className="mt-4 font-display font-bold tracking-tight text-ink">
            <span className="num text-4xl md:text-5xl">
              +<span ref={resultRef}>{fmtNum(gain)}</span> zł
            </span>
            <span className="ml-2 text-base font-normal text-sub">{t.resultSuffix}</span>
          </p>
          <details className="mt-5">
            <summary className="cursor-pointer text-xs text-mute underline-offset-4 hover:underline">
              {t.assumptionsTitle}
            </summary>
            <p className="mt-2 text-xs leading-relaxed text-mute">{t.assumptions}</p>
          </details>
          <a href="#demo" className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-soft hover:text-ink">
            {t.cta}
            <ArrowRight size={15} strokeWidth={1.75} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
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
        <SectionLabel num="08">{t.label}</SectionLabel>
        <SectionH2>{t.h2}</SectionH2>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {t.counters.map((c, i) => (
            <div key={i} className="js-reveal rounded-[var(--radius-lg)] border border-hairline bg-card p-7">
              <p className="font-display text-ink">
                {"static" in c && c.static ? (
                  <span className="num text-4xl font-bold tracking-tight">{c.static}</span>
                ) : (
                  <Counter
                    value={(c as { value: number }).value}
                    prefix={(c as { prefix?: string }).prefix}
                    suffix={(c as { suffix?: string }).suffix}
                    className="text-4xl font-bold tracking-tight"
                  />
                )}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-sub">{c.label}</p>
            </div>
          ))}
        </div>

        {/* Licznik nocnej zmiany (features.md §L4) */}
        <div className="js-reveal mt-5 rounded-[var(--radius-lg)] border border-hairline bg-card p-7">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <p className="flex items-center gap-3 font-display text-lg font-semibold tracking-tight text-ink">
              <MoonStar size={20} strokeWidth={1.75} className="text-blue-soft" aria-hidden="true" />
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

        <div className="mt-16">
          <RoiCalculator />
        </div>
      </Container>
    </section>
  );
}
