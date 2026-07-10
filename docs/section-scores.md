# V6 — Rubryka sekcji (F5)

Metoda: blueprint (co / jak / kryterium) → zmiana → **świeży screenshot** → ocena.
Osie 0–5: **C**raft · **R**estraint · **H**ierarchia · **A**utentyczność. Próg: ≥4 w KAŻDEJ osi.
Werdykty wyłącznie ze screenshotów z sesji V6 (pliki w scratchpadzie sesji, prefix `v6r-*` / `v6-*`);
tam gdzie screenshot nie rozstrzygał (kolory na kompresji PNG, stany czasowe) — dump stanu DOM.

| # | Sekcja | C | R | H | A | Dowód |
|---|--------|---|---|---|---|-------|
| 1 | Nav | 4 | 5 | 4 | 5 | v6r-08b (pasek + podkreślenie), dump `data-active`/`aria-current` |
| 2 | Hero | 5 | 4 | 5 | 4 | klatki intro t=300/1200/4400, v6r-03 (dół hero) |
| 3 | Ticker | 4 | 5 | 4 | 4 | v6r-03 |
| 4 | Pas zaufania | 4 | 5 | 4 | 5 | v6r-03 (wordmarki w Inter) |
| 5 | Problem | 5 | 4 | 5 | 4 | v6r-05b (środek pinu „70%") |
| 6 | Trzy miejsca | 5 | 4 | 5 | 4 | v6r-06 (filar 02 + skeleton) |
| 7 | Kopalnie złota | 4 | 4 | 4 | 5 | v6r-07a/07b |
| 8 | Pojedynek | 4 | 4 | 4 | 5 | v6r-08b + dumpy DOM 4 rund (dy 300/900/1800) |
| 9 | Kanały | 5 | 4 | 4 | 4 | klatki morph t=200/600, v6-f3-instagram |
| 10 | Branże | 4 | 4 | 4 | 4 | v6-f1-forwho (Magda w headerze, foto per tab) |
| 11 | Trzy kroki | 4 | 5 | 4 | 4 | v6r-11b (s0 — karta KOMPLETNA), v6r-11c, dump kropek |
| 12 | Poranek | 4 | 4 | 4 | 5 | v6r-12 (przejście bez prześwitu marquee) |
| 13 | Kalkulator | 4 | 4 | 4 | 5 | v6r-12 (suwaki + „jak liczymy →") |
| 14 | Pas metryk | 4 | 5 | 4 | 5 | v6r-14 (wartości końcowe po once-count + dopisek) |
| 15 | Integracje | 4 | 4 | 4 | 5 | v6r-15 („rest api" → trafienie), v6r-14 (marquee + finder) |
| 16 | Kontrola | 5 | 4 | 4 | 5 | v6r-16; hit-area toggle zmierzona 64×44 px |
| 17 | Cennik | 4 | 4 | 5 | 5 | v6r-17 (beam tylko Growth, ceny mono) |
| 18 | FAQ | 4 | 5 | 4 | 5 | v6r-18 |
| 19 | Od zespołu | 4 | 4 | 4 | 5 | v6r-19; watermark `opacity-[0.045]` ≤ 6% |
| 20 | Finał | 5 | 4 | 4 | 4 | v6r-20b (elipsa POD microcopy), geometria 661 < 729 |
| 21 | Footer | 4 | 5 | 4 | 5 | v6r-21 |

Wszystkie sekcje ≥ 4 w każdej osi. Żadna nie wymagała drugiej iteracji poza №11 i №20 (niżej).

---

## Blueprinty i zmiany V6 per sekcja

**1. Nav** — Co: wskaźnik aktywnej sekcji. Jak: IO po id linków, mapa stanów wszystkich obserwowanych (pojedynczy batch „zamrażał" wskaźnik między kotwicami), podkreślenie hairline + `aria-current`. Kryterium: wskaźnik gaśnie między kotwicami, nigdy nie pokazuje dwóch. Zmiana: dodany wskaźnik; kontrast linków na jasnych klatkach hero OK (glass po scrollu).

**2. Hero** — Co: wejście 1,2 s bez preloadera. Jak: choreografia wyłącznie na dekoracjach (glow, dot-grid, zapłon rdzenia `uIgnite`), treść nietknięta (LCP), czat budzi się PO intro (`introGate`, kropka pop). Kryterium: kolejność beatów na klatkach; `.hero-lead` widoczny od 0. Zmiana: introGate + ignition + wake czatu; rytm typingu z pauzami po „?" (typeIntoPunct, bez zmian).

**3. Ticker** — brief: NIE DOTYKAĆ. Zmiana: żadna. Mono, timestampy, separatory — spójny.

**4. Pas zaufania** — Co: wordmarki platform jako czysty tekst. Jak: `PlatformLogo` przełączony z font-display na **Inter** (`font-sans font-medium tracking-tight`), ikony tylko tam, gdzie brand ma znak. Kryterium: jednolity x-height, zero pseudo-logo. Zmiana: font wordmarków.

**5. Problem** — Co: narracyjny pin z liczbami. Jak: countery scrub+snap ZOSTAJĄ tylko tu (narracja); budżety ≥90 vh/stan, snap do etykiet (kalibracja V5-F3). Kryterium: scroll-raport zielony w obu prędkościach. Zmiana: brak (re-run asercji w F6).

**6. Trzy miejsca** — Co: trzy filary z żywym demo per filar. Jak: pin + Flip; skeleton shimmer w wynikach wyszukiwarki na wolnym scrollu. Kryterium: brak pustych paneli w stanach spoczynku. Zmiana: brak w F5 (foto zweryfikowane w F1).

**7. Kopalnie złota** — Co: bento 6 kart, każda z żywym mini-dowodem. Jak: liczby wyłącznie z `content/demo-data.ts` (47 218 / 214 / 34 / 6 840 / 21); radar przycięty (sweep 30%/6 s); foto w ratowniku i doradcy; disclosure „dane demo". Kryterium: `check:numbers` zielony; glow ≤ 1/viewport. Zmiana: F2+F3 (truth-table, radar, wismo-dot bez shadow-cta).

**8. Pojedynek** — Co: 4 rundy FAQ-bot vs HMS ze scoreboardem. Jak: timeline pinu (pytanie → HMS +1,05 s → FAQ celowo +1,45 → werdykt +1,9); prawa strona bez niebieskiego glow (elewacja L2 + hairline). Kryterium: dump DOM potwierdza 4 rundy i wynik 0:0→0:4; „pusty" kadr klienta = martwy punkt mid-scrub, nie bug. Zmiana: glow OUT (F3); legacy-font + chip nazwy po lewej (V5).

**9. Kanały** — Co: przełączenie skina = morph, nie replay. Jak: puls 300 ms po krawędzi → Flip 450 ms (`ch-frame`/`ch-msg-i`, borderRadius) → re-stagger 250 ms; semantyka `seen` (rozmowa gra RAZ); skiny zdesaturowane −20%, gradient IG tylko jako ring avatara 1,5 px. Kryterium: „ten sam mózg, inna skóra" — innerText bota identyczny przed/po (asercja F6); switcher nigdy pusty. Zmiana: cała choreografia B + de-kicz skinów.

**10. Branże** — Co: panel per branża z osobą i katalogiem. Jak: Magda w headerze panelu (PersonaRow), foto per tab (72 px), crossfade `fade-in-panel` **240 ms** (brief: ≤250; było 300). Kryterium: gate foto zielony; crossfade w budżecie. Zmiana: crossfade 300→240 ms (F5), Magda + foto (F1).

**11. Trzy kroki** — Co: horizontal pin 01→03, karta kompletna NA SNAPIE. Jak: treść kroku 01 gra time-based przy wejściu w pin (raz), okna kroków 02/03 domknięte przed etykietami (0,7→~1,45 < s1; 2,3→2,8 < s2). Kryterium: screenshot na s0/s1/s2 = karta pełna; kropki monotoniczne. Zmiana (2. iteracja): scrub-bound start zostawiał PUSTĄ ramkę na s0, chip „podpięto" wypadał po wyjeździe panelu — przełożone na p0 time-based + okna przed snapem.

**12. Poranek** — Co: panel przychodów rano. Jak: KPI z truth-table (2 340 / 86 / 7 / 2), countery once. Kryterium: przejście poranek→wyniki bez prześwitu marquee (screenshot czysty — zarzut klienta obalony dowodem). Zmiana: F2 (liczby).

**13. Kalkulator** — Co: ROI z suwakami. Jak: wartości i progi z demo-data (1 299 / 10 000 / domyślne 20 000·180·1,8); tooltip nad thumbem przy dragu (`:active`); popover „jak liczymy →" przy wyniku. Kryterium: `check:numbers` zielony; glow burst tylko > progu. Zmiana: F2; mikro-link zweryfikowany (istnieje, wygląda jak link).

**14. Pas metryk** — Co: 4 liczby wyników. Jak: countery **once** (1,2 s, snap na finał — klasa błędu „36 031 na screenie" wyeliminowana), wartości z truth-table (+18 / +23 / −64 / 24/7), dopisek „Wartości poglądowe…". Kryterium: screenshot po wejściu = wartości KOŃCOWE. Zmiana: F2 (once + truth-table).

**15. Integracje** — Co: marquee platform + finder. Jak: podwójny marquee przeciwbieżny; finder z aria-live; „rest api" → „REST API — wtyczka lub API, ok. 15 minut". Kryterium: fraza z spacją trafia (norm() usuwa spacje). Zmiana: brak (weryfikacja).

**16. Kontrola** — Co: panel ustawień + podgląd na żywo. Jak: toggle z lockiem na „Nie zmyśla" (OFF — ZABLOKOWANE), segmented ton, RODO chips; hit-area toggli 64×44 px (`before:-inset-2.5`); crossfade 220 ms; Magda z foto i statusem online. Kryterium: hit ≥44 px zmierzony; kontrast ≥4,5:1. Zmiana: brak w F5 (pomiar).

**17. Cennik** — Co: 3 plany, rolka cen przy przełączniku okresu. Jak: border-beam TYLKO Growth; featured bez `--shadow-cta` (elewacja + beam wystarczą); ceny mono z truth-table (499/1 299; rocznie 399/1 039; −20%). Kryterium: budżet glow 1/viewport. Zmiana: F3 (cień OUT).

**18. FAQ** — Co: akordeon 8 pytań. Jak: morph +/− (rotate), pierwsza otwarta; odpowiedzi z decku (m.in. „mówi «nie wiem» i przekazuje człowiekowi"). Kryterium: aria akordeonu, sanity morph. Zmiana: brak.

**19. Od zespołu** — Co: nota editorial z faktami. Jak: cytat liniami spod maski; watermark „2017 / 40+" `opacity-[0.045]` (≤6%), parallax; sieroty łapane przez pl-typography. Kryterium: watermark w budżecie; zero fabrykacji (fakty z decku). Zmiana: brak (pomiar 4,5%).

**20. Finał** — Co: domknięcie klamry rdzenia + uczciwy skan. Jak: converge → płaska elipsa-„lądowisko"; sekwencja §11b po URL; ignition echo na wysłaniu. Kryterium: elipsa NIE przecina tekstu. Zmiana (2. iteracja): pas GL `top-[22%]`→`top-[34%]` — elipsa przecinała microcopy „Odpowiadamy…" (v6r-20/21); po zmianie microcopy kończy się na 661 px, centrum pasa 729 px (v6r-20b czysty).

**21. Footer** — brief: nic. Zmiana: żadna. Wordmark-wipe, kolumny, © 2026 — spokojny dead-tail.
