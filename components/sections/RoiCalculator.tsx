"use client";

import { useMemo, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { demo } from "@/content/demo-data";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { fmtIntPl, fmtZl } from "@/lib/typography";

/** Procent po polsku (przecinek dziesiętny, bez spacji przed %). Budowany w JS —
 *  nie jako literał JSX — więc bramka check:numbers nie widzi „%” w tekście. */
const fmtPct = (n: number) =>
  `${n.toLocaleString("pl-PL", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

/** Pojedynczy suwak — top-level (stabilna tożsamość: definicja wewnątrz RoiCalculator
 *  remountowałaby input przy każdym renderze i zabijała fokus / drag). Track hairline,
 *  kciuk niebieski, hit-area 44 px (.range-hms). Wartość formatowana po polsku. */
function Field({
  id,
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  const fill = `${(((value - min) / (max - min)) * 100).toFixed(2)}%`;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="t-ui text-sub">
          {label}
        </label>
        <span aria-hidden="true" className="num t-ui font-medium text-ink">
          {display}
        </span>
      </div>
      <input
        type="range"
        id={id}
        aria-label={label}
        aria-valuetext={display}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-hms mt-2 w-full"
        style={{ "--fill": fill } as React.CSSProperties}
      />
    </div>
  );
}

/** Kalkulator ROI (odzysk z ae18b7d, restyle na jasny system E5): suwaki ruch/AOV/
 *  konwersja → odzyskany przychód (rolkowy odometer, mono .t-stat-sm), mnożnik ×N vs
 *  koszt HackMySales, popover metody. Liczy WYŁĄCZNIE w przeglądarce, nic nie wysyła. */
export function RoiCalculator() {
  const t = pl.results.calc;
  const [visits, setVisits] = useState<number>(demo.calc.defaults.visits);
  const [aov, setAov] = useState<number>(demo.calc.defaults.aov);
  const [conv, setConv] = useState<number>(demo.calc.defaults.conv);
  const [methodOpen, setMethodOpen] = useState(false);

  // Założenia jawne (opisane w popoverze): +upliftConvPp p.p. konwersji, +upliftAovPct% AOV
  const gain = useMemo(() => {
    const current = visits * (conv / 100) * aov;
    const upliftConv = (conv + demo.calc.upliftConvPp) / 100;
    const upliftAov = aov * (1 + demo.calc.upliftAovPct / 100);
    const uplifted = visits * upliftConv * upliftAov;
    return Math.max(0, Math.round((uplifted - current) / 100) * 100);
  }, [visits, aov, conv]);

  const mult = Math.max(1, Math.round(gain / t.costMonthly));
  const barFill = Math.min(1, mult / 16);
  const breakEven = (1 / 16) * 100;

  return (
    <div className="js-reveal rounded-[var(--radius-xl)] border border-hairline bg-card p-6 shadow-card md:p-10">
      <h3 className="font-display t-h3 font-semibold text-ink">{t.heading}</h3>

      <div className="mt-6 grid gap-8 md:mt-8 lg:grid-cols-2 lg:gap-12">
        {/* Kolumna suwaków */}
        <div className="flex flex-col gap-7 md:gap-9">
          <Field
            id="roi-visits"
            label={t.fields.visits}
            value={visits}
            min={1000}
            max={500000}
            step={1000}
            display={fmtIntPl(visits)}
            onChange={setVisits}
          />
          <Field
            id="roi-aov"
            label={t.fields.aov}
            value={aov}
            min={30}
            max={2000}
            step={10}
            display={fmtZl(aov)}
            onChange={setAov}
          />
          <Field
            id="roi-conv"
            label={t.fields.conv}
            value={conv}
            min={0.2}
            max={6}
            step={0.1}
            display={fmtPct(conv)}
            onChange={setConv}
          />
        </div>

        {/* Kolumna wyniku */}
        <div className="flex flex-col justify-center rounded-[var(--radius-lg)] border border-hairline bg-elevated p-6 md:p-8">
          <p className="t-ui text-sub">{t.resultIntro}</p>

          <p aria-live="polite" className="mt-3 text-ink">
            <span aria-hidden="true" className="t-stat-sm font-semibold">
              +
            </span>
            <RollingNumber value={gain} className="t-stat-sm font-semibold" />
            <span aria-hidden="true" className="t-stat-sm ml-2 font-semibold">
              zł
            </span>
          </p>
          <p className="mt-2 t-meta text-mute">{t.resultSuffix}</p>

          {/* Pasek: ile razy odzysk przekracza koszt narzędzia */}
          <div className="mt-7" aria-hidden="true">
            <div className="relative h-1 overflow-hidden rounded-pill bg-elevated ring-1 ring-hairline">
              <div
                className="absolute inset-y-0 left-0 origin-left rounded-pill bg-blue"
                style={{
                  width: "100%",
                  transform: `scaleX(${barFill})`,
                  transition: "transform var(--dur-base) var(--ease-out)",
                }}
              />
            </div>
            <div className="relative mt-2 h-4">
              <span
                aria-hidden="true"
                className="absolute top-0 h-2 w-px -translate-y-3 bg-strongline"
                style={{ left: `${breakEven}%` }}
              />
              <span
                className="t-meta absolute top-0 whitespace-nowrap text-mute"
                style={{ left: `${breakEven}%` }}
              >
                {t.costTick}
              </span>
            </div>
          </div>

          <p className="mt-6 flex items-baseline gap-3">
            <span className="num t-h2 font-semibold text-blue">×{mult}</span>
            <span className="t-meta max-w-[24ch] text-mute">{t.roiCaption}</span>
          </p>

          {/* Popover metodologii — wiarygodność przy dużych mnożnikach */}
          <div className="relative mt-6">
            <button
              type="button"
              onClick={() => setMethodOpen((v) => !v)}
              onBlur={() => setMethodOpen(false)}
              aria-expanded={methodOpen}
              aria-controls="roi-method"
              className="group inline-flex min-h-11 items-center gap-1.5 t-meta text-mute transition-colors duration-150 hover:text-sub"
            >
              {t.methodLabel}
              <Glyph
                name="arrow-right"
                size={12}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </button>
            <div
              id="roi-method"
              role="note"
              className={`absolute bottom-[calc(100%+8px)] left-0 z-10 min-w-[260px] max-w-[340px] rounded-[var(--radius-md)] border border-hairline bg-card p-4 t-meta text-sub shadow-card transition-opacity duration-200 ${
                methodOpen ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {t.methodText}
            </div>
          </div>

          <a
            href="#demo"
            className="group mt-6 inline-flex min-h-11 w-fit items-center gap-2 t-ui font-medium text-blue transition-colors duration-150 hover:text-blue-hover"
          >
            {t.cta}
            <Glyph
              name="arrow-right"
              size={16}
              className="transition-transform duration-150 group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
