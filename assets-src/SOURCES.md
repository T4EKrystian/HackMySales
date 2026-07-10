# Źródła zdjęć (V5-F1)

Wszystkie zdjęcia: **Pexels License** lub **Unsplash License** — darmowe użycie komercyjne, bez wymogu atrybucji, modyfikacje dozwolone. Pobrane 2026-07-10. Pipeline: `scripts/process-photos.mjs` (crop 1:1, desaturacja −8%, webp q80, 800 px + 112 px).

| Slug | Źródło (strona licencyjna) | Autor* | Uwagi |
|---|---|---|---|
| m-city | https://www.pexels.com/photo/white-bike-on-wall-11524787/ | Pexels | czysty packshot na tle ściany |
| m29 | https://www.pexels.com/photo/mountain-bike-in-irpin-forest-path-32910927/ | Pexels | kadr ręczny na rower; drobny deal „COMPASS” na ramie — nieczytelny w rozmiarach użycia |
| kask-ridge | https://www.pexels.com/photo/helmet-with-goggles-15292264/ | Pexels | logo lisa na PASKU GOGLI (produkt wtórny) — akceptowalne, nie dominuje |
| kask-core | https://unsplash.com/photos/rw8jnGPJpho | Unsplash | mikronapis „CRANE” nieczytelny ≤800 px |
| x-trail-2 | https://www.pexels.com/photo/trail-running-shoe-on-a-forest-rock-29603275/ | Pexels | ⚠ napis producenta widoczny w 800 px; UŻYWAĆ TYLKO jako thumb ≤112 px (wszystkie sloty demo są thumbowe) |
| x-trail-mid | https://www.pexels.com/photo/hiking-shoes-with-black-sole-16562750/ | Pexels | małe znaczki (klips, patch membrany) — wtórne |
| kurtka-3l | https://unsplash.com/photos/UjzJzuCHZDU | Unsplash | kadr ręczny: detal kaptur+tors z flat laya (sąsiednie przedmioty poza kadrem) |
| u-lock | https://www.pexels.com/photo/photograph-of-a-bicycle-lock-11145678/ | Pexels | kompromis: zapięcie łańcuchowe z szyfrem (nie U-lock) — w kadrze czytelne jako „zapięcie” |
| plecak | https://www.pexels.com/photo/a-black-backpack-on-white-surface-13869858/ | Pexels | drobny napis producenta u dołu — nieczytelny w thumbach |
| kurtka-kids | https://www.pexels.com/photo/stylish-brown-and-beige-child-s-clothing-rack-28259750/ | Pexels | kadr ręczny na kurtkę z kapturem |
| spodnie-junior | https://www.pexels.com/photo/cozy-children-s-clothing-on-wooden-rack-28259747/ | Pexels | kadr ręczny na szorty/spodnie |
| komplet-termo | https://www.pexels.com/photo/stack-of-folded-sweaters-on-white-background-30569741/ | Pexels | stos złożonych ubrań = „komplet” |
| sukienka | https://www.pexels.com/photo/white-floral-dress-8618977/ | Pexels | kadr ręczny na prawą manekinkę |
| dom | https://www.pexels.com/photo/lamp-on-table-6825311/ | Pexels | kadr ręczny: lampa + stolik, oddech ściany |
| elektronika | https://www.pexels.com/photo/black-headphones-on-white-surface-7772548/ | Pexels | bez widocznych logo |
| b2b | https://www.pexels.com/photo/warehouse-storage-with-stacked-cardboard-boxes-38195854/ | Pexels | etykiety regałów = generyczne kody lokalizacji |
| team/magda | https://www.pexels.com/photo/professional-headshot-of-a-young-businesswoman-30468665/ | Pexels | persona AI — zawsze z plakietką „AI” (anti-slop wyjątek v5) |

\* Pexels/Unsplash nie wymagają atrybucji; autorzy dostępni na stronach źródłowych.

## Loga platform (V5-F5)

Symbole SVG: **simple-icons** (licencja CC0) — Shopify/WooCommerce/PrestaShop z https://cdn.simpleicons.org/, Magento z https://cdn.jsdelivr.net/npm/simple-icons@11/icons/magento.svg (ikona usunięta w nowszych wydaniach paczki). Shoper/IdoSell/Sky-Shop: wordmarki typograficzne własne (brak symboli w simple-icons). Użycie: nominative use na liście realnych integracji (anti-slop v5). Pliki źródłowe: `assets-src/logo-*.svg`, komponent: `components/ui/PlatformLogo.tsx`.

## Odrzuty (dlaczego)

Wyraźne logotypy obcych marek (HOKA ×3, POC ×2, SMITH, Van Rysel, MERRELL, SIMMS, Adidas Terrex, Patagonia, Brevité-flat-lay, „Mount to Coast” ×2, Nike/Dior) — konflikt z anti-slop („zmyślony sklep nie sprzedaje cudzych marek”); zdjęcia ludzi noszących produkt; sceny bez wyraźnego produktu. Pliki źródłowe odrzutów zostają w `assets-src/` do wglądu.

## Otwarte kompromisy

1. **x-trail-2** — brak czystego packshotu butów trail bez brandu na Pexels/Unsplash/Openverse (CC0); wybrane najlepsze ujęcie z zastrzeżeniem thumb-only.
2. **u-lock** — nazwa produktu w decku mówi „U-lock”, zdjęcie pokazuje zapięcie łańcuchowe; jeśli klient dostarczy własny packshot — podmienić 1:1 (slug gotowy).
