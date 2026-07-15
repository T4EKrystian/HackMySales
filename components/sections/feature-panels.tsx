"use client";

import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { type ProductKind } from "@/components/ui/ProductVisual";
import { ProductThumb } from "@/components/ui/ProductThumb";
import { ChatShell } from "@/components/chat/ChatShell";
import { exchangeToScript, scenarioToScript } from "@/components/chat/script";
import { gsap, typeInto, Flip, EASE } from "@/lib/motion";

/** Wspólne panele 3 funkcji (czat · wyszukiwarka · rekomendacje z re-rankiem).
 *  Wyodrębnione z Pillars, żeby ten sam żywy render napędzał artefakt hero
 *  (HeroDemo, 3 zakładki) i sekcję filarów. Karty pokazują REALNE zdjęcia i nazwy
 *  produktów (manifest public/products/products.json → productSlug); photo=false
 *  wymusza generatywny ProductVisual tylko tam, gdzie zdjęcie jest zbędne. */

export function ChatPanelContent({ active }: { active?: boolean }) {
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

/** Chat do artefaktu hero — scenariusz „doradztwo" (buty trailowe → karty X-Trail
 *  z REALNYM zdjęciem). Body przewijalne wewnątrz ramki; playback trzyma dno. */
export function HeroChatPanel({ active }: { active?: boolean }) {
  return (
    <ChatShell
      chrome="bare"
      skin="onsite"
      active={active}
      script={scenarioToScript(pl.hero.chat.scenarios[0])}
      className="h-full"
      bodyClassName="h-full overflow-y-auto pr-1"
    />
  );
}

export function SearchPanelContent({ photo = true }: { photo?: boolean }) {
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
              <ProductThumb name={r.name} kind={"kind" in r ? (r.kind as ProductKind) : undefined} size={40} photo={photo} />
              <span className="min-w-0 flex-1 truncate text-sm text-ink">{r.name}</span>
              <span className="num shrink-0 text-sm text-sub">{r.price}</span>
            </li>
          ))}
        </ul>
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

export function RecoPanelContent({ photo = true }: { photo?: boolean }) {
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
              photo={photo}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink">{it.name}</p>
              <p className={`truncate text-xs ${it.highlight ? "text-blue-soft" : "text-mute"}`}>{it.note}</p>
            </div>
            <span className="num shrink-0 text-sm text-ink">{it.price}</span>
          </li>
        ))}
      </ul>
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

export const KINDS = ["chat", "search", "reco"] as const;

/** Mikro-timeline wejścia panelu (search/reco). Chat gra własnym silnikiem (ChatShell). */
export function buildPanelTl(panel: HTMLElement, kind: "chat" | "search" | "reco"): gsap.core.Timeline {
  const q = gsap.utils.selector(panel);
  const tl = gsap.timeline();

  if (kind === "search") {
    const chips = q<HTMLElement>(".pp-chip");
    const rows = q<HTMLElement>(".pp-row");
    const note = q<HTMLElement>(".pp-note")[0];
    const skel = q<HTMLElement>(".pp-skel")[0];
    const realUl = q<HTMLElement>(".pp-results")[0];
    tl.set([chips, rows, note], { autoAlpha: 0 });
    if (skel && realUl) tl.set(realUl, { autoAlpha: 0 }, 0).set(skel, { autoAlpha: 1 }, 0);
    typeInto(tl, q<HTMLElement>(".pp-query")[0], { caret: q<HTMLElement>(".pp-caret")[0] });
    const sweep = q<HTMLElement>(".pp-sweep")[0];
    if (sweep) {
      tl.fromTo(sweep, { xPercent: -110, opacity: 1 }, { xPercent: 110, opacity: 1, duration: 0.55, ease: "power1.inOut" }, "+=0.1").set(sweep, { opacity: 0 });
    }
    tl.fromTo(chips, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07, ease: EASE.soft }, "+=0.15");
    if (skel && realUl) tl.to(skel, { autoAlpha: 0, duration: 0.2 }, "+=0.1").set(realUl, { autoAlpha: 1 });
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
    if (list && hl && list.lastElementChild !== hl) list.appendChild(hl);
    tl.fromTo(items, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.09, ease: EASE.soft });
    if (fill) tl.fromTo(fill, { scaleX: 0.3 }, { scaleX: 0.7, duration: 0.7, ease: EASE.inOut }, "+=0.4");
    if (thumb && track) tl.fromTo(thumb, { x: track.clientWidth * 0.3 }, { x: track.clientWidth * 0.7, duration: 0.7, ease: EASE.inOut }, "<");
    if (list && hl) {
      tl.add(() => {
        const state = Flip.getState(items);
        list.prepend(hl);
        Flip.from(state, { duration: 0.55, ease: EASE.soft });
      }, "-=0.15");
    }
  }

  return tl;
}

/** Ramka „urządzenia" — glass-head z 3 kropkami + etykieta (filary). */
export function DeviceFrame({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="frame-l2 relative h-[300px] overflow-hidden sm:h-[360px]">
      <div className="glass-head absolute inset-x-0 top-0 z-10 flex items-center gap-3 rounded-t-[19px] px-5 py-3.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-l3" />
          <span className="h-2.5 w-2.5 rounded-full bg-l3" />
          <span className="h-2.5 w-2.5 rounded-full bg-l3" />
        </span>
        <span className="label">{label}</span>
      </div>
      <div className="pillar-panel absolute inset-0 p-6 pt-[62px]">{children}</div>
    </div>
  );
}
