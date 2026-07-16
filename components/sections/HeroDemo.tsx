"use client";

import { useEffect, useRef, useState } from "react";
import { pl } from "@/content/pl";
import {
  HeroChatLive,
  SearchPanelContent,
  RecoGrid,
  buildPanelTl,
} from "@/components/sections/feature-panels";
import { gsap } from "@/lib/motion";

/** HeroDemo — jeden żywy artefakt pakujący 3 funkcje (wyszukiwarka · rekomendacje
 *  z re-rankiem · ŻYWY chat). Domyślnie CHAT (gwiazda hero); klik przełącza zakładkę.
 *  Bez auto-pętli — chat gra pełną rozmowę bez odjazdu; reduced-motion = statyczny panel.
 *  Zakładki reużywają paneli z feature-panels (współdzielone z sekcją filarów). */

const HERO_KINDS = ["search", "reco", "chat"] as const;

export function HeroDemo() {
  const labels = pl.hero.demoTabs;
  // Wejscie i domyślnie: CHAT (index 2) — żywe demo silnika ChatShell
  const [tab, setTab] = useState(2);
  const [reduced, setReduced] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  // reduced-motion (gate wejścia panelu wyszukiwarki)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setR = () => setReduced(mq.matches);
    setR();
    mq.addEventListener("change", setR);
    return () => mq.removeEventListener("change", setR);
  }, []);

  // wejście panelu search (reco/chat animują się same)
  useEffect(() => {
    if (reduced) return; // reduced = panel statyczny (treść widoczna od razu)
    const panel = panelRef.current;
    if (!panel) return;
    if (HERO_KINDS[tab] !== "search") return; // reco (RecoGrid) i chat grają własnym silnikiem
    const ctx = gsap.context(() => buildPanelTl(panel, "search"), panel);
    return () => ctx.revert();
  }, [tab, reduced]);

  const kind = HERO_KINDS[tab];

  return (
    <div
      id="chat-demo"
      className="frame-l2 relative w-full overflow-hidden rounded-[var(--radius-xl)]"
      aria-label="Demo na żywo: wyszukiwarka, rekomendacje, chat"
    >
      <div className="glass-head absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 rounded-t-[calc(var(--radius-xl)-1px)] px-5 py-3">
        <div className="flex gap-5" role="group" aria-label="Funkcje demo">
          {labels.map((label, i) => (
            <button
              key={label}
              onClick={() => setTab(i)}
              aria-pressed={i === tab}
              className={`relative inline-flex min-h-11 items-center px-0.5 pb-1 t-meta font-medium transition-colors duration-150 md:min-h-0 ${
                i === tab
                  ? "text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-ink after:content-['']"
                  : "text-mute hover:text-sub"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="hidden items-center gap-1.5 sm:inline-flex" aria-hidden="true">
          <span className="hero-livedot" />
          <span className="t-meta text-mute">na żywo</span>
        </span>
      </div>

      <div className="relative h-[420px] p-6 pt-[64px] sm:h-[480px]">
        {/* Klucz = remount panelu przy zmianie zakładki → wejście gra od nowa */}
        <div ref={panelRef} key={tab} className="h-full">
          {kind === "chat" ? (
            <HeroChatLive />
          ) : kind === "search" ? (
            <SearchPanelContent />
          ) : (
            <RecoGrid />
          )}
        </div>
      </div>
    </div>
  );
}
