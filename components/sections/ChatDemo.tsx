"use client";

import { useEffect, useState } from "react";
import { pl } from "@/content/pl";
import { ChatShell } from "@/components/chat/ChatShell";
import { scenarioToScript } from "@/components/chat/script";

/** Żywe demo czatu w hero (features §L1+L6+L17, motion.md §3) — od v5 na ChatShell
 *  (skin onsite, persona Magda + plakietka AI, karty produktów z PRAWDZIWYM foto).
 *  Zostaje tu tylko to, co hero-specyficzne: taby scenariuszy, żywy zegar,
 *  chipy sugerowanych pytań i uczciwa atrapa inputu z tooltippem. */
export function ChatDemo({ size = "hero" }: { size?: "hero" | "sheet" }) {
  const t = pl.hero.chat;
  const [scenario, setScenario] = useState(0);
  const [tooltip, setTooltip] = useState(false);
  const [clock, setClock] = useState("--:--");
  const active = t.scenarios[scenario];

  // Żywy zegar przy statusie online (dane, nie copy)
  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" }));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const switchScenario = (i: number) => {
    if (i !== scenario) setScenario(i);
  };

  return (
    <ChatShell
      script={scenarioToScript(active)}
      skin="onsite"
      clock={clock}
      waitForIntro={size === "hero"}
      replayable
      bodyClassName={
        size === "sheet"
          ? "h-[66vh] p-5 pt-[112px]"
          : "max-h-[556px] min-h-[476px] p-5 pt-[112px]"
      }
      headerExtra={
        <div className="flex gap-5 px-5 pb-2.5" role="group" aria-label="Scenariusze demo">
          {t.scenarios.map((s, i) => (
            <button
              key={s.key}
              onClick={() => switchScenario(i)}
              aria-pressed={i === scenario}
              className={`relative inline-flex min-h-11 items-center px-0.5 pb-1.5 text-xs font-medium transition-colors duration-150 md:min-h-0 ${
                i === scenario
                  ? "text-ink after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-ink after:content-['']"
                  : "text-mute hover:text-sub"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      }
      quickReplies={t.scenarios
        .map((s, i) => ({ key: s.key, text: s.steps[0].text, onClick: () => switchScenario(i) }))
        .filter((_, i) => i !== scenario)}
      footer={
        <div className="relative border-t border-hairline p-4">
          <button
            className="w-full rounded-full border border-hairline bg-field px-5 py-3 text-left text-sm text-mute"
            onClick={() => setTooltip((v) => !v)}
            onBlur={() => setTooltip(false)}
            aria-describedby="chat-tooltip"
          >
            {t.inputPlaceholder}
          </button>
          <div
            id="chat-tooltip"
            role="status"
            className={`absolute inset-x-4 bottom-[calc(100%+4px)] rounded-xl border border-hairline bg-elevated p-3.5 text-xs leading-relaxed text-sub shadow-card transition-opacity duration-200 ${
              tooltip ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {t.inputTooltip}
          </div>
        </div>
      }
    />
  );
}
