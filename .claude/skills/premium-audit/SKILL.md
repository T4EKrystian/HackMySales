---
name: premium-audit
description: Pętla audytu anty-generyk — jak znajdować niedoróbki i mini-błędy zanim zobaczy je klient. Uruchamiaj na koniec każdej fazy.
---

# Premium Audit — pętla samokrytyki

## Proces (obowiązkowy na koniec fazy)
1. Odpal dev, zrób screenshoty każdej zmienionej sekcji (desktop 1440 + mobile 390).
2. Dla każdej: zadaj pytanie „czy generator template'ów mógłby to wypluć?" 
   Jeśli tak — wskaż CO dokładnie (ramka? layout? copy?) i popraw przed przejściem dalej.
3. Konsola: 0 errors / 0 warnings. `overflow-x` strony: brak.

## Checklist mini-błędów (przejdź literalnie)
- [ ] Żadnych pustych placeholderów (thumby, avatary, loga) — wszystko art-directed.
- [ ] Żadnych emoji / wykrzykników w głosie bota; literówki PL (przeczytaj copy NA GŁOS).
- [ ] Formatowanie liczb: `26 300 zł`, `0,9 s`, nbsp, sieroty i/w/z/a/o.
- [ ] Spójność glifów: jeden typ strzałki (→), jeden bullet (·), jeden separator eyebrow (—).
- [ ] Martwy scroll po footerze = 0px; brak skoków layoutu przy pinach.
- [ ] Baseline'y i osie: liczby w statsach na jednej linii, eyebrows na tej samej wysokości.
- [ ] Focus states widoczne (klawiatura), aria na akordeonach/sliderach/toggle'ach.
- [ ] Hierarchia powierzchni: czy wszystko ma identyczną ramkę? Jeśli tak — zróżnicuj wg DNA.
- [ ] Kontrast tekstów pomocniczych ≥ 4.5:1 na tle.
- [ ] Hover ma stan na WSZYSTKIM klikalnym; cursor pointer tylko na interaktywnych.

## Raport fazy (krótki, do commita)
Co zmienione / co znalezione w audycie / co poprawione / znane kompromisy.
