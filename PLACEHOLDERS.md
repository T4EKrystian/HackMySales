# PLACEHOLDERS — do podmiany przed startem produkcyjnym

TRYB MAKIETY: strona renderuje liczby demo bez nawiasów (decyzja: makieta ma wyglądać skończenie). Ta lista dalej obowiązuje — to rejestr wartości do podmiany przed produkcją. Podmieniasz w **jednym miejscu**: `content/pl.ts`.

## Liczby i oferty (content/pl.ts)

| Placeholder | Gdzie w pl.ts | Uwaga |
|---|---|---|
| `[1 dzień]` wdrożenia | `hero.proof` | potwierdzić realny czas |
| `[47 218 zł]` przychód bota | `goldMines.revenue` (body + panelAmount) | wartość demo panelu |
| `[7 dni]` pierwsze efekty | `how.note` | |
| `[+18%]`, `[+23%]`, `[−64%]`, `[3 miesiącach]` | `results.counters` | MUSZĄ być prawdziwe przed startem |
| `[34]`, `[6 840 zł]`, `[21]` nocna zmiana | `results.night` + `goldMines.nightMail` | dane demo (karta Raportu w §4 nie niesie już liczb — 2026-07-10) |
| Wpisy proof tickera (0,9 s · 214 zł · timestampy) | `proofTicker.items` | feed nocy = dane demo, podpis w pasku o tym mówi |
| Założenia kalkulatora (+0,5 p.p., +10% AOV) | `results.calc.assumptions` | potwierdzić pilotażami |
| `[499 zł]`, `[1 299 zł]`, limity `[1 000]`, `[5 000]`, `[10 tys.]`, `[100 tys.]`, `[5 tys.]` | `pricing.plans`, `faq.items` | ceny i progi planów |
| Ceny roczne `[399 zł]`, `[1 039 zł]` + rabat `[−20%]` | `pricing.plans` (priceYearly), `pricing.billing` | demo = miesięczna × 0,8 — potwierdzić realny rabat roczny |
| `[w planie Growth]` (Messenger/IG) | `integrations.note` | |
| Chipy branż: `[−30%]`, `[+38%]`, `[−50%]` | `forWho.segments` | cele przykładowe — potwierdzić pilotażami |
| RODO: `[hosting EU, DPA, retencja…]` | `trust.items`, `faq.items` | skonsultować z prawnikiem |
| `[kontakt@hackmysales.pl]` | `finalCta.errors.server` + `footer` (mailto) | docelowy e-mail |

## Techniczne

| Co | Gdzie |
|---|---|
| Domena produkcyjna `https://hackmysales.pl` | `app/layout.tsx` (metadataBase), `app/sitemap.ts`, `app/robots.ts` |
| URL portalu klienta (teraz nip.io) | `content/pl.ts` → `nav.loginHref`, `footer` |
| Endpoint formularza demo (teraz `console.log`) | `components/sections/FinalCta.tsx` (TODO) |
| Polityka prywatności / Regulamin (`#`) | `content/pl.ts` → `footer.columns` |
| JSON-LD `offers` w SoftwareApplication | `app/page.tsx` — dodać po ustaleniu cen |

(OG image: ✓ wygenerowany brandowym Schibsted Grotesk — `public/og.png`.)

## Ukryte do czasu prawdziwych danych (nie fabrykować!)

- Logotypy klientów i case studies (sekcja Wyniki) — patrz `content/copy-pl.md` §6.
- Opinie/gwiazdki — nie istnieją w kodzie i mają nie istnieć, dopóki nie będą prawdziwe.
