"use client";

import { Check, Minus } from "lucide-react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { useReveal } from "@/lib/motion";

export function Pricing() {
  const t = pl.pricing;
  const ref = useReveal<HTMLElement>(0.08);

  return (
    <section ref={ref} id="cennik" className="section-pad bg-surface">
      <Container>
        <SectionLabel>{t.label}</SectionLabel>
        <SectionH2>{t.h2}</SectionH2>
        <p className="js-reveal mt-5 max-w-[62ch] text-sub" style={{ fontSize: "var(--text-lead)", lineHeight: 1.6 }}>
          {t.lead}
        </p>

        <div className="mt-14 grid items-start gap-5 lg:grid-cols-3">
          {t.plans.map((plan) => (
            <div
              key={plan.name}
              className={`js-reveal relative rounded-[var(--radius-lg)] border bg-card p-8 ${
                plan.featured ? "border-blue shadow-cta lg:-mt-3 lg:mb-3" : "border-hairline"
              }`}
            >
              {"badge" in plan && plan.badge && (
                <p className="absolute -top-3 left-8 rounded-full bg-blue px-3 py-1 text-xs font-medium text-onblue">
                  {plan.badge}
                </p>
              )}
              <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{plan.name}</h3>
              <p className="mt-4 text-ink">
                {plan.price.startsWith("[") ? (
                  <span className="num text-3xl font-bold tracking-tight">{plan.price}</span>
                ) : (
                  <span className="font-display text-2xl font-semibold tracking-tight">{plan.price}</span>
                )}
                {plan.period && <span className="num text-base text-sub">{plan.period}</span>}
              </p>
              <p className="mt-1 text-sm text-mute">{plan.audience}</p>

              <ul className="mt-7 flex flex-col gap-3 border-t border-hairline pt-7">
                {t.featureLabels.map((label, i) => {
                  const val = plan.features[i];
                  const off = val === "no";
                  return (
                    <li key={label} className={`flex items-center justify-between gap-3 text-sm ${off ? "text-mute" : "text-sub"}`}>
                      <span className="flex items-center gap-2.5">
                        {off ? (
                          <Minus size={15} strokeWidth={1.75} className="shrink-0 text-mute" aria-hidden="true" />
                        ) : (
                          <Check size={15} strokeWidth={2} className="shrink-0 text-blue" aria-hidden="true" />
                        )}
                        {label}
                        {off && <span className="sr-only">— niedostępne w tym planie</span>}
                      </span>
                      {val !== "yes" && val !== "no" && <span className="num shrink-0 text-xs text-ink">{val}</span>}
                    </li>
                  );
                })}
              </ul>

              <Button
                href="#demo"
                variant={plan.featured ? "primary" : "ghost"}
                size="md"
                className="mt-8 w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="js-reveal mt-10 text-sm text-mute">{t.note}</p>
      </Container>
    </section>
  );
}
