"use client";

import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Glyph } from "@/components/ui/Glyph";
import { useReveal } from "@/lib/motion";

/** Crescendo — ciemne pasmo pełnej szerokości w ŚRODKU strony (peak łuku emocjonalnego,
 *  audyt: zero kulminacji + monotonia). Sygnaturowe zdanie z akcentem Fraunces italic
 *  na granacie — jednocześnie „szczyt" rytmu i podpis marki. Bez fałszywych liczb. */
export function Crescendo() {
  const t = pl.crescendo;
  const ref = useReveal<HTMLElement>(0.1);

  return (
    <section ref={ref} className="section-pad relative overflow-hidden bg-forest-950 text-onforest">
      <div className="noise-forest" aria-hidden="true" />
      {/* miękka poświata dla głębi granatu */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: "radial-gradient(70% 120% at 15% 0%, rgb(40 88 240 / 0.08), transparent 60%)" }}
      />
      <Container className="relative z-[1] max-w-[920px]">
        <p className="label js-reveal !text-onforest/55">{t.eyebrow}</p>
        <h2
          className="js-reveal mt-6 max-w-[16ch] font-display font-semibold text-onforest"
          style={{ fontSize: "var(--text-hero)", lineHeight: 1.0, letterSpacing: "-0.03em" }}
        >
          {t.line1}{" "}
          <em className="font-serif font-normal italic text-blue-soft">{t.accent}</em>
        </h2>
        <p className="js-reveal t-lead mt-8 max-w-[54ch] text-onforest/75">{t.sub}</p>
        <a
          href={t.cta.href}
          className="js-reveal group mt-9 inline-flex items-center gap-2 text-sm font-medium text-onforest transition-colors duration-150 hover:text-blue-soft"
        >
          {t.cta.label}
          <Glyph name="arrow-right" size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
        </a>
      </Container>
    </section>
  );
}
