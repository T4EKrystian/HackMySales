# HackMySales — Brand Book

Źródło: portal klienta (portal.185-238-74-109.nip.io). Landing ma wyglądać jak starszy brat portalu — ta sama rodzina, wyższa liga wykonania.

## 1. Logo

**Konstrukcja:** dymek czatu (obrys, zaokrąglone rogi, ogonek w lewym dolnym rogu) + trzy rosnące słupki w środku. Znaczenie: rozmowa, która podnosi sprzedaż. Pliki: `assets/logomark.svg`, `assets/logo-full.svg`, `assets/favicon.svg`.

**Wordmark:** `Hack` (biały) + `My` (niebieski #3D5BFC) + `Sales` (biały), Schibsted Grotesk Bold, tracking -0.5. Na stronie renderuj jako komponent: SVG mark + tekst w HTML (nie obrazek — ostrzej się skaluje i można animować).

**Tagline:** „AI chatbot & recommendations that increase sales” — tylko przy dużym lockupie (footer, OG image). Uppercase, `--text-label`, `--text-muted`.

**Zasady:** pole ochronne = wysokość jednego słupka wokół znaku. Nie zmieniaj proporcji słupków (to wykres wzrostu — musi rosnąć w prawo). Nie koloruj znaku poza: niebieski na ciemnym, niebieski na białym, biały na niebieskim. Min. rozmiar znaku: 24px.

## 2. Kolor

Filozofia: **jeden akcent**. Niebieski #3D5BFC to jedyny kolor marki — cała reszta to skala szarości z niebieskim podtonem. Strona ma być głęboko ciemna, spokojna, a niebieski uderza tylko tam, gdzie chcemy akcji (CTA, liczby, hover). Pełna paleta i role: `design/tokens.css` — **jedyne źródło prawdy**.

Proporcje na oko: ~85% tła/neutrale, ~10% tekst, ~5% niebieski. Jeśli sekcja ma więcej niż 2 niebieskie elementy naraz — za dużo.

Zakazane: fioletowo-różowe gradienty, neonowe zielenie, tęczowe wykresy, kolorowe ikonki. Semantyczne (success/danger) tylko w UI demo produktu.

## 3. Typografia

| Rola | Font | Uwagi |
|---|---|---|
| Nagłówki (H1–H3) | **Schibsted Grotesk** 600/700 | Google Fonts, ma polskie znaki. Charakterny, ale nie krzyczy. Tracking ujemny. |
| Tekst | **Inter** 400/500 | lh 1.65, max szerokość akapitu 65ch |
| Liczby, KPI, labelki, kod | **JetBrains Mono** 400/500 | KPI i kwoty zawsze w mono — to nasz tik wizualny |

Ładowanie przez `next/font/google` (subset `latin-ext` — obowiązkowo, inaczej znikną ą/ę/ł). Skala rozmiarów: w `tokens.css`.

Detal, który robi robotę: kwoty i procenty w copy („47 218 zł”, „+23%”) owijaj w `<span class="num">` z fontem mono i kolorem `--blue-300` lub `--text-primary`.

## 4. Ikony

Jeden zestaw: **Lucide** (stroke 1.75, rozmiar 20/24). Zawsze outline, zawsze `--text-secondary` lub niebieski. Zero emoji w UI i copy. Zero ilustracji 3D ze stocka.

## 5. Obrazy i grafika

Grafiką strony jest **UI produktu**: okno czatu, panel przychodów, radar popytu — budowane w HTML/CSS jako żywe komponenty (nie screenshoty, nie mockupy PNG). Tła: bardzo subtelna siatka kropek/linii + `--gradient-glow` za hero. Żadnych zdjęć stockowych ludzi.

## 6. Głos marki (voice & tone)

Piszemy jak doświadczony handlowiec, nie jak dział marketingu:

- **Konkret zamiast przymiotnika.** Nie „niesamowicie skuteczny bot”, tylko „bot, który w zeszłym miesiącu sprzedał za 47 218 zł”.
- **Po polsku, po ludzku.** „Gdzie moja paczka?” zamiast „zapytania o status realizacji zamówienia”.
- **Krótkie zdania.** Jedno zdanie = jedna myśl.
- **Zero wykrzykników, zero emoji, zero „rewolucji”.** Słowa zakazane: rewolucyjny, przełomowy, odkryj moc, supercharge, wynieś na wyższy poziom, magia, ekosystem.
- **Mówimy do właściciela sklepu na „Ty”.** On liczy pieniądze, nie „engagement”.
- Angielski tylko tam, gdzie branża tak mówi: AOV, konwersja OK; „boostować” — nie.

## 7. Relacja z portalem

Landing i portal dzielą: paletę, logo, ciemny motyw, zaokrąglenia. Landing dodaje: większą typografię, animacje, gradient glow. Link „Zaloguj się” w nav prowadzi do portalu.
