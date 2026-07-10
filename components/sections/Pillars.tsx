"use client";

import { useRef } from "react";
import { Check, Search } from "lucide-react";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { gsap, useGSAP, useReveal, DESKTOP_MOTION, NO_REDUCE } from "@/lib/motion";

/** Zapytanie wpisujące się znak po znaku (features §L10). Reduced-motion / no-JS: pełny tekst. */
function TypedQuery({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(NO_REDUCE, () => {
        // Ukryty duplikat (display:none w drugim wariancie layoutu) — nie animuj
        if (!el.offsetParent) return;
        const obj = { i: text.length };
        gsap.fromTo(
          obj,
          { i: 0 },
          {
            i: text.length,
            duration: Math.min(2.2, text.length * 0.045),
            ease: "none",
            onStart: () => { el.textContent = ""; },
            onUpdate: () => { el.textContent = text.slice(0, Math.round(obj.i)); },
            scrollTrigger: { trigger: el, start: "top 78%", once: true },
          }
        );
      });
    },
    { scope: ref }
  );

  return (
    <span className="num truncate text-sm text-ink">
      <span ref={ref}>{text}</span>
      <span className="typing-caret" aria-hidden="true" />
    </span>
  );
}

/* ---------- Panele demo (żywe UI, zero obrazków) ---------- */

function PanelFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col rounded-[var(--radius-xl)] border border-hairline bg-card p-6 shadow-card">
      <p className="label mb-5">{label}</p>
      <div className="flex flex-1 flex-col justify-center gap-4">{children}</div>
    </div>
  );
}

function ChatMiniPanel() {
  const d = pl.pillars.demo.chat;
  return (
    <PanelFrame label="Czat">
      <div className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-blue px-4 py-3 text-sm leading-relaxed text-onblue">
        {d.user}
      </div>
      <div className="max-w-[85%] self-start rounded-2xl rounded-bl-md bg-elevated px-4 py-3 text-sm leading-relaxed text-ink">
        {d.bot}
      </div>
    </PanelFrame>
  );
}

function SearchPanel() {
  const d = pl.pillars.demo.search;
  return (
    <PanelFrame label="Wyszukiwarka">
      <div className="flex items-center gap-3 rounded-full border border-strongline bg-field px-4 py-3">
        <Search size={16} strokeWidth={1.75} className="shrink-0 text-mute" aria-hidden="true" />
        <TypedQuery text={d.query} />
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Rozpoznana intencja">
        {d.chips.map((c) => (
          <li key={c} className="rounded-full bg-blue-tint px-3 py-1 text-xs text-blue-soft">
            {c}
          </li>
        ))}
      </ul>
      <ul className="divide-y divide-[var(--border-hairline)] rounded-xl border border-hairline">
        {d.results.map((r) => (
          <li key={r.name} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="truncate text-sm text-ink">{r.name}</span>
            <span className="num shrink-0 text-sm text-sub">{r.price}</span>
          </li>
        ))}
      </ul>
      <p className="flex items-center gap-2 text-xs text-mute">
        <Check size={13} strokeWidth={2} className="text-ok" aria-hidden="true" />
        {d.note}
      </p>
    </PanelFrame>
  );
}

function RecoPanel() {
  const d = pl.pillars.demo.reco;
  return (
    <PanelFrame label="Rekomendacje">
      <p className="text-sm text-sub">{d.context}</p>
      <ul className="flex flex-col gap-3">
        {d.items.map((it) => (
          <li
            key={it.name}
            className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
              it.highlight ? "border-blue bg-blue-tint" : "border-hairline"
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
      {/* Suwak trafność ↔ marża — ilustracja ustawienia z panelu */}
      <div aria-hidden="true" className="mt-2">
        <div className="relative h-1 rounded-full bg-elevated">
          <div className="absolute inset-y-0 left-0 w-[70%] rounded-full bg-blue" />
          <div className="absolute left-[70%] top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue bg-card" />
        </div>
        <div className="mt-2 flex justify-between">
          <span className="label">{d.sliderLeft}</span>
          <span className="label text-blue-soft">{d.sliderRight}</span>
        </div>
      </div>
    </PanelFrame>
  );
}

const PANELS = [ChatMiniPanel, SearchPanel, RecoPanel];

/* ---------- Sekcja ---------- */

/** Filary: desktop = pin z przełączaniem paneli (motion.md §4), mobile = 3 bloki. */
export function Pillars() {
  const t = pl.pillars;
  const scope = useRef<HTMLElement>(null);
  const headRef = useReveal<HTMLDivElement>();

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
        if (!stage || panels.length < 3) return;

        gsap.set(panels, { autoAlpha: 0, y: 16 });
        gsap.set(panels[0], { autoAlpha: 1, y: 0 });
        // Wygaszenie nieaktywnych dopiero tutaj — SSR/reduced-motion widzi wszystkie w pełni
        items.forEach((el, i) => el.setAttribute("data-active", i === 0 ? "true" : "false"));

        let current = 0;
        const setActive = (idx: number) => {
          if (idx === current) return;
          current = idx;
          items.forEach((el, i) => el.setAttribute("data-active", i === idx ? "true" : "false"));
          if (thumb) gsap.to(thumb, { y: items[idx].offsetTop, duration: 0.35, ease: "power3.out" });
        };
        items[0].setAttribute("data-active", "true");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stage,
            pin: true,
            start: "top top",
            end: "+=250%",
            scrub: 0.6,
            onUpdate: (self) => setActive(Math.min(2, Math.floor(self.progress * 3))),
          },
        });

        tl.to({}, { duration: 1 });
        for (let i = 1; i < panels.length; i++) {
          tl.to(panels[i - 1], { autoAlpha: 0, y: -16, duration: 0.4 })
            .fromTo(panels[i], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.15")
            .to({}, { duration: 1 });
        }
      });
    },
    { scope }
  );

  return (
    <section ref={scope} id="produkt" className="section-pad bg-surface">
      <Container>
        <div ref={headRef}>
          <SectionLabel>{t.label}</SectionLabel>
          <SectionH2 className="max-w-[22ch]">{t.h2}</SectionH2>
        </div>
      </Container>

      {/* Desktop: pinowana scena (przy reduced-motion: ukryta, pokazujemy wariant stackowany) */}
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
                    className="pillar-item group transition-opacity duration-300 data-[active=false]:opacity-45"
                  >
                    <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">{item.title}</h3>
                    <p className="mt-3 max-w-[52ch] text-sm leading-relaxed text-sub">{item.body}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="relative h-[460px]">
              {PANELS.map((Panel, i) => (
                <div key={i} className="pillar-panel absolute inset-0">
                  <Panel />
                </div>
              ))}
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
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-sub">{item.body}</p>
              <div className="mt-6 min-h-[320px]">
                <Panel />
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
