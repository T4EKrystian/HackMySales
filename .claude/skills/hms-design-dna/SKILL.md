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

## Znak
- Kanon: dymek czatu + 3 słupki (brand.md) — NIE redesignować w ramach polish passów.
- Favicon = uproszczony wariant znaku; kolory zawsze hardcoded hex (favicon nie widzi CSS strony).
- Kropka statusu online przy znaku w nav: 6px, akcent, puls 2s, reduced-motion → statyczna.
