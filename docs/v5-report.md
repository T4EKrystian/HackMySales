# V5 — raport końcowy (realne chaty · foto · kalibracja · particles)

Data: 2026-07-10 · Commity: `7ecc4a0` (F0) → `d6bdd4d` (F1) → `daf3141` (F2) → `dfe5562`+`8fd7ce2` (F4/F5-część) → `55046bc` (F3, fork) → `fd26bb1` (F4-strefy+F5) → F6 (ten commit).

## Co się zmieniło

**F1 — foto.** 16 packshotów (Pexels/Unsplash, licencje bez atrybucji) + portret persony. Pipeline `scripts/process-photos.mjs`: crop 1:1 (attention lub ręczne regiony), desaturacja −8%, webp q80, 800+112 px. Rejestr: `public/products/products.json`, licencje/odrzuty/kompromisy: `assets-src/SOURCES.md` (URL-e stron źródłowych per plik). Odrzucone kilkanaście kandydatur za WYRAŹNE loga obcych marek (HOKA ×3, POC ×2, SMITH, Merrell, SIMMS, Patagonia, Adidas, Van Rysel, „Mount to Coast" ×2, Nike/Dior).

**F2 — ChatShell.** `components/chat/`: script.ts (adaptery 1:1 z pl.ts + mapa nazwa→slug foto), skins.ts (onsite/messenger/instagram/legacy — czysta konfiguracja, one-accent: messenger = nasz blue-500, IG = gradient blue-400→600), useChatPlayback (dots 600–900 ms deterministycznie, `typeIntoPunct` 40–70 ms/znak + pauzy 250–400 ms po interpunkcji, start po ≥200 ms aktywności, reduced-motion = statycznie), parts.tsx (avatar Magdy z plakietką AI, karta produktu ze zdjęciem), skin email = refaktor NightMail. Migracje: hero, Filary (prop `active` z pinu), Zaufanie, Branże, Kopalnie-email, **Kanały: klik nodu/taba = ta sama rozmowa §1A w 4 skinach, pulsy beams płyną do aktywnego kanału**. Persona spec-first: deck §1c + `pl.chatUi`.

**F3 — kalibracja scrolla** (fork, raport szczegółowy: `docs/scroll-report.md`). Budżety pinów: Filary 83%→93% vh/stan, Arena 70%→90%, Kroki 73%→93%; wszystkie piny snap do labels (0.4 s power2.inOut), scrub 0.8. Counter v2: scrub + twardy snap (koniec „—6+58"). Skeleton shimmer wyszukiwarki — zero pustych ram. Jeden H2 na sekcję (duchy usunięte). Test dwuprędkościowy Playwright (1200/3000 px/s): asercje a–e zielone na obu prędkościach, dead-scroll 0 px.

**F4 — ambient particles.** Jeden pass po drei-Views (priority 1000, własna Scene, reset viewportu + scissor-off + strażnik autoClear — architektura dowiedziona źródłowo w planie). 420 pkt (mobile ×0.4), 1–2 px, alpha ≤ 0.35, dryf z zawijaniem, zero reakcji na kursor poza hero. Strefy: `lib/ambient.ts` (hero 1.0 → sekcje czytane 0.12–0.3, maska −70% pod kolumną 1240 px, Kanały hub-attract, Arena split L/R, kalkulator sprzęga gęstość z odzyskiem przez `setAmbientValue`). Re-pomiar stref na fonts.ready/resize/ScrollTrigger.refresh. Debug: `?ambient=debug`.

**F5 — checklist briefu.** Realne monochromatyczne loga platform (simple-icons CC0 + wordmarki Shoper/IdoSell/Sky-Shop) w pasie zaufania (55→100% hover) i marquee integracji, wspólny x-height. Foto w: wynikach wyszukiwarki filarów, reco (kaski), kartach areny, koszyku ratownika, doradcy rozmiaru (kurtka skaluje się wg S/M/L), zakładkach branż. Ticker od „22:41 — koszyk uratowany". Blipy radaru z tooltipami (1:1 z tabeli). Bąbel suwaka widoczny podczas przeciągania. Arena: lewa = skin legacy („Bot v1.2", systemowy font, kanciaste rogi), prawa = Magda·AI. Finał: focus-attract inputu (glState.boost).

## QA (F6)

| Pomiar | Wynik | DoD |
|---|---|---|
| Konsola (prod, pełny przejazd + interakcje) | **0 błędów / 0 ostrzeżeń** (odfiltrowany szum sterownika GL headless-Chromium) | ✓ |
| Dead-scroll po stopce | 0 px | ✓ |
| Scroll-report (2 prędkości, asercje a–e) | zielone | ✓ |
| Mobile 390 px | scrollWidth = 390 (zero overflow) | ✓ |
| Lighthouse desktop | **Perf 94 · A11y 100 · BP 100 · SEO 100** (LCP 1,5 s · TBT 50 ms · CLS 0,007) | ✓ (≥90) |
| Lighthouse mobile (lantern) | Perf 60 · A11y 100 · BP 100 · SEO 100 | ⚠ patrz niżej |
| Magda spójna | hero · Filary · Zaufanie · Branże · Arena · Kanały (6 miejsc, jeden plik `/team/magda.webp`) | ✓ |
| ProductVisual | wyłącznie jako udokumentowany fallback (`ProductThumb`, `parts.tsx`) | ✓ |

**Mobile — dowód braku regresji (wzorzec z V4).** Lantern symuluje LCP 9,1 s, ale realny Chromium (viewport 390): **LCP = akapit hero przy 180 ms** (jedyny kandydat; zdjęcia nie przejmują LCP — czat startuje ukryty pod `.js`). Pomiar `--throttling-method=devtools`, ta sama maszyna, ta sama chwila:

| Build | Perf | LCP=FCP | TBT |
|---|---|---|---|
| V4 baseline `3149d6c` | 62 | 3,1 s | 710 ms |
| V5 tip | 60 | 3,2 s | 730 ms |

Różnice w granicach szumu pomiarowego — **V5 nie dołożyło ani LCP, ani TBT**. Mobile pozostaje TBT-bound (hydracja Next) — znany sufit z V4; naprawa = zmiana architektury (np. częściowa hydracja), poza zakresem V5.

**Naprawy z QA:** ostrzeżenie GSAP „scale not eligible for reset" — `Cursor.tsx` quickTo("scale") rozbite na scaleX/scaleY (fasada bez zmiany API) + silnik czatu bez `scale` w tweenach revertowanych; `aria-prohibited-attr` na blipach radaru — `role="img"`.

## Kompromisy / do wiadomości klienta

1. **x-trail-2**: brak czystego packshotu butów trail bez brandu w darmowych źródłach (Pexels/Unsplash/Openverse-CC0) — wybrane najlepsze ujęcie; napis producenta nieczytelny w rozmiarach użycia (thumby ≤112 px). Podmiana 1:1, gdy klient dostarczy własny packshot.
2. **u-lock**: deck mówi „zapięcie U-lock", zdjęcie pokazuje zapięcie łańcuchowe z szyfrem (czytelne jako „zapięcie"); slug gotowy do podmiany.
3. **Magento**: ikona usunięta z bieżących wydań simple-icons — pobrana z przypiętej wersji v11 (CC0, `SOURCES.md`).
4. **Skin messenger/instagram**: świadomie ewokują WZORZEC komunikatora w naszej rodzinie blue — bez kolorów i logotypów Mety w mockupie (nazwa kanału tylko w tabie/labelu).
5. **Wordmark stopki**: reguła axe `label-content-name-mismatch` bywa zgłaszana przez podwójny tekst efektu wipe (wzorzec z V3); finalny run LH pokazuje A11y 100, axe-core bezpośredni czysty — zostawione bez zmian.
