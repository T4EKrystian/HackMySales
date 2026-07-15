# POPRAWKI — brief dla Claude Code

Audyt strony `localhost:5343` (desktop 1512 + widok mobilny), sekcja po sekcji.
Poprzeczka: **poziom Apple / boutique studio** — nic nie może wyglądać „domyślnie", tanio ani jak wygenerowane.
Autor uwag: przegląd wizualny na żywo + czytanie kodu. Ścieżki plików i klasy są realne (sprawdzone).

> Zasady pracy (z `CLAUDE.md`): tokeny only (żadnych hex/px w komponentach), acid max 2× na viewport na papierze,
> zero blue/fiolet, Fraunces italic max 3× na stronę, każda animacja transform/opacity + `prefers-reduced-motion`,
> **jeden** orkiestrowany moment na stronę. **Nie przechodź STOP-GATE bez „GO".**
> **Nie ogłaszaj, że gotowe, bez `npm run shoot` (390/768/1440) i porównania z `design/CHECKLIST.md`.**

---

## Skills do użycia (wywołaj je, nie zgaduj)

- **`design:design-critique`** — puść na zestawie `design/shots/` po każdej większej zmianie; to ma być pętla, nie jednorazowo.
- **`design:design-system`** — przy dotykaniu `frame-l2`, cieni, tokenów i skinów czatu (spójność, nazewnictwo, brak twardych wartości).
- **`design:accessibility-review`** — kontrast (jasne „×" w Comparison, `text-mute` na papierze), focus-visible, cele dotykowe ≥44 px, log czatu dla SR.
- **`design:ux-copy`** — mikrocopy: placeholdery inputów czatu, stany puste, etykiety CTA, „Wyświetlone / dostarczono".

Kolejność: krytyczne bugi → globalne → chat authenticity → sekcja po sekcji → przejścia → QA (`shoot` + critique + a11y).

---

## TL;DR — 5 największych dźwigni

1. **Czaty renderują się PUSTE.** Cała treść bąbli jest ukryta (`.js .chat-step .chat-msg{opacity:0}`) do momentu, aż GSAP odsłoni ją powoli. Przy scrollu widać puste kremowe pudła (Hero, Pillars „01 CZAT", Kanały). To zabija „wow". → Sekcja **P0** + **CHAT**.
2. **Hero: H1 za duży, czat poza ekranem.** `--text-hero` sięga ~100 px; nagłówek zjada cały viewport, czat ląduje pod foldem i dodatkowo jest pusty na starcie. → **P0**.
3. **NightShift (ciemna sekcja „CZAT AI · NOC") się rozjeżdża** — w trakcie pinu nagłówek „Kiedy spałeś, bot…", zdublowane „6 840 zł" i podpisy statów nachodzą na siebie. Wygląda jak zbugowana strona. → **P0**.
4. **Chat ma wyglądać jak Messenger/IG** — dziś to minimalistyczne kremowe okna z monospace „CZAT". Brakuje anatomii prawdziwego komunikatora (ogonki, grupowanie, timestampy, „dostarczono/wyświetlone", pasek inputu, realny nagłówek). → **CHAT**.
5. **Wykończenie „tandetne": `frame-l2` = border + inset-highlight + cień naraz** (skeuomorficzna ramka), krata w newsletterze, przycięty napis w stopce, nierówny rytm sekcji, twarde cięcia jasne→ciemne. → **P1**.

---

## P0 — bugi krytyczne (najpierw to)

### P0.1 — Czaty renderują się puste
**Gdzie:** `app/globals.css` (~l. 220: `.js .js-reveal, … .js .chat-step, .js .chat-step .chat-msg { opacity: 0 }`), silnik `components/chat/useChatPlayback.ts`, powłoka `components/chat/ChatShell.tsx`.
**Co się dzieje:** treść czatu jest zasłonięta do czasu playbacku; playback rusza dopiero `scrollTrigger start: "top 72%"`, a bąble wchodzą powoli (typing dots 600–900 ms + hold do 1,8 s/krok). Efekt: przy normalnym scrollu okna są PUSTE albo w połowie puste. W hero dochodzi brama intro (`waitForIntro` → `whenIntroDone` + 0,4 s), więc na 1. renderze czat jest kompletnie pusty.
**Fix (do decyzji z autorem — patrz STOP-GATE w sekcji CHAT):**
- Żadne okno czatu widoczne w viewport nie może być kiedykolwiek puste. Minimum: pierwsza wymiana (pytanie klienta + odpowiedź Magdy) **wyrenderowana od razu** (statycznie), a playback dokleja resztę na żywo.
- Skróć/uodpornij wyzwalacz: `start: "top 72%"` → wcześniej (np. `"top 90%"`), a dla czatów „drugoplanowych" (Pillars, ForWho) rozważ `mode="static"` z subtelnym fade zamiast pełnego pisania.
- Hero: skróć bramę intro; pokaż od razu 1–2 bąble, resztę dopisz. Cel: pełny, „żywy" czat < 1 s od wejścia.

### P0.2 — Hero: nagłówek za duży, czat pod foldem i pusty
**Gdzie:** `components/sections/Hero.tsx`, token `--text-hero` w `design/tokens.css` (`clamp(3rem, 6.6vw, 6.25rem)`), `components/sections/ChatDemo.tsx` (`min-h-[476px] max-h-[556px]`, `pt-[112px]`).
**Problem:** przy 1440 H1 ma ~100 px i 4 linie (z serifową „Twoja") → zajmuje cały ekran, prawa kolumna (czat) schodzi pod fold. Autor wprost: „teksty po lewej za duże; hero-chat ma się cały wyświetlać na 1. renderze".
**Fix:**
- Zmniejsz `--text-hero` (cap ~`4.75–5.25rem`, dostrój `vw`) tak, by dwukolumnowy hero mieścił się w `100svh` z widocznym całym oknem czatu.
- Zredukuj `pt-[112px]`/`pb`, `min-h-svh` i wewnętrzne `gap`/`py` hero, aby lewa kolumna i czat były zbalansowane.
- Prawa kolumna: dwukolumnowość jest dopiero od `lg:` (`grid-cols-[58fr_42fr]`) — sprawdź 1024–1280, żeby czat nie lądował pod tekstem.
- `.hero-demo` startuje z `opacity:0` do intro — zsynchronizuj z P0.1, żeby panel nie „mrugał" pusty.

### P0.3 — NightShift się rozjeżdża (nachodzące elementy w pinie)
**Gdzie:** `components/sections/NightShift.tsx` (+ jego ScrollTrigger/pin, motion w `lib/motion` / `design/motion.md`).
**Problem:** podczas przewijania pinowanej sceny nagłówek „Kiedy spałeś, bot…", dwie kopie „6 840 zł" i podpisy „ROZMOWY OBSŁUŻONE / TICKETÓW MNIEJ" nakładają się na zegar i listę zdarzeń — wizualny chaos, tło jednocześnie przechodzi ciemny→szałwiowy w połowie stanu.
**Fix:** uporządkuj timeline pinu — elementy wchodzą/wychodzą rozłącznie (żadnego nakładania faz), stan tła zmienia się zdecydowanie (nie „w połowie"), a przy `prefers-reduced-motion` scena degraduje do czytelnego statycznego układu. To jest „ten jeden" moment scroll-theatre strony — musi być bezbłędny.

---

## P1 — globalne wykończenie

### P1.1 — `frame-l2`: za dużo naraz (efekt „tandety")
**Gdzie:** `app/globals.css` `@utility frame-l2` (`border 1px var(--stroke-2)` + `box-shadow: var(--highlight-top), var(--shadow-l2)`), `--highlight-top: inset 0 1px 0 rgb(255 255 255 /.6)`, `--stroke-2: rgb(16 22 19 /.18)`.
**Problem:** obrys + wewnętrzny biały highlight + cień float razem = skeuomorficzna „ramka urządzenia". Na pustych oknach czatu wygląda to tanio (autor: „cień z połączeniem bordera wygląda tandetnie/akichowato").
**Fix:** jeden spokojny efekt zamiast trzech. Zostaw hairline **albo** delikatny cień — nie oba w pełnej sile; usuń/wytłum `--highlight-top`. Trzymaj się zasady „minimum cieni". Zweryfikuj `design-system`, żeby zmiana była tokenowa i spójna wszędzie, gdzie używane jest `frame-l2` (czat, karty, panele).

### P1.2 — Rytm i „oddech" sekcji
**Problem:** nierówne, wielkie pionowe dziury (np. Cennik→FAQ, nagłówek→karta w MorningPanel/Pricing, cała sekcja Problem to głównie pustka). Strona „nie łączy się" — sekcje wiszą osobno.
**Fix:** ujednolić `section-pad` / rytm 8pt, skrócić martwe przestrzenie, spiąć nagłówek z treścią sekcji (wspólny reveal, mniejszy odstęp). Cel: płynne „prowadzenie" oka w dół.

### P1.3 — Przejścia jasne↔ciemne
**Problem:** twarde cięcia z papieru w las (Nav wjeżdża jasnym pasmem w ciemne FinalCta; NightShift startuje nagłym ciemnym blokiem). Brak „tkanki łączącej".
**Fix:** mostki między pasmami (subtelny gradient/anchor koloru na styku, wspólny ruch przy wejściu). Bez nowych „teatrów" — zgodnie z regułą „jeden moment na stronę".

### P1.4 — Krata w newsletterze (wprost zgłoszone)
**Gdzie:** `components/sections/FinalCta.tsx` — `<HeroGridTexture onForest />` (def. w `components/ui/kit.tsx`) rysuje siatkę cienkich linii; jest też `noise-forest`.
**Fix:** **usuń `<HeroGridTexture onForest />`** z FinalCta (kratka wygląda jak dev-template/graph-paper). Rozważ zostawienie samego, bardzo subtelnego `noise-forest`. Przy okazji pole `input` (`.field`, `border` na `bg-forest-900`) — uprościć, żeby nie robiło border+cień jak w P1.1.

### P1.5 — Napis w stopce przycięty
**Gdzie:** `components/sections/Footer.tsx` — gigantyczny znak wodny „HackMySa…" ucięty z obu stron, wygląda jak błąd overflow.
**Fix:** albo zmieścić całe słowo, albo świadomie zamaskować (fade po bokach) tak, żeby czytało się jako celowy zabieg, nie ucięcie.

---

## CHAT = Messenger / Instagram (priorytet autora)

> Cel: „coś, co ludzie znają". Dziś czaty to minimalistyczne kremowe okna z monospace „CZAT/WYSZUKIWARKA" i pustym wnętrzem. Brakuje anatomii prawdziwego komunikatora oraz — przede wszystkim — treści (patrz P0.1).

**Pliki:** `components/chat/skins.ts` (skiny onsite/messenger/instagram/email/legacy), `components/chat/parts.tsx` (avatar, PersonaRow, TypingDots, ReadReceipt, DayDivider, karta produktu, InputTools), `components/chat/ChatShell.tsx`, `components/sections/Channels.tsx` (przełączanie skinów + morph Flip).

### Anatomia „prawdziwego" czatu — checklist do dociągnięcia
- **Nagłówek jak w apce:** avatar (jest), imię „Magda", status `online · odpowiada w ~1 min` (jest) — dołóż subtelny back-chevron/⋯ jak w realnym oknie, żeby ramka czytała się jako komunikator, nie widget.
- **Grupowanie i ogonki:** kolejne bąble tej samej strony bez avatara, ogonek tylko przy ostatnim (Messenger). Dziś `messenger` ma „pełne zaokrąglenia bez ogonków" — dla rozpoznawalności rozważ ogonek (`rounded-br-md`/`bl-md`) na ostatnim bąblu wątku.
- **Timestampy i statusy:** godzina przy grupie + **„Dostarczono/Wyświetlone"** pod ostatnim bąblem klienta (dziś `receipt` tylko w messenger). To najmocniej sprzedaje realizm.
- **Typing dots** (są) — upewnij się, że są *przed* odpowiedzią i znikają płynnie; nie pokazuj gotowej odpowiedzi równocześnie z pisaniem.
- **Pasek inputu** jak w komunikatorze: pole „Napisz wiadomość…", ikony aparat/＋/emoji/mikrofon, „wyślij". Dziś `InputTools` ma tylko camera/plus — dołóż realizmu (bez emoji jako ikon — inline SVG 1.5px).
- **Dzień/separator** „Dzisiaj" (jest) + subtelne tła zależne od kanału.
- **Ruch:** wejście bąbla lekki spring (jest), scroll trzyma dół (jest). Dopracuj tempo, by pierwsza wymiana pojawiła się szybko.

### Skiny per kanał (Kanały / „Jeden bot. Sklep, Messenger, Instagram")
- Zadbaj, by **przełączenie taba realnie zmieniało sylwetkę**: Sklep www (onsite, ciepły), Messenger (bąble + „wyświetlone" + pasek inputu), Instagram (pigułki + ring avatara + „reply quote" nad odpowiedzią), E-mail (nagłówek Od/Temat). Różnice mają być czytelne na pierwszy rzut oka.
- Okrąg „JEDNA MAGDA" ze strzałką wygląda clip-artowo, a 4 pigułki kanałów to duże puste paski — dociśnij kompozycję (mniej pustki, realne mini-ikony kanałów w stylu 1.5px SVG).

### Kolor bąbli — DECYZJA PODJĘTA: wariant A ✅
Autor wybrał **A: forma, nie kolor.** Trzymamy paletę brandu (leśny/papier, `--blue-*` = leśny), **zero blue/fiolet**.
Realizm Messenger/IG budujemy **wyłącznie formą/mikrostrukturą** (ogonki, „dostarczono/wyświetlone", timestampy, pasek inputu, grupowanie bąbli, ring avatara IG, reply-quote) — **nie** kolorem kanału.
Nie wprowadzaj niebieskiego/gradientu IG do bąbli. Wariant B (kolory kanału) odrzucony.

---

## Sekcja po sekcji

**Nav** (`components/sections/Nav.tsx`) — OK; popraw styk sticky-nav z ciemnymi pasmami (jasne pasmo tnie las twardo). Rozważ zmianę tła nav nad ciemną sekcją.

**Hero** (`Hero.tsx` / `ChatDemo.tsx` / `HeroChatMobile.tsx`) — P0.2 + P0.1. Po zmniejszeniu H1 zweryfikuj, że `Wypróbuj za darmo` + „Zobacz, jak sprzedaje" i proof mieszczą się nad foldem razem z czatem.

**ProofTicker + pasek zaufania** (`components/sections/ProofTicker.tsx`) — marquee timestampów wchodzi na linię „Zbudowane przez zespół Time4Ecommerce…" i logotypy platform (Shoper/IdoSell/PrestaShop/WooCommerce/Shopify/Magento) łamią się do 2 rzędów z **samotnym Magento**. Fix: jeden spójny rząd/zbalansowana siatka, jednolita waga/opacity logo, oddzielić marquee od paska zaufania (odstęp/tło), żeby się nie zlewały.

**Problem** (`components/sections/Problem.tsx`) — reveal słowo-po-słowie „…dostaje ciszę." jest OK, ale sekcja to głównie pustka i wisi w oderwaniu. Skróć pion, spnij z sąsiadami (P1.2).

**Pillars — „01 Czat / 02 Wyszukiwarka / 03 Rekomendacje"** (`components/sections/Pillars.tsx`) — makieta **„01 CZAT" renderuje się PUSTA** (pudło z „CZAT" i 3 kropkami, zero treści) — sztandarowy przypadek P0.1. „02 Wyszukiwarka" pisze zapytanie, ale wyniki to szare placeholdery; „03 Rekomendacje" OK. Fix: każda makieta ma pokazywać treść bez czekania na powolny playback; miniatury produktów (dziś szare bloby) — realne zdjęcia/`ProductVisual`.

**GoldMines — „Sprzedawca to dopiero początek / KOPALNIE ZŁOTA"** (`components/sections/GoldMines.tsx`) — Panel przychodów / Radar popytu / Ratownik koszyka / Autopilot paczka / dobór rozmiaru / Raport nocnej zmiany. „Panel przychodów" ma kartę-w-karcie (border-in-border) → spłaszczyć. Karty „Ratownik" i „Raport" wchodzą tak wolno, że łapie się je puste — przyspiesz/odsłoń wcześniej. Liczby licznika spójne z copy (widziałem 34 271 / 41 910 przy „47 218 zł" w tekście — dociągnij do wspólnej wartości).

**Comparison — „RÓŻNICA — Czatbot z FAQ to nie handlowiec"** (`components/sections/Comparison.tsx`) — „×" po lewej są bardzo jasne (słaby kontrast — a11y). Fix: czytelniejsze „×", wyraźniejszy podział kolumn ZWYKŁY↔HACKMYSALES. Reszta OK.

**Channels — „Jeden bot. Sklep, Messenger, Instagram."** (`components/sections/Channels.tsx`) — okno „Magda" **puste** przy scrollu (P0.1); pigułki kanałów za puste; okrąg „JEDNA MAGDA" clip-artowy. To główna scena „multichannel" → patrz CHAT.

**ForWho — „BRANŻE — Działa wszędzie tam, gdzie klient pyta."** (`components/sections/ForWho.tsx`) — czat tu **się wypełnia** („Mam sześć trafień…"), ale wolno; pigułki branż OK. Ujednolić tempo z resztą.

**HowItWorks — „WDROŻENIE — Trzy kroki. Zero developera."** (`components/sections/HowItWorks.tsx`) — dobra sekcja (snippet `<script…>`, checklist KATALOG·STANY·CENY, mini-mail „2 340 zł"). Zostaw, tylko rytm.

**NightShift — „CZAT AI · NOC"** (`components/sections/NightShift.tsx`) — P0.3 (nakładające się elementy). Po naprawie: to ma być najładniejszy moment strony.

**MorningPanel — „PANEL — Poranek z HackMySales"** (`components/sections/MorningPanel.tsx`) — dashboard OK; kolumny metryk rozdzielone pionami wyglądają arkuszowo — złagodź; duża pustka nad kartą panelu (P1.2).

**Results — „+14% / +17% / −48% / 24-7"** (`components/sections/Results.tsx`) — OK. Karty w obrysach — sprawdź spójność z P1.1.

**Integrations — „Twoja platforma jest na liście."** (`components/sections/Integrations.tsx`) — marquee logo + wyszukiwarka platformy. OK; jednolita waga logotypów.

**Trust — „BEZPIECZEŃSTWO — Ty ustalasz, co bot mówi."** (`components/sections/Trust.tsx`) — dobra sekcja (toggle Formalny/Luźny, „Przekazanie do człowieka", „Nie zmyśla — ZABLOKOWANE"). Zostaw.

**Pricing — „CENNIK — Prosty rachunek."** (`components/sections/Pricing.tsx`) — czysty 3-planowy układ (Start/Growth „najczęściej wybierany"/Scale), toggle Miesięcznie/Rocznie −20%. Zostaw; skróć dziurę Cennik→FAQ.

**Faq — „Pytania, które i tak chciałeś zadać."** (`components/sections/Faq.tsx`) — akordeon OK.

**FinalCta / newsletter** (`components/sections/FinalCta.tsx`) — P1.4 (usuń kratę) + input bez border+cień; złagodź styk z jasnym nav.

**Footer** (`components/sections/Footer.tsx`) — P1.5 (przycięty znak wodny). Kolumny linków OK.

---

## Kolejność prac (proponowana)

1. **P0.1** (czaty puste) + **P0.2** (hero) — razem, bo hero to najgorszy przypadek pustego czatu.
2. **P0.3** (NightShift).
3. **CHAT** — anatomia Messenger/IG (po decyzji A/B STOP-GATE).
4. **P1.1** frame-l2 → **P1.4** krata → **P1.5** stopka → **P1.2/P1.3** rytm i przejścia.
5. Drobne per-sekcja (ProofTicker logo, Comparison „×", GoldMines karta-w-karcie, miniatury produktów).
6. **QA:** `npm run shoot` (390/768/1440) → przeczytać shoty → `design:design-critique` + `design:accessibility-review` → porównać z `design/CHECKLIST.md`.

## Definition of done
- Żadne okno czatu nie jest nigdy widocznie puste; hero-chat pełny < 1 s, cały nad foldem.
- H1 hero zmniejszony; dwukolumnowy hero mieści się w ekranie.
- NightShift bez nakładania; czysta degradacja w reduced-motion.
- Krata z newslettera usunięta; `frame-l2` spokojny (jeden efekt); stopka niecięta.
- Rytm sekcji ujednolicony; przejścia jasne↔ciemne złagodzone.
- `shoot` + `design-critique` + `accessibility-review` przejrzane; zgodność z `CLAUDE.md` (tokeny, acid ≤2×, **zero blue/fiolet** — wariant A, reduced-motion).
