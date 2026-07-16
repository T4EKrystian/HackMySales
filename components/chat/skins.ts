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
  /** IG: gradientowy 1px ring avatara (jedyny ślad gradientu — anti-kitsch V6) */
  avatarRing?: boolean;
  /** ogonek (rounded-br/bl-md) TYLKO na ostatnim bąblu ciągu tej samej strony */
  tail?: boolean;
};

export const CHAT_SKINS: Record<Exclude<ChatSkinName, "email">, ChatSkinConfig> = {
  onsite: {
    // ogonek tylko na ostatnim bąblu ciągu (grupowanie) — nie na każdym
    bubbleUser: "rounded-lg bg-blue text-onblue",
    bubbleBot: "rounded-lg bg-elevated text-ink",
    avatar: true,
    dots: true,
    receipt: false,
    divider: true,
    presence: "status",
    replyQuote: false,
    inputTools: false,
    bodyClass: "",
    tail: true,
  },
  messenger: {
    // pełne zaokrąglenia + ogonek na ostatnim bąblu ciągu (sylwetka Messenger)
    bubbleUser: "rounded-lg chat-user-quiet",
    bubbleBot: "rounded-lg bg-elevated text-ink",
    avatar: true,
    dots: true,
    receipt: true,
    divider: true,
    presence: "status",
    replyQuote: false,
    inputTools: true,
    bodyClass: "",
    tail: true,
  },
  instagram: {
    // pigułki; gradient TYLKO jako ring avatara (V6) — bąbel wyciszony solid
    bubbleUser: "rounded-lg chat-user-quiet",
    bubbleBot: "rounded-lg border border-line-1 bg-l1 text-ink",
    avatar: true,
    dots: true,
    receipt: false,
    divider: true,
    presence: "activeNow",
    replyQuote: true,
    inputTools: true,
    bodyClass: "",
    avatarRing: true,
  },
  legacy: {
    // celowy anty-wzorzec: kanciasto, bez życia, systemowy font (Arena — lewa strona)
    bubbleUser: "rounded-sm bg-elevated text-sub",
    bubbleBot: "rounded-sm border border-line-1 bg-card text-sub",
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
