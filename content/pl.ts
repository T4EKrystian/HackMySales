/** Słownik PL — treści 1:1 z content/copy-pl.md, przepuszczone przez plNbsp (sierotki, nbsp).
 *  Komponenty biorą stringi WYŁĄCZNIE stąd. Struktura gotowa pod przyszłe content/en.ts.
 *  TRYB MAKIETY: liczby demo renderują się bez nawiasów; co podmienić przed
 *  produkcją śledzi PLACEHOLDERS.md (w decku nawiasy zostają jako oznaczenie edytorskie). */

import { deepNbsp } from "@/lib/typography";

const raw = {
  nav: {
    links: [
      { label: "Produkt", href: "#produkt" },
      { label: "Funkcje", href: "#funkcje" },
      { label: "Wyniki", href: "#wyniki" },
      { label: "Cennik", href: "#cennik" },
      { label: "FAQ", href: "#faq" },
    ],
    login: "Zaloguj się",
    // [PLACEHOLDER] docelowy adres portalu klienta
    loginHref: "https://portal.185-238-74-109.nip.io/portal/login",
    cta: "Umów demo",
    menuOpen: "Otwórz menu",
    menuClose: "Zamknij menu",
  },

  hero: {
    eyebrow: "CZAT AI · WYSZUKIWARKA · REKOMENDACJE",
    h1Line1: "Sprzedawca,",
    h1Line2: "który nigdy nie śpi.",
    lead: "HackMySales podpina się do Twojego sklepu i doradza klientom jak najlepszy handlowiec — w czacie, w wyszukiwarce i w rekomendacjach. A co poniedziałek pokazuje, ile na tym zarobiłeś. Co do złotówki.",
    ctaPrimary: "Umów demo na swoich produktach",
    ctaSecondary: "Porozmawiaj z botem",
    scrollCue: "Przewiń",
    proof: "Wdrożenie w 1 dzień · Bez zmiany platformy · 14 dni testów za darmo",
    chat: {
      title: "HackMySales — doradca",
      status: "online",
      scenarios: [
        {
          key: "doradztwo",
          label: "Doradztwo",
          badge: "Zamówienie #8412 — 399 zł · przypisane do rozmowy",
          steps: [
            { role: "user" as const, text: "Szukam butów do biegania po lesie, rozmiar 44, do 400 zł" },
            {
              role: "bot" as const,
              text: "Mam trzy trafienia. Najczęściej wybierane:",
              card: {
                initials: "XT",
                name: "X-Trail 2 GTX",
                tags: "wodoodporne · rozmiar 44 na stanie",
                price: "379 zł",
                meta: "Wysyłka dziś do 15:00",
              },
              after: "Pokazać pozostałe dwa?",
            },
            { role: "user" as const, text: "A coś pod kostkę?" },
            {
              role: "bot" as const,
              text: "Jasne — jest wersja za kostkę:",
              card: {
                initials: "XM",
                name: "X-Trail Mid",
                tags: "za kostkę · membrana",
                price: "399 zł",
                meta: "Cholewka wypada mało — przy 44 klienci często brali 44,5",
              },
              after: "Dodać do koszyka?",
            },
          ],
        },
        {
          key: "rozmiar",
          label: "Rozmiar",
          badge: "Rozmiar dobrany: L · mniejsze ryzyko zwrotu",
          steps: [
            { role: "user" as const, text: "Ta kurtka w M czy L? Mam 178 cm i 82 kg" },
            {
              role: "bot" as const,
              text: "Przy 178 cm / 82 kg ten model wypada mało — z historii zwrotów: klienci o Twoich wymiarach zostawiali L, a M wracało częściej. Proponuję:",
              card: {
                initials: "3L",
                name: "Kurtka 3L Shell — L",
                tags: "membrana 3-warstwowa · L na stanie",
                price: "449 zł",
                meta: "M wypada mało wg zwrotów",
              },
              after: "Biorę?",
            },
          ],
        },
        {
          key: "paczka",
          label: "Paczka",
          badge: "Obsłużone bez człowieka · 0 min czekania",
          steps: [
            { role: "user" as const, text: "gdzie moje zamowienie? #8203" },
            {
              role: "bot" as const,
              text: "Paczka #8203 wyjechała dziś o 7:40 z sortowni. Kurier planuje doręczenie jutro w oknie 10:00–14:00. Podesłać link do śledzenia?",
            },
            { role: "user" as const, text: "a moge zmienic na paczkomat?" },
            {
              role: "bot" as const,
              text: "Jasne — przekierowałem do punktu przy Twojej ulicy. Potwierdzenie poszło na e-mail.",
            },
          ],
        },
      ],
      replay: "Odtwórz jeszcze raz",
      inputPlaceholder: "Napisz wiadomość…",
      inputTooltip:
        "W wersji demo scenariusz jest oskryptowany — na Twoim sklepie bot odpowiada naprawdę. Umów demo.",
    },
  },

  trustBar: {
    line: "Zbudowane przez zespół Time4Ecommerce. Działa z:",
    platforms: ["Shoper", "IdoSell", "PrestaShop", "WooCommerce", "Shopify", "Magento"],
  },

  problem: {
    label: "DLACZEGO TO MA ZNACZENIE",
    h2: "Twój sklep traci klientów po cichu.",
    cards: [
      {
        value: 98,
        suffix: "%",
        text: "tylu odwiedzających wychodzi bez zakupu. Większość nie dlatego, że nie chce kupić — tylko dlatego, że nikt im nie pomógł wybrać.",
      },
      {
        value: 70,
        suffix: "%",
        text: "tyle pytań do obsługi to w kółko to samo: „gdzie moja paczka?”, „jaki rozmiar?”, „czy zdąży przed piątkiem?”.",
      },
      {
        value: 16,
        suffix: " godzin na dobę",
        text: "tyle czasu Twój sklep milczy, kiedy obsługa nie pracuje. Klienci kupują o 22:40. Pytają o 23:15. Odpowiedź dostają jutro — często już po zakupie u konkurencji.",
      },
    ],
    kicker:
      "W sklepie stacjonarnym klient, który stoi bezradnie między półkami, dostaje pomoc w minutę. W internecie dostaje ciszę.",
  },

  pillars: {
    label: "CO DOSTAJESZ",
    h2: "Jeden system. Trzy miejsca, w których zarabia.",
    items: [
      {
        title: "Czat, który doradza jak handlowiec",
        body: "Nie drzewko „wybierz 1, 2 lub 3”. AI zna cały katalog, stany i ceny — prowadzi klienta do koszyka, a do roweru dorzuci kask.",
      },
      {
        title: "Wyszukiwarka, która rozumie polski",
        body: "„cos cieplego dla 5latka na narty do 200zl” — klient pisze po swojemu, wyszukiwarka i tak wie, o co chodzi. Koniec z „brak wyników” przy pełnym magazynie.",
      },
      {
        title: "Rekomendacje z głową do interesów",
        body: "Podpowiada to, co klient naprawdę chce kupić — a kiedy kilka produktów pasuje tak samo, promuje ten z lepszą marżą. Twoja księgowa zauważy różnicę.",
      },
    ],
    // Panele demo (żywe UI — treści robocze interfejsu, nie copy marketingowe)
    demo: {
      chat: {
        user: "Wybieram między tymi dwoma rowerami — który pod dojazdy do pracy?",
        bot: "Do miasta lepszy będzie M-City: pozycja wyprostowana, błotniki i bagażnik w zestawie. Dorzucić zapięcie U-lock (−15% w zestawie)?",
      },
      search: {
        query: "cos cieplego dla 5latka na narty do 200zl",
        chips: ["ciepłe", "dziecięce · ok. 5 lat", "narty", "do 200 zł"],
        results: [
          { name: "Kurtka narciarska Kids 110–116", price: "189 zł" },
          { name: "Spodnie ocieplane Junior", price: "159 zł" },
          { name: "Komplet termoaktywny 104–116", price: "99 zł" },
        ],
        note: "Intencja rozpoznana mimo literówek i odmiany",
      },
      reco: {
        context: "Klient ogląda: Rower górski M29",
        sliderLeft: "trafność",
        sliderRight: "marża",
        items: [
          { name: "Kask MTB Ridge", price: "219 zł", note: "dopasowany", highlight: false },
          { name: "Kask MTB Core", price: "189 zł", note: "dopasowany · lepsza marża", highlight: true },
        ],
      },
    },
  },

  comparison: {
    label: "RÓŻNICA",
    h2: "Czatbot z FAQ to nie handlowiec.",
    colLeft: "Zwykły czatbot",
    colRight: "HackMySales",
    rows: [
      { left: "Odpowiada na pytania z listy", right: "Zna cały katalog i stany na żywo" },
      { left: "„Przepraszam, nie rozumiem”", right: "Rozumie literówki i polską odmianę" },
      { left: "Raportuje liczbę rozmów", right: "Raportuje przychód co do złotówki" },
      { left: "Milczy, gdy klient wychodzi", right: "Ratuje koszyk, zanim zniknie" },
      { left: "Wymaga ręcznie pisanych scenariuszy", right: "Uczy się z każdej rozmowy i zwrotu" },
      { left: "Kończy rozmowę na „napisz do nas”", right: "Kończy na „dodać do koszyka?”" },
    ],
    footer: "Różnicę widzisz w panelu, nie w obietnicach.",
  },

  forWho: {
    label: "BRANŻE",
    h2: "Działa wszędzie tam, gdzie klient pyta.",
    segments: [
      {
        key: "moda",
        label: "Moda i obuwie",
        pain: "Największy koszt: zwroty złych rozmiarów.",
        user: "Sukienka na wesele, rozmiar 38, do 300 zł",
        bot: "Mam sześć trafień. Uwaga: ten model wypada duży — przy Twoich wymiarach lepiej zagra 36. Pokazać oba warianty?",
        chip: "−30% zwrotów rozmiarowych",
      },
      {
        key: "dom",
        label: "Dom i ogród",
        pain: "Klient nie kupuje jednej płytki — kompletuje projekt.",
        user: "Urządzam łazienkę 4 m², szary mat",
        bot: "Proponuję komplet: płytki 60×60, fuga, hydroizolacja i listwy — 8 pozycji, wszystko z jednej partii. Wrzucić całość do koszyka?",
        chip: "+38% wartości koszyka",
      },
      {
        key: "elektronika",
        label: "Elektronika",
        pain: "Połowa pytań to „czy to zadziała z moim…”.",
        user: "czy ta karta graficzna wejdzie do mojego zestawu?",
        bot: "Tak — Twój zasilacz 650 W wystarczy, a obudowa zmieści kartę o długości 310 mm. Dorzucić przewód 2×8-pin?",
        chip: "−50% pytań „czy kompatybilne”",
      },
      {
        key: "b2b",
        label: "B2B i hurt",
        pain: "Zapytania ofertowe przychodzą po godzinach.",
        user: "potrzebuje 40 szt z logo, termin 2 tygodnie",
        bot: "Przy 40 szt. rabat hurtowy 12%. Zostaw NIP i plik z logo — rano wycena będzie u Ciebie w skrzynce.",
        chip: "leady zebrane, zanim wstałeś",
      },
    ],
    caption: "Przykładowe rozmowy i cele — konkretne liczby dla Twojej branży policzymy na demo.",
  },

  goldMines: {
    label: "KOPALNIE ZŁOTA",
    h2: "Sprzedawca to dopiero początek.",
    revenue: {
      title: "Panel przychodów",
      body: "Każda rozmowa spięta z zamówieniem: bot zarobił w tym miesiącu 47 218 zł. Widzisz kasę, nie wykres „zaangażowania”.",
      panelTitle: "Przychód z rozmów — ten miesiąc",
      panelAmount: 47218,
      panelCaption: "przypisane do zamówień · dane demo",
      bars: [34, 52, 41, 68, 57, 82, 74],
    },
    radar: {
      title: "Radar popytu",
      body: "Bot zapisuje każde „nie znalazłem” i każde pytanie bez odpowiedzi. Co tydzień dostajesz listę: czego klienci szukali, a czego nie masz — gotowe zamówienie do hurtowni.",
      rows: [
        { query: "rozmiar 46", count: "40 pytań" },
        { query: "wersja czarna", count: "15 pytań" },
        { query: "dostawa w sobotę", count: "28 pytań" },
      ],
    },
    cards: [
      {
        icon: "cart" as const,
        title: "Ratownik koszyka",
        body: "Kursor sunie do „zamknij kartę” — bot zagaduje w ostatniej chwili: odpowiedzią na wątpliwość albo kodem, wedle reguł, które ustawisz. Koszyk uratowany, zanim stał się „porzucony”.",
      },
      {
        icon: "ruler" as const,
        title: "Doradca rozmiaru",
        body: "„Mam 178 cm i 82 kg” — bot dobiera rozmiar z tabel producenta i historii zwrotów („ten model wypada mało”). Mniej zwrotów, mniej kurierów jeżdżących w obie strony za Twoje pieniądze.",
      },
      {
        icon: "package" as const,
        title: "Autopilot „gdzie moja paczka”",
        body: "Status zamówienia, link do śledzenia, zmiana adresu — klient załatwia wszystko w czacie, nikt z zespołu nie kiwa palcem. 70% zgłoszeń do BOK znika z dnia na dzień.",
      },
      {
        icon: "moon" as const,
        title: "Raport nocnej zmiany",
        body: "Co rano bot melduje się jak pracownik: ile rozmów, ile sprzedaży, co przekazał zespołowi. Przykład masz obok — tak wygląda poniedziałek 8:00.",
      },
    ],
    nightMail: {
      fromLabel: "Od",
      from: "HackMySales",
      subjectLabel: "Temat",
      subject: "Raport nocnej zmiany — poniedziałek 8:00",
      lines: [
        "W nocy obsłużyłem 34 rozmowy i sprzedałem za 6 840 zł.",
        "21 pytań o dostawę — odpowiedziałem sam.",
        "3 rozmowy przekazałem zespołowi, ze streszczeniami.",
        "Radar: 6 osób szukało „kurtki softshell 158”, której nie masz.",
      ],
      link: "Szczegóły w panelu",
    },
    ticker: {
      items: [
        "11:42 — klient pytał o rozmiar 46 (brak w ofercie)",
        "11:47 — 3 osoby szukały „kurtka softshell dziecięca”",
        "11:51 — pytanie o dostawę w sobotę",
        "12:09 — brak wyników: „buty trailowe gore-tex 47”",
        "12:16 — pytanie o raty 0%",
      ],
      caption: "Radar popytu na żywo · przykładowe dane demo",
    },
  },

  how: {
    label: "WDROŻENIE",
    h2: "Trzy kroki. Zero developera.",
    steps: [
      {
        title: "Podłączasz sklep",
        body: "wtyczka albo klucz API. 15 minut, klikasz, działa.",
      },
      {
        title: "AI uczy się Twojego biznesu",
        body: "katalog, stany, ceny, dostawy, zwroty, FAQ. Odpowiada wyłącznie na podstawie Twoich danych — nie zmyśla.",
      },
      {
        title: "Sprzedaje, a Ty czytasz raporty",
        body: "czat, wyszukiwarka i rekomendacje pracują 24/7. Ty dostajesz liczby i listę rzeczy do poprawy.",
      },
    ],
    note: "Bez zmiany platformy. Bez przebudowy sklepu. Pierwsze efekty widać w 7 dni.",
  },

  morning: {
    label: "PANEL",
    h2: "Poranek z HackMySales: kawa i jeden rzut oka.",
    lead: "To ten sam panel, który dostajesz w portalu klienta. Wszystko, co bot zrobił bez Ciebie — w jednym widoku.",
    kpis: [
      { label: "Przychód z rozmów — dziś", value: 2340, unit: "zł" },
      { label: "Rozmowy", value: 86, unit: "" },
      { label: "Uratowane koszyki", value: 7, unit: "" },
      { label: "Przekazane zespołowi", value: 2, unit: "" },
    ],
    chartTitle: "Przychód z rozmów — 14 dni",
    chartBars: [22, 35, 28, 44, 38, 52, 47, 60, 41, 56, 63, 58, 72, 68],
    convTitle: "Ostatnie rozmowy",
    conversations: [
      { time: "07:42", topic: "dobór rozmiaru — kurtka 3L", amount: "449 zł" },
      { time: "07:15", topic: "status paczki #8203", amount: "—" },
      { time: "06:58", topic: "kompletowanie łazienki", amount: "1 260 zł" },
    ],
    radarTitle: "Radar popytu — nowe",
    radarRows: [
      { q: "kurtka softshell 158", c: "6 pytań" },
      { q: "raty 0%", c: "4 pytania" },
    ],
    cta: "Zobacz pełny panel na demo",
    caption: "dane demo",
  },

  results: {
    label: "POLICZALNOŚĆ",
    h2: "Nie wierz nam. Policz.",
    counters: [
      { prefix: "+", value: 18, suffix: "%", label: "konwersji u klientów po 3 miesiącach" },
      { prefix: "+", value: 23, suffix: "%", label: "średniej wartości koszyka (AOV)" },
      { prefix: "−", value: 64, suffix: "%", label: "zapytań „gdzie moja paczka” do obsługi" },
      { static: "24/7", label: "godziny pracy czatu, wyszukiwarki i rekomendacji" },
    ],
    countersCaption: "Wartości poglądowe. Twoje liczby policzymy na demo.",
    night: {
      title: "Kiedy spałeś, bot…",
      stats: [
        { value: 34, unit: "", label: "rozmowy obsłużone" },
        { value: 6840, unit: "zł", label: "sprzedaż w nocy" },
        { value: 21, unit: "", label: "ticketów mniej" },
      ],
      caption: "przykładowa noc · dane demo",
    },
    calc: {
      heading: "Ile Ci ucieka co miesiąc?",
      fields: {
        visits: "Odwiedziny miesięcznie",
        aov: "Średni koszyk (zł)",
        conv: "Konwersja (%)",
      },
      resultIntro:
        "Przy tych liczbach HackMySales musi podnieść konwersję tylko o 0,2 p.p., żeby zarobić na siebie. Do odzyskania przy Twoim ruchu:",
      resultSuffix: "miesięcznie",
      assumptionsTitle: "Założenia szacunku",
      assumptions:
        "+0,5 p.p. konwersji i +10% AOV — wartości poglądowe dla makiety. Kalkulator liczy wyłącznie w Twojej przeglądarce, nic nie wysyłamy.",
      cta: "Sprawdź to na swoim sklepie",
    },
  },

  integrations: {
    h2: "Działa tam, gdzie sprzedajesz.",
    platforms: ["Shoper", "IdoSell", "PrestaShop", "WooCommerce", "Shopify", "Magento", "Sky-Shop", "REST API"],
    note: "Sklep pisany na miarę? REST API i webhooki — podłączymy wszystko, co ma katalog i koszyk. Czat dogada się z klientem także na Messengerze i Instagramie (plan Growth).",
  },

  trust: {
    label: "BEZPIECZEŃSTWO",
    h2: "Ty ustalasz, co bot mówi. I czego nie mówi.",
    items: [
      {
        icon: "shield" as const,
        title: "Nie zmyśla",
        body: "odpowiada tylko na podstawie Twojego katalogu i polityk. Nie zna odpowiedzi? Mówi wprost i przekazuje człowiekowi.",
      },
      {
        icon: "user" as const,
        title: "Przekazanie do człowieka",
        body: "z pełnym streszczeniem rozmowy, żeby klient nie powtarzał wszystkiego od zera.",
      },
      {
        icon: "lock" as const,
        title: "RODO i dane w UE",
        body: "hosting w UE, umowa powierzenia (DPA), pełna kontrola retencji danych.",
      },
      {
        icon: "sliders" as const,
        title: "Pełna kontrola tonu",
        body: "formalny czy luźny, z rabatami czy bez. Zmieniasz w panelu, działa od zaraz.",
      },
    ],
  },

  pricing: {
    label: "CENNIK",
    h2: "Prosty rachunek.",
    lead: "Każdy plan zwraca się z jednej uratowanej transakcji dziennie. Ceny netto, rozliczenie miesięczne, rezygnacja jednym kliknięciem.",
    featureLabels: [
      "Czat AI 24/7",
      "Wyszukiwarka AI",
      "Panel przychodów",
      "Rozmowy / mc",
      "Rekomendacje + dosprzedaż",
      "Radar popytu",
      "Ratownik koszyka",
      "Messenger / Instagram",
      "Multi-store, SLA, opiekun",
    ],
    plans: [
      {
        name: "Start",
        price: "499 zł",
        period: "/mc",
        audience: "do 10 tys. wizyt/mc",
        features: ["yes", "yes", "yes", "1 000", "no", "no", "no", "no", "no"],
        cta: "Testuj 14 dni za darmo",
        featured: false,
      },
      {
        name: "Growth",
        badge: "najczęściej wybierany",
        price: "1 299 zł",
        period: "/mc",
        audience: "do 100 tys. wizyt/mc",
        features: ["yes", "yes", "yes", "5 000", "yes", "yes", "yes", "yes", "no"],
        cta: "Testuj 14 dni za darmo",
        featured: true,
      },
      {
        name: "Scale",
        price: "wycena indywidualna",
        period: "",
        audience: "duży ruch, wiele sklepów",
        features: ["yes", "yes", "yes", "bez limitu", "yes", "yes", "yes", "yes", "yes"],
        cta: "Porozmawiajmy",
        featured: false,
      },
    ],
    note: "Bez karty na start. Przekroczysz limit rozmów? Nic nie wyłączamy — dogadamy plan.",
  },

  faq: {
    h2: "Pytania, które i tak chciałeś zadać.",
    items: [
      {
        q: "Czy bot będzie zmyślał i obiecywał klientom głupoty?",
        a: "Nie. Odpowiada wyłącznie na podstawie Twojego katalogu, cennika i polityk. Kiedy nie zna odpowiedzi, mówi „nie wiem” i przekazuje rozmowę człowiekowi. Każdą odpowiedź możesz prześledzić do źródła w panelu.",
      },
      {
        q: "Ile trwa wdrożenie?",
        a: "Wtyczka lub API: ok. 15 minut. Indeksacja katalogu: do kilku godzin. Realnie: rano podłączasz, po południu bot sprzedaje. Nie ruszamy kodu Twojego sklepu.",
      },
      {
        q: "Czy zadziała z moją platformą?",
        a: "Shoper, IdoSell, PrestaShop, WooCommerce, Shopify, Magento — natywnie. Sklep autorski — przez REST API. Jeśli masz katalog i koszyk, podłączymy.",
      },
      {
        q: "Co z RODO?",
        a: "Dane przetwarzane w UE, umowa powierzenia w standardzie, rozmowy anonimizowane do analityki. Szczegóły potwierdzimy na demo.",
      },
      {
        q: "Czy klienci wiedzą, że rozmawiają z AI?",
        a: "Tak — i dobrze. Bot się przedstawia, a klienci pytają śmielej niż człowieka. W każdej chwili mogą poprosić o kontakt z obsługą.",
      },
      {
        q: "Co się dzieje, gdy bot nie zna odpowiedzi?",
        a: "Mówi wprost, zbiera kontakt i przekazuje rozmowę ze streszczeniem do Twojego zespołu. A pytanie trafia do Radaru popytu — jeśli powtarza się często, wiesz, co dodać do oferty albo FAQ.",
      },
      {
        q: "Mam mały ruch. Czy to się opłaci?",
        a: "Policz w kalkulatorze wyżej. Zasada kciuka: jeśli masz ponad 5 tys. wizyt miesięcznie albo choć jedną osobę odpisującą na maile klientów — tak.",
      },
      {
        q: "Czy mogę kontrolować, co bot mówi?",
        a: "Tak: ton, zakres tematów, zasady rabatowania, produkty wykluczone z rekomendacji. Wszystko w panelu, zmiany działają natychmiast.",
      },
    ],
  },

  finalCta: {
    h2: "Zobacz go na własnych produktach.",
    lead: "Podaj adres sklepu — przygotujemy demo z Twoim katalogiem. 15 minut rozmowy, konkretne liczby, zero zobowiązań.",
    urlLabel: "Adres Twojego sklepu",
    urlPlaceholder: "twojsklep.pl",
    emailLabel: "Twój e-mail",
    emailPlaceholder: "imie@firma.pl",
    submit: "Umów demo",
    sending: "Wysyłamy…",
    below: "Odpowiadamy w 1 dzień roboczy. Bez spamu, bez „sekwencji sprzedażowych”.",
    errors: {
      url: "To nie wygląda na adres sklepu — sprawdź literówkę.",
      email: "Ten e-mail wygląda na niepełny.",
      server: "Coś poszło nie tak po naszej stronie. Spróbuj za chwilę albo napisz: kontakt@hackmysales.pl.",
    },
    success: "Jest! Sprawdzimy Twój sklep i odezwiemy się w 1 dzień roboczy.",
  },

  footer: {
    tagline: "AI CHATBOT & RECOMMENDATIONS THAT INCREASE SALES",
    columns: [
      {
        title: "Produkt",
        links: [
          { label: "Czat AI", href: "#produkt" },
          { label: "Wyszukiwarka", href: "#produkt" },
          { label: "Rekomendacje", href: "#produkt" },
          { label: "Panel przychodów", href: "#funkcje" },
        ],
      },
      {
        title: "Zasoby",
        links: [
          { label: "Demo", href: "#demo" },
          { label: "Cennik", href: "#cennik" },
          { label: "FAQ", href: "#faq" },
          // [PLACEHOLDER] adres portalu
          { label: "Portal klienta", href: "https://portal.185-238-74-109.nip.io/portal/login" },
        ],
      },
      {
        title: "Firma",
        links: [
          { label: "Kontakt", href: "mailto:kontakt@hackmysales.pl" },
          { label: "Polityka prywatności", href: "#" },
          { label: "Regulamin", href: "#" },
        ],
      },
    ],
    copyright: "HackMySales · Time4Ecommerce. Wszystkie prawa zastrzeżone.",
  },

  notFound: {
    h1: "Tej strony nie ma.",
    body: "Gdyby nasz bot tu pracował, zaproponowałby coś podobnego.",
    back: "Wróć na stronę główną",
  },
} as const;

export type PlDict = typeof raw;
export const pl: PlDict = deepNbsp(raw);
