"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { pl } from "@/content/pl";
import { Glyph } from "@/components/ui/Glyph";
import { gsap, useGSAP, typeInto, NO_REDUCE, REDUCE } from "@/lib/motion";
import { CHAT_SKINS, type ChatSkinName } from "./skins";
import { useChatPlayback } from "./useChatPlayback";
import {
  AttachmentProductCard,
  DayDivider,
  InputTools,
  PersonaAvatar,
  PersonaRow,
  ReadReceipt,
  TypingDots,
} from "./parts";
import type { ChatScript } from "./script";

/** ChatShell (v5, DNA „Chat authenticity"): jedna powłoka rozmów demo w skinach
 *  onsite / messenger / instagram / email / legacy. Copy 1:1 z pl.ts (adaptery
 *  w script.ts), persona Magda + plakietka AI, playback silnikiem useChatPlayback.
 *  SSR/no-JS: pełna rozmowa w markupie (odsłania ją dopiero silnik). */

export type ChatShellProps = {
  script: ChatScript;
  skin?: ChatSkinName;
  /** full = ramka L2 + glass header; bare = samo body (ramkę daje rodzic) */
  chrome?: "full" | "bare";
  /** play = silnik; static = wszystko widoczne od razu (Trust/ForWho) */
  mode?: "play" | "static";
  /** sterowanie z zewnątrz (Pillars): true = graj (po 200 ms), false = reset */
  active?: boolean;
  /** V6: hero — playback rusza po intro strony (kropka online + 0,4 s) */
  waitForIntro?: boolean;
  /** żywy zegar w wierszu statusu (hero) */
  clock?: string;
  /** slot pod wierszem tożsamości w headerze (taby hero) */
  headerExtra?: ReactNode;
  /** stopka okna (atrapa inputu hero); brak = bez stopki */
  footer?: ReactNode;
  /** chipy sugerowanych pytań po zakończeniu rozmowy */
  quickReplies?: { key: string; text: string; onClick: () => void }[];
  /** e-mail: metadane nagłówka (Od/Temat) i link stopki */
  emailMeta?: { fromLabel: string; from: string; subjectLabel: string; subject: string };
  emailLink?: string;
  /** V6 morph Kanałów (opt-in): data-flip-id na ramce (flipId) i bąblach (flipMsgs)
   *  — Flip.getState/from matchuje elementy między remountami skinów */
  flipId?: string;
  flipMsgs?: boolean;
  replayable?: boolean;
  bodyClassName?: string;
  className?: string;
  ariaLabel?: string;
  onDone?: () => void;
};

export function ChatShell(props: ChatShellProps) {
  if (props.skin === "email") return <EmailShell {...props} />;
  return <BubbleShell {...props} />;
}

/* ---------- Skiny bąbelkowe: onsite / messenger / instagram / legacy ---------- */

function BubbleShell({
  script,
  skin = "onsite",
  chrome = "full",
  mode = "play",
  active,
  waitForIntro,
  clock,
  headerExtra,
  footer,
  quickReplies,
  replayable = false,
  bodyClassName = "",
  className = "",
  ariaLabel = "Rozmowa demo",
  flipId,
  flipMsgs = false,
  onDone,
}: ChatShellProps) {
  const cfg = CHAT_SKINS[skin as Exclude<ChatSkinName, "email">];
  const ui = pl.chatUi;
  const scope = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const { done, setDone, replay, unread, jumpToLatest } = useChatPlayback({
    scope,
    bodyRef,
    mode,
    active,
    legacy: skin === "legacy",
    scriptKey: `${skin}-${script.key}`,
    waitForIntro,
    onDone,
  });

  // zmiana scenariusza = powrót na górę + RESET done (inaczej efekt [done] niżej
  // trzymałby dno POPRZEDNIEJ, dłuższej rozmowy — zgłoszony bug „kontener na dole,
  // wiadomość wyżej poza widokiem")
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
    setDone(false);
  }, [script.key, setDone]);
  // koniec rozmowy = dojazd do chipów, ale TYLKO gdy user jest przy dole (pinned);
  // gdy przewinął w górę — pigułka wisi, nie szarpiemy
  useEffect(() => {
    if (!done) return;
    const b = bodyRef.current;
    if (!b || b.dataset.pinned === "false") return;
    requestAnimationFrame(() => b.scrollTo({ top: b.scrollHeight, behavior: "auto" }));
  }, [done]);

  const lastBotIdx = (() => {
    let idx = -1;
    script.steps.forEach((s, i) => {
      if (s.role === "bot") idx = i;
    });
    return idx;
  })();
  // Pre-seed (P0.1): pierwsza wymiana (do 1. odpowiedzi bota włącznie) renderowana
  // od razu — okno czatu nigdy puste; silnik animuje dopiero od kolejnego kroku.
  const firstBotIdx = script.steps.findIndex((s) => s.role === "bot");
  // 2.1 — tury komunikatora: run-end = ostatni bąbel ciągu tej samej strony
  // (ogonek + godzina). Czasy deterministyczne od stałej bazy (nie od żywego zegara,
  // inaczej „skakałyby" przy ticku); +1 min na turę → czyta się jak realny wątek.
  const baseMin = 15 * 60 + 8;
  let runSeq = 0;
  const stepMeta = script.steps.map((s, i) => {
    const runEnd = i === script.steps.length - 1 || script.steps[i + 1]?.role !== s.role;
    let time: string | undefined;
    if (runEnd) {
      const t = baseMin + runSeq;
      runSeq += 1;
      time = `${String(Math.floor(t / 60) % 24).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    }
    return { runEnd, time };
  });
  const lastUserIdx = (() => {
    let idx = -1;
    script.steps.forEach((s, i) => {
      if (s.role === "user") idx = i;
    });
    return idx;
  })();

  const body = (
    <div
      ref={bodyRef}
      data-lenis-prevent={chrome === "full" ? true : undefined}
      tabIndex={chrome === "full" ? 0 : undefined}
      role="log"
      aria-label={ariaLabel}
      className={`flex flex-col gap-4 ${chrome === "full" ? "overflow-y-auto" : ""} ${cfg.bodyClass} ${bodyClassName}`}
    >
      {cfg.divider && chrome === "full" && <DayDivider />}

      {script.steps.map((step, i) => {
        const prevUser = i > 0 && script.steps[i - 1].role === "user" ? script.steps[i - 1].text : null;
        const meta = stepMeta[i];
        const tailCls = meta.runEnd && cfg.tail ? (step.role === "user" ? "rounded-br-md" : "rounded-bl-md") : "";
        return (
          <div
            key={`${script.key}-${i}`}
            data-role={step.role}
            data-seed={firstBotIdx >= 0 && i <= firstBotIdx ? "1" : undefined}
            className={`chat-step ${step.role === "user" ? "self-end" : "self-start"} ${
              step.role === "bot" && cfg.avatar ? "flex max-w-full items-end gap-2" : ""
            }`}
          >
            {step.role === "bot" && cfg.avatar && (
              <span className="mb-0.5 shrink-0">
                {/* avatar przy OSTATNIM bąblu wątku bota — wzorzec komunikatorów */}
                {i === lastBotIdx || script.steps[i + 1]?.role !== "bot" ? (
                  <PersonaAvatar size={28} ring={cfg.avatarRing} />
                ) : (
                  <span className="inline-block w-7" aria-hidden="true" />
                )}
              </span>
            )}
            <div className="min-w-0">
              {step.role === "bot" && cfg.dots && <TypingDots />}
              <div className={`chat-msg w-fit max-w-[78%] ${step.role === "user" ? "ml-auto" : ""}`}>
                <div
                  data-flip-id={flipMsgs ? `ch-msg-${i}` : undefined}
                  className={`px-4 py-3 text-sm leading-relaxed ${step.role === "user" ? cfg.bubbleUser : cfg.bubbleBot} ${tailCls}`}
                >
                  {step.role === "bot" && cfg.replyQuote && prevUser && (
                    <p className="mb-1.5 truncate border-l-2 border-line-2 pl-2 text-[13px] md:text-[11px] text-mute">
                      {ui.replyLabel}: {prevUser}
                    </p>
                  )}
                  {step.role === "user" ? (
                    <p>
                      <span className="chat-user-text" data-full={step.text}>
                        {step.text}
                      </span>
                      <span className="chat-caret typing-caret" style={{ display: "none" }} aria-hidden="true" />
                    </p>
                  ) : (
                    <p>{step.text}</p>
                  )}
                  {step.card && <AttachmentProductCard card={step.card} />}
                  {step.after && <p className="mt-3">{step.after}</p>}
                </div>
                {(meta.time || (cfg.receipt && i === lastUserIdx)) && (
                  <div
                    className={`chat-meta mt-1 flex items-center gap-1.5 text-[13px] leading-none text-mute md:text-[11px] ${
                      step.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {cfg.receipt && i === lastUserIdx && <ReadReceipt seen={lastBotIdx > lastUserIdx} />}
                    {cfg.receipt && i === lastUserIdx && meta.time && <span aria-hidden="true">·</span>}
                    {meta.time && <span className="num">{meta.time}</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {script.badge && (
        <div data-role="badge" className="chat-step self-center">
          <p className="chat-msg flex items-center gap-2 rounded-full border border-hairline bg-blue-tint px-4 py-2 text-xs text-blue-soft">
            <Glyph name="check" size={14} />
            <span className="num">{script.badge}</span>
          </p>
        </div>
      )}

      {done && quickReplies && quickReplies.length > 0 && (
        <div className="fade-in-panel flex flex-col items-end gap-2 self-end">
          {quickReplies.map((q) => (
            <button
              key={q.key}
              onClick={q.onClick}
              className="max-w-[260px] truncate rounded-full border border-strongline bg-transparent px-4 py-2 text-left text-xs text-sub transition-[color,border-color,transform] duration-150 hover:-translate-y-px hover:border-blue hover:text-ink"
            >
              {q.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (chrome === "bare") {
    return (
      <div ref={scope} className={className}>
        {body}
      </div>
    );
  }

  const presence =
    cfg.presence === "status"
      ? pl.hero.chat.persona.status
      : cfg.presence === "activeNow"
        ? ui.activeNow
        : undefined;

  return (
    <div ref={scope} data-flip-id={flipId} className={`frame-l2 relative w-full ${className}`}>
      <div data-flip-id={flipId ? "ch-head" : undefined} className="glass-head absolute inset-x-0 top-0 z-10 rounded-t-[19px]">
        <div className="flex items-center justify-between gap-3 px-5 py-3.5">
          <div className="flex min-w-0 items-center gap-2.5">
            {/* wzorzec aplikacji telefonu (messenger/IG): back-chevron */}
            {cfg.inputTools && <Glyph name="chevron-left" size={18} className="shrink-0 text-mute" />}
            {skin === "legacy" ? (
              <p className="chat-legacy-font text-sm text-sub">{ui.legacyName}</p>
            ) : (
              <PersonaRow presence={presence} clock={clock} ring={cfg.avatarRing} />
            )}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {replayable && done && (
              <button
                onClick={replay}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-line-2 px-3 py-1.5 text-xs text-sub hover:bg-l3"
              >
                <Glyph name="replay" size={13} />
                {pl.hero.chat.replay}
              </button>
            )}
            {cfg.inputTools && <Glyph name="more" size={18} className="text-mute" />}
          </div>
        </div>
        {headerExtra}
      </div>
      {body}
      {/* Pigułka „Nowa wiadomość" (V7): tylko gdy user przewinął log w górę podczas
          playbacku. Sibling body — element scrollowany zostaje [role="log"] (kontrakt
          morphu Kanałów). Bez JS/unread nie istnieje. */}
      {unread && (
        <button type="button" onClick={jumpToLatest} className="chat-pill" aria-live="polite">
          <Glyph name="chevron-down" size={14} />
          {ui.newMessage}
        </button>
      )}
      {footer}
      {/* pasek narzędzi wzorca komunikatora — tylko gdy skin go ma, a rodzic nie dał stopki */}
      {!footer && cfg.inputTools && (
        <div className="flex items-center gap-2.5 border-t border-hairline p-3.5">
          <InputTools />
          <span className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-hairline bg-field px-4 py-2.5 text-sm text-mute">
            <span className="min-w-0 flex-1 truncate">{ui.inputPlaceholder}</span>
            <Glyph name="smiley" size={17} className="shrink-0" />
          </span>
          <Glyph name="send" size={19} className="shrink-0 text-sub" />
        </div>
      )}
    </div>
  );
}

/* ---------- Skin e-mail (refaktor NightMailPreview) ---------- */

function EmailShell({
  script,
  emailMeta,
  emailLink,
  mode = "play",
  className = "",
  flipId,
}: ChatShellProps) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = scope.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      if (mode === "static") {
        gsap.set([".nm-line", ".nm-link"], { autoAlpha: 1 });
        return;
      }
      mm.add(NO_REDUCE, () => {
        const lines = gsap.utils.toArray<HTMLElement>(".nm-line", el);
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top 80%", once: true },
        });
        lines.forEach((line) => {
          const txt = line.querySelector<HTMLElement>(".nm-text");
          tl.fromTo(line, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15 });
          typeInto(tl, txt, { speed: 0.014, max: 1.1 });
        });
        if (el.querySelector(".nm-link")) {
          tl.fromTo(".nm-link", { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.3 });
        }
      });
      mm.add(REDUCE, () => {
        gsap.set([".nm-line", ".nm-link"], { autoAlpha: 1 });
      });
    },
    { scope, dependencies: [script.key, mode] }
  );

  return (
    <div ref={scope} data-flip-id={flipId} className={`rounded-[var(--radius-lg)] border border-hairline bg-surface ${className}`}>
      {emailMeta && (
        <div className="border-b border-hairline px-5 py-3">
          <p className="text-xs text-mute">
            {emailMeta.fromLabel}: <span className="text-sub">{emailMeta.from}</span>
          </p>
          <p className="mt-1 text-xs text-mute">
            {emailMeta.subjectLabel}: <span className="font-medium text-ink">{emailMeta.subject}</span>
          </p>
        </div>
      )}
      <div className="flex flex-col gap-2.5 px-5 py-4">
        {script.steps
          .filter((s) => s.role === "bot")
          .map((step, i) => (
            <p key={i} className={`nm-line text-sm leading-relaxed ${i === 0 ? "text-ink" : "text-sub"}`}>
              <span className="mr-2 inline-block h-1 w-1 translate-y-[-2px] rounded-full bg-blue" aria-hidden="true" />
              <span className="nm-text" data-full={step.text}>
                {step.text}
              </span>
            </p>
          ))}
        {emailLink && (
          <p className="nm-link mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-blue-soft">
            {emailLink}
            <Glyph name="arrow-right" size={14} />
          </p>
        )}
      </div>
    </div>
  );
}
