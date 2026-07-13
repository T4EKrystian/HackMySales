"use client";

import { useEffect } from "react";
import { pl } from "@/content/pl";
import { Button } from "@/components/ui/Button";
import { Glyph } from "@/components/ui/Glyph";
import { ChatDemo } from "@/components/sections/ChatDemo";
import { markIntroDone } from "@/lib/introGate";

/** Wariant hero do bake-offu palety (Faza A). Paletę nadaje wrapper (.pal-dark/.pal-light)
 *  z page.tsx; tu tylko layout + żywe elementy. Copy 1:1 z pl.hero, liczby z demo-data
 *  (47 218 zł = revenueMonth; +18/+23% = counters). ChatDemo = realne demo produktu. */
export type LabLayout = "aurora" | "editorial";

const REVENUE = "47 218 zł"; // demo.revenueMonth — spójne z goldMines.revenue.body
const NIGHT_CHIP = pl.proofTicker.items[0]; // "22:41 — koszyk uratowany · 214 zł"

function H1({ big = false }: { big?: boolean }) {
  const t = pl.hero;
  return (
    <h1
      className="font-display font-bold tracking-[-0.03em] text-ink"
      style={{ fontSize: big ? "clamp(3rem, 8vw, 6rem)" : "var(--text-hero)", lineHeight: 1.04 }}
    >
      <span className="block">{t.h1Line1}</span>
      <span className="block">
        który <span className="text-blue-soft">nigdy</span> nie śpi.
      </span>
    </h1>
  );
}

function LiveStat() {
  return (
    <div className="lab-livestat">
      <span className="dot" aria-hidden="true" />
      <span className="num text-sm text-ink">{REVENUE}</span>
      <span className="label !text-mute normal-case tracking-normal" style={{ fontSize: "12px" }}>
        z rozmów w tym miesiącu · demo
      </span>
    </div>
  );
}

function ChatBlock() {
  return (
    <div className="relative min-w-0">
      <div className="lab-chat-halo absolute -inset-8 -z-10" aria-hidden="true" />
      <ChatDemo />
      <div className="lab-float-chip -left-3 bottom-8 md:-left-6">
        <span className="dot h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} aria-hidden="true" />
        {NIGHT_CHIP}
      </div>
    </div>
  );
}

export function HeroLab({ layout }: { layout: LabLayout }) {
  const t = pl.hero;
  // Bramka intro nie jest uzbrojona w labie — domykamy ją, by ChatDemo (hero) zagrał.
  useEffect(() => markIntroDone(), []);

  const Cta = (
    <div className="flex flex-wrap items-center gap-4">
      <Button href="#demo" size="lg">
        {t.ctaPrimary}
      </Button>
      <a
        href="#demo"
        className="group inline-flex items-center gap-2 py-3 text-sm font-medium text-sub hover:text-ink"
      >
        {t.ctaSecondary}
        <Glyph name="arrow-right" size={16} className="transition-transform duration-150 group-hover:translate-x-0.5" />
      </a>
    </div>
  );

  const Bg = (
    <>
      <div className="glow-bg absolute inset-x-0 -top-24 h-[130%]" aria-hidden="true" />
      <div className="lab-warm-glow absolute inset-0" aria-hidden="true" />
      <div className="dot-grid absolute inset-0" aria-hidden="true" />
    </>
  );

  if (layout === "editorial") {
    return (
      <section className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-24 pb-10">
        {Bg}
        <div className="container-hms relative w-full">
          <p className="label">{t.eyebrow}</p>
          <div className="lab-rise mt-6">
            <H1 big />
            <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1fr_46%]">
              <div className="min-w-0">
                <p className="max-w-[34rem] text-sub" style={{ fontSize: "var(--text-lead)", lineHeight: 1.6 }}>
                  {t.lead}
                </p>
                <div className="mt-8">{Cta}</div>
                <p className="mt-6 text-sm text-mute">{t.proof}</p>
                <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
                  {[
                    { v: "+18%", l: "konwersji" },
                    { v: "+23%", l: "koszyka (AOV)" },
                    { v: "24/7", l: "obsługi" },
                  ].map((s) => (
                    <div key={s.l}>
                      <dd className="num text-ink" style={{ fontSize: "1.9rem", lineHeight: 1 }}>
                        {s.v}
                      </dd>
                      <dt className="label mt-1.5 normal-case tracking-normal">{s.l}</dt>
                    </div>
                  ))}
                </dl>
                <p className="label mt-3 normal-case tracking-normal">wyniki u klientów · poglądowo</p>
              </div>
              <ChatBlock />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Aurora (domyślny) — asymetria 52/48, żywy pasek stat + halo + pływająca pastylka
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-12">
      {Bg}
      <div className="container-hms relative grid w-full items-center gap-10 md:gap-14 lg:grid-cols-[52fr_48fr]">
        <div className="lab-rise min-w-0">
          <p className="label">{t.eyebrow}</p>
          <div className="mt-5">
            <H1 />
          </div>
          <p className="mt-6 max-w-[35rem] text-sub" style={{ fontSize: "var(--text-lead)", lineHeight: 1.6 }}>
            {t.lead}
          </p>
          <div className="mt-9">{Cta}</div>
          <p className="mt-7 text-sm text-mute">{t.proof}</p>
          <div className="mt-8">
            <LiveStat />
          </div>
        </div>
        <ChatBlock />
      </div>
    </section>
  );
}
