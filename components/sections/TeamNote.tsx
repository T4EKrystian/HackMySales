"use client";

import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/kit";
import { useReveal } from "@/lib/motion";

/** Nota od zespołu (E4) — spokojny moment editorial przed finałem: jedyny ludzki
 *  głos na stronie do czasu realnych case studies (#referencje wraca z logami/cytatami).
 *  Bez id, bg-page, typografia wyłącznie z drabinki (.label/.t-body/.t-ui). */
export function TeamNote() {
  const t = pl.teamNote;
  const ref = useReveal<HTMLElement>(0.08);

  return (
    <section ref={ref} className="section-pad bg-page">
      <Container>
        <div className="max-w-[62ch]">
          <Eyebrow className="js-reveal">{t.label}</Eyebrow>
          <p className="js-reveal t-body mt-6 text-ink">{t.body}</p>
          <p className="js-reveal t-ui mt-8 text-mute">{t.signature}</p>
        </div>
      </Container>
    </section>
  );
}
