"use client";

import { useRef } from "react";
import { pl } from "@/content/pl";
import { Container } from "@/components/ui/Section";
import { gsap, useGSAP, DESKTOP_MOTION, MOBILE_MOTION, REDUCE } from "@/lib/motion";

/** Manifest (motion.md §3): kicker z sekcji Problem jako osobny oddech strony.
 *  Desktop: sticky + scrub — słowa rozjaśniają się w rytmie czytania (0.12→1),
 *  na końcu wszystko przygasa i „ciszę." zostaje samo. Jedyny scrub tekstu na stronie.
 *  Mobile: prosty reveal słów on-enter. Bez JS: pełna czytelność (CSS pod .js). */
export function Manifest() {
  const scope = useRef<HTMLElement>(null);
  const words = pl.problem.kicker.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const els = gsap.utils.toArray<HTMLElement>(".man-word", scope.current!);
        if (!els.length) return;
        const last = els[els.length - 1];
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom bottom", scrub: 0.4 },
        });
        tl.to(els, { opacity: 1, duration: 0.55, stagger: 0.055 })
          .to({}, { duration: 0.5 })
          // dramatyczna pauza: wszystko przygasa, ostatnie słowo zostaje samo
          .to(els.slice(0, -1), { opacity: 0.14, duration: 0.8 })
          .to(last, { opacity: 1, duration: 0.1 }, "<");
      });

      mm.add(MOBILE_MOTION, () => {
        const els = gsap.utils.toArray<HTMLElement>(".man-word", scope.current!);
        gsap.to(els, {
          opacity: 1,
          duration: 0.6,
          stagger: 0.04,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top 70%", once: true },
        });
      });

      mm.add(REDUCE, () => {
        gsap.set(".man-word", { opacity: 1 });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} className="relative md:h-[240vh]">
      <div className="flex items-center py-28 md:sticky md:top-0 md:h-svh md:py-0">
        <Container>
          <blockquote
            className="man-quote max-w-[21ch] font-display font-semibold tracking-tight text-ink md:ml-[10vw]"
            style={{ fontSize: "clamp(1.9rem, 4.6vw, 4rem)", lineHeight: 1.22 }}
          >
            {words.map((w, i) => (
              <span key={i} className="man-word">
                {w}
                {i < words.length - 1 ? " " : ""}
              </span>
            ))}
          </blockquote>
        </Container>
      </div>
    </section>
  );
}
