# WOW.md — Motion & interakcja (de-AI-slop)

Cel: strona ma **robić wrażenie, żyć, być interaktywna** — nie „generyczny AI SaaS".
Zasada nadrzędna: **ruch = dowód, że produkt działa** (nie dekoracja).
Reguły: tylko transform/opacity, 60 fps, `prefers-reduced-motion` = pełna treść bez ruchu, pauza poza ekranem. GSAP + ScrollTrigger jak dotąd.

## 0. Zabij „AI-slop" (najpierw — to psuje najbardziej)
- **Hero nie może być pusty na starcie.** H1 / sub / CTA malowane od SSR, widoczne **natychmiast**; animacja tylko wzmacnia (mask/stagger ≤ 0,6 s). Nigdy nie chowaj treści na `opacity:0` bez gwarancji odsłony (dziś jest „flash pustki").
- **Koniec z „fade-up wszędzie".** Jeden i ten sam fade to zapach AI. Różnicuj: reveal kierunkowy, stagger, clip/mask, liczniki. Każda sekcja ma inny, świadomy ruch.
- **Szare placeholdery produktów → realne miniatury** (gray bloby = AI-ish).
- **Puste pół-sekcje → wypełnij** treścią/wizualem; zetnij martwy pion (Problem teraz to sam nagłówek w pustce).

## 1. HERO — żywe demo (NAJWIĘKSZY lever)
Artefakt po prawej = **auto-demo w pętli**, pokazujące 3 funkcje (taby też klikalne):
- **Search**: zapytanie „buty trailowe 44 na mokro" wpisuje się samo (typing), chipy wpadają, wyniki populują staggerem, podświetlenie trafności.
- auto → **Rekomendacje**: grid 4–6 produktów **re-rankuje się (FLIP)** przy przełączeniu chipa sygnału; „lepsza marża / dopasowanie" podbija pozycję.
- auto → **Chatbot**: klient pisze → dots → odpowiedź bota z kartami produktu wjeżdża → mikro-„dodano do koszyka".
- pętla; pauza poza ekranem; reduced-motion = statyczny, pełny stan.
- **Sygnaturowy motyw:** miękka niebieska aurora/poświata za artefaktem (powolny dryf) — jedyny „efektowny" element, reszta czysta i jasna.
- **H1:** szybki mask-reveal liniami (≤ 0,6 s) na load; animowany marker/underline na frazie „bez zwiększania budżetu" (hak ROAS).
- **Pod CTA:** żywy dowód — mały licznik/pill („10/10 badań" albo „+X% konwersji") liczący się w górę w viewport.
- **Interakcja:** taby klikalne; hover na wynikach/kartach (lift + niebieski akcent + cień); primary CTA lekko magnetyczny; wynik po najechaniu pokazuje „trafność".

## 2. PROBLEM — z pustki w wizał
- Pokaż **4 bariery** (nie potrafią znaleźć · za dużo niedopasowanych wyników · brak odpowiedzi · nie wiedzą, co wybrać) jako 4 elementy wchodzące staggerem z mikro-ikoną — albo mini-wizał „nieszczelnego lejka" (krople/■ ubywa). Zetnij martwy pion o ~40%.

## 3. FILARY — 3 żywe UI (wzorzec renderu)
- Każdy filar = **mini-UI z renderu** (search / grid / chat), animowane przy wejściu w viewport — nie sam tekst. To serce „widać, że działa".
- Rekomendacje: grid realnie się **przestawia**, chipy sygnałów klikalne (interakcja).
- Hover na każdej mini-UI = subtelne ożywienie (kursor „pisze", karta się podnosi).

## 4. DOWODY — ożyw liczby, złam monotonię
- **Pasek 3 mocnych liczb** u góry: duże **count-up** w viewport (`+16,3%` · `+12,4%` · `−12,55%`).
- Karty badań: **hover lift + niebieski akcent + `--shadow-card`**; wyróżnij najmocniejszą statystykę **większą kartą** (koniec z równą siatką jednakowych prostokątów).
- Ikona/sygnatura źródła zamiast samego tekstu.

## 5. Mikro-interakcje globalnie
- Liczniki count-up, hover-lift kart, aktywne taby/segmenty, **sticky nav** z subtelnym cieniem/tłem po scrollu, **scroll-progress** (cienka niebieska linia u góry), magnetyczny primary CTA (delikatny).
- **Jeden** mocny „scroll-theatre" moment max (np. przejście hero → sekcja demo). Nie przesadzić — reszta ma być spokojna i premium.
- Formularz: pola z płynnym focus (niebieski ring), inline-walidacja, CTA z mikro-loaderem po submit, sukces z „ptaszkiem" wjeżdżającym.

## Czego NIE robić
Agresywny 3D-tilt, custom cursor, parallax-orgia, autoplay wideo z dźwiękiem, świecące „AI-mózgi"/orby, ruch który opóźnia LCP (H1 maluje się od razu), animacje na kolorze/box-shadow zamiast transform/opacity.

## Kolejność (hero first)
1. Hero: paint-first + żywe auto-demo + aurora + licznik (to sam w sobie zmienia odbiór o 80%).
2. Filary: 3 żywe UI.
3. Dowody: count-up + hierarchia kart.
4. Problem: wypełnienie + stagger.
5. Globalne mikro-interakcje + 1 scroll-theatre.
Po **każdym** kroku: `npm run shoot` + porównanie; po Hero — zrzuty do recenzji (Szmitek/asystent) zanim dalej.
