import { describe, expect, it, vi } from 'vitest';
import { runDeepseekStep, type FetchFn } from './deepseek';
import type { JsonStepConfig, MarkdownStepConfig } from './types';

const jsonConfig: JsonStepConfig = {
    kind: 'json',
    step: 'select-topic',
    systemPrompt: 'sys',
    prompt: 'wybierz temat, zwróć json',
    jsonSchema: {},
    deepseek: { model: 'deepseek-flash', thinking: false, temperature: 0.3, maxTokens: 2000 },
};

const markdownConfig: MarkdownStepConfig = {
    kind: 'markdown',
    step: 'write',
    systemPrompt: 'sys',
    prompt: 'napisz artykuł',
    deepseek: { model: 'deepseek-v4-pro', thinking: true, reasoningEffort: 'high', temperature: 0.7, maxTokens: 8000 },
};

function fetchOk(body: object): FetchFn {
    return vi.fn(async () => new Response(JSON.stringify(body), { status: 200 })) as unknown as FetchFn;
}

describe('runDeepseekStep — sukces', () => {
    it('parsuje JSON dla kroku json i liczy koszt', async () => {
        const fetchFn = fetchOk({
            choices: [{ message: { content: '{"topic":"AI"}' }, finish_reason: 'stop' }],
            usage: { prompt_tokens: 1_000_000, completion_tokens: 1_000_000 },
        });
        const result = await runDeepseekStep(jsonConfig, 'key', fetchFn);
        expect(result.json).toEqual({ topic: 'AI' });
        expect(result.provider).toBe('deepseek');
        expect(result.costUsd).toBeCloseTo(0.3 + 1.2, 5); // flash: 0.3/1.2 na 1M tokenów
    });

    it('zwraca surowy tekst dla kroku markdown, z modelem droższym (v4-pro)', async () => {
        const fetchFn = fetchOk({
            choices: [{ message: { content: '# Artykuł' }, finish_reason: 'stop' }],
            usage: { prompt_tokens: 1_000_000, completion_tokens: 1_000_000 },
        });
        const result = await runDeepseekStep(markdownConfig, 'key', fetchFn);
        expect(result.text).toBe('# Artykuł');
        expect(result.json).toBeUndefined();
        expect(result.costUsd).toBeCloseTo(1.32 + 3.96, 5);
    });

    it('dopisuje "json" do promptu, gdy go tam nie ma (wymóg API DeepSeek)', async () => {
        const fetchFn = fetchOk({ choices: [{ message: { content: '{}' }, finish_reason: 'stop' }] });
        await runDeepseekStep({ ...jsonConfig, prompt: 'wybierz najlepszy temat tygodnia' }, 'key', fetchFn);
        const call = (fetchFn as ReturnType<typeof vi.fn>).mock.calls[0];
        const body = JSON.parse(call[1].body);
        expect(body.messages[1].content.toLowerCase()).toContain('json');
    });

    it('nie dubluje "json", gdy prompt już je zawiera', async () => {
        const fetchFn = fetchOk({ choices: [{ message: { content: '{}' }, finish_reason: 'stop' }] });
        await runDeepseekStep(jsonConfig, 'key', fetchFn); // prompt już zawiera "zwróć json"
        const call = (fetchFn as ReturnType<typeof vi.fn>).mock.calls[0];
        const body = JSON.parse(call[1].body);
        expect((body.messages[1].content.match(/json/gi) ?? []).length).toBe(1);
    });

    it('wysyła thinking:enabled + reasoning_effort, gdy thinking włączony, i pomija temperature', async () => {
        const fetchFn = fetchOk({ choices: [{ message: { content: 'x' }, finish_reason: 'stop' }] });
        await runDeepseekStep(markdownConfig, 'key', fetchFn);
        const body = JSON.parse((fetchFn as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
        expect(body.thinking).toEqual({ type: 'enabled' });
        expect(body.reasoning_effort).toBe('high');
        expect(body.temperature).toBeUndefined(); // ignorowane przez API przy thinking — nie wysyłamy
    });

    it('wysyła thinking:disabled + temperature, gdy thinking wyłączony', async () => {
        const fetchFn = fetchOk({ choices: [{ message: { content: '{}' }, finish_reason: 'stop' }] });
        await runDeepseekStep(jsonConfig, 'key', fetchFn);
        const body = JSON.parse((fetchFn as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
        expect(body.thinking).toEqual({ type: 'disabled' });
        expect(body.temperature).toBe(0.3);
        expect(body.reasoning_effort).toBeUndefined();
    });

    it('dodaje response_format json_object tylko dla kroku json', async () => {
        const fetchFn = fetchOk({ choices: [{ message: { content: '{}' }, finish_reason: 'stop' }] });
        await runDeepseekStep(jsonConfig, 'key', fetchFn);
        const body = JSON.parse((fetchFn as ReturnType<typeof vi.fn>).mock.calls[0][1].body);
        expect(body.response_format).toEqual({ type: 'json_object' });
    });
});

describe('runDeepseekStep — pusta odpowiedź (thinking zjada max_tokens)', () => {
    it('ponawia raz z wyłączonym thinking i podwojonym max_tokens, gdy content puste i finish_reason length', async () => {
        const fetchFn = vi.fn();
        fetchFn
            .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: '' }, finish_reason: 'length' }] }), { status: 200 }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: '# Artykuł' }, finish_reason: 'stop' }] }), { status: 200 }));

        const result = await runDeepseekStep(markdownConfig, 'key', fetchFn as unknown as FetchFn);

        expect(fetchFn).toHaveBeenCalledTimes(2);
        const retryBody = JSON.parse(fetchFn.mock.calls[1][1].body);
        expect(retryBody.thinking).toEqual({ type: 'disabled' });
        expect(retryBody.max_tokens).toBe(markdownConfig.deepseek.maxTokens * 2);
        expect(result.text).toBe('# Artykuł');
    });

    it('rzuca, gdy odpowiedź jest pusta nawet po ponowieniu', async () => {
        // mockImplementation (nie mockResolvedValue) — nowy Response przy każdym wywołaniu,
        // bo ciało Response da się odczytać (.json()) tylko raz, a to wywoła fetch dwa razy (retry).
        const fetchFn = vi
            .fn()
            .mockImplementation(async () => new Response(JSON.stringify({ choices: [{ message: { content: '' }, finish_reason: 'length' }] }), { status: 200 }));
        await expect(runDeepseekStep(markdownConfig, 'key', fetchFn as unknown as FetchFn)).rejects.toThrow(/pusta odpowiedź/);
        expect(fetchFn).toHaveBeenCalledTimes(2);
    });

    it('ponawia pustą odpowiedź także wtedy, gdy finish_reason to nie "length"', async () => {
        const fetchFn = vi.fn();
        fetchFn
            .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: '' }, finish_reason: 'content_filter' }] }), { status: 200 }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ choices: [{ message: { content: '# Artykuł' }, finish_reason: 'stop' }] }), { status: 200 }));

        const result = await runDeepseekStep(markdownConfig, 'key', fetchFn as unknown as FetchFn);

        expect(fetchFn).toHaveBeenCalledTimes(2);
        expect(result.text).toBe('# Artykuł');
    });
});

describe('runDeepseekStep — błędy', () => {
    it('rzuca z treścią błędu, gdy API zwraca status != 200', async () => {
        const fetchFn = vi.fn().mockResolvedValue(new Response('rate limited', { status: 429 }));
        await expect(runDeepseekStep(jsonConfig, 'key', fetchFn as unknown as FetchFn)).rejects.toThrow(/429/);
    });

    it('rzuca, gdy JSON dla kroku json jest niepoprawny', async () => {
        const fetchFn = fetchOk({ choices: [{ message: { content: 'to nie jest {json' }, finish_reason: 'stop' }] });
        await expect(runDeepseekStep(jsonConfig, 'key', fetchFn)).rejects.toThrow(/niepoprawny JSON/);
    });

    it('przerywa przez AbortController po timeoutMs (nie wisi w nieskończoność)', async () => {
        const fetchFn: FetchFn = vi.fn((_url, init) => {
            return new Promise((_resolve, reject) => {
                (init?.signal as AbortSignal)?.addEventListener('abort', () => reject(new Error('AbortError')));
            });
        }) as unknown as FetchFn;
        await expect(runDeepseekStep(jsonConfig, 'key', fetchFn, 50)).rejects.toThrow();
    }, 2000);
});
