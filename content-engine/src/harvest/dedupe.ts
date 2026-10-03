// Deduplikacja kandydatów (spec 4.2, Etap 2): najpierw dokładny URL (to ten sam artykuł —
// merge bez zwiększania corroboration), potem podobieństwo tytułów Jaccard >= 0,7 MIĘDZY
// RÓŻNYMI domenami (to niezależne relacje o tym samym wydarzeniu — merge ZE zwiększeniem
// corroboration, bo to właśnie ono karmi później regułę „potwierdzenie w ≥2 źródłach”).
import type { Candidate } from './types';
import { canonicalizeUrl, hostnameOf, titleSimilarity } from './normalize';

const DEFAULT_TITLE_SIMILARITY_THRESHOLD = 0.7;

function earlierOf(a: string | undefined, b: string | undefined): string | undefined {
    if (!a) return b;
    if (!b) return a;
    return new Date(a).getTime() <= new Date(b).getTime() ? a : b;
}

/** Krok 1: scala kandydatów o identycznym kanonicznym URL-u w jeden wpis (ta sama publikacja). */
function mergeExactUrlDuplicates(candidates: Candidate[]): Candidate[] {
    const byUrl = new Map<string, Candidate>();
    for (const candidate of candidates) {
        const key = canonicalizeUrl(candidate.url);
        const existing = byUrl.get(key);
        if (!existing) {
            byUrl.set(key, { ...candidate });
            continue;
        }
        byUrl.set(key, { ...existing, publishedAt: earlierOf(existing.publishedAt, candidate.publishedAt) });
    }
    return [...byUrl.values()];
}

/** Krok 2: scala pozostałych kandydatów o podobnych tytułach z RÓŻNYCH domen, zwiększając corroboration. */
function mergeCrossSourceDuplicates(candidates: Candidate[], threshold: number): Candidate[] {
    const merged: Candidate[] = [];
    const used = new Array(candidates.length).fill(false);

    for (let i = 0; i < candidates.length; i++) {
        if (used[i]) continue;
        used[i] = true;
        let corroboration = candidates[i].corroboration;

        for (let j = i + 1; j < candidates.length; j++) {
            if (used[j]) continue;
            if (hostnameOf(candidates[i].url) === hostnameOf(candidates[j].url)) continue; // ta sama domena — inny artykuł, nie korroboracja
            if (titleSimilarity(candidates[i].title, candidates[j].title) >= threshold) {
                used[j] = true;
                corroboration += 1;
            }
        }

        merged.push({ ...candidates[i], corroboration });
    }

    return merged;
}

export interface DedupeOptions {
    titleSimilarityThreshold?: number;
}

/** Pełna deduplikacja: dokładny URL, potem podobieństwo tytułów między różnymi domenami. */
export function dedupeCandidates(candidates: Candidate[], options: DedupeOptions = {}): Candidate[] {
    const threshold = options.titleSimilarityThreshold ?? DEFAULT_TITLE_SIMILARITY_THRESHOLD;
    return mergeCrossSourceDuplicates(mergeExactUrlDuplicates(candidates), threshold);
}
