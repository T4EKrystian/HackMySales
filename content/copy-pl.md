# HackMySales — Copy Deck PL (źródło prawdy)

Zasady: teksty wdrażamy 1:1, bez „ulepszania”. Wartości w `[nawiasach]` = placeholdery do podmiany na prawdziwe dane (oznaczenie edytorskie w tym decku). TRYB MAKIETY: na stronie liczby renderują się bez nawiasów jako dane demo; co podmienić śledzi `PLACEHOLDERS.md`. Struktura stringów: słownik `content/pl.ts` (gotowość pod EN).

---

## 0. Nawigacja

Logo | Produkt · Funkcje · Wyniki · Cennik · FAQ
Przyciski: `Zaloguj się` (ghost, → portal) · `Umów demo` (primary)
Mobile: hamburger, pełnoekranowe menu.

---

## 1. Hero

**Eyebrow (mono, uppercase):** CZAT AI · WYSZUKIWARKA · REKOMENDACJE

**H1:** Sprzedawca, który nigdy nie śpi.

*(Warianty do testów A/B — nie wdrażać teraz: „Twój sklep właśnie nauczył się sprzedawać.” / „Zamień pytania w zamówienia.”)*

**Lead:** HackMySales podpina się do Twojego sklepu i doradza klientom jak najlepszy handlowiec — w czacie, w wyszukiwarce i w rekomendacjach. A co poniedziałek pokazuje, ile na tym zarobiłeś. Co do złotówki.

**CTA primary:** Umów demo na swoich produktach
**CTA secondary:** Zobacz, jak sprzedaje →  *(scrolluje/wskazuje na żywe demo obok; „porozmawiaj” obiecywało rozmowę, której skryptowane demo nie da — uczciwość)*

**Mikrodowód pod CTA:** Wdrożenie w [1 dzień] · Bez zmiany platformy · 14 dni testów za darmo

**Hero visual:** żywe, oskryptowane demo czatu (spec: `content/features.md` §L1). Rozmowa, która się „pisze” na oczach użytkownika:

> Klient: Szukam butów do biegania po lesie, rozmiar 44, do 400 zł
> Bot: Mam trzy trafienia. Najczęściej wybierane: **X-Trail 2 GTX** — wodoodporne, 379 zł, rozmiar 44 jest na stanie. Wysyłka dziś do 15:00. Pokazać pozostałe dwa?
> Klient: A coś pod kostkę?
> Bot: Jasne — **X-Trail Mid**, 399 zł. Uwaga: cholewka wypada mało — klienci przy 44 często brali 44,5. Dodać do koszyka?
> *(badge)* ✓ Zamówienie #8412 — 399 zł · przypisane do rozmowy

**Scenariusze demo B i C (przełączane tabami w oknie czatu: Doradztwo · Rozmiar · Paczka):**

*B — Dobór rozmiaru:*
> Klient: Ta kurtka w M czy L? Mam 178 cm i 82 kg
> Bot: Przy 178 cm / 82 kg ten model wypada mało — z historii zwrotów: klienci o Twoich wymiarach zostawiali L, a M wracało częściej. Proponuję: **Kurtka 3L Shell — L**, 449 zł, L na stanie. Biorę?
> *(badge)* ✓ Rozmiar dobrany: L · mniejsze ryzyko zwrotu

*C — Gdzie paczka:*
> Klient: gdzie moje zamowienie? #8203
> Bot: Paczka #8203 wyjechała dziś o 7:40 z sortowni. Kurier planuje doręczenie jutro w oknie 10:00–14:00. Podesłać link do śledzenia?
> Klient: a moge zmienic na paczkomat?
> Bot: Jasne — przekierowałem do punktu przy Twojej ulicy. Potwierdzenie poszło na e-mail.
> *(badge)* ✓ Obsłużone bez człowieka · 0 min czekania

**Pasek zaufania (pod hero):** Zbudowane przez zespół Time4Ecommerce — w e-commerce od 2017, ponad 40 sklepów pod opieką. Działa z: Shoper · IdoSell · PrestaShop · WooCommerce · Shopify · Magento · [logotypy klientów — placeholder]

---

## 2. Problem

**Label:** CO CIĘ TO KOSZTUJE

**H2:** Twój sklep traci klientów po cichu.

**Trzy fakty (karty, liczby w mono):**

1. **98%** — tylu odwiedzających wychodzi bez zakupu. Nie dlatego, że nie chcą kupić — nikt im nie pomógł wybrać.
2. **70%** — tyle pytań do obsługi to w kółko to samo: „gdzie moja paczka?”, „jaki rozmiar?”, „czy zdąży przed piątkiem?”.
3. **16 godzin na dobę** — tyle czasu Twój sklep milczy, kiedy obsługa nie pracuje. Klienci kupują o 22:40. Pytają o 23:15. Odpowiedź dostają jutro — często już po zakupie u konkurencji.

**Kicker (duży cytat):** W sklepie stacjonarnym klient, który stoi bezradnie między półkami, dostaje pomoc w minutę. W internecie dostaje ciszę.

---

## 3. Produkt — trzy filary

**Label:** CO DOSTAJESZ

**H2:** Jeden system. Trzy miejsca, w których zarabia.

*(Sekcja przypinana — panele przełączają się podczas scrollu, spec: `design/motion.md` §4)*

**Filar 1 — Czat, który doradza jak handlowiec**
Nie drzewko „wybierz 1, 2 lub 3”. AI zna cały katalog, stany i ceny — prowadzi klienta do koszyka, a do roweru dorzuci kask.

**Filar 2 — Wyszukiwarka, która rozumie polski**
„cos cieplego dla 5latka na narty do 200zl” — klient pisze po swojemu, wyszukiwarka i tak wie, o co chodzi. Koniec z „brak wyników” przy pełnym magazynie.

**Filar 3 — Rekomendacje z głową do interesów**
Podpowiada to, co klient naprawdę chce kupić — a kiedy kilka produktów pasuje tak samo, promuje ten z lepszą marżą. Twoja księgowa zauważy różnicę.

---

## 3c. Dla kogo (branże)

**Label:** BRANŻE

**H2:** Działa wszędzie tam, gdzie klient pyta.

*(4 zakładki, każda: ból branży + przykładowa wymiana + chip efektu. Liczby w chipach = placeholdery.)*

**Moda i obuwie** — ból: „Największy koszt: zwroty złych rozmiarów.”
> Klient: Sukienka na wesele, rozmiar 38, do 300 zł
> Bot: Mam sześć trafień. Uwaga: ten model wypada duży — przy Twoich wymiarach lepiej zagra 36. Pokazać oba warianty?
Chip: [−30%] zwrotów rozmiarowych

**Dom i ogród** — ból: „Klient nie kupuje jednej płytki — kompletuje projekt.”
> Klient: Urządzam łazienkę 4 m², szary mat
> Bot: Proponuję komplet: płytki 60×60, fuga, hydroizolacja i listwy — 8 pozycji, wszystko z jednej partii. Wrzucić całość do koszyka?
Chip: [+38%] wartości koszyka

**Elektronika** — ból: „Połowa pytań to «czy to zadziała z moim…».”
> Klient: czy ta karta graficzna wejdzie do mojego zestawu?
> Bot: Tak — Twój zasilacz 650 W wystarczy, a obudowa zmieści kartę o długości 310 mm. Dorzucić przewód 2×8-pin?
Chip: [−50%] pytań „czy kompatybilne”

**B2B i hurt** — ból: „Zapytania ofertowe przychodzą po godzinach.”
> Klient: potrzebuje 40 szt z logo, termin 2 tygodnie
> Bot: Przy 40 szt. rabat hurtowy 12%. Zostaw NIP i plik z logo — rano wycena będzie u Ciebie w skrzynce.
Chip: leady zebrane, zanim wstałeś

**Caption pod sekcją:** Przykładowe rozmowy i cele — konkretne liczby dla Twojej branży policzymy na demo.

---

## 4. Kopalnie złota — funkcje, których się nie spodziewasz

**Label:** KOPALNIE ZŁOTA

**H2:** Sprzedawca to dopiero początek.

**Karty (6):**

**Panel przychodów** — Każda rozmowa spięta z zamówieniem: bot zarobił w tym miesiącu **[47 218 zł]**. Widzisz kasę, nie wykres „zaangażowania”.

**Radar popytu** — Bot zapisuje każde „nie znalazłem” i każde pytanie bez odpowiedzi. Co tydzień dostajesz listę: czego klienci szukali, a czego nie masz — gotowe zamówienie do hurtowni.

**Ratownik koszyka** — Kursor sunie do „zamknij kartę” — bot zagaduje w ostatniej chwili: odpowiedzią na wątpliwość albo kodem, wedle reguł, które ustawisz. Koszyk uratowany, zanim stał się „porzucony”.

**Doradca rozmiaru** — „Mam 178 cm i 82 kg” — bot dobiera rozmiar z tabel producenta i historii zwrotów („ten model wypada mało”). Mniej zwrotów, mniej kurierów jeżdżących w obie strony za Twoje pieniądze.

**Autopilot „gdzie moja paczka”** — Status zamówienia, link do śledzenia, zmiana adresu — klient załatwia wszystko w czacie, nikt z zespołu nie kiwa palcem. 70% zgłoszeń do BOK znika z dnia na dzień.

**Raport nocnej zmiany** — Co rano bot melduje się jak pracownik: ile rozmów, ile sprzedaży, co przekazał zespołowi. Przykład masz obok — tak wygląda poniedziałek 8:00.

**Podgląd e-maila raportu (żywe UI obok karty):**
Od: HackMySales · Temat: Raport nocnej zmiany — poniedziałek 8:00
Treść: „W nocy obsłużyłem [34] rozmowy i sprzedałem za [6 840 zł]." · „21 pytań o dostawę — odpowiedziałem sam." · „3 rozmowy przekazałem zespołowi, ze streszczeniami." · „Radar: 6 osób szukało «kurtki softshell 158», której nie masz." · Link: Szczegóły w panelu

---

## 4b. Różnica (porównanie)

**Label:** RÓŻNICA

**H2:** Czatbot z FAQ to nie handlowiec.

Kolumny: **Zwykły czatbot** | **HackMySales**

| Zwykły czatbot | HackMySales |
|---|---|
| Odpowiada na pytania z listy | Zna cały katalog i stany na żywo |
| „Przepraszam, nie rozumiem" | Rozumie literówki i polską odmianę |
| Raportuje liczbę rozmów | Raportuje przychód co do złotówki |
| Milczy, gdy klient wychodzi | Ratuje koszyk, zanim zniknie |
| Wymaga ręcznie pisanych scenariuszy | Uczy się z każdej rozmowy i zwrotu |
| Kończy rozmowę na „napisz do nas" | Kończy na „dodać do koszyka?" |

**Dopisek:** Różnicę widzisz w panelu, nie w obietnicach.

---

## 5. Jak to działa

**Label:** WDROŻENIE

**H2:** Trzy kroki. Zero developera.

1. **Podłączasz sklep** — wtyczka albo klucz API. 15 minut, klikasz, działa.
2. **AI uczy się Twojego biznesu** — katalog, stany, ceny, dostawy, zwroty, FAQ. Odpowiada wyłącznie na podstawie Twoich danych.
3. **Sprzedaje, a Ty czytasz raporty** — czat, wyszukiwarka i rekomendacje pracują 24/7. Ty dostajesz liczby i listę rzeczy do poprawy.

**Dopisek:** Bez przebudowy sklepu. Pierwsze efekty widać w [7 dni].

---

## 5b. Panel (poranek)

**Label:** PANEL

**H2:** Poranek z HackMySales: kawa i jeden rzut oka.

**Lead:** To ten sam panel, który dostajesz w portalu klienta. Wszystko, co bot zrobił bez Ciebie — w jednym widoku.

**Dashboard (żywe UI, dane demo z podpisem):**
- KPI: Przychód z rozmów — dziś: 2 340 zł · Rozmowy: 86 · Uratowane koszyki: 7 · Przekazane zespołowi: 2
- Wykres: „Przychód z rozmów — 14 dni” (słupki + linia trendu)
- Ostatnie rozmowy: 07:42 dobór rozmiaru — kurtka 3L — 449 zł · 07:15 status paczki #8203 — — · 06:58 kompletowanie łazienki — 1 260 zł
- Radar popytu — nowe: „kurtka softshell 158” — 6 pytań · „raty 0%” — 4 pytania
- Link: Zobacz pełny panel na demo → #demo
- Podpis: dane demo

---

## 6. Wyniki + kalkulator ROI

**Label:** POLICZALNOŚĆ

**H2:** Nie wierz nam. Policz.

*(Kolejność na stronie od 2026-07-10: kalkulator → licznik nocnej zmiany → liczniki celów z podpisem. Sekcję otwiera najuczciwszy dowód — rachunek na liczbach klienta, nie placeholdery.)*

**Kalkulator (interaktywny, spec: `content/features.md` §L2):**
Nagłówek: Ile Ci ucieka co miesiąc?
Pola: Odwiedziny miesięcznie · Średni koszyk (zł) · Konwersja (%)
Wynik: „Przy tych liczbach HackMySales musi podnieść konwersję tylko o **0,2 p.p.**, żeby zarobić na siebie. Do odzyskania przy Twoim ruchu: **[+X zł miesięcznie]**.”
CTA pod wynikiem: Sprawdź to na swoim sklepie → demo

**Liczniki (animowane, mono, dane do potwierdzenia):**
- **[+18%]** konwersji u klientów po [3 miesiącach]
- **[+23%]** średniej wartości koszyka (AOV)
- **[−64%]** zapytań „gdzie moja paczka” do obsługi
- **[24/7]** — godziny pracy czatu, wyszukiwarki i rekomendacji

**Podpis pod licznikami:** Wartości poglądowe. Twoje liczby policzymy na demo.

*(Case studies: placeholder na 2–3 historie klientów — układ cytat + liczba. Do czasu zebrania prawdziwych: sekcja ukryta, NIE wstawiać zmyślonych opinii.)*

---

## 7. Integracje

**H2:** Twoja platforma jest na liście.

Shoper · IdoSell · PrestaShop · WooCommerce · Shopify · Magento · Sky-Shop · [inne]
**Dopisek:** Sklep pisany na miarę? REST API i webhooki — podłączymy wszystko, co ma katalog i koszyk. Czat dogada się z klientem także na Messengerze i Instagramie [w planie Growth].

---

## 8. Zaufanie i kontrola

**Label:** BEZPIECZEŃSTWO

**H2:** Ty ustalasz, co bot mówi. I czego nie mówi.

- **Nie zmyśla** — odpowiada tylko na podstawie Twojego katalogu i polityk. Nie zna odpowiedzi? Mówi wprost i przekazuje człowiekowi.
- **Przekazanie do człowieka** — z pełnym streszczeniem rozmowy, żeby klient nie powtarzał wszystkiego od zera.
- **RODO i dane w UE** — [hosting EU, DPA, retencja danych — potwierdzić szczegóły przed publikacją].
- **Pełna kontrola tonu** — formalny czy luźny, z rabatami czy bez. Zmieniasz w panelu, działa od zaraz.

---

## 9. Cennik

**Label:** CENNIK

**H2:** Prosty rachunek.
**Lead:** Każdy plan zwraca się z jednej uratowanej transakcji dziennie. Ceny netto, rozliczenie miesięczne, rezygnacja jednym kliknięciem.

| | **Start** | **Growth** ⭐ najczęściej wybierany | **Scale** |
|---|---|---|---|
| Cena | **[499 zł]/mc** | **[1 299 zł]/mc** | **wycena indywidualna** |
| Dla kogo | do [10 tys.] wizyt/mc | do [100 tys.] wizyt/mc | duży ruch, wiele sklepów |
| Czat AI 24/7 | ✓ | ✓ | ✓ |
| Wyszukiwarka AI | ✓ | ✓ | ✓ |
| Panel przychodów | ✓ | ✓ | ✓ |
| Rozmowy / mc | [1 000] | [5 000] | bez limitu |
| Rekomendacje + dosprzedaż | — | ✓ | ✓ |
| Radar popytu | — | ✓ | ✓ |
| Ratownik koszyka | — | ✓ | ✓ |
| Messenger / Instagram | — | ✓ | ✓ |
| Multi-store, SLA, opiekun | — | — | ✓ |

CTA w każdej karcie: `Testuj 14 dni za darmo` (Start/Growth) · `Porozmawiajmy` (Scale)
**Dopisek:** Bez karty na start. Przekroczysz limit rozmów? Nic nie wyłączamy — dogadamy plan.

---

## 10. FAQ

**H2:** Pytania, które i tak chciałeś zadać.

**Czy bot będzie zmyślał i obiecywał klientom głupoty?**
Nie. Odpowiada wyłącznie na podstawie Twojego katalogu, cennika i polityk. Kiedy nie zna odpowiedzi, mówi „nie wiem” i przekazuje rozmowę człowiekowi. Każdą odpowiedź możesz prześledzić do źródła w panelu.

**Ile trwa wdrożenie?**
Wtyczka lub API: ok. 15 minut. Indeksacja katalogu: do kilku godzin. Realnie: rano podłączasz, po południu bot sprzedaje. Nie ruszamy kodu Twojego sklepu.

**Czy zadziała z moją platformą?**
Shoper, IdoSell, PrestaShop, WooCommerce, Shopify, Magento — natywnie. Sklep autorski — przez REST API. Jeśli masz katalog i koszyk, podłączymy.

**Co z RODO?**
Dane przetwarzane w UE, umowa powierzenia w standardzie, rozmowy anonimizowane do analityki. Szczegóły potwierdzimy na demo. *(Podstawa prawna do potwierdzenia z prawnikiem przed publikacją — rejestr: PLACEHOLDERS.md.)*

**Czy klienci wiedzą, że rozmawiają z AI?**
Tak — i dobrze. Bot się przedstawia, a klienci pytają śmielej niż człowieka. W każdej chwili mogą poprosić o kontakt z obsługą.

**Co się dzieje, gdy bot nie zna odpowiedzi?**
Mówi wprost, zbiera kontakt i przekazuje rozmowę ze streszczeniem do Twojego zespołu. A pytanie trafia do Radaru popytu — jeśli powtarza się często, wiesz, co dodać do oferty albo FAQ.

**Mam mały ruch. Czy to się opłaci?**
Policz w kalkulatorze wyżej. Zasada kciuka: jeśli masz ponad [5 tys.] wizyt miesięcznie albo choć jedną osobę odpisującą na maile klientów — tak.

**Czy mogę kontrolować, co bot mówi?**
Tak: ton, zakres tematów, zasady rabatowania, produkty wykluczone z rekomendacji. Wszystko w panelu, zmiany działają natychmiast.

---

## 10b. Nota od zespołu

*(Jedyny ludzki dowód do czasu prawdziwych case studies. Wyłącznie fakty potwierdzone przez klienta 2026-07-10: sklepy od 2017, ponad 40 pod opieką, podpis zespołowy. Zero zmyślonych liczb, opinii i historii.)*

**Label:** OD ZESPOŁU

**Treść:** Sklepy internetowe prowadzimy od 2017 roku — dziś ponad 40. Te same pytania, zwroty i wieczorne koszyki znamy z pierwszej ręki. HackMySales zbudowaliśmy, żeby sklep radził sobie z nimi sam — i żeby było widać, ile na tym zarabia.

**Podpis (mono):** — zespół Time4Ecommerce

---

## 11. CTA końcowe

**H2:** Zobacz tego sprzedawcę na swoich produktach.
**Lead:** Podaj adres sklepu — przygotujemy demo z Twoim katalogiem. 15 minut i zobaczysz, ile bot może u Ciebie zarobić. Bez zobowiązań.

Formularz: `Adres Twojego sklepu` (placeholder: twojsklep.pl) · `Twój e-mail` · przycisk `Umów demo`
**Pod formularzem:** Odpowiadamy w 1 dzień roboczy. Bez spamu, bez „sekwencji sprzedażowych”.

---

## 12. Stopka

Kolumny: **Produkt** (Czat AI, Wyszukiwarka, Rekomendacje, Panel przychodów) · **Zasoby** (Demo, Cennik, FAQ, Status systemu → portal) · **Firma** (O nas, Kontakt, Polityka prywatności, Regulamin)
Lockup logo + tagline: AI CHATBOT & RECOMMENDATIONS THAT INCREASE SALES
© [rok] HackMySales · Time4Ecommerce. Wszystkie prawa zastrzeżone.

---

## 13. Microcopy (formularze, stany)

- Walidacja URL: „To nie wygląda na adres sklepu — sprawdź literówkę.”
- Walidacja e-mail: „Ten e-mail wygląda na niepełny.”
- Wysyłka w toku (przycisk, disabled): „Wysyłamy…”
- Wysyłka OK: „Jest! Sprawdzimy Twój sklep i odezwiemy się w 1 dzień roboczy.”
- Błąd serwera: „Coś poszło nie tak po naszej stronie. Spróbuj za chwilę albo napisz: [kontakt@hackmysales.pl].”
- Cookie banner: „Używamy ciasteczek do analityki — tak jak Ty w swoim sklepie.” `Zgoda` / `Tylko niezbędne`
- 404: „Tej strony nie ma. Gdyby nasz bot tu pracował, zaproponowałby coś podobnego.” + link „Wróć na stronę główną”
- Skip link (a11y): „Przejdź do treści”
- Wskaźnik przewijania w hero: „Przewiń”

## 14. Słowa zakazane w całym serwisie

rewolucyjny, przełomowy, innowacyjny, magia/magiczny, odkryj moc, wynieś na wyższy poziom, supercharge, game-changer, ekosystem, synergia, „w dzisiejszych czasach”, „szybko zmieniający się świat”. Zero emoji. Zero wykrzykników (wyjątek: max 1 na stronę, w microcopy sukcesu).

### Rozszerzenie 2026-07-10 — tiki AI (struktury zakazane)

- symetryczne triady i wyliczanki retoryczne („szybko, prosto i bezpiecznie”; „dopyta, porówna, rozwieje”); wyliczenia FAKTÓW (dane, kroki, funkcje) są dozwolone,
- „To nie X. To Y.” — limit 1 na całą stronę; slot zajęty przez H2 „Czatbot z FAQ to nie handlowiec.”,
- „nie tylko… ale także”, „zarówno… jak i”,
- pytanie retoryczne jako otwarcie sekcji,
- trzy karty z tekstem identycznej długości,
- puenta na końcu każdego akapitu — gdy wszystkie bloki mają puentę, żadna nie działa,
- półpauza: max 1 na akapit.

### Rozszerzenie 2026-07-10 — słowa zakazane (dodatkowo)

kompleksowy, dedykowany, intuicyjny, płynnie, bezproblemowo, „warto zaznaczyć/podkreślić”, „co więcej”, szereg, „pozwala na”, „sprawia, że”, „dzięki czemu” (max 1× na stronę), „w erze AI”, potencjał, optymalizować, usprawnić, „idealne rozwiązanie”.

### Normy gęstości (benchmark Linear/Resend/Stripe — pełny research: `content/voc.md`)

Blok body: 15–25 słów (twardy limit 35, powyżej tylko z twardą liczbą). Nagłówek roboczy: 3–6 słów. Jedna myśl = jeden blok. Test wymiany: frazę, którą Tidio/Smartsupp/edrone mogliby wkleić u siebie — wymieniamy (mapa frazesów w voc.md §2).

## 15. Changelog copy

- **2026-07-10 · §10b Nota od zespołu (NOWA) + trust bar** — strona nie miała żadnego ludzkiego dowodu (case studies uczciwie ukryte); nota = 3 zdania na faktach od klienta (od 2017, 40+ sklepów), podpis „— zespół Time4Ecommerce”; trust bar pod hero dostaje te same fakty (sama nazwa firmy nie była dowodem dla obcego). Blok 39 słów — świadomie ponad normę 25: to jedyne miejsce z osobistym głosem, 3 krótkie zdania.
- **2026-07-10 · §2 Problem + §11 CTA końcowe** — label „DLACZEGO TO MA ZNACZENIE” → „CO CIĘ TO KOSZTUJE” (meta-etykieta landingowa → pieniądze); karta 98%: bez „Większość… tylko dlatego” (nieweryfikowalna teza o większości, 21→16 słów); H2 finału „Zobacz go…” → „Zobacz tego sprzedawcę na swoich produktach.” (wiszący zaimek out, domyka klamrę z H1); lead finału bez triady „15 minut rozmowy, konkretne liczby, zero zobowiązań” → konkret „ile bot może u Ciebie zarobić”; FAQ RODO zsynchronizowane z pl.ts.
- **2026-07-10 · §5 Wdrożenie + §7 Integracje** — krok 2 bez „nie zmyśla” (3× na stronie → 2×: Zaufanie + FAQ); dopisek bez „Bez zmiany platformy” (dubel z mikrodowodem hero); H2 Integracji „Działa tam, gdzie sprzedajesz.” → „Twoja platforma jest na liście.” (kolizja dwóch „Działa … gdzie” z Branżami; konkret nad logotypami).
- **2026-07-10 · §1 Hero** — CTA secondary „Porozmawiaj z botem” → „Zobacz, jak sprzedaje” (demo jest oskryptowane — rozmowy nie będzie; uczciwość + obietnica dowodu). H1, lead, scenariusze czatu i mikrodowód bez zmian (chronione).
- **2026-07-10 · §6 Wyniki + kalkulator** — kolejność bloków: kalkulator na przód (H2 „Nie wierz nam. Policz.” ma prowadzić do rachunku, nie do placeholderów); nagłówek kalkulatora „Ile zostawiasz na stole?” → „Ile Ci ucieka co miesiąc?” (kalka EN out, czasownik z leksykonu VoC; pytanie funkcjonalne nad polami, nie retoryczny opener — sekcję otwiera H2); „Realny potencjał” → „Do odzyskania” (banlista: „potencjał”; spójna metafora ucieka→odzyskać); licznik 24/7 bez drugiego żartu o śnie (H1 jest właścicielem tego chwytu); nowy podpis pod licznikami — uczciwość makiety + hak na demo.
- **2026-07-10 · §3 Filary** — Filar 1: 45 słów → 23 („Nie skrypt.” out — jedna negacja wystarczy; wyliczenie 5 pozycji → „katalog, stany i ceny”; „jak najlepszy sprzedawca na sali” out — chwyt „handlowca” zostaje w hero i tytule filaru; triada „Dopyta, porówna, rozwieje…” out, kask zostaje jako jedyny konkret). Filar 2: 37 → 26 (meta-wyliczenie „literówki, odmiana…” out — cytat klienta już to POKAZUJE). Filar 3: 32 → 24 (mini-triada „na karcie, w koszyku i w rozmowie” out — „Twoja księgowa zauważy różnicę.” zamyka bez rozbiegu).
- **2026-07-10 · §4 Kopalnie złota** — label „NIE KOLEJNY CZATBOT” → „KOPALNIE ZŁOTA” i nowy H2 „Sprzedawca to dopiero początek.” (dubel kontrastu czatbotowego z §4b — slot należy do „Czatbot z FAQ to nie handlowiec.”). Radar/Ratownik/Autopilot/Raport skrócone ze ścian ~40 słów do ≤27: triady i pytania retoryczne wycięte, „pieniądze leżące na stole” usunięte (kalka EN + dubel z kalkulatorem §6), karta Raportu bez własnych liczb (jedno źródło liczb: e-mail obok) i bez kawy (kawa zostaje w §5b). Panel przychodów: jeden kontrast zamiast dwóch. Cel: gęstość 15–25 słów, zero tików AI, korzyść właściciela w każdej karcie.
