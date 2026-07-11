"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { pl } from "@/content/pl";
import { Glyph } from "@/components/ui/Glyph";
import { PersonaRow, TypingDots } from "@/components/chat/parts";
import { ChatDemo } from "@/components/sections/ChatDemo";
import { setOverlayOpen } from "@/lib/overlay";

/** Hero-czat mobilny (V7-F3): kompaktowa KARTA (persona + pierwsza wymiana z SSR +
 *  żywy typing) zamiast pełnego okna czatu (556 px). Tap → pełnoekranowy bottom-sheet
 *  z prawdziwym demem. Sheet: slide-up, Lenis lock, ESC/backdrop/przycisk, safe-area,
 *  reduced-motion bez animacji. Uczciwość: karta pokazuje realną pierwszą wymianę
 *  scenariusza (nie fabrykuje treści spoza skryptu). */
export function HeroChatMobile() {
  const t = pl.hero.chat;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // sheet renderowany dopiero po 1. otwarciu
  const lenis = useLenis();
  const cardRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const first = t.scenarios[0];
  const userMsg = first.steps[0]?.text ?? "";
  const botMsg = first.steps[1]?.text ?? "";

  const openSheet = () => {
    setMounted(true);
    setOpen(true);
  };
  const closeSheet = () => setOpen(false);

  // Lenis lock + overlay store + focus
  useEffect(() => {
    setOverlayOpen(open);
    if (open) {
      lenis?.stop();
      document.documentElement.style.overflow = "hidden";
      requestAnimationFrame(() => closeRef.current?.focus());
    } else {
      lenis?.start();
      document.documentElement.style.overflow = "";
      if (mounted) cardRef.current?.focus();
    }
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
    };
  }, [open, lenis, mounted]);

  // ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSheet();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Kompaktowa karta — cała klikalna (tap otwiera sheet); no-JS: statyczna wizytówka */}
      <button
        ref={cardRef}
        type="button"
        onClick={openSheet}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={pl.mobile.sheetOpen}
        className="frame-l2 block w-full overflow-hidden text-left"
      >
        <div className="border-b border-hairline px-5 py-3.5">
          <PersonaRow presence={t.persona.status} />
        </div>
        <div className="flex flex-col gap-4 p-5">
          <div className="chat-msg ml-auto max-w-[78%]">
            <div className="rounded-2xl rounded-br-sm bg-blue px-4 py-3 text-sm leading-relaxed text-onblue">{userMsg}</div>
          </div>
          <div className="chat-msg max-w-[78%]">
            <div className="rounded-2xl rounded-bl-sm bg-elevated px-4 py-3 text-sm leading-relaxed text-sub">{botMsg}</div>
          </div>
          <TypingDots />
          <span className="mt-1 inline-flex items-center gap-2 self-start text-sm font-medium text-blue-soft">
            {pl.hero.ctaSecondary}
            <Glyph name="arrow-right" size={15} />
          </span>
        </div>
      </button>

      {/* Bottom-sheet z pełnym demem */}
      {mounted && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t.persona.name}
          className={`fixed inset-0 z-[70] md:hidden ${open ? "" : "pointer-events-none"}`}
        >
          <button
            type="button"
            aria-label={pl.mobile.sheetClose}
            onClick={closeSheet}
            tabIndex={-1}
            className={`absolute inset-0 bg-page/60 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          />
          <div
            className={`sheet-panel absolute inset-x-0 bottom-0 flex flex-col rounded-t-[var(--radius-xl)] border-t border-line-2 bg-l2 transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"}`}
            style={{
              height: "calc(100dvh - max(env(safe-area-inset-top), 12px) - 12px)",
              transitionTimingFunction: "var(--ease-out)",
            }}
          >
            <div className="flex items-center justify-between px-4 pb-1 pt-3">
              <span className="mx-auto h-1 w-10 rounded-full bg-line-2" aria-hidden="true" />
              <button
                ref={closeRef}
                type="button"
                onClick={closeSheet}
                aria-label={pl.mobile.sheetClose}
                className="absolute right-3 top-2 grid h-11 w-11 place-items-center rounded-full text-mute hover:text-ink"
              >
                <Glyph name="x" size={20} />
              </button>
            </div>
            <div className="min-h-0 flex-1 px-4 pb-safe">
              {open && <ChatDemo size="sheet" />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
