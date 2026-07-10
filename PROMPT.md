# PROMPT DLA CLAUDE CODE — landing HackMySales

> Skopiuj wszystko poniżej tej linii i wklej jako pierwszą wiadomość w Claude Code, uruchomionym w tym folderze.

---

Zbuduj kompletny, produkcyjny landing page dla HackMySales — systemu AI dla sklepów internetowych (czat-doradca, wyszukiwarka rozumiejąca polski, rekomendacje produktowe). Odbiorca strony: właściciele i menedżerowie e-commerce w Polsce. Cel biznesowy: umówione demo.

Poprzeczka: poziom rzemiosła linear.app / vercel.com / stripe.com. Ciemna, powściągliwa, szybka strona z animacjami scrollowymi, która NIE wygląda na wygenerowaną przez AI i NIE jest kiczowata. Mniej znaczy więcej — przewaga przez detal, nie przez efekciarstwo.

## Krok 0 — przeczytaj specyfikację (w tej kolejności, zanim napiszesz linijkę kodu)

1. `CLAUDE.md` — zasady twarde projektu
2. `design/tokens.css` — tokeny (jedyne źródło kolorów/typografii/spacingu)
3. `design/brand.md` — logo, fonty, głos marki
4. `design/motion.md` — pełna choreografia animacji, sekcja po sekcji
5. `design/anti-slop.md` — bramka jakości (sprawdzasz po każdej sekcji)
6. `content/copy-pl.md` — CAŁE copy strony, wdrażane 1:1
7. `content/features.md` — spec elementów interaktywnych L1–L5
8. `content/seo.md` — meta, JSON-LD, cele Lighthouse
9. Skille: `pl-typography` (stosuj do każdego stringa), `scroll-motion` (wzorce GSAP), `design-qa` (bramka po każdej sekcji)

Assety: `assets/logomark.svg`, `assets/logo-full.svg`, `assets/favicon.svg`.

## Krok 1 — fundament

- Zainicjuj Next.js 15 (App Router, TypeScript, ESLint) + Tailwind v4 w katalogu głównym repo. Doinstaluj: `gsap @gsap/react lenis lucide-react`.
- Wepnij `design/tokens.css` do `app/globals.css` i zmapuj tokeny na theme Tailwinda. Fonty przez `next/font/google` z subsetem **latin-ext**: Schibsted Grotesk (600/700), Inter (400/500/600), JetBrains Mono (400/500).
- Utwórz słownik `content/pl.ts` (typowany obiekt) z całym copy z `content/copy-pl.md`, przepuszczonym przez util `plNbsp()` ze skilla pl-typography. Komponenty biorą teksty WYŁĄCZNIE ze słownika. Struktura gotowa pod przyszłe `en.ts`.
- Komponent `Logo` (SVG mark inline + wordmark tekstem), `Button` (primary/ghost), `SectionLabel`, `Container`. SmoothScroll wg skilla scroll-motion.
- `<html lang="pl">`, skip link, metadata z `content/seo.md`.

## Krok 2 — sekcje (buduj po kolei; po KAŻDEJ: build + bramka design-qa + anti-slop)

Kolejność i kryteria akceptacji:

1. **Nav** — logo, kotwice, `Zaloguj się` (ghost, href z placeholdera portalu), `Umów demo` (primary). Po 80px scrolla: tło surface/80 + blur + hairline. Mobile: pełnoekranowe menu. AC: focus ring wszędzie, brak CLS.
2. **Hero** — układ 55/45: tekst | żywe demo czatu (spec L1 w `features.md`, scenariusz w copy §1). Timeline wejścia wg `motion.md` §2, gradient-glow w tle, magnetic CTA (tylko desktop). AC: LCP = H1, demo odpala się raz przy wejściu w viewport, `Odtwórz ponownie` działa, atrapa inputu pokazuje uczciwy tooltip.
3. **Pasek zaufania** — logotypy platform (tekstowe, monochromatyczne) + zdanie o Time4Ecommerce. Subtelny marquee LUB statyczny rząd — wybierz, co wygląda dojrzalej przy 6 nazwach.
4. **Problem** — 3 karty z liczbami (mono, liczniki scrollowe) + kicker-cytat pełnej szerokości z rozjaśnianiem słów na scrubie (jedyny scrub tekstu na stronie). AC: liczniki formatowane pl-PL, reduced-motion pokazuje wartości od razu.
5. **Filary (pin)** — sekcja przypinana wg `motion.md` §4: 3 filary, przełączane panele demo (czat doradczy / wyszukiwarka z zapytaniem „cos cieplego dla 5latka…” / rekomendacje z suwakiem marży). Mobile: 3 bloki statyczne. AC: pin działa bez skoków, progress wskaźnik płynny, panele to żywy HTML (nie obrazki).
6. **Kopalnie złota** — 6 kart z copy §4, grid 3×2 (desktop) z asymetrycznym akcentem: karta „Panel przychodów” większa (2 kolumny) z mini-panelem L5; w karcie „Radar popytu” mini-raport. Reveal staggerem. Pod gridem: ticker L3.
7. **Jak to działa** — 3 kroki, linia łącząca rysowana na scrollu (stroke-dashoffset), numeracja mono.
8. **Wyniki + kalkulator** — liczniki L4 + kalkulator ROI L2 (client-side, live, wynik animowany, założenia jawnie opisane). AC: działa klawiaturą, wartości formatowane pl-PL.
9. **Integracje** — grid platform + zdanie o API. Bez fejkowych logo SVG — czyste, typograficzne kafle.
10. **Zaufanie** — 4 punkty z copy §8, spokojna sekcja, bez animacji poza revealem.
11. **Cennik** — 3 karty (Growth wyróżniony ringiem + badge), tabela cech, ceny w mono, CTA per plan. AC: placeholdery `[…]` widoczne i zebrane w PLACEHOLDERS.md.
12. **FAQ** — akordeon (grid-rows trick, aria-expanded), 8 pytań z copy §10 + JSON-LD FAQPage.
13. **CTA końcowe** — formularz (URL sklepu + e-mail) z walidacją i stanami z copy §13; na razie bez backendu — `console.log` + stan sukcesu, endpoint jako TODO w PLACEHOLDERS.md.
14. **Footer** — kolumny, lockup z taglinem, © rok dynamiczny.

## Krok 3 — wykończenie

- OG image przez `next/og` wg `content/seo.md`, favicon, sitemap, robots, JSON-LD (SoftwareApplication bez `offers` dopóki ceny są placeholderami).
- `::selection` w kolorze marki, scrollbar styling (subtelny), `text-wrap: balance` na nagłówkach.
- `PLACEHOLDERS.md`: pełna lista rzeczy do podmiany przed startem (ceny, liczby wyników, URL portalu, e-mail kontaktowy, dane RODO, logotypy klientów) z lokalizacją w kodzie.

## Krok 4 — weryfikacja końcowa (nie pomijaj)

Pełny przebieg skilla `design-qa` (build, screenshoty desktop+mobile — obejrzyj je, tokens-audit grepem, reduced-motion, no-JS, tab-order, Lighthouse). Potem test z `design/anti-slop.md` (zoom-out, głośne czytanie copy, porównanie z linear/vercel/resend). Raport końcowy: tabela check→wynik + lista znanych ograniczeń.

## Czego NIE robić

Nie zmieniaj copy i tokenów „bo lepiej brzmi/wygląda” — to źródła prawdy klienta. Nie dodawaj sekcji, bibliotek UI (shadcn/daisy), ciemno-jasnego przełącznika ani cookie-bannera z prawdziwym trackingiem. Nie wstawiaj zmyślonych opinii, logotypów klientów ani ratingów. Nie używaj emoji, fioletów, stockowych ilustracji. Wątpliwość co do spec → zapytaj, nie zgaduj.

Pracuj sekcja po sekcji, commituj po każdej ukończonej (conventional commits, po angielsku).
