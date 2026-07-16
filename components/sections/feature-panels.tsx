"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { type ProductKind } from "@/components/ui/ProductVisual";
import { ProductThumb } from "@/components/ui/ProductThumb";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChatShell } from "@/components/chat/ChatShell";
import { exchangeToScript, scenarioToScript, productSlug } from "@/components/chat/script";
import { gsap, typeInto, Flip, EASE } from "@/lib/motion";

/** Wspólne panele 3 funkcji (czat · wyszukiwarka · rekomendacje z re-rankiem).
 *  Wyodrębnione z Pillars, żeby ten sam żywy render napędzał artefakt hero
 *  (HeroDemo, 3 zakładki) i sekcję filarów.
 *
 *  ZDJĘCIA vs INSTRUMENTY: dopóki brak SPÓJNEGO zestawu packshotów (białe/neutralne tło,
 *  jak w makiecie klienta) — cały hero używa czystych instrumentów ProductVisual (obecne
 *  zdjęcia mają niespójne tła i logo marek → tandetnie). Gdy klient dostarczy jednolity
 *  zestaw do public/products, wystarczy przełączyć FLAGĘ poniżej na false. */
const USE_REAL_PHOTOS = true;

export function ChatPanelContent({ active }: { active?: boolean }) {
  return (
    <ChatShell
      chrome="bare"
      skin="messenger"
      active={active}
      script={exchangeToScript("pillars-chat", pl.pillars.demo.chat)}
      className="h-full"
      bodyClassName="h-full justify-center"
    />
  );
}

/** ŻYWY chat hero (E8): silnik ChatShell (skin onsite) + useChatPlayback ze
 *  scenariuszami z pl.hero.chat.scenarios. Persona Magda pisze na żywo (typing dots,
 *  karty produktów z realnym foto = ProductCard variant chat), scenario-taby
 *  przełączają rozmowę (reset od seedu), pill „Nowa wiadomość" przy odklejeniu.
 *  Playback rusza po intro (markIntroDone) i tylko w viewport; reduced-motion =
 *  cała rozmowa statycznie (silnik inert). Ramkę + taby funkcji daje HeroDemo. */
export function HeroChatLive() {
  const t = pl.hero.chat;
  const [scenario, setScenario] = useState(0);

  return (
    <ChatShell
      chrome="hero"
      skin="onsite"
      waitForIntro
      replayable
      script={scenarioToScript(t.scenarios[scenario])}
      ariaLabel="Rozmowa demo z doradcą HackMySales"
      bodyClassName="min-h-0 flex-1 pr-1"
      headerExtra={
        <div className="flex gap-1.5 pb-3" role="group" aria-label="Scenariusze demo">
          {t.scenarios.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setScenario(i)}
              aria-pressed={i === scenario}
              className={`min-h-11 rounded-full px-3.5 py-1.5 t-meta font-medium transition-[color,background-color,transform] duration-150 active:scale-[0.98] md:min-h-0 ${
                i === scenario
                  ? "bg-blue-tint text-blue-soft"
                  : "text-mute hover:bg-elevated hover:text-sub"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      }
      footer={
        <div className="mt-3 flex items-center gap-2 rounded-full border border-hairline bg-field px-4 py-2.5" aria-hidden="true">
          <span className="min-w-0 flex-1 truncate t-ui text-mute">{t.inputPlaceholder}</span>
          <Glyph name="send" size={18} className="shrink-0 text-blue-soft" />
        </div>
      }
    />
  );
}

export function SearchPanelContent({ photo = USE_REAL_PHOTOS }: { photo?: boolean }) {
  const d = pl.pillars.demo.search;
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      {/* pole wyszukiwania — czyste, bez dekoracyjnych ikon AI */}
      <div className="flex items-center gap-3 rounded-full border border-strongline bg-field px-4 py-3">
        <Glyph name="search" size={16} className="shrink-0 text-mute" />
        <span className="relative min-w-0 flex-1 truncate t-ui text-ink">
          <span className="pp-query" data-full={d.query}>
            {d.query}
          </span>
          <span className="pp-caret typing-caret" aria-hidden="true" />
        </span>
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Rozpoznana intencja">
        {d.chips.map((c) => (
          <li key={c} className="pp-chip rounded-full border border-hairline px-3 py-1 t-meta text-sub">
            {c}
          </li>
        ))}
      </ul>
      <p className="t-meta font-medium text-sub">{d.resultsLabel}</p>
      {/* wyniki ZAWSZE w finalnym layoucie (SSR, zero CLS); typing tylko odsłania ranking = kolejność */}
      <ul className="pp-results divide-y divide-[var(--border-hairline)] overflow-hidden rounded-md border border-hairline">
        {d.results.map((r, i) => {
          const top = i === 0;
          return (
            <li
              key={r.name}
              className={`pp-row flex items-center gap-3 px-4 py-2.5 ${top ? "bg-blue-tint" : ""}`}
            >
              <ProductThumb
                name={r.name}
                kind={"kind" in r ? (r.kind as ProductKind) : undefined}
                size={40}
                photo={photo}
              />
              <span className="min-w-0 flex-1 truncate t-ui text-ink">{r.name}</span>
              <span className={`num shrink-0 t-ui ${top ? "font-medium text-ink" : "text-sub"}`}>{r.price}</span>
            </li>
          );
        })}
      </ul>
      <p className="pp-note flex items-center gap-2 t-meta text-mute">
        <Glyph name="check" size={13} className="text-ok" />
        {d.note}
      </p>
    </div>
  );
}

type RecoProduct = (typeof pl.pillars.demo.reco.products)[number];

/** RecoGrid — dynamiczny product grid: co ~2,8 s zmienia się SYGNAŁ klienta
 *  (dopasowanie / cena / marża) → grid re-rankuje się FLIP-em, top-produkt dostaje
 *  wyróżnienie „Polecane". Realne foto. Pauza off-screen; reduced-motion = statyczny. */
export function RecoGrid({ photo = USE_REAL_PHOTOS }: { photo?: boolean }) {
  const d = pl.pillars.demo.reco;
  const sortFor = useCallback(
    (key: string): RecoProduct[] =>
      [...d.products].sort((a, b) =>
        key === "price" ? a.priceVal - b.priceVal : key === "margin" ? b.margin - a.margin : b.fit - a.fit
      ),
    [d.products]
  );

  const [signalIdx, setSignalIdx] = useState(0);
  const [order, setOrder] = useState<RecoProduct[]>(() => sortFor(d.signals[0].key));
  const gridRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const idxRef = useRef(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const advance = useCallback(() => {
    if (document.hidden) return; // pauza na ukrytej karcie (CHECKLIST #16)
    const next = (idxRef.current + 1) % d.signals.length;
    idxRef.current = next;
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".reco-card");
    if (cards && cards.length) flipState.current = Flip.getState(cards);
    setSignalIdx(next);
    setOrder(sortFor(d.signals[next].key));
  }, [d.signals, sortFor]);

  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(advance, 4000);
    return () => window.clearInterval(id);
  }, [visible, advance]);

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, { duration: 0.5, ease: EASE.soft, stagger: 0.05, absolute: true });
    flipState.current = null;
  }, [order]);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="t-ui font-medium text-ink">{d.title}</p>
        {/* cichy podpis kryterium (zamiast krzykliwego chipu AI) — crossfade 150 ms
            zsynchronizowany z re-rankiem FLIP (keyed remount = ponowny fade) */}
        <span className="t-meta text-mute">
          {d.signalPrefix}{" "}
          <span key={signalIdx} className="reco-crit inline-block">
            {d.signals[signalIdx].label}
          </span>
        </span>
      </div>
      {/* listing sklepu — mobile: swipe (2 karty), desktop: grid 4; kadr 1:1 przez ProductCard */}
      <div
        ref={gridRef}
        className="flex flex-1 snap-x snap-mandatory items-center gap-2.5 overflow-x-auto pb-1 hide-scrollbar sm:grid sm:grid-cols-4 sm:content-center sm:gap-2 sm:overflow-visible sm:pb-0"
      >
        {order.map((p, idx) => (
          <ProductCard
            key={p.name}
            variant="reco"
            className="reco-card w-[calc(50%-5px)] shrink-0 snap-start sm:w-auto"
            name={p.name}
            category={p.cat}
            price={p.price}
            oldPrice={p.oldPrice}
            kind={"kind" in p ? (p.kind as ProductKind) : undefined}
            slug={photo ? productSlug(p.name) : undefined}
            featured={idx === 0}
            saleLabel={d.saleBadge}
          />
        ))}
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
    // wyniki ZAWSZE widoczne (SSR) — tylko przygaszone, żeby rama nigdy nie była pusta
    tl.set([chips, note], { autoAlpha: 0 });
    tl.set(rows, { opacity: 0.35 });
    typeInto(tl, q<HTMLElement>(".pp-query")[0], { caret: q<HTMLElement>(".pp-caret")[0] });
    tl.fromTo(chips, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.07, ease: EASE.soft }, "+=0.15");
    tl.to(rows, { opacity: 1, duration: 0.35, stagger: 0.08, ease: EASE.soft }, "+=0.05")
      .fromTo(note, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "+=0.1");
  }

  return tl;
}

/** Ramka „urządzenia" — glass-head bez mac-dots: etykieta panelu + opcjonalne folio (.ledger). */
export function DeviceFrame({ label, folio, children }: { label: string; folio?: string; children: React.ReactNode }) {
  return (
    <div className="frame-l2 relative h-[300px] overflow-hidden sm:h-[360px]">
      <div className="glass-head absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 rounded-t-[19px] px-5 py-3.5">
        <span className="label">{label}</span>
        {folio && <span className="ledger text-mute">{folio}</span>}
      </div>
      <div className="pillar-panel absolute inset-0 p-6 pt-[62px]">{children}</div>
    </div>
  );
}
