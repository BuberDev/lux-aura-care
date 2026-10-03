// Tor awaryjny: bezpośrednie API DeepSeek. Brak wyszukiwania w internecie — kroki z
// `allowSearch` idą przez most OpenRouter (openrouter-search.ts), a wynik trafia tu
// jako kontekst w promptcie. Fakty zweryfikowane na żywo 21.09.2026 (patrz spec 2.2):
// thinking domyślnie włączony i zjada `max_tokens`; tryb JSON to tylko `json_object`,
// nie `json_schema`; słowo „json” musi wystąpić w promptcie.
import type { LlmStepConfig, LlmStepResult } from './types';

const API_URL = 'https://api.deepseek.com/chat/completions';
// Spec 4.4 / dokumentacja DeepSeek: serwer może trzymać połączenie otwarte i wysyłać
// puste linie keep-alive do 10 min, zanim w ogóle zacznie inferencję pod obciążeniem —
// 280s bywało za krótkie i ucinało zapytania, które serwer wciąż by obsłużył (zweryfikowane
// na żywo 22.09.2026). Dajemy realny zapas zamiast obcinać przy pierwszym spowolnieniu.
const DEFAULT_TIMEOUT_MS = 480_000;

export type FetchFn = typeof fetch;

interface DeepseekChoice {
    message: { content: string; reasoning_content?: string };
    finish_reason: string;
}
interface DeepseekResponse {
    choices: DeepseekChoice[];
    usage?: { prompt_tokens: number; completion_tokens: number };
}

export interface DeepseekCallOptions {
    apiKey: string;
    model: 'deepseek-flash' | 'deepseek-v4-pro';
    thinking: boolean;
    reasoningEffort?: 'low' | 'high' | 'max';
    temperature: number;
    maxTokens: number;
    timeoutMs?: number;
}

/** Cennik szczytowy USD/1M tokenów (spec 4.4) — używany tylko do szacunku kosztu w logach. */
const PRICE_PER_MILLION: Record<DeepseekCallOptions['model'], { input: number; output: number }> = {
    'deepseek-flash': { input: 0.3, output: 1.2 },
    'deepseek-v4-pro': { input: 1.32, output: 3.96 },
};

function estimateCostUsd(model: DeepseekCallOptions['model'], usage: DeepseekResponse['usage']): number {
    if (!usage) return 0;
    const price = PRICE_PER_MILLION[model];
    return (usage.prompt_tokens / 1_000_000) * price.input + (usage.completion_tokens / 1_000_000) * price.output;
}

function ensureMentionsJson(prompt: string): string {
    return /\bjson\b/i.test(prompt) ? prompt : `${prompt}\n\nZwróć wynik w formacie JSON.`;
}

async function callOnce(
    options: DeepseekCallOptions,
    body: Record<string, unknown>,
    fetchFn: FetchFn,
): Promise<{ content: string; usage: DeepseekResponse['usage']; finishReason: string }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS);
    try {
        const response = await fetchFn(API_URL, {
            method: 'POST',
            headers: { Authorization: `Bearer ${options.apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
            signal: controller.signal,
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`DeepSeek API zwróciło ${response.status}: ${text.slice(0, 300)}`);
        }
        const data = (await response.json()) as DeepseekResponse;
        const choice = data.choices?.[0];
        if (!choice) throw new Error('DeepSeek API: brak choices w odpowiedzi');
        return { content: choice.message.content ?? '', usage: data.usage, finishReason: choice.finish_reason };
    } finally {
        clearTimeout(timeout);
    }
}

/**
 * Wywołuje DeepSeek dla jednego kroku. Rzuca przy błędzie sieci/API — `provider.ts`
 * łapie wyjątek i decyduje, co dalej (to jest już tor awaryjny, więc dalej nie ma gdzie spaść).
 */
export async function runDeepseekStep(
    config: LlmStepConfig,
    apiKey: string,
    fetchFn: FetchFn = fetch,
    timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<LlmStepResult> {
    const opts = config.deepseek;
    const isJson = config.kind === 'json';
    const prompt = isJson ? ensureMentionsJson(config.prompt) : config.prompt;

    const baseBody: Record<string, unknown> = {
        model: opts.model,
        messages: [
            { role: 'system', content: config.systemPrompt },
            { role: 'user', content: prompt },
        ],
        thinking: { type: opts.thinking ? 'enabled' : 'disabled' },
        max_tokens: opts.maxTokens,
    };
    if (opts.thinking && opts.reasoningEffort) baseBody.reasoning_effort = opts.reasoningEffort;
    if (!opts.thinking) baseBody.temperature = opts.temperature; // ignorowane przez API gdy thinking włączony
    if (isJson) baseBody.response_format = { type: 'json_object' };

    let { content, usage, finishReason } = await callOnce(
        { apiKey, model: opts.model, thinking: opts.thinking, reasoningEffort: opts.reasoningEffort, temperature: opts.temperature, maxTokens: opts.maxTokens, timeoutMs },
        baseBody,
        fetchFn,
    );
    let costUsd = estimateCostUsd(opts.model, usage);
    let inputTokens = usage?.prompt_tokens ?? 0;
    let outputTokens = usage?.completion_tokens ?? 0;
    let apiCalls = 1;

    // Ucięcie długości: znany kwirk API przy włączonym thinking (spec 2.2) — rozumowanie
    // zjada ten sam budżet co treść. Zweryfikowane na żywo 22.09.2026: dla kroków JSON
    // ucięcie daje nie tylko PUSTĄ treść, ale też NIEPEŁNY, urwany w środku JSON (critique,
    // reasoningEffort:'high') — oba przypadki są tak samo bezużyteczne, więc ponawiamy
    // przy finish_reason:'length' oraz przy pustej treści niezależnie od reason.
    if (finishReason === 'length' || content.trim() === '') {
        // Nie przenoś `reasoning_effort` do próby bez thinking. W poprzedniej wersji
        // ten parametr zostawał w body po spreadzie i DeepSeek potrafił ponownie
        // zużyć cały budżet odpowiedzi na rozumowanie zamiast zwrócić JSON.
        const bodyWithoutReasoningEffort = { ...baseBody };
        delete bodyWithoutReasoningEffort.reasoning_effort;
        const retryBody = {
            ...bodyWithoutReasoningEffort,
            thinking: { type: 'disabled' },
            temperature: opts.temperature,
            max_tokens: opts.maxTokens * 2,
        };
        ({ content, usage, finishReason } = await callOnce(
            { apiKey, model: opts.model, thinking: false, temperature: opts.temperature, maxTokens: opts.maxTokens * 2, timeoutMs },
            retryBody,
            fetchFn,
        ));
        costUsd += estimateCostUsd(opts.model, usage);
        inputTokens += usage?.prompt_tokens ?? 0;
        outputTokens += usage?.completion_tokens ?? 0;
        apiCalls += 1;
    }

    if (content.trim() === '') {
        throw new Error(`DeepSeek: pusta odpowiedź dla kroku '${config.step}' po ponowieniu`);
    }
    if (finishReason === 'length') {
        throw new Error(`DeepSeek: odpowiedź dla kroku '${config.step}' została ucięta także po ponowieniu`);
    }

    if (isJson) {
        let json: unknown;
        try {
            json = JSON.parse(content);
        } catch {
            // DeepSeek dokumentuje sporadycznie pusty lub składniowo uszkodzony wynik
            // w json_object. Jedna świeża ekstrakcja z temperaturą 0 jest bezpieczniejsza
            // niż heurystyczne „naprawianie” urwanego JSON-u i nie omija późniejszego Zoda.
            const bodyWithoutReasoningEffort = { ...baseBody };
            delete bodyWithoutReasoningEffort.reasoning_effort;
            const jsonRetryBody = {
                ...bodyWithoutReasoningEffort,
                thinking: { type: 'disabled' },
                temperature: 0,
            };
            ({ content, usage, finishReason } = await callOnce(
                { apiKey, model: opts.model, thinking: false, temperature: 0, maxTokens: opts.maxTokens, timeoutMs },
                jsonRetryBody,
                fetchFn,
            ));
            costUsd += estimateCostUsd(opts.model, usage);
            inputTokens += usage?.prompt_tokens ?? 0;
            outputTokens += usage?.completion_tokens ?? 0;
            apiCalls += 1;
            if (content.trim() === '' || finishReason === 'length') {
                throw new Error(`DeepSeek: ponowna odpowiedź JSON dla kroku '${config.step}' jest pusta lub ucięta`);
            }
            try {
                json = JSON.parse(content);
            } catch {
                throw new Error(`DeepSeek: niepoprawny JSON dla kroku '${config.step}' także po ponowieniu: ${content.slice(0, 200)}`);
            }
        }
        return { text: content, json, provider: 'deepseek', costUsd, usage: { inputTokens, outputTokens, apiCalls } };
    }

    return { text: content, provider: 'deepseek', costUsd, usage: { inputTokens, outputTokens, apiCalls } };
}
