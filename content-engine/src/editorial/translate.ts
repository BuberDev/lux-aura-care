import { z } from 'zod';

import { runStep, type ProviderConfig } from '../llm/provider';
import { countWords, extractHeadings, extractLinks } from '../quality/parse';
import type { ArticleMeta, ArticleVisualPlan } from './types';

const localizedVisualSchema = z.object({
    id: z.string().min(3).max(80),
    title: z.string().min(5).max(2000),
    placementAfterHeading: z.string().min(3).max(200).nullable(),
    caption: z.string().min(20).max(2000),
    altText: z.string().min(20).max(2000),
});

const polishLocalizationSchema = z.object({
    title: z.string().min(20).max(2000),
    excerpt: z.string().min(60).max(2000),
    seoTitle: z.string().min(20).max(2000),
    seoDescription: z.string().min(100).max(2000),
    keywords: z.array(z.string().min(2).max(2000)).min(3).max(12),
    tags: z.array(z.string().min(2).max(2000)).min(1).max(8),
    contentMarkdown: z.string().min(1500).max(60000),
    imageAlt: z.string().min(10).max(2000),
    visualAssets: z.array(localizedVisualSchema).min(3).max(4),
});

export type PolishArticleLocalization = z.infer<typeof polishLocalizationSchema>;

function shortenAtWordBoundary(value: string, maxLength: number): string {
    const normalized = value.replace(/\s+/gu, ' ').trim();
    if (normalized.length <= maxLength) return normalized;
    const slice = normalized.slice(0, maxLength + 1);
    const lastSpace = slice.lastIndexOf(' ');
    const shortened = (lastSpace >= Math.floor(maxLength * 0.6) ? slice.slice(0, lastSpace) : normalized.slice(0, maxLength))
        .replace(/[\s,;:.!?–—-]+$/u, '')
        .trim();
    return `${shortened.slice(0, maxLength - 1)}…`;
}

function normalizeLocalizationLengths(localization: PolishArticleLocalization): PolishArticleLocalization {
    return {
        ...localization,
        title: shortenAtWordBoundary(localization.title, 120),
        excerpt: shortenAtWordBoundary(localization.excerpt, 300),
        seoTitle: shortenAtWordBoundary(localization.seoTitle, 70),
        seoDescription: shortenAtWordBoundary(localization.seoDescription, 200),
        keywords: localization.keywords.map((keyword) => shortenAtWordBoundary(keyword, 60)),
        tags: localization.tags.map((tag) => shortenAtWordBoundary(tag, 40)),
        imageAlt: shortenAtWordBoundary(localization.imageAlt, 200),
        visualAssets: localization.visualAssets.map((asset) => ({
            ...asset,
            title: shortenAtWordBoundary(asset.title, 160),
            caption: shortenAtWordBoundary(asset.caption, 350),
            altText: shortenAtWordBoundary(asset.altText, 300),
        })),
    };
}

function sortedUrls(markdown: string): string[] {
    return extractLinks(markdown).map((link) => link.url).sort();
}

/**
 * Translation is allowed to change prose only. URLs, heading structure and visual
 * asset identifiers are publication invariants because the storefront and figure
 * placement depend on them.
 */
export function validatePolishLocalization(
    localization: PolishArticleLocalization,
    englishMarkdown: string,
    visualPlan: ArticleVisualPlan,
): PolishArticleLocalization {
    const parsed = polishLocalizationSchema.parse(localization);
    const englishUrls = sortedUrls(englishMarkdown);
    const polishUrls = sortedUrls(parsed.contentMarkdown);
    if (JSON.stringify(englishUrls) !== JSON.stringify(polishUrls)) {
        throw new Error('Polskie tłumaczenie zmieniło lub usunęło URL-e artykułu');
    }

    const englishHeadings = extractHeadings(englishMarkdown);
    const polishHeadings = extractHeadings(parsed.contentMarkdown);
    if (englishHeadings.length !== polishHeadings.length) {
        throw new Error(`Polskie tłumaczenie zmieniło strukturę nagłówków (${englishHeadings.length} → ${polishHeadings.length})`);
    }
    if (countWords(parsed.contentMarkdown) < Math.floor(countWords(englishMarkdown) * 0.65)) {
        throw new Error('Polskie tłumaczenie jest podejrzanie krótkie');
    }

    const expectedIds = visualPlan.assets.map((asset) => asset.id).sort();
    const actualIds = parsed.visualAssets.map((asset) => asset.id).sort();
    if (JSON.stringify(expectedIds) !== JSON.stringify(actualIds)) {
        throw new Error('Polskie tłumaczenie nie obejmuje dokładnie wszystkich grafik');
    }
    for (const asset of parsed.visualAssets) {
        const sourceAsset = visualPlan.assets.find((candidate) => candidate.id === asset.id);
        if (!sourceAsset) throw new Error(`Nieznana grafika w tłumaczeniu: ${asset.id}`);
        if (sourceAsset.role === 'cover' && asset.placementAfterHeading !== null) {
            throw new Error(`Okładka ${asset.id} nie może mieć polskiego miejsca osadzenia`);
        }
        if (
            sourceAsset.role === 'inline' &&
            (!asset.placementAfterHeading || !polishHeadings.some((heading) => heading.text === asset.placementAfterHeading))
        ) {
            throw new Error(`Polski nagłówek dla grafiki ${asset.id} nie istnieje w artykule`);
        }
    }
    return parsed;
}

export async function translateArticleToPolish(
    title: string,
    contentMarkdown: string,
    meta: ArticleMeta,
    visualPlan: ArticleVisualPlan,
    providerConfig: ProviderConfig,
): Promise<PolishArticleLocalization> {
    const visualText = visualPlan.assets.map((asset) => ({
        id: asset.id,
        role: asset.role,
        title: asset.title,
        placementAfterHeading: asset.placementAfterHeading,
        caption: asset.caption,
        altText: asset.altText,
    }));
    const prompt = `Przetłumacz gotowy artykuł Lux Aura Care z angielskiego na naturalny, redakcyjny język polski.

ZASADY BEZWZGLĘDNE:
1. Nie dodawaj ani nie usuwaj żadnych twierdzeń, ostrzeżeń, źródeł, sekcji lub rekomendacji produktowych.
2. Zachowaj Markdown i dokładnie tę samą liczbę nagłówków w tej samej kolejności. Przetłumacz ich tekst.
3. Zachowaj KAŻDY URL dokładnie znak w znak, w tym ścieżki /shop/... i adresy źródeł https://.... Tłumacz wyłącznie tekst linku.
4. Nie wzmacniaj obietnic zdrowotnych ani kosmetycznych. Zachowaj ton edukacyjny i wszystkie zastrzeżenia.
5. Przetłumacz także metadane, słowa kluczowe, tagi, tekst alternatywny oraz teksty każdej grafiki.
6. Dla każdej grafiki zachowaj identyczne id. Dla grafiki inline placementAfterHeading ma być dokładnym polskim tekstem odpowiadającego nagłówka z przetłumaczonego artykułu; dla okładki ma pozostać null.
7. Zwróć wyłącznie JSON zgodny ze schematem.

TYTUŁ:
${title}

METADANE:
${JSON.stringify({
        excerpt: meta.excerpt,
        seoTitle: meta.seoTitle,
        seoDescription: meta.seoDescription,
        keywords: meta.keywords,
        tags: meta.tags,
        imageAlt: meta.imageAlt,
    }, null, 2)}

TEKSTY GRAFIK:
${JSON.stringify(visualText, null, 2)}

ARTYKUŁ:
${contentMarkdown}`;

    const runTranslation = (translationPrompt: string, step: string) => runStep(
        {
            kind: 'json',
            step,
            systemPrompt: 'Jesteś polskim redaktorem i tłumaczem specjalizującym się w bezpiecznych treściach o pielęgnacji, beauty i wellbeing. Tłumacz wiernie, naturalnie i bez dopisywania faktów.',
            prompt: translationPrompt,
            jsonSchema: z.toJSONSchema(polishLocalizationSchema) as Record<string, unknown>,
            deepseek: { model: 'deepseek-v4-pro', thinking: false, temperature: 0.1, maxTokens: 9000 },
        },
        providerConfig,
    );

    let nextPrompt = prompt;
    let lastFailure = 'nieznany błąd walidacji';

    for (let attempt = 0; attempt < 3; attempt += 1) {
        const outcome = await runTranslation(nextPrompt, attempt === 0 ? 'translate-pl' : `translate-pl-repair-${attempt}`);
        const parsed = polishLocalizationSchema.safeParse(outcome.json);
        if (parsed.success) {
            try {
                return validatePolishLocalization(normalizeLocalizationLengths(parsed.data), contentMarkdown, visualPlan);
            } catch (error) {
                lastFailure = error instanceof Error ? error.message : String(error);
            }
        } else {
            lastFailure = parsed.error.issues
                .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
                .join('; ');
        }

        nextPrompt = `${prompt}

POPRZEDNIA ODPOWIEDŹ NIE PRZESZŁA WALIDACJI: ${lastFailure}
Zwróć ponownie CAŁY obiekt JSON. Nie zwracaj komentarza, fragmentu ani obiektu zagnieżdżonego w dodatkowym polu. Zachowaj wszystkie wymagane pola najwyższego poziomu i popraw wyłącznie wskazany błąd.

POPRZEDNIA ODPOWIEDŹ DO NAPRAWY:
${JSON.stringify(outcome.json)}`;
    }

    throw new Error(`Polskie tłumaczenie nie przeszło walidacji po 3 próbach: ${lastFailure}`);
}
