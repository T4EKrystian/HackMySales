"use client";

import { useRef } from "react";
import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/kit";
import { Counter } from "@/components/ui/Counter";
import { gsap, useGSAP, NO_REDUCE, REDUCE } from "@/lib/motion";

/** S3 Manifesto (redesign): zwija dawny Problem (3 gigantyczne liczby) + Manifest
 *  (odsłona słów kickera) w JEDNĄ sekcję na papierze-deep. Bez pinów, bez GL —
 *  liczby liczą się on-enter, kicker rozjaśnia słowo po słowie (scrub), akcent
 *  serif na „ciszę.". Left-aligned, editorialny oddech. */
export function Problem() {
  const t = pl.problem;
  const scope = useRef<HTMLElement>(null);
  const words = t.kicker.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        gsap.fromTo(
          scope.current!.querySelectorAll<HTMLElement>(".s3-reveal"),
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
            clearProps: "transform",
            scrollTrigger: { trigger: scope.current, start: "top 78%", once: true },
          }
        );
        // kicker: odsłona słowo-po-słowie (scrub, odwracalna) — jedyny scrub tekstu na stronie
        gsap.fromTo(
          gsap.utils.toArray<HTMLElement>(".man-word", scope.current!),
          { opacity: 0.16 },
          {
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: { trigger: ".s3-kicker", start: "top 82%", end: "top 42%", scrub: 0.5 },
          }
        );
      });
      mm.add(REDUCE, () => {
        gsap.set(scope.current!.querySelectorAll<HTMLElement>(".s3-reveal, .man-word"), {
          clearProps: "all",
          opacity: 1,
        });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} data-ambient="problem" className="section-pad bg-paper-deep">
      <Container>
        <Eyebrow className="s3-reveal">{t.label}</Eyebrow>
        <h2 className="s3-reveal t-h2 mt-4 max-w-[22ch] font-display font-semibold text-ink">
          {/* akcent kwasowy = zakreślacz Magdy (sygnatura, NIE fill) — na kluczowym „po cichu" */}
          {t.h2.slice(0, t.h2.indexOf("po cichu"))}
          <span className="acid-mark">po cichu</span>.
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {t.cards.map((c, i) => (
            <div key={i} className="s3-reveal border-t border-hairline pt-6">
              <p className="flex items-baseline text-ink">
                <Counter value={c.value} className="t-stat" />
                <span className="num ml-1.5 text-lg text-forest-700">{c.suffix.trim()}</span>
              </p>
              <p className="mt-4 max-w-[34ch] text-[0.95rem] leading-relaxed text-sub">{c.text}</p>
            </div>
          ))}
        </div>

        <blockquote
          className="s3-kicker mt-20 max-w-[26ch] font-display font-medium text-ink md:mt-28"
          style={{ fontSize: "clamp(1.7rem, 3.6vw, 3rem)", lineHeight: 1.28, letterSpacing: "-0.02em" }}
        >
          {words.map((w, i) => {
            const clean = w.replace(/[.,]/g, "").toLowerCase();
            const isAccent = clean === "ciszę";
            return (
              <span key={i} className={`man-word ${isAccent ? "font-serif font-normal italic" : ""}`}>
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </blockquote>
      </Container>
    </section>
  );
}
