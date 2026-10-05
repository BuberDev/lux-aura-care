// Etap 5b (spec 4.2): metadane generowane z gotowego tekstu, w osobnym, krótkim wywołaniu
// JSON — celowo rozdzielone od pisania, bo tryb JSON DeepSeek nie ma schematu i kilkanaście
// tysięcy znaków Markdownu w jednym łańcuchu JSON łatwo się psuje.
import { z } from 'zod';
import { runStep, type ProviderConfig } from '../llm/provider';
import type { ArticleMeta } from './types';

const metaOutputSchema = z.object({
    // Character limits are enforced deterministically by normalizeArticleMeta.
    // Keep the provider schema permissive so a slightly overlong LLM value can
    // be shortened instead of aborting an otherwise publication-ready article.
    excerpt: z.string().min(1).max(2000),
    seoTitle: z.string().min(1).max(2000),
    seoDescription: z.string().min(1).max(2000),
    keywords: z.array(z.string()).min(3).max(12),
    tags: z.array(z.string()).min(1).max(8),
    imageAlt: z.string().min(1).max(2000),
    imageBrief: z.object({
        headline: z.string(),
        kicker: z.string(),
        chips: z.array(z.string()).length(3),
    }),
});

function normalizeSpaces(value: string): string {
    return value.replace(/\s+/g, ' ').trim();
}

function shortenAtWordBoundary(value: string, maxLength: number): string {
    const normalized = normalizeSpaces(value);
    if (normalized.length <= maxLength) return normalized;

    const slice = normalized.slice(0, maxLength + 1);
    const lastSpace = slice.lastIndexOf(' ');
    const shortened = (lastSpace >= Math.floor(maxLength * 0.6) ? slice.slice(0, lastSpace) : normalized.slice(0, maxLength))
        .replace(/[\s,;:.!?–—-]+$/u, '')
        .trim();
    return `${shortened.slice(0, maxLength - 1)}…`;
}

function ensureLength(value: string, minLength: number, maxLength: number, fallback: string): string {
    let normalized = normalizeSpaces(value);
    if (normalized.length < minLength) normalized = normalizeSpaces(`${normalized} ${fallback}`);
    return shortenAtWordBoundary(normalized, maxLength);
}

/**
 * Metadane mają mechaniczne limity, więc domykamy je deterministycznie zamiast
 * ponownie pytać model i liczyć, że tym razem policzy znaki poprawnie.
 */
export function normalizeArticleMeta(meta: ArticleMeta, title: string): ArticleMeta {
    const genericSuffix = `See what the evidence means for a realistic routine, who should be cautious, and which products may fit.`;
    const excerpt = ensureLength(meta.excerpt, 100, 200, `${meta.seoDescription} ${genericSuffix}`);
    const seoDescription = ensureLength(meta.seoDescription, 120, 160, `${excerpt} ${genericSuffix}`);

    return {
        ...meta,
        excerpt,
        seoTitle: ensureLength(meta.seoTitle, 20, 60, title),
        seoDescription,
        imageAlt: ensureLength(meta.imageAlt, 10, 200, `Editorial illustration for “${title}”.`),
        imageBrief: {
            ...meta.imageBrief,
            headline: normalizeSpaces(meta.imageBrief.headline).split(' ').slice(0, 8).join(' '),
            kicker: normalizeSpaces(meta.imageBrief.kicker),
            chips: meta.imageBrief.chips.map((chip) => shortenAtWordBoundary(chip, 22)) as [string, string, string],
        },
    };
}

export async function generateMeta(title: string, contentMarkdown: string, providerConfig: ProviderConfig, repairFeedback?: string): Promise<ArticleMeta> {
    const prompt = `Generate English metadata from the finished article. Every content value in the JSON must be written in natural English.

Tytuł: ${title}

Treść:
${contentMarkdown}

${repairFeedback ? `KRYTYCZNE — poprzednie metadane nie przeszły bramki jakości. Popraw dokładnie te błędy:\n${repairFeedback}\n` : ''}

Odpowiedz w formacie JSON, DOKŁADNIE w tym kształcie (te same nazwy pól, po angielsku,
content values in English):
{
  "excerpt": "streszczenie 100–200 znaków, dla karty na liście bloga",
  "seoTitle": "30–60 znaków",
  "seoDescription": "120–160 znaków",
  "keywords": ["słowo1", "słowo2", "słowo3"],
  "tags": ["tag1", "tag2"],
  "imageAlt": "opis obrazu dla czytników ekranu, jedno zdanie",
  "imageBrief": { "headline": "max 8 words", "kicker": "e.g. BLOCKCHAIN INSIGHT", "chips": ["chip1", "chip2", "chip3"] }
}
"chips" to DOKŁADNIE 3 elementy, każdy max 22 znaki.`;

    const outcome = await runStep(
        {
            kind: 'json',
            step: 'meta',
            systemPrompt: 'You are an English-language health and beauty SEO specialist and metadata editor for Lux Aura Care. Avoid medical promises and unsupported product claims.',
            prompt,
            jsonSchema: z.toJSONSchema(metaOutputSchema) as Record<string, unknown>,
            deepseek: { model: 'deepseek-flash', thinking: false, temperature: 0.2, maxTokens: 1500 },
        },
        providerConfig,
    );

    const parsed = metaOutputSchema.parse(outcome.json);
    return normalizeArticleMeta(
        {
            ...parsed,
            imageBrief: { ...parsed.imageBrief, chips: parsed.imageBrief.chips as [string, string, string] },
        },
        title,
    );
}
