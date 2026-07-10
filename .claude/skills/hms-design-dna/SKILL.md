---
name: hms-design-dna
description: Design DNA landinga HackMySales — tokeny powierzchni, typografia PL, głos copy, wizualizacje produktów. Czytaj przed każdą zmianą UI.
---

# HackMySales — Design DNA

## Powierzchnie (system elewacji — koniec z jedną ramką na wszystko)
- Poziom 0 (tło): bazowa czerń strony + grain 2.5%.
- Poziom 1 (sekcyjne panele): tło +3% jasności, obrys `1px rgba(255,255,255,.06)`.
- Poziom 2 (karty/frame'y device): tło +6%, obrys zewnętrzny `rgba(255,255,255,.08)`
  + wewnętrzny top-highlight `inset 0 1px 0 rgba(255,255,255,.05)` + cień warstwowy
  (`0 1px 2px rgba(0,0,0,.5), 0 12px 40px -12px rgba(0,0,0,.6)`).
- Poziom 3 (elementy aktywne/hover): + spotlight radial za kursorem, + border w stronę akcentu.
- Device frame'y: header jako glass (blur 12px, tło rgba, hairline pod spodem), 
  radius zewnętrzny > wewnętrzny (nested radii: np. 20/12).
- ZASADA: na jednym ekranie muszą współistnieć min. 2 poziomy — monotonia ramek = generyk.

## Kolor
- Jedna rodzina akcentu (obecny niebieski/fiolet) w 3 rolach: akcent (CTA/aktywne),
  akcent-dim (30% — obrysy aktywne), akcent-glow (bloom/poświaty). Zero drugiego koloru ozdobnego.
- Semantyka: zielony TYLKO dla "odzyskane/online/✓", czerwony TYLKO dla straty w sekcji problemu.

## Typografia i polski skład (obowiązkowe)
- Hierarchia: Display (serif italic tylko dla 1 słowa-akcentu na sekcję) / H2 / body / mono-caps labels.
- Liczby: spacja niełamliwa jako separator tysięcy `26 300 zł` (&#8239; lub &nbsp;), 
  `zł` zawsze z nbsp przed, przecinek dziesiętny `0,9 s`.
- Cudzysłowy polskie „…", półpauza z odstępami ` – ` w zdaniach, em-dash `—` w labelach.
- Sieroty: jednoliterowe `i w z a o u` łącz nbsp z następnym słowem (utility/regex na renderze).
- Max 2 zdania na akapit. Liczba > przymiotnik.

## Głos bota i copy
- ZERO emoji. ZERO wykrzykników w odpowiedziach bota. Bot = spokojny, konkretny doradca.
- Odpowiedź bota: 1 zdanie kontekstu + konkret (produkt/liczba/akcja). Nigdy entuzjazm z callcenter.

## Wizualizacje produktów (koniec z pustymi kwadratami)
- ZAKAZ pustych/szarych/beżowych placeholderów. Każdy thumb produktu = generatywna mini-scena:
  gradient bazowy w tincie materiału + tekstura (SVG turbulence/noise 4-6%) + prosta sylwetka
  produktu (fold pościeli / dzianina swetra / butelka spraya) rysowana 1-2 kształtami + 
  delikatne światło z góry. Jeden komponent `<ProductVisual kind="len|dzianina|frotte|spray|obuwie" tint />`.
- Spójny kadr: 1:1, radius wewnętrzny, subtelna winieta. Ma wyglądać jak art-directed still, nie ikona.

## Ikony i ornament
- Zero bibliotecznych ikon (Lucide itp.). Tylko własne mikro-glify 1.5px stroke, gdy niezbędne.
- Reguła Chanel: przed zamknięciem sekcji usuń jeden ornament.

## Chat authenticity (nowe)
- Demo rozmów renderujemy w skinach wzorowanych na realnych komunikatorach (onsite/messenger/
  instagram/e-mail). Wzorce UX kanału: bąble+ogonki, avatar, timestamp, read receipts, typing dots,
  quick replies, divider "Dzisiaj", status "Aktywna teraz". BEZ logotypów kanałów wewnątrz mockupu
  rozmowy (nazwa kanału tylko w labelu/tabie) — ewokujemy wzorzec, nie podszywamy się.
- Persona: rozmowy prowadzi doradczyni z imieniem i zdjęciem (patrz Asety) + mała plakietka "AI"
  w headerze (spójność z FAQ "Czy klienci wiedzą, że rozmawiają z AI?"). Bot: zero emoji,
  zero wykrzykników. KLIENT może pisać naturalnie: literówki, mała litera, max 1 emoji — to
  uwiarygadnia demo.
- Rytm pisania: 40–70 ms/znak + pauza 250–400 ms po interpunkcji; typing indicator 600–900 ms
  przed odpowiedzią bota.

## Fotografia produktowa (nowe)
- ZAKAZ inicjałów/ilustracji tam, gdzie klient spodziewa się zdjęcia produktu. Używamy realnych
  fotografii (packshoty, neutralne tło) z Pexels/Unsplash (licencje: użycie komercyjne bez atrybucji).
- Spójny grade dla wszystkich: crop 1:1, delikatna desaturacja −8%, wspólna temperatura, winieta 3%.
  Format: /public/products/<slug>.webp 800×800 q80 + wariant 112px na thumby. Manifest products.json
  (slug, nazwa, cena, alt).
- Portret doradczyni: przyjazny headshot, neutralne tło, crop kołowy 96px; ta sama osoba w CAŁYM
  serwisie.

## Particles doctrine (nowe)
- Jedno globalne ambient field na fixed canvasie przez CAŁĄ stronę: 300–500 pkt (desktop),
  rozmiar 1–2 px, opacity ≤ .35, kolor akcent-dim, powolny dryf (bez kierunku „śledzenia").
- Modulacje per sekcja przez uniformy sterowane scrollem (gęstość/tinta/zachowanie), niżej mapa.
- Strefy wyłączenia: pod kolumnami tekstu gęstość −70% (maska radialna od content-boxów) —
  cząstki są TŁEM, nigdy nie konkurują z czytaniem.
- ZAKAZ: cursor-trail (cząstki podążające za kursorem), bursty na klik, konfetti. Reakcja na mysz
  WYŁĄCZNIE w hero (subtelna repulsja rdzenia) — reszta strony ignoruje kursor.

## Znak
- Kanon: dymek czatu + 3 słupki (brand.md) — NIE redesignować w ramach polish passów.
- Favicon = uproszczony wariant znaku; kolory zawsze hardcoded hex (favicon nie widzi CSS strony).
- Kropka statusu online przy znaku w nav: 6px, akcent, puls 2s, reduced-motion → statyczna.
