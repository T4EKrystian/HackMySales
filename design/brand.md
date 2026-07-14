# HackMySales — Brand Book (v3, stylistyka Apple)

Landing **jest jasny w stylistyce Apple** (restyle 2026-07, ref: iPhone Air): chłodne neutrale, Geist, akcent **Apple blue #0071E3**. Portal klienta (portal.185-238-74-109.nip.io) jest ciemny z firmowym #3D5BFC — rodzeństwo trzyma **wspólny znak i geometrię**; akcent kolorystyczny landingu (#0071E3) świadomie rozjeżdża się z portalem (decyzja klienta), most to „Zaloguj się". Poprzeczka: rzemiosło Apple / linear.app / stripe.com.

## 1. Logo

**Konstrukcja (znak v3 — zwycięzca bake-offu 2026-07):** pełny dymek czatu (Apple blue, zaokrąglone rogi, ogonek w lewym dolnym rogu) ze **strzałką wzrostu ↗ w kontrze** (biała, jeden czysty skos + grot). Znaczenie: rozmowa → sprzedaż w górę. Pliki: `assets/logomark.svg` (znak), `assets/favicon.svg` = `app/icon.svg` (kafel app-icon: niebieski squircle + biały dymek + strzałka), `assets/logo-full.svg` (lockup). Poprzedni znak (dymek + 3 słupki) porzucony — klient uznał go za mało profesjonalny.

**Wordmark:** `Hack` (ciemny #1D1D1F na jasnym) + `My` (**Apple blue #0071E3**) + `Sales` (ciemny), **Geist Semibold**, tracking -0.02em. Renderuj jako komponent: SVG mark + tekst HTML.

**Tagline:** „AI chatbot & recommendations that increase sales" — tylko przy dużym lockupie (footer, OG). Uppercase, `--text-label`, `--text-muted`.

**Zasady:** pole ochronne = ~0,5× szerokości znaku wokół. Nie zmieniaj kąta/proporcji strzałki (rośnie w prawo-górę). Wersje: znak niebieski na jasnym; kafel (biały dymek na niebieskim) jako favicon/app-icon/avatar; mono/kontra dostępne w assetach. Min. 24px. **Kanon — nie redesignować w polish passach.**

## 2. Kolor

Filozofia: **jeden akcent**. Niebieski #3D5BFC to jedyny kolor marki — reszta to ciepła skala neutralna (ciepła biel → grafit). Strona jest jasna, otwarta i spokojna; niebieski uderza tam, gdzie chcemy akcji lub dowodu (CTA, liczby-pieniądze, hover, akcent nagłówka). Pełna paleta i role: `design/tokens.css` — **jedyne źródło prawdy**. Domyślny motyw jasny (`:root`); ciemny „Aurora Dark" żyje w `[data-theme="dark"]` (portal-sibling / OG).

**Budżet życia (zamiast dawnej reguły „85/10/5 · max 2 niebieskie"):** akcent może być hojny w **strefach akcji i danych** (CTA, panele przychodów, wykresy, żywe pastylki), ale strefy **czytania** (nagłówki proza, akapity) zostają spokojne, neutralne. Zasada kciuka: w jednym kadrze niebieski ma być *scarce and punchy* — jeśli konkuruje sam ze sobą (H1-akcent + CTA + bąbel + glow + pill naraz), zneutralizuj jeden element. Więcej życia robimy **kontrastem powierzchni, hairline'ami, ciepłym światłem i ruchem**, nie drugim kolorem.

Zakazane: fioletowo-różowe gradienty, „aurora" blob, neonowe zielenie, tęczowe wykresy, kolorowe ikonki, **pure `#FFFFFF` jako tło strony** (używamy ciepłej bieli `#FAFAF7`). Semantyczne (success/danger) tylko w UI demo produktu.

## 3. Typografia

Kierunek Apple: **jeden neutralny grotesk klasy SF na wszystko** (nagłówki i tekst), tak jak Apple używa SF Pro. Charakter niesie skala, tracking i waga — nie krój.

| Rola | Font | Uwagi |
|---|---|---|
| Nagłówki (H1–H3) | **Geist** 600 | neutralny grotesk (Vercel), klasa SF Pro. Semibold (NIE 700), tracking ciasny (-0.015…-0.025em). |
| Tekst | **Geist** 400/500 | body **17px** lh 1.47 (Apple), max szerokość akapitu 65ch |
| Liczby, KPI, labelki, kod | **JetBrains Mono** 400/500 | KPI i kwoty ZAWSZE w mono — nasz tik wizualny (podpis marki); `tnum`/`lnum` (kolumny cyfr) |

Ładowanie: **self-hosted przez `@fontsource-variable`** (geist / jetbrains-mono) — deterministycznie, bez CDN Google, przyjaźniej pod RODO. **NIE wracać do next/font/google.** (Poprzednio Schibsted Grotesk + Inter — wymienione na Geist w restyle Apple; Inter/Schibsted mniej „SF‑neutralne".)

Detal: kwoty i procenty w prozie („47 218 zł", „+23%") owijaj w mono (`.num`) z kolorem `--blue-300`/`--text-primary`; separator tysięcy = nbsp (`47 218 zł`), `zł` z nbsp przed, przecinek dziesiętny.

## 4. Ikony

**Własne mikro-glify** (`components/ui/Glyph.tsx`): pathy 24×24, stroke 1.5, round caps, zawsze `aria-hidden` (sens niesie tekst obok). **Zero bibliotek ikon (Lucide itp.)** i zero emoji w UI/copy. Kolor: `--text-secondary` lub niebieski.

## 5. Obrazy i grafika

Grafiką strony jest **żywe UI produktu**: okno czatu, panel przychodów, radar popytu — budowane w HTML/CSS jako żywe komponenty (nie screenshoty PNG, nie ilustracje 3D ze stocka). Uzupełnienie (decyzja v5):

- **Realne fotografie produktów** (packshoty, neutralne tło) z Pexels/Unsplash (licencja komercyjna bez atrybucji) w kartach czatu / wynikach — wspólny grade: crop 1:1, desaturacja −8%, winieta 3%. Manifest `public/products/*.webp` + `products.json`. ZAKAZ inicjałów/ilustracji tam, gdzie klient spodziewa się zdjęcia produktu.
- **Persona „Magda"** (doradczyni) — jeden przyjazny headshot w CAŁYM serwisie, zawsze z plakietką „AI" przy imieniu, NIGDY jako „opinia klienta"/zdjęcie zespołu.
- Tła: subtelna siatka kropek + `--gradient-glow` (pojedyncza miękka poświata w rodzinie niebieskiego, na jasnym ledwo widoczna). Żadnych zdjęć stockowych ludzi jako „klientów".

## 6. Głos marki (voice & tone)

Piszemy jak doświadczony handlowiec, nie dział marketingu:

- **Konkret zamiast przymiotnika.** Nie „niesamowicie skuteczny bot", tylko „bot, który w zeszłym miesiącu sprzedał za 47 218 zł".
- **Po polsku, po ludzku.** „Gdzie moja paczka?" zamiast „zapytania o status realizacji".
- **Krótkie zdania.** Jedno zdanie = jedna myśl. Max 2 zdania na akapit.
- **Zero wykrzykników, zero emoji, zero „rewolucji".** Słowa zakazane: rewolucyjny, przełomowy, odkryj moc, supercharge, wynieś na wyższy poziom, magia, ekosystem (pełna lista: `content/copy-pl.md` §14).
- **Do właściciela sklepu na „Ty".** On liczy pieniądze, nie „engagement".
- Bot: spokojny, konkretny doradca — 1 zdanie kontekstu + konkret (produkt/liczba/akcja). Klient może pisać naturalnie (literówki, mała litera, max 1 emoji) — to uwiarygadnia demo.

## 7. Relacja z portalem

Landing (jasny) i portal (ciemny) dzielą: **logo, akcent #3D5BFC, zaokrąglenia, mono-liczby, głos**. Landing dodaje: większą typografię, animacje, ciepłe światło. Link „Zaloguj się" w nav prowadzi do portalu i jest świadomym mostem jasny→ciemny.
