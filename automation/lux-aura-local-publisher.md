# Generator grafik artykułu Lux Aura Care

Cel: wygenerować i ocenić autorską okładkę oraz 2–3 grafiki śródtekstowe dla artykułu przygotowanego już przez deterministyczny pipeline. Nie pisz, nie poprawiaj i nie publikuj artykułu. Priorytetem jest wiarygodność redakcyjna Lux Aura Care oraz pomoc czytelnikom w bezpiecznym wyborze produktów health, beauty i self-care.

Artykuł, metadane, podpisy i teksty alternatywne publikuj w profesjonalnym języku angielskim, zgodnie z anglojęzyczną stroną Lux Aura Care.

## Zasady bezwzględne

- Pracuj wyłącznie w bieżącym katalogu roboczym lokalnego publikatora Lux Aura Care. Nie przechodź do innych projektów ani katalogów użytkownika poza wynikami wbudowanego Imagegen.
- Nie używaj Vercel AI Gateway, Recraft ani zewnętrznego API obrazów. Użyj skillu `$imagegen` w domyślnym trybie wbudowanym.
- Nie odczytuj ani nie wypisuj wartości sekretów z `.env`. Plik może być przekazany wyłącznie procesowi przez `node --env-file`.
- Nie publikuj bez dokładnie jednej okładki, 2–3 grafik śródtekstowych oraz pozytywnej oceny każdej z nich.
- Grafika musi wyjaśniać temat bez podpisu. Odrzuć generyczne stockowe spa, stosy ręczników z przypadkowymi świecami, medyczne ujęcia before/after, igły, rany, wyolbrzymioną teksturę skóry, fałszywe opakowania, pseudo-naukowe molekuły i dekoracyjne wypełniacze.
- Nie generuj tekstu, logo, znaków towarowych ani opakowań konkretnych marek wewnątrz obrazu. Złota ramka Lux Aura Care jest nakładana później deterministycznie.
- Nie uruchamiaj `src/run.ts`, `src/publish-prepared.ts` ani żadnego innego procesu publikującego. Watchdog wykona przygotowanie i publikację poza sesją Codex.

## Procedura

1. Odczytaj `content-engine/out/run-status.json`, `content-engine/out/prepared.json` i `content-engine/out/visual-prompts.json`. Sprawdź, że status to `prepared`, tytuły artykułu są identyczne, manifest zawiera dokładnie jedną okładkę i 2–3 grafiki inline, a każda oczekiwana nazwa zaczyna się od `raw-` i kończy `.png`. Jeżeli walidacja nie przejdzie, zakończ z błędem.

2. Dla każdego elementu manifestu osobno wywołaj wbudowany Imagegen z dokładnym promptem z pola `prompt`. Wykonuj jedno wywołanie na jeden asset. Skopiuj wybrany plik PNG z katalogu wynikowego Codex do `content-engine/out/codex-visuals/<expectedFilename>`.

3. Obejrzyj każdą zapisaną grafikę w pełnym rozmiarze. Oceń w skali 1–10:

   - `semanticClarity`: czy bez podpisu jednoznacznie komunikuje konkretny mechanizm/porównanie z briefu,
   - `brandFit`: czy wygląda jak autorski premium editorial Lux Aura Care i trzyma ciepłą czarno-kremowo-szampańską paletę,
   - `originality`: czy nie wygląda jak stock, szablon lub typowa generyczna grafika AI.

   Każdy wynik musi wynosić co najmniej 8. Jeżeli nie wynosi, wygeneruj nową kompozycję z jedną precyzyjną korektą wynikającą z oceny. Po dwóch nieudanych poprawkach nie porzucaj całego artykułu: obowiązkowo zacznij od nowej, prostszej metafory wizualnej opartej na innym fakcie z tego samego promptu i wykonaj maksymalnie dwie kolejne próby. Nowa koncepcja nie może powtarzać elementów wskazanych wcześniej jako błędne. Zakończ błędem dopiero po wyczerpaniu obu koncepcji albo po twardym błędzie narzędzia. Nie obniżaj progu i nie zatwierdzaj obrazu, którego znaczenie wymaga zgadywania.

4. Po zaakceptowaniu wszystkich obrazów zapisz `content-engine/out/visual-review.json`:

   - `version`: 1,
   - `articleTitle`: dokładny tytuł z `prepared.json`,
   - `reviewedAt`: aktualny czas ISO,
   - `images`: po jednym obiekcie na asset z polami `id`, `approved`, `semanticClarity`, `brandFit`, `originality`, `notes`.

Wynik końcowy ma zawierać tytuł, liczbę przygotowanych grafik i krótkie uzasadnienie ich koncepcji. Nie zapisuj sekretów ani zawartości `.env` w pamięci automatyzacji.
