# Shopify / DSers — stan integracji

Aktualizacja: 2026-10-03. Sklep: Lux Aura Care (`imp082-pj`).

## Wyjątki i reguły właściciela

- **Lux Aura Face Roller & Gua Sha Set** (`lux-aura-face-roller-gua-sha-set`,
  Shopify `15816997568860`) to własny, markowy towar właściciela, kupiony
  w Chinach i wysyłany osobiście z domu. Oba warianty, Black Stone i Rose Quartz,
  są wyłączone z przypisywania dostawców DSers i automatyzacji cen dostawców.
  Zakup nadal odbywa się przez Shopify. Nie usuwać produktu ze sklepu.
- Produkt jest widoczny na liście DSers, ale bez dostawcy i bez mapowania.
  Sama obecność na liście nie oznacza realizacji przez DSers. Nie traktować
  tego wpisu jako brakującej integracji do uzupełnienia.
- Oddzielny `gua-sha-jade-roller-set` to inna pozycja katalogowa. Nie mylić
  jej z markowym zestawem właściciela.
- Pozostałe produkty nieafiliacyjne: Shopify + dostawcy AliExpress przez DSers.
- Nie zmieniać ocen, opinii, ich liczby ani komponentu awatarów klientów.
- Minimalny próg ceny uzgodniony z właścicielem: koszt danego wariantu
  i dostawy + 80 PLN. Nie obniżać wyższych cen. Dla własnego towaru potrzebne
  są rzeczywiste koszty właściciela, nie cena zastępczej oferty AliExpress.

## Zapisane zmiany w DSers

1. Zaimportowano istniejące aktywne produkty Shopify: Clear Skin Patches,
   Rose Quartz Gua Sha & Jade Roller Set i Centella Collagen Sleep Masks.
   Nie tworzono nowych produktów Shopify ani nie przywracano archiwalnych.
2. Poprawiono i zapisano mapowanie sukienki do AliExpress
   `1005006058910366`: 14 wzorów/kolorów × 8 rozmiarów, 112 kombinacji.
   Ponowne otwarcie potwierdziło zapis opcji. Nie wykonano próbnego zamówienia.
3. Przypisano Clear Skin Patches do AliExpress `1005012298976098`:
   Shopify `24 Patches` → dostawca `24PCS`. Zapis sprawdzony po ponownym
   otwarciu. Nie dodano wariantu 48 szt. Weryfikacja 2026-10-03: SKU 24PCS,
   dostawa do Polski AliExpress Selection Standard 0,99 USD, szacunkowo
   6–12 dni. Rynek referencyjny ceny w DSers zmieniono z US na PL; odczyt
   po ponownym załadowaniu potwierdził PL i zakres 2,32–2,92 USD.

### Mapowanie kolorów sukienki

| Opcja Shopify | Opcja dostawcy |
| --- | --- |
| Green short | Green short |
| Red long | Red long |
| Red short | Red short |
| Bodian short | Black point short |
| Pink short | Pink short |
| White long | Black white long |
| Black short | leaves green short |
| White short | Black white short |
| Pink long | Pink long |
| Green long | Green long |
| Bodian long | Black point long |
| Fangge-CX long | Color bar long |
| Fangge-CX short | Color bar short |
| Black long | leaves green long |

Rozmiary: S, M, L, XL, 2XL, 3XL, 4XL, 5XL — mapowanie jeden do jednego.

## Pozostałe produkty

DSers pokazuje 13 produktów: 9 z dostawcą AliExpress, 4 bez mapowania.
Jedna z tych czterech pozycji to celowy wyjątek właściciela.

| Produkt | AliExpress | Stan |
| --- | --- | --- |
| Serum Vitamin C + Retinol | 1005010124931829 | Istniejące 30 ml → 30ml-30ml; 60 ml → 60ml-60ml |
| Resin Body Gua Sha | 1005010109598612 | Istniejące Grey, wysyłka z Chin |
| Vibro-Glow | 1005012249952447 | Istniejące MULTI |
| Gold Eye Patches | 1005009076693593 | Istniejące 60pcs |
| Exfoliating Spa Body Brush | 1005007943746291 | Istniejące Color A |
| Ice Face Roller & Gua Sha | 1005012331640649 | Widoczne Black A set; zawartość zestawu wymaga potwierdzenia |
| Seaweed Collagen Mask | 1005007856898949 | Istniejące 5-Pack → Seaweed Collagen |
| Clear Skin Patches | 1005012298976098 | Nowe mapowanie 24PCS, zapisane |
| Floral Grace dress | 1005006058910366 | Poprawione mapowanie 112 kombinacji, zapisane |
| Rose Quartz Gua Sha & Jade Roller Set | — | Nieprzypisany; zweryfikować materiał i zawartość |
| Centella Collagen Sleep Masks, 30 szt. | — | Nieprzypisany; znalezione oferty 5/20 szt. nie są odpowiednikiem |
| Natural Bristle Spa Body Brush | — | Nieprzypisany; brak potwierdzonej szczotki z odpinaną długą rączką |
| Lux Aura Face Roller & Gua Sha Set | — | **Własna wysyłka właściciela; nie integrować z DSers** |

Odczyt istniejącego mapowania nie jest testem złożenia i realizacji zamówienia.

## Ceny — pięć korekt zapisanych, pozostałe wymagają weryfikacji

Właściciel doprecyzował: przy drogiej dostawie AliExpress należy podwoić
minimalną kwotę pozostającą po koszcie produktu i dostawy, z 80 do 160 PLN.
Nie podał sztywnego progu kosztu wysyłki uruchamiającego tę regułę.
Nie utożsamiać opłaty pobieranej od klienta z kosztem dostawcy.

- Zapisano i potwierdzono w Shopify pięć podwyżek (PLN); usunięto przy nich
  nieaktualną cenę przekreśloną. Żadnej ceny nie obniżono w tej korekcie.

| Produkt / wariant | Przed → po | Koszt produktu USD | Dostawa do PL USD | Koszt łączny PLN, zaokrąglony w górę | Kwota po tych kosztach PLN |
| --- | --- | --- | --- | --- | --- |
| Clear Skin Patches / 24PCS | 14,99 → 99,99 | 2,92¹ | 0,99 | 15,21 | 84,78 |
| Gold Eye Patches / 60pcs | 18,99 → 109,99 | 6,08 | 0,99 | 27,49 | 82,50 |
| Exfoliating Spa Body Brush / Color A | 65,86 → 109,99 | 5,51¹ | 0,99 | 25,28 | 84,71 |
| Seaweed Collagen Mask / 5 × 30 ml | 116,00 → 129,99 | 11,76¹ | 0,99 | 49,58 | 80,41 |
| Floral Grace / wszystkie 112 kombinacji | 24,99 → 229,99 | 4,86¹ | 12,62 | 67,97 | 162,02 |

¹ Przyjęto górną granicę zakresu produktu w DSers (plastry 2,32–2,92 USD;
szczotka 4,83–5,51 USD;
maski 10,45–11,76 USD; sukienka 3,64–4,86 USD), nie niepotwierdzoną cenę konkretnego SKU. Koszt
dostawy sprawdzono dla przypisanego SKU i Polski: AliExpress Selection
Standard. To szacunki DSers odczytane 2026-10-03, nie gwarancja przyszłego
kosztu zamówienia. Kurs NBP 3,8881 PLN/USD, tabela 192/A/NBP/2026 z 2026-10-02.
Wymagają ponownej kontroli przed kolejną zmianą ceny. Powyższe kwoty nie
oznaczają zysku netto po podatkach, prowizjach i innych kosztach.

- Zaktualizowano lokalny snapshot dopiero po potwierdzeniu zapisów Shopify.
  Zawiera 126 wariantów, w tym wszystkie 112 kombinacji sukienki.
- Nie skonfigurowano jeszcze pełnego, automatycznego zabezpieczenia 80 PLN.
- Testowana funkcja `lib/shop-pricing-policy.ts` odrzuca brakujące lub stare
  wyceny, niewłaściwy SKU, kraj, ilość w opakowaniu i kurs. Nie jest jeszcze
  automatyzacją Shopify/DSers i nie dowodzi rentowności całego katalogu.
- DSers wyświetlił płatny plan Advanced przy próbie reguły obejmującej koszt
  dostawy. Nie aktywowano abonamentu ani okresu próbnego i nie zapisano reguły.
- Kurs widoczny w DSers podczas kontroli: 1 USD = 3,895733 PLN. To odczyt
  historyczny, nie stała do stosowania przy kolejnych zmianach cen.
- Sukienka: indywidualnie odczytano wszystkie 112 SKU dla Polski. Każdy
  zwrócił AliExpress standard shipping 12,62 USD, 10–21 dni. Przejściowe
  odpowiedzi „No Shipping” sprawdzono ponownie i uzyskano wyceny.
  Zastosowano ręcznie regułę 160 PLN, bo rzeczywista wycena wysyłki
  przekracza górny koszt samej sukienki; nie wprowadzono automatycznego progu.
  Pełny audyt i kopia poprzednich cen: `dress-pricing-audit-2026-10-03.json`
  oraz `dress-prices-backup-2026-10-03.json`.

### Naprawa opublikowanej ceny i zdjęć sukienki

- Usunięto błędną bazę 24,99 USD. Cena 229,99 PLN jest zgodna w Shopify,
  lokalnym snapshotcie, publicznej stronie PL/EN i kasie. Nie obniżono
  żadnego innego produktu. Poprzednio publiczna strona przeliczała 24,99 USD
  na około 97,16 PLN, a Shopify pobierał tylko 24,99 PLN.
- Żaden wariant nie miał zdjęcia w Shopify. Dodano 14 zdjęć już używanych
  w galerii strony i przypisano właściwe media do wszystkich 112 wariantów.
  Nie usunięto starych mediów, nie zmieniono SKU, opcji, ocen ani opinii.
  Kopia i wynik: `dress-media-backup-2026-10-03.json`,
  `dress-media-mapping-2026-10-03.json`.
- Rzeczywista kasa: Green long / 5XL, ilość 1, 229,99 PLN, poprawne zdjęcie
  turkusowej sukienki z długim rękawem. Bez danych klienta i bez zamówienia.
- Wdrożenie `dpl_GBkjpzRshWGFcpQHJv2yQQkacVip` jest READY na domenie sklepu.
  Obejmuje tylko cenę sukienki i komunikat dostawy standardowej do Polski,
  bez obietnicy 24–48 h. Pozostałe lokalne zmiany nie zostały opublikowane.
- Test 112 wariantów poprawki, 22 testy lokalnego katalogu/logiki, TypeScript,
  ESLint i build 83 stron przeszły. Skan wdrożenia nie wykazał HTTP 5xx.
  Logi zawierają istniejące ostrzeżenie biblioteki PostgreSQL o przyszłej
  semantyce sslmode (odpowiedzi HTTP 200), nie błąd kompilacji lub zakupu.
  Nowa kontrola mobilnego viewportu w Chrome była niedostępna; nie traktować
  jej jako zaliczonej. Układ wariantów nie był zmieniany w tej poprawce.
- Cena produktu w wynikach wyszukiwania, promocyjne 0,99 USD dostawy oraz
  koszt wyświetlany dla rynku US nie zastępują wyceny właściwego wariantu,
  kraju i metody dostawy.

## Strona sklepu

### Polskie nazwy w Shopify — zapisane 2026-10-03

Odczyt `shopLocales` potwierdził, że `pl` jest jedynym włączonym, opublikowanym
i głównym językiem Shopify. Mimo tego bazowe tytuły były po angielsku.
Zapisano 13 polskich tytułów zgodnych ze storefrontem. Kopia poprzednich
nazw: `shopify-titles-backup-2026-10-03.json`. Aktualizacja dotyczyła wyłącznie
tytułów — bez cen, wariantów, identyfikatorów, opisów, opinii i realizacji.
DSers po odświeżeniu pokazał nowe nazwy, zachowując 9 mapowań i 4 pozycje
bez mapowania (w tym własny zestaw). W prawdziwej kasie Shopify potwierdzono
polską nazwę serum, wariant 60 ml, ilość 1 i cenę 217,99 PLN. Nie podawano
danych klienta i nie składano zamówienia. Angielski język produktów w kasie
Shopify wymaga odrębnego włączenia i tłumaczeń; nie zmieniono listy języków.

### Ostatnia kontrola lokalna

- 21 testów logiki cen, katalogu i wyboru wariantu: zaliczone.
- TypeScript, ukierunkowany ESLint, `git diff --check`, build 83 stron: zaliczone.
- 13 stron PL przy 390 px i 13 stron EN przy 1728 px: po zakończeniu
  sprawdzania dostępności każda ma trzy zgodne CTA zakupu i brak poziomego
  przepełnienia. Sprawdzono także EN przy 390 px.
- Poprawiono nazwę pojemności w CTA serum, polskie nazwy wykończenia i
  płatków, nazwę marki w stopce oraz etykiety stylizacji zamiast pielęgnacji
  na stronie sukienki. Oceny, opinie i awatary pozostają bez zmian.
- Narzędzie przeglądarki blokuje stronę specyfikacji AliExpress ze względów
  bezpieczeństwa. Nie obchodzono blokady. Poproszono właściciela o dokumenty
  dostawców dla trzech nieprzypisanych produktów oraz wcześniej o koszty
  własnego zestawu. Nie przypisano niezweryfikowanych zamienników.

### Audyt dostawy Shopify — 2026-10-03

Odczyt całego profilu ogólnego `147735806300` przez Admin API potwierdził:

| Strefa | Metoda | Cena dla klienta | Warunki |
| --- | --- | --- | --- |
| Polska | Darmowa | 0 PLN | Aktywna, bez progu |
| Polska | Ekspresowa | 65 PLN | Aktywna, bez progu |
| International (27 krajów) | International | 71 PLN | Aktywna, bez progu |

Brak dalszych stron profili, stref i metod. Stawka International nie jest
kosztem AliExpress. Nie zmieniono profilu dostawy. Zamiar właściciela to
bezpłatny standard, jednak aktualna konfiguracja zagraniczna różni się od
tego zamiaru. Odpowiedź na pytanie o zmianę 71 → 0 PLN dotyczyła zwiększenia
marży przy drogim transporcie; nie potwierdziła jednoznacznie zmiany stawki.
Do czasu rozstrzygnięcia komunikat w obu językach mówi o bezpłatnym standardzie
do Polski. Przywrócono komponent w hero i zgodną sekcję dostawy. Usunięto
z samego komponentu niepotwierdzone obietnice nadania w 24–48 h.

Porównanie obrazów serum ma widok obok siebie i suwak 0–100%, pełny kadr
`object-contain`, sterowanie klawiaturą oraz widoczne oznaczenie wizualizacji AI.
Nie jest dowodem efektów produktu. Dla pozostałych produktów nadal brak
udokumentowanych par zdjęć; opis porównania pielęgnacji nie zastępuje takich
materiałów. Nie publikować go jako dowodu skuteczności.

Zmiany Product Page Engine oraz obsługa cen są lokalne, nieopublikowane.
Zestaw właściciela ma `fulfillment: "owner"`; sekcja dostawy PL/EN opisuje
osobiste pakowanie i wysyłkę, bez obietnicy niepotwierdzonego terminu.
TypeScript i ukierunkowany ESLint przeszły. Polski komunikat o własnej
wysyłce sprawdzono na stronie lokalnej. Pełna kontrola wszystkich stron,
wariantów, urządzeń i przepływów checkout pozostaje do wykonania.

Dodano test integralności wszystkich 126 wyborów zakupowych: unikalny wariant
Shopify, cena PLN zgodna ze snapshotem, brak kraju dostawy wywiedzionego z
języka, 14 × 8 opcji sukienki, osobne 30/60 ml i wyjątek własnej wysyłki.
Na telefonie 390 px wybór sukienki Green long / 5XL aktualizuje wszystkie
trzy CTA identycznie; etykiety rozmiarów nie nakładają się, strona nie ma
poziomego przepełnienia. To kontrola lokalna, nie test opłacenia zamówienia.

Kontrola ostatnich poprawek: build przeszedł (83 strony), TypeScript i ESLint
bez błędów. Na serum sprawdzono PL/EN, skok z hero do porównania i dostawy,
suwak klawiaturą oraz przyciski pełnego obrazu (100% / 0%). Widok desktop
nie ma poziomego przepełnienia; oba obrazy są załadowane, `object-fit: contain`.
Wizualnie sprawdzono porównanie w ramkach 320, 390 i 768 px. Tymczasową stronę
testową usunięto po kontroli. Oceny, opinie i komponent awatarów bez zmian.
