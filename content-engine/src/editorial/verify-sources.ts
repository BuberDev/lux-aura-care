// Etap 4, weryfikacja źródeł (spec 4.2): GET każdego cytowanego URL-a — status, tytuł,
// data publikacji, fragment tekstu (~3000 znaków) jako grunt prawdy dla krytyka.
import type { VerifiedSource } from './types';

const TIMEOUT_MS = 8_000;
const MAX_BODY_BYTES = 1_000_000;
// Strony produktowe AWS i część portali mają kilka tysięcy znaków nawigacji przed
// właściwym artykułem. Limit 3000 ucinał oficjalny komunikat przed pierwszym zdaniem
// merytorycznym, przez co model widział URL, ale nie widział dowodu. 10k nadal jest
// małym wycinkiem względem kontekstu modeli, a obejmuje pełny tekst takich stron.
const EXCERPT_MAX_CHARS = 10_000;
const USER_AGENT = 'LuxAuraCareContentBot/1.0 (+https://luxauracare.com)';

function extractTitle(html: string): string | null {
    const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return match ? match[1].trim() : null;
}

function extractPublishedDate(html: string): string | null {
    const metaOgFirst = html.match(/<meta[^>]+property=["']article:published_time["'][^>]+content=["']([^"']+)["']/i);
    const metaContentFirst = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']article:published_time["']/i);
    if (metaOgFirst) return metaOgFirst[1];
    if (metaContentFirst) return metaContentFirst[1];
    const timeTag = html.match(/<time[^>]+datetime=["']([^"']+)["']/i);
    if (timeTag) return timeTag[1];
    const jsonLd = html.match(/"datePublished"\s*:\s*"([^"]+)"/i);
    if (jsonLd) return jsonLd[1];
    return null;
}

function extractExcerpt(html: string, maxChars: number): string {
    const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
    const text = withoutScripts.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.slice(0, maxChars);
}

async function verifyOne(url: string, fetchFn: typeof fetch): Promise<VerifiedSource> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
        const response = await fetchFn(url, { signal: controller.signal, headers: { 'User-Agent': USER_AGENT } });
        if (response.status !== 200) {
            return { url, httpStatus: response.status, title: null, publishedAt: null, excerpt: null };
        }
        const html = (await response.text()).slice(0, MAX_BODY_BYTES);
        return {
            url,
            httpStatus: 200,
            title: extractTitle(html),
            publishedAt: extractPublishedDate(html),
            excerpt: extractExcerpt(html, EXCERPT_MAX_CHARS),
        };
    } catch {
        return { url, httpStatus: null, title: null, publishedAt: null, excerpt: null };
    } finally {
        clearTimeout(timeout);
    }
}

/** Weryfikuje listę URL-i równolegle. Nigdy nie rzuca — awaria jednego źródła daje httpStatus:null, nie wyjątek. */
export async function verifySources(urls: string[], fetchFn: typeof fetch = fetch): Promise<VerifiedSource[]> {
    const uniqueUrls = [...new Set(urls)];
    return Promise.all(uniqueUrls.map((url) => verifyOne(url, fetchFn)));
}
