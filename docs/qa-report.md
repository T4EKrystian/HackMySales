# QA Report — HackMySales landing

Raport sklejany przez agentów QA (`/qa-all`). Sekcje między markerami są
podmieniane automatycznie — nie edytować ręcznie wewnątrz markerów.

<!-- qa:summary:start -->
Ostatni pełny przebieg: 2026-07-11 01:06 · ccee78e

| Agent | Wynik |
|---|---|
| qa-interactions | BRAK |
| qa-scroll | BRAK |
| qa-mobile | BRAK |
| qa-visual | BRAK |
| qa-console-perf | BRAK |

**Werdykt: CZERWONO — zadania NIE WOLNO oznaczyć jako done.**
<!-- qa:summary:end -->

<!-- qa:interactions:start -->
## interactions — brak przebiegu
<!-- qa:interactions:end -->

<!-- qa:scroll:start -->
## scroll — brak przebiegu
<!-- qa:scroll:end -->

<!-- qa:mobile:start -->
## Mobile (390×844) — PASS

Build: świeży (`npm run build` po zmianach feature-panels.tsx / chat/script.ts / pl.ts; pierwsza próba padła na prerender /404 — stale `.next` cache, po `rm -rf .next` czysty przebieg). Kontekst: realne zdjęcia produktów w 3 zakładkach hero (USE_REAL_PHOTOS=true), karty czatu aspect-square/object-cover, nowe slugi u-lock/plecak.

| Test | Wynik | Szczegóły |
|---|---|---|
| liczniki: wartość == data-final po wjeździe w viewport | PASS | nigdy 0/pusta |
| liczniki: urwany przejazd nie zostawia zer przy sufiksach | PASS | — |
| odstępy między sekcjami ≤200 px | PASS | 0 naruszeń gapów |
| mobilny hero: artefakt 3 funkcji z zakładkami | PASS | zakładki + karty z realnym foto renderują się, brak pustych ram demo |
| zero poziomego overflow | PASS | 0 elementów wystających poza 390 px (karty aspect-square OK) |
| typografia: proza ≥16 px, labelki ≥13 px | PASS | 0 naruszeń (w tym labelki cen w nowych kartach czatu) |
| strona ≤22 ekranów | PASS | **ekranów: 15.8** |
| sticky CTA po hero, ukryty w finale | PASS | — |
| cele dotykowe: WCAG AA ≥24 px | PASS | 45 celów, wszystkie ≥24 px |

Kontrakty `test.fail()` (F2/F3): brak w tym przebiegu — 9/9 to zwykłe asercje.

### Metryki
- Ekrany (390×844): **15.8** / limit 22
- Cele dotykowe: 45; AAA (≥44 px) spełnia **36/45**

### Poniżej AAA ≥44 px (pasmo 24–44, wyjątki WCAG — informacyjnie, nie blokuje)
- `button` „Chat" — 34×44
- `a` „Zobacz dowody" — 140×26
- `a` „Zobacz badanie arXiv" — 350×26
- `a` „Zobacz badanie DOI" — 350×26 (×2)
- `button` „Pokaż wszystkie 10 badań" — 238×44
- `a` „kontakt@hackmysales.pl" — 235×26
- `a` „Polityka prywatności" — 120×28
- `a` „Regulamin" — 62×28

_status: PASS · 2026-07-16 07:43 · 4c83c7b_
<!-- qa:mobile:end -->

<!-- qa:visual:start -->
## visual — brak przebiegu
<!-- qa:visual:end -->

<!-- qa:console-perf:start -->
## console-perf — PASS (2026-07-16 09:42)

**Zakres przebiegu:** bramka konsoli (console-desktop + console-mobile) na świeżym
buildzie statycznym (`out/`, serve-out :5343). Build przebudowany przed testem —
`out/index.html` był starszy niż `components/sections/feature-panels.tsx`
(przywrócone realne zdjęcia produktów, next/image fill+unoptimized) i
`components/chat/script.ts`.

### Konsola (0/0 po filtrze NOISE)

| Projekt | Test | Wynik |
|---|---|---|
| console-desktop (1440×900) | pełny przejazd + interakcje | PASS — 0 błędów / 0 ostrzeżeń |
| console-mobile (390×844) | pełny przejazd + interakcje | PASS — 0 błędów / 0 ostrzeżeń |

Brak warnów next/image (sizes/404/hydration) po przywróceniu zdjęć w 3 zakładkach
hero (feature-panels). 2 passed (35.2 s).

### Long tasks >200 ms (report-only, LT_FAIL_MS nieustawione)

| Projekt | Long tasks >200 ms |
|---|---|
| console-desktop | brak (`qa/perf/longtasks-console-desktop.json` = `[]`) |
| console-mobile | brak (`qa/perf/longtasks-console-mobile.json` = `[]`) |

### Lighthouse — NIE mierzony w tym przebiegu

`npm run qa:perf` pominięty: w tle działa dev server usera (:5341, Terminal) —
per `docs/failures.md` LH pod obciążeniem tła kłamie (kontencja CPU zaniża Perf),
a zabicie procesu usera poza zakresem bramki konsoli. Ostatni pomiar (08:47,
**starszy build**, sprzed przywrócenia zdjęć) — wartości referencyjne, nieaktualne:

| Metryka | Desktop (próg) | Mobile (próg) |
|---|---|---|
| Performance | 67 (≥90) — kontencja/artefakt Lantern, do powtórki na idle | 86 (≥80) |
| Accessibility | 96 (≥95) | 96 (≥95) |
| LCP (sim) | 2,9 s | 2,9 s |
| TBT | 0 ms | 210 ms |
| CLS | 0 | 0 |

Fallback LCP (real, CDP 4×): brak adnotacji w JSON-ach z 08:47. Wymagany świeży
`qa:perf` na idle (bez dev-servera) po tym buildzie, zanim Perf będzie rozstrzygający.

_status: PASS · 2026-07-16 07:43 · 4c83c7b_
<!-- qa:console-perf:end -->
