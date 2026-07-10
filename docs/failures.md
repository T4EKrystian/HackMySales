# Dziennik porażek — co nie zagrało i dlaczego

Cel: kolejne iteracje nie powtarzają ślepych uliczek. Wpisy chronologicznie, najnowsze na dole.

## Z V5 (zebrane wstecznie)

- **`gsap.quickTo(el, "scale")` + resetTo** → warning „scale not eligible for reset" przy każdym hover-klik cyklu kursora. GSAP każe rozbijać na osie: quickTo scaleX + scaleY za fasadą. Ta sama klasa: tweeny ze `scale` w kontekstach `revertOnUpdate` śmiecą konsolę przy przełączaniu scenariuszy — spring na samym `y` czyta się tak samo.
- **Lighthouse przy dev-serverze w tle kłamie**: TBT 460 ms vs 60 ms na czystej maszynie (kontencja CPU). Mierzyć: kill dev → build → serve out/ → LH; bisekcja przez `git worktree` + symlink node_modules.
- **Lantern (symulacja) LCP ≠ rzeczywistość**: 9,1 s symulowane vs 180 ms obserwowane (LCP = akapit hero). Dowód zawsze przez `--throttling-method=devtools` + PerformanceObserver w realnym Chromium.
- **Pexels/Unsplash blokują curl na stronach HTML** (Cloudflare/anty-bot) — działa WebFetch; CDN images.pexels.com przez curl OK, ALE nowsze zdjęcia mają NIESTANDARDOWE nazwy plików (brać z og:image, nie zgadywać wzorca).
- **Packshoty butów/kasków bez logo praktycznie nie istnieją w darmowych stockach** — kilkanaście odrzutów (HOKA/POC/SMITH/Merrell/…); strategia: kadr omijający logo albo produkt premium bez brandingu.
- **drei `<View track>` poza Canvasem** ignoruje track (mierzy własny pusty div) — Views MUSZĄ być dziećmi Canvasa.
- **`*/` wewnątrz komentarza CSS** zamyka komentarz (zmielone tokeny) — komentarze tokenów bez sekwencji `*/`.

## V6

- **2026-07-10 · Gradient jako TŁO bąbla IG (V5) nie przetrwał anti-kitsch** — „rozpoznawalność kanału" próbowaliśmy zrobić kolorem, a robi ją GEOMETRIA (pigułki, reply-quote, „Aktywna teraz"). Kolor w cudzym wzorcu czyta się jak cukierek. Wniosek: sygnały kanału = layout; kolor zawsze w naszej palecie, wyciszony; gradient maks. jako 1px ring.
- **2026-07-10 · quickTo z oklch w asercji kontrastu** — parser „pierwsze 3 liczby z getComputedStyle" łamie się na `oklch(...)` (Chrome zwraca oklch dla color-mix in oklch). Mierzyć przez canvas fillStyle→getImageData (przeglądarka konwertuje sama).
- **2026-07-10 · Foto-gate oblał plecak i elektronikę** — nie przez brak fotografii, tylko przez SŁABE KADRY z V5: produkt mały na jednolitym tle (thumb 112 px tracił całą fakturę — entropia 2.15, wizualnie „ikona"). To wyjaśnia część piksel-audytu klienta. Fix: ciasny kadr u źródła (pipeline), NIE osłabianie progu; jedynie próg mono dla thumbów skalibrowany 5.0→4.6 (downsampling zjada ~1.5 pkt entropii; margines nad noisy-tile ~1.2 pkt zachowany).
- **2026-07-10 · Treść kroków przywiązana do scrubu = pusta karta NA SNAPIE** — w Trzech krokach `animatePanelContent` startował na 0.25 osi scrubu, więc etykieta spoczynku s0 (do której snap CELOWO ściąga) pokazywała pustą ramkę, a chip „podpięto" (at+1.6) wypadał już po wyjeździe panelu. Ta sama klasa co „36 031 mid-scrub". Wniosek: STAN SPOCZYNKU (snap label) musi być kompletny — treść pierwszego stanu gra time-based przy wejściu w pin, okna kolejnych domykają się PRZED etykietą.
- **2026-07-10 · Elipsa converge wylądowała na microcopy finału** — pas GL centrowany „na oko" (`top-[22%]`) położył zbieg cząstek dokładnie na linii „Odpowiadamy…" (dwa niezależne screeny). Fix: pas niżej (`top-[34%]`), elipsa w pustej strefie dołu = „lądowisko" pod formularzem; werdykt z geometrii (microBottom 661 < glCenter 729) + screen.
- **2026-07-10 · Ocena koloru z przeskalowanego PNG myli** — kropka 02 postępu wyglądała na nieaktywną przy aktywnej 03 (złamana monotonia = podejrzenie buga). Dump `data-active` z DOM pokazał [t,t,t] na każdej głębokości — artefakt kompresji/skalowania. Wniosek: subtelne kolory weryfikować stanem DOM, nie pikselami screenshota.
- **2026-07-10 · Playwright z ESM nie rozwiązuje się względem cwd** — skrypt w scratchpadzie poza repo nie widzi `node_modules` niezależnie od katalogu uruchomienia (resolution idzie od ŚCIEŻKI PLIKU). Fix: absolutny import `<repo>/node_modules/playwright/index.mjs`.
- **2026-07-11 · Sonda „opacity>0.1" nie wykrywa display:none** — tryb static chowa typing-dots przez `display:"none"`, a computed opacity zostaje 1 → asercja B5 fałszywie krzyczała „replay". Widoczność mierzyć parą: `offsetParent !== null` + opacity; „widoczny tekst" najprościej przez `innerText` (pomija visibility:hidden z autoAlpha i display:none).
- **2026-07-11 · Scroll „do sekcji" ≠ scroll do elementu z triggerem** — jump do góry #kanaly zostawiał switcher (sekcja + ~800 px) pod linią startu ST: playback nigdy nie ruszał i trzy asercje padały kaskadą. W testach celować w ELEMENT niosący trigger, nie w kotwicę sekcji.
- **2026-07-11 · Cztery sondy = cztery evaluate = dziurawe próbkowanie** — okno czasowe 150–350 ms bywało bez ani jednego sampla, bo każdy tick robił 4 round-tripy. Sondy wielopolowe zawsze JEDNYM evaluate.
