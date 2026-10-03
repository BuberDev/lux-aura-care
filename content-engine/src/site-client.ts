// Klient HTTP do /api/cron/weekly-article (M1) — kontrakt zgodny z Appendix B specu
// i faktycznie zaimplementowanymi schematami w src/lib/weekly-article/schema.ts (M1).
// Content-engine jest osobnym pakietem bez dostępu do bazy — cała komunikacja idzie
// przez ten jeden endpoint.

export interface PublishArticlePayload {
    title: string;
    excerpt: string;
    seoTitle: string;
    seoDescription: string;
    keywords: string[];
    tags: string[];
    contentMarkdown: string;
    imageAlt: string;
    format: 'news-analysis' | 'practical-guide' | 'explainer';
    topic: string;
    visualPlan: import('./editorial/types').ArticleVisualPlan;
    localizations: {
        pl: import('./editorial/translate').PolishArticleLocalization;
    };
}

export interface PublishCover {
    mimeType: 'image/jpeg';
    base64: string;
    width: number;
    height: number;
}

export interface PublishInlineImage extends PublishCover {
    id: string;
    placementAfterHeading: string;
    caption: string;
    altText: string;
    sha256: string;
}

export interface PublishPayload {
    kind: 'publish';
    weekKey: string;
    mode: 'publish' | 'draft';
    force: boolean;
    article: PublishArticlePayload;
    cover: PublishCover | null;
    inlineImages: PublishInlineImage[];
    run: {
        sourceUrls: string[];
        metrics: Record<string, unknown>;
        /** Musi być pominięte (nie pustym stringiem) gdy nie ma URL-a — schemat M1 odrzuca `""`. */
        runUrl?: string;
    };
}

export interface FailurePayload {
    kind: 'failure';
    weekKey: string;
    mode: 'publish' | 'draft';
    stage: string;
    message: string;
    runUrl?: string;
    metrics: Record<string, unknown>;
}

export interface WeeklyContext {
    weekKey: string;
    done: { status: 'published' | 'drafted'; articleId: string | null; url: string | null } | null;
    recent: { title: string; slug: string; source: 'db' | 'static'; date: string }[];
    usedSourceUrls: string[];
}

export type PublishResponseBody =
    | { status: 'published' | 'drafted'; articleId: string; slug: string; url: string }
    | { status: 'already_done'; articleId: string | null; url: string | null }
    | { status: 'dry_run_ok'; wouldBe: 'published' | 'drafted'; slug: string; wordCount: number }
    | { error: 'content_rejected'; reasons: string[] }
    | { error: string; issues?: unknown };

export interface PublishResult {
    httpStatus: number;
    body: PublishResponseBody;
}

const RETRYABLE_STATUS_MIN = 500;
const RETRY_DELAYS_MS = [1000, 3000];
const CONTEXT_TIMEOUT_MS = 60_000;
const PUBLISH_TIMEOUT_MS = 180_000;
const FAILURE_REPORT_TIMEOUT_MS = 30_000;

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class SiteClient {
    constructor(
        private readonly baseUrl: string,
        private readonly cronSecret: string,
        private readonly fetchFn: typeof fetch = fetch,
    ) {}

    private headers(): Record<string, string> {
        return { Authorization: `Bearer ${this.cronSecret}`, 'Content-Type': 'application/json' };
    }

    async getContext(weekKey: string): Promise<WeeklyContext> {
        const response = await this.fetchFn(`${this.baseUrl}/api/cron/weekly-article?weekKey=${encodeURIComponent(weekKey)}`, {
            headers: this.headers(),
            signal: AbortSignal.timeout(CONTEXT_TIMEOUT_MS),
        });
        if (!response.ok) {
            throw new Error(`GET /api/cron/weekly-article zwróciło ${response.status}: ${(await response.text()).slice(0, 300)}`);
        }
        return (await response.json()) as WeeklyContext;
    }

    /** POST publish, z ponowieniami przy błędach sieci/5xx (spec 4.2, Etap 9). Błędy 4xx nie są ponawiane. */
    async publish(payload: PublishPayload, options: { dryRun?: boolean } = {}): Promise<PublishResult> {
        const url = `${this.baseUrl}/api/cron/weekly-article${options.dryRun ? '?dryRun=1' : ''}`;
        let lastError: unknown;

        for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
            try {
                const response = await this.fetchFn(url, {
                    method: 'POST',
                    headers: this.headers(),
                    body: JSON.stringify(payload),
                    signal: AbortSignal.timeout(PUBLISH_TIMEOUT_MS),
                });
                if (response.status >= RETRYABLE_STATUS_MIN && attempt < RETRY_DELAYS_MS.length) {
                    await sleep(RETRY_DELAYS_MS[attempt]);
                    continue;
                }
                const body = (await response.json()) as PublishResponseBody;
                return { httpStatus: response.status, body };
            } catch (error) {
                lastError = error;
                if (attempt < RETRY_DELAYS_MS.length) {
                    await sleep(RETRY_DELAYS_MS[attempt]);
                    continue;
                }
            }
        }

        throw new Error(`POST /api/cron/weekly-article zawiodło po ${RETRY_DELAYS_MS.length + 1} próbach: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
    }

    async reportFailure(payload: FailurePayload, options: { dryRun?: boolean } = {}): Promise<void> {
        const url = `${this.baseUrl}/api/cron/weekly-article${options.dryRun ? '?dryRun=1' : ''}`;
        try {
            await this.fetchFn(url, {
                method: 'POST',
                headers: this.headers(),
                body: JSON.stringify(payload),
                signal: AbortSignal.timeout(FAILURE_REPORT_TIMEOUT_MS),
            });
        } catch (error) {
            console.error('Nie udało się zgłosić niepowodzenia do /api/cron/weekly-article:', error);
        }
    }
}
