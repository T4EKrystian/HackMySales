"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { pl } from "@/content/pl";
import { Container, SectionH2 } from "@/components/ui/Section";
import { useReveal } from "@/lib/motion";

/** Akordeon: wysokość przez grid-template-rows 0fr→1fr (czysty CSS), aria kompletne. */
export function Faq() {
  const t = pl.faq;
  const ref = useReveal<HTMLElement>(0.05);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section ref={ref} id="faq" className="section-pad">
      <Container className="max-w-[820px]">
        <SectionH2 className="mt-0">{t.h2}</SectionH2>

        <div className="mt-12">
          {t.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="js-reveal border-b border-hairline">
                <h3>
                  <button
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="font-display text-lg font-semibold tracking-tight text-ink">{item.q}</span>
                    <ChevronDown
                      size={18}
                      strokeWidth={1.75}
                      aria-hidden="true"
                      className={`shrink-0 text-mute transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[68ch] pb-6 text-sm leading-relaxed text-sub">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
