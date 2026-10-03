import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { loadEnv } from './env';
import {
    generatedVisualFilename,
    prepareExternalArticleVisuals,
} from './image/generate-article-visuals';
import { escapeHtml, sendTelegramNotification } from './notify';
import { readAndValidateVisualReview, readPreparedArticleRun } from './prepared-run';
import { SiteClient, type PublishPayload } from './site-client';
import { countWords } from './quality/parse';

const OUT_DIR = join(process.cwd(), 'out');
const RAW_VISUALS_DIR = join(OUT_DIR, 'codex-visuals');

async function main(): Promise<void> {
    const env = loadEnv();
    const prepared = readPreparedArticleRun(join(OUT_DIR, 'prepared.json'));
    readAndValidateVisualReview(join(OUT_DIR, 'visual-review.json'), prepared);

    const site = new SiteClient(env.siteUrl, env.cronSecret);
    const context = await site.getContext(prepared.weekKey);
    if (context.done && !prepared.force) {
        console.log(`[weekly-article] slot ${prepared.weekKey} jest już zrobiony (${context.done.status}, ${context.done.url}) — kończę.`);
        return;
    }

    const visuals = await prepareExternalArticleVisuals(prepared.article.visualPlan, RAW_VISUALS_DIR);
    mkdirSync(OUT_DIR, { recursive: true });
    for (const visual of visuals) {
        writeFileSync(join(OUT_DIR, generatedVisualFilename(visual)), Buffer.from(visual.base64, 'base64'));
    }

    const generatedCover = visuals.find((visual) => visual.role === 'cover');
    if (!generatedCover) throw new Error('Pełny zestaw nie zawiera okładki');

    const payload: PublishPayload = {
        kind: 'publish',
        weekKey: prepared.weekKey,
        mode: prepared.mode,
        force: prepared.force,
        article: prepared.article,
        cover: {
            mimeType: generatedCover.mimeType,
            base64: generatedCover.base64,
            width: generatedCover.width,
            height: generatedCover.height,
        },
        inlineImages: visuals.filter((visual) => visual.role === 'inline').map((visual) => {
            if (!visual.placementAfterHeading) throw new Error(`Grafika śródtekstowa „${visual.id}” nie ma miejsca osadzenia`);
            return {
                id: visual.id,
                placementAfterHeading: visual.placementAfterHeading,
                caption: visual.caption,
                altText: visual.altText,
                mimeType: visual.mimeType,
                base64: visual.base64,
                width: visual.width,
                height: visual.height,
                sha256: visual.sha256,
            };
        }),
        run: {
            sourceUrls: prepared.sourceUrls,
            metrics: {
                ...prepared.metrics,
                imageModel: 'gpt-image-2 (Codex built-in Imagegen)',
                imageWorkflow: 'local-codex-reviewed',
                imagesGenerated: visuals.length,
            },
            ...(prepared.runUrl ? { runUrl: prepared.runUrl } : {}),
        },
    };

    const result = await site.publish(payload);
    writeFileSync(join(OUT_DIR, 'publish-result.json'), JSON.stringify(result, null, 2), 'utf-8');
    if (result.httpStatus >= 400) throw new Error(`Publikacja zwróciła HTTP ${result.httpStatus}: ${JSON.stringify(result.body).slice(0, 500)}`);

    const url = 'url' in result.body ? result.body.url : '(brak URL-a)';
    console.log(`[weekly-article] opublikowano: ${url}`);
    await sendTelegramNotification(
        `🤖 <b>Lux Aura Care — automatyczny artykuł</b>\n\n✅ ${escapeHtml(prepared.article.title)}\n${escapeHtml(String(url))}\nSłowa: ${countWords(prepared.article.contentMarkdown)} | Źródła: ${prepared.sourceUrls.length} | Grafiki Codex 10/10: ${visuals.length}`,
        { botToken: env.telegramBotToken, chatId: env.telegramChatId },
    );
}

await main().catch(async (error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[weekly-article] publikacja przygotowanego artykułu nieudana: ${message}`);
    try {
        const env = loadEnv();
        const prepared = readPreparedArticleRun(join(OUT_DIR, 'prepared.json'));
        await new SiteClient(env.siteUrl, env.cronSecret).reportFailure({
            kind: 'failure',
            weekKey: prepared.weekKey,
            mode: prepared.mode,
            stage: 'local-codex-visuals-publish',
            message: message.slice(0, 2000),
            metrics: prepared.metrics,
            ...(prepared.runUrl ? { runUrl: prepared.runUrl } : {}),
        });
    } catch (reportError) {
        console.error('Nie udało się zgłosić błędu publikacji:', reportError);
    }
    process.exitCode = 1;
});
