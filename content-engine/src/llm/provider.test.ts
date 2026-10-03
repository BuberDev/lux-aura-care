import { describe, expect, it, vi, beforeEach } from 'vitest';
import { runStep, BudgetExceededError, type ProviderConfig } from './provider';
import { LlmStepFailedError } from './types';
import type { MarkdownStepConfig } from './types';

vi.mock('./claude-code', () => ({ runClaudeCodeStep: vi.fn() }));
vi.mock('./deepseek', () => ({ runDeepseekStep: vi.fn() }));
vi.mock('./openrouter-search', () => ({ searchWeb: vi.fn() }));
vi.mock('./process', () => ({ execClaudeCode: vi.fn() }));

import { runClaudeCodeStep } from './claude-code';
import { runDeepseekStep } from './deepseek';
import { searchWeb } from './openrouter-search';

const mockedClaudeStep = vi.mocked(runClaudeCodeStep);
const mockedDeepseekStep = vi.mocked(runDeepseekStep);
const mockedSearchWeb = vi.mocked(searchWeb);

const config: MarkdownStepConfig = {
    kind: 'markdown',
    step: 'write',
    systemPrompt: 'sys',
    prompt: 'napisz artykuł',
    deepseek: { model: 'deepseek-v4-pro', thinking: false, temperature: 0.7, maxTokens: 8000 },
};

function providerConfig(overrides: Partial<ProviderConfig> = {}): ProviderConfig {
    return {
        claudeModel: 'claude-sonnet-5',
        deepseekApiKey: 'ds-key',
        openrouterApiKey: 'or-key',
        cwd: '/tmp',
        env: {},
        budget: { spentUsd: 0, capUsd: 1.0, inputTokens: 0, outputTokens: 0, apiCalls: 0 },
        ...overrides,
    };
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('runStep — Claude Code jako tor główny', () => {
    it('gdy Claude Code się uda, nie woła DeepSeek i zwraca jego wynik', async () => {
        mockedClaudeStep.mockResolvedValue({ ok: true, result: { text: 'artykuł', provider: 'claude-code', costUsd: 0 } });
        const outcome = await runStep(config, providerConfig());
        expect(outcome.text).toBe('artykuł');
        expect(outcome.provider).toBe('claude-code');
        expect(outcome.attempts).toEqual([{ provider: 'claude-code', ok: true }]);
        expect(mockedDeepseekStep).not.toHaveBeenCalled();
    });

    it('gdy Claude Code zawiedzie, przełącza się na DeepSeek i zwraca jego wynik', async () => {
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'session_limit', detail: '...' } });
        mockedDeepseekStep.mockResolvedValue({
            text: 'artykuł z deepseek',
            provider: 'deepseek',
            costUsd: 0.05,
            usage: { inputTokens: 1200, outputTokens: 450, apiCalls: 1 },
        });
        const pc = providerConfig();
        const outcome = await runStep(config, pc);
        expect(outcome.text).toBe('artykuł z deepseek');
        expect(outcome.provider).toBe('deepseek');
        expect(outcome.attempts).toEqual([
            { provider: 'claude-code', ok: false, reason: 'session_limit' },
            { provider: 'deepseek', ok: true },
        ]);
        expect(pc.budget.spentUsd).toBe(0.05);
        expect(pc.budget.inputTokens).toBe(1200);
        expect(pc.budget.outputTokens).toBe(450);
        expect(pc.budget.apiCalls).toBe(1);
    });

    it('gdy oba tory zawiodą, rzuca LlmStepFailedError z obiema przyczynami', async () => {
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'timeout', detail: '' } });
        mockedDeepseekStep.mockRejectedValue(new Error('DeepSeek: 500'));
        await expect(runStep(config, providerConfig())).rejects.toThrow(LlmStepFailedError);
        try {
            await runStep(config, providerConfig());
            throw new Error('powinno rzucić');
        } catch (error) {
            expect(error).toBeInstanceOf(LlmStepFailedError);
            const failed = error as LlmStepFailedError;
            expect(failed.attempts).toEqual([
                { provider: 'claude-code', reason: 'timeout' },
                { provider: 'deepseek', reason: 'DeepSeek: 500' },
            ]);
        }
    });

    it('disableClaudeCode pomija tor główny całkowicie', async () => {
        mockedDeepseekStep.mockResolvedValue({ text: 'x', provider: 'deepseek', costUsd: 0.01 });
        const outcome = await runStep(config, providerConfig({ disableClaudeCode: true }));
        expect(mockedClaudeStep).not.toHaveBeenCalled();
        expect(outcome.attempts).toEqual([{ provider: 'deepseek', ok: true }]);
    });
});

describe('runStep — budżet', () => {
    it('rzuca BudgetExceededError przed wywołaniem DeepSeek, gdy budżet już wyczerpany', async () => {
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'timeout', detail: '' } });
        const pc = providerConfig({ budget: { spentUsd: 1.0, capUsd: 1.0, inputTokens: 0, outputTokens: 0, apiCalls: 0 } });
        await expect(runStep(config, pc)).rejects.toThrow(BudgetExceededError);
        expect(mockedDeepseekStep).not.toHaveBeenCalled();
    });
});

describe('runStep — krok z wyszukiwaniem (allowSearch), tor awaryjny', () => {
    const searchConfig: MarkdownStepConfig = { ...config, allowSearch: true, step: 'research' };

    it('przy przełączeniu na DeepSeek najpierw szuka przez OpenRouter, dokłada wyniki do promptu i zwraca ich źródła', async () => {
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'session_limit', detail: '' } });
        mockedSearchWeb.mockResolvedValue({
            sources: [{ url: 'https://a.pl', title: 'A' }],
            summaryText: '...',
            costUsd: 0.007,
        });
        mockedDeepseekStep.mockResolvedValue({ text: 'fakty wyekstrahowane', provider: 'deepseek', costUsd: 0.01 });

        const pc = providerConfig();
        const outcome = await runStep(searchConfig, { ...pc, searchQuery: 'agenci AI w firmie' });

        expect(mockedSearchWeb).toHaveBeenCalledWith('agenci AI w firmie', { apiKey: 'or-key' });
        const deepseekCallArg = mockedDeepseekStep.mock.calls[0][0];
        expect(deepseekCallArg.prompt).toContain('https://a.pl');
        expect(outcome.provider).toBe('deepseek-via-openrouter');
        expect(outcome.sources).toEqual([{ url: 'https://a.pl', title: 'A' }]);
        expect(pc.budget.spentUsd).toBeCloseTo(0.007 + 0.01, 6);
    });

    it('rzuca (oba tory zawiodły), gdy most wyszukiwania nie zwróci żadnych źródeł', async () => {
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'timeout', detail: '' } });
        mockedSearchWeb.mockResolvedValue({ sources: [], summaryText: '', costUsd: 0.007 });
        await expect(runStep(searchConfig, { ...providerConfig(), searchQuery: 'x' })).rejects.toThrow(LlmStepFailedError);
        expect(mockedDeepseekStep).not.toHaveBeenCalled();
    });

    it('rzuca, gdy krok wymaga wyszukiwania, ale nie podano searchQuery', async () => {
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'timeout', detail: '' } });
        await expect(runStep(searchConfig, providerConfig())).rejects.toThrow(LlmStepFailedError);
        expect(mockedSearchWeb).not.toHaveBeenCalled();
    });
});
