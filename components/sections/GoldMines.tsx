"use client";

import { useRef } from "react";
import { ArrowRight, Moon, PackageSearch, Radar, Ruler, ShoppingCart } from "lucide-react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { gsap, useGSAP, useReveal, NO_REDUCE } from "@/lib/motion";

const ICONS = {
  cart: ShoppingCart,
  ruler: Ruler,
  package: PackageSearch,
  moon: Moon,
} as const;

/** Mini-panel przychodów (features §L5+L9) — słupki + rysowana linia trendu. */
function RevenueMiniPanel() {
  const t = pl.goldMines.revenue;
  const ref = useRef<HTMLDivElement>(null);

  const n = t.bars.length;
  const pts = t.bars.map((v, i) => `${(i / (n - 1)) * 100},${100 - v}`).join(" ");
  const [lastX, lastY] = [(100).toFixed(0), (100 - t.bars[n - 1]).toFixed(0)];

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
        tl.fromTo(
          el.querySelectorAll<HTMLElement>(".rev-bar"),
          { scaleY: 0 },
          { scaleY: 1, duration: 0.7, ease: "power3.out", stagger: 0.06, transformOrigin: "bottom" }
        )
          .fromTo(
            el.querySelector(".rev-line"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" },
            "-=0.3"
          )
          .fromTo(el.querySelector(".rev-dot"), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, "-=0.1");
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="rounded-[var(--radius-lg)] border border-hairline bg-surface p-6">
      <p className="label">{t.panelTitle}</p>
      <p className="mt-3 font-display text-ink">
        <Counter value={t.panelAmount} suffix=" zł" className="text-4xl font-bold tracking-tight" />
      </p>
      <div className="relative mt-6 h-24" aria-hidden="true">
        <div className="flex h-full items-end gap-2">
          {t.bars.map((h, i) => (
            <div
              key={i}
              className={`rev-bar flex-1 rounded-t-[4px] ${i === n - 2 ? "bg-blue" : "bg-blue-tint"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        {/* Linia trendu (features §L9) */}
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            className="rev-line"
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
          <circle className="rev-dot" cx={lastX} cy={lastY} r="2.5" fill="var(--blue-300)" opacity="0" />
        </svg>
      </div>
      <p className="mt-4 text-xs text-mute">{t.panelCaption}</p>
    </div>
  );
}

/** Podgląd e-maila raportu (features §L8) — żywe UI, zero screenshotów. */
function NightMailPreview() {
  const m = pl.goldMines.nightMail;
  return (
    <div className="rounded-[var(--radius-lg)] border border-hairline bg-surface">
      <div className="border-b border-hairline px-5 py-3">
        <p className="text-xs text-mute">
          {m.fromLabel}: <span className="text-sub">{m.from}</span>
        </p>
        <p className="mt-1 text-xs text-mute">
          {m.subjectLabel}: <span className="font-medium text-ink">{m.subject}</span>
        </p>
      </div>
      <div className="flex flex-col gap-2.5 px-5 py-4">
        {m.lines.map((line, i) => (
          <p key={i} className={`text-sm leading-relaxed ${i === 0 ? "text-ink" : "text-sub"}`}>
            {i > 0 && <span className="mr-2 inline-block h-1 w-1 translate-y-[-2px] rounded-full bg-blue" aria-hidden="true" />}
            {line}
          </p>
        ))}
        <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-blue-soft">
          {m.link}
          <ArrowRight size={14} strokeWidth={1.75} aria-hidden="true" />
        </p>
      </div>
    </div>
  );
}

export function GoldMines() {
  const t = pl.goldMines;
  const ref = useReveal<HTMLElement>(0.08);

  return (
    <section ref={ref} id="funkcje" className="section-pad">
      <Container>
        <SectionLabel num="03">{t.label}</SectionLabel>
        <SectionH2 className="max-w-[26ch]">{t.h2}</SectionH2>

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {/* Panel przychodów — karta 2× szersza z żywym mini-panelem */}
          <div className="js-reveal rounded-[var(--radius-lg)] border border-hairline bg-card p-8 lg:col-span-2">
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{t.revenue.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-sub">{t.revenue.body}</p>
              </div>
              <RevenueMiniPanel />
            </div>
          </div>

          {/* Radar popytu — z mini-raportem */}
          <div className="js-reveal rounded-[var(--radius-lg)] border border-hairline bg-card p-8">
            <Radar size={22} strokeWidth={1.75} className="text-blue" aria-hidden="true" />
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">{t.radar.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-sub">{t.radar.body}</p>
            <ul className="mt-5 divide-y divide-[var(--border-hairline)] rounded-xl border border-hairline">
              {t.radar.rows.map((r) => (
                <li key={r.query} className="flex items-center justify-between gap-3 px-4 py-2.5">
                  <span className="truncate text-xs text-ink">{r.query}</span>
                  <span className="num shrink-0 text-xs text-blue-soft">{r.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pozostałe karty */}
          {t.cards.slice(0, 3).map((card) => {
            const Icon = ICONS[card.icon];
            return (
              <div
                key={card.title}
                className="js-reveal rounded-[var(--radius-lg)] border border-hairline bg-card p-8 transition-colors duration-150 hover:border-strongline hover:bg-elevated"
              >
                <Icon size={22} strokeWidth={1.75} className="text-blue" aria-hidden="true" />
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight text-ink">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-sub">{card.body}</p>
              </div>
            );
          })}

          {/* Raport nocnej zmiany — szeroka karta z podglądem e-maila (features §L8) */}
          {t.cards.slice(3).map((card) => {
            const Icon = ICONS[card.icon];
            return (
              <div
                key={card.title}
                className="js-reveal rounded-[var(--radius-lg)] border border-hairline bg-card p-8 lg:col-span-3"
              >
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div className="flex flex-col gap-6 md:flex-row md:items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-tint">
                      <Icon size={22} strokeWidth={1.75} className="text-blue-soft" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{card.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-sub">{card.body}</p>
                    </div>
                  </div>
                  <NightMailPreview />
                </div>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Ticker Radaru popytu (features §L3) — element własny strony */}
      <div className="ticker js-reveal mt-16 border-y border-hairline bg-surface py-4" aria-label={t.ticker.caption}>
        <div className="ticker-track">
          {[false, true].map((clone) => (
            <ul key={String(clone)} aria-hidden={clone} className="flex shrink-0 items-center gap-10">
              {t.ticker.items.map((item, i) => (
                <li key={i} className="num flex items-center gap-3 whitespace-nowrap text-sm text-sub">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue" aria-hidden="true" />
                  {item}
                </li>
              ))}
              <li className="label whitespace-nowrap">{t.ticker.caption}</li>
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
