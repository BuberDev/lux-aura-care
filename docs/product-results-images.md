# Zdjęcia przed i po dla produktów

Dodawaj parę zdjęć bezpośrednio do katalogu `public/<handle-produktu>/`:

```text
public/professional-derma-roller/before.jpg
public/professional-derma-roller/after.jpg
```

Strona produktu rozpoznaje parę o tej samej nazwie i rozszerzeniu. Obsługiwane są `.webp`, `.jpg`, `.jpeg` i `.png`; sekcja pojawi się dopiero, gdy istnieją oba pliki. Dla kolejnych produktów stosuj identyczny układ, używając dokładnego handle z adresu strony.

Foldery znajdują się w `public/`, więc pliki będą dostępne publicznie. Dodawaj wyłącznie zdjęcia, które można zgodnie z prawdą pokazać jako efekt przed i po; zachowuj zgodę autora poza repozytorium. Po dodaniu pary zdjęć trzeba ponownie zbudować i wdrożyć stronę, aby sekcja pojawiła się na produkcji.
