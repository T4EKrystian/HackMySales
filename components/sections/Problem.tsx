"use client";

import { useRef } from "react";
import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/kit";
import { gsap, useGSAP, NO_REDUCE, REDUCE } from "@/lib/motion";

/** S3 Interest (AIDA, docx): persuazja jednozdaniowa (akcent kwasowy = zakreślacz Magdy)
 *  → pytanie „Klient trafia do sklepu…" → 4 bariery zakupowe (lista hairline, mono index)
 *  → domknięcie „HackMySales usuwa te bariery". Papier-deep, layout 2-kolumnowy asymetryczny;
 *  reveal stagger on-enter, reduced-motion = treść od razu. */
export function Problem() {
  const t = pl.problem;
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        gsap.fromTo(
          scope.current!.querySelectorAll<HTMLElement>(".s3-reveal"),
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.07,
            clearProps: "transform",
            scrollTrigger: { trigger: scope.current, start: "top 76%", once: true },
          }
        );
      });
      mm.add(REDUCE, () => {
        gsap.set(scope.current!.querySelectorAll<HTMLElement>(".s3-reveal"), { clearProps: "all", opacity: 1 });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} data-ambient="problem" className="section-pad bg-paper-deep">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* LEWA — persuazja + pytanie */}
          <div>
            <Eyebrow className="s3-reveal">{t.label}</Eyebrow>
            <p className="s3-reveal t-lead mt-5 max-w-[46ch] text-sub">
              {t.persuasion.pre}
              <span className="acid-mark text-ink">{t.persuasion.mark}</span>
              {t.persuasion.post}
            </p>
            <h2 className="s3-reveal t-h2 mt-10 max-w-[20ch] font-display font-semibold text-ink">{t.h2}</h2>
          </div>

          {/* PRAWA — bariery + domknięcie */}
          <div className="lg:pt-2">
            <p className="s3-reveal label">{t.barriersLead}</p>
            <ul className="mt-5">
              {t.barriers.map((b, i) => (
                <li key={i} className="s3-reveal flex items-baseline gap-4 border-t border-hairline py-4">
                  <span className="ledger shrink-0 text-mute">0{i + 1}</span>
                  <span className="text-lg leading-snug text-ink">{b}</span>
                </li>
              ))}
            </ul>
            <p className="s3-reveal mt-8 max-w-[54ch] leading-relaxed text-sub">{t.closing}</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
