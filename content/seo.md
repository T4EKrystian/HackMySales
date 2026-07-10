# HackMySales — SEO / meta

## Meta (PL)

- **Title:** `HackMySales — AI, które sprzedaje w Twoim sklepie internetowym`
- **Description:** `Czat AI, wyszukiwarka i rekomendacje podłączone do Twojego sklepu. Doradza klientom 24/7, ratuje koszyki i pokazuje przychód co do złotówki. Wdrożenie bez developera.`
- **OG image (1200×630):** ciemne tło `--bg-page`, lockup logo, H1 „Sprzedawca, który nigdy nie śpi.”, fragment okna czatu z badge „✓ Zamówienie — 399 zł”. Generować przez `next/og` (ImageResponse), nie statyczny PNG.
- Canonical, `lang="pl"`, favicon z `assets/favicon.svg` + fallback PNG 32/180 (apple-touch).

## Struktura URL / i18n

Wszystko na `/` (one-page) + kotwice `#produkt #funkcje #wyniki #cennik #faq`. Routing gotowy pod `/en` w przyszłości (słowniki `content/pl.ts`, potem `en.ts`); na razie bez hreflang.

## JSON-LD

1. `SoftwareApplication` — name HackMySales, applicationCategory BusinessApplication, operatingSystem Web, offers (3 plany, ceny po podmianie placeholderów — do tego czasu bez `offers`), publisher Time4Ecommerce.
2. `FAQPage` — 8 pytań z sekcji FAQ, treść 1:1 z `copy-pl.md` §10.

## Technikalia

- Sitemap + robots przez wbudowane mechanizmy Next (`app/sitemap.ts`, `app/robots.ts`).
- Nagłówki w hierarchii: jedno H1 (hero), H2 sekcje, H3 karty. Bez skakania poziomów.
- Cały copy renderowany serwerowo (SSG) — animacje tylko dodają ruch, nie treść.
- Lighthouse cel: Performance ≥ 90 (z animacjami), SEO 100, Accessibility 100, Best Practices 100.
- Metadata API Next (`export const metadata`), nie ręczne tagi.

## Słowa kluczowe (informacyjnie, bez upychania)

chatbot AI dla sklepu internetowego · inteligentna wyszukiwarka e-commerce · rekomendacje produktowe AI · chatbot Shoper/IdoSell/PrestaShop · porzucone koszyki · automatyzacja obsługi klienta e-commerce
