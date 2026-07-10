"use client";

import { useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { pl } from "@/content/pl";
import { Logo } from "@/components/ui/Logo";
import { gsap, useGSAP, NO_REDUCE, REDUCE } from "@/lib/motion";

/** Żywe demo czatu z trzema scenariuszami (features.md §L1+L6, motion.md §6).
 *  Taby: Doradztwo / Rozmiar / Paczka — zmiana przebudowuje timeline i odtwarza od zera.
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

  const active = t.scenarios[scenario];

  useGSAP(
    () => {
      const root = scope.current;
      const body = bodyRef.current;
      if (!root || !body) return;

      const mm = gsap.matchMedia();

      mm.add(NO_REDUCE, () => {
        const steps = gsap.utils.toArray<HTMLElement>(".chat-step", root);
        const tl = gsap.timeline({ paused: true, onComplete: () => setDone(true) });

        const scrollDown = () => body.scrollTo({ top: body.scrollHeight, behavior: "smooth" });

        steps.forEach((step) => {
          const isBot = step.dataset.role === "bot";
          const isBadge = step.dataset.role === "badge";
          const dots = step.querySelector<HTMLElement>(".chat-typing");
          const msg = step.querySelector<HTMLElement>(".chat-msg");
          if (!msg) return;

          if (isBot && dots) {
            tl.set(step, { opacity: 1 })
              .fromTo(dots, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
              .to({}, { duration: 0.75 })
              .to(dots, { autoAlpha: 0, duration: 0.15 })
              .set(dots, { display: "none" });
          } else {
            tl.set(step, { opacity: 1 }, "+=0.45");
          }

          tl.fromTo(
            msg,
            { y: 16, autoAlpha: 0, scale: 0.97 },
            { y: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.4)" }
          ).call(scrollDown);

          if (isBadge) {
            tl.fromTo(
              msg,
              { boxShadow: "0 0 0 0 var(--blue-glow)" },
              { boxShadow: "0 0 0 12px transparent", duration: 0.9, ease: "power2.out" }
            );
          }

          const hold = Math.min(2.0, (msg.textContent?.length ?? 40) * 0.012);
          tl.to({}, { duration: hold });
        });

        tlRef.current = tl;

        // Autoplay: przy zmianie taba (element już w viewport) lub przy pierwszym wejściu w viewport
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
                tl.play();
              },
            },
          });
          if (inView) {
            startedRef.current = true;
            tl.play();
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
    <div
      ref={scope}
      className="relative w-full rounded-[var(--radius-xl)] border border-hairline bg-card shadow-card"
    >
      {/* Nagłówek okna */}
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <Logo withWord={false} markSize={22} />
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-medium text-ink">{t.title}</p>
            <p className="flex items-center gap-1.5 text-xs text-mute">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
              {t.status}
            </p>
          </div>
        </div>
        {done && (
          <button
            onClick={replay}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-xs text-sub hover:bg-elevated"
          >
            <RotateCcw size={13} strokeWidth={1.75} aria-hidden="true" />
            {t.replay}
          </button>
        )}
      </div>

      {/* Taby scenariuszy */}
      <div className="flex gap-1.5 border-b border-hairline px-5 py-2.5" role="group" aria-label="Scenariusze demo">
        {t.scenarios.map((s, i) => (
          <button
            key={s.key}
            onClick={() => switchScenario(i)}
            aria-pressed={i === scenario}
            className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors duration-150 ${
              i === scenario
                ? "bg-blue-tint text-blue-soft"
                : "text-mute hover:bg-elevated hover:text-sub"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Rozmowa */}
      <div
        ref={bodyRef}
        data-lenis-prevent
        tabIndex={0}
        role="log"
        aria-label="Rozmowa demo"
        className="flex max-h-[460px] min-h-[380px] flex-col gap-4 overflow-y-auto p-5"
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
                <p>{step.text}</p>
                {"card" in step && step.card && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-hairline bg-card p-3">
                    <div
                      aria-hidden="true"
                      className="num flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-tint text-xs text-blue-soft"
                    >
                      {step.card.initials}
                    </div>
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
            <Check size={14} strokeWidth={2} aria-hidden="true" />
            <span className="num">{active.badge}</span>
          </p>
        </div>
      </div>

      {/* Atrapa pola — uczciwa (features.md §L1) */}
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
