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
