# HackMySales — Spec animacji v3 (GSAP + ScrollTrigger + Lenis + WebGL)

Cel v3: strona ma choreografię scrolla i jeden motyw wizualny — **rdzeń** (particle core), który
oddycha w hero, gaśnie w Problemie, spina Kanały i zbiega się w finalnym CTA. Ruch opowiada produkt;
nigdy nie jest ozdobą samą w sobie. Poprzednia wersja specu (v2, statyczne reveals) — w historii gita.

## 1. Stack i zasady twarde (bez zmian tam, gdzie działały)

- **GSAP 3.15** + ScrollTrigger + `useGSAP` (cleanup obowiązkowo). Od v3.13 pluginy premium są darmowe —
  używamy: **SplitText** (mask-reveals), **ScrambleText** (nav, wordmark), **DrawSVG** (sparkline, beams),
  **MotionPath** (kropka WISMO), **Flip** (tasowanie rekomendacji).
- **Lenis przez `lenis/react`** (`ReactLenis root`, lerp 0.1, autoRaf) + `useLenis(ScrollTrigger.update)`.
  UWAGA HISTORYCZNA: NIE wiązać Lenisa ręcznie z tickerem GSAP — zabiło to kiedyś scroll kółkiem.
  `data-lenis-prevent` na wewnętrznych scrollach (czat) i modalach.
- **Motion (`motion/react`)** wyłącznie do sprężynek komponentowych (hover/tap/toggle).
  Zasada: GSAP rządzi scrollem i timeline'ami, Motion mikro-springami. Nigdy oba na tej samej
  właściwości tego samego elementu.
- Animujemy WYŁĄCZNIE `transform` i `opacity` (+ `clip-path` w mask-revealach, `stroke-dashoffset` w SVG).
  `will-change` punktowo, tylko na czas animacji.
- **Tokeny ruchu** (`lib/motion.ts`): ease `expo.out` (wejścia), `power2.inOut` (scruby), custom
  `cubic-bezier(0.16,1,0.3,1)` w CSS; duracje fast .3 / base .6 / slow 1.2; stagger .06–.09.
  Wszystkie animacje z tokenów — spójność to połowa „premium”.
- **`prefers-reduced-motion: reduce`** — twardy kontrakt: zero pinów, zero parallaxu, zero WebGL
  (GLStage się nie montuje — zostają statyczne postery gradientowe), zero scrambli i marquee;
  zostają czyste fade'y i wartości końcowe liczników. Bez JS strona w 100% widoczna (`.js .js-reveal`).
- Mobile (<768px): bez pinów — wersje pionowe sekcji; particles −60% i bez mouse-reactivity;
  custom cursor nie istnieje (tylko `pointer: fine`).

## 2. Warstwa WebGL (GLStage)

- **Jeden globalny `<Canvas>`** `position:fixed; inset:0; z-index:0` za contentem (content w wrapperze
  `z-[1]`). Sekcje rejestrują DIV-y przez `useGLView(key, scene)` (lib/glRegistry) — drei `<View track>`
  scissoruje sceny do tych DIV-ów. Zero three.js w głównym bundle: Canvas ładowany `next/dynamic`
  po `requestIdleCallback` (hero do tego czasu = statyczny poster `--gradient-glow`).
- Parametry: `dpr [1, 1.75]`, `antialias:false`, brak cieni, additive blending; frameloop przełączany
  na `never`, gdy żaden zarejestrowany widok nie jest w viewporcie lub `document.hidden`.
- Sceny: `core` (hero — oddech ~1,2 s jak puls, repulsja od kursora, dyspersja na scroll przez
  `state.progress`), `field` (Problem — siatka kropek-klientów, które gasną falami), `mini`
  (Kanały — mały rdzeń), `converge` (finał — cząstki zbiegają się ku formularzowi).
  Kolory scen czytane w runtime z tokenów CSS (`--blue-500`, `--blue-300`) — zero hexów w kodzie.
- Glow „bloom” robimy tanio: additive points + miękki sprite w shaderze + CSS radial za sekcją.
  Bez EffectComposera (budżet perf); grain = globalny overlay SVG (opacity 0.025), vignette = CSS.

## 3. Choreografie sekcji (v3)

- **Nav**: chowa się przy scrollu w dół (>160 px, delta >4), wraca przy scrollu w górę; glass po 80 px;
  scramble-hover na linkach (szerokość linku zablokowana na czas tweenu); magnetic CTA max 8 px;
  scroll-progress hairline 2 px (scrub 0.3 — dozwolony scrub globalny).
- **Hero**: H1 mask-reveal liniami (SplitText, stagger .08, expo.out), słowo „nigdy” z pulsem glow
  zsynchronizowanym z rdzeniem; wejście nav→headline→chat→rdzeń < 1,4 s; chat auto-play po ~1,2 s
  (typing char-by-char klienta, wskaźnik pisania, karta produktu), potem klikalne sugerowane pytania
  (scenariusze B/C); status `● online — HH:MM` z żywym zegarem; rdzeń rozprasza się scrubem na scroll.
- **Proof ticker**: marquee CSS (transform, ~46 s/pętla, pauza na hover), mono; pod nim linia zaufania.
  Reduced-motion: statyczna lista.
- **Problem**: pin 300vh — trzy statystyki KOLEJNO jako liczby min. 18vw (counter scrubowany progresem),
  pole kropek (scena `field`) gaśnie falami po 1/3; progress-rail 01→03 po lewej. Mobile/reduced:
  trzy pełnoekranowe bloki z counterami on-enter.
- **Manifest (kicker)**: SplitText na słowa, scrub — opacity 0.12→1 w rytmie czytania; na „ciszę”
  sekcja przygasa (overlay), ostatnie słowo zostaje samo. Jedyny scrub tekstu na stronie.
- **Filary**: pin ~250% — lewa lista 01–03 z progress-line, prawa: JEDEN device-frame, wnętrze
  crossfade + mikro-parallax; każde demo odpala własny mikro-timeline przy aktywacji (czat pisze,
  wyszukiwarka wpisuje literówkę i podświetla korektę, rekomendacje tasują się Flipem).
- **Bento (Kopalnie złota)**: wejście staggerem od lewej-górnej; karty = żywe pętle (sweep radaru,
  sekwencja ratownika ~6 s, S/M/L interaktywny, MotionPath paczki, e-mail pisze się liniami);
  spotlight-border za kursorem (CSS var na mousemove), tilt max 3° (Motion spring). Zero ikon Lucide.
- **Pojedynek**: pin ~250vh — 4 rundy: pytanie typing na środku, lewa odpowiedź szara z opóźnieniem,
  prawa żywa z glow; scoreboard bije po rundzie; werdykty = wiersze tabeli §4b 1:1.
  Mobile/reduced: rundy jako pionowe bloki z przyciskami.
- **Kanały**: beams SVG rysują się on-enter (DrawSVG), pulsy płyną po ścieżkach (dashoffset loop);
  centralny węzeł = scena `mini`; hover na kanał → tooltip z przykładową wymianą (istniejące treści).
- **Trzy kroki**: pin horizontal — 3 panele jadą poziomo (scrub), linia postępu z węzłami 01→03;
  wizuale: snippet wkleja się sam + „✓”, skan katalogu (nazwy produktów haczą się), pierwszy raport.
  Mobile: pion ze sticky progress-line.
- **Poranek**: device-frame w perspektywie (rotateX ~6°), prostuje się scrubem do centrum; 3 warstwy
  kart na różnym parallaxie (scroll + mouse na desktopie); liczniki i wykres jak w v2.
- **Kalkulator ROI**: wyniki natychmiast — rolkowy odometer (kolumny cyfr, spring), pasek rośnie,
  mnożnik ROI wielką typografią; przy przekroczeniu progu pojedynczy glow-burst + puls CTA
  (bez konfetti). Metryki pod spodem: countery on-enter (v2).
- **Integracje**: dwa przeciwbieżne marquee typograficznych logotypów (pauza + kolor na hover);
  input z lokalnym fuzzy-match → odpowiedź z decku (natychmiast, bez wysyłki).
- **Kontrola**: przełączniki po lewej (segment tonu, toggle eskalacji, zablokowany „Zmyślanie: OFF”),
  po prawej podgląd czatu podmieniający odpowiedź crossfadem (200 ms) przy każdej zmianie.
- **Pricing**: border-beam (świetlik po obrysie) na planie polecanym; hover kart: spotlight + lift 4 px;
  „pełne porównanie” rozwijane (grid-rows 0fr→1fr).
- **FAQ**: pytania display size; plus→minus morph (rotacja ramion); height przez grid-rows; hover indent.
- **Founder note**: linie cytatu wjeżdżają maską (scrub-reveal), watermark „2017 / 40+” na parallaxie.
- **Final CTA**: po walidacji URL sekwencja ~2,5 s: linia skanu + odhaczane kroki (uczciwe — bez
  udawanej detekcji), potem pole e-mail; w tle scena `converge` — cząstki zbiegają się ku inputowi.
- **Footer**: wielki wordmark z fill-wipe na hover (background-clip), reszta bez ruchu.

## 4. Liczniki, wykresy, mikrointerakcje

Jak w v2 (wzorce działają): countery `power2.out` 1.2 s przy top 75–80%, `fmtIntPl`, tabular-nums;
słupki `scaleY` stagger .05–.06 + linia `stroke-dashoffset`; przyciski/karty/akordeony w CSS
(`--dur-fast/base`); akordeon `grid-template-rows`.

## 5. Budżet i kontrola jakości ruchu

- 60 fps desktop / ≥45 mobile. Test szybkiego scrolla: nic nie dogania, nic nie miga.
- Scruby w treści: max 2 aktywne w viewport naraz (pin sekcji liczy się jako 1).
- Piny: `pinSpacing` poprawny — zero CLS; każda pinowana sekcja ma wariant mobile/reduced bez pinu.
- WebGL: jeden context, brak cieni, dpr ≤1.75, rAF wyłączony poza viewportem i przy `document.hidden`.
- Wątpliwość „fajne, ale niepotrzebne” → wyciąć.

## 6. Choreografie-sygnatury V6 (trzy momenty; reszta strony gra ciszej pod nie)

**A. Wejście na stronę (~1,45 s, bez preloadera/kurtyny).** „Rozjaśnienie z czerni" robią wyłącznie
warstwy dekoracyjne (nie-kandydaci LCP): glow 0→1 (1,2 s) + dot-grid 0→1 (0,6 s) od t=0 → zapłon
rdzenia t=0,12–0,77 (`glState.ignition` 0→1: w shaderze scale .96→1 + intensywność; iloczyn
`fadeRef × ignition` obsługuje lazy-mount sceny — późniejsza rampa rządzi) → H1 maską od t=0,22
(tylko gałąź fast; poza nią linie stoją) → hero-el 0,38 → demo-frame 0,55–1,45. `onComplete`
domyka bramkę intro (`lib/introGate`, bezpiecznik 2,6 s): kropka online „zapala się"
(scale .4→1 back.out 0,25 s) i po 0,4 s rusza pierwsza wiadomość czatu. Kotwica w środku strony:
bramka rozwiązuje się w tle — powrót do hero budzi czat natychmiast. Reduced-motion: wszystko
statycznie, bramka domknięta defensywnie. LCP-kontrakt: `.hero-lead` i fast-path NIETKNIĘTE.

**B. Kanały — przełączenie skina (puls 300 → morph 450 → re-stagger 250 ms).** Rozmowa gra RAZ
(stan `seen`); przełączenia są statyczne, zmianę niesie morph: klik nodu → jednorazowy puls-klik
jaśniejszą nakładką beamu hub→nod (dashoffset L→0, 300 ms) → `Flip.getState` na `[data-flip-id]`
(ch-frame/ch-head/ch-msg-N, props: borderRadius) → `flushSync` remount skina → `Flip.from`
(450 ms, stagger 0,02 = fala wiadomości) + tween wysokości wrappera (sekcja pod spodem płynie);
scrollTop okna przenoszony przed Flipem. Email ↔ bąble: matchuje się tylko ramka, wnętrze wjeżdża
staggerem od ~60% morpha. Kolory NIE flipują (twarda podmiana pod ruchem konturu). Rapid-click:
kill obu faz + sanitize (jawne przywrócenie autoAlpha — `.js .chat-step` ukrywa przy blanket
clearProps). Mobile: bez pulsu, fade. Reduced: podmiana natychmiastowa. Taby = ta sama akcja bez pulsu.

**C. Finał — echo zapłonu.** Focus inputu: boost chmury (V5). Po `sent`: pojedynczy tween
`ignition` 0,4→1 (0,9 s) na scenie converge — klamra z otwarciem hero. Bez konfetti.

**D. Przejścia rozdziałów.** Trzy granice makro-bloków (problem→rozwiązanie→dowody→oferta) scrubują
`--chapter-tint` na body (color-mix ku akcentowi, 0→1,6→0,8→2,4%) przez CAŁĄ wysokość sekcji
granicznej — niewidoczna ręka, nie fajerwerk. Sekcje z bg-surface świadomie przykrywają tint.
Desktop-only (mobile/reduced: brak).
