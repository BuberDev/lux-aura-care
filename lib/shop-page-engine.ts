import type { Locale } from "@/lib/i18n/config";

type Copy = { en: string; pl: string };
const c = (en: string, pl: string): Copy => ({ en, pl });
type Profile = {
  problem: Copy;
  context: Copy;
  solution: Copy;
  description: Copy;
  benefits: [Copy, Copy, Copy];
  before: Copy;
  after: Copy;
  alternative: Copy;
  comparison: [Copy, Copy, Copy][];
  use: Copy;
};
type ProductFaq = { q: string; a: string };

// Editorial comparisons describe the use case, not measured efficacy or customer results.
// Add photographic before/after evidence only when its source and conditions are documented.
const profiles: Record<string, Profile> = {
  "clear-skin-patches": {
    problem: c("A blemish is hard to leave alone.", "Niedoskonałość, której trudno nie dotykać."),
    context: c("Touching a spot can become an unconscious habit, especially during a busy day.", "W pracy, przed lustrem, w ciągu dnia — łatwo odruchowo dotykać tego samego miejsca."),
    solution: c("Cover it. Carry on with your day.", "Osłoń niedoskonałość i wróć do swojego dnia."),
    description: c("A pack of 24 hydrocolloid patches for targeted coverage of individual blemishes. A small, straightforward addition to your skincare shelf.", "24 plastry hydrokoloidowe do punktowego osłaniania niedoskonałości. Prosty krok pielęgnacyjny, który nie wymaga nakładania kosmetyku na całą twarz."),
    benefits: [c("Targeted coverage", "Punktowe zastosowanie"), c("A physical barrier against touching", "Osłona przed odruchowym dotykaniem"), c("24 patches in one pack", "24 plastry w opakowaniu")],
    before: c("The spot is exposed and easy to touch.", "Odkryta niedoskonałość, którą łatwo dotknąć."),
    after: c("The patch covers the area while you get on with your routine.", "Miejsce jest osłonięte plastrem podczas codziennych zajęć."),
    alternative: c("Spot cream", "Kosmetyk punktowy"),
    comparison: [[c("Application", "Aplikacja"), c("A single patch", "Pojedynczy plaster"), c("A layer of product", "Warstwa kosmetyku")], [c("Coverage", "Osłona"), c("Physical cover", "Fizyczne osłonięcie"), c("Depends on the formula", "Zależy od formuły")], [c("After use", "Po użyciu"), c("Remove and discard", "Zdejmij i wyrzuć"), c("Follow the product directions", "Zgodnie z instrukcją kosmetyku")]],
    use: c("Apply to clean, dry skin. Follow the wear time on the pack and remove gently.", "Naklej na czystą, suchą skórę. Przestrzegaj czasu podanego na opakowaniu i zdejmuj delikatnie."),
  },
  "gold-eye-patches": {
    problem: c("Your eye-care step deserves a moment of its own.", "Okolica oczu zasługuje na chwilę uwagi."),
    context: c("A rushed routine leaves little time for a focused skincare pause.", "W pośpiechu pielęgnacja okolicy oczu często kończy się na szybkim nałożeniu kremu."),
    solution: c("A cooling pause, one pair at a time.", "Chwila chłodzącej pielęgnacji, para po parze."),
    description: c("60 gold-toned hydrogel eye patches: 30 pairs for a focused under-eye skincare step, at home or before getting ready.", "60 hydrożelowych płatków w złotym odcieniu, czyli 30 par do pielęgnacji okolicy pod oczami. Wygodny etap domowej pielęgnacji lub przygotowania do wyjścia."),
    benefits: [c("Shaped for the under-eye area", "Kształt dopasowany pod oczy"), c("Hydrogel contact", "Hydrożel przylegający do skóry"), c("30 pairs per pack", "30 par w opakowaniu")],
    before: c("Your usual routine, without a dedicated under-eye pause.", "Codzienna pielęgnacja bez osobnego etapu pod oczy."),
    after: c("A pair of patches adds a focused skincare pause.", "Para płatków uzupełnia pielęgnację o chwilę uwagi dla okolicy oczu."),
    alternative: c("Eye cream", "Krem pod oczy"),
    comparison: [[c("Format", "Forma"), c("A shaped pair of patches", "Wyprofilowana para płatków"), c("Cream applied by hand", "Krem nakładany palcami")], [c("Routine", "Pielęgnacja"), c("A timed session", "Etap o określonym czasie"), c("Usually left on the skin", "Zwykle pozostaje na skórze")], [c("Quantity", "Ilość"), c("30 pairs", "30 par"), c("Depends on pack size", "Zależy od pojemności")]],
    use: c("Apply to the clean under-eye area and remove after the time stated on the pack. Do not extend wear overnight unless the label permits it.", "Nałóż na oczyszczoną okolicę pod oczami i zdejmij po czasie wskazanym na opakowaniu. Nie pozostawiaj na noc, jeśli producent tego nie zaleca."),
  },
  "gua-sha-jade-roller-set": {
    problem: c("Skincare can be more than a quick application.", "Pielęgnacja może być czymś więcej niż szybkim nałożeniem serum."),
    context: c("Sometimes the missing step is a quiet moment to slow down and focus on your face.", "Czasem brakuje po prostu spokojnej chwili i masażu, który łatwo włączyć do wieczornej pielęgnacji."),
    solution: c("Two shapes. Your own pace.", "Dwa narzędzia, Twoje tempo."),
    description: c("A facial roller and gua sha tool for gentle massage over facial oil or serum. Alternate rolling motions with slow, controlled glides.", "Roller i płytka gua sha do delikatnego masażu twarzy z olejkiem lub serum. Łącz rolowanie z powolnymi, kontrolowanymi ruchami płytki."),
    benefits: [c("Roller and gua sha together", "Roller i gua sha w zestawie"), c("Manual pressure control", "Pełna kontrola nacisku"), c("No charging required", "Bez ładowania")],
    before: c("Oil or serum applied by hand.", "Olejek lub serum nałożone dłońmi."),
    after: c("A gentle massage adds a considered finishing step.", "Delikatny masaż staje się spokojnym zakończeniem pielęgnacji."),
    alternative: c("Massage by hand", "Masaż dłońmi"),
    comparison: [[c("Contact", "Kontakt ze skórą"), c("Roller and shaped edges", "Wałek i profilowane krawędzie"), c("Fingertips and palms", "Opuszki i dłonie")], [c("Power", "Zasilanie"), c("Manual", "Ręczne"), c("Manual", "Ręczne")], [c("Care", "Czyszczenie"), c("Clean tools after use", "Oczyść narzędzia po użyciu"), c("Wash hands before use", "Umyj dłonie przed masażem")]],
    use: c("Apply oil or serum for slip. Use light, slow strokes and clean both tools afterwards.", "Nałóż olejek lub serum zapewniające poślizg. Wykonuj lekkie, powolne ruchy i oczyść oba narzędzia po użyciu."),
  },
  "lux-aura-face-roller-gua-sha-set": {
    problem: c("A routine you enjoy is easier to return to.", "Do przyjemnej pielęgnacji łatwiej wracać."),
    context: c("A well-chosen tool can make your daily oil or serum step feel more intentional.", "Dobrane do Ciebie narzędzie sprawia, że codzienna aplikacja olejku lub serum zyskuje nowy wymiar."),
    solution: c("Your finish. Your face-massage moment.", "Twoje wykończenie. Twój moment na masaż twarzy."),
    description: c("Choose the black or rose finish of the Lux Aura Care roller and gua sha duo. Two complementary tools for a simple manual face massage.", "Wybierz czarne lub różowe wykończenie duetu Lux Aura Care. Roller i gua sha to dwa uzupełniające się narzędzia do prostego, ręcznego masażu twarzy."),
    benefits: [c("Two matching tools", "Dwa dopasowane narzędzia"), c("Two finishes to choose from", "Dwa wykończenia do wyboru"), c("A double-ended roller", "Roller z dwiema końcówkami")],
    before: c("Your usual serum or oil application.", "Twoja codzienna aplikacja serum lub olejku."),
    after: c("A rolling step and a gua sha glide complete the experience.", "Rolowanie i masaż płytką dopełniają pielęgnację."),
    alternative: c("A single roller", "Sam roller"),
    comparison: [[c("Tools", "Narzędzia"), c("Roller + gua sha", "Roller + gua sha"), c("Roller", "Roller")], [c("Technique", "Technika"), c("Rolling and gliding", "Rolowanie i przesuwanie płytki"), c("Rolling", "Rolowanie")], [c("Power", "Zasilanie"), c("Not needed", "Nie wymaga"), c("Not needed for manual rollers", "Nie wymaga w wersji ręcznej")]],
    use: c("Use over oil or serum, starting with the roller. Keep the gua sha nearly flat and pressure light.", "Masuj skórę z olejkiem lub serum, zaczynając od rollera. Płytkę gua sha trzymaj niemal płasko i stosuj lekki nacisk."),
  },
  "vibro-glow-face-massager": {
    problem: c("Want a different feel from a manual roller?", "Szukasz innego odczucia niż masaż rollerem?"),
    context: c("A compact vibrating tool adds a different type of contact to your usual facial massage.", "Kompaktowy masażer wibracyjny pozwala urozmaicić codzienny masaż twarzy."),
    solution: c("A T-bar made for slow, simple strokes.", "Końcówka T do spokojnych, prostych ruchów."),
    description: c("A compact T-bar facial massager for a short massage over a suitable facial oil or serum. You control the pace and pressure.", "Kompaktowy masażer twarzy z końcówką T do krótkiego masażu z odpowiednim olejkiem lub serum. Ty dobierasz tempo i nacisk."),
    benefits: [c("T-bar contact surface", "Powierzchnia masująca w kształcie T"), c("Compact format", "Kompaktowy format"), c("Easy to pair with your routine", "Łatwe włączenie do pielęgnacji")],
    before: c("A skincare step without a massage tool.", "Pielęgnacja bez użycia masażera."),
    after: c("A short, controlled vibrating massage.", "Krótki, kontrolowany masaż wibracyjny."),
    alternative: c("Manual gua sha", "Ręczna płytka gua sha"),
    comparison: [[c("Movement", "Ruch"), c("Vibration with guided strokes", "Wibracje i prowadzone ruchy"), c("Hand-guided glides", "Ruch płytki prowadzony dłonią")], [c("Contact", "Końcówka"), c("T-bar", "W kształcie T"), c("Shaped edges", "Profilowane krawędzie")], [c("Preparation", "Przygotowanie"), c("Follow power instructions", "Zgodnie z instrukcją zasilania"), c("No power needed", "Bez zasilania")]],
    use: c("Prepare the device according to its instructions. Apply a suitable oil or serum and guide the head gently; do not press on the eyes.", "Przygotuj urządzenie zgodnie z instrukcją. Nałóż odpowiedni olejek lub serum i delikatnie prowadź końcówkę; nie naciskaj na oczy."),
  },
  "centella-collagen-sleep-masks": {
    problem: c("Make room for a calmer evening step.", "Zadbaj o spokojne zakończenie dnia."),
    context: c("An elaborate evening routine can be difficult to keep up with.", "Rozbudowana wieczorna pielęgnacja nie zawsze mieści się w codziennym planie."),
    solution: c("A dedicated mask step, ready when you are.", "Etap z maską, gotowy wtedy, kiedy Ty."),
    description: c("A 30-piece mask pack for your evening skincare routine. Follow the individual packaging for application, wear time and removal.", "Zestaw 30 masek do wieczornej pielęgnacji. Sposób aplikacji, czas stosowania i usuwania sprawdź na opakowaniu wybranej maski."),
    benefits: [c("30 pieces per pack", "30 sztuk w zestawie"), c("A dedicated evening step", "Osobny etap wieczornej pielęgnacji"), c("Easy to plan into your week", "Łatwe planowanie pielęgnacji")],
    before: c("An evening routine with no mask step.", "Wieczorna pielęgnacja bez etapu z maską."),
    after: c("A mask session, used as directed, completes your routine.", "Maska zastosowana zgodnie z instrukcją uzupełnia pielęgnację."),
    alternative: c("A single mask", "Pojedyncza maska"),
    comparison: [[c("Pack", "Opakowanie"), c("30 pieces", "30 sztuk"), c("One piece", "Jedna sztuka")], [c("Planning", "Planowanie"), c("A supply for repeat sessions", "Zapas na kolejne aplikacje"), c("One session", "Jedna aplikacja")], [c("Wear time", "Czas stosowania"), c("As directed on the pack", "Zgodnie z opakowaniem"), c("As directed on the pack", "Zgodnie z opakowaniem")]],
    use: c("Read the pack and ingredient list before use. Apply as directed; overnight wear is appropriate only when the product label explicitly allows it.", "Przed użyciem przeczytaj instrukcję i skład. Pozostawienie na noc jest właściwe wyłącznie wtedy, gdy wyraźnie dopuszcza je etykieta produktu."),
  },
  "vitamin-c-retinol-serum-duo": {
    problem: c("Two formulas. When does each one fit?", "Dwie formuły. Kiedy po którą sięgnąć?"),
    context: c("Adding another serum is easier when every step has a clear place in your day.", "Nowe serum łatwiej włączyć do pielęgnacji, gdy każdy krok ma swoje miejsce w ciągu dnia."),
    solution: c("A clear morning-and-evening pairing.", "Przemyślany duet na rano i wieczór."),
    description: c("Vitamin C for the morning routine and retinol for the evening. Choose your 30 ml or 60 ml variant and follow the directions for each formula.", "Witamina C do porannej pielęgnacji i retinol na wieczór. Wybierz wariant 30 ml lub 60 ml i stosuj każdą formułę zgodnie z jej instrukcją."),
    benefits: [c("Separate day and night steps", "Osobne kroki na dzień i noc"), c("30 ml and 60 ml options", "Warianty 30 ml i 60 ml"), c("One coordinated duo", "Dwa sera w jednym zestawie")],
    before: c("Actives without a clear place in your routine.", "Składniki aktywne bez wyraźnego miejsca w pielęgnacji."),
    after: c("A defined day-and-night sequence, adjusted to your skin's tolerance.", "Uporządkowana pielęgnacja dzienna i wieczorna, dopasowana do tolerancji skóry."),
    alternative: c("One serum", "Pojedyncze serum"),
    comparison: [[c("Routine", "Pielęgnacja"), c("Morning and evening steps", "Etap poranny i wieczorny"), c("One formula's application", "Zastosowanie jednej formuły")], [c("Formulas", "Formuły"), c("Vitamin C + retinol", "Witamina C + retinol"), c("Depends on your choice", "Zależy od wybranego serum")], [c("Introduction", "Wprowadzanie"), c("Introduce formulas individually", "Wprowadzaj formuły osobno"), c("Follow the product label", "Zgodnie z etykietą")]],
    use: c("Follow each serum's directions. Introduce retinol gradually, monitor tolerance and include daily sun protection in your routine.", "Przestrzegaj instrukcji każdego serum. Retinol wprowadzaj stopniowo, obserwuj tolerancję skóry i pamiętaj o codziennej ochronie przeciwsłonecznej."),
  },
  "resin-body-gua-sha-tool": {
    problem: c("Small facial tools are awkward for larger areas.", "Mała płytka do twarzy bywa niewygodna na większych partiach ciała."),
    context: c("Thighs, calves and arms call for a shape you can comfortably hold and guide.", "Uda, łydki i ramiona wymagają narzędzia, które wygodnie chwycisz i poprowadzisz."),
    solution: c("A larger shape for body massage.", "Większy format do masażu ciała."),
    description: c("A resin gua sha board designed for body massage with oil. Its broad profile supports slow, controlled strokes over larger areas.", "Płytka gua sha z żywicy do masażu ciała z olejkiem. Szeroki profil ułatwia powolne, kontrolowane ruchy na większych partiach ciała."),
    benefits: [c("Body-sized profile", "Format do ciała"), c("Lightweight resin", "Lekka żywica"), c("Hand-controlled pressure", "Nacisk kontrolowany dłonią")],
    before: c("Body oil applied without a massage tool.", "Olejek rozprowadzony bez narzędzia do masażu."),
    after: c("A dedicated body-massage step with slow gliding strokes.", "Osobny etap masażu ciała z powolnym przesuwaniem płytki."),
    alternative: c("Facial gua sha", "Gua sha do twarzy"),
    comparison: [[c("Area", "Przeznaczenie"), c("Body", "Ciało"), c("Face", "Twarz")], [c("Profile", "Profil"), c("Broad surface", "Szeroka powierzchnia"), c("Smaller contours", "Mniejsze łuki i krawędzie")], [c("Technique", "Technika"), c("Long, gentle strokes with oil", "Długie, delikatne ruchy z olejkiem"), c("Shorter facial strokes", "Krótsze ruchy na twarzy")]],
    use: c("Apply body oil for slip and use light, comfortable pressure. Avoid irritated or injured skin; stop if massage hurts.", "Nałóż olejek dla poślizgu i stosuj lekki, komfortowy nacisk. Omijaj podrażnioną lub uszkodzoną skórę; przerwij masaż, jeśli boli."),
  },
  "natural-bristle-spa-brush": {
    problem: c("Some areas are simply harder to reach.", "Do niektórych miejsc po prostu trudniej sięgnąć."),
    context: c("A small handheld brush can make back care uncomfortable.", "Mała szczotka trzymana w dłoni nie zawsze pozwala wygodnie zadbać o plecy."),
    solution: c("Extra reach when you need it.", "Większy zasięg wtedy, kiedy go potrzebujesz."),
    description: c("A body brush with a detachable long handle. Use the handle for reach or the brush head for closer control.", "Szczotka do ciała z odczepianą długą rączką. Używaj uchwytu, aby sięgnąć dalej, lub samej główki, gdy zależy Ci na precyzyjnym prowadzeniu."),
    benefits: [c("Detachable handle", "Odczepiana rączka"), c("Easier back access", "Wygodniejszy dostęp do pleców"), c("Two ways to hold it", "Dwa sposoby trzymania")],
    before: c("Back care with a short-reach handheld tool.", "Pielęgnacja pleców narzędziem o krótkim zasięgu."),
    after: c("The long handle helps you reach those areas more comfortably.", "Długa rączka pomaga wygodniej dotrzeć do trudniej dostępnych miejsc."),
    alternative: c("Handheld brush", "Szczotka bez rączki"),
    comparison: [[c("Reach", "Zasięg"), c("Extended with the handle", "Przedłużony dzięki rączce"), c("Within arm's reach", "W zasięgu dłoni")], [c("Grip", "Chwyt"), c("Handle or brush head", "Rączka lub główka"), c("Brush head", "Główka szczotki")], [c("Storage", "Przechowywanie"), c("Detach and dry thoroughly", "Odłącz i dokładnie wysusz"), c("Dry thoroughly", "Dokładnie wysusz")]],
    use: c("Follow the brush's dry/wet-use instructions and start with light pressure. Clean and dry completely after use.", "Stosuj na sucho lub mokro zgodnie z instrukcją szczotki i zacznij od lekkiego nacisku. Po użyciu oczyść i dokładnie wysusz."),
  },
  "exfoliating-spa-body-brush": {
    problem: c("A wet brush should be easy to hold.", "Mokrą szczotkę trzeba móc pewnie trzymać."),
    context: c("In the shower, a comfortable grip matters as much as the brushing surface.", "Pod prysznicem wygodny chwyt jest równie ważny jak powierzchnia szczotkująca."),
    solution: c("A simple addition to your shower shelf.", "Proste uzupełnienie pielęgnacji pod prysznicem."),
    description: c("A handheld body brush with a strap for a more secure grip during shower care. Work gently and let it dry fully between uses.", "Szczotka do ciała z paskiem na dłoń, który ułatwia chwyt podczas kąpieli. Stosuj delikatnie i pozostawiaj do pełnego wyschnięcia między użyciami."),
    benefits: [c("Hand strap", "Pasek na dłoń"), c("Compact brush head", "Kompaktowa główka"), c("Made for body care", "Przeznaczona do ciała")],
    before: c("Body cleansing using your hands alone.", "Mycie ciała wyłącznie dłońmi."),
    after: c("A controlled brushing step within your shower routine.", "Kontrolowany etap szczotkowania podczas kąpieli."),
    alternative: c("Long-handle brush", "Szczotka z długą rączką"),
    comparison: [[c("Grip", "Chwyt"), c("Strap around the hand", "Pasek na dłoń"), c("Long handle", "Długa rączka")], [c("Reach", "Zasięg"), c("Within arm's reach", "W zasięgu dłoni"), c("Extended reach", "Przedłużony zasięg")], [c("Control", "Prowadzenie"), c("Directly under the palm", "Bezpośrednio pod dłonią"), c("Guided from the handle", "Za pomocą rączki")]],
    use: c("Wet the brush and skin. Use gentle movements, rinse thoroughly and leave the brush to dry in a ventilated place.", "Zwilż szczotkę i skórę. Wykonuj delikatne ruchy, dokładnie wypłucz szczotkę i wysusz ją w przewiewnym miejscu."),
  },
  "ice-face-roller-gua-sha-set": {
    problem: c("Make your morning routine feel refreshing.", "Dodaj porannej pielęgnacji odświeżający akcent."),
    context: c("A cooling tool offers a different sensory experience from applying skincare by hand.", "Chłodne narzędzie daje inne odczucie niż nakładanie kosmetyków samymi dłońmi."),
    solution: c("Cooling contact. Gentle movement.", "Chłodny kontakt. Delikatny ruch."),
    description: c("A facial roller and gua sha set for a cooling massage step. Follow the supplied care and cooling instructions before use.", "Zestaw rollera i gua sha do chłodzącego masażu twarzy. Przed użyciem sprawdź dołączone zalecenia dotyczące chłodzenia i pielęgnacji narzędzi."),
    benefits: [c("Roller and gua sha techniques", "Technika rollera i gua sha"), c("Cooling contact", "Chłodzący kontakt"), c("A reusable massage set", "Wielorazowy zestaw do masażu")],
    before: c("Skincare applied without a cooling tool.", "Pielęgnacja bez chłodzącego narzędzia."),
    after: c("A gentle, cooling massage adds a refreshing pause.", "Delikatny chłodzący masaż dodaje odświeżającą chwilę pielęgnacji."),
    alternative: c("Room-temperature massage", "Masaż w temperaturze pokojowej"),
    comparison: [[c("Temperature", "Temperatura"), c("Cooled as instructed", "Schłodzone zgodnie z instrukcją"), c("Room temperature", "Temperatura pokojowa")], [c("Preparation", "Przygotowanie"), c("Check temperature before contact", "Sprawdź temperaturę przed kontaktem"), c("Ready after cleaning", "Gotowe po oczyszczeniu")], [c("Pressure", "Nacisk"), c("Light and comfortable", "Lekki i komfortowy"), c("Light and comfortable", "Lekki i komfortowy")]],
    use: c("Cool only as directed and check the temperature before skin contact. Do not use a frozen tool directly on skin. Keep movements gentle.", "Chłodź wyłącznie zgodnie z instrukcją i sprawdź temperaturę przed kontaktem ze skórą. Nie przykładaj zamrożonego narzędzia bezpośrednio do skóry. Masuj delikatnie."),
  },
  "seaweed-collagen-crystal-mask": {
    problem: c("Some days call for an extra skincare pause.", "Są dni, kiedy chcesz poświęcić cerze więcej uwagi."),
    context: c("A mask lets you set aside a defined moment for skincare, away from the rush.", "Maska pozwala zaplanować konkretną chwilę na pielęgnację twarzy, bez pośpiechu."),
    solution: c("Five masks. Five moments for yourself.", "Pięć masek. Pięć chwil dla siebie."),
    description: c("A five-pack of hydrogel masks for an occasional skincare step. The shaped format sits against the face during the recommended wear time.", "Zestaw pięciu masek hydrożelowych do okresowego uzupełnienia pielęgnacji. Profilowana forma przylega do twarzy przez czas zalecany na opakowaniu."),
    benefits: [c("Five masks in a pack", "Pięć masek w zestawie"), c("Hydrogel format", "Forma hydrożelowa"), c("An easy-to-plan skincare step", "Łatwy do zaplanowania etap pielęgnacji")],
    before: c("Your everyday routine without a mask session.", "Codzienna pielęgnacja bez etapu z maską."),
    after: c("A dedicated mask session adds time for focused care.", "Osobna aplikacja maski daje czas na skupioną pielęgnację twarzy."),
    alternative: c("Wash-off mask", "Maska zmywalna"),
    comparison: [[c("Format", "Forma"), c("Shaped hydrogel", "Wyprofilowany hydrożel"), c("Cream, gel or paste", "Krem, żel lub pasta")], [c("Application", "Nakładanie"), c("Unfold and position", "Rozłożenie i dopasowanie"), c("Spread an even layer", "Rozprowadzenie warstwy")], [c("Removal", "Usuwanie"), c("Lift off; follow pack directions", "Zdjęcie; zgodnie z instrukcją"), c("Rinse as instructed", "Zmycie zgodnie z instrukcją")]],
    use: c("Apply to clean skin and smooth into place. Observe the pack's wear time and remove gently.", "Nałóż na oczyszczoną skórę i delikatnie dopasuj do twarzy. Przestrzegaj czasu na opakowaniu i zdejmij ostrożnie."),
  },
  "floral-grace-maxi-dress": {
    problem: c("Putting a complete look together takes time.", "Skompletowanie stylizacji potrafi zająć czas."),
    context: c("Matching a top and skirt means balancing their shapes, colors and proportions.", "Dobieranie bluzki i spódnicy wymaga pogodzenia kroju, kolorów i proporcji."),
    solution: c("One dress. A complete silhouette.", "Jedna sukienka. Gotowa sylwetka."),
    description: c("A defined high waist and a flowing maxi skirt create a coordinated look. Choose one of seven prints, short or long sleeves, and a size from S to 5XL.", "Podkreślona wysoka talia i swobodny dół maxi tworzą spójną stylizację. Wybierz jeden z siedmiu wzorów, krótki lub długi rękaw oraz rozmiar od S do 5XL."),
    benefits: [c("Seven print families", "Siedem wzorów"), c("Short or long sleeves", "Krótki lub długi rękaw"), c("Sizes S–5XL", "Rozmiary S–5XL")],
    before: c("Separate pieces to match before heading out.", "Osobne części garderoby, które trzeba ze sobą zestawić."),
    after: c("A complete maxi silhouette, ready for your favorite accessories.", "Spójna sylwetka maxi, gotowa na Twoje ulubione dodatki."),
    alternative: c("Separate top and skirt", "Osobna bluzka i spódnica"),
    comparison: [[c("Pieces", "Elementy"), c("One dress", "Jedna sukienka"), c("Two garments", "Dwa ubrania")], [c("Fit", "Dopasowanie"), c("One size for the whole dress", "Jeden rozmiar całej sukienki"), c("Separate sizes possible", "Możliwe osobne rozmiary")], [c("Styling", "Stylizacja"), c("Coordinated bodice and skirt", "Połączona góra i dół"), c("Mix pieces independently", "Dowolne łączenie elementów")]],
    use: c("Choose a print and sleeve length, then check your measurements before selecting a size. Follow the sewn-in care label.", "Wybierz wzór i długość rękawa, a przed wyborem rozmiaru sprawdź swoje wymiary. Pielęgnuj sukienkę zgodnie z wszytą metką."),
  },
};

const productFaqs: Record<string, Record<Locale, ProductFaq[]>> = {
  "clear-skin-patches": {
    en: [
      { q: "How do I apply a patch?", a: "Apply one to clean, completely dry skin and follow the wear time printed on the pack." },
      { q: "Can I reuse a patch?", a: "No. Remove it gently after use and discard it." },
      { q: "What if my skin feels irritated?", a: "Remove the patch and stop using it if discomfort or irritation occurs." },
    ],
    pl: [
      { q: "Jak nakleić plaster?", a: "Naklej go na czystą, całkowicie suchą skórę i przestrzegaj czasu podanego na opakowaniu." },
      { q: "Czy plaster jest wielorazowy?", a: "Nie. Po użyciu delikatnie go zdejmij i wyrzuć." },
      { q: "Co zrobić, jeśli skóra jest podrażniona?", a: "Zdejmij plaster i przerwij stosowanie, jeśli pojawi się dyskomfort lub podrażnienie." },
    ],
  },
  "gold-eye-patches": {
    en: [
      { q: "How long should I wear the patches?", a: "Follow the wear time on the pack and remove them gently. Do not leave them on overnight unless the product label explicitly says you can." },
      { q: "How many applications are in the pack?", a: "The pack contains 60 patches, or 30 pairs." },
      { q: "Can I use them if my skin is sensitive?", a: "Check the ingredient list first and stop use if irritation occurs. Keep the patches out of your eyes." },
    ],
    pl: [
      { q: "Jak długo trzymać płatki?", a: "Przestrzegaj czasu podanego na opakowaniu i delikatnie je zdejmij. Nie pozostawiaj ich na noc, chyba że etykieta wyraźnie na to pozwala." },
      { q: "Ile aplikacji zawiera opakowanie?", a: "W opakowaniu jest 60 płatków, czyli 30 par." },
      { q: "Czy mogę stosować je przy wrażliwej skórze?", a: "Najpierw sprawdź skład i przerwij stosowanie, jeśli pojawi się podrażnienie. Unikaj kontaktu płatków z oczami." },
    ],
  },
  "gua-sha-jade-roller-set": {
    en: [
      { q: "What is included?", a: "One facial roller and one gua sha tool." },
      { q: "What should I use them with?", a: "Use on clean skin with enough facial oil or serum for comfortable glide. Keep pressure light." },
      { q: "How do I care for the tools?", a: "Wipe them clean after use and let them dry. Stop if massage feels uncomfortable." },
    ],
    pl: [
      { q: "Co zawiera zestaw?", a: "Jeden roller do twarzy i jedna płytka gua sha." },
      { q: "Z czym używać narzędzi?", a: "Stosuj je na oczyszczonej skórze z ilością olejku lub serum, która zapewni wygodny poślizg. Nacisk powinien być lekki." },
      { q: "Jak pielęgnować narzędzia?", a: "Po użyciu wytrzyj je do czysta i pozostaw do wyschnięcia. Przerwij masaż, jeśli powoduje dyskomfort." },
    ],
  },
  "lux-aura-face-roller-gua-sha-set": {
    en: [
      { q: "What comes in the Lux Aura Care set?", a: "One double-ended face roller and one matching gua sha tool, in the finish selected before checkout. The set is presented in Lux Aura Care branded packaging." },
      { q: "Which finish can I choose?", a: "Choose black stone with gold-tone hardware or rose quartz with rose-gold-tone hardware. The available finish is selected on this page before checkout." },
      { q: "How should I use the roller and gua sha?", a: "Apply facial oil or serum for slip, start with gentle roller strokes, then glide the gua sha nearly flat with light pressure. Clean both tools after use." },
    ],
    pl: [
      { q: "Co zawiera zestaw Lux Aura Care?", a: "Dwustronny roller do twarzy i dopasowana płytka gua sha w wybranym wykończeniu. Zestaw jest zapakowany w opakowanie marki Lux Aura Care." },
      { q: "Jakie wykończenie mogę wybrać?", a: "Czarny kamień ze złotymi detalami lub różowy kwarc z detalami w odcieniu różowego złota. Wariant wybierzesz na tej stronie przed zakupem." },
      { q: "Jak używać rollera i płytki gua sha?", a: "Nałóż olejek lub serum, aby zapewnić poślizg. Zacznij od delikatnego masażu rollerem, a następnie prowadź płytkę niemal płasko, z lekkim naciskiem. Po użyciu oczyść oba narzędzia." },
    ],
  },
  "vibro-glow-face-massager": {
    en: [
      { q: "How do I prepare the massager?", a: "Read the supplied product instructions and prepare the device as directed before use." },
      { q: "What should I use it with?", a: "Use a suitable facial oil or serum for glide, and guide the T-bar gently over the skin. Avoid the eye area." },
      { q: "What if use feels uncomfortable?", a: "Stop using the device if you feel discomfort or notice irritation." },
    ],
    pl: [
      { q: "Jak przygotować masażer?", a: "Przed użyciem przeczytaj dołączoną instrukcję i przygotuj urządzenie zgodnie z jej zaleceniami." },
      { q: "Z czym używać masażera?", a: "Dla poślizgu zastosuj odpowiedni olejek lub serum i delikatnie prowadź końcówkę T po skórze. Omijaj okolice oczu." },
      { q: "Co zrobić, jeśli masaż jest niekomfortowy?", a: "Przerwij używanie urządzenia, jeśli odczuwasz dyskomfort lub zauważysz podrażnienie." },
    ],
  },
  "centella-collagen-sleep-masks": {
    en: [
      { q: "How many masks are included?", a: "The pack contains 30 masks." },
      { q: "Can I leave a mask on overnight?", a: "Only if the individual mask packaging explicitly allows overnight wear. Follow its application and removal directions." },
      { q: "What should I check before use?", a: "Read the ingredients and directions on the individual pack. Stop using the mask if irritation occurs." },
    ],
    pl: [
      { q: "Ile masek zawiera opakowanie?", a: "W zestawie jest 30 masek." },
      { q: "Czy mogę pozostawić maskę na noc?", a: "Tylko jeśli opakowanie konkretnej maski wyraźnie na to pozwala. Przestrzegaj instrukcji aplikacji i usuwania." },
      { q: "Co sprawdzić przed użyciem?", a: "Przeczytaj skład i instrukcję na opakowaniu pojedynczej maski. Przerwij stosowanie, jeśli pojawi się podrażnienie." },
    ],
  },
  "vitamin-c-retinol-serum-duo": {
    en: [
      { q: "How do I use the two serums?", a: "Follow the directions for each formula. Introduce retinol gradually and use daily sun protection as part of your routine." },
      { q: "Which size should I choose?", a: "Select the 30 ml or 60 ml option shown in the variant picker." },
      { q: "What if my skin reacts?", a: "Pause use if irritation occurs and follow the product label. Ask a qualified healthcare professional if you are unsure whether an active ingredient is suitable for you." },
    ],
    pl: [
      { q: "Jak stosować oba sera?", a: "Przestrzegaj instrukcji każdej formuły. Retinol wprowadzaj stopniowo i uwzględnij codzienną ochronę przeciwsłoneczną w pielęgnacji." },
      { q: "Jaki rozmiar wybrać?", a: "Wybierz wariant 30 ml lub 60 ml dostępny w selektorze." },
      { q: "Co zrobić, jeśli skóra zareaguje?", a: "Przerwij stosowanie, jeśli pojawi się podrażnienie, i postępuj zgodnie z etykietą. W razie wątpliwości, czy składnik aktywny jest dla Ciebie odpowiedni, skonsultuj się z wykwalifikowanym specjalistą." },
    ],
  },
  "resin-body-gua-sha-tool": {
    en: [
      { q: "Where is this gua sha tool intended to be used?", a: "It is designed for body massage. Use a suitable body oil for glide and keep pressure comfortable." },
      { q: "Can I use it on irritated skin?", a: "Avoid irritated or damaged skin and stop if massage hurts." },
      { q: "How do I clean it?", a: "Clean and dry the tool after each use, following any care instructions supplied with it." },
    ],
    pl: [
      { q: "Do jakiego masażu przeznaczona jest płytka?", a: "To płytka do masażu ciała. Dla poślizgu użyj odpowiedniego olejku i zachowaj komfortowy nacisk." },
      { q: "Czy mogę używać jej na podrażnionej skórze?", a: "Omijaj podrażnioną lub uszkodzoną skórę i przerwij masaż, jeśli boli." },
      { q: "Jak ją czyścić?", a: "Po każdym użyciu oczyść i osusz płytkę zgodnie z dołączonymi zaleceniami pielęgnacji." },
    ],
  },
  "natural-bristle-spa-brush": {
    en: [
      { q: "How do I use the long handle?", a: "Attach it when you need extra reach, or use the brush head on its own for closer control." },
      { q: "Can I use the brush dry or wet?", a: "Check the supplied product directions for the intended dry or wet use." },
      { q: "How should I store it?", a: "Clean it after use and let the brush dry fully before storage." },
    ],
    pl: [
      { q: "Jak używać długiej rączki?", a: "Zamocuj ją, gdy potrzebujesz większego zasięgu, albo używaj samej główki dla lepszej kontroli." },
      { q: "Czy można używać szczotki na sucho i mokro?", a: "Sprawdź w dołączonej instrukcji, czy produkt jest przeznaczony do stosowania na sucho, mokro czy w obu wariantach." },
      { q: "Jak przechowywać szczotkę?", a: "Po użyciu oczyść ją i przed schowaniem pozostaw do całkowitego wyschnięcia." },
    ],
  },
  "exfoliating-spa-body-brush": {
    en: [
      { q: "How do I use the strap?", a: "Slide your hand under the strap so the brush sits securely in your palm." },
      { q: "How much pressure should I use?", a: "Start gently on wet skin and stop if the brushing feels uncomfortable." },
      { q: "How do I care for the brush?", a: "Rinse it thoroughly after use and let it dry in a ventilated place." },
    ],
    pl: [
      { q: "Jak założyć pasek?", a: "Wsuń dłoń pod pasek, aby szczotka stabilnie leżała w dłoni." },
      { q: "Jak mocno dociskać szczotkę?", a: "Zacznij delikatnie na mokrej skórze i przerwij, jeśli szczotkowanie powoduje dyskomfort." },
      { q: "Jak dbać o szczotkę?", a: "Po użyciu dokładnie ją wypłucz i pozostaw do wyschnięcia w przewiewnym miejscu." },
    ],
  },
  "ice-face-roller-gua-sha-set": {
    en: [
      { q: "What is included?", a: "One face roller and one gua sha tool. Check the packaging for material and care details." },
      { q: "How should I cool the tools?", a: "Cool them only as directed in the supplied instructions and check the temperature before contact with skin. Do not apply a frozen tool directly to the face." },
      { q: "How much pressure should I use?", a: "Use light, comfortable strokes and stop if your skin feels uncomfortable." },
    ],
    pl: [
      { q: "Co zawiera zestaw?", a: "Jeden roller do twarzy i jedna płytka gua sha. Informacje o materiale i pielęgnacji sprawdź na opakowaniu." },
      { q: "Jak schłodzić narzędzia?", a: "Schładzaj je wyłącznie zgodnie z dołączoną instrukcją i sprawdź temperaturę przed kontaktem ze skórą. Nie przykładaj zamrożonego narzędzia bezpośrednio do twarzy." },
      { q: "Jak mocno dociskać narzędzia?", a: "Wykonuj lekkie, komfortowe ruchy i przerwij, jeśli skóra reaguje dyskomfortem." },
    ],
  },
  "seaweed-collagen-crystal-mask": {
    en: [
      { q: "How many masks are included?", a: "The pack contains five hydrogel masks." },
      { q: "How long should I wear a mask?", a: "Follow the wear time and removal directions printed on the pack." },
      { q: "What should I check before applying it?", a: "Read the ingredient list first, especially if you have sensitive skin, and stop use if irritation occurs." },
    ],
    pl: [
      { q: "Ile masek zawiera zestaw?", a: "W opakowaniu jest pięć masek hydrożelowych." },
      { q: "Jak długo nosić maskę?", a: "Przestrzegaj czasu stosowania i instrukcji zdejmowania podanych na opakowaniu." },
      { q: "Co sprawdzić przed aplikacją?", a: "Najpierw przeczytaj skład, szczególnie jeśli masz wrażliwą skórę, i przerwij stosowanie w razie podrażnienia." },
    ],
  },
  "floral-grace-maxi-dress": {
    en: [
      { q: "How do I choose a size?", a: "Compare your measurements with the size guide before selecting a size." },
      { q: "Can I choose the print and sleeve length?", a: "Yes. Select an available print and sleeve option before choosing your size." },
      { q: "How should I care for the dress?", a: "Follow the care instructions on the garment label." },
    ],
    pl: [
      { q: "Jak dobrać rozmiar?", a: "Przed wyborem rozmiaru porównaj swoje wymiary z tabelą rozmiarów." },
      { q: "Czy mogę wybrać wzór i długość rękawa?", a: "Tak. Przed wyborem rozmiaru zaznacz dostępny wzór i długość rękawa." },
      { q: "Jak pielęgnować sukienkę?", a: "Postępuj zgodnie z zaleceniami na metce ubrania." },
    ],
  },
};

export function getShopProductFaq(id: string, locale: Locale, fallback: ProductFaq[]): ProductFaq[] {
  return productFaqs[id]?.[locale] ?? fallback;
}

export function getShopPageProfile(id: string, locale: Locale) {
  const profile = profiles[id];
  if (!profile) return null;
  return {
    problem: profile.problem[locale], context: profile.context[locale],
    solution: profile.solution[locale], description: profile.description[locale],
    benefits: profile.benefits.map((item) => item[locale]),
    before: profile.before[locale], after: profile.after[locale],
    alternative: profile.alternative[locale],
    comparison: profile.comparison.map((row) => row.map((item) => item[locale])),
    use: profile.use[locale],
  };
}
export type ShopPageProfile = NonNullable<ReturnType<typeof getShopPageProfile>>;

export function getShopUsageSteps(id: string, locale: Locale, fallback: string[]) {
  const profile = getShopPageProfile(id, locale);
  if (!profile) return fallback;
  const pl = locale === "pl";
  if (id === "floral-grace-maxi-dress") return [
    pl ? "Wybierz wzór i długość rękawa. Zdjęcie zmieni się zgodnie z Twoim wyborem." : "Choose a print and sleeve length. The photo updates to match your choice.",
    pl ? "Sprawdź swoje wymiary i dobierz rozmiar. Jeśli potrzebujesz pomocy, zapytaj nas przed zamówieniem." : "Check your measurements and choose a size. Contact us before ordering if you need help.",
    pl ? "Dobierz dodatki i przestrzegaj zaleceń pielęgnacji z wszytej metki." : "Add your accessories and follow the sewn-in care instructions.",
  ];
  const cosmetic = ["clear-skin-patches", "gold-eye-patches", "centella-collagen-sleep-masks", "vitamin-c-retinol-serum-duo", "seaweed-collagen-crystal-mask"].includes(id);
  return [
    cosmetic
      ? pl ? "Przed pierwszym użyciem przeczytaj skład i instrukcję na opakowaniu. Zacznij od czystej skóry." : "Read the ingredients and pack instructions before first use. Start with clean skin."
      : pl ? "Przed użyciem oczyść narzędzie i sprawdź dołączoną instrukcję." : "Clean the tool and read the supplied instructions before use.",
    profile.use,
    cosmetic
      ? pl ? "Obserwuj komfort skóry. Przerwij stosowanie w razie podrażnienia i przechowuj produkt zgodnie z etykietą." : "Monitor skin comfort. Stop if irritation occurs and store as directed on the label."
      : pl ? "Po użyciu oczyść narzędzie i pozostaw do wyschnięcia zgodnie z instrukcją producenta." : "After use, clean the tool and leave it to dry according to the manufacturer's instructions.",
  ];
}
