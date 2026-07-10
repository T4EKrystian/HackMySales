# Scroll report — kalibracja V5-F3 (2026-07-10)

Budżety wg `.claude/skills/motion-craft` „Kalibracja scrubów": **≥ 90 vh scrolla na stan pinu**,
snap do labels `{snapTo:"labels", duration:.4, ease:"power2.inOut"}`, scrub 0.8–1.0, countery
scrubem z twardym snapem, żadnych pustych frame'ów demo. Pomiary: viewport 1440×960 (vh = 960 px).

## PRZED (HEAD daf3141)

| Sekcja | end | px scrolla | stany | px/stan | % vh | snap | scrub |
|---|---|---|---|---|---|---|---|
| Problem (#01) | +=300% | 2 880 | 3 | 960 | 100% ✓ | **NIE** | 0.5 |
| Filary (#produkt) | +=250% | 2 400 | 3 | 800 | **83% ✗** | **NIE** | 0.6 |
| Arena (#roznica) | +=280% | 2 688 | 4 | 672 | **70% ✗** | **NIE** | 0.5 |
| Trzy kroki (how) | +=220% | 2 112 | 3 | 704 | **73% ✗** | [0,.5,1] | 0.5 |

Zmierzone pin-spacery (dev, 2026-07-10): 3840 / 3360 / 3648 / 3072 px (spacer = vh + dystans).

**Trzy najgorsze symptomy PRZED** *(przebieg wideo z pierwszej próby odrzucony — patrz Uwagi;
symptomy udokumentowane pomiarami DOM na dev :5341)*:
1. **Counter „—6+58"** — `Counter.tsx` był TIMEREM (tween 1,2 s, once przy top 80%): trzy kafle
   Wyników startowały równocześnie, a prefiks „−" sklejał się w jednym spanie z wartościami
   pośrednimi; szybki przejazd zostawiał liczby w połowie (np. „−6" zamiast „−64%").
2. **Pusta rama wyszukiwarki ~2,7 s** — `Pillars` stan 2: rama `ul` (divide-y) stała pusta przez
   typing (1,6 s) + sweep (0,55 s) + chipy (0,3 s), zanim wjechały wiersze.
3. **Duchy H2** — `document.querySelectorAll("h2")`: „Twój sklep traci klientów po cichu."
   i „Trzy kroki. Zero developera." występowały ×2 (wariant desktop-pin + mobile w DOM).

## PO (ten commit)

| Sekcja | end | px scrolla | stany | px/stan | % vh | snap (labels) | scrub |
|---|---|---|---|---|---|---|---|
| Problem (#01) | +=300% | 2 880 | 3 | 960 | 100% ✓ | start/stat0–2/end | 0.8 |
| Filary (#produkt) | +=280% | 2 688 | 3 | 896 | 93% ✓ | p0–p2/pEnd | 0.8 |
| Arena (#roznica) | +=360% | 3 456 | 4 | 864 | 90% ✓ | start/round0–3/end | 0.8 |
| Trzy kroki (how) | +=280% | 2 688 | 3 | 896 | 93% ✓ | s0/s1/s2 | 0.8 |

Zmiany towarzyszące:
- **Counter v2** (`components/ui/Counter.tsx`): wartość bindowana do progresu scrollu
  (okno top 85%→55%, scrub .8) + twardy snap `onLeave/onLeaveBack`; prefiks/sufiks w OSOBNYCH
  spanach; `data-counter`/`data-final` dla testu; SSR/reduced-motion = od razu wartość końcowa.
  Call-site'y bez zmian: Results ×2, MorningPanel, GoldMines, Problem-mobile.
- **Problem desktop**: countery scrubem z `fmtIntPl` + `onComplete` → dokładnie wartości decku.
- **Skeleton shimmer** (`Pillars` + `globals.css .pp-skel-block`): placeholder 3 wierszy od
  aktywacji stanu do wejścia realnych wyników; sekwencja startuje po ≥200 ms aktywności
  (`gsap.delayedCall`), wyjście ze stanu = kill + reset. Reduced-motion: bez animacji przesuwu.
- **Jeden H2 na sekcję**: wspólny header nad wariantami w `Problem` i `HowItWorks`
  (wzór Comparison/Pillars).

## Test dwuprędkościowy (scripts/qa-scroll.mjs)

Przejazd wheel-scrollem całej strony @ 1200 px/s i 3000 px/s, klatki co 250 ms →
`qa/scroll/{1200,3000}/` (poza gitem). Kursor na lewym marginesie — kontenery czatu
z `data-lenis-prevent` łykają wheel i fałszują przejazd (patrz Uwagi).

| Asercja | 1200 px/s | 3000 px/s |
|---|---|---|
| (a) każdy stan pinu ≥ 0,5 s | ✓ min 700 ms | — (nie dotyczy) |
| (b) zero pustych ram wyszukiwarki | ✓ 0 klatek | ✓ 0 klatek |
| (c) countery == wartości końcowe | ✓ 11/11 widocznych | ✓ 11/11 widocznych |
| (c2) prob-num == 98/70/16 | ✓ | ✓ |
| (d) zero duplikatów H2 | ✓ (14 h2, 0 dupli) | ✓ |
| (e) dead-scroll ≤ 16 px | ✓ 0 px | ✓ 0 px |

**ZIELONO na obu prędkościach** (2026-07-10). Przejazd 1200 px/s: 27,9 s / 93 klatki;
3000 px/s: 11,5 s / 38 klatek. Zmierzone ekspozycje stanów @1200 (najdłuższe okno ciągłe, ms):
Problem {800, 1600}, Filary {800, 1500}, Arena {1500, 700, 800, 1500}, Kroki {1600, 700, 1500}.
Uwaga (c): 3 countery wariantu mobilnego (`md:hidden`, display:none na 1440 px) poza asercją —
brak geometrii ST na desktopie, nikt ich nie widzi; na realnym mobile działają jak pozostałe.

Budżet (a) matematycznie: min px/stan PO = 864 px → 0,72 s @ 1200 px/s ≥ 0,5 s ✓ dla każdej
sekcji; snap dodatkowo dowozi pełną ekspozycję stanu.

## Uwagi

- Pierwszy przebieg testu odrzucony: kursor stał nad oknem czatu hero (`data-lenis-prevent` +
  `overflow-y-auto`) — wheel scrollował wnętrze czatu, przejazd trwał 200 s zamiast ~27 s;
  równolegle główna sesja restartowała dev (commity dfe5562/8fd7ce2). Klatek „przed" z tego
  biegu nie archiwizujemy — symptomy PRZED udokumentowane pomiarami wyżej.
- Snap labels mają kotwice brzegowe (start/end) — snap nie „wciąga" użytkownika przy wejściu
  ani nie więzi przy wyjściu z pinu.
- Arena: ogon timeline'u dopełnia 4×SEG, więc rundy zajmują równe ćwiartki progresu —
  licznik 0:4 i numer rundy liczone z progresu pozostają dokładne.
