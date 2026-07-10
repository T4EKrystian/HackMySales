# HackMySales — Spec animacji (GSAP + ScrollTrigger + Lenis)

Cel: strona ma się „płynąć” jak keynote Apple — ruch prowadzi wzrok i opowiada produkt. Nigdy nie jest ozdobą samą w sobie.

## 1. Stack i zasady twarde

- **GSAP + ScrollTrigger** (`gsap`, `@gsap/react` z hookiem `useGSAP` — obowiązkowo, robi cleanup) + **Lenis** do smooth scrolla (lerp 0.1, `autoRaf` — Lenis jeździ na własnym rAF; ScrollTrigger.update podpięte przez `useLenis`). UWAGA: nie wiązać Lenisa z tickerem GSAP ręcznie — historycznie zabiło to scroll kółkiem.
- Animujemy WYŁĄCZNIE `transform` i `opacity` (+ `clip-path` w hero). Nigdy width/height/top/margin. `will-change` tylko na czas animacji.
- **Jedna krzywa dla reveali:** `power3.out`. Wjazdy: `y: 32→0, opacity: 0→1, dur 0.7–0.9, stagger 0.08–0.12`. Nic nie wjeżdża z boków poza wskazanymi miejscami. Zero rotacji, zero bounce, zero flipów 3D.
- **`prefers-reduced-motion: reduce`** — obowiązkowy `gsap.matchMedia()`: wszystkie ScrollTriggery wyłączone, elementy widoczne od razu, Lenis wyłączony, liczniki pokazują wartość końcową. To warunek zaliczenia, nie opcja.
- Mobile (<768px): bez pinowania sekcji, bez parallaxy; zostają proste reveals i liczniki.
- Elementy animowane startują ukryte przez klasę CSS ustawianą z JS (`.js-reveal`), nie inline w JSX — bez JS strona ma być w 100% widoczna (no-JS fallback + SEO).
- Triggery: `start: "top 78%"`, `once: true` dla reveali (nie odtwarzamy przy scrollu w górę — spokój, nie dyskoteka).

## 2. Hero (choreografia wejścia, bez scrolla)

Timeline po załadowaniu fontów (`document.fonts.ready`):
1. `0.0s` — tło: `--gradient-glow` fade-in (dur 1.2)
2. `0.1s` — H1 wjeżdża liniami (SplitText na linie lub 2 spany; `y: 40, clip-path inset`, stagger 0.1)
3. `0.35s` — lead, CTA, mikrodowód (stagger 0.08)
4. `0.6s` — panel demo czatu: `y: 48, opacity, scale 0.98→1`
5. `1.0s` — startuje scenariusz czatu (spec niżej §6)
Nav: pojawia się od razu (bez animacji — dostępność), po 80px scrolla dostaje tło `--bg-surface/80` + blur + hairline (przejście CSS 320ms).

## 3. Reveals sekcji (domyślny wzorzec)

Każda sekcja: label → nagłówek → treść/karty, stagger 0.1. Karty w gridach: stagger 0.08 wg kolejności DOM (nie „random”). Duży cytat-kicker w sekcji Problem: fade + `y: 24` całości; opcjonalnie rozjaśnienie słów (`color` z `--text-muted` do `--text-primary`) sterowane `scrub: true` na dystansie 60vh — jedyne miejsce ze scrubem tekstu na stronie.

## 4. Sekcja filarów — pin z przełączaniem paneli (danie główne)

Desktop: kontener pinowany (`pin: true`, `end: "+=250%"`). Lewa kolumna: 3 nagłówki filarów; prawa: panel demo. Scroll przełącza aktywny filar (1/3 dystansu każdy): stary panel `opacity 0, y: -16`, nowy `opacity 1, y: 16→0`; nagłówki nieaktywne `--text-muted`, aktywny `--text-primary` + niebieski wskaźnik (kreska) przesuwający się między nimi (`yPercent`). Progress bar pionowy 2px po lewej (scrub). Mobile: trzy zwykłe bloki jeden pod drugim, bez pinu.

## 5. Liczniki i wykresy

- Liczniki (`+18%`, `47 218 zł`): odpalane raz przy `top 75%`, dur 1.2, `ease: power2.out`, tabular-nums (mono i tak ma). Formatowanie PL: spacja nierozdzielająca jako separator tysięcy, przecinek dziesiętny.
- Sekcja Wyniki — kolejność bloków (2026-07-10): kalkulator → licznik nocnej zmiany → liczniki celów (z podpisem). Triggery i czasy liczników bez zmian.
- Mini-panel przychodów: słupki `scaleY 0→1` z `transformOrigin: bottom`, stagger 0.06; linia trendu: `stroke-dashoffset` (dur 1.4).
- Ticker Radaru: CSS `@keyframes` marquee (transform), prędkość ~40s/pętla, `animation-play-state: paused` na hover; duplikacja treści dla płynnej pętli; reduced-motion → statyczna lista 3 wpisów.

## 6. Demo czatu w hero

GSAP timeline (nie CSS): wskaźnik pisania (3 kropki, pulsowanie) 600–900 ms → wiadomość `y: 16, opacity, scale 0.97→1, dur 0.45, ease back.out(1.4)` (jedyne miejsce z lekkim springiem) → pauza wg długości tekstu (czytelność) → karta produktu analogicznie → badge zamówienia z krótkim błyskiem obrysu (`box-shadow` tint → transparent). Start: gdy hero w viewport (raz). Kontrola: `Odtwórz ponownie` restartuje timeline. Scroll kontenera czatu podąża za nowymi wiadomościami.

## 7. Parallax i głębia (dyskretnie)

- Glow za hero: `yPercent: -8` scrub na całej wysokości hero — max.
- Panele demo w sekcjach: `y: ±16px` scrub względem tekstu (efekt „warstw”).
- Nic więcej. Żadnych pływających blobów, cząsteczek, kursorów-śledzików.

## 8. Mikrointerakcje (CSS, nie GSAP)

- Przyciski primary: hover `translateY(-1px)` + `--shadow-cta`; active `translateY(0) scale(0.99)`; transition `--dur-fast`.
- Karty: hover — border `--border-strong` → jaśniejszy + tło `--bg-elevated`; BEZ podnoszenia scale (tanie efekty = kicz).
- Linki nav: underline `scaleX 0→1` od lewej, 180ms.
- Akordeon FAQ: wysokość przez `grid-template-rows: 0fr→1fr` (czysty CSS trik), chevron `rotate 180deg`.
- Magnetic button TYLKO na głównym CTA hero: przesunięcie max 4px ku kursorowi, spring powrotny; wyłączone na touch i reduced-motion.

## 8a. Elementy v2 (rozszerzenia)

- **Taby scenariuszy czatu (L6):** zmiana taba przerywa i przebudowuje timeline (useGSAP `dependencies` + `revertOnUpdate`); nowy scenariusz gra od razu, bo klik = intencja. Reduced-motion: statyczna pełna rozmowa.
- **Sparkline w mini-panelu (L9):** polyline `stroke-dashoffset` 1→0 (dur 1.1, power2.inOut) po słupkach, kropka końcowa fade-in. Jeden timeline z barami.
- **Pisanie zapytania (L10):** znaki doklejane tweenem `ease:none`, ~0.045 s/znak, max 2.2 s, raz przy top 78%; kursor miga w CSS. Duplikat panelu (mobile/desktop) bez `offsetParent` nie animuje.
- **Porównanie (L7):** wyłącznie standardowy reveal wierszy — bez scrubów.
- **Dots-nav (L11):** bez GSAP; IntersectionObserver + przejścia CSS (opacity/scale, 300 ms).
- **Zakładki branż (L12):** zmiana treści przez CSS fade-up 300 ms (klasa na key-remount), zero GSAP.
- **Poranny dashboard (L13):** jeden timeline przy top 75%: KPI liczniki równolegle, słupki stagger 0.05, linia dashoffset, wiersze list standardowym revealem.
- **Scroll cue w hero:** bujanie strzałki w CSS (2.2 s, in-out), fade-out GSAP scrubem na pierwszych 180 px; klik scrolluje do #produkt. Reduced-motion: bez bujania.
- **Progress bar w nav (L14):** `scaleX` scrub 0.3 na dystansie całego dokumentu; to trzeci dozwolony scrub globalny (obok kickera i glow) — działa w nav, nie w treści, więc nie liczy się do budżetu sekcji.

## 9. Budżet i kontrola jakości ruchu

Max 2 aktywne ScrollTriggery ze `scrub` jednocześnie w viewport. Żadnych animacji na `scroll` bez ScrollTriggera. Test: przewiń stronę szybko kółkiem — nic nie może „doganiać” ani migać. 60 fps na MacBooku Air i średnim Androidzie (DevTools performance — sprawdzić przed oddaniem). Jeśli jakaś animacja wydaje się „fajna, ale niepotrzebna” — wyciąć.
