// Hacker News (Algolia) — sygnał trendu spoza feedów RSS (spec Załącznik C).
// Podobnie jak feeds.ts: NIGDY nie rzuca, awaria jednego zapytania nie blokuje reszty.
import type { Candidate } from './types';

const API_URL = 'https://hn.algolia.com/api/v1/search_by_date';
const FETCH_TIMEOUT_MS = 15_000;
const DEFAULT_QUERIES = ['skincare science', 'dermatology', 'beauty tools', 'skin barrier', 'retinol', 'wellness'];
const DEFAULT_MIN_POINTS = 80;
const DEFAULT_SINCE_DAYS = 7;

interface AlgoliaHit {
    title: string | null;
    url: string | null;
    points: number | null;
    created_at: string | null;
    objectID: string;
}
interface AlgoliaResponse {
    hits: AlgoliaHit[];
}

export interface HnQueryOptions {
    queries?: string[];
    minPoints?: number;
    sinceDays?: number;
    now?: Date;
}

export type FetchFn = typeof fetch;

function buildUrl(query: string, options: Required<Omit<HnQueryOptions, 'now'>>, sinceTimestamp: number): string {
    const params = new URLSearchParams({
        tags: 'story',
        query,
        numericFilters: `created_at_i>${sinceTimestamp},points>${options.minPoints}`,
    });
    return `${API_URL}?${params.toString()}`;
}

async function fetchOneQuery(url: string, queryLabel: string, fetchFn: FetchFn): Promise<Candidate[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const response = await fetchFn(url, { signal: controller.signal });
        if (!response.ok) return [];
        const data = (await response.json()) as AlgoliaResponse;
        return data.hits
            // Pomijamy dyskusje bez zewnętrznego URL-a (Ask HN, posty tekstowe) — nie mamy czego zweryfikować.
            .filter((hit): hit is AlgoliaHit & { title: string; url: string } => Boolean(hit.title && hit.url))
            .map((hit) => ({
                title: hit.title,
                url: hit.url,
                source: `Hacker News (${queryLabel})`,
                publishedAt: hit.created_at ?? undefined,
                corroboration: 1,
            }));
    } catch {
        return [];
    } finally {
        clearTimeout(timeout);
    }
}

/** Odpytuje HN dla każdego zapytania z listy. Zbiera wyniki ze wszystkich, awaria jednego nie psuje reszty. */
export async function fetchHackerNews(options: HnQueryOptions = {}, fetchFn: FetchFn = fetch): Promise<Candidate[]> {
    const resolved = {
        queries: options.queries ?? DEFAULT_QUERIES,
        minPoints: options.minPoints ?? DEFAULT_MIN_POINTS,
        sinceDays: options.sinceDays ?? DEFAULT_SINCE_DAYS,
    };
    const now = options.now ?? new Date();
    const sinceTimestamp = Math.floor(now.getTime() / 1000) - resolved.sinceDays * 24 * 60 * 60;

    const results = await Promise.all(
        resolved.queries.map((query) => fetchOneQuery(buildUrl(query, resolved, sinceTimestamp), query, fetchFn)),
    );
    return results.flat();
}
