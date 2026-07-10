/** Konfiguracja skinów ChatShell (v5, DNA „Chat authenticity"): czysta konfiguracja,
 *  ZERO logiki. Ewokujemy wzorce UX kanałów (bąble, ogonki, receipty, statusy) —
 *  bez logotypów kanałów w mockupie; kolory wyłącznie z rodziny blue (one-accent). */

export type ChatSkinName = "onsite" | "messenger" | "instagram" | "email" | "legacy";

export type ChatSkinConfig = {
  /** klasy bąbli */
  bubbleUser: string;
  bubbleBot: string;
  /** avatar persony przy bąblach bota */
  avatar: boolean;
  /** typing dots przed odpowiedzią bota */
  dots: boolean;
  /** „Wyświetlone" pod ostatnim bąblem bota */
  receipt: boolean;
  /** separator „Dzisiaj" nad rozmową */
  divider: boolean;
  /** status w headerze: klucz do pl (persona.status / chatUi.activeNow) */
  presence: "status" | "activeNow" | "none";
  /** cytat pytania nad odpowiedzią (wzorzec reply IG) */
  replyQuote: boolean;
  /** pasek narzędzi przy atrapie inputu (glify camera/plus — wzorzec komunikatora) */
  inputTools: boolean;
  /** klasa na body — legacy dostaje systemowy font i przygaszenie */
  bodyClass: string;
};

export const CHAT_SKINS: Record<Exclude<ChatSkinName, "email">, ChatSkinConfig> = {
  onsite: {
    bubbleUser: "rounded-2xl rounded-br-md bg-blue text-onblue",
    bubbleBot: "rounded-2xl rounded-bl-md bg-elevated text-ink",
    avatar: true,
    dots: true,
    receipt: false,
    divider: true,
    presence: "status",
    replyQuote: false,
    inputTools: false,
    bodyClass: "",
  },
  messenger: {
    // pełne zaokrąglenia bez ogonków — sylwetka komunikatora, kolor NASZ blue
    bubbleUser: "rounded-3xl bg-blue text-onblue",
    bubbleBot: "rounded-3xl bg-elevated text-ink",
    avatar: true,
    dots: true,
    receipt: true,
    divider: true,
    presence: "status",
    replyQuote: false,
    inputTools: true,
    bodyClass: "",
  },
  instagram: {
    // pigułki + gradient user w rodzinie blue (globals: .chat-ig-user)
    bubbleUser: "rounded-[22px] chat-ig-user",
    bubbleBot: "rounded-[22px] border border-line-1 bg-l1 text-ink",
    avatar: true,
    dots: true,
    receipt: false,
    divider: true,
    presence: "activeNow",
    replyQuote: true,
    inputTools: true,
    bodyClass: "",
  },
  legacy: {
    // celowy anty-wzorzec: kanciasto, bez życia, systemowy font (Arena — lewa strona)
    bubbleUser: "rounded-[4px] bg-elevated text-sub",
    bubbleBot: "rounded-[4px] border border-line-1 bg-card text-sub",
    avatar: false,
    dots: false,
    receipt: false,
    divider: false,
    presence: "none",
    replyQuote: false,
    inputTools: false,
    bodyClass: "chat-legacy-font opacity-85 saturate-[.6]",
  },
};
