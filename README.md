# HackMySales — landing page

Ciemny, powściągliwy landing (Next.js 15 + Tailwind v4 + GSAP/Lenis) dla systemu HackMySales: czat AI, wyszukiwarka i rekomendacje dla e-commerce. **Strona jest zbudowana i przechodzi build + lint + QA** — poniżej jak ją odpalić i co podmienić przed startem.

## Szybki start

```bash
cd ~/Projects/HackMySales
npm install
npm run dev        # http://localhost:3000
```

Build produkcyjny (statyczny eksport do `out/` — wrzucasz na dowolny hosting/CDN):

```bash
npm run build
```

## Przed startem produkcyjnym

1. Otwórz **`PLACEHOLDERS.md`** — pełna lista wartości w `[nawiasach]` do podmiany (ceny, wyniki, domena, endpoint formularza). Podmiany robisz w `content/pl.ts`.
2. Liczby wyników (`+18%` itd.) muszą być prawdziwe — do tego czasu są jawnie oznaczone nawiasami.
3. Case studies i logotypy klientów: sekcje celowo nie istnieją — nie fabrykujemy dowodów (patrz `design/anti-slop.md`).

## Struktura

| Ścieżka | Rola |
|---|---|
| `app/`, `components/`, `lib/` | Kod strony (sekcje w `components/sections/`) |
| `content/pl.ts` | **Jedyne miejsce z tekstami** (gotowe pod przyszłe `en.ts`) |
| `content/copy-pl.md` | Źródłowy copy deck (spec) |
| `design/tokens.css` | Tokeny kolorów/typografii — zero hexów w komponentach |
| `design/motion.md` | Spec animacji (GSAP + ScrollTrigger + Lenis) |
| `design/anti-slop.md` | Bramka jakości „nie wyglądaj jak z AI" |
| `content/features.md` | Spec funkcji „kopalni złota" + elementów L1–L5 |
| `assets/` | Logo SVG (logomark, lockup, favicon) |
| `.claude/skills/` | Skille dla Claude Code: scroll-motion, pl-typography, design-qa |
| `CLAUDE.md` + `PROMPT.md` | Środowisko Claude Code (zasady + brief) do dalszych zmian |

## Co jest na stronie

Hero z **żywym demo czatu w 3 scenariuszach** (taby Doradztwo / Rozmiar / Paczka — oskryptowane rozmowy z kartami produktów i badge'ami wartości), pasek platform, sekcja problemu z licznikami, **pinowane filary** z trzema panelami demo (czat / wyszukiwarka PL z **efektem pisania** / rekomendacje z suwakiem marży), kopalnie złota z **mini-panelem przychodów ze sparkline** i **tickerem Radaru popytu**, **e-mail nocnej zmiany jako żywe UI skrzynki**, sekcja **„Różnica"** (zwykły czatbot vs HackMySales), sekcja **„Branże"** (4 zakładki: moda / dom / elektronika / B2B z przykładowymi rozmowami), 3 kroki wdrożenia, **„Panel"** — pełnowymiarowy poranny dashboard produktu (KPI, wykres 14 dni, rozmowy, radar), wyniki + **kalkulator ROI**, integracje, zaufanie/RODO, cennik (3 plany), FAQ (akordeon + JSON-LD), formularz demo z walidacją, stopka, **boczna nawigacja kropkowa** i **pasek postępu scrolla** w nav. Całość: reduced-motion, no-JS fallback, focus ringi, skip link, polska typografia (sierotki, nbsp, grupowanie tysięcy także dla 4 cyfr).

## Dalsze zmiany przez Claude Code

Repo ma gotowe środowisko: `CLAUDE.md` (zasady), skille w `.claude/skills/`, spec w `design/` i `content/`. Otwierasz `claude` w folderze i prosisz o zmianę — zasady pilnują jakości (tokeny, copy 1:1, anti-slop, QA).

## Wyniki QA (audyt automatyczny)

- **axe-core (WCAG):** 0 naruszeń — po korekcie kontrastu `--text-muted` (≥4,5:1 na każdym tle) i dostępie klawiaturowym do okna czatu.
- **Lighthouse:** Accessibility **100** · Best Practices **100** · SEO **100** · Performance 79 w dławionym sandboxie (symulacja slow-4G + 4× CPU, serwer bez brotli) — na produkcji z CDN i kompresją spodziewane ≥90. CLS = 0.
- **Reduced-motion:** pełna treść widoczna statycznie; pinowane filary mają wariant stackowany (`motion-reduce:`).
- **Git:** repo zainicjowane, praca commitowana na `main`.

## Znane ograniczenia

- Formularz demo loguje do konsoli — endpoint do podpięcia (TODO w `FinalCta.tsx`).
- Portal ma bug: błąd logowania pokazuje `[object Object]` — poprawić serializację błędu (to w repo portalu, nie tutaj).
