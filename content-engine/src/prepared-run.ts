import { readFileSync } from 'node:fs';
import { z } from 'zod';
import type { PublishArticlePayload } from './site-client';

export interface PreparedArticleRun {
    version: 1;
    createdAt: string;
    weekKey: string;
    mode: 'publish' | 'draft';
    force: boolean;
    article: PublishArticlePayload;
    sourceUrls: string[];
    metrics: Record<string, unknown>;
    runUrl?: string;
}

export interface VisualPromptManifestItem {
    id: string;
    role: 'cover' | 'inline';
    title: string;
    expectedFilename: string;
    prompt: string;
}

export interface VisualPromptManifest {
    version: 1;
    articleTitle: string;
    items: VisualPromptManifestItem[];
}

const preparedArticleRunSchema = z.object({
    version: z.literal(1),
    createdAt: z.iso.datetime(),
    weekKey: z.string().min(3).max(40),
    mode: z.enum(['publish', 'draft']),
    force: z.boolean(),
    article: z.object({
        title: z.string().min(5),
        excerpt: z.string().min(20),
        seoTitle: z.string().min(5),
        seoDescription: z.string().min(20),
        keywords: z.array(z.string()),
        tags: z.array(z.string()),
        contentMarkdown: z.string().min(500),
        imageAlt: z.string().min(10),
        format: z.enum(['news-analysis', 'practical-guide', 'explainer']),
        topic: z.string().min(3),
        visualPlan: z.object({
            version: z.literal(1),
            artDirection: z.string().min(20),
            brandRules: z.array(z.string()).min(1),
            assets: z.array(
                z.object({
                    id: z.string().regex(/^[a-z0-9][a-z0-9-]{1,78}$/),
                    role: z.enum(['cover', 'inline']),
                    assetType: z.enum(['editorial-cover', 'technical-diagram', 'data-visualization', 'editorial-illustration', 'editorial-photo']),
                    title: z.string().min(3),
                    placementAfterHeading: z.string().nullable(),
                    purpose: z.string().min(20),
                    aspectRatio: z.string().min(3),
                    prompt: z.string().min(100),
                    negativePrompt: z.string().min(20),
                    caption: z.string().min(10),
                    altText: z.string().min(10),
                    requiredFacts: z.array(z.string()),
                }),
            ).min(3),
        }),
        localizations: z.object({
            pl: z.object({
                title: z.string().min(20).max(120),
                excerpt: z.string().min(60).max(300),
                seoTitle: z.string().min(20).max(70),
                seoDescription: z.string().min(100).max(200),
                keywords: z.array(z.string().min(2).max(60)).min(3).max(12),
                tags: z.array(z.string().min(2).max(40)).min(1).max(8),
                contentMarkdown: z.string().min(1500).max(60000),
                imageAlt: z.string().min(10).max(200),
                visualAssets: z.array(z.object({
                    id: z.string().min(3).max(80),
                    title: z.string().min(5).max(160),
                    placementAfterHeading: z.string().min(3).max(200).nullable(),
                    caption: z.string().min(20).max(350),
                    altText: z.string().min(20).max(300),
                })).min(3).max(4),
            }),
        }),
    }),
    sourceUrls: z.array(z.url()).min(2),
    metrics: z.record(z.string(), z.unknown()),
    runUrl: z.url().optional(),
});

export const visualReviewSchema = z.object({
    version: z.literal(1),
    articleTitle: z.string().min(5),
    reviewedAt: z.iso.datetime(),
    images: z.array(
        z.object({
            id: z.string().min(2),
            approved: z.boolean(),
            semanticClarity: z.number().int().min(1).max(10),
            brandFit: z.number().int().min(1).max(10),
            originality: z.number().int().min(1).max(10),
            notes: z.string().min(10).max(800),
        }),
    ),
});

export type VisualReview = z.infer<typeof visualReviewSchema>;

export function readPreparedArticleRun(path: string): PreparedArticleRun {
    return preparedArticleRunSchema.parse(JSON.parse(readFileSync(path, 'utf-8'))) as PreparedArticleRun;
}

export function readAndValidateVisualReview(path: string, prepared: PreparedArticleRun): VisualReview {
    const review = visualReviewSchema.parse(JSON.parse(readFileSync(path, 'utf-8')));
    if (review.articleTitle !== prepared.article.title) throw new Error('Ocena grafik dotyczy innego artykułu');

    for (const asset of prepared.article.visualPlan.assets) {
        const item = review.images.find((candidate) => candidate.id === asset.id);
        if (!item) throw new Error(`Brakuje oceny grafiki „${asset.id}”`);
        if (!item.approved || item.semanticClarity < 8 || item.brandFit < 8 || item.originality < 8) {
            throw new Error(`Grafika „${asset.id}” nie spełnia progu jakości 8/10`);
        }
    }

    if (review.images.length !== prepared.article.visualPlan.assets.length) {
        throw new Error('Liczba ocen nie odpowiada liczbie zaplanowanych grafik');
    }
    return review;
}
