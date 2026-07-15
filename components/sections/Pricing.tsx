"use client";

import { useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { SnapRow } from "@/components/mobile/SnapRow";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { gsap, useReveal } from "@/lib/motion";

/** Cennik (redesign, copy §9 + §9b): Growth = JEDYNA ciemna karta leśna wśród
 *  papierowych (ref-2), akcent kwasowy na CTA/checkach. Hairline + lift na hover
 *  (bez spotlight-border/border-beam — anti-slop). Progressive disclosure featureów. */

function PlanCard({
  plan,
  expanded,
  yearly,
  onToggle,
}: {
  plan: (typeof pl.pricing.plans)[number];
  expanded: boolean;
  yearly: boolean;
  onToggle: () => void;
}) {
  const t = pl.pricing;
  const dark = plan.featured;

  const featureRow = (label: string, i: number) => {
    const val = plan.features[i];
    const off = val === "no";
    const labelCls = off
      ? dark
        ? "text-onforest/45"
        : "text-mute"
      : dark
        ? "text-onforest/85"
        : "text-sub";
    return (
      <li key={label} className={`flex items-center justify-between gap-3 text-sm ${labelCls}`}>
        <span className="flex items-center gap-2.5">
          {off ? (
            <Glyph name="minus" size={15} className={`shrink-0 ${dark ? "text-onforest/40" : "text-mute"}`} />
          ) : (
            <Glyph name="check" size={15} className={`shrink-0 ${dark ? "text-acid" : "text-forest-700"}`} />
          )}
          {label}
          {off && <span className="sr-only">— niedostępne w tym planie</span>}
        </span>
        {val !== "yes" && val !== "no" && (
          <span className={`num shrink-0 text-xs ${dark ? "text-onforest" : "text-ink"}`}>{val}</span>
        )}
      </li>
    );
  };

  return (
    <div
      className={`js-reveal relative rounded-[var(--radius-lg)] border p-8 transition-[transform,border-color] duration-300 hover:-translate-y-1 ${
        dark
          ? "border-transparent bg-forest-950 text-onforest [box-shadow:var(--shadow-float)] lg:-mt-3 lg:mb-3"
          : "border-hairline bg-l1 hover:border-strongline"
      }`}
      style={{ transitionTimingFunction: "var(--ease-out)" }}
    >
      {dark && <div className="noise-forest rounded-[var(--radius-lg)]" aria-hidden="true" />}
      <div className="relative">
        {"badge" in plan && plan.badge && (
          <p className="absolute -top-11 left-0 rounded-full bg-acid px-3 py-1 text-xs font-medium text-onacid">
            {plan.badge}
          </p>
        )}
        <h3 className={`font-display text-lg font-semibold tracking-tight ${dark ? "text-onforest" : "text-ink"}`}>
          {plan.name}
        </h3>
        <p className={`mt-4 ${dark ? "text-onforest" : "text-ink"}`}>
          {"priceMonthly" in plan && plan.priceMonthly ? (
            <span className="num text-3xl font-semibold tracking-tight">
              <RollingNumber value={yearly ? plan.priceYearly : plan.priceMonthly} /> zł
            </span>
          ) : (
            <span className="font-display text-2xl font-semibold tracking-tight">{plan.price}</span>
          )}
          {plan.period && <span className={`num text-base ${dark ? "text-onforest/70" : "text-sub"}`}>{plan.period}</span>}
        </p>
        <p className={`mt-1 text-sm ${dark ? "text-onforest/60" : "text-mute"}`}>
          {yearly && "priceYearly" in plan && plan.priceYearly ? t.billing.yearlyNote : plan.audience}
        </p>

        <ul className={`mt-7 flex flex-col gap-3 border-t pt-7 ${dark ? "border-line-dark" : "border-hairline"}`}>
          {t.featureLabels.slice(0, t.visibleRows).map((label, i) => featureRow(label, i))}
        </ul>

        <div
          className="grid transition-[grid-template-rows] duration-300"
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr", transitionTimingFunction: "var(--ease-out)" }}
        >
          <div className="overflow-hidden">
            <ul className="flex flex-col gap-3 pt-3">
              {t.featureLabels.slice(t.visibleRows).map((label, i) => featureRow(label, i + t.visibleRows))}
            </ul>
          </div>
        </div>
        <button
          onClick={onToggle}
          aria-expanded={expanded}
          className={`mt-2 flex min-h-11 items-center gap-1.5 text-xs font-medium transition-colors duration-150 md:mt-4 md:min-h-0 ${
            dark ? "text-onforest/60 hover:text-onforest" : "text-mute hover:text-sub"
          }`}
        >
          {expanded ? t.lessLabel : t.moreLabel}
          <Glyph name="chevron-down" size={13} className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
        </button>

        <Button href="#demo" variant={dark ? "primary" : "ghost"} size="md" className="mt-6 w-full">
          {plan.cta}
        </Button>
      </div>
    </div>
  );
}

export function Pricing() {
  const t = pl.pricing;
  const ref = useReveal<HTMLElement>(0.08);
  const [expanded, setExpanded] = useState(false);
  const [yearly, setYearly] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);

  const switchBilling = (toYearly: boolean) => {
    if (toYearly === yearly) return;
    setYearly(toYearly);
    if (toYearly && badgeRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(badgeRef.current, { scale: 1 }, { scale: 1.18, duration: 0.16, yoyo: true, repeat: 1, ease: "power1.inOut" });
    }
  };

  return (
    <section ref={ref} id="cennik" className="section-pad bg-page">
      <Container>
        <SectionLabel num="11">{t.label}</SectionLabel>
        <SectionH2>{t.h2}</SectionH2>
        <p className="t-lead js-reveal mt-5 max-w-[62ch] text-sub">{t.lead}</p>

        {/* Przełącznik rozliczenia — segmentowany, ink thumb */}
        <div className="js-reveal mt-10 flex items-center gap-3">
          <div className="flex rounded-full border border-hairline bg-l1 p-1" role="group" aria-label="Okres rozliczenia">
            {[t.billing.monthly, t.billing.yearly].map((label, i) => (
              <button
                key={label}
                onClick={() => switchBilling(i === 1)}
                aria-pressed={yearly === (i === 1)}
                className={`inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 md:min-h-0 ${
                  yearly === (i === 1) ? "bg-forest-950 text-onforest" : "text-sub hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span
            ref={badgeRef}
            className={`num inline-block rounded-full px-3 py-1.5 text-xs transition-colors duration-200 ${
              yearly ? "bg-acid text-onacid" : "bg-l1 text-mute"
            }`}
          >
            {t.billing.badge}
          </span>
        </div>

        <SnapRow
          className="mt-16"
          ariaLabel={pl.mobile.carousel.plans}
          goToLabel={pl.mobile.carousel.goTo}
          slideClassName="w-[85vw]"
          initial={1}
          mdGridCols="md:items-start lg:grid-cols-3"
          items={t.plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              expanded={expanded}
              yearly={yearly}
              onToggle={() => setExpanded((v) => !v)}
            />
          ))}
        />

        <p className="js-reveal mt-10 text-sm text-mute">{t.note}</p>
      </Container>
    </section>
  );
}
