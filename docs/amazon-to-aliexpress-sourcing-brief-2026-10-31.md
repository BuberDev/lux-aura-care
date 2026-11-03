# Brief sourcingowy: produkty z katalogu Amazon → AliExpress/DSers → Shopify

Zapis listy: 2026-10-31. Powstała na prośbę właściciela, by ocenić
odpowiedniki dawnych produktów afiliacyjnych Amazon do sprzedaży przez
Shopify z realizacją DSers. Statusy sourcingu z 2026-11-01 są aktualizowane
w `docs/dsers-sourcing-status-2026-11-01.md`.

**Aktualny status:** pozycje **#1 Mulberry Silk Sleep Mask**,
**#2 Ceramic Ultrasonic Diffuser**, **#10 Scalp Massager Shampoo Brush**,
**#16 Floral Essential Oils Set** i **#19 Women's Plush Soft Robe** są ACTIVE
w Shopify, mają mapowania DSers, ceny w PLN i sprawdzony checkout; deployment
zweryfikowano na produkcji. Szlafrok #19 jest generycznym zamiennikiem,
nie produktem marki PAVILIA.
Pozycje **#3 Rose Quartz Gua Sha Set** i **#7 Natural Bristle Dry Brush**
zostały pominięte zgodnie ze zleceniem, ponieważ istnieją już aktywne produkty
Shopify. Z 22 niepominiętych pozycji pięć jest gotowych, a pozostałe 17 nie
jest gotowych do sprzedaży; 2 pozycje pominięto. Kandydat lub import DSers nie
potwierdza sam w sobie zgodności towaru, wyceny PL, mapowania ani checkoutu.
Najnowsza kontrola nie zakwalifikowała kandydatów #4, #5, #9 ani #14;
szczegółowe przeszkody oraz świeże stany Shopify są w rejestrze statusu.

Źródło listy: `lib/site-data.ts` (katalog Amazon, 24 produkty, dane
niezmienione, nadal schowane ze strony — patrz handoff z 2026-10-31).
Ceny to orientacyjne ceny z Amazon US (`status: "indicative"`, nie koszt
dostawcy) — służą tylko do oceny segmentu cenowego, nie do liczenia marży.

## Lista referencyjna i statusy

1. Mulberry Silk Sleep Mask *(GOTOWA — ACTIVE; 14 dostępnych wariantów, mapping i checkout zweryfikowane)*
2. Ceramic Ultrasonic Diffuser *(GOTOWY — produkt ACTIVE, mapowanie DSers i checkout zweryfikowano)*
3. Rose Quartz Gua Sha Set *(POMINIĘTY — istnieje aktywny produkt Shopify)*
4. Firming Body Massage Oil for Cellulite, Collagen Infused
5. Magnesium Bath Flakes Zechstein
6. RoC Retinol Night Serum Capsules
7. Natural Bristle Dry Brush *(POMINIĘTY — istnieje aktywny produkt Shopify)*
8. LED Face Mask, Red Light Therapy 850nm NIR
9. Weighted Blanket for Adults
10. Scalp Massager Shampoo Brush, Silicone *(GOTOWY — produkt ACTIVE, mapowanie DSers i checkout zweryfikowano)*
11. Biodance Bio-Collagen Face Mask
12. WoodWick Warm Woods Trilogy Candle
13. Niacinamide Face Serum 12% + Zinc 2%
14. 7-in-1 Facial Cleansing Brush
15. Bean Essence Exfoliating Treatment
16. Organic Aromatherapy Essential Oils Set *(GOTOWY jako Floral Essential Oils Set — ACTIVE; frontend oferuje tylko Floral)*
17. Pure Copper Water Bottle 34oz
18. Magnesium Glycinate Supplement
19. Women's Plush Soft Robe *(GOTOWY — generyczny szlafrok, nie PAVILIA; dostawca, Advanced Mapping i checkout zweryfikowano)*
20. Professional Derma Roller
21. Daily Moisturizing Body Oil Mist
22. AGE-R Booster Pro, 6-in-1 Skin Device *(wysoka cena bazowa — sprawdź, czy się opłaca, zanim zaczniesz szukać dostawcy)*
23. Rosemary Hair Oil for Growth
24. Collagen Peptides Powder

Szczegóły (kategoria, korzyść, orientacyjna cena) do każdej pozycji są w
tabeli niżej — otwórz ją tylko jeśli potrzebujesz kontekstu do konkretnego
produktu.

## Jak z tego korzystać

1. Dla nieweryfikowanych pozycji wyszukaj nazwę (po angielsku — tak szuka się
   na AliExpress) w DSers → "Find Suppliers" / wyszukiwarce AliExpress.
2. Sprawdź realny koszt produktu + koszt wysyłki do Polski u konkretnego
   dostawcy (nie cenę promocyjną wysyłki w interfejsie klienta Shopify).
3. Zastosuj próg cenowy z `AGENTS.md`: cena ≥ koszt produktu + wysyłki +
   80 PLN (albo +160 PLN, jeśli wysyłka z AliExpress jest wysoka) — nigdy
   nie zgaduj kosztu.
4. Po uzyskaniu pełnej weryfikacji zaimportuj i zmapuj wyłącznie pozycje
   zatwierdzone do sprzedaży. Pozycje #1, #2, #10, #16 i #19 mają już opis,
   cenę i mapowanie; nie powielaj ich importów. Olejki #16 storefront pokazuje
   wyłącznie jako Floral. Szlafrok #19 jest generycznym produktem, nie marką
   PAVILIA.
5. Pozycje oznaczone "⚠ już w Shopify" prawdopodobnie nie trzeba sourcować
   od zera — sprawdź, czy istniejący produkt już pokrywa tę potrzebę.

## Lista produktów (24)

| # | Nazwa (Amazon, do wyszukania) | Kategoria | Co robi | Cena Amazon US (orientacyjna) |
| - | --- | --- | --- | --- |
| 1 | Mulberry Silk Sleep Mask | self-care | Osłona oczu do snu, drzemki lub podróży | $17.99 — oferta Shopify ACTIVE, 129,99 PLN; 14 dodatnich wariantów, checkout zweryfikowany |
| 2 | Ceramic Ultrasonic Diffuser | spa-relax | Dyfuzor zapachowy, nastrojowe światło | $29.99 |
| 3 | Rose Quartz Gua Sha Set (BAIMEI) | skincare | Depuffing, lepsze wchłanianie kosmetyków | $14.99 — ⚠ już w Shopify (Rose Quartz Gua Sha & Jade Roller Set, aktywny) |
| 4 | Firming Body Massage Oil for Cellulite (collagen) | body-glow | Ujednolicenie, odżywienie skóry ciała | $24.99 |
| 5 | Magnesium Bath Flakes Zechstein | spa-relax | Relaks mięśni, lepszy sen | $34.99 |
| 6 | RoC Retinol Night Serum Capsules | skincare | Gładsza skóra przy regularnym retinolu | $26.99 — zwróć uwagę: inna forma (kapsułki) niż aktywne serum Vitamin C/Retinol w Shopify |
| 7 | Natural Bristle Dry Brush | body-glow | Suchy peeling, krążenie | $12.99 — ⚠ już w Shopify (Natural Bristle Spa Body Brush / Exfoliating Spa Body Brush, aktywne) |
| 8 | LED Face Mask, red/NIR light therapy | skincare | Terapia światłem, jaśniejsza skóra | $59.99 |
| 9 | Weighted Blanket for Adults | self-care | Wsparcie układu nerwowego, lepszy sen | $59.99 |
| 10 | Scalp Massager Shampoo Brush (silicone) | self-care | Rytuał mycia głowy jako relaks | $10.99 |
| 11 | Biodance Bio-Collagen Face Mask | skincare | Szybkie nawilżenie przed wyjściem | $24.99 — zwróć uwagę: inna forma (maska w płachcie) niż aktywna maska hydrożelowa z algami w Shopify |
| 12 | WoodWick Warm Woods Trilogy Candle | spa-relax | Nastrojowa świeca zapachowa | $34.99 |
| 13 | Naturium Niacinamide Face Serum 12% + Zinc 2% | skincare | Rozjaśnienie, wyrównanie tonu | $18.99 |
| 14 | COSLUS 7-in-1 Facial Cleansing Brush | skincare | Głębsze oczyszczanie, demakijaż | $19.99 |
| 15 | mixsoon Bean Essence Exfoliating Treatment | skincare | Delikatny peeling, poprawa tekstury | $28.99 |
| 16 | Cliganic Organic Aromatherapy Essential Oils Set (Amazon reference) | spa-relax | Zestaw zapachowy do dyfuzora | $22.99 — oferta Shopify ACTIVE jako generyczny EUQEE Floral Essential Oils Set, 139,99 PLN; wyłącznie wariant kwiatowy |
| 17 | 34oz Pure Copper Water Bottle Set | self-care | Rytuał nawodnienia, estetyczna butelka | $24.99 |
| 18 | Pure Encapsulations Magnesium (Glycinate) | self-care | Suplement, wsparcie snu — produkt spożywczy, inne wymogi (suplementy diety) | $34.99 |
| 19 | PAVILIA Premium Women's Plush Soft Robe (Amazon reference) | spa-relax | Szlafrok, komfort po kąpieli | $49.99 — oferta Shopify ACTIVE to generyczny zamiennik, nie PAVILIA; 179,99 PLN |
| 20 | Koi Beauty Professional Derma Roller | skincare | Mikronakłuwanie domowe, wchłanianie serum | $22.99 |
| 21 | Aveeno Daily Moisturizing Body Oil Mist | body-glow | Mgiełka olejkowa do ciała, nawilżenie | $12.99 |
| 22 | Medicube AGE-R Booster Pro, 6-in-1 | skincare | Urządzenie do pielęgnacji, wchłanianie, liftingujące | $299.00 — wysoka cena, sprawdź realny koszt dostawcy zanim zaczniesz sourcing |
| 23 | Botanic Hearth Rosemary Hair Oil for Growth | self-care | Olejek rozmarynowy na skalp i włosy | $14.99 |
| 24 | Orgain Collagen Peptides Powder | self-care | Kolagen w proszku — produkt spożywczy, inne wymogi | $24.99 |

## Uwagi

- Pozycje z suplementami/produktami spożywczymi (18, 24) mogą wymagać
  dodatkowych oznaczeń/zgodności (skład, alergeny, przepisy UE) — to
  osobna weryfikacja, nie tylko sourcing ceny.
- Pozycja 22 ma wysoką cenę bazową — zanim zaczniesz szukać dostawcy,
  zdecyduj, czy to ma sens przy regule +80/+160 PLN i konkurencji cenowej.
- Lista nie priorytetyzuje produktów — jeśli chcesz, mogę ułożyć kolejność
  np. według tego, które artykuły na blogu najczęściej odwiedzane/najbardziej
  dopasowane tematycznie, ale potrzebuję wtedy danych o ruchu (Google
  Analytics / Search Console), których nie mam w tej sesji.
