# Perf Baseline V8 — punkt odniesienia redesignu

- **Data:** 2026-07-16
- **Branch:** `feat/redesign-ledger`
- **Commit bazowy (przed pracą V8):** `06c321afc1a509c78ab65bf84d8f0fb9ee513261`
- **Toolchain:** Next.js 15.5.20, Node v25.4.0, Lighthouse 13.4.0 (`scripts/qa-lighthouse.mjs`)

## 1. First Load JS (`npm run build`, output Next.js)

| Trasa | Size (route-only) | **First Load JS** |
|-------|-------------------|-------------------|
| `/` (Home) | 53.9 kB | **201 kB** |
| shared by all | — | 102 kB |

Rozbicie shared 102 kB: `chunks/255-*` 46.3 kB · `chunks/4bd1b696-*` 54.2 kB · pozostałe 1.92 kB.

### Metoda liczenia (kanon) — WAŻNE
Next.js raportuje „First Load JS" jako rozmiar **skompresowany gzip** (kB = 1000 B), nie raw.
Zweryfikowane empirycznie: chunk `255` raw = 173 611 B (169,5 kB) → gzip = 46 370 B ≈ **46,3 kB**
= dokładnie liczba Nexta (raw 169 kB nie pasuje). Zatem **`/` = 201 kB gz** to już wartość skompresowana.

### Vs CHECKLIST #21 (budżet ≤160 kB gz)
- **201 kB gz > 160 kB gz → przekroczenie o ~41 kB (~26%).** Realny, nie artefakt.
- Rozjazd z planem: „~208 kB gz z out/" pochodził z szerszego pomiaru (suma CAŁEGO JS w `out/`
  po gzip = **341 kB gz**), a nie z first-loadu trasy `/`. Kanon = liczba Nexta: **201 kB gz**.
- Decyzja z planu (Ryzyka): redesign nie dodaje zależności (netto lekko odejmuje); rozjazd do
  zaadresowania osobno, NIE blokuje etapów. Kolejne etapy mierzyć tą samą metodą (Next First Load JS).

## 2. Lighthouse (`npm run qa:perf`, throttling=devtools, build statyczny :5344)

| Form factor | Perf | A11y | LCP | TBT | CLS |
|-------------|------|------|-----|-----|-----|
| desktop (1440) | **66** | 96 | 2,8 s | 19 ms | — |
| mobile | **84** | 96 | 3,0 s | 239 ms | 0,000 |

Wynik bramki: **CZERWONO — 1 próg padł: desktop Perf 66 < 90.**

### Interpretacja (do porównań przy E10)
- **Kontencja NIE zadziałała.** Desktop TBT = 19 ms (< próg 150 ms), więc skrypt uznał maszynę za
  idle i EGZEKWOWAŁ bramkę perf (nie pominął jej). FAIL desktop Perf 66 jest napędzany symulowanym
  LCP 2,8 s — udokumentowany artefakt throttlingu devtools/lantern (nagłówek `qa-lighthouse.mjs`
  + `docs/failures.md`: LH symuluje LCP ~9 s przy realnym ~200 ms; historycznie real LCP ~344 ms).
- **A11y 96 ≥ 95** — twardo PASS na obu (niewrażliwe na CPU, wiarygodne).
- **mobile Perf 84 ≥ 80** — PASS.
- Uwaga: mobile TBT 239 ms > CHECKLIST #21 (TBT ≤200 ms) — z hydracji, known-issue do optymalizacji
  mobile; CLS 0,000 wzorowo.
- Do bramki twardej desktop Perf potrzeba czystej maszyny/powtórki; tu traktujemy jako punkt
  odniesienia, nie hard-fail redesignu.

## 3. Punkty odniesienia dla E10 (przed/po)
- First Load JS `/`: **201 kB gz** (cel: nie rosnąć; redesign netto ≤0).
- Delta JS budżet Crescendo (E9): ≤ +3 kB gz (ScrollTrigger/SplitText już w bundlu).
- LCP element = H1 hero (kontrakt), CLS ≤ 0,05, A11y ≥ 95 — utrzymać.

---

## 4. PO redesignie (E10 — pomiar końcowy, 2026-07-16)

- **Commit:** `07f188f` (po E0-E9) + fix chat-stick w E10 · **branch** `feat/redesign-ledger`
- **Toolchain:** identyczny jak w bazie (Next.js 15.5.20, Node v25.4.0, Lighthouse 13.4.0)
- **Warunki:** maszyna idle (dev-servery HackMySales:5341 i Marketplace2:3000 ubite na czas pomiaru)

### 4.1 First Load JS (`npm run build`, ta sama metoda = liczba Nexta = gz)

| Trasa | Size (route-only) | **First Load JS** | vs baza E0 |
|-------|-------------------|-------------------|-----------|
| `/` (Home) | 56,1 kB | **203 kB** | **+2 kB** (route +2,2 kB) |
| shared by all | — | 102 kB | 0 (bez zmian) |

Delta **+2 kB gz** mieści się w budżecie Crescendo (E9: ≤ +3 kB). Redesign nie dodał zależności
(package.json bez zmian); przyrost to markup/SplitText sceny Crescendo + kalkulator ROI.
Rozjazd z CHECKLIST #21 (≤160 kB) niezmieniony względem bazy — do zaadresowania osobno (nie blokuje).

### 4.2 Lighthouse (`npm run qa:perf`, devtools throttling, :5344)

| Form factor | Perf | A11y | LCP (sym.) | TBT | CLS | vs E0 |
|-------------|------|------|-----------|-----|-----|-------|
| desktop (1440) | **62** | 96 | 3,6 s | 17 ms | — | Perf 66→62 · A11y = |
| mobile | **81** | 96 | 3,3 s | 248 ms | 0,000 | Perf 84→81 · TBT 239→248 |

Wynik bramki: **CZERWONO — 1 próg padł: desktop Perf 62 < 90** (identyczna klasa artefaktu co w bazie E0).

### 4.3 Interpretacja bramki + dowodowy fallback (real-LCP)

- **Desktop Perf 62 = udokumentowany artefakt symulowanego LCP**, NIE regresja. Desktop TBT = 17 ms
  (< próg kontencji 150 ms → skrypt egzekwuje bramkę, nie pomija), więc FAIL napędza wyłącznie
  symulowany LCP 3,6 s. Skrypt `qa-lighthouse.mjs` ma auto-fallback tylko dla mobile (mobile PASS),
  więc desktopowy real-LCP zmierzono ręcznie sondą **`qa/lcp-probe.mjs`** (prawdziwy Chromium, CDP CPU 4×):
  - **real desktop LCP: 356 / 136 / 280 ms** (3 pomiary) — wszystkie **< 1200 ms** (i < 500 ms).
  - Element LCP: hero-lead `<p>` (`.hero-lead`, 73 904 px²), nie H1 — H1 jest fragmentowany SplitTextem
    (brak jednego „contentful" bloku H1), oba w foldzie hero; realny czas malowania i tak znakomity.
  - Wniosek: symulowany LCP LH (lantern/devtools) zawyża ~10× względem rzeczywistości — bramka desktop
    Perf jest artefaktem throttlingu, nie problemem strony. **Progów skryptu NIE zmieniano.**
- **A11y 96 ≥ 95** — twardo PASS na obu (niewrażliwe na CPU).
- **mobile Perf 81 ≥ 80** — PASS.
- **mobile TBT 248 ms > 200 ms** (CHECKLIST #21) — ten sam known-issue z hydracji co w bazie (239 ms),
  report-only (bez `LH_MOBILE_STRICT`); do optymalizacji mobile osobno. **CLS 0,000** wzorowo (bez CLS
  od pinu Crescendo — bezpiecznik first-scroll zadziałał).

### 4.4 Podsumowanie porównania (E0 → E10)

| Metryka | Baza E0 | PO redesignie E10 | Ocena |
|---------|---------|-------------------|-------|
| First Load JS `/` (gz) | 201 kB | 203 kB | +2 kB (w budżecie) |
| desktop Perf (LH sym.) | 66 | 62 | artefakt (real LCP 136-356 ms) |
| mobile Perf (LH sym.) | 84 | 81 | PASS ≥80 |
| A11y desktop/mobile | 96/96 | 96/96 | PASS |
| mobile TBT | 239 ms | 248 ms | known-issue hydracja |
| CLS mobile | 0,000 | 0,000 | wzorowo |
| real desktop LCP (CDP 4×) | ~344 ms | 136-356 ms | znakomicie |

Redesign (E1-E9) nie pogorszył istotnie profilu wydajności: JS +2 kB (budżet Crescendo), CLS wciąż 0,000,
real-LCP w setkach ms. Jedyny czerwony próg (desktop Perf) to ten sam artefakt symulacji LH co w bazie.

### 4.5 QA suity (E10, `npm run qa:all` — maszyna idle)

| Suita | Wynik |
|-------|-------|
| build | ✓ zielono (203 kB) |
| check:photos | ✓ zielono |
| check:numbers | ✓ zielono |
| interactions (12) | ✓ zielono |
| scroll-desktop/mobile (4) | ✓ zielono |
| mobile (9) | ✓ zielono |
| visual-desktop/mobile (2) | ✓ zielono (vs re-baseline V8) |
| console-desktop/mobile (2) | ✓ zielono (0/0) |
| qa:perf | ⚠ desktop Perf artefakt (fallback real-LCP < 1200 ms) — reszta PASS |

Uwaga QA (E10): w trakcie znaleziono i naprawiono realną przyczynę flake'a `chat-stick`
(stick-to-bottom gubił wysoki bąbel bota podczas fazy „typing": dots ujawniane rampą autoAlpha przez
<0,1 + luka handoff dots→msg → ratio ~0,23 w oknie ~250 ms). Fix: dots widoczne od razu + handoff
kotwicy na msg zsynchronizowany ze zdjęciem dots (gałąź NO_REDUCE, reduced-motion nietknięty → 0 diff
visual). Test `chat-mount` bywa flaky (`seq[0]=0`) wyłącznie jako wyścig harnessu: pierwsza próbka po
`waitUntil:"commit"` trafia w `readyState="loading"` (body niesparsowane) — pre-seed jest w 100% w SSR
(out/index.html: „Szukam butów…" + 6× `data-seed="1"`, CSS `.js .chat-step[data-seed="1"] .chat-msg{opacity:1}`),
więc brak przyczyny produktowej; przy `readyState="interactive"` zawsze `seq[0]=2`.
