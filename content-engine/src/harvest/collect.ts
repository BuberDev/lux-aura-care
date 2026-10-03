// Orkiestracja Etapu 2 (spec 4.2): zbiera kandydatów ze wszystkich feedów i HN równolegle,
// stosuje twarde filtry PRZED selekcją LLM (świeżość ≤14 dni, URL nieużyty wcześniej,
// tytuł niepodobny do historii), potem deduplikuje. Cel: 25–40 kandydatów na wyjściu.
import type { FeedSource } from '../../config/feeds';
import { FEEDS } from '../../config/feeds';
import { fetchFeed } from './feeds';
import { fetchHackerNews } from './hn';
import { dedupeCandidates } from './dedupe';
import { canonicalizeUrl, titleSimilarity } from './normalize';
import type { Candidate } from './types';

const MAX_AGE_DAYS = 14;
const HISTORY_TITLE_SIMILARITY_MAX = 0.5;

export interface CollectOptions {
    /** URL-e źródeł już wykorzystane w poprzednich artykułach — z GET /api/cron/weekly-article. */
    usedSourceUrls: string[];
    /** Tytuły ostatnich artykułów (baza + statyczne posty) — z tego samego kontekstu. */
    recentTitles: string[];
    now?: Date;
    fetchFn?: typeof fetch;
    feeds?: FeedSource[];
}

export interface CollectResult {
    candidates: Candidate[];
    /**
     * Liczba feedów, które zwróciły ≥1 kandydata. Przybliżenie „feed działa” — feed
     * bez nowych wpisów w oknie 14 dni policzy się tak samo jak feed padnięty (fetchFeed
     * nigdy nie rozróżnia tych dwóch przypadków, celowo, żeby jeden padnięty feed nie
     * wywalał reszty). Do raportu/alertu, nie do logiki filtrowania.
     */
    workingFeedsCount: number;
    totalFeedsCount: number;
}

function isFreshEnough(candidate: Candidate, cutoff: Date): boolean {
    if (!candidate.publishedAt) return true; // brak daty -> nie odrzucamy z powodu wieku, tylko go nie znamy
    const published = new Date(candidate.publishedAt);
    if (Number.isNaN(published.getTime())) return true;
    return published.getTime() >= cutoff.getTime();
}

/** Zbiera, filtruje i deduplikuje kandydatów na aktualny temat publikacji. */
export async function collectCandidates(options: CollectOptions): Promise<CollectResult> {
    const feeds = options.feeds ?? FEEDS;
    const fetchFn = options.fetchFn ?? fetch;
    const now = options.now ?? new Date();
    const cutoff = new Date(now.getTime() - MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

    const [feedResults, hnCandidates] = await Promise.all([
        Promise.all(feeds.map((feed) => fetchFeed(feed.url, feed.name, fetchFn))),
        fetchHackerNews({ now }, fetchFn),
    ]);

    const workingFeedsCount = feedResults.filter((result) => result.length > 0).length;
    const raw = [...feedResults.flat(), ...hnCandidates];

    const usedUrls = new Set(options.usedSourceUrls.map(canonicalizeUrl));

    const filtered = raw.filter((candidate) => {
        if (usedUrls.has(canonicalizeUrl(candidate.url))) return false;
        if (!isFreshEnough(candidate, cutoff)) return false;
        const tooSimilarToHistory = options.recentTitles.some((title) => titleSimilarity(candidate.title, title) > HISTORY_TITLE_SIMILARITY_MAX);
        if (tooSimilarToHistory) return false;
        return true;
    });

    return { candidates: dedupeCandidates(filtered), workingFeedsCount, totalFeedsCount: feeds.length };
}
