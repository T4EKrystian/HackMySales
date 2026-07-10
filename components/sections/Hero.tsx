"use client";

import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { pl } from "@/content/pl";
import { Button } from "@/components/ui/Button";
import { ChatDemo } from "@/components/sections/ChatDemo";
import { gsap, useGSAP, NO_REDUCE, REDUCE } from "@/lib/motion";

/** Hero 55/45 z timeline'em wejścia (design/motion.md §2) i magnetycznym CTA. */
export function Hero() {
  const t = pl.hero;
  const scope = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(NO_REDUCE, () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
        tl.fromTo(".hero-glow", { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0)
          .fromTo(
            ".hero-line",
            { y: 40, opacity: 0, clipPath: "inset(0 0 100% 0)" },
            { y: 0, opacity: 1, clipPath: "inset(0 0 -10% 0)", duration: 0.9, stagger: 0.1 },
            0.1
          )
          .fromTo(
            [".hero-eyebrow", ".hero-lead", ".hero-cta", ".hero-proof"],
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
            0.35
          )
          .fromTo(
            ".hero-demo",
            { y: 48, opacity: 0, scale: 0.98 },
            { y: 0, opacity: 1, scale: 1, duration: 0.9, clearProps: "transform" },
            0.6
          );

        const start = () => tl.play();
        if (document.fonts?.ready) document.fonts.ready.then(start);
        else start();
      });

      mm.add(REDUCE, () => {
        gsap.set([".hero-el", ".hero-glow"], { clearProps: "all", opacity: 1 });
      });

      // Magnetic CTA — tylko desktop z myszą (design/motion.md §8)
      mm.add("(min-width: 768px) and (hover: hover) and (prefers-reduced-motion: no-preference)", () => {
        const wrap = ctaRef.current;
        if (!wrap) return;
        const xTo = gsap.quickTo(wrap, "x", { duration: 0.4, ease: "power3.out" });
        const yTo = gsap.quickTo(wrap, "y", { duration: 0.4, ease: "power3.out" });
        const onMove = (e: MouseEvent) => {
          const r = wrap.getBoundingClientRect();
          const dx = e.clientX - (r.left + r.width / 2);
          const dy = e.clientY - (r.top + r.height / 2);
          xTo(gsap.utils.clamp(-4, 4, dx * 0.08));
          yTo(gsap.utils.clamp(-4, 4, dy * 0.08));
        };
        const onLeave = () => { xTo(0); yTo(0); };
        wrap.addEventListener("mousemove", onMove);
        wrap.addEventListener("mouseleave", onLeave);
        return () => {
          wrap.removeEventListener("mousemove", onMove);
          wrap.removeEventListener("mouseleave", onLeave);
        };
      });

      // Dyskretny parallax glow (jedyny scrub w hero)
      mm.add(NO_REDUCE, () => {
        gsap.to(".hero-glow", {
          yPercent: -8,
          ease: "none",
          scrollTrigger: { trigger: scope.current, start: "top top", end: "bottom top", scrub: true },
        });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="top" className="relative overflow-hidden pt-[72px]">
      {/* Tło: glow + siatka kropek */}
      <div className="hero-glow glow-bg absolute inset-x-0 -top-24 h-[130%]" aria-hidden="true" />
      <div className="dot-grid absolute inset-0" aria-hidden="true" />

      <div className="container-hms relative grid items-center gap-14 pb-20 pt-16 md:pb-28 md:pt-24 lg:grid-cols-[55fr_45fr]">
        <div>
          <p className="hero-eyebrow hero-el label">{t.eyebrow}</p>
          <h1
            className="mt-5 font-display font-bold tracking-[-0.03em] text-ink"
            style={{ fontSize: "var(--text-hero)", lineHeight: 1.05 }}
          >
            <span className="hero-line hero-el block">{t.h1Line1}</span>
            <span className="hero-line hero-el block text-gradient">{t.h1Line2}</span>
          </h1>
          <p
            className="hero-lead hero-el mt-6 max-w-[36rem] text-sub"
            style={{ fontSize: "var(--text-lead)", lineHeight: 1.6 }}
          >
            {t.lead}
          </p>
          <div className="hero-cta hero-el mt-9 flex flex-wrap items-center gap-4">
            <div ref={ctaRef} className="will-change-transform">
              <Button href="#demo" size="lg">
                {t.ctaPrimary}
              </Button>
            </div>
            <a
              href="#chat-demo"
              className="group inline-flex items-center gap-2 py-3 text-sm font-medium text-sub hover:text-ink"
            >
              {t.ctaSecondary}
              <ArrowRight size={16} strokeWidth={1.75} className="transition-transform duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>
          <p className="hero-proof hero-el mt-7 text-sm text-mute">{t.proof}</p>
        </div>

        <div id="chat-demo" className="hero-demo">
          <ChatDemo />
        </div>
      </div>
    </section>
  );
}
