# Anti-slop — żeby strona NIE wyglądała jak zrobiona przez AI

Bramka jakości. Przed oddaniem każdej sekcji przejdź listę. Jedno „tak” w części ZAKAZANE = poprawka.

## ZAKAZANE (natychmiast zdradzają AI)

- Gradient fioletowo-różowy lub „aurora” w tle. Nasz gradient istnieje tylko w rodzinie niebieskiego.
- Emoji w nagłówkach, karcie funkcji, przyciskach. Gdziekolwiek.
- Trzy karty z ikonką 🚀/⚡/✨ i tekstem „Szybkość / Prostota / Bezpieczeństwo” — generyczne trio bez treści.
- Glassmorphism na wszystkim (blur + przezroczystość na każdej karcie). Dozwolone: tylko nav po scrollu.
- Stockowe ilustracje 3D (postacie z Blendera, izometryczne laptopy, roboty z uśmiechem).
- Copy-frazesy: „Odkryj moc AI”, „Wynieś sprzedaż na wyższy poziom”, „W dzisiejszych czasach…”, „Rewolucja w e-commerce”. Pełna lista: `content/copy-pl.md` §14.
- Wszystko idealnie wycentrowane, każda sekcja: nagłówek-środek + 3 karty. Monotonia rytmu = AI.
- `border-radius` inny w każdym elemencie; cienie w 5 wariantach; 4 odcienie niebieskiego „na oko” zamiast tokenów.
- Zdjęcia ludzi ze stocka („uśmiechnięta kobieta ze słuchawką”).
- Fikcyjne opinie klientów, wymyślone loga firm, gwiazdki 4.9 bez źródła. Placeholder ≠ kłamstwo: sekcje na dowody zostają ukryte, dopóki nie będzie prawdziwych danych.
- Lorem ipsum w jakiejkolwiek formie.

## WYMAGANE (to buduje wrażenie „ręcznej roboty”)

- **Asymetria z intencją:** hero 55/45, sekcje naprzemiennie tekst-lewo/demo-prawo i odwrotnie, jedna sekcja pełnej szerokości (kicker-cytat) jako oddech.
- **Rytm pionowy zmienny:** nie każda sekcja tej samej wysokości; kicker krótki, filary długie (pin). Strona ma mieć tempo: szybko-wolno-szybko.
- **Prawdziwe UI produktu jako grafika** (żywe komponenty HTML) zamiast abstrakcyjnych ilustracji.
- **Detale typograficzne PL:** niełamliwe spacje (sierotki!), poprawne cudzysłowy „ ”, półpauzy — spec: `.claude/skills/pl-typography`.
- **Liczby w mono** (JetBrains Mono) — konsekwentnie w całym serwisie. To nasz podpis.
- **Stany dopracowane:** focus ring widoczny (2px `--border-focus`, offset 2px) na WSZYSTKIM interaktywnym; hover ≠ brak; disabled czytelny; selection w kolorze marki (`::selection` niebieski tint).
- **Krawędzie ostre:** hairline 1px `--border-hairline` zamiast cieni; jedna wartość radiusów wg tokenów.
- **Jedna sekcja z charakterem własnym:** ticker Radaru popytu (element, którego nie ma żaden szablon).
- Favicon, OG image, title — dopięte (patrz `content/seo.md`).

## Test końcowy (zrób serio)

1. Zrzut ekranu całej strony → zmniejsz do 20% → czy układ ma rytm i kontrast wielkości, czy wygląda jak 8 identycznych plastrów?
2. Przeczytaj cały copy NA GŁOS po polsku — każde zdanie, które brzmi jak z ChatGPT, przepisać (albo wrócić do `copy-pl.md` — tam jest wersja źródłowa).
3. Pokaż stronę komuś na 5 sekund — co zapamiętał? Jeśli „niebieski czat, który sprzedaje” — jest dobrze.
4. Porównaj z linear.app, vercel.com, resend.com — czy nasza strona broni się w tym towarzystwie powściągliwością i detalem?
