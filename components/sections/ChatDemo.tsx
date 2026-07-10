"use client";

import { useEffect, useRef, useState } from "react";
import { Glyph } from "@/components/ui/Glyph";
import { pl } from "@/content/pl";
import { Logo } from "@/components/ui/Logo";
import { ProductVisual, type ProductKind } from "@/components/ui/ProductVisual";
import { gsap, useGSAP, NO_REDUCE, REDUCE } from "@/lib/motion";

/** Żywe demo czatu (features §L1+L6+L17, motion.md §3).
 *  v3: pytania klienta piszą się znak po znaku, po badge'u chipy z pytaniami
 *  pozostałych scenariuszy (klik przełącza), status z żywym zegarem.
 *  Reduced-motion i brak JS → pełna rozmowa statycznie. */
export function ChatDemo() {
  const t = pl.hero.chat;
  const scope = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const startedRef = useRef(false);
  const [scenario, setScenario] = useState(0);
  const [done, setDone] = useState(false);
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

  useEffect(() => {
    if (!done) return;
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [done]);

  useGSAP(
    () => {
      const root = scope.current;
      const body = bodyRef.current;
      if (!root || !body) return;

      const mm = gsap.matchMedia();

      mm.add(NO_REDUCE, () => {
        const steps = gsap.utils.toArray<HTMLElement>(".chat-step", root);
        const tl = gsap.timeline({ paused: true, onComplete: () => setDone(true) });

        // Kotwiczymy na OSTATNIM widocznym kroku — scrollHeight zjeżdżałby w pustkę
        // niewidocznych jeszcze wiadomości (mają wysokość mimo opacity 0).
        const scrollToStep = (step: HTMLElement) =>
          body.scrollTo({
            top: Math.max(0, step.offsetTop + step.offsetHeight - body.clientHeight + 20),
            behavior: "smooth",
          });

        steps.forEach((step) => {
          const isBot = step.dataset.role === "bot";
          const isBadge = step.dataset.role === "badge";
          const dots = step.querySelector<HTMLElement>(".chat-typing");
          const msg = step.querySelector<HTMLElement>(".chat-msg");
          if (!msg) return;

          if (isBot && dots) {
            // bot: wskaźnik pisania -> wiadomość ze springiem
            tl.set(step, { opacity: 1 })
              .fromTo(dots, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
              .to({}, { duration: 0.75 })
              .to(dots, { autoAlpha: 0, duration: 0.15 })
              .set(dots, { display: "none" })
              .fromTo(
                msg,
                { y: 16, autoAlpha: 0, scale: 0.97 },
                { y: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.4)" }
              )
              .call(() => scrollToStep(step));
          } else if (step.dataset.role === "user") {
            // klient: bąbel pojawia się pusty i PISZE się znak po znaku
            const textEl = step.querySelector<HTMLElement>(".chat-user-text");
            const caret = step.querySelector<HTMLElement>(".chat-caret");
            const full = textEl?.textContent ?? "";
            const proxy = { i: 0 };
            tl.set(step, { opacity: 1 }, "+=0.35")
              .fromTo(msg, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25, ease: "power2.out" })
              .call(() => {
                if (textEl) textEl.textContent = "";
                if (caret) caret.style.display = "inline-block";
              })
              .to(proxy, {
                i: full.length,
                duration: Math.min(1.4, Math.max(0.5, full.length * 0.028)),
                ease: "none",
                onUpdate: () => {
                  if (textEl) textEl.textContent = full.slice(0, Math.round(proxy.i));
                },
              })
              .call(() => {
                if (caret) caret.style.display = "none";
                scrollToStep(step);
              });
          } else {
            // badge wartości
            tl.set(step, { opacity: 1 }, "+=0.2")
              .fromTo(
                msg,
                { y: 16, autoAlpha: 0, scale: 0.97 },
                { y: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.4)" }
              )
              .call(() => scrollToStep(step));
            if (isBadge) {
              tl.fromTo(
                msg,
                { boxShadow: "0 0 0 0 var(--blue-glow)" },
                { boxShadow: "0 0 0 12px transparent", duration: 0.9, ease: "power2.out" }
              );
            }
          }

          const hold = Math.min(1.8, (msg.textContent?.length ?? 40) * 0.011);
          tl.to({}, { duration: hold });
        });

        tlRef.current = tl;

        // Autoplay: zmiana taba gra od razu; pierwsze wejście w viewport z pauzą oddechu
        const rect = root.getBoundingClientRect();
        const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
        if (inView && startedRef.current) {
          tl.play();
        } else {
          gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top 72%",
              once: true,
              onEnter: () => {
                startedRef.current = true;
                gsap.delayedCall(1.0, () => tl.play());
              },
            },
          });
          if (inView) {
            startedRef.current = true;
            gsap.delayedCall(1.0, () => tl.play());
          }
        }
      });

      mm.add(REDUCE, () => {
        gsap.set(".chat-step", { opacity: 1 });
        gsap.set(".chat-typing", { display: "none" });
        setDone(true);
      });
    },
    { scope, dependencies: [scenario], revertOnUpdate: true }
  );

  const switchScenario = (i: number) => {
    if (i === scenario) return;
    startedRef.current = true; // klik = intencja, nowy scenariusz gra od razu
    setDone(false);
    bodyRef.current?.scrollTo({ top: 0 });
    setScenario(i);
  };

  const replay = () => {
    setDone(false);
    bodyRef.current?.scrollTo({ top: 0 });
    const dots = scope.current?.querySelectorAll<HTMLElement>(".chat-typing");
    dots?.forEach((d) => (d.style.display = ""));
    tlRef.current?.restart();
  };

  return (
    <div ref={scope} className="frame-l2 relative w-full">
      {/* Glass header (elewacje v4): absolute nad przewijaną rozmową — blur rozmywa treść.
          Nested radii: frame 20 → header top 19 (wewnątrz 1px obrysu). */}
      <div className="glass-head absolute inset-x-0 top-0 z-10 rounded-t-[19px]">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-3">
            <Logo withWord={false} markSize={22} />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-medium text-ink">{t.title}</p>
              <p className="flex items-center gap-1.5 text-xs text-mute">
                <span className="chat-online-dot inline-block h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
                {t.status}
                <span aria-hidden="true">—</span>
                <span className="num">{clock}</span>
              </p>
            </div>
          </div>
          {done && (
            <button
              onClick={replay}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-line-2 px-3 py-1.5 text-xs text-sub hover:bg-l3"
            >
              <Glyph name="replay" size={13} />
              {t.replay}
            </button>
          )}
        </div>
        {/* Taby scenariuszy */}
        <div className="flex gap-1.5 px-5 pb-2.5" role="group" aria-label="Scenariusze demo">
          {t.scenarios.map((s, i) => (
            <button
              key={s.key}
              onClick={() => switchScenario(i)}
              aria-pressed={i === scenario}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
                i === scenario
                  ? "bg-blue-tint text-blue-soft"
                  : "text-mute hover:bg-l3 hover:text-sub"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rozmowa — scrolluje POD glass headerem (pt = wysokość headera) */}
      <div
        ref={bodyRef}
        data-lenis-prevent
        tabIndex={0}
        role="log"
        aria-label="Rozmowa demo"
        className="flex max-h-[556px] min-h-[476px] flex-col gap-4 overflow-y-auto p-5 pt-[112px]"
      >
        {active.steps.map((step, i) => (
          <div
            key={`${active.key}-${i}`}
            data-role={step.role}
            className={`chat-step ${step.role === "user" ? "self-end" : "self-start"}`}
          >
            {step.role === "bot" && (
              <div className="chat-typing mb-2 flex w-fit items-center gap-1 rounded-2xl bg-elevated px-3.5 py-3">
                <span className="chat-dot" />
                <span className="chat-dot" />
                <span className="chat-dot" />
              </div>
            )}
            <div className={`chat-msg max-w-[85%] ${step.role === "user" ? "ml-auto" : ""}`}>
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  step.role === "user"
                    ? "rounded-br-md bg-blue text-onblue"
                    : "rounded-bl-md bg-elevated text-ink"
                }`}
              >
                {step.role === "user" ? (
                  <p>
                    <span className="chat-user-text">{step.text}</span>
                    <span className="chat-caret typing-caret" style={{ display: "none" }} aria-hidden="true" />
                  </p>
                ) : (
                  <p>{step.text}</p>
                )}
                {"card" in step && step.card && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-hairline bg-card p-3">
                    {(() => {
                      // fallback inicjałów zostaje na przyszłe wpisy bez kind (np. EN dict)
                      const card = step.card as { kind?: ProductKind; initials: string };
                      return card.kind ? (
                        <ProductVisual kind={card.kind} size={44} />
                      ) : (
                        <div
                          aria-hidden="true"
                          className="num flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-tint text-xs text-blue-soft"
                        >
                          {card.initials}
                        </div>
                      );
                    })()}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">{step.card.name}</p>
                      <p className="truncate text-xs text-mute">{step.card.tags}</p>
                      <p className="mt-1 text-xs text-sub">{step.card.meta}</p>
                    </div>
                    <span className="num ml-auto shrink-0 text-sm text-ink">{step.card.price}</span>
                  </div>
                )}
                {"after" in step && step.after && <p className="mt-3">{step.after}</p>}
              </div>
            </div>
          </div>
        ))}

        {/* Badge wartości scenariusza */}
        <div data-role="badge" className="chat-step self-center">
          <p className="chat-msg flex items-center gap-2 rounded-full border border-hairline bg-blue-tint px-4 py-2 text-xs text-blue-soft">
            <Glyph name="check" size={14} />
            <span className="num">{active.badge}</span>
          </p>
        </div>

        {/* Sugerowane pytania = pierwsze pytania pozostałych scenariuszy (copy §1) */}
        {done && (
          <div className="fade-in-panel flex flex-col items-end gap-2 self-end">
            {t.scenarios.map(
              (s, i) =>
                i !== scenario && (
                  <button
                    key={s.key}
                    onClick={() => switchScenario(i)}
                    className="max-w-[260px] truncate rounded-full border border-strongline bg-transparent px-4 py-2 text-left text-xs text-sub transition-colors duration-150 hover:border-blue hover:text-ink"
                  >
                    {s.steps[0].text}
                  </button>
                )
            )}
          </div>
        )}
      </div>

      {/* Atrapa pola — uczciwa (features §L1) */}
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
    </div>
  );
}
