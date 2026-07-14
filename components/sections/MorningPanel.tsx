"use client";

import { useRef } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { Logo } from "@/components/ui/Logo";
import { gsap, useGSAP, useReveal, NO_REDUCE, DESKTOP_MOTION, FINE_POINTER, EASE } from "@/lib/motion";

/** Sekcja „Panel” (copy §5b, features §L13) — pełnowymiarowy poranny dashboard.
 *  Żywe UI 1:1 w estetyce portalu klienta; wszystko dane demo. */
export function MorningPanel() {
  const t = pl.morning;
  const ref = useReveal<HTMLElement>(0.08);
  const chartRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // Głębia v3 (motion.md §3): frame w perspektywie prostuje się scrubem do centrum,
  // warstwy kart na mouse-parallax (desktop, pointer:fine).
  useGSAP(
    () => {
      const frame = frameRef.current;
      if (!frame) return;
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        // bez fade na opacity — teksty w frame muszą trzymać kontrast od startu (axe)
        gsap.fromTo(
          frame,
          { rotateX: 9, y: 48, scale: 0.975, transformOrigin: "center top", transformPerspective: 1400 },
          {
            rotateX: 0,
            y: 0,
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: frame, start: "top 92%", end: "center 58%", scrub: 0.5 },
          }
        );
      });

      mm.add(FINE_POINTER, () => {
        const layers = gsap.utils.toArray<HTMLElement>(".mp-layer", frame);
        const setters = layers.map((l) => ({
          x: gsap.quickTo(l, "x", { duration: 0.6, ease: EASE.soft }),
          y: gsap.quickTo(l, "y", { duration: 0.6, ease: EASE.soft }),
          depth: Number(l.dataset.depth ?? 8),
        }));
        const onMove = (e: MouseEvent) => {
          const r = frame.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
          const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
          setters.forEach((s) => {
            s.x(-nx * s.depth * 0.4);
            s.y(-ny * s.depth * 0.4);
          });
        };
        const onLeave = () =>
          setters.forEach((s) => {
            s.x(0);
            s.y(0);
          });
        frame.addEventListener("mousemove", onMove);
        frame.addEventListener("mouseleave", onLeave);
        return () => {
          frame.removeEventListener("mousemove", onMove);
          frame.removeEventListener("mouseleave", onLeave);
        };
      });
    },
    { scope: frameRef }
  );

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
        <SectionLabel num="08">{t.label}</SectionLabel>
        <SectionH2 className="max-w-[24ch]">{t.h2}</SectionH2>
        <p className="t-lead js-reveal mt-5 max-w-[58ch] text-sub">
          {t.lead}
        </p>

        {/* Dashboard — frame prostujący się z perspektywy (v3) */}
        <div ref={frameRef} className="frame-l2 relative mt-14 overflow-hidden will-change-transform">
          {/* Glass belka okna (elewacje v4) */}
          <div className="glass-head absolute inset-x-0 top-0 z-10 flex items-center justify-between rounded-t-[19px] px-6 py-4">
            <div className="flex items-center gap-3">
              <Logo withWord={false} markSize={20} />
              <p className="text-sm font-medium text-ink">HackMySales — panel</p>
            </div>
            <p className="label">{t.caption}</p>
          </div>

          <div className="grid gap-px bg-[var(--stroke-1)] pt-[57px] lg:grid-cols-[1.7fr_1fr]">
            {/* Lewa kolumna: KPI + wykres */}
            <div className="flex flex-col gap-px">
              <div className="mp-layer grid grid-cols-2 gap-px bg-[var(--border-hairline)] md:grid-cols-4" data-depth="8">
                {t.kpis.map((k) => (
                  <div key={k.label} className="bg-l1 px-5 py-5">
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
              <div ref={chartRef} className="mp-layer flex-1 bg-l1 px-6 py-6" data-depth="14">
                <p className="label">{t.chartTitle}</p>
                <div className="relative mt-5 h-40" aria-hidden="true">
                  <div className="flex h-full items-end gap-1.5">
                    {bars.map((h, i) => (
                      <div
                        key={i}
                        className={`mp-bar flex-1 rounded-t-[3px] ${i === n - 2 ? "bg-blue" : "bg-blue-soft/25"}`}
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
            <div className="mp-layer flex flex-col gap-px" data-depth="20">
              <div className="flex-1 bg-l1 px-6 py-6">
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
              <div className="bg-l1 px-6 py-6">
                <p className="label flex items-center gap-2">
                  <Glyph name="radar" size={13} className="text-blue" />
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
                  className="group mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-blue-soft hover:text-ink md:mt-6 md:min-h-0"
                >
                  {t.cta}
                  <Glyph name="arrow-right" size={15}
                    className="transition-transform duration-150 group-hover:translate-x-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
