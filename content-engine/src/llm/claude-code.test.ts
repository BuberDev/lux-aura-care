import { describe, expect, it, vi } from 'vitest';
import { runClaudeCodeStep, type ExecFn, type ExecResult } from './claude-code';
import type { JsonStepConfig, MarkdownStepConfig } from './types';

const baseOptions = { cwd: '/tmp/x', env: {}, model: 'claude-sonnet-5' };

function ok(stdout: object): ExecResult {
    return { stdout: JSON.stringify(stdout), stderr: '', killedBySignal: null };
}

const jsonConfig: JsonStepConfig = {
    kind: 'json',
    step: 'select-topic',
    systemPrompt: 'sys',
    prompt: 'wybierz temat',
    jsonSchema: { type: 'object' },
    deepseek: { model: 'deepseek-flash', thinking: false, temperature: 0.3, maxTokens: 2000 },
};

const markdownConfig: MarkdownStepConfig = {
    kind: 'markdown',
    step: 'write',
    systemPrompt: 'sys',
    prompt: 'napisz artykuł',
    deepseek: { model: 'deepseek-v4-pro', thinking: false, temperature: 0.7, maxTokens: 8000 },
};

describe('runClaudeCodeStep — sukces', () => {
    it('zwraca structured_output i koszt dla kroku json', async () => {
        const exec: ExecFn = vi.fn(async () => ok({ is_error: false, result: 'gotowe', structured_output: { topic: 'AI' }, total_cost_usd: 0.05 }));
        const outcome = await runClaudeCodeStep(jsonConfig, baseOptions, exec);
        expect(outcome.ok).toBe(true);
        if (!outcome.ok) throw new Error('unreachable');
        expect(outcome.result.json).toEqual({ topic: 'AI' });
        expect(outcome.result.provider).toBe('claude-code');
        expect(outcome.result.costUsd).toBe(0.05);
    });

    it('zwraca tekst dla kroku markdown', async () => {
        const exec: ExecFn = vi.fn(async () => ok({ is_error: false, result: '# Artykuł\n\ntreść', total_cost_usd: 0.1 }));
        const outcome = await runClaudeCodeStep(markdownConfig, baseOptions, exec);
        expect(outcome.ok).toBe(true);
        if (!outcome.ok) throw new Error('unreachable');
        expect(outcome.result.text).toBe('# Artykuł\n\ntreść');
        expect(outcome.result.json).toBeUndefined();
    });

    it('wyciąga sources ze structured_output, gdy obecne', async () => {
        const exec: ExecFn = vi.fn(async () =>
            ok({ is_error: false, structured_output: { facts: [], sources: [{ url: 'https://a.pl', title: 'A' }, { url: 'https://b.pl' }] }, total_cost_usd: 0.02 }),
        );
        const outcome = await runClaudeCodeStep(jsonConfig, baseOptions, exec);
        if (!outcome.ok) throw new Error('unreachable');
        expect(outcome.result.sources).toEqual([{ url: 'https://a.pl', title: 'A' }, { url: 'https://b.pl', title: undefined }]);
    });

    it('przekazuje --allowedTools "WebSearch,WebFetch" tylko gdy allowSearch jest ustawione', async () => {
        const exec: ExecFn = vi.fn(async () => ok({ is_error: false, structured_output: {}, total_cost_usd: 0 }));
        await runClaudeCodeStep({ ...jsonConfig, allowSearch: true }, baseOptions, exec);
        const args = (exec as ReturnType<typeof vi.fn>).mock.calls[0][0] as string[];
        expect(args).toContain('WebSearch,WebFetch');
        expect(args).not.toContain('');
    });

    it('nie dodaje narzędzi, gdy allowSearch nie jest ustawione', async () => {
        const exec: ExecFn = vi.fn(async () => ok({ is_error: false, structured_output: {}, total_cost_usd: 0 }));
        await runClaudeCodeStep(jsonConfig, baseOptions, exec);
        const args = (exec as ReturnType<typeof vi.fn>).mock.calls[0][0] as string[];
        const idx = args.indexOf('--allowedTools');
        expect(args[idx + 1]).toBe('');
    });
});

describe('runClaudeCodeStep — klasyfikacja niepowodzeń (sygnał do przełączenia na DeepSeek)', () => {
    it.each([
        ['Not logged in · Please run /login', 'not_logged_in'],
        ["You've hit your session limit · resets 1:20pm", 'session_limit'],
        ['Usage limit reached for this billing period', 'usage_limit'],
        ['rate limit exceeded, try again later', 'rate_limit'],
        ['billing issue on your account', 'billing_error'],
        ['authentication failed: invalid token', 'authentication_failed'],
        ['the API is currently overloaded', 'overloaded'],
        ['coś zupełnie innego poszło nie tak', 'error_result'],
    ])('is_error:true z tekstem %j -> reason %j', async (resultText, expectedReason) => {
        const exec: ExecFn = vi.fn(async () => ok({ is_error: true, result: resultText }));
        const outcome = await runClaudeCodeStep(markdownConfig, baseOptions, exec);
        expect(outcome.ok).toBe(false);
        if (outcome.ok) throw new Error('unreachable');
        expect(outcome.failure.reason).toBe(expectedReason);
    });

    it('zabicie procesu (timeout) -> reason timeout, bez próby parsowania stdout', async () => {
        const exec: ExecFn = vi.fn(async (): Promise<ExecResult> => ({ stdout: '', stderr: '', killedBySignal: 'SIGTERM' }));
        const outcome = await runClaudeCodeStep(markdownConfig, baseOptions, exec);
        expect(outcome.ok).toBe(false);
        if (outcome.ok) throw new Error('unreachable');
        expect(outcome.failure.reason).toBe('timeout');
    });

    it('niepoprawny JSON na stdout -> reason invalid_output', async () => {
        const exec: ExecFn = vi.fn(async (): Promise<ExecResult> => ({ stdout: 'to nie jest json{{{', stderr: '', killedBySignal: null }));
        const outcome = await runClaudeCodeStep(markdownConfig, baseOptions, exec);
        expect(outcome.ok).toBe(false);
        if (outcome.ok) throw new Error('unreachable');
        expect(outcome.failure.reason).toBe('invalid_output');
    });

    it('brak structured_output dla kroku json -> reason no_structured_output', async () => {
        const exec: ExecFn = vi.fn(async () => ok({ is_error: false, result: 'model nie zwrócił structured_output' }));
        const outcome = await runClaudeCodeStep(jsonConfig, baseOptions, exec);
        expect(outcome.ok).toBe(false);
        if (outcome.ok) throw new Error('unreachable');
        expect(outcome.failure.reason).toBe('no_structured_output');
    });

    it('pusty result dla kroku markdown -> reason empty_result', async () => {
        const exec: ExecFn = vi.fn(async () => ok({ is_error: false, result: '   ' }));
        const outcome = await runClaudeCodeStep(markdownConfig, baseOptions, exec);
        expect(outcome.ok).toBe(false);
        if (outcome.ok) throw new Error('unreachable');
        expect(outcome.failure.reason).toBe('empty_result');
    });

    it('błąd samego uruchomienia procesu (np. ENOENT) -> reason exec_failed, nie rzuca', async () => {
        const exec: ExecFn = vi.fn(async () => {
            throw new Error("Nie znaleziono polecenia 'claude' w PATH");
        });
        const outcome = await runClaudeCodeStep(markdownConfig, baseOptions, exec);
        expect(outcome.ok).toBe(false);
        if (outcome.ok) throw new Error('unreachable');
        expect(outcome.failure.reason).toBe('exec_failed');
    });
});
