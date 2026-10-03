// Normalizacja URL-i (do porównań w dedupe) i podobieństwo tytułów (Jaccard na zbiorach słów).

/** Kanoniczny URL: bez `utm_*`, bez fragmentu, bez `www.`, bez końcowego `/` (poza samym rootem). */
export function canonicalizeUrl(url: string): string {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return url.trim();
    }

    parsed.hash = '';
    const toDelete: string[] = [];
    parsed.searchParams.forEach((_value, key) => {
        if (/^utm_/i.test(key)) toDelete.push(key);
    });
    toDelete.forEach((key) => parsed.searchParams.delete(key));

    const hostname = parsed.hostname.replace(/^www\./i, '');
    let pathname = parsed.pathname;
    if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    const search = parsed.searchParams.toString();

    return `${parsed.protocol}//${hostname}${pathname}${search ? `?${search}` : ''}`;
}

/** Sama domena (bez `www.`), do sprawdzenia „różne źródła” w dedupe.ts. */
export function hostnameOf(url: string): string {
    try {
        return new URL(url).hostname.replace(/^www\./i, '');
    } catch {
        return url;
    }
}

const STOPWORDS = new Set([
    'i', 'w', 'na', 'do', 'z', 'o', 'a', 'to', 'się', 'że', 'jest', 'są', 'nie', 'po', 'za', 'dla', 'jak', 'co', 'to', 'ale',
    'the', 'a', 'an', 'of', 'to', 'in', 'on', 'for', 'and', 'is', 'are', 'with', 'by',
]);

function tokenize(title: string): Set<string> {
    // `ł` nie jest znakiem złożonym (kreska nie jest oddzielnym znakiem diakrytycznym),
    // więc NFD go nie rozkłada — trzeba transliterować ręcznie PRZED normalizacją,
    // inaczej trafia do filtra "usuń nie-alfanumeryczne" i cały token się gubi
    // (ten sam błąd, co przy generateSlug w M1 — src/lib/blog-utils.ts).
    const normalized = title
        .toLowerCase()
        .replace(/ł/g, 'l')
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s]/g, ' ');
    const tokens = normalized.split(/\s+/).filter((token) => token.length > 1 && !STOPWORDS.has(token));
    return new Set(tokens);
}

/** Podobieństwo Jaccard dwóch tytułów po tokenizacji (bez polskich diakrytyków i stopwords), 0..1. */
export function titleSimilarity(a: string, b: string): number {
    const setA = tokenize(a);
    const setB = tokenize(b);
    if (setA.size === 0 && setB.size === 0) return 1;
    if (setA.size === 0 || setB.size === 0) return 0;

    let intersection = 0;
    for (const token of setA) {
        if (setB.has(token)) intersection += 1;
    }
    const union = setA.size + setB.size - intersection;
    return intersection / union;
}
