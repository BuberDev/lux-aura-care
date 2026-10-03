// Etap 3 (spec 4.2): selekcja tematu spośród kandydatów z harvestu.
import { z } from 'zod';
import { runStep, type ProviderConfig } from '../llm/provider';
import type { Candidate } from '../harvest/types';
import type { ArticleFormat, ArticleLevel, SelectedTopic } from './types';
import { rankCoverageGaps } from '../../config/editorial';

const topicOptionSchema = z.object({
    topic: z.string().min(5),
    angle: z.string().min(5),
    keyword: z.string().min(2),
    candidateUrls: z.array(z.string().url()).min(2).max(4),
});

const selectOutputSchema = z.object({
    primary: topicOptionSchema,
    reserves: z.array(topicOptionSchema).length(2),
    levelOverride: z.enum(['basic', 'advanced']).nullable(),
    levelOverrideReason: z.string().nullable(),
    titleVariants: z.array(z.object({ title: z.string().min(10).max(80) })).length(5),
});

/** Rotacja formatu (n % 3) i poziomu (parzystość) wg numeru slotu redakcyjnego. */
export function rotationFor(weekNumber: number): { format: ArticleFormat; level: ArticleLevel } {
    const formats: ArticleFormat[] = ['news-analysis', 'practical-guide', 'explainer'];
    return { format: formats[weekNumber % 3], level: weekNumber % 2 === 0 ? 'basic' : 'advanced' };
}

export interface SelectTopicInput {
    candidates: Candidate[];
    recentTitles: string[];
    weekNumber: number;
    /** Z `workflow_dispatch` — gdy podane, cała selekcja jest pomijana. */
    topicHint?: string;
}

export async function selectTopic(input: SelectTopicInput, providerConfig: ProviderConfig, systemPrompt: string): Promise<SelectedTopic> {
    const { format, level } = rotationFor(input.weekNumber);

    if (input.topicHint) {
        const hintedUrls = input.topicHint.match(/https:\/\/[^\s|]+/g) ?? [];
        const hintedTopic = input.topicHint
            .replace(/https:\/\/[^\s|]+/g, '')
            .replace(/\s*\|\s*/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return {
            // UWAGA: `angle` musi być inne niż `topic` — research.ts buduje zapytanie
            // do mostu wyszukiwania jako `${topic} ${angle}`; gdy oba pola były identyczne
            // (poprzednia wersja), zapytanie stawało się zdegenerowanym powtórzeniem tematu
            // i most wyszukiwania wisiał (zweryfikowane na żywo 22.09.2026: >120s zamiast ~11s
            // dla normalnego, krótkiego zapytania).
            primary: {
                topic: hintedTopic || input.topicHint,
                angle: 'latest evidence from primary sources, safe routine guidance and practical relevance for beauty shoppers',
                keyword: hintedTopic || input.topicHint,
                candidateUrls: [...new Set(hintedUrls)],
            },
            reserves: [],
            format,
            level,
            levelOverrideReason: 'topic_hint z workflow_dispatch — selekcja pominięta',
            titleVariants: [],
        };
    }

    const candidatesText = input.candidates
        .map((c: Candidate, i) => `${i + 1}. [${c.title}](${c.url}) — źródło: ${c.source}, potwierdzenia: ${c.corroboration}${c.publishedAt ? `, data: ${c.publishedAt}` : ''}`)
        .join('\n');
    const coveragePriorities = rankCoverageGaps(input.recentTitles)
        .slice(0, 3)
        .map((pillar, index) => `${index + 1}. ${pillar.name} — recent mentions: ${pillar.recentMentions}; relevant product paths: ${pillar.productPaths.join(', ')}; ${pillar.description}`)
        .join('\n');

    const prompt = `Choose the strongest current health, skincare, beauty-tool, body-care or wellbeing topic for a Lux Aura Care article from the candidates below. All topic, angle, keyword and title values in the JSON output MUST be natural English.

Format publikacji (ustalony rotacją, NIE zmieniaj): ${format}
Sugerowany poziom (możesz zmienić, jeśli temat wyraźnie nie pasuje — podaj powód w levelOverrideReason, inaczej null): ${level}

Kandydaci:
${candidatesText || '(no candidates survived the filters — choose the strongest evidence-backed skincare, beauty, body-care or wellbeing topic available)'}

Ostatnie tytuły (NIE wybieraj tematu bardzo podobnego do żadnego z nich):
${input.recentTitles.map((t) => `- ${t}`).join('\n')}

Największe luki w pokryciu tematycznym bloga:
${coveragePriorities}

Oceń kandydatów według jawnych wag:
- 30% relevance to real skincare, beauty-tool, body-care or wellbeing questions,
- 25% timeliness and usefulness of the evidence,
- 20% potencjał wyszukiwania, cytowania i udostępniania,
- 15% siła źródeł (preferuj źródło pierwotne i co najmniej jedno niezależne potwierdzenie),
- 10% uzupełnienie luki tematycznej z listy powyżej.

A meaningful dermatology finding, ingredient-safety update, practical routine question or beauty-tool trend may win even when its pillar is not the largest gap. The topic must help readers make safer, more confident choices and connect naturally to several live products. Avoid diagnosis, treatment promises, celebrity gossip and unsupported wellness claims.

For EVERY primary/reserve option, candidateUrls must contain 2–4 exact URLs copied
from the candidate list, from at least 2 different domains, and all URLs must directly
support the same proposed topic. Never invent or rewrite a candidate URL.

Odpowiedz w formacie JSON, DOKŁADNIE w tym kształcie (te same nazwy pól, po angielsku,
content values in English):
{
  "primary": { "topic": "...", "angle": "kąt inny niż topic — konkretna perspektywa", "keyword": "...", "candidateUrls": ["https://..."] },
  "reserves": [
    { "topic": "...", "angle": "...", "keyword": "...", "candidateUrls": ["https://..."] },
    { "topic": "...", "angle": "...", "keyword": "...", "candidateUrls": ["https://..."] }
  ],
  "levelOverride": null,
  "levelOverrideReason": null,
  "titleVariants": [
    { "title": "wariant 1" }, { "title": "wariant 2" }, { "title": "wariant 3" }, { "title": "wariant 4" }, { "title": "wariant 5" }
  ]
}
"levelOverride" to "basic", "advanced" albo null (gdy nie zmieniasz sugerowanego poziomu).
"angle" NIE MOŻE być identyczne z "topic" — to osobne pole opisujące konkretną perspektywę/kąt ujęcia.
Każdy element "titleVariants" musi mieć MAKSYMALNIE 65 znaków (policz znaki przed odpowiedzią).`;

    const jsonSchema = z.toJSONSchema(selectOutputSchema) as Record<string, unknown>;
    const deepseek = { model: 'deepseek-flash' as const, thinking: false, temperature: 0.3, maxTokens: 3000 };
    let outcome = await runStep(
        { kind: 'json', step: 'select-topic', systemPrompt, prompt, jsonSchema, deepseek },
        providerConfig,
    );

    let parsedResult = selectOutputSchema.safeParse(outcome.json);
    if (!parsedResult.success) {
        const validationFeedback = parsedResult.error.issues
            .map((issue) => `- ${issue.path.join('.') || '(root)'}: ${issue.message}`)
            .join('\n');
        const repairPrompt = `Popraw poniższą odpowiedź JSON tak, aby spełniała wszystkie
wymagania i błędy walidacji. Nie zmieniaj wybranych tematów ani URL-i bardziej, niż jest
to konieczne do naprawy. Zwróć WYŁĄCZNIE poprawiony JSON, bez komentarza.

## Błędy walidacji
${validationFeedback}

## Odpowiedź do naprawy
${JSON.stringify(outcome.json)}`;

        outcome = await runStep(
            { kind: 'json', step: 'select-topic-repair', systemPrompt, prompt: repairPrompt, jsonSchema, deepseek },
            providerConfig,
        );
        parsedResult = selectOutputSchema.safeParse(outcome.json);
    }

    if (!parsedResult.success) throw parsedResult.error;
    const parsed = parsedResult.data;
    return {
        primary: parsed.primary,
        reserves: parsed.reserves,
        format,
        level: parsed.levelOverride ?? level,
        levelOverrideReason: parsed.levelOverrideReason,
        titleVariants: parsed.titleVariants,
    };
}
