# V6 — Raport końcowy: anti-kitsch + data truth + foto-gate + choreografia

Zakres wykonany w całości wg briefu V6, nowym trybem pracy: blueprint → wykonanie →
świeży screenshot → rubryka. Pełna rubryka z blueprintami: `docs/section-scores.md`.
Dziennik ślepych uliczek: `docs/failures.md`. Inwentarz efektów: `docs/effects-inventory.md`.

## 1. Sekcje — ocena i zmiany (skrót)

| Sekcja | C/R/H/A | Najważniejsza zmiana V6 |
|---|---|---|
| Nav | 4/5/4/5 | wskaźnik aktywnej sekcji (IO + mapa stanów, gaśnie między kotwicami) |
| Hero | 5/4/5/4 | wejście 1,2 s: glow→dot-grid→zapłon rdzenia→H1→demo; czat budzi się PO intro |
| Ticker | 4/5/4/4 | brak (brief: nie dotykać) |
| Pas zaufania | 4/5/4/5 | wordmarki platform w Inter — czysty wordmark, nie pseudo-logo |
| Problem | 5/4/5/4 | brak zmian; scrub+snap zostaje TYLKO tu (narracja pinu) |
| Trzy miejsca | 5/4/5/4 | foto zweryfikowane bramką; skeleton shimmer sanity |
| Kopalnie złota | 4/4/4/5 | liczby z truth-table; radar przycięty; foto w ratowniku/doradcy |
| Pojedynek | 4/4/4/5 | glow prawej strony OUT (elewacja + hairline); dowód 4 rund w DOM |
| Kanały | 5/4/4/4 | morph skina: puls 300 → Flip 450 → re-stagger 250; „rozmowa gra raz" |
| Branże | 4/4/4/4 | Magda w headerze panelu; crossfade 300→240 ms (brief ≤250) |
| Trzy kroki | 4/5/4/4 | karta KOMPLETNA na snapie (krok 01 time-based, okna 02/03 przed etykietą) |
| Poranek | 4/4/4/5 | KPI z truth-table; prześwit marquee — obalony screenshotem |
| Kalkulator | 4/4/4/5 | wartości/progi z truth-table; „jak liczymy →" zweryfikowany |
| Pas metryk | 4/5/4/5 | countery once (1,2 s → wartość końcowa) + dopisek poglądowości |
| Integracje | 4/4/4/5 | finder „rest api" → trafienie; aria-live bez zmian |
| Kontrola | 5/4/4/5 | hit-area toggli zmierzona 64×44 px; crossfade 220 ms |
| Cennik | 4/4/5/5 | cień featured OUT — elewacja + beam (tylko Growth) wystarczą |
| FAQ | 4/5/4/5 | brak |
| Od zespołu | 4/4/4/5 | watermark zmierzony: 4,5% ≤ 6% |
| Finał | 5/4/4/4 | elipsa converge PONIŻEJ microcopy („lądowisko"); ignition echo hero |
| Footer | 4/5/4/5 | brak (spokojny dead-tail) |

Wszystkie 21 sekcji ≥4 w każdej z czterech osi.

## 2. Bramki i pomiary (stan na commit F6)

- **`npm run check:photos`**: PASS — 33 sloty (32 produkty + portret) przechodzą próg
  entropii+saturacji, syntetyczny negatyw (kafel-inicjały) ODRZUCONY. Źródła i licencje:
  `public/products/CREDITS.md`.
- **`npm run check:numbers`**: PASS — zero literałów kwot/procentów w JSX poza truth-table
  (`content/demo-data.ts`); każda kwota w prozie decku pokryta wartością z truth-table.
- **`node scripts/qa-v6.mjs`**: ZIELONO — 28 asercji choreografii na buildzie PROD
  (wejście: LCP 184–200 ms na realnym Chromium, lead bez dipów, czat nigdy przed intro,
  gap intro→czat 882–893 ms, kotwica spójna, późny chunk GL bez błędów, reduced-motion
  statycznie; Kanały: switcher nigdy pusty, „ten sam mózg" we wszystkich skinach,
  puls przed morphem, click-storm 12×80 ms czysty, zero replay po `seen`, mobile fade).
- **`node scripts/qa-scroll.mjs`**: ZIELONO obie prędkości (1200 i 3000 px/s) — stany pinów
  ≥0,7 s, zero pustych ram, countery == final, zero duplikatów H2, dead-scroll 0 px.
- **Konsola (prod, z interakcjami)**: 0 błędów / 0 ostrzeżeń we wszystkich scenariuszach qa-v6
  (po naprawie: `sanitize()` w Kanałach tweenował pustą NodeList `.chat-step` przy wyjściu
  ze skina email — 4 warningi GSAP; teraz guard długości).
- **Lighthouse desktop** (`--preset=desktop`, czysta maszyna, serwa statyczna out/):
  **94 / 100 / 100 / 100** (TBT 60–70 ms) — baseline V5 utrzymany, choreografia = ~0 kosztu.
  Uwaga metodyczna: pierwszy przebieg pokazał 72 (TBT 530 ms) przy obciążonym CPU
  (aktywny Chrome pierwszoplanowy) — wzorzec „LH przy kontencji kłamie" z `docs/failures.md`;
  dwa kolejne przebiegi: 94 i 93.
- **Lighthouse mobile**: lantern 58 z symulowanym LCP **9,1 s** — ten sam znany artefakt
  symulacji co w V5 (realnie obserwowane LCP: 184–200 ms, pomiar PerformanceObserver w qa-v6).
  Dowód wg ustalonego wzorca `--throttling-method=devtools`: **61–62, LCP 3,1 s,
  TBT 680–690 ms** = dokładnie baseline V4/V5 (62 / 3,1 s / 710 ms), przy czym TBT jest
  o 20–30 ms LEPSZY od baseline'u — warunek „delta TBT po choreografii ≤ +10 ms" spełniony
  z zapasem. Ograniczenie mobile to (jak w V4/V5) font-swap + bootup, nie efekty V6.

## 3. Co wyleciało (anti-kitsch) — z zamiennikami

| Efekt | Werdykt | Zamiennik |
|---|---|---|
| `hero-nigdy` text-shadow | OUT | akcent niesie kolor + waga; glow hero = rdzeń GL (1/viewport) |
| glow prawej strony areny | OUT | elewacja L2 + border hairline |
| `shadow-cta` na wismo-dot | OUT | sama kropka + mono liczba |
| `shadow-cta` na karcie featured cennika | OUT | elewacja + border-beam (jedyny beam) |
| gradient IG jako TŁO bąbla | OUT | tło `bg-blue` −20% sat; gradient tylko jako ring avatara 1,5 px |
| bąble user messenger/IG pełny `bg-blue` | przycięte | `chat-user-quiet` (color-mix 82% w stronę muted) |
| radar (sweep pełny/szybki) | przycięte | sweep 30% łuku / 6 s |
| watermark Od zespołu | zmierzone | 4,5% (budżet ≤6%) |

Pełen inwentarz (30 pozycji z uzasadnieniami 1-zdaniowymi i audytem glow per viewport):
`docs/effects-inventory.md`.

## 4. Zarzuty audytu — ustalenia faktograficzne

Wszystkie trzy klasy zarzutów zbadaliśmy na kodzie i buildzie; wnioski z dowodami:

1. **„Nadal brak zdjęć"** — zdjęcia SĄ w buildzie (32 packshoty + portret, wszystkie sloty
   briefu). Bramka `check:photos` mierzy każdy plik (entropia luminancji + udział pikseli
   nasyconych) i odrzuca grafiki wektorowe/kafle — PASS na wszystkich slotach; syntetyczny
   negatyw poprawnie oblewa. Audyt miał częściowo rację co do JAKOŚCI dwóch kadrów z V5
   (plecak, elektronika — produkt zbyt mały w kadrze, thumb 112 px tracił fakturę);
   poprawione u źródła (ciaśniejszy crop w pipeline), nie progiem. Druga przyczyna mylnego
   odczytu: karty produktowe w czacie pojawiają się w PLAYBACKU — automat robiący screenshot
   przed odtworzeniem widzi karty puste. W V6 stany spoczynku są kompletne (kroki, snapy),
   a rozmowy startują deterministycznie po intro.
2. **„36 031 vs 47 218"** — w kodzie i decku jest wyłącznie 47 218 (jedno źródło:
   `content/demo-data.ts`, bramka `check:numbers` pilnuje). 36 031 to wartość złapana
   W POŁOWIE animacji countera (scrub). Ta klasa zniknęła systemowo: countery poza pinem
   Problemu liczą raz (1,2 s) i snapują na wartość końcową — scroll-raport potwierdza
   `counter == final` w obu prędkościach.
3. **„+14 / +18 / −51"** — wartości +14 i −51 nie występują nigdzie w repo (grep).
   Deck i strona mówią: **+18 / +23 / −64**. „14" na screenie audytu to najpewniej
   fragment „14 dni testów za darmo" z hero (sklejka OCR). Pas metryk po V6 pokazuje
   w spoczynku wyłącznie wartości końcowe, więc kolejny odczyt OCR trafi na spójne liczby.

## 5. Źródła zdjęć

Tabela slug → URL źródła → licencja: `public/products/CREDITS.md` (Pexels/Unsplash, licencje
platformowe, kadry własne pipeline'em `scripts/process-photos.mjs`: crop 1:1, desat −8%,
webp 800 px + thumb 112 px). Dziennik roboczy z odrzutami: `assets-src/SOURCES.md`.

## 6. Sygnatury choreografii (kontrakty)

- **Wejście 1,2 s**: czerń → glow+dot-grid (0–0,6) → zapłon rdzenia (0,12–0,77, shader
  `uIgnite`, intensywność = fade × ignition) → maski H1 → demo; `markIntroDone` budzi czat
  (kropka statusu pop → 0,4 s → playback). Treść/LCP nietknięte; kotwice i późny GL
  obsłużone (bramka czasowa 2,6 s).
- **Kanały**: klik nodu = puls po krawędzi 300 ms → morph Flip 450 ms (rama+bąble,
  borderRadius, stagger 0,02) → re-stagger wnętrza 250 ms. Rozmowa gra RAZ (`seen`);
  taby = to samo bez fazy pulsu; mobile = fade; reduced = podmiana natychmiastowa.
- **Finał**: rdzeń converge → płaska elipsa-„lądowisko" pod formularzem (poniżej microcopy);
  po wysłaniu jednorazowy ignition-echo (klamra z hero).
- **Rozdziały**: tint tła 0→1,6→0,8→2,4% (color-mix na body) scrubowany przez sekcje
  graniczne — zmiana temperatury, nie „efekt".
