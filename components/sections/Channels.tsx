"use client";

import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { pl } from "@/content/pl";
import { Container, SectionLabel, SectionH2 } from "@/components/ui/Section";
import { Glyph, type GlyphName } from "@/components/ui/Glyph";
import { ChatShell } from "@/components/chat/ChatShell";
import { scenarioToScript, type ChatScript } from "@/components/chat/script";
import { gsap, useReveal, Flip, REDUCE, EASE } from "@/lib/motion";

/** Kanały (rewizja 2b): PORZUCONY diagram hub-spoke „JEDNA MAGDA" (najsłabszy craft).
 *  Zamiast schematu — JEDNO premium urządzenie czatu, które MORFUJE między kanałami
 *  (onsite / Messenger / Instagram / e-mail) po kliknięciu chipa. Ta sama rozmowa
 *  Magdy w każdej skórce = dowód „jeden bot, każdy kanał" wizualnie, nie schematem. */

const NODE_SKINS = ["onsite", "messenger", "instagram", "email"] as const;
const GLYPHS: Record<string, GlyphName> = {
  www: "www",
  messenger: "messenger",
  instagram: "instagram",
  email: "mail",
};

/** E-mail = wątek: temat z pytania klienta, odpowiedź Magdy jako punkty raportowe. */
function emailScript(base: ChatScript): ChatScript {
  return {
    key: `${base.key}-email`,
    steps: base.steps
      .filter((s) => s.role === "bot")
      .flatMap((s) => {
        const lines = [{ role: "bot" as const, text: s.text }];
        if (s.card) lines.push({ role: "bot" as const, text: `${s.card.name} — ${s.card.price}` });
        if (s.after) lines.push({ role: "bot" as const, text: s.after });
        return lines;
      }),
  };
}

export function Channels() {
  const t = pl.channels;
  const headRef = useReveal<HTMLDivElement>(0.08);
  const [activeCh, setActiveCh] = useState(0);
  // rozmowa gra RAZ — kolejne przełączenia niesie morph (Flip przez remount skina)
  const [seen, setSeen] = useState(false);
  const scriptA = scenarioToScript(pl.hero.chat.scenarios[0]);
  const nightMail = pl.goldMines.nightMail;
  const switcherRef = useRef<HTMLDivElement>(null);
  const morphTl = useRef<gsap.core.Timeline | null>(null);

  // wymuszenie stanu końcowego PRZED nowym getState (bez chowania treści)
  const sanitize = (el: HTMLElement) => {
    const setIf = (list: NodeListOf<Element>, vars: gsap.TweenVars) => {
      if (list.length) gsap.set(list, vars);
    };
    Flip.killFlipsOf(el.querySelectorAll("[data-flip-id]"));
    setIf(el.querySelectorAll(".chat-step, .nm-line, .nm-link"), { autoAlpha: 1 });
    setIf(el.querySelectorAll("[data-flip-id]"), { clearProps: "transform,width,height,borderRadius,opacity" });
    setIf(el.querySelectorAll(".chat-step"), { opacity: 1 });
    gsap.set(el, { clearProps: "height" });
  };

  const doMorph = (next: number, desktop: boolean) => {
    const el = switcherRef.current;
    if (!el) return;
    const oldScroll = el.querySelector<HTMLElement>('[role="log"]')?.scrollTop ?? 0;
    const oldH = el.offsetHeight;
    const state = desktop ? Flip.getState(el.querySelectorAll("[data-flip-id]"), { props: "borderRadius" }) : null;

    flushSync(() => {
      setSeen(true);
      setActiveCh(next);
    });

    const body = el.querySelector<HTMLElement>('[role="log"]');
    if (body) body.scrollTop = oldScroll;
    if (!desktop || !state) return;

    const m = gsap.timeline();
    morphTl.current = m;
    m.fromTo(el, { height: oldH }, { height: el.offsetHeight, duration: 0.45, ease: EASE.inOut, clearProps: "height" }, 0);
    m.add(
      Flip.from(state, {
        targets: el.querySelectorAll("[data-flip-id]"),
        duration: 0.45,
        ease: EASE.inOut,
        props: "borderRadius",
        nested: true,
        stagger: 0.02,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.03, delay: 0.22 }),
      }),
      0
    );
    const loose = el.querySelectorAll(".nm-line, .nm-link");
    if (loose.length) {
      m.fromTo(loose, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.25, stagger: 0.03 }, 0.27);
    }
  };

  const beginSwitch = (next: number) => {
    if (next === activeCh) return;
    if (window.matchMedia(REDUCE).matches) {
      setSeen(true);
      setActiveCh(next);
      return;
    }
    morphTl.current?.kill();
    if (switcherRef.current) sanitize(switcherRef.current);
    doMorph(next, window.matchMedia("(min-width: 768px)").matches);
  };

  return (
    <section id="kanaly" className="section-pad">
      <Container>
        <div ref={headRef} className="mx-auto max-w-[720px] text-center">
          <SectionLabel className="justify-center">{t.label}</SectionLabel>
          <SectionH2 className="mx-auto max-w-[20ch]">{t.h2}</SectionH2>
          <p className="t-lead js-reveal mx-auto mt-5 max-w-[52ch] text-sub">{t.lead}</p>
        </div>

        {/* Chipy kanałów — auto-width, ikona + nazwa, aktywny = pełny niebieski */}
        <div className="mx-auto mt-10 flex w-full max-w-[560px] flex-wrap justify-center gap-2.5 md:mt-12">
          {t.nodes.map((n, i) => (
            <button
              key={n.key}
              onClick={() => beginSwitch(i)}
              aria-pressed={i === activeCh}
              className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 md:min-h-0 ${
                i === activeCh
                  ? "border-blue bg-blue text-onblue shadow-cta"
                  : "border-hairline text-sub hover:border-strongline hover:text-ink"
              }`}
            >
              <Glyph name={GLYPHS[n.key]} size={16} className="shrink-0" />
              {n.name}
            </button>
          ))}
        </div>

        {/* Jedno urządzenie — ta sama rozmowa, morfuje między skórkami kanałów */}
        <div ref={switcherRef} className="mx-auto mt-6 w-full max-w-[520px]">
          {NODE_SKINS[activeCh] === "email" ? (
            <ChatShell
              key="email"
              skin="email"
              chrome="bare"
              mode={seen ? "static" : "play"}
              flipId="ch-frame"
              script={emailScript(scriptA)}
              emailMeta={{
                fromLabel: nightMail.fromLabel,
                from: nightMail.from,
                subjectLabel: nightMail.subjectLabel,
                subject: scriptA.steps[0].text,
              }}
              className={seen ? "" : "fade-in-fast"}
            />
          ) : (
            <ChatShell
              key={NODE_SKINS[activeCh]}
              skin={NODE_SKINS[activeCh]}
              mode={seen ? "static" : "play"}
              onDone={() => setSeen(true)}
              flipId="ch-frame"
              flipMsgs
              script={scriptA}
              bodyClassName="max-h-[460px] min-h-[320px] p-5 pt-[86px]"
              className={seen ? "" : "fade-in-fast"}
            />
          )}
        </div>

        <p className="js-reveal mt-8 text-center text-sm text-mute">{t.caption}</p>
      </Container>
    </section>
  );
}
