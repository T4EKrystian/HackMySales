"use client";

import { useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { RollingNumber } from "@/components/ui/RollingNumber";
import { gsap, useReveal } from "@/lib/motion";

/** Cennik v3 (copy §9 + §9b): spotlight + lift na hover, border-beam na planie
 *  polecanym, progressive disclosure featureów (5 + „Pełne porównanie").
 *  Bez przełącznika rocznego — deck nie definiuje cen rocznych. */

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
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--spot-y", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
    el.style.setProperty("--spot-o", "1");
  };
  const onLeave = () => ref.current?.style.setProperty("--spot-o", "0");

  const featureRow = (label: string, i: number) => {
    const val = plan.features[i];
    const off = val === "no";
    return (
      <li key={label} className={`flex items-center justify-between gap-3 text-sm ${off ? "text-mute" : "text-sub"}`}>
        <span className="flex items-center gap-2.5">
          {off ? (
            <Glyph name="minus" size={15} className="shrink-0 text-mute" />
          ) : (
            <Glyph name="check" size={15} className="shrink-0 text-blue" />
          )}
          {label}
          {off && <span className="sr-only">— niedostępne w tym planie</span>}
        </span>
        {val !== "yes" && val !== "no" && <span className="num shrink-0 text-xs text-ink">{val}</span>}
      </li>
    );
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`js-reveal spot-card relative rounded-[var(--radius-lg)] border p-8 transition-transform duration-300 hover:-translate-y-1 ${
        plan.featured
          ? // anti-kitsch V6: wyróżnik Growth = beam + elewacja; kolorowy cień karty OUT
            "border-beam border-blue bg-l2 [box-shadow:var(--highlight-top),var(--shadow-l2)] lg:-mt-3 lg:mb-3"
          : "border-line-1 bg-l1"
      }`}
      style={{ transitionTimingFunction: "var(--ease-out)" }}
    >
      {"badge" in plan && plan.badge && (
        <p className="absolute -top-3 left-8 z-10 rounded-full bg-blue px-3 py-1 text-xs font-medium text-onblue">
          {plan.badge}
        </p>
      )}
      <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{plan.name}</h3>
      <p className="mt-4 text-ink">
        {"priceMonthly" in plan && plan.priceMonthly ? (
          // ceny przeliczają się rolką cyfr (copy §9b), nie skokiem
          <span className="num text-3xl font-bold tracking-tight">
            <RollingNumber value={yearly ? plan.priceYearly : plan.priceMonthly} /> zł
          </span>
        ) : (
          <span className="font-display text-2xl font-semibold tracking-tight">{plan.price}</span>
        )}
        {plan.period && <span className="num text-base text-sub">{plan.period}</span>}
      </p>
      <p className="mt-1 text-sm text-mute">
        {yearly && "priceYearly" in plan && plan.priceYearly ? t.billing.yearlyNote : plan.audience}
      </p>

      <ul className="mt-7 flex flex-col gap-3 border-t border-hairline pt-7">
        {t.featureLabels.slice(0, t.visibleRows).map((label, i) => featureRow(label, i))}
      </ul>

      {/* Pełne porównanie — progressive disclosure (§9b) */}
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
        className="mt-4 flex items-center gap-1.5 text-xs font-medium text-mute transition-colors duration-150 hover:text-sub"
      >
        {expanded ? t.lessLabel : t.moreLabel}
        <Glyph name="chevron-down" size={13}
          className={`transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
      </button>

      <Button href="#demo" variant={plan.featured ? "primary" : "ghost"} size="md" className="mt-6 w-full">
        {plan.cta}
      </Button>
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
    // badge „−20%" pulsuje RAZ przy przełączeniu na roczne (copy §9b)
    if (toYearly && badgeRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(badgeRef.current, { scale: 1 }, { scale: 1.18, duration: 0.16, yoyo: true, repeat: 1, ease: "power1.inOut" });
    }
  };

  return (
    <section ref={ref} id="cennik" className="section-pad bg-surface">
      <Container>
        <SectionLabel num="11">{t.label}</SectionLabel>
        <SectionH2>{t.h2}</SectionH2>
        <p className="js-reveal mt-5 max-w-[62ch] text-sub" style={{ fontSize: "var(--text-lead)", lineHeight: 1.6 }}>
          {t.lead}
        </p>

        {/* Przełącznik rozliczenia (copy §9b — ceny roczne demo, PLACEHOLDERS.md) */}
        <div className="js-reveal mt-10 flex items-center gap-3">
          <div className="flex rounded-full border border-line-1 bg-l1 p-1" role="group" aria-label="Okres rozliczenia">
            {[t.billing.monthly, t.billing.yearly].map((label, i) => (
              <button
                key={label}
                onClick={() => switchBilling(i === 1)}
                aria-pressed={yearly === (i === 1)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  yearly === (i === 1) ? "bg-blue text-onblue" : "text-sub hover:text-ink"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span
            ref={badgeRef}
            className={`num inline-block rounded-full px-3 py-1.5 text-xs transition-colors duration-200 ${
              yearly ? "bg-blue-tint text-blue-soft" : "bg-l1 text-mute"
            }`}
          >
            {t.billing.badge}
          </span>
        </div>

        <div className="mt-12 grid items-start gap-5 lg:grid-cols-3">
          {t.plans.map((plan) => (
            <PlanCard
              key={plan.name}
              plan={plan}
              expanded={expanded}
              yearly={yearly}
              onToggle={() => setExpanded((v) => !v)}
            />
          ))}
        </div>

        <p className="js-reveal mt-10 text-sm text-mute">{t.note}</p>
      </Container>
    </section>
  );
}
