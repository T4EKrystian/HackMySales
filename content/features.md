# HackMySales — Funkcje „kopalnie złota”

Dwie części: **P** = funkcje produktu (co komunikujemy i dlaczego to złoto), **L** = interaktywne elementy samego landingu (co Claude Code ma zbudować w kodzie strony).

---

## Część P — funkcje produktu

Priorytet wg siły sprzedażowej. Każda odpowiada na pytanie właściciela sklepu: „co z tego będę MIAŁ?”.

### P1. Panel przychodów (revenue attribution)
**Co to:** każda rozmowa bota jest spinana z koszykiem i zamówieniem. Panel pokazuje: przychód z rozmów, przychód z rekomendacji, uratowane koszyki, AOV rozmów vs reszty ruchu.
**Dlaczego złoto:** zabija jedyne pytanie, które blokuje zakup narzędzia AI („a skąd będę wiedział, że działa?”). Konkurencja raportuje „liczbę konwersacji” — my raportujemy złotówki. To główny wyróżnik — komunikować wszędzie.
**Na landingu:** żywy mini-panel (HTML/CSS) z licznikiem przychodu rosnącym przy scrollu.

### P2. Radar popytu (demand mining) — nasz autorski pomysł-flagowiec
**Co to:** bot loguje każde „nie znalazłem”, każde pytanie bez dobrej odpowiedzi i każdy poszukiwany wariant (rozmiar/kolor), którego nie ma. Agreguje w tygodniowy raport: „czego szukali klienci, a czego nie masz”.
**Dlaczego złoto:** zamienia koszt (nieudana rozmowa) w aktywo (dane zakupowe). Żaden czatbot tego nie robi jako produkt pierwszej klasy. Dla sklepu to bywa warte więcej niż sam czat — decyzje o asortymencie na twardych danych.
**Na landingu:** karta z przykładowym raportem: „rozmiar 46 — 40 pytań · wersja czarna — 15 pytań · dostawa sobota — 28 pytań”.

### P3. Rekomendacje ważone marżą
**Co to:** gdy kilka produktów równie dobrze pasuje do intencji klienta, system promuje ten z lepszą marżą (dane o marży z integracji lub CSV). Suwak w panelu: trafność ↔ marża.
**Dlaczego złoto:** wszyscy rekomendują „podobne produkty”; nikt nie mówi o marży. To język, którym mówi właściciel sklepu. Uwaga na komunikację: „z głową do interesów”, nigdy „wciska droższe”.

### P4. Ratownik koszyka
**Co to:** wykrywanie sygnałów wyjścia (exit intent, długie wahanie na karcie, powrót do koszyka bez finalizacji) → kontekstowe zagajenie: odpowiedź na wątpliwość, przypomnienie o progu darmowej dostawy, ewentualnie kod rabatowy wg reguł ustawionych przez sklep.
**Dlaczego złoto:** porzucone koszyki to ~70% koszyków; każdy odzyskany procent to czysty przychód. Łatwe do policzenia = łatwe do sprzedania.

### P5. Doradca rozmiaru
**Co to:** dobór rozmiaru z tabel producenta + historii zwrotów danego modelu („wypada mało”) + danych od klienta („178 cm, 82 kg”).
**Dlaczego złoto:** zwroty to cichy zabójca marży w fashion (kurier w dwie strony + logistyka). Argument „mniej zwrotów” otwiera drzwi, których „więcej sprzedaży” nie otwiera.

### P6. Autopilot „gdzie moja paczka” (WISMO)
**Co to:** status zamówienia, śledzenie, faktura, zmiana adresu — w czacie, bez logowania (weryfikacja nr zamówienia + e-mail/telefon).
**Dlaczego złoto:** 70% ticketów BOK znika. Dla sklepu z 1 osobą na mailach to odzyskany etat.

### P7. Raport nocnej zmiany
**Co to:** poranny e-mail/PDF: ile rozmów, ile sprzedaży, co przekazano ludziom, top pytania, alerty z Radaru popytu. Ton raportu: bot pisze w pierwszej osobie, jak pracownik.
**Dlaczego złoto:** czysty teatr wartości — codziennie przypomina, że narzędzie zarabia. Zabójcze demo na landingu i genialny anty-churn (nikt nie wyłącza pracownika, który się codziennie melduje z wynikami).

### P8. Wyszukiwarka rozumiejąca polski
**Co to:** literówki, fleksja, potoczne nazwy, intencje złożone („prezent dla 5-latka do 100 zł”), synonimy branżowe. Fallback „brak wyników” → propozycje + log do Radaru popytu.
**Dlaczego złoto:** globalni gracze (Algolia itd.) słabo radzą sobie z polską fleksją. „Rozumie polski” to argument nie do skopiowania przez zachodnią konkurencję.

### P9. Kompletator koszyka
**Co to:** klient opisuje projekt („urządzam łazienkę 4 m²”, „składam rower pod dojazdy”), bot buduje cały wieloproduktowy koszyk z uzasadnieniem pozycji.
**Dlaczego złoto:** podnosi AOV skokowo (koszyk 8 pozycji zamiast 1). Świetny materiał na drugie demo w sekcji filarów.

### P10. Luki wiedzy → auto-FAQ
**Co to:** pytania, na które bot nie umiał odpowiedzieć, trafiają do panelu z sugestią gotowej odpowiedzi do zatwierdzenia. System uczy się z każdej zatwierdzonej.
**Dlaczego złoto:** samodoskonalenie bez pracy agencji; sklep widzi, że bot „mądrzeje” z tygodnia na tydzień.

### P11. Przekazanie do człowieka ze streszczeniem
**Co to:** handoff z 3-zdaniowym podsumowaniem rozmowy i intencji („klient chce zwrócić rozmiar M, zamówienie #8412, jest zdenerwowany opóźnieniem”).
**Dlaczego złoto:** rozbraja główny lęk („AI wkurzy mi klientów”). Klient nie powtarza niczego od zera.

### P12. Omnichannel (WWW + Messenger + Instagram)
**Co to:** jedna baza wiedzy, jeden panel, te same możliwości we wszystkich kanałach. W Growth+.
**Dlaczego złoto:** sklepy odzieżowe żyją z DM-ów na IG; odpowiadanie tam to dziś ręczna robota.

---

## Część L — interaktywne elementy landingu (do zbudowania)

### L1. Żywe demo czatu w hero (priorytet #1 strony)
Oskryptowana rozmowa (scenariusz w `copy-pl.md` §1) odtwarzana jak prawdziwa: wskaźnik pisania (3 kropki), opóźnienia 600–900 ms, wiadomości wjeżdżają z dołu ze spring-easingiem, karta produktu z ceną i stanem magazynowym, na końcu badge „✓ Zamówienie #8412 — 399 zł”. Po zakończeniu: przycisk `Odtwórz jeszcze raz` + `Zobacz na swoim sklepie`. Autoplay przy wejściu w viewport (raz). Pole input na dole — atrapa: fokus otwiera tooltip „W wersji demo scenariusz jest oskryptowany — na Twoim sklepie bot odpowiada naprawdę. Umów demo.” (uczciwość > udawanie).

### L2. Kalkulator ROI „Ile zostawiasz na stole?”
3 pola (odwiedziny/mc, AOV, konwersja %) z sensownymi defaultami (20 000 · 180 zł · 1,8%). Licząc na żywo: przychód dziś, przychód przy +0,5 p.p. konwersji i +10% AOV [założenia do potwierdzenia — oznaczyć w UI jako „założenia”], różnica = duża kwota w mono. Wynik animowany (odliczanie). Poniżej CTA na demo. Bez wysyłania danych — wszystko client-side.

### L3. Ticker „Radar popytu na żywo” → SCALONY z L16 (v3)
Wpisy radarowe żyją w dwóch miejscach: karta Radaru w bento (wiersze + sweep) i proof ticker pod hero (§L16). Osobna taśma na dole sekcji funkcji — usunięta (dwa marquee treściowe to o jedno za dużo).

### L4. Licznik nocnej zmiany
W sekcji wyników: karta „Kiedy spałeś, bot…” z licznikami odpalanymi scrollem: rozmowy [34], sprzedaż [6 840 zł], zaoszczędzone tickety [21]. Liczby w JetBrains Mono.

### L5. Mini-panel przychodów
Uproszczona, żywa replika panelu (słupki tygodnia rysują się przy scrollu, kwota rośnie). Ma wyglądać jak prawdziwy produkt — spójna z portalem (te same tokeny).

### L6. Taby scenariuszy w demo czatu (rozszerzenie L1)
Trzy oskryptowane rozmowy przełączane segmentem w oknie czatu: **Doradztwo** (scenariusz A), **Rozmiar** (B), **Paczka** (C) — scenariusze w `copy-pl.md` §1. Zmiana taba przerywa bieżący timeline i odtwarza nowy od zera. Każdy scenariusz kończy się własnym badge'em wartości. Reduced-motion: pełna rozmowa wybranego taba statycznie.

### L7. Sekcja „Różnica” (porównanie)
Tabela zwykły czatbot vs HackMySales (copy §4b): lewa kolumna wyszarzona z ikoną X, prawa z niebieskim checkiem. Wiersze wjeżdżają staggerem. Bez animacji poza revealem — treść robi robotę.

### L8. E-mail nocnej zmiany (żywe UI)
Karta „Raport nocnej zmiany” dostaje obok podgląd e-maila (Od / Temat / treść z liczbami w mono, copy §4). Wygląda jak prawdziwa skrzynka — bez screenshotów, czysty HTML.

### L9. Sparkline w mini-panelu przychodów (rozszerzenie L5)
Nad słupkami rysowana linia trendu (stroke-dashoffset, raz, przy wejściu w viewport) + kropka na końcu. Subtelna, `--blue-300`.

### L10. Efekt pisania w panelu wyszukiwarki
Zapytanie „cos cieplego dla 5latka…” wpisuje się znak po znaku (raz, przy wejściu panelu w viewport), potem wskakują chipy intencji. Reduced-motion: od razu pełny tekst.

### L12. Zakładki branż (sekcja „Dla kogo”, copy §3c)
4 zakładki-pigułki (Moda i obuwie / Dom i ogród / Elektronika / B2B i hurt). Panel: ból branży, mini-wymiana (user + bot), chip efektu z placeholderem. Zmiana zakładki: krótki fade-up treści (CSS, 300 ms), bez GSAP. Pod sekcją uczciwy caption o liczbach przykładowych.

### L13. Poranny dashboard (sekcja „Panel”, copy §5b)
Pełnowymiarowe żywe UI panelu: 4 KPI z licznikami scrollowymi, wykres 14 dni (słupki `scaleY` + linia trendu dashoffset — wzorzec L5/L9), lista ostatnich rozmów z kwotami w mono, box radaru. Wygląda 1:1 jak portal (te same tokeny). Podpis „dane demo”. CTA do #demo.

### L14. Pasek postępu scrolla w nav
2px linia pod nav, `scaleX` 0→1 scrubem na całej wysokości dokumentu. Reduced-motion: ukryta.

### L15. Nota od zespołu (sekcja między FAQ a finalnym CTA)
Krótki blok typograficzny: label OD ZESPOŁU, 3 zdania na potwierdzonych faktach (sklepy od 2017, ponad 40 pod opieką), podpis „— zespół Time4Ecommerce” w mono. Zwykły reveal, zero własnej choreografii. Rola: jedyny ludzki dowód do czasu case studies — żadnych opinii, gwiazdek ani logotypów. Copy: `copy-pl.md` §10b.

### L11. Boczna nawigacja kropkowa (desktop ≥1280px)
Pionowe kropki po prawej: Start · Produkt · Funkcje · Różnica · Wyniki · Cennik · FAQ · Demo. Aktywna sekcja podświetlona (IntersectionObserver), hover pokazuje etykietę, klik scrolluje. Dyskretna — 6px kropki, zero animacji poza opacity/scale.

### L16. Proof ticker (pas pod hero) — v3
Marquee CSS (pauza na hover, reduced-motion: statyczna lista pierwszych 3 wpisów) z feedem nocy (copy §1b), mono, timestampy 23:14→06:58. Pod taśmą: linia zaufania + platformy (dawny TrustBar — scalony, żeby pod hero był jeden pas, nie dwa). Zastępuje L3 w layoucie.

### L18. Filary v3 — jeden device-frame, wnętrze morfuje
Pin zostaje (motion.md §3), ale prawa strona to JEDEN frame z belką okna; wnętrza crossfadują,
a każde demo gra mikro-timeline przy aktywacji: czat pisze się (user typing + bot spring),
wyszukiwarka wpisuje literówkę i odhacza korektę, rekomendacje tasują się Flipem
(karta z lepszą marżą wskakuje na górę, suwak zjeżdża ku „marży”). Mobile: trzy bloki, demo gra on-enter.

### L19. Bento „Kopalnie złota” 2.0
Grid asymetryczny 4-kolumnowy (2 duże + 4 małe), zero ikon — każda karta żywym mikro-demem:
przychody (słupki+sparkline+licznik, jak L5/L9), radar (obrotowy sweep + blipy z §4c),
ratownik (pętla ~6 s: kursor→X→bubble→badge), doradca rozmiaru (interaktywne S/M/L),
autopilot (kropka po ścieżce MotionPath ze statusami), raport (e-mail pisze się liniami).
Spotlight-border za kursorem + tilt ≤3° (Motion springs, tylko pointer:fine).

### L17. Hero v3 — rdzeń + żywszy czat
- WebGL particle core (scena `core` w GLStage): oddech ~1,2 s, repulsja od kursora, dyspersja na scroll. Poster do czasu idle-mount: dotychczasowy gradient glow.
- H1: mask-reveal liniami (SplitText), słowo „nigdy” z pulsem w rytmie rdzenia.
- Czat (rozszerzenie L1/L6): pytania klienta piszą się znak po znaku; po badge'u pojawiają się klikalne chipy = pierwsze pytania pozostałych scenariuszy (przełączają scenariusz); status okna: „online” + żywy zegar HH:MM; etykieta cursora „demo” nad oknem.

Uwaga ogólna: elementy L budujemy w HTML/CSS/TS (zero wideo, zero GIF-ów, zero screenshotów) — mają być ostre na retinie, lekkie i możliwe do poprawki tekstów w 30 sekund.
