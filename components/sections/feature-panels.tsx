"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { type ProductKind } from "@/components/ui/ProductVisual";
import { ProductThumb } from "@/components/ui/ProductThumb";
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

/** Chat do artefaktu hero — scenariusz „doradztwo" (buty trailowe → karty X-Trail
 *  z REALNYM zdjęciem). Body przewijalne wewnątrz ramki; playback trzyma dno. */
export function HeroChatPanel({ active }: { active?: boolean }) {
  return (
    <ChatShell
      chrome="bare"
      skin="messenger"
      active={active}
      script={scenarioToScript(pl.hero.chat.scenarios[0])}
      className="h-full"
      bodyClassName="h-full overflow-y-auto pr-1"
    />
  );
}

/** Chat hero w stylu makiety klienta: persona Magda + pytanie użytkownika + odpowiedź
 *  bota z RZĘDEM 3 propozycji produktów (realne foto) + atrapa inputu. Statyczny —
 *  czytelny od razu, przyjazny reduced-motion. */
export function HeroChatShowcase() {
  const t = pl.hero.chat;
  const persona = t.persona;
  const s = t.showcase;
  return (
    <div className="flex h-full flex-col">
      {/* Header persony */}
      <div className="flex items-center gap-2.5 border-b border-hairline pb-3">
        <Image
          src={persona.avatar}
          alt=""
          width={34}
          height={34}
          unoptimized
          className="h-[34px] w-[34px] rounded-full object-cover"
        />
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-sm font-medium text-ink">
            {persona.name}
            <span className="rounded bg-blue-tint px-1.5 py-0.5 text-[13px] font-medium leading-none text-blue-soft">
              {persona.aiBadge}
            </span>
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-mute">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
            {persona.status}
          </p>
        </div>
      </div>

      {/* Rozmowa */}
      <div className="flex flex-1 flex-col justify-center gap-3 py-4">
        <div className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-blue px-4 py-2.5 text-sm leading-relaxed text-onblue">
          {s.user}
        </div>
        <div className="max-w-[95%] self-start rounded-2xl rounded-bl-md bg-elevated px-4 py-3">
          <p className="text-sm leading-relaxed text-ink">{s.botIntro}</p>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {s.products.map((pr) => {
              const slug = USE_REAL_PHOTOS ? productSlug(pr.name) : undefined;
              return (
                <div key={pr.name} className="flex flex-col overflow-hidden rounded-xl border border-hairline bg-surface">
                  {/* zdjęcie wypełnia kartę (realna karta produktu, nie miniaturka) */}
                  <div className="relative aspect-square w-full bg-elevated">
                    {slug ? (
                      <Image src={`/products/${slug}-112.webp`} alt="" fill sizes="120px" unoptimized className="object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center">
                        <ProductThumb name={pr.name} kind={pr.kind as ProductKind} size={48} photo={false} tint="graphite" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-1 border-t border-hairline px-2.5 py-2">
                    <span className="num text-[13px] font-medium text-ink">{pr.price}</span>
                    <span className="h-1 w-6 shrink-0 rounded-full bg-blue" aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Atrapa inputu */}
      <div className="flex items-center gap-2 rounded-full border border-hairline bg-field px-4 py-2.5">
        <span className="min-w-0 flex-1 truncate text-sm text-mute">{s.input}</span>
        <Glyph name="send" size={18} className="shrink-0 text-blue-soft" />
      </div>
    </div>
  );
}

export function SearchPanelContent({ photo = USE_REAL_PHOTOS }: { photo?: boolean }) {
  const d = pl.pillars.demo.search;
  return (
    <div className="flex h-full flex-col justify-center gap-3">
      {/* pole wyszukiwania z sparkle AI po prawej (makieta) */}
      <div className="flex items-center gap-3 rounded-full border border-strongline bg-field px-4 py-3">
        <Glyph name="search" size={16} className="shrink-0 text-mute" />
        <span className="num relative min-w-0 flex-1 truncate text-sm text-ink">
          <span className="pp-query" data-full={d.query}>
            {d.query}
          </span>
          <span className="pp-caret typing-caret" aria-hidden="true" />
          <span className="pp-sweep" aria-hidden="true" />
        </span>
        <Glyph name="sparkle" size={16} className="shrink-0 text-blue-soft" />
      </div>
      <ul className="flex flex-wrap gap-2" aria-label="Rozpoznana intencja">
        {d.chips.map((c) => (
          <li key={c} className="pp-chip rounded-full bg-blue-tint px-3 py-1 text-[13px] text-blue-soft">
            {c}
          </li>
        ))}
      </ul>
      <p className="text-[13px] font-medium text-sub">{d.resultsLabel}</p>
      <div className="relative">
        <ul className="pp-results divide-y divide-[var(--border-hairline)] overflow-hidden rounded-xl border border-hairline">
          {d.results.map((r, i) => {
            const top = i === 0;
            const rel = Math.max(30, 90 - i * 24); // niebieski pasek trafności
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
                  tint={top ? "blue" : undefined}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm text-ink">{r.name}</span>
                    {top && (
                      <span className="flex shrink-0 items-center gap-0.5 text-blue" aria-label="ocena 5 na 5">
                        {Array.from({ length: 5 }).map((_, k) => (
                          <Glyph key={k} name="star" size={11} />
                        ))}
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-elevated" aria-hidden="true">
                    <div className="h-full rounded-full bg-blue" style={{ width: `${rel}%` }} />
                  </div>
                </div>
                <span className={`num shrink-0 text-sm ${top ? "font-medium text-ink" : "text-sub"}`}>{r.price}</span>
              </li>
            );
          })}
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
      <p className="pp-note flex items-center gap-2 text-[13px] text-mute">
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
    const next = (idxRef.current + 1) % d.signals.length;
    idxRef.current = next;
    const cards = gridRef.current?.querySelectorAll<HTMLElement>(".reco-card");
    if (cards && cards.length) flipState.current = Flip.getState(cards);
    setSignalIdx(next);
    setOrder(sortFor(d.signals[next].key));
  }, [d.signals, sortFor]);

  useEffect(() => {
    if (!visible || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(advance, 2800);
    return () => window.clearInterval(id);
  }, [visible, advance]);

  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, { duration: 0.5, ease: EASE.soft, stagger: 0.05, absolute: true });
    flipState.current = null;
  }, [order]);

  const topName = order[0]?.name;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-ink">{d.title}</p>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-tint px-2.5 py-1 text-xs text-blue-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-blue" aria-hidden="true" />
          {d.signalPrefix}: {d.signals[signalIdx].label}
        </span>
      </div>
      <div ref={gridRef} className="grid flex-1 content-start grid-cols-2 gap-2.5">
        {order.map((p, idx) => {
          const top = p.name === topName;
          const fill = Math.max(35, 92 - idx * 18); // pasek trafności — top najpełniejszy
          return (
            <div
              key={p.name}
              data-id={p.name}
              className={`reco-card flex flex-col gap-2.5 rounded-xl border p-3 transition-colors duration-200 ${
                top ? "border-blue bg-blue-tint" : "border-hairline bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <ProductThumb
                  name={p.name}
                  kind={"kind" in p ? (p.kind as ProductKind) : undefined}
                  size={48}
                  tint={top ? "blue" : undefined}
                  photo={photo}
                />
                {top && (
                  <span className="rounded-full bg-blue px-2 py-0.5 text-[13px] font-medium leading-tight text-onblue">
                    {d.badge}
                  </span>
                )}
              </div>
              <p className="truncate text-[13px] font-medium text-ink">{p.name}</p>
              {/* niebieski pasek trafności (makieta) */}
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-elevated" aria-hidden="true">
                <div className="h-full rounded-full bg-blue transition-[width] duration-500" style={{ width: `${fill}%` }} />
              </div>
              <div className="mt-auto flex items-center justify-between gap-2 pt-0.5">
                <span className="num text-sm font-medium text-ink">{p.price}</span>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-hairline text-blue-soft">
                  <Glyph name="cart" size={15} />
                </span>
              </div>
            </div>
          );
        })}
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
