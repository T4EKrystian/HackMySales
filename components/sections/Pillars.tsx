"use client";

import { useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { type ProductKind } from "@/components/ui/ProductVisual";
import { ProductThumb } from "@/components/ui/ProductThumb";
import { ChatShell } from "@/components/chat/ChatShell";
import { SnapRow } from "@/components/mobile/SnapRow";
import { exchangeToScript } from "@/components/chat/script";
import { gsap, useGSAP, useReveal, typeInto, Flip, DESKTOP_MOTION, MOBILE_MOTION, EASE } from "@/lib/motion";

/** Filary v3 (features §L18): pin z JEDNYM device-frame; wnętrza morfują,
 *  a każde demo gra mikro-timeline przy aktywacji — czat pisze się, wyszukiwarka
 *  wpisuje literówkę i odhacza korektę, rekomendacje tasują się Flipem.
 *  Mobile / reduced-motion: trzy bloki, demo gra raz on-enter (reduced: statycznie). */

/* ---------- Zawartość paneli (żywe UI, zero obrazków) ---------- */

function ChatPanelContent({ active }: { active?: boolean }) {
  // v5: rozmowa na ChatShell (persona Magda + rytm pisania z DNA); active=undefined
  // (mobile) = samostart on-scroll, sterowanie desktopowe daje pin przez stan sekcji
  return (
    <ChatShell
      chrome="bare"
      skin="onsite"
      active={active}
      script={exchangeToScript("pillars-chat", pl.pillars.demo.chat)}
      className="h-full"
      bodyClassName="h-full justify-center"
    />
  );
}

function SearchPanelContent() {
  const d = pl.pillars.demo.search;
  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <div className="flex items-center gap-3 rounded-full border border-strongline bg-field px-4 py-3">
        <Glyph name="search" size={16} className="shrink-0 text-mute" />
        <span className="num relative truncate text-sm text-ink">
          <span className="pp-query" data-full={d.query}>
            {d.query}
          </span>
          <span className="pp-caret typing-caret" aria-hidden="true" />
          {/* sweep podświetlający korektę literówki (F4) */}
          <span className="pp-sweep" aria-hidden="true" />
        </span>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Rozpoznana intencja">
        {d.chips.map((c) => (
          <li key={c} className="pp-chip rounded-full bg-blue-tint px-3 py-1 text-xs text-blue-soft">
            {c}
          </li>
        ))}
      </ul>
      <div className="relative">
        <ul className="pp-results divide-y divide-[var(--border-hairline)] rounded-xl border border-hairline">
          {d.results.map((r) => (
            <li key={r.name} className="pp-row flex items-center gap-3 px-4 py-2.5">
              <ProductThumb name={r.name} kind={"kind" in r ? (r.kind as ProductKind) : undefined} size={40} />
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{r.name}</span>
              <span className="num shrink-0 text-sm text-sub">{r.price}</span>
            </li>
          ))}
        </ul>
        {/* Skeleton shimmer — ŻADEN frame demo nie stoi pusty, zanim wjadą wyniki
            (motion-craft „Kalibracja scrubów"); no-JS/SSR: niewidoczny, wyniki od razu */}
        <ul className="pp-skel pointer-events-none absolute inset-0 divide-y divide-[var(--border-hairline)] rounded-xl border border-hairline opacity-0" aria-hidden="true">
          {d.results.map((r) => (
            <li key={r.name} className="flex items-center gap-3 px-4 py-2.5">
              <span className="pp-skel-block h-10 w-10 shrink-0 rounded-lg" />
              <span className="pp-skel-block h-3 flex-1 rounded-full" />
              <span className="pp-skel-block h-3 w-12 shrink-0 rounded-full" />
            </li>
          ))}
        </ul>
      </div>
      <p className="pp-note flex items-center gap-2 text-xs text-mute">
        <Glyph name="check" size={13} className="text-ok" />
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
            className={`pp-reco flex items-center gap-3 rounded-xl border px-4 py-3 ${
              it.highlight ? "pp-reco-hl border-blue bg-blue-tint" : "border-hairline bg-card"
            }`}
          >
            <ProductThumb
              name={it.name}
              kind={"kind" in it ? (it.kind as ProductKind) : undefined}
              size={48}
              tint={it.highlight ? "blue" : undefined}
            />
            <div className="min-w-0 flex-1">
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

  // v5: gałąź "chat" zniknęła — panel czatu gra przez ChatShell (prop active)

  if (kind === "search") {
    const chips = q<HTMLElement>(".pp-chip");
    const rows = q<HTMLElement>(".pp-row");
    const note = q<HTMLElement>(".pp-note")[0];
    const skel = q<HTMLElement>(".pp-skel")[0];
    const realUl = q<HTMLElement>(".pp-results")[0];
    tl.set([chips, rows, note], { autoAlpha: 0 });
    // skeleton od startu stanu — rama wyników nigdy nie stoi pusta
    if (skel && realUl) tl.set(realUl, { autoAlpha: 0 }, 0).set(skel, { autoAlpha: 1 }, 0);
    typeInto(tl, q<HTMLElement>(".pp-query")[0], { caret: q<HTMLElement>(".pp-caret")[0] });
    // sweep po zapytaniu — „literówka złapana" (F4)
    const sweep = q<HTMLElement>(".pp-sweep")[0];
    if (sweep) {
      tl.fromTo(
        sweep,
        { xPercent: -110, opacity: 1 },
        { xPercent: 110, opacity: 1, duration: 0.55, ease: "power1.inOut" },
        "+=0.1"
      ).set(sweep, { opacity: 0 });
    }
    tl.fromTo(chips, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07, ease: EASE.soft }, "+=0.15");
    if (skel && realUl) {
      tl.to(skel, { autoAlpha: 0, duration: 0.2 }, "+=0.1").set(realUl, { autoAlpha: 1 });
    }
    tl.fromTo(rows, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.08, ease: EASE.soft }, "+=0.05")
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
  // v5: stan dla ChatShell w panelu 0 — pin steruje playbackiem przez propsa `active`
  const [chatActive, setChatActive] = useState(false);

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
        let pending: gsap.core.Tween | null = null;
        let started = false;

        // sekwencja time-based startuje po ≥200 ms aktywności stanu; wyjście = reset
        const playDemo = (idx: number) => {
          pending?.kill();
          pending = null;
          demoTl?.kill();
          demoTl = null;
          if (idx === 0) return; // czat gra przez ChatShell
          pending = gsap.delayedCall(0.2, () => {
            demoTl = buildPanelTl(panels[idx], KINDS[idx]);
          });
        };

        const setActive = (idx: number) => {
          if (idx === current) return;
          current = idx;
          setChatActive(idx === 0);
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
            invalidateOnRefresh: true,
            // budżet ≥90vh/stan: 3 stany × ~93% = end 280% (motion-craft)
            end: "+=200%",
            scrub: 0.8,
            snap: { snapTo: "labels", duration: 0.4, ease: "power2.inOut" },
            onEnter: () => {
              if (!started) {
                started = true;
                setChatActive(true);
                playDemo(0);
              }
            },
            onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3))),
          },
        });

        tl.addLabel("p0", 0);
        tl.to({}, { duration: 1 });
        for (let i = 1; i < panels.length; i++) {
          tl.to(panels[i - 1], { autoAlpha: 0, y: -16, duration: 0.4 })
            .fromTo(panels[i], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
            .addLabel(`p${i}`)
            .to({}, { duration: 1 });
        }
        tl.addLabel("pEnd", tl.duration());

        return () => {
          pending?.kill();
          demoTl?.kill();
        };
      });

      // Mobile: demo gra raz, gdy blok wejdzie w viewport (czat samostartuje w ChatShell)
      mm.add(MOBILE_MOTION, () => {
        const blocks = gsap.utils.toArray<HTMLElement>(".pillar-mobile-panel", root);
        blocks.forEach((block, i) => {
          if (i === 0) return;
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

            {/* JEDEN device-frame — wnętrze morfuje; glass header nad treścią (elewacje v4) */}
            <div className="frame-l2 relative h-[540px] overflow-hidden" data-cursor-label={pl.ui.cursorDemo}>
              <div className="glass-head absolute inset-x-0 top-0 z-10 flex items-center gap-3 rounded-t-[19px] px-5 py-3.5">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-l3" />
                  <span className="h-2.5 w-2.5 rounded-full bg-l3" />
                  <span className="h-2.5 w-2.5 rounded-full bg-l3" />
                </span>
                <span className="pillar-device-label label">{t.panelLabels[0]}</span>
              </div>
              <div className="absolute inset-0">
                {PANELS.map((Panel, i) => (
                  <div key={i} className="pillar-panel absolute inset-0 p-6 pt-[62px]">
                    {i === 0 ? <ChatPanelContent active={chatActive} /> : <Panel />}
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Mobile + desktop reduced-motion: trzy zwykłe bloki */}
      {/* Mobile: karuzela snap-x 3 filarów (koniec z 3 stackowanymi blokami ~2287 px) */}
      <Container className="mt-10 md:hidden motion-reduce:md:block">
        <SnapRow
          ariaLabel={pl.mobile.carousel.pillars}
          goToLabel={pl.mobile.carousel.goTo}
          slideClassName="w-[88vw]"
          mdGridCols="md:grid-cols-3"
          items={t.items.map((item, i) => {
            const Panel = PANELS[i];
            return (
              <div key={i}>
                <p className="num mb-2 text-xs text-blue-soft">0{i + 1}</p>
                <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-sub">{item.body}</p>
                <div className="pillar-mobile-panel mt-6 rounded-[var(--radius-xl)] border border-hairline bg-card p-5">
                  <p className="label mb-4">{t.panelLabels[i]}</p>
                  <div className="min-h-[280px]">
                    <Panel />
                  </div>
                </div>
              </div>
            );
          })}
        />
      </Container>
    </section>
  );
}
