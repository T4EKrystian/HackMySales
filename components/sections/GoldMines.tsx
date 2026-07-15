"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Counter } from "@/components/ui/Counter";
import { ChatShell } from "@/components/chat/ChatShell";
import { gsap, useGSAP, useReveal, NO_REDUCE, REDUCE, EASE } from "@/lib/motion";

/** Kopalnie złota v4 (kom. klienta): asymetryczne bento 2 duże + 4 małe.
 *  Każda karta = żywe mikro-demo (pętla albo interakcja), zero ikon.
 *  Płaska BentoCard — bez tiltu/spotlightu (banlist), równe wysokości (flex h-full),
 *  treść rozłożona (mt-auto) → zero pływających pustek. Stringi dem: copy §4c. */

/* Płaska karta bento — hairline + tint, radius, zero motion (anti-kicz). */
function BentoCard({
  children,
  className = "",
  level = 1,
}: {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2;
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-[var(--radius-lg)] border ${
        level === 2
          ? "border-line-2 bg-l2 [box-shadow:var(--highlight-top),var(--shadow-l2)]"
          : "border-line-1 bg-l1"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ---------- Mini-panel przychodów (L5+L9, bez zmian koncepcji) ---------- */

function RevenueMiniPanel() {
  const t = pl.goldMines.revenue;
  const ref = useRef<HTMLDivElement>(null);

  const n = t.bars.length;
  const pts = t.bars.map((v, i) => `${(i / (n - 1)) * 100},${100 - v}`).join(" ");
  const [lastX, lastY] = ["100", (100 - t.bars[n - 1]).toFixed(0)];

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
          { scaleY: 1, duration: 0.7, ease: EASE.soft, stagger: 0.06, transformOrigin: "bottom" }
        )
          .fromTo(
            el.querySelector(".rev-line"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.1, ease: EASE.inOut },
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
      <p className="mt-3 flex items-baseline gap-1.5 font-display text-ink">
        <Counter value={t.panelAmount} className="whitespace-nowrap font-semibold tracking-tight text-[clamp(1.9rem,3.2vw,3rem)] leading-none" />
        <span className="text-lg font-medium text-sub">zł</span>
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

/* ---------- Radar: obrotowy sweep + blipy ---------- */

function RadarDial() {
  const t = pl.goldMines;
  const BLIPS = [
    { top: "22%", left: "62%", delay: "0s" },
    { top: "58%", left: "30%", delay: "1.6s" },
    { top: "40%", left: "78%", delay: "3.1s" },
  ];
  // v5 (F5 pkt 7): blip → tooltip z zapytaniem 1:1 z tabeli radaru obok
  const rows = t.radar.rows;
  return (
    <div className="relative mx-auto mt-5 h-36 w-36">
      <div className="absolute inset-0 overflow-hidden rounded-full border border-hairline" aria-hidden="true">
        <div className="absolute inset-[22%] rounded-full border border-hairline" />
        <div className="absolute inset-[42%] rounded-full border border-hairline" />
        <div className="radar-sweep" />
      </div>
      {BLIPS.map((b, i) => (
        <span key={i} className="group absolute" style={{ top: b.top, left: b.left }}>
          <span
            tabIndex={0}
            role="img"
            aria-label={rows[i] ? `${rows[i].query} — ${rows[i].count}` : undefined}
            className="radar-blip block h-1.5 w-1.5 cursor-help rounded-full bg-blue-soft before:absolute before:-inset-2.5 before:content-['']"
            style={{ animationDelay: b.delay }}
          />
          {rows[i] && (
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg border border-hairline bg-elevated px-2.5 py-1.5 text-[13px] md:text-[10px] text-sub opacity-0 shadow-card transition-opacity duration-150 group-focus-within:opacity-100 group-hover:opacity-100"
            >
              <span className="text-ink">{rows[i].query}</span>
              <span className="num ml-2 text-blue-soft">{rows[i].count}</span>
            </span>
          )}
        </span>
      ))}
      <p className="label absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[13px] md:text-[10px]">
        {t.demos.radarLabel}
      </p>
    </div>
  );
}

/* ---------- Ratownik koszyka: pętla ~6 s ---------- */

function RescueLoop() {
  const t = pl.goldMines.demos.rescue;
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(el);

      mm.add(NO_REDUCE, () => {
        const cursor = q<HTMLElement>(".rsc-cursor")[0];
        const closeBtn = q<HTMLElement>(".rsc-close")[0];
        const badge = q<HTMLElement>(".rsc-badge")[0];
        if (!cursor || !badge) return;

        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 1.4,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        tl.set(badge, { autoAlpha: 0, y: 10, scale: 0.95 })
          .fromTo(cursor, { x: 10, y: 74, autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
          .to(cursor, { x: () => (closeBtn?.offsetLeft ?? 150) - 4, y: 6, duration: 1.1, ease: EASE.inOut })
          .to(closeBtn, { backgroundColor: "var(--bg-elevated)", duration: 0.15 }, "<0.95")
          .to(cursor, { scale: 0.85, duration: 0.1 })
          .to(cursor, { scale: 1, duration: 0.1 })
          // bot wtrąca się w ostatniej chwili
          .to(badge, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.5)" }, "+=0.2")
          .to(cursor, { autoAlpha: 0, duration: 0.3 }, "<")
          .to(closeBtn, { backgroundColor: "transparent", duration: 0.3 }, "<")
          .to({}, { duration: 1.6 })
          .to(badge, { autoAlpha: 0, y: -8, duration: 0.35 });
      });

      mm.add(REDUCE, () => {
        gsap.set(q(".rsc-badge"), { autoAlpha: 1 });
        gsap.set(q(".rsc-cursor"), { autoAlpha: 0 });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="relative mt-5 select-none" aria-hidden="true">
      {/* mini-okno sklepu */}
      <div className="rounded-xl border border-hairline bg-surface">
        <div className="flex items-center justify-between gap-2 border-b border-hairline px-3 py-2">
          <span className="num truncate text-[13px] md:text-[10px] text-mute">{t.bar}</span>
          <span className="rsc-close relative flex h-4 w-4 items-center justify-center rounded-sm">
            <span className="absolute h-px w-2.5 rotate-45 bg-mute" />
            <span className="absolute h-px w-2.5 -rotate-45 bg-mute" />
          </span>
        </div>
        <div className="flex items-center gap-3 p-3">
          {/* v5: koszyk z PRAWDZIWYM produktem (foto), nie same kreski */}
          <Image
            src="/products/x-trail-2-112.webp"
            alt=""
            width={36}
            height={36}
            unoptimized
            className="h-9 w-9 shrink-0 rounded-lg border border-line-1 object-cover"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="h-1.5 w-3/4 rounded-full bg-elevated" />
            <div className="h-1.5 w-1/2 rounded-full bg-elevated" />
          </div>
        </div>
      </div>
      {/* kursor klienta */}
      <span className="rsc-cursor absolute left-0 top-0 h-2.5 w-2.5 rounded-full border border-strongline bg-ink opacity-0" />
      {/* badge ratunku */}
      <p className="rsc-badge num absolute inset-x-2 -bottom-3 flex items-center justify-center gap-1.5 rounded-full border border-hairline bg-blue-tint px-3 py-1.5 text-[13px] md:text-[11px] text-blue-soft opacity-0">
        <Glyph name="check" size={11} />
        {t.badge}
      </p>
    </div>
  );
}

/* ---------- Doradca rozmiaru: interaktywne S/M/L ---------- */

function SizeAdvisor() {
  const t = pl.goldMines.demos.size;
  const [active, setActive] = useState(2);
  const opt = t.options[active];
  // pozycja na skali dopasowania (0 = za ciasno, 1 = za luźno); L ląduje w „w sam raz"
  const fitPos = [0.13, 0.37, 0.6];

  return (
    <div className="mt-5">
      <p className="num text-xs text-mute">{t.input}</p>

      {/* Skala dopasowania — instrument zamiast foto (kom. klienta): marker jedzie do
          wybranego rozmiaru, strefa „w sam raz" podświetlona, akcent gdy rozmiar bezpieczny. */}
      <div className="mt-6" aria-hidden="true">
        <div className="num flex justify-between text-[10px] uppercase tracking-[0.14em] text-mute">
          <span className="whitespace-nowrap">za ciasno</span>
          <span className={`hidden whitespace-nowrap md:inline ${opt.ok ? "text-blue-soft" : ""}`}>w sam raz</span>
          <span className="whitespace-nowrap">za luźno</span>
        </div>
        <div className="relative mt-3 h-7">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-strongline" />
          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-blue-tint"
            style={{ left: "40%", right: "22%" }}
          />
          <div
            className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-500 motion-reduce:transition-none"
            style={{ left: `${fitPos[active] * 100}%`, transitionTimingFunction: "var(--ease-out)" }}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full border bg-surface ${
                opt.ok ? "border-blue" : "border-strongline"
              }`}
            >
              <span className={`num text-[11px] font-medium ${opt.ok ? "text-blue-soft" : "text-ink"}`}>{opt.size}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-1.5" role="group" aria-label="Wybierz rozmiar">
        {t.options.map((o, i) => (
          <button
            key={o.size}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={`num flex min-h-11 flex-1 items-center justify-center rounded-lg border px-0 py-1.5 text-xs transition-colors duration-150 md:min-h-0 ${
              i === active
                ? "border-blue bg-blue-tint text-blue-soft"
                : "border-hairline text-sub hover:border-strongline"
            }`}
          >
            {o.size}
          </button>
        ))}
      </div>
      <p
        key={opt.size}
        className={`fade-in-panel mt-3 flex min-h-[2.5rem] items-start gap-1.5 text-xs leading-relaxed ${opt.ok ? "text-blue-soft" : "text-mute"}`}
      >
        {opt.ok && <Glyph name="check" size={12} className="mt-0.5 shrink-0" />}
        {opt.verdict}
      </p>
    </div>
  );
}

/* ---------- Autopilot paczki: kropka po ścieżce (MotionPath) ---------- */

function WismoPath() {
  const t = pl.goldMines.demos.wismo;
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(el);

      mm.add(NO_REDUCE, () => {
        const dot = q<HTMLElement>(".wismo-dot")[0];
        const path = q<SVGPathElement>(".wismo-path")[0];
        const stops = q<HTMLElement>(".wismo-stop");
        if (!dot || !path) return;

        gsap.fromTo(
          path,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration: 1.2,
            ease: EASE.inOut,
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          }
        );

        const tl = gsap.timeline({
          repeat: -1,
          repeatDelay: 1.2,
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        });
        tl.set(stops, { color: "var(--text-muted)" })
          .fromTo(dot, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25 }, 0.6)
          .to(
            dot,
            {
              duration: 4.4,
              ease: "none",
              motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
            },
            0.6
          );
        stops.forEach((s, i) => {
          tl.to(s, { color: "var(--blue-300)", duration: 0.25 }, 0.6 + 0.4 + i * 1.75);
        });
        tl.to(dot, { autoAlpha: 0, duration: 0.3 });
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="mt-5" aria-hidden="true">
      <div className="relative h-16">
        <svg viewBox="0 0 200 56" className="h-full w-full overflow-visible" preserveAspectRatio="none">
          <path
            className="wismo-path"
            d="M6 46 C 40 8, 78 54, 112 24 S 178 6, 194 14"
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth="1.5"
            strokeDasharray="3 4"
          />
        </svg>
        {/* anti-kitsch V6: kropka bez kolorowego cienia — sam akcent wystarczy */}
        <span className="wismo-dot absolute left-0 top-0 h-2.5 w-2.5 rounded-full bg-blue opacity-0" />
      </div>
      <ol className="mt-2 flex flex-col gap-1 md:flex-row md:justify-between md:gap-2">
        {t.stops.map((s) => (
          <li key={s} className="wismo-stop num text-[13px] md:text-[10px] leading-tight text-mute transition-colors duration-200">
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Raport nocnej zmiany: e-mail pisze się sam ---------- */

function NightMailPreview() {
  // v5: skin e-mail ChatShell (ten sam typeInto-playback, wspólna rama z demami rozmów)
  const m = pl.goldMines.nightMail;
  return (
    <ChatShell
      skin="email"
      chrome="bare"
      script={{ key: "night-mail", steps: m.lines.map((line) => ({ role: "bot" as const, text: line })) }}
      emailMeta={{ fromLabel: m.fromLabel, from: m.from, subjectLabel: m.subjectLabel, subject: m.subject }}
      emailLink={m.link}
    />
  );
}

/* ---------- Sekcja: asymetryczne bento ---------- */

export function GoldMines() {
  const t = pl.goldMines;
  const ref = useReveal<HTMLElement>(0.08);
  const [rescue, size, wismo, report] = t.cards;

  return (
    <section ref={ref} id="funkcje" className="section-pad">
      <Container>
        <SectionLabel num="03">{t.label}</SectionLabel>
        <SectionH2 className="max-w-[26ch]">{t.h2}</SectionH2>

        {/* Bento: mobile 2 pełne (duże) + 4 mini w 2×2 (grid-cols-2); desktop lg:cols-4 */}
        <div className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:gap-5 lg:grid-cols-4">
          {/* Panel przychodów — duża karta */}
          <BentoCard level={2} className="js-reveal col-span-2 p-6 md:p-8 lg:col-span-2">
            <div className="grid h-full flex-1 items-center gap-6 md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{t.revenue.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-sub">{t.revenue.body}</p>
              </div>
              <RevenueMiniPanel />
            </div>
          </BentoCard>

          {/* Radar popytu */}
          <BentoCard className="js-reveal p-4 md:p-7">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{t.radar.title}</h3>
            <RadarDial />
            <ul className="mt-6 divide-y divide-[var(--border-hairline)] rounded-xl border border-hairline">
              {t.radar.rows.map((r) => (
                <li key={r.query} className="flex items-center justify-between gap-2 px-3 py-2">
                  <span className="truncate text-xs text-ink">{r.query}</span>
                  <span className="num shrink-0 text-[13px] md:text-[11px] text-blue-soft">{r.count}</span>
                </li>
              ))}
            </ul>
          </BentoCard>

          {/* Ratownik koszyka */}
          <BentoCard className="js-reveal p-4 md:p-7">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{rescue.title}</h3>
            <RescueLoop />
            <p className="mt-auto pt-7 text-xs leading-relaxed text-sub">{rescue.body}</p>
          </BentoCard>

          {/* Doradca rozmiaru — interaktywny */}
          <BentoCard className="js-reveal p-4 md:p-7">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{size.title}</h3>
            <SizeAdvisor />
            <p className="mt-auto pt-4 text-xs leading-relaxed text-sub">{size.body}</p>
          </BentoCard>

          {/* Autopilot „gdzie moja paczka" */}
          <BentoCard className="js-reveal p-4 md:p-7">
            <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{wismo.title}</h3>
            <WismoPath />
            <p className="mt-auto pt-5 text-xs leading-relaxed text-sub">{wismo.body}</p>
          </BentoCard>

          {/* Raport nocnej zmiany — duża karta z e-mailem */}
          <BentoCard level={2} className="js-reveal col-span-2 p-6 md:p-8 lg:col-span-2">
            <div className="grid h-full flex-1 items-center gap-6 md:grid-cols-[1fr_1.2fr] md:gap-8">
              <div>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{report.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-sub">{report.body}</p>
              </div>
              <NightMailPreview />
            </div>
          </BentoCard>
        </div>
      </Container>
    </section>
  );
}
