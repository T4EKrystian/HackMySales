# Design Brief V8 — poziom Apple w palecie właściciela

Brief wejściowy dla agentów etapów E1-E10 redesignu (branch `feat/redesign-ledger`).
Konsultacja: skill `ui-ux-pro-max` (uniwersalne zasady UX) + reguły projektu.
**Precedencja: reguły projektu > rekomendacje skilla.** Skill proponował paletę
#3B82F6 / CTA #F97316 (pomarańcz) i fonty Rubik / Nunito Sans — ODRZUCONE, bo łamią
markę i banlistę. Bierzemy ze skilla tylko uniwersalia (focus/hover/active, loading,
44px, kontrast 4.5:1, reduced-motion, labelki, cursor-pointer, brak emoji).
Źródło prawdy tokenów: `design/tokens.css`. Zero hexów/px w komponentach.

## 1. Paleta (nadrzędna — nie negocjować)
- Baza ~85% viewportu: chłodna biel `--paper #F7F8FA`, tint `--paper-deep #EEF0F4`.
- Powierzchnie: karty/okna `--surface-1/2 #FFFFFF`; głębia z **hairline'ów**, nie z ciężkich cieni.
- Atrament: `--text-primary #0F1826`, `--text-secondary #3E4A5F`, `--text-muted #667085` (AA ≥4.5:1).
- Niebieski `--blue-500 #2858F0`: WYŁĄCZNIE interaktywnie (CTA, focus, active, bąbel usera,
  ≤1 akcent edytorski/sekcję). Twardo **≤6% viewportu**; nigdy 3 niezależne niebieskie na ekranie;
  nigdy jako duże krzyczące tło na jasnym. Hover `--blue-400`, press `--blue-600`.
- Granat `--forest-950 #0B1533`: pełnoszerokie pasma ciemne (tentpole); tekst `--text-on-forest`.
- Semantyka oszczędnie: `--success #1C7A4F`, `--danger #C4362B` (stonowana). Zakaz fioletu/purpury.

## 2. Fonty (nadrzędna) — kontrakt ról
- **General Sans** (`--font-display/body`), wagi TYLKO 400/500/600. Cały interfejs i proza.
- **Fraunces italic** (`--font-serif`): akcent edytorski, **max 3 słowa na całą stronę**. Nie do UI.
- **JetBrains Mono** (`--font-mono`): TYLKO staty/ledger — `.t-stat`, `.t-stat-sm`, folio (01-04),
  nocny feed ProofTicker. Ceny, timestampy, meta → General Sans + `tabular-nums` (klasa `.num`).
- Zero rozstrzelonego trackingu mono na losowych liczbach — to był główny „nieuporządkowany" tell.

## 3. Hierarchia typograficzna (Apple-grade)
- Skala z tokenów, nic poza nią: `--text-hero` (H1, lh 0.98, ls −0.035em) → `--text-h2`
  (ls −0.025em) → `--text-h3` (ls −0.015em) → `--text-lead` → `--text-body` 17px lh 1.65
  → `--text-ui` 15px → `--text-meta`/`--text-label` 13px. Podłoga prozy 17px (mobile 16px min).
- Nagłówki waga 600, tracking ciasny ujemny; body 400; wyróżnienia 500. Kontrast wagi > kontrast rozmiaru.
- Eyebrow: JEDEN wzorzec — `.label` General Sans 500, 13px, uppercase, ls +0.06-0.08em. Nie mnożyć trackingów.
- Długość wiersza prozy 62ch (`--content-text-max`); lh body 1.5-1.65. Zero sierot/wdów w display (3 breakpointy).

## 4. Spacing / rytm (8pt)
- Pion sekcji tylko `--space-section` clamp(6rem,10vw,10.5rem) / `--space-section-tight`; zero rogue px.
- Wewnątrz: krok 8pt (8/12/16/24/32/48). Kontener `--container-max 1240px`, pad `--container-pad`.
- Hojny whitespace = sygnał premium; grupuj bliskością (label→wartość ciasno, grupy luźno).
- Sąsiednie sekcje nie dzielą tego samego szkieletu layoutu (wariancja rytmu).

## 5. Elewacja i cienie (soft, warstwowe)
- Radius tylko skala 8/12/20/28: `--radius-sm` 8, `--radius-md` 12 (przyciski/inputy),
  `--radius-lg` 20 (karty), `--radius-xl` 28 (panele/okno czatu), `--radius-pill`.
- Cień = `--shadow-float` (dwuwarstwowy: 1px kontakt + 34px miękki ambient). Zero domyślnych cieni Tailwinda.
- Na jasnym głębię niosą hairline `--line` (0.09) + `--surface`, nie ciężki drop-shadow. Ciemne pasma:
  szum + hairline `--line-dark`, nigdy płaskie wypełnienie.

## 6. Stany interaktywne (każdy element: 4 stany)
- **hover**: subtelna zmiana tła/obrysu (`--paper-deep` / `--blue-400`) + cursor-pointer; bez skoku layoutu.
- **focus-visible**: pierścień niebieski `--border-focus` 2px + offset 2px (nigdy `outline:none` bez zamiennika).
- **active/press**: `transform: scale(0.98)` w `--dur-fast` (180ms) — feedback dotyku; zero bounce.
- **disabled**: opacity ~0.5 + `cursor-not-allowed`; loading = przycisk zablokowany + wskaźnik, nie martwy UI.
- Przejścia 150-300ms na `transform`/`opacity`/kolor; respektuj `prefers-reduced-motion`.

## 7. Karty produktowe
- Role: nazwa `.t-ui` 500 ink · kategoria/meta `.t-meta` mute BEZ uppercase · cena `.num t-ui` 500 nowrap
  · stara cena `.num t-meta` line-through + gap. Jeden radius miniatur (`rounded-sm`), jedna baseline cen.
- `min-h-[2lh]` na nazwie → ceny 4 kart na wspólnej linii bazowej. Featured bez tinta (budżet niebieskiego).
- Affordance koszyka = subtelny (obrys/ikona), nie krzyczące pełne niebieskie tło. Realne nazwy + zdjęcia.

## 8. Chat UI
- Okno `--radius-xl` na `--surface-2`, header = `.label` + folio `.ledger`; bez mac-dots (banlista).
- Bąbel usera: niebieski `--blue-500` + `--text-on-acid` (jedyne duże niebieskie tu dozwolone, bo interaktywne).
  Bąbel bota: `--surface-3 / --paper-deep`, ink. Ogonki, timestampy `.num t-meta`, receipty spójne.
- Typing/loading = skeleton lub wskaźnik pisania, nigdy zamrożone okno. Wewnętrzny scroll `data-lenis-prevent`.

## 9. Formularze
- `<label for>` przy każdym polu (nie placeholder-jako-label). Input `--radius-md`, `--bg-input`, hairline.
- Focus-visible pierścień; błąd = komunikat blisko pola + `--danger`; sukces = puls poświaty (bez fałszywych liczb).
- CTA submit pełny niebieski. Pola ≤5 (konwersja); cel dotykowy ≥44×44px; autocomplete + inputmode sensowne.

## 10. TOP-10 anty-wzorców (twarde NIE)
1. dot-grid / kropkowe dekoracje. 2. glassmorphism wszędzie (`bg-white/10` niewidoczne na jasnym).
3. generyczne gradienty (poza 2 zatwierdzonymi w tokens.css) i yellow/purple duo. 4. bounce easing
(cubic z ujemnym przeregulowaniem). 5. emoji jako ikony (tylko SVG). 6. wykrzykniki w copy.
7. fiolet/purpura w jakiejkolwiek formie. 8. mono z rozstrzelonym trackingiem na losowych liczbach.
9. domyślne cienie Tailwinda / hover ze skokiem layoutu (scale przesuwające sąsiadów).
10. generyczny SaaS 3-card grid / template-look bez narracji (test „kto to zrobił?" musi wypaść na naszą korzyść).

## Konflikty skill × projekt (rozstrzygnięte)
- Skill: kolory #3B82F6/#F97316, fonty Rubik+Nunito Sans, „form ≤3 pola" → PROJEKT WYGRYWA
  (marka #2858F0/granat, General Sans+Fraunces+JetBrains Mono, formularz ≤5 pól per decyzja właściciela).
- Skill zgodny i przyjęty: focus-states, hover/active/disabled, loading-states, 44px, kontrast 4.5:1,
  reduced-motion, cursor-pointer, brak emoji, lazy-load obrazów, `next/image`.
