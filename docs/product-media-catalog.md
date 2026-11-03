# Katalog zdjęć produktów

Pliki udostępniane klientom i materiały lokalne są rozdzielone według źródła. Oryginalne pliki z `public/` pozostają pod tymi samymi ścieżkami, z których korzysta aplikacja i magazyn mediów. Galeria widoczna na stronie korzysta z adresów Shopify CDN zapisanych w manifeście.

## Galerie opublikowane 2 listopada 2026

Każdy plik źródłowy jest uporządkowany w `output/product-media/published/2026-11-02/<handle>/`. Poprzednie, zastąpione ujęcia zachowano w `output/product-media/archive/2026-11-02/previous-gallery/<handle>/`. Pliki nie są zmieniane; obowiązujące adresy Shopify pozostały bez zmian. Szczegółowe mapowanie pliku, produktu i adresu znajduje się w [`output/product-media/catalog.json`](../output/product-media/catalog.json).

| Produkt | Pliki przypisane do produktu |
| --- | --- |
| `body-oil` | `body-3pack`, `body-5pack`, `body-detail`, `body-dose`, `body-massage`, `body-afterbath` |
| `niacinamide-toner` | `nia-30-hero`, `nia-50-hero`, `nia-detail`, `nia-apply`, `nia-dose`, `nia-travel` |
| `candle-set` | `candle-hero`, `candle-detail`, `candle-room`, `candle-light`, `candle-bath` |
| `professional-derma-roller` | `derma-hero`, `derma-detail`, `derma-face`, `derma-grip`, `derma-prepare` |
| `retinol-serum` | `retinol-hero`, `retinol-detail`, `retinol-capsule`, `retinol-apply`, `retinol-evening` |

`nia-50-hero` jest zdjęciem wyłącznie wariantu 50 ml, poza pięcioma głównymi ujęciami galerii.

## Obrazy w `public/`

Pliki w `public/` są już pogrupowane w katalogach produktów. Nie przenosiłem ich ani nie zmieniałem nazw: `mediaUrl()` buduje adresy Vercel Blob na podstawie tych ścieżek, a ich zmiana bez równoczesnego ponownego wgrania mogłaby zepsuć zdjęcia. Pełny spis katalogów i liczby plików:

| Katalog | Pliki |
| --- | ---: |
| `public/aroma-diffuser/` | 10 |
| `public/aveeno-oil-mist/` | 12 |
| `public/bath-salts/` | 1 |
| `public/bian-stone-gua-sha/` | 5 |
| `public/body-gua-sha/` | 6 |
| `public/body-oil/` | 1 |
| `public/brand/` | 10 |
| `public/candle-set/` | 1 |
| `public/centella-collagen-sleep-masks/` | 9 |
| `public/clear-skin-patches/` | 7 |
| `public/cliganic-essential-oils/` | 19 |
| `public/copper-water-bottle/` | 18 |
| `public/coslus-cleansing-brush/` | 15 |
| `public/cosrx-snail-mucin/` | 8 |
| `public/customer-avatars/` | 6 |
| `public/derma-roller/` | 14 |
| `public/professional-derma-roller/` | 0 |
| `public/dermaplaning-razor-kit/` | 6 |
| `public/dress/` | 18 |
| `public/dry-brush/` | 1 |
| `public/exfoliating-spa-body-brush/` | 6 |
| `public/gold-eye-patches/` | 4 |
| `public/gua-sha-jade-roller-set/` | 4 |
| `public/gua-sha-set/` | 12 |
| `public/ice-face-roller-gua-sha-set/` | 8 |
| `public/led-mask/` | 1 |
| `public/lux-aura-face-roller-gua-sha-set/` | 12 |
| `public/lux-aura-gua-sha-duo/` | 20 |
| `public/magnesium-supplement/` | 15 |
| `public/medicube-age-r-booster-pro/` | 17 |
| `public/mixsoon-bean-essence/` | 8 |
| `public/natural-bristle-spa-brush/` | 8 |
| `public/niacinamide-toner/` | 7 |
| `public/orgain-collagen-peptides/` | 19 |
| `public/pavilia-plush-robe/` | 13 |
| `public/product-demonstrations/` | 16 |
| `public/resin-body-gua-sha-tool/` | 1 |
| `public/retinol-serum/` | 1 |
| `public/rosemary-hair-oil/` | 20 |
| `public/scalp-massager/` | 2 |
| `public/seaweed-collagen-crystal-mask/` | 8 |
| `public/sheet-mask-set/` | 1 |
| `public/shimmer-body-oil/` | 3 |
| `public/silk-sleep-mask/` | 10 |
| `public/skin-ritual-bundle/` | 6 |
| `public/tiam-vita-b3-source-toner/` | 1 |
| `public/vibro-glow-face-massager/` | 10 |
| `public/vitamin-c-retinol-serum-duo/` | 11 |
| `public/vitamin-d3-k2-supplement-supports-cardiovascular-musculoskeletal-neurocognitive-health-gluten-free-non-gmo/` | 1 |
| `public/weighted-blanket/` | 1 |

### Dermaroller

`public/derma-roller/` zawiera kilka różnych rodzin źródeł. Zachowałem wszystkie pliki oraz obecne ścieżki:

- `Koi_Beauty_Derma_Roller.png` i `details_*.jpg` — materiały Koi Beauty.
- `PL_Koi_Beauty_Derma_Roller.jpg` i `PL_details_*.jpg` — polskie materiały tej samej rodziny.
- `PL_angel-kiss-derma-roller-03mm-amazon-pl-lux-aura-care.png` — osobna oferta Angel Kiss; nie jest tym samym rollerem co czarny model z aktualnej oferty.

Aktualne obrazy oferty Professional Derma Roller są zapisane osobno w manifeście galerii Shopify. Dzięki temu materiały starszego produktu nie zostaną pomylone z aktualną ofertą.
