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
## Mobile (390×844) — FAIL

Build: świeży (out/index.html 10:55, żadne źródło nowsze — bez rebuildu). Kontekst przebiegu: lejek po audycie 15 person — nowe sekcje SocialProof `#referencje`, Steps `#wdrozenie`, Faq `#faq` + kotwica ceny w `#demo` (wszystkie 4 kotwice obecne w buildzie), neutralne produkty w kartach reko. Wynik: 8/9 PASS, 1 FAIL (labelki <13 px w kartach reko). Powtórka z `--trace on` potwierdziła identyczną listę naruszeń.

| Test | Wynik | Szczegóły |
|---|---|---|
| liczniki: wartość == data-final po wjeździe w viewport | PASS | nigdy 0/pusta |
| liczniki: urwany przejazd nie zostawia zer przy sufiksach | PASS | — |
| odstępy między sekcjami ≤200 px | PASS | 0 naruszeń gapów (nowe sekcje nie tworzą pasów pustki) |
| mobilny hero: artefakt 3 funkcji z zakładkami | PASS | — |
| zero poziomego overflow | PASS | scrollWidth ≤390 px (nowe sekcje + FAQ bez overflow) |
| typografia: proza ≥16 px, labelki ≥13 px | **FAIL** | **9 naruszeń klasy „label" (10–12 px), wszystkie w kartach reko demo — lista niżej** |
| strona ≤22 ekranów | PASS | **ekranów: 20.2** (wzrost z 15.8 po 3 nowych sekcjach; zapas 1.8 ekranu) |
| sticky CTA po hero, ukryty w finale | PASS | — |
| cele dotykowe: WCAG AA ≥24 px | PASS | 53 cele (w tym akordeon FAQ), 0 poniżej 24 px |

Kontrakty `test.fail()` (F2/F3): brak w tym przebiegu — 9/9 to zwykłe asercje (markery known-fail zdjęte po rewizji AIDA).

### Metryki
- Ekrany (390×844): **20.2** / limit 22 (poprzednio 15.8; +4.4 ekranu po SocialProof/Steps/Faq)
- Cele dotykowe: 53; AAA (≥44 px) spełnia **44/53**
- Proza <16 px: **0** naruszeń; labelki <13 px: **9** naruszeń

### Naruszenia labelek <13 px (work-itemy) — `components/sections/feature-panels.tsx`, karty reko demo
| Element (selektor/linia) | Tekst | Zmierzone | Próg |
|---|---|---|---|
| `span.text-[11px]` badge persony (L73, `persona.aiBadge`) | „AI" | 11 px | ≥13 px |
| `span.text-[10px]` badge przeceny (L275, `d.saleBadge`) | „Przecena" | 10 px (×2 wystąpienia) | ≥13 px |
| `p.text-[12px]` nazwa produktu (L282, `p.name`) | „Sukienka letnia" | 12 px | ≥13 px |
| `p.text-[12px]` nazwa produktu (L282) | „X-Trail 2 GTX" | 12 px | ≥13 px |
| `p.text-[12px]` nazwa produktu (L282) | „Kurtka 3L Shell — L" | 12 px | ≥13 px |
| `p.text-[12px]` nazwa produktu (L282) | „Plecak miejski" | 12 px | ≥13 px |
| `span.num.text-[11px]` stara cena (L284, `p.oldPrice`) | „259 zł" | 11 px | ≥13 px |
| `span.num.text-[11px]` stara cena (L284) | „459 zł" | 11 px | ≥13 px |

Uwaga diagnostyczna: arbitrary `text-[10/11/12px]` omija F2 var-override max-md (`--text-xs→13px`, `--text-label→13px`) — nowe neutralne nazwy/ceny produktów renderują się w tych klasach, stąd regres względem poprzedniego przebiegu (0 naruszeń). Kategoria `p.label.text-[10px]` (L281) nie weszła na listę (element niewidoczny/niezłapany w sweepie).

### Poniżej AAA ≥44 px (pasmo 24–44, wyjątki WCAG — informacyjnie, nie blokuje)
- `button` „Chat" — 34×44
- `a` „Zobacz dowody" — 140×26
- `a` „Zobacz badanie arXiv" — 350×26
- `a` „Zobacz badanie DOI" — 350×26 (×2)
- `button` „Pokaż wszystkie 10 badań" — 238×44
- `a` „kontakt@hackmysales.pl" — 235×26
- `a` „Polityka prywatności" — 120×28
- `a` „Regulamin" — 62×28

Trace: `qa/test-results/mobile-layout-typografia-proza-≥16-px-labelki-≥13-px-mobile/trace.zip` (`npx playwright show-trace …`).

_status: FAIL · 2026-07-16 09:03 · 244fbc6_
<!-- qa:mobile:end -->

<!-- qa:visual:start -->
## visual — brak przebiegu
<!-- qa:visual:end -->

<!-- qa:console-perf:start -->
## console-perf — PASS (2026-07-16 11:00)

**Zakres przebiegu:** bramka konsoli (console-desktop + console-mobile) na świeżym
buildzie statycznym (`out/`, serve-out :5343). Build z 10:55 nowszy niż wszystkie
źródła (`app/page.tsx` 10:54 — 3 nowe sekcje: SocialProof `#referencje`, Steps
`#wdrozenie`, Faq `#faq`, kotwica ceny w `#demo`, FAQPage JSON-LD, neutralne
produkty reco sukienka/plecak) — rebuild niepotrzebny. Weryfikacja zawartości
buildu: `id="referencje"`, `id="wdrozenie"`, `id="faq"` obecne w `out/index.html`.

### Konsola (0/0 po filtrze NOISE)

| Projekt | Test | Wynik |
|---|---|---|
| console-desktop (1440×900) | pełny przejazd + interakcje | PASS — 0 błędów / 0 ostrzeżeń |
| console-mobile (390×844) | pełny przejazd + interakcje | PASS — 0 błędów / 0 ostrzeżeń |

2 passed (41,8 s). Punkty ryzyka nowych sekcji sprawdzone:
- brak warnów next/image dla nowych slugów (sukienka/plecak) — zero 404 i zero
  ostrzeżeń o `sizes`,
- brak warnów hydration po dodaniu 3 sekcji,
- JSON-LD FAQPage dokładnie 1× w `<script type="application/ld+json">`; drugie
  wystąpienie stringa „FAQPage" w `out/index.html` to payload RSC
  (`self.__next_f.push`) — oczekiwane w Next, NIE duplikat schema.

### Long tasks >200 ms (report-only, LT_FAIL_MS nieustawione)

| Projekt | Long tasks >200 ms |
|---|---|
| console-desktop | brak (`qa/perf/longtasks-console-desktop.json` = `[]`, 10:59) |
| console-mobile | brak (`qa/perf/longtasks-console-mobile.json` = `[]`, 10:59) |

### Lighthouse — NIE mierzony w tym przebiegu (celowo)

`npm run qa:perf` pominięty na wyraźne polecenie prowadzącego: dev server usera
może działać w tle, a per `docs/failures.md` LH pod kontencją CPU kłamie (zaniża
Perf). Ostatnie wartości (08:47, **build sprzed nowych sekcji** — wyłącznie
referencyjne, nieaktualne dla obecnego buildu):

| Metryka | Desktop (próg) | Mobile (próg) |
|---|---|---|
| Performance | 67 (≥90) — kontencja/artefakt Lantern | 86 (≥80) |
| Accessibility | 96 (≥95) | 96 (≥95) |

Fallback LCP (real, CDP 4×): brak adnotacji w JSON-ach z 08:47. Świeży `qa:perf`
na idle (bez dev-servera) wymagany po tym buildzie, zanim Perf będzie rozstrzygający.

_status: PASS · 2026-07-16 09:01 · 244fbc6_
<!-- qa:console-perf:end -->
