/** TRUTH-TABLE danych demo (V6-F2) — JEDNO źródło każdej liczby na stronie.
 *  pl.ts importuje stąd wartości pól liczbowych; kwoty/procenty w PROZIE decku
 *  pozostają stringami, ale skrypt `npm run check:numbers` wymusza, żeby każda
 *  liczba przy zł/% ze stringów pl.ts istniała w tej tabeli (koniec z rozjazdami
 *  typu „licznik vs zdanie obok"). Rejestr wartości do podmiany przed produkcją:
 *  PLACEHOLDERS.md. */

export const demo = {
  /** §2 Problem — trzy statystyki pinu (98 / 70 / 16) */
  problem: { unanswered: 98, nightShare: 70, wismoShare: 16 },

  /** §4 Panel przychodów — bot zarobił w tym miesiącu (== proza karty!) */
  revenueMonth: 47218,

  /** §5b Poranek — wiersze panelu */
  morning: { revenueToday: 2340, convos: 86, savedCarts: 7, handovers: 2 },

  /** §6 Wyniki — pas metryk (znaki +/− nadaje pl.ts) */
  counters: { conv: 18, aov: 23, wismo: 64 },

  /** §6 „Kiedy spałeś, bot…" */
  night: { convos: 34, sale: 6840, tickets: 21 },

  /** §6b Kalkulator ROI */
  calc: {
    costMonthly: 1299,
    glowThreshold: 10000,
    defaults: { visits: 20000, aov: 180, conv: 1.8 },
    upliftConvPp: 0.5,
    upliftAovPct: 10,
  },

  /** §9 Cennik (roczne = demo −20%, PLACEHOLDERS) */
  prices: {
    starter: { monthly: 499, yearly: 399 },
    growth: { monthly: 1299, yearly: 1039 },
    billingDiscountPct: 20,
  },

  /** Kwoty zdarzeń demo (ticker §1b, ratownik §4c, zamówienie #8412 §1) */
  cartSaved: 214,
  orderValue: 399,
  bathroomSet: 1260,

  /** Ceny produktów katalogu demo (karty czatu / wyniki / reco — 1:1 z §1/§3) */
  productPrices: {
    xTrail2: 379,
    xTrailMid: 399,
    kurtka3l: 449,
    kurtkaKids: 189,
    spodnieJunior: 159,
    kompletTermo: 99,
    kaskRidge: 219,
    kaskCore: 189,
  },

  /** Chipy efektów branż §3c + rabaty w rozmowach */
  chips: { modaReturnsPct: 30, domBasketPct: 38, elektronikaCompatPct: 50 },
  b2bBulkDiscountPct: 12,
  bundleDiscountPct: 15,

  /** Budżety z pytań klientów w scenariuszach (§1/§3c) + oferta rat (§5b) */
  queryBudgets: { heroShoes: 400, kidsSki: 200, dress: 300 },
  installmentsRatePct: 0,
} as const;

/** Płaski zbiór wszystkich wartości liczbowych tabeli — dla check-numbers.mjs. */
export function demoValues(): Set<number> {
  const out = new Set<number>();
  const walk = (v: unknown) => {
    if (typeof v === "number") out.add(v);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(demo);
  return out;
}
