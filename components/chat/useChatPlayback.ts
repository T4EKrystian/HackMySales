"use client";

import { useRef, useState, type RefObject } from "react";
import { gsap, useGSAP, typeIntoPunct, NO_REDUCE, REDUCE } from "@/lib/motion";
import { whenIntroDone } from "@/lib/introGate";

/** Silnik playbacku rozmów (v5→v7). Rytm z DNA „Chat authenticity": typing dots
 *  600–900 ms (deterministycznie per krok), klient pisze z pauzami po interpunkcji.
 *
 *  V7 — stick-to-bottom (tylko gdy log realnie scrolluje, chrome="full"):
 *  kotwica = DÓŁ ostatniego aktywnego elementu (dots/wiadomość). Kroki są
 *  pre-layoutowane (`.js .chat-step{opacity:0}` → scrollHeight pełny od 1. klatki),
 *  więc „scroll do scrollHeight" pokazałby pustkę przyszłych wiadomości — dlatego
 *  celujemy w krawędź AKTYWNEGO kroku. Pomiar w rAF (po paincie/kolapsie dots),
 *  tylko gdy `pinned` (user przy dole). Gdy user przewinie w górę — nie szarpiemy,
 *  podnosimy pigułkę (unread); klik → jumpToLatest przywraca pin.
 *
 *  Tryby: samostart (active=undefined) z pauzą poza viewportem; sterowany (Pillars);
 *  static / reduced-motion → cała rozmowa widoczna od razu (silnik inert). */
export function useChatPlayback(opts: {
  scope: RefObject<HTMLElement | null>;
  bodyRef?: RefObject<HTMLElement | null>;
  mode?: "play" | "static";
  active?: boolean;
  legacy?: boolean;
  scriptKey: string;
  waitForIntro?: boolean;
  onDone?: () => void;
}) {
  const { scope, bodyRef, mode = "play", active, legacy = false, scriptKey, waitForIntro = false, onDone } = opts;
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const startedRef = useRef(false);
  const pendingRef = useRef<gsap.core.Tween | null>(null);
  const [done, setDone] = useState(false);

  // stick-to-bottom / pigułka
  const pinnedRef = useRef(true);
  const anchorRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef(0);
  const expectedTopRef = useRef(-1); // ostatni scrollTop, który USTAWILIŚMY programowo
  const [unread, setUnread] = useState(false);

  const resetDots = () => {
    scope.current?.querySelectorAll<HTMLElement>(".chat-typing").forEach((d) => (d.style.display = ""));
  };

  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const body = bodyRef?.current ?? null;
      const mm = gsap.matchMedia();

      if (mode === "static") {
        // .chat-msg też: brama .js .chat-step .chat-msg{opacity:0} ukrywa treść (V7.1);
        // static nie jest reduced-motion, więc CSS-override nie zadziała — odsłoń w JS
        gsap.set(".chat-step", { opacity: 1 });
        gsap.set(".chat-msg", { opacity: 1 });
        gsap.set(".chat-typing", { display: "none" });
        setDone(true);
        return;
      }

      mm.add(NO_REDUCE, () => {
        // nowa rozmowa/rebuild → czyste stany scrolla (druga połowa fixu stale-done)
        setDone(false);
        pinnedRef.current = true;
        anchorRef.current = null;
        setUnread(false);

        const PIN_EPS = 24;
        const PAD = 20;
        // odległość dołu kotwicy od dołu kontenera (dodatnia = kotwica poniżej widoku)
        const deltaBottom = () => {
          const a = anchorRef.current;
          if (!a || !body) return 0;
          return Math.round(a.getBoundingClientRect().bottom - body.getBoundingClientRect().bottom + PAD);
        };
        const setAnchor = (el: HTMLElement | null) => {
          anchorRef.current = el;
          if (!pinnedRef.current) setUnread(true);
        };

        // CIĄGŁA pętla follow zamiast sticków w punktach timeline'u: co klatkę trzyma
        // DÓŁ kotwicy w widoku (instant scroll), jeśli pinned. Detekcja scrolla usera
        // SYNCHRONICZNIE na starcie klatki (przed naszym scrollem) — zero wyścigu z
        // osobnym async-listenerem, który „ściągałby" usera z powrotem na dół.
        // expectedTop = faktyczny scrollTop po klampie do maxScroll → odróżnia nasz
        // scroll (st≈expectedTop) od userowego. Odporne na timing reveal/kolaps dots/
        // load obrazka/różnice prod≠dev (point-sticki zostawiały okna „poza widokiem").
        let followOn = !!body;
        if (body) body.dataset.pinned = "true";
        const follow = () => {
          if (!body || !followOn) return; // stop (cleanup)
          // (1) user przewinął od naszego ostatniego scrolla? → przelicz pinned
          if (expectedTopRef.current >= 0 && Math.abs(body.scrollTop - expectedTopRef.current) > 2 && anchorRef.current) {
            const pinned = deltaBottom() <= PIN_EPS;
            pinnedRef.current = pinned;
            body.dataset.pinned = String(pinned);
            if (pinned) setUnread(false);
          }
          // (2) trzymaj kotwicę przy dole, gdy pinned
          if (pinnedRef.current && anchorRef.current) {
            const d = deltaBottom();
            if (d > 0) {
              body.scrollTo({ top: body.scrollTop + d });
              expectedTopRef.current = body.scrollTop;
            }
          }
          rafRef.current = requestAnimationFrame(follow);
        };
        if (body) rafRef.current = requestAnimationFrame(follow);

        const steps = gsap.utils.toArray<HTMLElement>(".chat-step", root);
        const tl = gsap.timeline({
          paused: true,
          onComplete: () => {
            followOn = false; // koniec rozmowy → stop pętli follow (ostatnia wiadomość i tak przy dole)
            setDone(true);
            onDone?.();
          },
        });

        steps.forEach((step, i) => {
          const role = step.dataset.role;
          const dots = step.querySelector<HTMLElement>(".chat-typing");
          const msg = step.querySelector<HTMLElement>(".chat-msg");
          if (!msg) return;

          // Pre-seed (P0.1): pierwsza wymiana już widoczna (CSS) — silnik jej nie
          // animuje; utwierdza stan, chowa dots i rusza timeline od kolejnego kroku.
          if (step.dataset.seed === "1") {
            gsap.set(step, { opacity: 1 });
            gsap.set(msg, { autoAlpha: 1, y: 0 });
            if (dots) dots.style.display = "none";
            return;
          }

          if (role === "bot" && dots && !legacy) {
            // dots 600–900 ms — deterministycznie (bez Math.random, stabilne replaye)
            const hold = 0.6 + 0.3 * (((i * 37) % 100) / 100);
            tl.set(step, { opacity: 1 })
              // kotwica = dots gdy się pojawiają (pętla follow trzyma je w widoku)
              .call(() => {
                setAnchor(dots);
              })
              .fromTo(dots, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 })
              .to({}, { duration: hold })
              .to(dots, { autoAlpha: 0, duration: 0.15 })
              .set(dots, { display: "none" })
              // po kolapsie dots kotwica → msg (layout finalny, autoAlpha rezerwuje wysokość)
              .call(() => {
                setAnchor(msg);
              })
              .fromTo(msg, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "back.out(1.4)" });
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
            tl.set(step, { opacity: 1 }, "+=0.35")
              .fromTo(msg, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.25, ease: "power2.out" })
              .call(() => {
                setAnchor(msg);
              });
            // pętla follow dowozi log, gdy bąbel usera rośnie przy zawijaniu tekstu
            typeIntoPunct(tl, textEl, { caret });
          } else {
            // badge wartości / divider — stick PRZED reveal (layout msg finalny)
            tl.set(step, { opacity: 1 }, "+=0.2")
              .call(() => {
                setAnchor(msg);
              })
              .fromTo(
                msg,
                { y: role === "divider" ? 0 : 16, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: role === "divider" ? 0.25 : 0.45, ease: "back.out(1.4)" }
              );
          }

          const hold = Math.min(1.8, (msg.textContent?.length ?? 40) * 0.011);
          tl.to({}, { duration: hold });
        });

        tlRef.current = tl;

        // wspólne sprzątanie pętli follow (dopięte do każdego return-cleanup)
        const cleanupStick = () => {
          followOn = false;
          cancelAnimationFrame(rafRef.current);
          if (body) delete body.dataset.pinned;
          pinnedRef.current = true;
          anchorRef.current = null;
          setUnread(false);
        };

        if (active === undefined) {
          // wake (V6): kropka online „zapala się", 0,4 s oddechu → pierwsza wiadomość;
          // bez waitForIntro zachowanie jak dotąd (1,0 s pauzy)
          let cleanupGate: (() => void) | null = null;
          const wake = () => {
            if (waitForIntro) {
              const dot = root.querySelector<HTMLElement>(".chat-online-dot");
              if (dot) {
                gsap.fromTo(dot, { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: "back.out(2)" });
              }
            }
            pendingRef.current = gsap.delayedCall(waitForIntro ? 0.4 : 1.0, () => tl.play());
          };
          const start = () => {
            startedRef.current = true;
            if (waitForIntro) cleanupGate = whenIntroDone(wake);
            else wake();
          };

          const rect = root.getBoundingClientRect();
          const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
          if (inView && startedRef.current) {
            tl.play();
          } else {
            gsap.timeline({
              scrollTrigger: {
                trigger: root,
                start: "top 90%",
                once: true,
                onEnter: () => {
                  if (!startedRef.current) start();
                },
              },
            });
            if (inView) start();
          }

          // pauza/wznowienie poza viewportem — timeline nie dogrywa się „w tle"
          // (zero nowych timerów: resume(), nie restart; guard startedRef chroni A5c)
          gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "bottom top",
              onLeave: () => {
                tl.pause();
                pendingRef.current?.pause();
              },
              onLeaveBack: () => {
                tl.pause();
                pendingRef.current?.pause();
              },
              onEnterBack: () => {
                if (startedRef.current) {
                  pendingRef.current?.resume();
                  tl.resume();
                }
              },
            },
          });

          return () => {
            cleanupGate?.();
            pendingRef.current?.kill();
            pendingRef.current = null;
            cleanupStick();
          };
        } else if (active) {
          // sterowanie zewnętrzne: start po ≥200 ms aktywności (kalibracja scrubów)
          pendingRef.current = gsap.delayedCall(0.2, () => tl.play(0));
        }

        return () => {
          pendingRef.current?.kill();
          pendingRef.current = null;
          cleanupStick();
        };
      });

      mm.add(REDUCE, () => {
        gsap.set(".chat-step", { opacity: 1 });
        gsap.set(".chat-msg", { opacity: 1 });
        gsap.set(".chat-typing", { display: "none" });
        setDone(true);
      });
    },
    // rebuild przy zmianie scenariusza ORAZ stanu aktywności (wyjście = revert do stanu 0)
    { scope, dependencies: [scriptKey, active, mode], revertOnUpdate: true }
  );

  const replay = () => {
    setDone(false);
    pinnedRef.current = true;
    anchorRef.current = null;
    setUnread(false);
    if (bodyRef?.current) {
      bodyRef.current.scrollTo({ top: 0 });
      bodyRef.current.dataset.pinned = "true";
    }
    resetDots();
    tlRef.current?.restart();
  };

  // pigułka „Nowa wiadomość": przywróć pin i dowieź na żywą krawędź (instant + expectedTop
  // spójnie ze stick — słuchacz nie pomyli tego z ruchem usera)
  const jumpToLatest = () => {
    const body = bodyRef?.current;
    if (!body) return;
    pinnedRef.current = true;
    body.dataset.pinned = "true";
    setUnread(false);
    const a = anchorRef.current ?? (body.lastElementChild as HTMLElement | null);
    if (a) {
      const d = Math.round(a.getBoundingClientRect().bottom - body.getBoundingClientRect().bottom + 20);
      body.scrollTo({ top: body.scrollTop + Math.max(0, d) });
      expectedTopRef.current = body.scrollTop; // faktyczny po klampie
    }
  };

  return { done, setDone, replay, unread, jumpToLatest };
}
