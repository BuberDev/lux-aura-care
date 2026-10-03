import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createFallbackVisualPlan } from './editorial/visual-plan';
import { readAndValidateVisualReview, readPreparedArticleRun, type PreparedArticleRun } from './prepared-run';

function fixture(): PreparedArticleRun {
    const contentMarkdown = `## Co się wydarzyło\n\n${'Zweryfikowany opis mechanizmu. '.repeat(30)}\n\n## Co zrobić w firmie\n\n${'Praktyczny plan wdrożenia. '.repeat(30)}`;
    const visualPlan = createFallbackVisualPlan('Bezpieczny agent AI w firmie', contentMarkdown);
    return {
        version: 1,
        createdAt: '2026-09-28T08:00:00.000Z',
        weekKey: '2026-09-28',
        mode: 'publish',
        force: false,
        article: {
            title: 'Bezpieczny agent AI w firmie',
            excerpt: 'Praktyczna analiza wdrożenia bezpiecznego agenta AI w organizacji.',
            seoTitle: 'Bezpieczny agent AI w firmie',
            seoDescription: 'Jak wdrożyć agenta AI w firmie z kontrolą ryzyka, danych oraz odpowiedzialności.',
            keywords: ['agent AI'],
            tags: ['AI'],
            contentMarkdown,
            imageAlt: 'Autorska grafika Lux Aura Care o bezpiecznym agencie AI.',
            format: 'practical-guide',
            topic: 'Bezpieczne wdrożenie agentów AI',
            visualPlan,
            localizations: {
                pl: {
                    title: 'Bezpieczny agent AI w firmie',
                    excerpt: 'Praktyczna analiza wdrożenia bezpiecznego agenta AI w organizacji.',
                    seoTitle: 'Bezpieczny agent AI w firmie',
                    seoDescription: 'Jak wdrożyć agenta AI w firmie z kontrolą ryzyka, ochroną danych oraz jasno określoną odpowiedzialnością.',
                    keywords: ['agent AI', 'bezpieczeństwo AI', 'wdrożenie AI'],
                    tags: ['sztuczna inteligencja'],
                    contentMarkdown,
                    imageAlt: 'Grafika redakcyjna o bezpiecznym wdrożeniu agenta AI w firmie.',
                    visualAssets: visualPlan.assets.map((asset) => ({
                        id: asset.id,
                        title: asset.title,
                        placementAfterHeading: asset.placementAfterHeading,
                        caption: asset.caption,
                        altText: asset.altText,
                    })),
                },
            },
        },
        sourceUrls: ['https://example.com/source-one', 'https://example.org/source-two'],
        metrics: { spentUsd: 0.2 },
    };
}

describe('local Codex prepared publication gate', () => {
    it('accepts a complete prepared run and visual review at or above 8/10', () => {
        const directory = mkdtempSync(join(tmpdir(), 'luxauracare-prepared-'));
        const prepared = fixture();
        const preparedPath = join(directory, 'prepared.json');
        const reviewPath = join(directory, 'visual-review.json');
        writeFileSync(preparedPath, JSON.stringify(prepared));
        writeFileSync(
            reviewPath,
            JSON.stringify({
                version: 1,
                articleTitle: prepared.article.title,
                reviewedAt: '2026-09-28T08:30:00.000Z',
                images: prepared.article.visualPlan.assets.map((asset) => ({
                    id: asset.id,
                    approved: true,
                    semanticClarity: 8,
                    brandFit: 9,
                    originality: 8,
                    notes: 'Czytelna, tematyczna kompozycja zgodna z systemem wizualnym Lux Aura Care.',
                })),
            }),
        );

        const parsed = readPreparedArticleRun(preparedPath);
        expect(readAndValidateVisualReview(reviewPath, parsed).images).toHaveLength(3);
    });

    it('blocks publication when even one image scores below the quality threshold', () => {
        const directory = mkdtempSync(join(tmpdir(), 'luxauracare-review-'));
        const prepared = fixture();
        const reviewPath = join(directory, 'visual-review.json');
        writeFileSync(
            reviewPath,
            JSON.stringify({
                version: 1,
                articleTitle: prepared.article.title,
                reviewedAt: '2026-09-28T08:30:00.000Z',
                images: prepared.article.visualPlan.assets.map((asset, index) => ({
                    id: asset.id,
                    approved: true,
                    semanticClarity: index === 0 ? 7 : 9,
                    brandFit: 9,
                    originality: 9,
                    notes: 'Ocena semantyczna i zgodność z briefem zostały sprawdzone wizualnie.',
                })),
            }),
        );

        expect(() => readAndValidateVisualReview(reviewPath, prepared)).toThrow(/progu jakości 8\/10/);
    });
});
