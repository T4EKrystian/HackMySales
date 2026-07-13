"use client";

import { useEffect, useState } from "react";
import { pl } from "@/content/pl";
import { Button } from "@/components/ui/Button";
import { AiBadge } from "@/components/chat/parts";
import { useOverlayOpen } from "@/lib/overlay";

/** Sticky CTA mobilny (V7-F3): po opuszczeniu hero — trwały pasek „Umów demo"
 *  + status „● Magda online" (z plakietką AI — uczciwość: Magda wszędzie nosi AI).
 *  Chowa się w cenniku i finale (mają własne CTA), przy otwartym sheet i klawiaturze.
 *  Element zostaje w DOM (fixed, aria-hidden gdy ukryty) — zero CLS. */
export function StickyCta() {
  const overlayOpen = useOverlayOpen();
  const [heroPassed, setHeroPassed] = useState(false);
  const [hideZone, setHideZone] = useState(false);
  const [kbOpen, setKbOpen] = useState(false);

  // hero minięte
  useEffect(() => {
    const top = document.getElementById("top");
    if (!top) return;
    const io = new IntersectionObserver(([e]) => setHeroPassed(e.boundingClientRect.bottom < 0), { threshold: 0 });
    io.observe(top);
    return () => io.disconnect();
  }, []);

  // strefy z własnym CTA: cennik + finał
  useEffect(() => {
    const zones = ["cennik", "demo"].map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!zones.length) return;
    const state = new Map<Element, boolean>();
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => state.set(e.target, e.isIntersecting));
        setHideZone([...state.values()].some(Boolean));
      },
      { threshold: 0 }
    );
    zones.forEach((z) => io.observe(z));
    return () => io.disconnect();
  }, []);

  // klawiatura: visualViewport skurczony ORAZ focus w polu tekstowym (koniunkcja —
  // odporna na chowanie paska adresu w Androidzie)
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const check = () => {
      const active = document.activeElement;
      const inField = !!active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA");
      setKbOpen(vv.height < window.innerHeight * 0.75 && inField);
    };
    vv.addEventListener("resize", check);
    document.addEventListener("focusin", check);
    document.addEventListener("focusout", check);
    return () => {
      vv.removeEventListener("resize", check);
      document.removeEventListener("focusin", check);
      document.removeEventListener("focusout", check);
    };
  }, []);

  const visible = heroPassed && !hideZone && !overlayOpen && !kbOpen;

  return (
    <div
      data-sticky-cta
      aria-hidden={!visible}
      inert={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 md:hidden transition-transform duration-300 ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-[130%]"
      }`}
      style={{ transitionTimingFunction: "var(--ease-out)" }}
    >
      <div className="pb-safe mx-4 mb-3 flex items-center justify-between gap-3 rounded-full border border-line-2 bg-l2/90 px-4 py-2.5 backdrop-blur-md">
        <span className="flex min-w-0 items-center gap-2 text-sm text-sub">
          <span className="chat-online-dot inline-block h-2 w-2 shrink-0 rounded-full bg-ok" aria-hidden="true" />
          <span className="truncate">{pl.mobile.stickyStatus}</span>
          <AiBadge />
        </span>
        <Button href="#demo" variant="primary" size="md" className="shrink-0">
          {pl.nav.cta}
        </Button>
      </div>
    </div>
  );
}
