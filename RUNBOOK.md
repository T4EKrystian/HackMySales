# RUNBOOK — autonomiczna egzekucja poprawek (P0 → P1 → CHAT → sekcje → QA)

Ten plik to **plan wykonania dla Claude Code** do pracy *liniowej, bez zatrzymań, nawet przez kilka godzin*.
Szczegóły „co/dlaczego" są w `POPRAWKI.md`. Tu jest „w jakiej kolejności, jak weryfikować, kiedy commit".

**Ten runbook + polecenie autora = stałe GO. Nie ma już żadnych STOP-GATE.** Jedź zadanie po zadaniu do końca.

---

## §0 Protokół pracy autonomicznej — PRZECZYTAJ PIERWSZE

**Pętla dla KAŻDEGO zadania (Definicja Ukończenia):**
1. Zaimplementuj zmianę (tokeny only — zero hex/px w komponentach; zero blue/fiolet).
2. `npm run lint` **i** `npm run build` — muszą przejść. Nie commituj, jeśli któreś pada.
3. `npm run shoot` → przeczytaj świeże zrzuty w `design/shots/` (390 / 768 / 1440) dla dotkniętych sekcji.
4. Porównaj z `design/CHECKLIST.md` + kryterium odbioru zadania. Nie spełnia → poprawiaj i wróć do 2. Iteruj, aż spełnia.
5. `git commit` — atomowy, format `feat(landing): <sekcja> — <zmiana>` lub `fix(...)`/`refactor(...)`. Odhacz `- [ ]` w §Rejestrze.
6. Przejdź do następnego zadania **bez pytania o zgodę.**

**Reguły twarde (nie łam):**
- Nie zatrzymuj się między zadaniami; decyzje są już podjęte (patrz §Decyzje). Reguła „nie przechodź STOP-GATE bez GO" z `CLAUDE.md` jest **spełniona** przez ten runbook.
- Napotkasz niejednoznaczność nieopisaną tu? Wybierz najprostszą opcję zgodną z `CLAUDE.md` + tokenami, **zanotuj w treści commita** (`Assumption: …`) i jedź dalej. Nie czekaj na człowieka.
- Zero nowych zależności bez realnej potrzeby. Zero hardcoded hex/px. Zero blue/fiolet. Zero emoji jako ikon (inline SVG 1.5px). Fraunces italic ≤3×/stronę. Acid ≤2×/viewport na papierze.
- Każda animacja: tylko transform/opacity, `prefers-reduced-motion`, pauza poza ekranem. Jeden orkiestrowany moment (NightShift) — nie dodawaj kolejnych „teatrów".
- Nigdy: force-push, `git reset --hard` na cudzych commitach, kasowanie danych/branchy, sekrety w kodzie.
- `lint` + `build` zielone przed każdym commitem. Commituj często (odporność na reset kontekstu).

**Co ile faz — pełne QA:** po każdej FAZIE odpal `design:design-critique` na świeżych shotach; po FAZIE 5 dodatkowo `design:accessibility-review`. `npm run qa:console` po zadaniach dotykających JS/animacji (łapie błędy runtime).

**Gdy kontekst „ciężki" / po resecie sesji — procedura wznowienia (§9).**

---

## §Decyzje — pre-approved (żeby NIC nie blokowało)

| Temat | Decyzja |
|---|---|
| Kolor czatu | **Wariant A** — realizm Messenger/IG budujemy formą/mikrostrukturą, **nie** kolorem. Zero blue/fiolet. Paleta brandu (leśny/papier). |
| Hero H1 | Zmniejsz `--text-hero`: cel cap ~`4.75rem` (dostrój 4.5–5.25rem wg shotów), tak by dwukolumnowy hero + całe okno czatu mieściły się w `100svh` na 1440. |
| Puste czaty | Pierwsza wymiana (pytanie klienta + odpowiedź Magdy) renderowana **od razu**; playback dokłada resztę. Żaden czat nigdy pusty w polu widzenia. |
| `frame-l2` | Jeden spokojny efekt: hairline **+** jeden delikatny cień. Usuń `--highlight-top` (inset-white). |
| Newsletter | Usuń kratę (`HeroGridTexture`); zostaw ewentualnie sam subtelny `noise-forest`. Uprość pole inputu. |
| Footer wordmark | Zamaskuj side-fade (świadomy zabieg), **nie** usuwaj. |
| Zakres | Wdrażamy **wszystkie** P: P0, P1, CHAT, sekcje. |

---

## §Fazy i zadania

> Każde zadanie kończ pętlą DoD z §0. „Odbiór" = warunek widoczny na zrzucie / w logu.

### FAZA 0 — Setup & baseline (~15 min)
- [ ] **0.1 Baseline.** Utwórz branch `git checkout -b poprawki-p0-p1`. Upewnij się, że dev działa (`npm run dev`, port jak dotąd). `npm run shoot` → zapisz stan wyjściowy. `npm run qa:console` → zanotuj istniejące błędy.
  **Odbiór:** branch założony, baseline-shoty istnieją, znasz startową listę błędów konsoli. **Commit:** `chore(qa): baseline shots + console przed poprawkami`.

### FAZA 1 — P0 krytyczne (~1–1,5 h)
- [ ] **1.1 Hero H1 + layout.** `design/tokens.css` (`--text-hero`), `components/sections/Hero.tsx` (`min-h-svh`, `pt-[112px]`, `gap`/`py`, grid `lg:grid-cols-[58fr_42fr]` — sprawdź 1024–1280).
  **Odbiór (1440):** cała lewa kolumna (H1+lead+CTA+proof) **oraz** całe okno czatu widoczne w pierwszym ekranie; H1 nie dominuje. **Commit:** `fix(hero): H1 scale + layout — czat w polu widzenia`.
- [ ] **1.2 Koniec pustych okien czatu (globalnie).** `app/globals.css` (`.js .chat-step .chat-msg{opacity:0}`), `components/chat/useChatPlayback.ts`, `components/chat/ChatShell.tsx`. Pierwsza wymiana widoczna od razu (statycznie), reszta dogrywana; wyzwalacz wcześniej (`top 72%`→`top 90%`); czaty drugoplanowe (Pillars/ForWho) mogą iść `mode="static"` z lekkim fade.
  **Odbiór:** przewijając stronę, **żadne** okno czatu nie jest puste ani w połowie puste (Pillars „01 CZAT", Kanały, ForWho). **Commit:** `fix(chat): brak pustych okien — pre-seed pierwszej wymiany`. Potem `npm run qa:console`.
- [ ] **1.3 Hero-chat pełny < 1 s.** `components/sections/ChatDemo.tsx` (`waitForIntro`, `min-h-[476px]`, `pt-[112px]`), brama intro (`lib/introGate`, `Hero.tsx` `armIntroGate`). Skróć bramę; pokaż 1–2 bąble natychmiast.
  **Odbiór:** na 1. renderze hero widać żywą rozmowę (nie puste pudło); pełna < ~1 s. **Commit:** `fix(hero): czat pełny na starcie`.
- [ ] **1.4 NightShift — koniec nakładania.** `components/sections/NightShift.tsx` + jego pin/ScrollTrigger. Fazy wchodzą/wychodzą rozłącznie; tło zmienia stan zdecydowanie; reduced-motion → czytelny statyczny układ.
  **Odbiór:** w żadnej klatce scrolla nagłówek „Kiedy spałeś, bot…", liczby „6 840 zł" i podpisy statów się nie nakładają. **Commit:** `fix(nightshift): brak nakładania w pinie`. Potem `npm run qa:console` + `npm run qa:scroll:suite` jeśli dostępne.

**→ Po FAZIE 1: `design:design-critique` na świeżych shotach hero + Pillars + Channels + NightShift.**

### FAZA 2 — CHAT jak Messenger/IG (forma, wariant A) (~1,5–2 h)
- [ ] **2.1 Grupowanie + ogonki + timestampy.** `components/chat/parts.tsx`, `components/chat/skins.ts`, `ChatShell.tsx`. Kolejne bąble tej samej strony bez avatara; ogonek tylko na ostatnim (messenger: `rounded-br-md`/`bl-md`); godzina przy grupie.
  **Odbiór:** rozmowa czyta się jak realny komunikator (grupy, ogonki, godziny). **Commit:** `feat(chat): grupowanie + ogonki + timestampy`.
- [ ] **2.2 Statusy dostarczono/wyświetlone.** `parts.tsx` (`ReadReceipt`), `skins.ts` (`receipt`). Pod ostatnim bąblem klienta status w skinach bąbelkowych.
  **Odbiór:** „Wyświetlone/Dostarczono" widoczne pod wiadomością klienta. **Commit:** `feat(chat): statusy dostarczono/wyświetlone`.
- [ ] **2.3 Realistyczny pasek inputu.** `parts.tsx` (`InputTools`), `ChatShell.tsx` stopka. Pole „Napisz wiadomość…", ikony (aparat/＋/emoji/mikrofon/wyślij) jako 1.5px SVG.
  **Odbiór:** pasek inputu wygląda jak w apce komunikatora. **Commit:** `feat(chat): realistyczny pasek inputu`.
- [ ] **2.4 Skiny per-kanał + morph.** `skins.ts`, `components/sections/Channels.tsx`. Onsite/Messenger/Instagram/E-mail wyraźnie różne (IG: ring avatara + reply-quote; messenger: receipty + input; email: Od/Temat). Morph Flip płynny.
  **Odbiór:** przełączenie taba realnie zmienia sylwetkę okna. **Commit:** `feat(channels): czytelne skiny + morph`.
- [ ] **2.5 Kompozycja Kanałów.** `Channels.tsx`. Dociśnij 4 pigułki kanałów (mniej pustki, mini-ikony 1.5px) i okrąg „JEDNA MAGDA" (mniej clip-artu).
  **Odbiór:** sekcja Kanały wygląda projektowo, nie szkicowo. **Commit:** `feat(channels): kompozycja pigułek + centrum`.

**→ Po FAZIE 2: `design:design-critique` na Kanałach + Pillars + hero (wszystkie skiny).**

### FAZA 3 — P1 wykończenie (~1 h)
- [ ] **3.1 `frame-l2` spokojny.** `app/globals.css` (`@utility frame-l2`), `design/tokens.css` (`--highlight-top`, `--shadow-l2`, `--stroke-2`). Usuń inset-highlight; hairline + jeden delikatny cień. Sprawdź wszystkie użycia (czat/karty/panele).
  **Odbiór:** ramki wyglądają subtelnie, bez „skeuomorficznej" obwódki. **Commit:** `refactor(ui): frame-l2 — spokojne wykończenie`.
- [ ] **3.2 Newsletter bez kraty.** `components/sections/FinalCta.tsx` — usuń `<HeroGridTexture onForest />`; uprość pole (`.field` bez border+cień naraz).
  **Odbiór:** ciemna sekcja demo bez graph-papera; pole czyste. **Commit:** `fix(finalcta): usuń kratę, uprość pole`.
- [ ] **3.3 Footer wordmark.** `components/sections/Footer.tsx` — maska side-fade zamiast ucięcia.
  **Odbiór:** znak wodny czyta się jako celowy, nie ucięty. **Commit:** `fix(footer): wordmark bez ucięcia`.
- [ ] **3.4 Rytm sekcji.** `app/globals.css` (definicja `section-pad`) + `components/ui/kit.tsx` (wrapper `Section`) + sekcje z dużą pustką (Problem, Cennik→FAQ, MorningPanel). Ujednolić rytm 8pt, skrócić martwe przestrzenie, spiąć nagłówek z treścią.
  **Odbiór:** brak wielkich losowych dziur; płynne prowadzenie w dół. **Commit:** `fix(layout): rytm sekcji`.
- [ ] **3.5 Przejścia jasne↔ciemne.** Styki papier↔las (Nav↔FinalCta, wejście NightShift/MorningPanel). Delikatne mostki koloru/ruchu (bez nowych „teatrów").
  **Odbiór:** brak twardych cięć na stykach pasm. **Commit:** `feat(layout): mostki między pasmami`.

**→ Po FAZIE 3: `design:design-system` (spójność `frame-l2`/cieni/tokenów) + `design:design-critique`.**

### FAZA 4 — per-section drobne (~1 h)
- [ ] **4.1 ProofTicker — pasek platform.** `components/sections/ProofTicker.tsx` (`trust.platforms`). Jeden zbalansowany rząd/siatka, bez samotnego Magento; oddziel marquee od paska zaufania.
  **Odbiór (1440):** logotypy nie łamią się brzydko; pasek czytelny. **Commit:** `fix(proofticker): pasek platform`.
- [ ] **4.2 Comparison — kontrast.** `components/sections/Comparison.tsx`. Czytelniejsze „×", wyraźniejszy podział ZWYKŁY↔HACKMYSALES.
  **Odbiór:** `accessibility-review` bez uwag o kontraście „×". **Commit:** `fix(comparison): kontrast i podział`.
- [ ] **4.3 GoldMines — karta i liczby.** `components/sections/GoldMines.tsx`. Spłaszcz kartę-w-karcie (Panel przychodów); dociągnij liczby licznika do copy. `npm run check:numbers`.
  **Odbiór:** brak border-in-border; `check:numbers` czysto. **Commit:** `fix(goldmines): płaska karta + liczby`.
- [ ] **4.4 Pillars — miniatury + wypełnienie.** `components/sections/Pillars.tsx`. Realne miniatury produktów (nie szare bloby); makiety wypełnione (spięte z 1.2).
  **Odbiór:** żadnych szarych placeholderów w makietach. **Commit:** `fix(pillars): miniatury + wypełnienie`.
- [ ] **4.5 MorningPanel — siatka + odstęp.** `components/sections/MorningPanel.tsx`. Złagodź pionowe linie kolumn; skróć pustkę nad kartą panelu.
  **Odbiór:** panel mniej „arkuszowy", lepszy rytm. **Commit:** `fix(morningpanel): siatka + odstęp`.

### FAZA 5 — QA końcowe (~30–45 min)
- [ ] **5.1 Domknięcie.** `npm run build` + `npm run lint` + `npm run shoot` (390/768/1440) + `npm run qa:console` + `npm run check:numbers` (+ `npm run qa:visual` jeśli jest baseline). Odpal `design:design-critique` na pełnym zestawie i `design:accessibility-review`. Popraw resztki drobnymi commitami.
  **Odbiór:** wszystkie kryteria z §Definition of done w `POPRAWKI.md` spełnione; konsola bez nowych błędów; zgodność z `CLAUDE.md`. **Commit:** `chore(qa): domknięcie — critique + a11y`.

---

## §9 Procedura wznowienia (po resecie kontekstu)
1. Przeczytaj: `CLAUDE.md`, `PLAN.md`, `POPRAWKI.md`, `RUNBOOK.md`, `design/CHECKLIST.md`, `design/AUDIT.md`.
2. `git log --oneline -20` → ustal ostatnie ukończone zadanie po prefiksach commitów.
3. Znajdź pierwsze niezaznaczone `- [ ]` w §Rejestrze poniżej → wznów od niego.
4. `npm run dev` (jeśli trzeba) i kontynuuj pętlą z §0. Nie zaczynaj od nowa tego, co już w git.

---

## §Rejestr postępu (odhaczaj po commicie)
- [x] 0.1 baseline — checkpoint 85e88cc; shots design/shots/home-*; konsola 0/0 (desktop+mobile)
- [x] 1.1 hero H1+layout — --text-hero 6.25→4.9rem, pt/py/gap ↓; cały hero+czat w 100svh @1440
- [x] 1.2 czaty niepuste (globalnie) — pre-seed 1. wymiany (data-seed) + trigger top 90%; hero/Pillars/Kanały/ForWho pełne
- [x] 1.3 hero-chat < 1 s — reveal artefaktu 0.3/0.6 s; seed widoczny ~0,9 s
- [x] 1.4 nightshift pin — fazy rozłączne: sky-out 5.4→6.4, dawn dopiero od 6.4; brak 2× „6 840 zł" (scrub-frames)
- [x] 2.1 grupowanie+ogonki+godziny — ogonek na run-end (messenger/onsite), godziny per-tura, back-chevron/⋯ w app-skinach
- [x] 2.2 statusy receipt — „Wyświetlone/Dostarczono" pod ostatnim bąblem KLIENTA (messenger); zweryfikowane DOM
- [x] 2.3 pasek inputu — camera/plus + emoji w pigułce + wyślij (paper-plane), 1.5px SVG
- [x] 2.4 skiny+morph — 4 czytelnie różne sylwetki (onsite widget / messenger app+receipt / IG ring+reply-quote+pills / email); Flip zachowany
- [x] 2.5 kompozycja Kanałów — mini-ikony kanałów w pigułkach switchera; hub „Jedna Magda" z halo (mniej clip-artu); fix w-fit bąbla
- [x] 3.1 frame-l2 — usunięty --highlight-top (frame-l2 + 2 inline + token); martwy SpotlightCard skasowany; hairline + jeden cień
- [x] 3.2 newsletter krata — usunięty HeroGridTexture z FinalCta (zostaje noise-forest); pole border-only
- [x] 3.3 footer wordmark — mask-image bocznego fade (dissolve, nie ucięcie)
- [ ] 3.4 rytm sekcji
- [ ] 3.5 przejścia pasm
- [ ] 4.1 proofticker logo
- [ ] 4.2 comparison kontrast
- [ ] 4.3 goldmines karta+liczby
- [ ] 4.4 pillars miniatury
- [ ] 4.5 morningpanel siatka
- [ ] 5.1 QA domknięcie

---

## §Prompt startowy (wklej do Claude Code)

```
Pracujesz nad projektem HackMySales (Next.js). Wykonaj CAŁY plan z RUNBOOK.md — liniowo,
autonomicznie, bez zatrzymywania się między zadaniami. RUNBOOK.md + to polecenie to Twoje stałe
GO; nie ma STOP-GATE, decyzje są w §Decyzje.

Najpierw przeczytaj: CLAUDE.md, PLAN.md, POPRAWKI.md, RUNBOOK.md, design/CHECKLIST.md, design/AUDIT.md.
Potem realizuj RUNBOOK od FAZY 0 do 5. Dla każdego zadania trzymaj pętlę z §0:
implementuj → npm run lint && npm run build (zielone) → npm run shoot → przeczytaj zrzuty i porównaj
z kryterium odbioru → poprawiaj aż spełnia → atomowy commit → odhacz w §Rejestrze → następne zadanie.

Po każdej fazie: design:design-critique na świeżych shotach; po FAZIE 5 także design:accessibility-review.
Niejednoznaczność? Wybierz najprostszą opcję zgodną z CLAUDE.md + tokenami, dopisz „Assumption: …"
w commicie, jedź dalej. Zero blue/fiolet, tokeny only, transform/opacity + reduced-motion.
Commituj często. Nie pytaj o zgodę — dowieź całość.
```
