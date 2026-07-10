"use client";

import { useRef, useState, type RefObject } from "react";
import { gsap, useGSAP, typeIntoPunct, NO_REDUCE, REDUCE } from "@/lib/motion";

/** Silnik playbacku rozmów (v5) — wyciągnięty z ChatDemo, rytm z DNA „Chat authenticity":
 *  typing dots 600–900 ms (deterministycznie per krok), klient pisze z pauzami po
 *  interpunkcji (typeIntoPunct), scroll kotwiczony na ostatnim widocznym kroku.
 *  Tryby: samostart on-scroll (active=undefined) lub sterowany z zewnątrz (Pillars) —
 *  wtedy start dopiero po ≥200 ms aktywności, wyjście ze stanu = pełny reset.
 *  Reduced-motion: cała rozmowa widoczna statycznie. */
export function useChatPlayback(opts: {
  scope: RefObject<HTMLElement | null>;
  bodyRef?: RefObject<HTMLElement | null>;
  mode?: "play" | "static";
  active?: boolean;
  legacy?: boolean;
  scriptKey: string;
  onDone?: () => void;
}) {
  const { scope, bodyRef, mode = "play", active, legacy = false, scriptKey, onDone } = opts;
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const startedRef = useRef(false);
  const pendingRef = useRef<gsap.core.Tween | null>(null);
  const [done, setDone] = useState(false);

  const resetDots = () => {
    scope.current
      ?.querySelectorAll<HTMLElement>(".chat-typing")
      .forEach((d) => (d.style.display = ""));
  };

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const body = bodyRef?.current ?? null;
      const mm = gsap.matchMedia();

      if (mode === "static") {
        gsap.set(".chat-step", { opacity: 1 });
        gsap.set(".chat-typing", { display: "none" });
        setDone(true);
        return;
      }

      mm.add(NO_REDUCE, () => {
        const steps = gsap.utils.toArray<HTMLElement>(".chat-step", root);
        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            setDone(true);
            onDone?.();
          },
        });

        const scrollToStep = (step: HTMLElement) => {
          if (!body) return;
          body.scrollTo({
            top: Math.max(0, step.offsetTop + step.offsetHeight - body.clientHeight + 20),
            behavior: "smooth",
          });
        };

        steps.forEach((step, i) => {
          const role = step.dataset.role;
          const dots = step.querySelector<HTMLElement>(".chat-typing");
          const msg = step.querySelector<HTMLElement>(".chat-msg");
          if (!msg) return;

          if (role === "bot" && dots && !legacy) {
            // dots 600–900 ms — deterministycznie (bez Math.random, stabilne replaye)
            const hold = 0.6 + 0.3 * (((i * 37) % 100) / 100);
            tl.set(step, { opacity: 1 })
              .fromTo(dots, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
              .to({}, { duration: hold })
              .to(dots, { autoAlpha: 0, duration: 0.15 })
              .set(dots, { display: "none" })
              .fromTo(
                msg,
                { y: 16, autoAlpha: 0, scale: 0.97 },
                { y: 0, autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.4)" }
              )
              .call(() => scrollToStep(step));
          } else if (role === "bot" && legacy) {
            // legacy: odpowiedź „wpada bez życia" — bez dots, bez springa
            tl.set(step, { opacity: 1 }, "+=0.5").fromTo(
              msg,
              { autoAlpha: 0 },
              { autoAlpha: 1, duration: 0.18, ease: "none" }
            );
          } else if (role === "user") {
            const textEl = step.querySelector<HTMLElement>(".chat-user-text");
            const caret = step.querySelector<HTMLElement>(".chat-caret");
            tl.set(step, { opacity: 1 }, "+=0.35").fromTo(
              msg,
              { y: 12, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.25, ease: "power2.out" }
            );
            typeIntoPunct(tl, textEl, { caret });
            tl.call(() => scrollToStep(step));
          } else {
            // badge wartości / divider
            tl.set(step, { opacity: 1 }, "+=0.2").fromTo(
              msg,
              { y: role === "divider" ? 0 : 16, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, scale: 1, duration: role === "divider" ? 0.25 : 0.45, ease: "back.out(1.4)" }
            );
            if (role === "badge") {
              tl.call(() => scrollToStep(step)).fromTo(
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

        if (active === undefined) {
          // samostart: pierwszy wjazd w viewport z pauzą oddechu; rebuild gra od razu
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
        } else if (active) {
          // sterowanie zewnętrzne: start po ≥200 ms aktywności (kalibracja scrubów)
          pendingRef.current = gsap.delayedCall(0.2, () => tl.play(0));
        }

        return () => {
          pendingRef.current?.kill();
          pendingRef.current = null;
        };
      });

      mm.add(REDUCE, () => {
        gsap.set(".chat-step", { opacity: 1 });
        gsap.set(".chat-typing", { display: "none" });
        setDone(true);
      });
    },
    // rebuild przy zmianie scenariusza ORAZ stanu aktywności (wyjście = revert do stanu 0)
    { scope, dependencies: [scriptKey, active, mode], revertOnUpdate: true }
  );

  const replay = () => {
    setDone(false);
    bodyRef?.current?.scrollTo({ top: 0 });
    resetDots();
    tlRef.current?.restart();
  };

  return { done, setDone, replay };
}
