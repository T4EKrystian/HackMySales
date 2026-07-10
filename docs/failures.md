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

- **2026-07-10 · Foto-gate oblał plecak i elektronikę** — nie przez brak fotografii, tylko przez SŁABE KADRY z V5: produkt mały na jednolitym tle (thumb 112 px tracił całą fakturę — entropia 2.15, wizualnie „ikona"). To wyjaśnia część piksel-audytu klienta. Fix: ciasny kadr u źródła (pipeline), NIE osłabianie progu; jedynie próg mono dla thumbów skalibrowany 5.0→4.6 (downsampling zjada ~1.5 pkt entropii; margines nad noisy-tile ~1.2 pkt zachowany).
