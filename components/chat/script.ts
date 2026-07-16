import { pl } from "@/content/pl";
import type { ProductKind } from "@/components/ui/ProductVisual";

/** Wspólny format rozmowy dla ChatShell (v5). Adaptery mapują ISTNIEJĄCE gałęzie
 *  pl.ts 1:1 — zero nowego copy. Zdjęcia: manifest public/products/products.json. */

export type ChatCard = {
  name: string;
  price?: string;
  tags?: string;
  meta?: string;
  note?: string;
  kind?: ProductKind;
  initials?: string;
  /** slug zdjęcia z /public/products — gdy brak, fallback ProductVisual/initials */
  slug?: string;
};

export type ChatStep = {
  role: "user" | "bot";
  text: string;
  card?: ChatCard;
  after?: string;
};

export type ChatScript = {
  key: string;
  steps: ChatStep[];
  /** badge wartości na końcu rozmowy (pigułka z glifem check) */
  badge?: string;
};

/** Nazwa produktu z decku → slug zdjęcia (products.json). */
export const NAME_TO_SLUG: Record<string, string> = {
  "X-Trail 2 GTX": "x-trail-2",
  "X-Trail Mid": "x-trail-mid",
  "Kurtka 3L Shell — L": "kurtka-3l",
  "Kurtka narciarska Kids 110–116": "kurtka-kids",
  "Spodnie ocieplane Junior": "spodnie-junior",
  "Komplet termoaktywny 104–116": "komplet-termo",
  "Kask MTB Ridge": "kask-ridge",
  "Kask MTB Core": "kask-core",
  "Zapięcie U-lock": "u-lock",
  "Plecak trekkingowy": "plecak",
  "Plecak miejski": "plecak",
  "Sukienka letnia": "sukienka",
};

/** deepNbsp podmienia zwykłe spacje na twarde — dopasowanie nazw musi być odporne. */
const normalize = (s: string) => s.replace(/[  ]/g, " ");

export function productSlug(name: string): string | undefined {
  const plain = normalize(name);
  for (const [k, v] of Object.entries(NAME_TO_SLUG)) {
    if (normalize(k) === plain) return v;
  }
  return undefined;
}

type HeroScenario = (typeof pl.hero.chat.scenarios)[number];

/** Hero §1: scenariusze A/B/C — kształt już zgodny, dokładamy slugi zdjęć. */
export function scenarioToScript(s: HeroScenario): ChatScript {
  return {
    key: s.key,
    badge: s.badge,
    steps: s.steps.map((step) => {
      const card = "card" in step ? (step.card as ChatCard | undefined) : undefined;
      return {
        role: step.role,
        text: step.text,
        after: "after" in step ? (step.after as string | undefined) : undefined,
        card: card ? { ...card, slug: productSlug(card.name) } : undefined,
      };
    }),
  };
}

/** Prosta wymiana user→bot (Branże §3c, Kanały §4e, Filary §L18). */
export function exchangeToScript(key: string, ex: { user?: string; bot: string }, badge?: string): ChatScript {
  const steps: ChatStep[] = [];
  if (ex.user) steps.push({ role: "user", text: ex.user });
  steps.push({ role: "bot", text: ex.bot });
  return { key, steps, badge };
}

/** Podgląd Zaufania §8b: pytanie + odpowiedź (ton) + dogrywka (eskalacja). */
export function trustPreviewToScript(question: string, answer: string, followUp: string): ChatScript {
  return {
    key: "trust-preview",
    steps: [
      { role: "user", text: question },
      { role: "bot", text: answer },
      { role: "bot", text: followUp },
    ],
  };
}
