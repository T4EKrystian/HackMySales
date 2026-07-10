---
name: pl-typography
description: Polish typography rules for rendered copy — non-breaking spaces (sierotki), proper quotes, dashes, number and currency formatting. Use whenever rendering or reviewing any Polish text on the landing.
---

# Polska typografia — zasady dla landingu

Polish marketing copy instantly looks amateur (and AI-generated) when these rules are broken. Apply to ALL rendered strings.

## 1. Sierotki (orphans) — non-breaking space after one-letter words

Single-letter conjunctions/prepositions must never end a line: **a, i, o, u, w, z** (+ two-letter: do, na, od, po, za, ze, we — apply when practical).

Implement once as a util, apply in the dictionary layer (not per component):

```ts
// lib/typography.ts
export function plNbsp(text: string): string {
  return text
    .replace(/(^|[\s(„])([aiouwzAIOUWZ])\s+/g, "$1$2 ")
    .replace(/\s+(zł|szt\.|mc|p\.p\.|%)/g, " $1")
    .replace(/(\d)\s(\d{3})/g, "$1 $2"); // 47 218 → nbsp thousands
}
```

Apply when building the `pl.ts` dictionary export, so components stay clean. For rich text (bold spans), run on text nodes only.

## 2. Cudzysłowy i myśliki

- Polish quotes: „tekst" (U+201E open, U+201D close). Never "straight" or “english”.
- Range/pause dash: półpauza `–` with spaces („15–20 minut" bez spacji dla zakresów liczbowych; „bot — Ty czytasz" ze spacjami). Never hyphen `-` as a dash.
- Ellipsis: `…` (single char), not `...`.

## 3. Liczby, waluty, procenty

- Thousands separator: non-breaking space → `47 218`. Use `Intl.NumberFormat("pl-PL")`.
- Decimal: comma → `1,8%`, `4,5:1`.
- Currency: `399 zł` with nbsp before `zł`; PLN only in tables/API contexts.
- Percentage points: `p.p.` (not „pp" ani „punkty %").
- All numeric UI values in JetBrains Mono (`.num` class / `font-mono`), `font-variant-numeric: tabular-nums` for counters.

## 4. Formy i styl (guard rails while wiring copy)

- Do klienta per „Ty" (wielka litera w formach grzecznościowych na landing: „Twój sklep").
- No exclamation marks, no emoji (see `content/copy-pl.md` §14 for banned words).
- `lang="pl"` on `<html>`; enable `hyphens: auto` only for narrow columns if needed.

## 5. Review checklist

Resize viewport 320→1440px and scan headings/leads: no lonely „i/w/z" at line ends, no headline breaking into an awkward single word (adjust with `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs), quotes/dashes correct, every price/number formatted per §3.
