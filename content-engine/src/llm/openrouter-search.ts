// Most wyszukiwania — używany tylko w torze awaryjnym (DeepSeek nie ma wyszukiwania w API).
// Model do samego wyszukiwania jest celowo najtańszy (deepseek-v4.1-flash) — liczy się
// wtyczka `web`, nie jakość tekstu odpowiedzi modelu, którą i tak ignorujemy.
// Zweryfikowane na żywo 22.09.2026: silnik `exa`, max_results 5 -> 5/5 wyników w `annotations`.
import type { LlmSource } from './types';
import type { FetchFn } from './deepseek';

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const SEARCH_MODEL = 'deepseek/deepseek-v4.1-flash';
const DEFAULT_MAX_RESULTS = 8;
// Zweryfikowane na żywo 22.09.2026: 60s bywa za krótkie dla realnego wyszukiwania Exa
// pod obciążeniem — call kończył się AbortError zanim wynik zdążył wrócić.
const DEFAULT_TIMEOUT_MS = 120_000;
const EXA_COST_PER_QUERY_USD = 0.007; // spec 4.4 — użyte tylko do logów, prawdziwy koszt jest w `usage.cost`

interface OpenRouterAnnotation {
    type: string;
    url_citation?: { url: string; title?: string; content?: string };
}
interface OpenRouterResponse {
    choices?: { message?: { content?: string; annotations?: OpenRouterAnnotation[] } }[];
    usage?: { cost?: number };
    error?: { message?: string };
}

export interface OpenRouterSearchResult {
    sources: LlmSource[];
    /** Tekst odpowiedzi modelu — pomocniczy kontekst, prawdziwym wynikiem są `sources`. */
    summaryText: string;
    costUsd: number;
}

/**
 * Szuka świeżych informacji o `query` przez wtyczkę `web` OpenRouter (silnik Exa).
 * Rzuca przy błędzie sieci/API. Nigdy nie zwraca `sources` pustych bez wyjątku —
 * pusta lista wyników to sygnał do wybrania tematu rezerwowego, nie cichej porażki.
 */
export async function searchWeb(
    query: string,
    options: { apiKey: string; maxResults?: number; timeoutMs?: number },
    fetchFn: FetchFn = fetch,
): Promise<OpenRouterSearchResult> {
    const maxResults = options.maxResults ?? DEFAULT_MAX_RESULTS;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

    try {
        const response = await fetchFn(API_URL, {
            method: 'POST',
            headers: { Authorization: `Bearer ${options.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: SEARCH_MODEL,
                plugins: [{ id: 'web', engine: 'exa', max_results: maxResults }],
                messages: [
                    {
                        role: 'user',
                        content: `Wyszukaj świeże (maks. 14 dni) informacje o: ${query}\n\nDla KAŻDEGO znalezionego wyniku wypisz osobną linię w formacie markdown [tytuł](URL) i jedno zdanie streszczenia — dzięki temu każdy wynik trafi do cytowań.`,
                    },
                ],
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`OpenRouter (wyszukiwanie) zwróciło ${response.status}: ${text.slice(0, 300)}`);
        }

        const data = (await response.json()) as OpenRouterResponse;
        if (data.error) throw new Error(`OpenRouter (wyszukiwanie): ${data.error.message ?? 'nieznany błąd'}`);

        const message = data.choices?.[0]?.message;
        const annotations = message?.annotations ?? [];
        const seen = new Set<string>();
        const sources: LlmSource[] = [];
        for (const annotation of annotations) {
            const citation = annotation.url_citation;
            if (!citation?.url || seen.has(citation.url)) continue;
            seen.add(citation.url);
            sources.push({ url: citation.url, title: citation.title });
        }

        return {
            sources,
            summaryText: message?.content ?? '',
            costUsd: data.usage?.cost ?? EXA_COST_PER_QUERY_USD,
        };
    } finally {
        clearTimeout(timeout);
    }
}
