import { z } from 'zod';

// Nowe przebiegi używają osobnego slotu dnia (np. 2026-W39-WED). Format bez sufiksu
// pozostaje akceptowany dla zgodności z historią i ręcznymi klientami sprzed zmiany.
export const WEEK_KEY_PATTERN = /^\d{4}-W(0[1-9]|[1-4]\d|5[0-3])(?:-(MON|TUE|WED|THU|FRI|SAT|SUN))?$/;

// Limit surowego ciała żądania (okładka w base64 ≤ ~2,8 MB + tekst) — poniżej limitu funkcji Vercel.
export const MAX_BODY_CHARS = 4 * 1024 * 1024;

const weekKey = z.string().regex(WEEK_KEY_PATTERN, 'weekKey must look like 2026-W39-WED');
const httpsUrl = z
    .string()
    .url()
    .refine((value) => value.startsWith('https://'), 'must be an https URL');
const mode = z.enum(['publish', 'draft']);
const metrics = z.record(z.string(), z.unknown());
const visualAsset = z.object({
    id: z.string().min(3).max(80),
    role: z.enum(['cover', 'inline']),
    assetType: z.enum(['editorial-cover', 'technical-diagram', 'data-visualization', 'editorial-illustration', 'editorial-photo']),
    title: z.string().min(5).max(120),
    placementAfterHeading: z.string().min(3).max(160).nullable(),
    purpose: z.string().min(40).max(500),
    aspectRatio: z.string().min(3).max(80),
    prompt: z.string().min(500).max(5000),
    negativePrompt: z.string().min(80).max(1500),
    caption: z.string().min(20).max(350),
    altText: z.string().min(20).max(300),
    requiredFacts: z.array(z.string().min(5).max(500)).max(12),
});
const visualPlan = z.object({
    version: z.literal(1),
    artDirection: z.string().min(80).max(1200),
    brandRules: z.array(z.string().min(20).max(500)).min(5).max(12),
    assets: z.array(visualAsset).min(3).max(4),
});

const polishLocalization = z.object({
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
});

const generatedImage = z.object({
    mimeType: z.literal('image/jpeg'),
    base64: z.string().min(100),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
});

export const publishSchema = z.object({
    kind: z.literal('publish'),
    weekKey,
    mode: mode.default('draft'),
    force: z.boolean().default(false),
    article: z.object({
        title: z.string().min(20).max(120),
        excerpt: z.string().min(60).max(300),
        seoTitle: z.string().min(20).max(70),
        seoDescription: z.string().min(100).max(200),
        keywords: z.array(z.string().min(2).max(60)).min(3).max(12),
        tags: z.array(z.string().min(2).max(40)).min(1).max(8),
        contentMarkdown: z.string().min(2000).max(60000),
        imageAlt: z.string().min(10).max(200),
        format: z.enum(['news-analysis', 'practical-guide', 'explainer']),
        topic: z.string().min(5).max(200),
        visualPlan: visualPlan.optional(),
        localizations: z.object({ pl: polishLocalization }),
    }),
    cover: generatedImage.nullable(),
    inlineImages: z
        .array(
            generatedImage.extend({
                id: z.string().min(3).max(80),
                placementAfterHeading: z.string().min(3).max(160),
                caption: z.string().min(20).max(350),
                altText: z.string().min(20).max(300),
                sha256: z.string().regex(/^[a-f0-9]{64}$/),
            }),
        )
        .max(3)
        .optional()
        .default([]),
    run: z.object({
        sourceUrls: z.array(httpsUrl).min(2).max(30),
        metrics: metrics.default({}),
        runUrl: z.string().url().optional(),
    }),
});

export const failureSchema = z.object({
    kind: z.literal('failure'),
    weekKey,
    mode: mode.default('draft'),
    stage: z.string().min(1).max(60),
    message: z.string().min(1).max(2000),
    runUrl: z.string().url().optional(),
    metrics: metrics.default({}),
});

export const payloadSchema = z.discriminatedUnion('kind', [publishSchema, failureSchema]);

export type PublishPayload = z.infer<typeof publishSchema>;
export type FailurePayload = z.infer<typeof failureSchema>;
export type WeeklyPayload = z.infer<typeof payloadSchema>;

export function describeIssues(error: z.ZodError): { path: string; message: string }[] {
    return error.issues.map((issue) => ({ path: issue.path.map(String).join('.'), message: issue.message }));
}
