// Parsowanie feedów RSS 2.0 i Atom (Załącznik C specu). Parsowanie jest czystą funkcją
// (testowalną na stałych XML-ach); sieciowa część (fetchFeed) nie rzuca — awaria
// pojedynczego feedu nie może przerwać całego zbierania kandydatów (spec 4.2, Etap 2).
import { XMLParser } from 'fast-xml-parser';
import type { Candidate } from './types';

const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_', textNodeName: '#text' });

const FETCH_TIMEOUT_MS = 15_000;
const USER_AGENT = 'LuxAuraCareContentBot/1.0 (+https://luxauracare.com)';

function textOf(value: unknown): string {
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number') return String(value);
    if (value && typeof value === 'object' && '#text' in value) return textOf((value as { '#text': unknown })['#text']);
    return '';
}

function toArray<T>(value: T | T[] | undefined): T[] {
    if (value === undefined) return [];
    return Array.isArray(value) ? value : [value];
}

function atomLink(entry: Record<string, unknown>): string {
    const links = toArray(entry.link as unknown);
    if (links.length === 0) return '';
    const alternate = links.find((link) =>
        link && typeof link === 'object' && '@_href' in link && (!('@_rel' in link) || link['@_rel'] === 'alternate'),
    ) as { '@_href'?: string } | undefined;
    if (alternate?.['@_href']) return alternate['@_href'];
    const withHref = links.find((l) => l && typeof l === 'object' && '@_href' in (l as object)) as { '@_href'?: string } | undefined;
    if (withHref?.['@_href']) return withHref['@_href'];
    // Awaryjnie: <link>URL</link> jako zwykły tekst (rzadkie, ale spotykane w mieszanych feedach).
    return textOf(links[0]);
}

function parseRss(channel: Record<string, unknown>, sourceName: string): Candidate[] {
    return toArray(channel.item as unknown).map((item) => {
        const record = item as Record<string, unknown>;
        return {
            title: textOf(record.title),
            url: textOf(record.link),
            source: sourceName,
            publishedAt: parseDate(textOf(record.pubDate)),
            corroboration: 1,
        };
    });
}

function parseAtom(feed: Record<string, unknown>, sourceName: string): Candidate[] {
    return toArray(feed.entry as unknown).map((entry) => {
        const record = entry as Record<string, unknown>;
        return {
            title: textOf(record.title),
            url: atomLink(record),
            source: sourceName,
            publishedAt: parseDate(textOf(record.published) || textOf(record.updated)),
            corroboration: 1,
        };
    });
}

function parseDate(raw: string): string | undefined {
    if (!raw) return undefined;
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

/** Parsuje treść XML feedu (RSS 2.0 albo Atom) na listę kandydatów. Zwraca [], gdy kształt jest nierozpoznany. */
export function parseFeed(xml: string, sourceName: string): Candidate[] {
    let parsed: Record<string, unknown>;
    try {
        parsed = parser.parse(xml) as Record<string, unknown>;
    } catch {
        return [];
    }

    const rss = parsed.rss as { channel?: Record<string, unknown> } | undefined;
    if (rss?.channel) return parseRss(rss.channel, sourceName).filter((c) => c.title && c.url);

    const feed = parsed.feed as Record<string, unknown> | undefined;
    if (feed?.entry !== undefined) return parseAtom(feed, sourceName).filter((c) => c.title && c.url);

    return [];
}

export type FetchFn = typeof fetch;

/**
 * Pobiera i parsuje jeden feed. NIGDY nie rzuca — awaria (timeout, 404, XML się nie parsuje)
 * daje pustą listę, żeby jeden zepsuty feed nie zablokował reszty zbierania (spec 4.2).
 */
export async function fetchFeed(url: string, sourceName: string, fetchFn: FetchFn = fetch): Promise<Candidate[]> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    try {
        const response = await fetchFn(url, {
            headers: {
                'User-Agent': USER_AGENT,
                Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.1',
            },
            signal: controller.signal,
        });
        if (!response.ok) return [];
        const xml = await response.text();
        return parseFeed(xml, sourceName);
    } catch {
        return [];
    } finally {
        clearTimeout(timeout);
    }
}
