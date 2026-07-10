"use client";

import { useRef } from "react";
import { Check, Search } from "lucide-react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { gsap, useGSAP, useReveal, typeInto, Flip, DESKTOP_MOTION, MOBILE_MOTION, EASE } from "@/lib/motion";

/** Filary v3 (features §L18): pin z JEDNYM device-frame; wnętrza morfują,
 *  a każde demo gra mikro-timeline przy aktywacji — czat pisze się, wyszukiwarka
 *  wpisuje literówkę i odhacza korektę, rekomendacje tasują się Flipem.
 *  Mobile / reduced-motion: trzy bloki, demo gra raz on-enter (reduced: statycznie). */

/* ---------- Zawartość paneli (żywe UI, zero obrazków) ---------- */

function ChatPanelContent() {
  const d = pl.pillars.demo.chat;
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="pp-user max-w-[85%] self-end rounded-2xl rounded-br-md bg-blue px-4 py-3 text-sm leading-relaxed text-onblue">
        <span className="pp-user-text" data-full={d.user}>
          {d.user}
        </span>
      </div>
      <div className="pp-bot max-w-[85%] self-start rounded-2xl rounded-bl-md bg-elevated px-4 py-3 text-sm leading-relaxed text-ink">
        {d.bot}
      </div>
    </div>
  );
}

function SearchPanelContent() {
  const d = pl.pillars.demo.search;
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="flex items-center gap-3 rounded-full border border-strongline bg-field px-4 py-3">
        <Search size={16} strokeWidth={1.75} className="shrink-0 text-mute" aria-hidden="true" />
        <span className="num truncate text-sm text-ink">
          <span className="pp-query" data-full={d.query}>
            {d.query}
          </span>
          <span className="pp-caret typing-caret" aria-hidden="true" />
        </span>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Rozpoznana intencja">
        {d.chips.map((c) => (
          <li key={c} className="pp-chip rounded-full bg-blue-tint px-3 py-1 text-xs text-blue-soft">
            {c}
          </li>
        ))}
      </ul>
      <ul className="divide-y divide-[var(--border-hairline)] rounded-xl border border-hairline">
        {d.results.map((r) => (
          <li key={r.name} className="pp-row flex items-center justify-between gap-3 px-4 py-3">
            <span className="truncate text-sm text-ink">{r.name}</span>
            <span className="num shrink-0 text-sm text-sub">{r.price}</span>
          </li>
        ))}
      </ul>
      <p className="pp-note flex items-center gap-2 text-xs text-mute">
        <Check size={13} strokeWidth={2} className="text-ok" aria-hidden="true" />
        {d.note}
      </p>
    </div>
  );
}

function RecoPanelContent() {
  const d = pl.pillars.demo.reco;
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <p className="text-sm text-sub">{d.context}</p>
      <ul className="pp-reco-list flex flex-col gap-3">
        {d.items.map((it) => (
          <li
            key={it.name}
            className={`pp-reco flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
              it.highlight ? "pp-reco-hl border-blue bg-blue-tint" : "border-hairline bg-card"
            }`}
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-ink">{it.name}</p>
              <p className={`truncate text-xs ${it.highlight ? "text-blue-soft" : "text-mute"}`}>{it.note}</p>
            </div>
            <span className="num shrink-0 text-sm text-ink">{it.price}</span>
          </li>
        ))}
      </ul>
      {/* Suwak trafność ↔ marża — zjeżdża ku marży podczas tasowania */}
      <div aria-hidden="true" className="mt-2">
        <div className="pp-slider relative h-1 rounded-full bg-elevated">
          <div className="pp-slider-fill absolute inset-y-0 left-0 w-full origin-left rounded-full bg-blue" style={{ transform: "scaleX(0.7)" }} />
          <div className="pp-slider-thumb absolute left-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-blue bg-card" style={{ transform: "translate(-50%,-50%)" }} />
        </div>
        <div className="mt-2 flex justify-between">
          <span className="label">{d.sliderLeft}</span>
          <span className="label text-blue-soft">{d.sliderRight}</span>
        </div>
      </div>
    </div>
  );
}

const PANELS = [ChatPanelContent, SearchPanelContent, RecoPanelContent];

/* ---------- Mikro-timeliny demo (odpalane przy aktywacji panelu) ---------- */

function buildPanelTl(panel: HTMLElement, kind: "chat" | "search" | "reco"): gsap.core.Timeline {
  const q = gsap.utils.selector(panel);
  const tl = gsap.timeline();

  if (kind === "chat") {
    const user = q<HTMLElement>(".pp-user")[0];
    const bot = q<HTMLElement>(".pp-bot")[0];
    tl.set(bot, { autoAlpha: 0 })
      .fromTo(user, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" });
    typeInto(tl, q<HTMLElement>(".pp-user-text")[0]);
    tl.fromTo(
      bot,
      { autoAlpha: 0, y: 14, scale: 0.97 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.4)" },
      "+=0.5"
    );
  }

  if (kind === "search") {
    const chips = q<HTMLElement>(".pp-chip");
    const rows = q<HTMLElement>(".pp-row");
    const note = q<HTMLElement>(".pp-note")[0];
    tl.set([chips, rows, note], { autoAlpha: 0 });
    typeInto(tl, q<HTMLElement>(".pp-query")[0], { caret: q<HTMLElement>(".pp-caret")[0] });
    tl.fromTo(chips, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07, ease: EASE.soft }, "+=0.15")
      .fromTo(rows, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.08, ease: EASE.soft }, "+=0.1")
      .fromTo(note, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "+=0.1");
  }

  if (kind === "reco") {
    const list = q<HTMLElement>(".pp-reco-list")[0];
    const items = q<HTMLElement>(".pp-reco");
    const hl = q<HTMLElement>(".pp-reco-hl")[0];
    const fill = q<HTMLElement>(".pp-slider-fill")[0];
    const thumb = q<HTMLElement>(".pp-slider-thumb")[0];
    const track = q<HTMLElement>(".pp-slider")[0];

    // reset kolejności DOM (highlight wraca na koniec przed każdym odtworzeniem)
    if (list && hl && list.lastElementChild !== hl) list.appendChild(hl);

    tl.fromTo(items, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.09, ease: EASE.soft });
    if (fill) tl.fromTo(fill, { scaleX: 0.3 }, { scaleX: 0.7, duration: 0.7, ease: EASE.inOut }, "+=0.4");
    if (thumb && track) {
      tl.fromTo(
        thumb,
        { x: track.clientWidth * 0.3 },
        { x: track.clientWidth * 0.7, duration: 0.7, ease: EASE.inOut },
        "<"
      );
    }
    if (list && hl) {
      tl.add(() => {
        // Flip: karta z lepszą marżą wskakuje na górę
        const state = Flip.getState(items);
        list.prepend(hl);
        Flip.from(state, { duration: 0.55, ease: EASE.soft });
      }, "-=0.15");
    }
  }

  return tl;
}

/* ---------- Sekcja ---------- */

export function Pillars() {
  const t = pl.pillars;
  const scope = useRef<HTMLElement>(null);
  const headRef = useReveal<HTMLDivElement>();
  const KINDS = ["chat", "search", "reco"] as const;

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(DESKTOP_MOTION, () => {
        const stage = root.querySelector<HTMLElement>(".pillar-stage");
        const panels = gsap.utils.toArray<HTMLElement>(".pillar-panel", root);
        const items = gsap.utils.toArray<HTMLElement>(".pillar-item", root);
        const thumb = root.querySelector<HTMLElement>(".pillar-thumb");
        const deviceLabel = root.querySelector<HTMLElement>(".pillar-device-label");
        if (!stage || panels.length < 3) return;

        gsap.set(panels, { autoAlpha: 0, y: 16 });
        gsap.set(panels[0], { autoAlpha: 1, y: 0 });
        items.forEach((el, i) => el.setAttribute("data-active", i === 0 ? "true" : "false"));

        let current = 0;
        let demoTl: gsap.core.Timeline | null = null;
        let started = false;

        const playDemo = (idx: number) => {
          demoTl?.kill();
          demoTl = buildPanelTl(panels[idx], KINDS[idx]);
        };

        const setActive = (idx: number) => {
          if (idx === current) return;
          current = idx;
          items.forEach((el, i) => el.setAttribute("data-active", i === idx ? "true" : "false"));
          if (thumb) gsap.to(thumb, { y: items[idx].offsetTop, duration: 0.35, ease: EASE.soft });
          if (deviceLabel) {
            gsap.timeline()
              .to(deviceLabel, { autoAlpha: 0, y: -6, duration: 0.15 })
              .call(() => {
                deviceLabel.textContent = t.panelLabels[idx];
              })
              .fromTo(deviceLabel, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.2 });
          }
          playDemo(idx);
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: "top top",
            end: "+=250%",
            scrub: 0.6,
            onEnter: () => {
              if (!started) {
                started = true;
                playDemo(0);
              }
            },
            onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3))),
          },
        });

        tl.to({}, { duration: 1 });
        for (let i = 1; i < panels.length; i++) {
          tl.to(panels[i - 1], { autoAlpha: 0, y: -16, duration: 0.4 })
            .fromTo(panels[i], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
            .to({}, { duration: 1 });
        }

        return () => demoTl?.kill();
      });

      // Mobile: demo gra raz, gdy blok wejdzie w viewport
      mm.add(MOBILE_MOTION, () => {
        const blocks = gsap.utils.toArray<HTMLElement>(".pillar-mobile-panel", root);
        blocks.forEach((block, i) => {
          gsap.timeline({
            scrollTrigger: { trigger: block, start: "top 75%", once: true },
          }).add(() => buildPanelTl(block, KINDS[i]));
        });
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="produkt" className="section-pad bg-surface">
      <Container>
        <div ref={headRef}>
          <SectionLabel num="02">{t.label}</SectionLabel>
          <SectionH2 className="max-w-[22ch]">{t.h2}</SectionH2>
        </div>
      </Container>

      {/* Desktop: pinowana scena (reduced-motion: wariant stackowany niżej) */}
      <div className="hidden md:block motion-reduce:md:hidden">
        <div className="pillar-stage flex h-svh items-center">
          <Container className="grid w-full items-center gap-16 lg:grid-cols-2">
            <div className="relative pl-8">
              {/* Tor + wskaźnik */}
              <div className="absolute bottom-0 left-0 top-0 w-px bg-hairline" aria-hidden="true" />
              <div
                className="pillar-thumb absolute left-0 h-16 w-[2px] -translate-x-[0.5px] rounded-full bg-blue"
                aria-hidden="true"
              />
              <ol className="flex flex-col gap-12">
                {t.items.map((item, i) => (
                  <li
                    key={i}
                    data-active="true"
                    className="pillar-item group"
                  >
                    {/* dimming przez tokeny koloru, nie opacity — kontrast ≥4,5:1 również w stanie nieaktywnym (axe) */}
                    <p className="num mb-2 text-xs text-blue-soft transition-colors duration-300 group-data-[active=false]:text-mute">0{i + 1}</p>
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-ink transition-colors duration-300 group-data-[active=false]:text-sub">{item.title}</h3>
                    <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-sub transition-colors duration-300 group-data-[active=false]:text-mute">{item.body}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* JEDEN device-frame — wnętrze morfuje */}
            <div className="flex h-[540px] flex-col overflow-hidden rounded-[var(--radius-xl)] border border-hairline bg-card shadow-card" data-cursor-label={pl.ui.cursorDemo}>
              <div className="flex items-center gap-3 border-b border-hairline px-5 py-3.5">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-elevated" />
                  <span className="h-2.5 w-2.5 rounded-full bg-elevated" />
                  <span className="h-2.5 w-2.5 rounded-full bg-elevated" />
                </span>
                <span className="pillar-device-label label">{t.panelLabels[0]}</span>
              </div>
              <div className="relative flex-1">
                {PANELS.map((Panel, i) => (
                  <div key={i} className="pillar-panel absolute inset-0 p-6">
                    <Panel />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Mobile + desktop reduced-motion: trzy zwykłe bloki */}
      <Container className="mt-14 flex flex-col gap-14 md:hidden motion-reduce:md:flex">
        {t.items.map((item, i) => {
          const Panel = PANELS[i];
          return (
            <div key={i}>
              <p className="num mb-2 text-xs text-blue-soft">0{i + 1}</p>
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sub">{item.body}</p>
              <div className="pillar-mobile-panel mt-6 rounded-[var(--radius-xl)] border border-hairline bg-card p-6">
                <p className="label mb-5">{t.panelLabels[i]}</p>
                <div className="min-h-[300px]">
                  <Panel />
                </div>
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
