# PROMPT DLA CLAUDE CODE — dalszy rozwój landingu HackMySales

> Skopiuj wszystko poniżej linii i wklej jako pierwszą wiadomość w Claude Code uruchomionym w tym folderze. (Pierwotny brief budowy wykonany — strona istnieje; ten prompt służy do dalszej pracy.)

---

Kontynuujesz rozwój gotowego landing page'a HackMySales (AI czat + wyszukiwarka + rekomendacje dla e-commerce, rynek polski). Strona jest ZBUDOWANA i przechodzi QA — nie scaffolduj niczego od nowa, nie przepisuj działających sekcji bez powodu. Poprzeczka bez zmian: rzemiosło poziomu linear.app/vercel.com, ciemna i powściągliwa, zero AI-slopu.

## Stan zastany (commit `main`)

- Next.js 15 (App Router, TS, `output: "export"` — statyczny eksport!) · Tailwind v4 · GSAP + ScrollTrigger + Lenis · lucide-react · fonty self-hosted przez `@fontsource-variable` (NIE next/font/google — CLAUDE.md wyjaśnia).
- 16 sekcji w `components/sections/` (hero z demem czatu w 3 scenariuszach, pin filarów, kopalnie złota + ticker, porównanie #roznica, branże #branze, panel #panel, wyniki + ROI, cennik, FAQ…), dots-nav i progress bar.
- QA: axe-core 0 naruszeń · Lighthouse A11y/BP/SEO 100 (Perf 79 na dławionej maszynie; prod ≥90) · reduced-motion w pełni obsłużony (filary mają wariant stackowany `motion-reduce:`) · CLS 0.
- Git zainicjowany, historia na `main`. Teksty WYŁĄCZNIE w `content/pl.ts` (źródło: `content/copy-pl.md`). Placeholdery `[…]` są celowo widoczne — lista w `PLACEHOLDERS.md`.

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
