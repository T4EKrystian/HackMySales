"use client";

import { useEffect, useRef, useState } from "react";
import { pl } from "@/content/pl";
import {
  HeroChatShowcase,
  SearchPanelContent,
  RecoGrid,
  buildPanelTl,
} from "@/components/sections/feature-panels";
import { gsap } from "@/lib/motion";

/** HeroDemo — jeden żywy artefakt pakujący 3 funkcje (wyszukiwarka · rekomendacje
 *  z re-rankiem · chat). Auto-pętla przełącza zakładki; klik przejmuje sterowanie.
 *  Pauza poza ekranem + przy ukrytej karcie; reduced-motion = statyczny panel, bez pętli.
 *  Zakładki reużywają paneli z feature-panels (współdzielone z sekcją filarów). */

const HERO_KINDS = ["search", "reco", "chat"] as const;
const DWELL = [5200, 8600, 7000]; // czas na zakładce (ms) — reco dłużej (kilka re-ranków), chat playback

export function HeroDemo() {
  const labels = pl.hero.demoTabs;
  // Wejscie: najpierw CHAT (index 2) — potem auto-cykl search/reco/chat
  const [tab, setTab] = useState(2);
  const [auto, setAuto] = useState(true);
  const [visible, setVisible] = useState(true); // hero nad foldem — start od razu
  const [docVisible, setDocVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // reduced-motion + widoczność karty przeglądarki
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const setR = () => setReduced(mq.matches);
    setR();
    mq.addEventListener("change", setR);
    const onVis = () => setDocVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      mq.removeEventListener("change", setR);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // pauza poza ekranem
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // auto-pętla: re-planowana po każdej zmianie zakładki (zmienny dwell)
  useEffect(() => {
    if (!auto || !visible || !docVisible || reduced) return;
    const id = window.setTimeout(() => setTab((t) => (t + 1) % HERO_KINDS.length), DWELL[tab]);
    return () => window.clearTimeout(id);
  }, [auto, visible, docVisible, reduced, tab]);

  // wejście panelu search/reco (chat gra własnym silnikiem ChatShell)
  useEffect(() => {
    if (reduced) return; // reduced = panel statyczny (treść widoczna od razu)
    const panel = panelRef.current;
    if (!panel) return;
    const k = HERO_KINDS[tab];
    if (k !== "search") return; // reco (RecoGrid) i chat animują się same
    const ctx = gsap.context(() => buildPanelTl(panel, "search"), panel);
    return () => ctx.revert();
  }, [tab, reduced]);

  const select = (i: number) => {
    setAuto(false); // klik = użytkownik przejmuje sterowanie
    setTab(i);
  };

  const kind = HERO_KINDS[tab];

  return (
    <div
      ref={frameRef}
      id="chat-demo"
      className="frame-l2 relative w-full overflow-hidden rounded-[var(--radius-xl)]"
      aria-label="Demo na żywo: wyszukiwarka, rekomendacje, chat"
    >
      <div className="glass-head absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-3 rounded-t-[calc(var(--radius-xl)-1px)] px-5 py-3">
        <div className="flex gap-5" role="group" aria-label="Funkcje demo">
          {labels.map((label, i) => (
            <button
              key={label}
              onClick={() => select(i)}
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
            <HeroChatShowcase />
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
