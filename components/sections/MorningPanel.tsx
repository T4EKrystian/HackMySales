"use client";

import { useRef } from "react";
import { ArrowRight, Radar } from "lucide-react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { Logo } from "@/components/ui/Logo";
import { gsap, useGSAP, useReveal, NO_REDUCE } from "@/lib/motion";

/** Sekcja „Panel” (copy §5b, features §L13) — pełnowymiarowy poranny dashboard.
 *  Żywe UI 1:1 w estetyce portalu klienta; wszystko dane demo. */
export function MorningPanel() {
  const t = pl.morning;
  const ref = useReveal<HTMLElement>(0.08);
  const chartRef = useRef<HTMLDivElement>(null);

  const bars = t.chartBars;
  const n = bars.length;
  const pts = bars.map((v, i) => `${(i / (n - 1)) * 100},${100 - v}`).join(" ");
  const lastY = 100 - bars[n - 1];

  useGSAP(
    () => {
      const el = chartRef.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 78%", once: true },
        });
        tl.fromTo(
          el.querySelectorAll<HTMLElement>(".mp-bar"),
          { scaleY: 0 },
          { scaleY: 1, duration: 0.6, ease: "power3.out", stagger: 0.05, transformOrigin: "bottom" }
        )
          .fromTo(
            el.querySelector(".mp-line"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" },
            "-=0.25"
          )
          .fromTo(
            el.querySelector(".mp-dot"),
            { autoAlpha: 0, scale: 0.4 },
            { autoAlpha: 1, scale: 1, duration: 0.3 },
            "-=0.1"
          );
      });
    },
    { scope: chartRef }
  );

  return (
    <section ref={ref} id="panel" className="section-pad">
      <Container>
        <SectionLabel num="07">{t.label}</SectionLabel>
        <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>
        <p className="js-reveal mt-5 max-w-[58ch] text-sub" style={{ fontSize: "var(--text-lead)", lineHeight: 1.6 }}>
          {t.lead}
        </p>

        {/* Dashboard */}
        <div className="js-reveal mt-14 overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-card shadow-card">
          {/* Belka okna */}
          <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
            <div className="flex items-center gap-3">
              <Logo withWord={false} markSize={20} />
              <p className="text-sm font-medium text-ink">HackMySales — panel</p>
            </div>
            <p className="label">{t.caption}</p>
          </div>

          <div className="grid gap-px bg-[var(--border-hairline)] lg:grid-cols-[1.7fr_1fr]">
            {/* Lewa kolumna: KPI + wykres */}
            <div className="flex flex-col gap-px">
              <div className="grid grid-cols-2 gap-px bg-[var(--border-hairline)] md:grid-cols-4">
                {t.kpis.map((k) => (
                  <div key={k.label} className="bg-card px-5 py-5">
                    <p className="text-xs text-mute">{k.label}</p>
                    <p className="mt-2 font-display text-ink">
                      <Counter
                        value={k.value}
                        suffix={k.unit ? ` ${k.unit}` : ""}
                        className="text-2xl font-bold tracking-tight"
                      />
                    </p>
                  </div>
                ))}
              </div>
              <div ref={chartRef} className="flex-1 bg-card px-6 py-6">
                <p className="label">{t.chartTitle}</p>
                <div className="relative mt-5 h-40" aria-hidden="true">
                  <div className="flex h-full items-end gap-1.5">
                    {bars.map((h, i) => (
                      <div
                        key={i}
                        className={`mp-bar flex-1 rounded-t-[3px] ${i === n - 2 ? "bg-blue" : "bg-blue-tint"}`}
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                  <svg
                    className="absolute inset-0 h-full w-full overflow-visible"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <polyline
                      className="mp-line"
                      points={pts}
                      fill="none"
                      stroke="var(--blue-300)"
                      strokeWidth="1.75"
                      strokeLinejoin="round"
                      strokeLinecap="round"
                      pathLength={1}
                      strokeDasharray={1}
                      strokeDashoffset={1}
                      vectorEffect="non-scaling-stroke"
                    />
                    <circle className="mp-dot" cx="100" cy={lastY} r="2.5" fill="var(--blue-300)" opacity="0" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Prawa kolumna: rozmowy + radar */}
            <div className="flex flex-col gap-px">
              <div className="flex-1 bg-card px-6 py-6">
                <p className="label">{t.convTitle}</p>
                <ul className="mt-4 flex flex-col divide-y divide-[var(--border-hairline)]">
                  {t.conversations.map((c, i) => (
                    <li key={i} className="flex items-center gap-3 py-3">
                      <span className="num shrink-0 text-xs text-mute">{c.time}</span>
                      <span className="min-w-0 flex-1 truncate text-sm text-ink">{c.topic}</span>
                      <span className="num shrink-0 text-xs text-blue-soft">{c.amount}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-card px-6 py-6">
                <p className="label flex items-center gap-2">
                  <Radar size={13} strokeWidth={1.75} className="text-blue" aria-hidden="true" />
                  {t.radarTitle}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {t.radarRows.map((r) => (
                    <li key={r.q} className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm text-sub">{r.q}</span>
                      <span className="num shrink-0 text-xs text-blue-soft">{r.c}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#demo"
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-soft hover:text-ink"
                >
                  {t.cta}
                  <ArrowRight
                    size={15}
                    strokeWidth={1.75}
                    className="transition-transform duration-150 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
