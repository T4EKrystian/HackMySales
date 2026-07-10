"use client";

import { Lock, ShieldCheck, SlidersHorizontal, UserCheck } from "lucide-react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { useReveal } from "@/lib/motion";

const ICONS = {
  shield: ShieldCheck,
  user: UserCheck,
  lock: Lock,
  sliders: SlidersHorizontal,
} as const;

export function Trust() {
  const t = pl.trust;
  const ref = useReveal<HTMLElement>(0.08);

  return (
    <section ref={ref} className="section-pad">
      <Container>
        <SectionLabel num="09">{t.label}</SectionLabel>
        <SectionH2 className="max-w-[22ch]">{t.h2}</SectionH2>

        <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2">
          {t.items.map((item) => {
            const Icon = ICONS[item.icon];
            return (
              <div key={item.title} className="js-reveal flex gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-hairline bg-card">
                  <Icon size={20} strokeWidth={1.75} className="text-blue" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{item.title}</h3>
                  <p className="mt-1.5 max-w-[48ch] text-sm leading-relaxed text-sub">{item.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
