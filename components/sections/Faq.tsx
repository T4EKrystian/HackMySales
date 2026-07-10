"use client";

import { useState } from "react";
import { pl } from "@/content/pl";
import { Container, SectionH2 } from "@/components/ui/Section";
import { useReveal } from "@/lib/motion";

/** FAQ v3 (motion.md §3): pytania w display size, plus→minus morfuje (rotacja
 *  ramion), height przez grid-template-rows, hover — delikatne wcięcie pytania.
 *  Pierwsze pytanie otwarte domyślnie. */
export function Faq() {
  const t = pl.faq;
  const ref = useReveal<HTMLElement>(0.05);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section ref={ref} id="faq" className="section-pad">
      <Container className="max-w-[880px]">
        <SectionH2 className="mt-0">{t.h2}</SectionH2>

        <div className="mt-14">
          {t.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="js-reveal border-b border-hairline">
                <h3>
                  <button
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    id={`faq-q-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span
                      className={`font-display text-xl font-semibold tracking-tight transition-[transform,color] duration-300 group-hover:translate-x-1.5 md:text-2xl ${
                        isOpen ? "text-ink" : "text-sub group-hover:text-ink"
                      }`}
                      style={{ transitionTimingFunction: "var(--ease-out)" }}
                    >
                      {item.q}
                    </span>
                    {/* plus -> minus: pozioma kreska zostaje, pionowa obraca się o 90° */}
                    <span className="relative h-5 w-5 shrink-0" aria-hidden="true">
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-5 -translate-y-1/2 bg-mute transition-colors duration-300 group-hover:bg-sub" />
                      <span
                        className={`absolute left-1/2 top-0 h-5 w-[1.5px] -translate-x-1/2 bg-mute transition-[transform,background-color] duration-300 group-hover:bg-sub ${
                          isOpen ? "rotate-90 scale-y-0" : ""
                        }`}
                        style={{ transitionTimingFunction: "var(--ease-out)" }}
                      />
                    </span>
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
                    <p className="max-w-[64ch] pb-8 text-sm leading-relaxed text-sub md:text-base">{item.a}</p>
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
