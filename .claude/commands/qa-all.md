---
description: Pełny przebieg QA — build, bramki statyczne (foto/liczby), 5 agentów QA sekwencyjnie, sklejony docs/qa-report.md, twarda blokada „done" przy czerwonym.
---

Wykonaj W TEJ KOLEJNOŚCI, sekwencyjnie (NIGDY równolegle — agenci dzielą port 5343
i suity są wrażliwe na timing):

1. `npm run build` — błąd ⇒ `node scripts/qa-report-merge.mjs --summary --build-fail` i STOP.
2. `npm run check:photos && npm run check:numbers` — FAIL ⇒ dopisz wynik (w tym LISTĘ
   brakujących plików foto, jeśli ją wypisał gate) do raportu i STOP.
3. Uruchom subagentów (Task) PO KOLEI, czekając na każdego:
   qa-interactions → qa-scroll → qa-mobile → qa-visual → qa-console-perf.
   Po każdym przeczytaj jego sekcję w `docs/qa-report.md`. Nie przerywaj na FAILu
   (zbierz pełny obraz) — wyjątek: BUILD-FAIL.
4. `node scripts/qa-report-merge.mjs --summary` — tabela zbiorcza + werdykt.
5. Werdykt końcowy:
   - jakikolwiek FAIL (poza known-fail `test.fail()` — kontrakty przyszłych faz) ⇒ odpowiedz
     „**QA: CZERWONO — zadania NIE WOLNO oznaczyć jako done**" + lista minimalnych repro.
   - komplet PASS ⇒ „**QA: ZIELONO**".
   ZAKAZ: dopóki raport czerwony, żadna odpowiedź w tej sesji nie może twierdzić,
   że praca jest skończona.
