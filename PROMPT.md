# PROMPT DLA CLAUDE CODE — dalszy rozwój landingu HackMySales

> Skopiuj wszystko poniżej linii i wklej jako pierwszą wiadomość w Claude Code uruchomionym w tym folderze. (Pierwotny brief budowy wykonany — strona istnieje; ten prompt służy do dalszej pracy.)

---

Kontynuujesz rozwój gotowego landing page'a HackMySales (AI czat + wyszukiwarka + rekomendacje dla e-commerce, rynek polski). Strona jest ZBUDOWANA i przechodzi QA — nie scaffolduj niczego od nowa, nie przepisuj działających sekcji bez powodu. Poprzeczka bez zmian: rzemiosło poziomu linear.app/vercel.com, ciemna i powściągliwa, zero AI-slopu.

## Stan zastany (commit `main`, po przebudowie v3 — 2026-07-10)

- Next.js 15 (App Router, TS, `output: "export"` — statyczny eksport!) · Tailwind v4 · GSAP 3.15 (SplitText/ScrambleText/DrawSVG/MotionPath/Flip — darmowe od 3.13) + ScrollTrigger + Lenis · three r182 + @react-three/fiber 9 + drei 10 (JEDEN globalny Canvas przez `lib/glRegistry` + `components/gl/` — lazy po idle, sceny: rdzeń hero, pole Problemu, mini-rdzeń Kanałów, converge finału) · motion (tylko springi komponentowe) · lucide-react · fonty self-hosted przez `@fontsource-variable` (NIE next/font/google — CLAUDE.md wyjaśnia).
- 18 sekcji v3: hero z particle core + żywym czatem (typing, chipy scenariuszy, zegar) · proof ticker (scalony TrustBar) · Problem (pin 300%, liczby 15vw, gasnące kropki GL) · Manifest (kinetic kicker) · filary (device-frame morph + Flip) · bento kopalni (2 duże + 4 małe, żywe pętle, spotlight+tilt) · arena zamiast tabeli (4 rundy, wynik 0:4) · Kanały (beams + pulsy) · kroki horizontal-pin ze snapem · poranek (perspektywa + parallax warstw) · kalkulator (odometer, mnożnik ×N, glow-burst) · integracje (2 przeciwbieżne marquee + fuzzy finder) · kontrola (żywy panel sterowania) · pricing (border-beam, disclosure) · FAQ display-size (plus→minus) · founder note (maski + watermark 2017/40+) · final CTA (sekwencja skanu + converge) · footer z wielkim wordmarkiem (fill-wipe). Custom cursor (pointer:fine), grain, nav chowany przy scrollu ze scramble-hover.
- QA v3: Lighthouse desktop **Perf 99 · A11y 100 · BP 100 · SEO 100** (LCP 0,8 s, CLS 0,008); mobile throttled Slow-4G: Perf 74 · A11y 100 · BP 100 · SEO 100 (LCP 4,0 s = artefakt swap fontów pod throttlingiem — patrz „Znane kompromisy” niżej); konsola czysta; reduced-motion pełne (GL się nie montuje, piny mają warianty pionowe); mobile 390 px bez poziomego scrolla.
- Znane kompromisy v3: (1) mobile-throttled LCP gated swapem fontów — do zbicia preloadem woff2 na etapie deployu (nginx/Vercel headers) albo `font-display: optional` dla Inter; (2) przełącznik cen Miesięcznie/Rocznie NIE istnieje — deck nie ma cen rocznych (§9b); (3) EffectComposer/Bloom odpuszczony świadomie — glow robią additive points + CSS (budżet perf).
- Git: historia przebudowy w commitach `feat(v3-f1..f8)`. Teksty WYŁĄCZNIE w `content/pl.ts` (źródło: `content/copy-pl.md` — nowe sekcje interfejsowe §1b/4c/4d/4e/5c/6b/7c/8b/9b/11b). Placeholdery `[…]` — lista w `PLACEHOLDERS.md`.

## Zanim cokolwiek zmienisz

1. `npm install && npm run dev` — obejrzyj stronę (scroll całości, taby czatu, kalkulator, mobile).
2. Przeczytaj: `CLAUDE.md` → `README.md` → `PLACEHOLDERS.md` → `design/anti-slop.md` → `design/motion.md` → `content/features.md`.
3. Skille projektu: `scroll-motion`, `pl-typography`, `design-qa` (bramka po KAŻDEJ zmianie).

## Zasady pracy (bez wyjątków)

- **Spec-first:** nowa treść → najpierw dopis do `content/copy-pl.md` / `content/features.md`, potem `pl.ts`, potem komponent. Kod nigdy nie wyprzedza specu.
- Copy 1:1 ze słownika; kolory/spacing tylko z tokenów; liczby w mono (`fmtIntPl` grupuje też 4 cyfry); animacje wg `motion.md` + obowiązkowy reduced-motion.
- Po każdej zmianie: `npm run build && npm run lint` + przebieg `design-qa` (screenshoty desktop/mobile — obejrzyj je). Commit per ukończone zadanie (conventional commits, EN).
- Uczciwość: żadnych zmyślonych opinii, logotypów, ratingów. Placeholder ≠ kłamstwo.

## Backlog (rób po kolei; przy ⚠ zapytaj przed implementacją)

1. **⚠ Formularz demo — prawdziwy endpoint.** Uwaga: `output: "export"` wyklucza API routes. Zapytaj użytkownika, którą drogą iść: (a) zewnętrzny webhook/formularz (np. własny endpoint na VPS, n8n, Formspark), (b) rezygnacja ze static export na rzecz node servera. Do decyzji NIE implementuj — przygotuj porównanie 3 zdaniami.
2. **Podmiana placeholderów.** Przejdź `PLACEHOLDERS.md` pozycja po pozycji z użytkownikiem; po otrzymaniu danych podmień w `pl.ts`, usuń nawiasy, zaktualizuj listę. Ceny → dodaj `offers` do JSON-LD (`app/page.tsx`, TODO w kodzie).
3. **Deploy.** Zaproponuj: Vercel (najprościej) albo VPS + nginx (brotli + cache immutable dla `_next/static`). Po wdrożeniu: podmień domenę w `layout.tsx` (metadataBase), `sitemap.ts`, `robots.ts`; zweryfikuj OG w podglądach social mediów i Lighthouse na produkcji (cel Perf ≥90 mobile).
4. **Strony prawne.** `app/polityka-prywatnosci/page.tsx` i `app/regulamin/page.tsx` — layout spójny (Container, typografia), treść jako wyraźne TODO dla prawnika; podepnij linki w stopce.
5. **Analityka privacy-first.** ⚠ Zapytaj: Plausible/Umami (cookieless — bez banera) czy nic. Eventy: klik CTA hero, wysłanie formularza, klik cennika, przełączenie scenariusza czatu.
6. **Wersja EN.** `content/en.ts` (tłumaczenie z zachowaniem głosu marki — krótko, konkretnie), routing `/en`, hreflang, przełącznik języka w nav (dyskretny, jak w portalu). Struktura słownika już na to gotowa.
7. **Perf polish.** Dynamic import cięższych sekcji poniżej foldu; sprawdź, czy GSAP nie ładuje się podwójnie; raport bundle (`next build` — First Load JS per route) przed/po.
8. **Case studies.** Gdy użytkownik dostarczy prawdziwe dane: sekcja wg `copy-pl.md` §6 (cytat + liczba, układ asymetryczny). Do tego czasu NIE istnieje w DOM.
9. **Drobiazgi otwarte:** favicon dla jasnego motywu Safari (media prefers-color-scheme w icon), `security.txt`?, 404 — link do sekcji funkcji.

## Czego NIE robić

Nie zmieniaj tokenów ani copy „bo lepiej wygląda/brzmi" — to źródła prawdy klienta (zmiany tylko na wyraźne polecenie, wtedy spec-first). Nie dodawaj bibliotek UI, przełącznika dark/light, cookie-banera bez decyzji o analityce, emoji, fioletów. Nie wracaj do `next/font/google` (celowo fontsource). Nie usuwaj widocznych placeholderów bez prawdziwych danych. Wątpliwość → pytanie, nie zgadywanie.

## Raportowanie

Po każdym zadaniu: 2–3 zdania co zrobione + wynik build/lint/design-qa + hash commita. Po sesji: krótka lista „zrobione / czeka na decyzję / następne".
