# Inwentarz efektów dekoracyjnych (V6-F3 anti-kitsch)

Reguły: max **1 glow na viewport** · zero czystej bieli w efektach · gradient IG tylko jako 1px ring avatara · border-beam wyłącznie Growth · żadnych kolorowych cieni pod tekstem · particles ≤ .35 alpha. Każde cięcie ma ZAMIENNIK (reguły pozytywne).

| # | Efekt | Gdzie | Uzasadnienie (1 zd.) | Werdykt | Zamiennik |
|---|---|---|---|---|---|
| 1 | Rdzeń GL + glow-quad | Hero | Sygnatura strony — „żywy mózg" produktu; jedyny glow hero-viewportu. | zostaje | — |
| 2 | `.hero-nigdy` text-shadow | Hero H1 | Drugi glow w tym samym viewporcie co rdzeń — łamie budżet. | **OUT** | sam kolor blue-300 (akcent zostaje, poświata nie) |
| 3 | dot-grid | Hero tło | Ledwie widoczna siatka — głębia bez ozdobnictwa. | zostaje | — |
| 4 | grain 2.5% | globalnie | Tekstura anty-plastik z DNA. | zostaje | — |
| 5 | Ambient particles | cała strona | Atmosfera wg mapy stref V5, maska pod tekstem, ≤.35. | zostaje | — |
| 6 | logo-pulse (kropka nav) | Nav | Semantyczna informacja „online", 6 px, 2 s. | zostaje | — |
| 7 | Scroll-progress bar | Nav | Orientacja w długiej stronie. | zostaje | — |
| 8 | Kursor custom (ring) | desktop | Sygnatura interakcji; scale przy linkach. | zostaje | — |
| 9 | FieldPoints (kropki-klienci) | Problem | NARRACJA sekcji (gasnący klienci), nie ozdoba. | zostaje | — |
| 10 | Skeleton shimmer | Filary | Funkcjonalny (rama nigdy nie stoi pusta). | zostaje | — |
| 11 | pp-sweep (korekta literówki) | Filary | Pokazuje feature wyszukiwarki. | zostaje | — |
| 12 | Flip tasowania reco | Filary | Pokazuje feature „lepsza marża wyżej". | zostaje | — |
| 13 | Radar sweep + blipy | Bento | Feature Radaru popytu; po trimie 38%→30% tinty, 4.8 s→6 s. | przycięte | wolniejszy, bledszy sweep |
| 14 | wismo-dot `shadow-cta` | Bento autopilot | Kolorowy cień na 10-px kropce = cukierek. | **OUT** | sama kropka bg-blue (ruch po ścieżce niesie znaczenie) |
| 15 | Rev-chart (słupki+linia) | Bento panel | Dane, nie dekoracja. | zostaje | — |
| 16 | Arena: glow prawej strony | Pojedynek | Drugi „świecący" element viewportu (scoreboard/badge już akcentują); kontrast stron robi desaturacja legacy. | **OUT** | elewacja L2 + border-line-2 + highlight-top |
| 17 | Arena: legacy desaturacja | Pojedynek | Celowa martwota lewej strony — kontrast bez efektów. | zostaje | — |
| 18 | Beams + pulsy Kanałów | Kanały | Diagram produktowy („jeden mózg"); pulsy przygasają poza aktywnym. | zostaje | — |
| 19 | `.chat-ig-user` gradient TŁA | Kanały/IG | Cukierkowe tło bąbla — obcy język wizualny. | **OUT** | solid `chat-user-quiet` (blue −18% w oklch, kontrast 4,80); gradient TYLKO jako 1px ring avatara (`.chat-ig-ring`) |
| 20 | Messenger `bg-blue` pełny | Kanały/Messenger | Pełny akcent w cudzym wzorcu czytał się „za słodko". | przycięte | `chat-user-quiet` (−18%); geometria (rounded-3xl, receipt) niesie rozpoznawalność |
| 21 | Kalkulator glow-burst przy progu | Wyniki | Jednorazowy feedback przekroczenia progu — informacja. | zostaje | — |
| 22 | RollingNumber (rolka cyfr) | Wyniki/Cennik | Sygnatura liczb; ruch = zmiana wartości. | zostaje | — |
| 23 | Marquee logotypów ×2 | Integracje | Treść (realne integracje), pauza na hover. | zostaje | — |
| 24 | border-beam | Cennik Growth | JEDYNY beam na stronie — wyróżnik planu. | zostaje | — |
| 25 | `shadow-cta` na KARCIE featured | Cennik | Beam + elewacja wystarczą; drugi glow na tym viewporcie. | **OUT** | beam + `--shadow-l2` (CTA-przycisk zachowuje swój cień) |
| 26 | Badge pulse once | Cennik | Jednorazowe wskazanie „najczęściej wybierany". | zostaje | — |
| 27 | Watermark „2017/40+" | Od zespołu | 4,5% opacity (≤6% wg reguły) — tło z sensem (fakty). | zostaje | — |
| 28 | Konwergencja cząstek + scan | Finał | Sygnatura C (teatr bez kłamstwa). | zostaje | — |
| 29 | wordmark-wipe | Footer | Podpis strony; interakcja hover. | zostaje | — |
| 30 | SpotlightCard (L3 hover) | karty | System elewacji, nie ozdoba. | zostaje | — |

**Cięcia: 5/30 (~17%) + 2 przycięte** — pozycje 2, 14, 16, 19, 25 OUT; 13, 20 przycięte. Zero czystej bieli w efektach: GLOW_FRAG miesza kolory tokenów (uColHalo/uColHot z palety), hot-center punktów `col+=hot*0.85` rozjaśnia TINT, nie dodaje bieli — bez zmian; particles uColB = `--text-muted` ✓.

**Budżet glow per viewport (po cięciach):** hero = rdzeń (1) · problem = brak · filary = brak · bento = brak (radar to ruch, nie glow) · pojedynek = brak · kanały = pulsy beams (1, przygasające) · wyniki = burst tylko przy interakcji (przejściowy) · cennik = beam (1) · finał = konwergencja (1). ✓
