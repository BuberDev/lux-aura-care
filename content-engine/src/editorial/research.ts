// Etap 4 (spec 4.2): research. Claude Code szuka sam (WebSearch/WebFetch) i od razu
// zwraca pakiet faktów w jednym wywołaniu. Tor awaryjny: most wyszukiwania OpenRouter
// dostarcza surowe wyniki jako kontekst, a DeepSeek z nich wyciąga fakty (provider.ts
// robi to automatycznie dla kroków z `allowSearch`).
import { z } from 'zod';
import { runStep, type ProviderConfig } from '../llm/provider';
import { canonicalizeUrl } from '../harvest/normalize';
import type { FactsPackage, TopicOption } from './types';
import { verifySources } from './verify-sources';

const MIN_FACTS = 5;

const factSchema = z.object({
    id: z.string(),
    statement: z.string().min(10),
    sourceUrl: z.string(),
    sourceTitle: z.string(),
    publishedAt: z.string().nullable(),
});

const factsPackageSchema = z.object({
    facts: z.array(factSchema).min(MIN_FACTS),
    background: z.string(),
});

export interface ResearchInput {
    topic: TopicOption;
    angle: string;
}

export async function research(input: ResearchInput, providerConfig: ProviderConfig, systemPrompt: string): Promise<FactsPackage> {
    const verifiedSeedSources = await verifySources(input.topic.candidateUrls, providerConfig.fetchFn ?? fetch);
    const usableSeedSources = verifiedSeedSources.filter((source) => source.httpStatus === 200 && source.excerpt);
    const seedSources = usableSeedSources.length > 0
        ? usableSeedSources.map((source) => `### ${source.title ?? source.url}\nURL: ${source.url}\n${source.excerpt}`).join('\n\n')
        : '(brak dostępnych źródeł startowych — znajdź źródła samodzielnie)';
    const prompt = `Research the topic: "${input.topic.topic}" (angle: ${input.angle}).

All fact statements, source titles and background text in the JSON output MUST be written in natural English.

Wyszukaj świeże (maks. 14 dni) informacje w internecie. Zweryfikuj fakty w co najmniej
2 niezależnych źródłach. Dla newsów firmowych użyj źródła pierwotnego (blog/dokumentacja
firmy), jeśli istnieje. Gdy źródło pierwotne istnieje, oprzyj na nim co najmniej 3 fakty;
źródła wtórne wykorzystuj tylko do informacji, których nie ma w komunikacie lub dokumentacji
firmy, i zachowaj ich jawne przypisanie.

## Pobrana treść źródeł startowych z selekcji tematu
${seedSources}

Źródła startowe zostały pobrane przez silnik i mają HTTP 200. Sprawdź je w pierwszej
kolejności i używaj ich DOKŁADNYCH URL-i. Fakt musi wynikać z treści źródła, nie z tytułu.
Jeśli dostępne są co najmniej dwa źródła startowe, co najmniej 3 fakty w wyniku muszą
pochodzić właśnie z nich.

Zwróć co najmniej ${MIN_FACTS} faktów. KAŻDY fakt musi mieć realny URL źródła, które
faktycznie znalazłeś — nigdy nie wymyślaj URL-i ani faktów bez pokrycia w tym, co
znalazłeś.

Odpowiedz w formacie JSON, DOKŁADNIE w tym kształcie (te same nazwy pól, po angielsku,
with all content values in English):
{
  "facts": [
    { "id": "F1", "statement": "fact statement in English", "sourceUrl": "https://...", "sourceTitle": "source page title", "publishedAt": "2026-09-15" }
  ],
  "background": "2-3 background sentences in English"
}
Gdy data publikacji nie jest znana, ustaw "publishedAt": null (nie tekst typu "brak danych").`;

    const runResearch = (researchPrompt: string, step: string) => runStep(
        {
            kind: 'json',
            step,
            systemPrompt,
            prompt: researchPrompt,
            allowSearch: true,
            jsonSchema: z.toJSONSchema(factsPackageSchema) as Record<string, unknown>,
            deepseek: { model: 'deepseek-flash', thinking: false, temperature: 0.2, maxTokens: 4000 },
        },
        {
            ...providerConfig,
            searchQuery: `${input.topic.topic} ${input.angle}${input.topic.candidateUrls.length > 0 ? ` ${input.topic.candidateUrls.slice(0, 3).join(' ')}` : ''}`,
        },
    );

    const seedUrls = new Set(usableSeedSources.map((source) => canonicalizeUrl(source.url)));
    const groundedCount = (factsPackage: FactsPackage) => factsPackage.facts
        .filter((fact) => seedUrls.has(canonicalizeUrl(fact.sourceUrl))).length;

    let outcome = await runResearch(prompt, 'research');
    let parsed = factsPackageSchema.safeParse(outcome.json);
    let failure = parsed.success ? '' : parsed.error.issues
        .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
        .join('; ');
    if (parsed.success && usableSeedSources.length >= 2 && groundedCount(parsed.data) < 3) {
        failure = `tylko ${groundedCount(parsed.data)} faktów używa dokładnych URL-i źródeł startowych (wymagane co najmniej 3)`;
    }

    if (failure) {
        const repairPrompt = `${prompt}

POPRZEDNI PAKIET RESEARCHU NIE PRZESZEDŁ WALIDACJI: ${failure}
Zwróć ponownie CAŁY obiekt JSON. Co najmniej 3 fakty muszą używać dokładnych URL-i z sekcji źródeł startowych powyżej i wynikać z ich pobranej treści. Nie zwracaj komentarza ani częściowego obiektu.

Poprzednia odpowiedź:
${JSON.stringify(outcome.json)}`;
        outcome = await runResearch(repairPrompt, 'research-repair');
        parsed = factsPackageSchema.safeParse(outcome.json);
    }

    if (!parsed.success) throw parsed.error;
    if (usableSeedSources.length >= 2 && groundedCount(parsed.data) < 3) {
        throw new Error(`research: tylko ${groundedCount(parsed.data)} faktów pochodzi z pobranych źródeł startowych (wymagane ≥3)`);
    }
    return parsed.data;
}
