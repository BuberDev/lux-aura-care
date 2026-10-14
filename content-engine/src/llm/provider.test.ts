import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { runStep, BudgetExceededError, type ProviderConfig } from './provider';
import { appendDeepseekSpend } from './deepseek-guard';
import { LlmStepFailedError } from './types';
import type { MarkdownStepConfig } from './types';

vi.mock('./claude-code', () => ({ runClaudeCodeStep: vi.fn() }));
vi.mock('./deepseek', () => ({ runDeepseekStep: vi.fn() }));
vi.mock('./openrouter-search', () => ({ searchWeb: vi.fn() }));
vi.mock('./process', () => ({ execClaudeCode: vi.fn() }));
vi.mock('./codex', () => ({ runCodexStep: vi.fn() }));

import { runClaudeCodeStep } from './claude-code';
import { runCodexStep } from './codex';
import { runDeepseekStep } from './deepseek';
import { searchWeb } from './openrouter-search';

const mockedClaudeStep = vi.mocked(runClaudeCodeStep);
const mockedDeepseekStep = vi.mocked(runDeepseekStep);
const mockedSearchWeb = vi.mocked(searchWeb);
const mockedCodexStep = vi.mocked(runCodexStep);

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
        // Testy toru Claude Code → DeepSeek; łańcuch z Codex ma osobny blok niżej.
        disableCodex: true,
        allowPaidFallback: true,
        ...overrides,
    };
}

let ledgerDir: string;

beforeEach(() => {
    vi.clearAllMocks();
    ledgerDir = mkdtempSync(join(tmpdir(), 'provider-ledger-'));
});

afterEach(() => {
    rmSync(ledgerDir, { recursive: true, force: true });
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

    it('po trwałym błędzie Claude nie próbuje go ponownie w tym samym przebiegu', async () => {
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'subscription_disabled', detail: 'disabled' } });
        mockedDeepseekStep.mockResolvedValue({ text: 'x', provider: 'deepseek', costUsd: 0.01 });
        const pc = providerConfig();

        await runStep(config, pc);
        await runStep({ ...config, step: 'meta' }, pc);

        expect(mockedClaudeStep).toHaveBeenCalledTimes(1);
        expect(mockedDeepseekStep).toHaveBeenCalledTimes(2);
        expect(pc.disableClaudeCode).toBe(true);
    });
    it('nie wywołuje DeepSeek ani OpenRouter, gdy płatny fallback jest zablokowany', async () => {
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'timeout', detail: '' } });
        await expect(runStep(config, providerConfig({ allowPaidFallback: false }))).rejects.toThrow(LlmStepFailedError);
        expect(mockedDeepseekStep).not.toHaveBeenCalled();
        expect(mockedSearchWeb).not.toHaveBeenCalled();
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

describe('runStep — łańcuch Codex → Claude Code → DeepSeek', () => {
    const chainConfig = (overrides: Partial<ProviderConfig> = {}) => providerConfig({
        disableCodex: false,
        deepseekGuard: { project: 'lux-aura-care', slot: '2026-10-07', ledgerPath: join(ledgerDir, 'ledger.jsonl'), monthlyCapUsd: 1.0 },
        ...overrides,
    });

    it('Codex jest pierwszy: przy sukcesie nie woła Claude Code ani DeepSeek', async () => {
        mockedCodexStep.mockResolvedValue({ text: 'z codex', provider: 'codex', costUsd: 0 });
        const outcome = await runStep(config, chainConfig());
        expect(outcome.provider).toBe('codex');
        expect(outcome.attempts).toEqual([{ provider: 'codex', ok: true }]);
        expect(mockedClaudeStep).not.toHaveBeenCalled();
        expect(mockedDeepseekStep).not.toHaveBeenCalled();
    });

    it('chwilowy błąd Codex przekazuje krok do Claude Code, ale nie wyłącza Codex', async () => {
        mockedCodexStep.mockRejectedValue(new Error("Codex zwrócił pustą odpowiedź dla kroku 'write'"));
        mockedClaudeStep.mockResolvedValue({ ok: true, result: { text: 'z claude', provider: 'claude-code', costUsd: 0 } });
        const pc = chainConfig();
        const outcome = await runStep(config, pc);
        expect(outcome.provider).toBe('claude-code');
        expect(outcome.attempts[0]).toMatchObject({ provider: 'codex', ok: false });
        expect(pc.disableCodex).toBe(false);
    });

    it('niedostępny Codex (plan/limit/logowanie) jest wyłączany do końca przebiegu', async () => {
        mockedCodexStep.mockRejectedValue(new Error("The 'gpt-6-luna' model is not supported when using Codex with a ChatGPT account."));
        mockedClaudeStep.mockResolvedValue({ ok: true, result: { text: 'z claude', provider: 'claude-code', costUsd: 0 } });
        const pc = chainConfig();
        await runStep(config, pc);
        await runStep({ ...config, step: 'meta' }, pc);
        expect(mockedCodexStep).toHaveBeenCalledTimes(1);
        expect(pc.disableCodex).toBe(true);
    });

    it('krok z wyszukiwaniem idzie do Codex bez płatnego mostu OpenRouter (Codex szuka sam)', async () => {
        mockedCodexStep.mockResolvedValue({ text: '{}', json: {}, provider: 'codex', costUsd: 0 });
        const pc = chainConfig({ searchQuery: 'agenci AI' });
        await runStep({ ...config, allowSearch: true, step: 'research' }, pc);
        expect(mockedCodexStep.mock.calls[0][0].allowSearch).toBe(true);
        expect(mockedSearchWeb).not.toHaveBeenCalled();
        expect(pc.budget.spentUsd).toBe(0);
    });

    it('DeepSeek jako ostatni tor działa w trybie oszczędnym i zapisuje koszt w rejestrze', async () => {
        mockedCodexStep.mockRejectedValue(new Error('Not logged in'));
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'session_limit', detail: '' } });
        mockedDeepseekStep.mockResolvedValue({ text: 'z deepseek', provider: 'deepseek', costUsd: 0.004 });
        const pc = chainConfig();
        const outcome = await runStep(config, pc);
        expect(outcome.provider).toBe('deepseek');
        const sentConfig = mockedDeepseekStep.mock.calls[0][0];
        expect(sentConfig.deepseek).toMatchObject({ model: 'deepseek-flash', thinking: false });
        const [line] = readFileSync(join(ledgerDir, 'ledger.jsonl'), 'utf8').trim().split('\n');
        expect(JSON.parse(line)).toMatchObject({ project: 'lux-aura-care', slot: '2026-10-07', step: 'write', model: 'deepseek-flash', costUsd: 0.004 });
    });

    it('bez zgody na płatny tor (allowPaidFallback=false) DeepSeek nie jest wołany', async () => {
        mockedCodexStep.mockRejectedValue(new Error('Not logged in'));
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'session_limit', detail: '' } });
        await expect(runStep(config, chainConfig({ allowPaidFallback: false }))).rejects.toThrow(LlmStepFailedError);
        expect(mockedDeepseekStep).not.toHaveBeenCalled();
    });

    it('wyczerpany miesięczny limit (łącznie dla wszystkich projektów) blokuje DeepSeek', async () => {
        const ledgerPath = join(ledgerDir, 'ledger.jsonl');
        appendDeepseekSpend(ledgerPath, { project: 'it-finance', step: 'write', model: 'deepseek-flash', costUsd: 1.0 });
        mockedCodexStep.mockRejectedValue(new Error('Not logged in'));
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'session_limit', detail: '' } });
        await expect(runStep(config, chainConfig())).rejects.toThrow(/miesięczny limit/);
        expect(mockedDeepseekStep).not.toHaveBeenCalled();
    });

    it('koszt wyszukiwania OpenRouter trafia do rejestru nawet gdy DeepSeek potem zawiedzie', async () => {
        mockedCodexStep.mockRejectedValue(new Error('Not logged in'));
        mockedClaudeStep.mockResolvedValue({ ok: false, failure: { reason: 'session_limit', detail: '' } });
        mockedSearchWeb.mockResolvedValue({ sources: [{ url: 'https://a.pl' }], summaryText: '', costUsd: 0.007 });
        mockedDeepseekStep.mockRejectedValue(new Error('DeepSeek: 500'));
        const pc = chainConfig({ searchQuery: 'x' });
        await expect(runStep({ ...config, allowSearch: true, step: 'research' }, pc)).rejects.toThrow(LlmStepFailedError);
        const [line] = readFileSync(join(ledgerDir, 'ledger.jsonl'), 'utf8').trim().split('\n');
        expect(JSON.parse(line)).toMatchObject({ step: 'research', model: 'openrouter-search', costUsd: 0.007 });
    });
});
