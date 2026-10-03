// Etap 6, część 1 (spec 4.2): krytyk sprawdza twierdzenia względem pakietu faktów
// i fragmentów stron (nie tylko streszczenia modelu), ton, frazesy, jakość polszczyzny.
import { z } from 'zod';
import { runStep, type ProviderConfig } from '../llm/provider';
import type { CritiqueResult, FactsPackage, VerifiedSource } from './types';

const critiqueOutputSchema = z.object({
    issues: z.array(
        z.object({
            severity: z.enum(['blocker', 'major', 'minor']),
            quote: z.string(),
            problem: z.string(),
            fix: z.string(),
        }),
    ).max(12),
});

export async function critiqueArticle(
    title: string,
    contentMarkdown: string,
    factsPackage: FactsPackage,
    verifiedSources: VerifiedSource[],
    providerConfig: ProviderConfig,
): Promise<CritiqueResult> {
    const factsText = factsPackage.facts.map((f) => `- [${f.id}] ${f.statement} (${f.sourceUrl})`).join('\n');
    const sourcesText = verifiedSources
        .filter((s) => s.excerpt)
        .map((s) => `### ${s.title ?? s.url}\n${s.excerpt}`)
        .join('\n\n');

    const prompt = `Skrytykuj poniższy artykuł. Sprawdź KAŻDE twierdzenie względem pakietu
faktów I fragmentów źródeł poniżej (nie ufaj samemu sobie — jeśli artykuł coś twierdzi,
a tego nie ma wprost w źródłach, to jest to problem). Sprawdź też: ton, frazesy, zgodność tytułu
z treścią oraz jakość profesjonalnego języka angielskiego (gramatyka, składnia, naturalność).

## Tytuł
${title}

## Artykuł
${contentMarkdown}

## Pakiet faktów
${factsText}

## Fragmenty źródeł (grunt prawdy)
${sourcesText}

severity: "blocker" WYŁĄCZNIE dla semantycznego twierdzenia bez pokrycia w źródłach
albo poważnego błędu merytorycznego. Różnice typograficzne (rodzaj cudzysłowu lub
apostrofu), interpunkcja i format cytatu, które nie zmieniają jego znaczenia, to
"minor", nigdy "blocker". "major" oznacza zauważalny problem językowy/stylowy, a
"minor" drobiazg. Nie łącz błędu faktograficznego i typograficznego w jednej uwadze.

Każdy fakt z pakietu faktów ma zweryfikowany adres HTTP 200 i jest dozwolonym gruntem
prawdy — także gdy pochodzi ze źródła wtórnego. Nie oznaczaj twierdzenia jako blocker
wyłącznie dlatego, że źródło nie jest oficjalnym komunikatem firmy. Jeśli informacja
ze źródła wtórnego wymaga wyraźnego przypisania, a artykuł go nie podaje, oznacz to
co najwyżej jako major. Blocker występuje dopiero wtedy, gdy twierdzenia nie ma ani
w pakiecie faktów, ani we fragmentach źródeł, przeczy ono źródłom albo fałszywie
przypisuje konkretnemu źródłu informację, której to źródło nie zawiera.

Brak dokładniejszej daty przy poprawnym miesiącu, brak kwalifikatora metodologicznego,
brak przypisu tuż przy zdaniu, niewystarczająca precyzja lub zbyt mocne uogólnienie faktu,
który ogólnie występuje w źródle, to "major" — nie "blocker". Taki problem nadaje się
do redakcyjnej korekty. Jako blocker klasyfikuj wyłącznie materialnie fałszywy albo
nieistniejący konkret, którego nie da się naprawić doprecyzowaniem.

Wyraźnie sygnalizowana analiza, interpretacja albo rekomendacja autora nie wymaga
dosłownego odpowiednika w źródłach, o ile nie dodaje nowych liczb, dat, nazw własnych
lub zewnętrznych faktów. Oceniaj wtedy, czy wniosek rozsądnie wynika z opisanych faktów;
sam fakt, że jest interpretacją, nie jest błędem.

Oceniaj WYŁĄCZNIE twierdzenia faktycznie obecne w artykule. Brak dodatkowego szczegółu,
który występuje w źródle, nie jest błędem artykułu i nie wolno wymagać jego dopisania,
chyba że pominięcie wprost odwraca sens opisanego zdarzenia albo artykuł fałszywie
przedstawia nieaktualny stan jako aktualny. Poprawna parafraza nie musi powtarzać słów
źródła dosłownie. Nie zwracaj dwóch uwag o tym samym fragmencie i tym samym problemie.

Zwróć maksymalnie 12 najważniejszych, niedublujących się uwag. Najpierw blockery, potem
major, na końcu minor. Opis problemu i poprawki ma być zwięzły: po jednym zdaniu.

Odpowiedz w formacie JSON, DOKŁADNIE w tym kształcie (te same nazwy pól, po angielsku,
treść wewnątrz po polsku); pusta lista "issues", jeśli artykuł jest OK:
{
  "issues": [
    { "severity": "major", "quote": "dokładny cytat z artykułu", "problem": "co jest nie tak", "fix": "jak naprawić" }
  ]
}`;

    const outcome = await runStep(
        {
            kind: 'json',
            step: 'critique',
            systemPrompt: 'You are a rigorous health and beauty fact-checking editor. Flag unsupported efficacy, safety, medical, ingredient and product claims as blockers, along with material factual errors.',
            prompt,
            jsonSchema: z.toJSONSchema(critiqueOutputSchema) as Record<string, unknown>,
            // Krytyk ma zwrócić krótki, ściśle ustrukturyzowany JSON. Thinking w dwóch
            // realnych przebiegach zużył cały limit na reasoning i uciął odpowiedź;
            // bez thinking model analizuje ten sam grunt prawdy, ale wynik jest domknięty.
            deepseek: { model: 'deepseek-v4-pro', thinking: false, temperature: 0.2, maxTokens: 8000 },
        },
        providerConfig,
    );

    const normalizedOutput =
        outcome.json && typeof outcome.json === 'object' && Array.isArray((outcome.json as { issues?: unknown }).issues)
            ? { ...(outcome.json as Record<string, unknown>), issues: ((outcome.json as { issues: unknown[] }).issues).slice(0, 12) }
            : outcome.json;
    const parsed = critiqueOutputSchema.parse(normalizedOutput);
    const seen = new Set<string>();
    return {
        issues: parsed.issues.filter((issue) => {
            const key = `${issue.severity}\u0000${issue.quote.trim()}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        }),
    };
}
