// Jedna abstrakcja dla wszystkich kroków silnika: tor główny (Claude Code na subskrypcji)
// z automatycznym przełączeniem na tor awaryjny (DeepSeek, + most wyszukiwania OpenRouter
// dla kroków z `allowSearch`). Krok z wyszukiwaniem niesie `searchQuery` — używane
// wyłącznie przez tor awaryjny, bo Claude Code szuka sam przez WebSearch/WebFetch.
import { runClaudeCodeStep } from './claude-code';
import { execClaudeCode } from './process';
import { runDeepseekStep, type FetchFn } from './deepseek';
import { searchWeb } from './openrouter-search';
import type { LlmProviderName, LlmStepConfig, LlmStepResult } from './types';
import { LlmStepFailedError } from './types';

export interface StepAttempt {
    provider: LlmProviderName;
    ok: boolean;
    reason?: string;
}

export interface StepOutcome extends LlmStepResult {
    attempts: StepAttempt[];
}

export interface CostBudget {
    spentUsd: number;
    capUsd: number;
    inputTokens: number;
    outputTokens: number;
    apiCalls: number;
}

export interface ProviderConfig {
    claudeModel: string;
    deepseekApiKey: string;
    openrouterApiKey: string;
    cwd: string;
    env: NodeJS.ProcessEnv;
    budget: CostBudget;
    /** Zapytanie do mostu wyszukiwania — wymagane, gdy `config.allowSearch` i tor awaryjny się uruchomi. */
    searchQuery?: string;
    /** Wstrzykiwalne dla testów; domyślnie prawdziwy proces / fetch. */
    exec?: typeof execClaudeCode;
    fetchFn?: FetchFn;
    /** Testowe wymuszenie pominięcia toru głównego. */
    disableClaudeCode?: boolean;
}

/** Rzucane, gdy krok przekroczyłby twardy limit kosztu na uruchomienie (spec 4.4: 1,00 USD). */
export class BudgetExceededError extends Error {
    constructor(step: string, budget: CostBudget) {
        super(`Krok '${step}' przekroczyłby budżet: wydano ${budget.spentUsd.toFixed(4)} USD z limitu ${budget.capUsd} USD`);
        this.name = 'BudgetExceededError';
    }
}

function buildSearchAugmentedConfig(config: LlmStepConfig, searchResultsText: string): LlmStepConfig {
    const prompt = `${config.prompt}\n\n--- Wyniki wyszukiwania w internecie ---\n${searchResultsText}\n--- koniec wyników ---`;
    return { ...config, prompt } as LlmStepConfig;
}

const DEEPSEEK_MAX_ATTEMPTS = 3;

function isTransientDeepseekError(error: unknown): boolean {
    const message = error instanceof Error ? error.message : String(error);
    return /\b(?:408|409|425|429|5\d\d)\b|fetch failed|terminated|abort|timeout|timed out|econnreset|socket/i.test(message);
}

async function runDeepseekWithRetries(
    config: LlmStepConfig,
    apiKey: string,
    fetchFn: FetchFn,
): Promise<LlmStepResult> {
    let lastError: unknown;
    for (let attempt = 1; attempt <= DEEPSEEK_MAX_ATTEMPTS; attempt++) {
        try {
            return await runDeepseekStep(config, apiKey, fetchFn);
        } catch (error) {
            lastError = error;
            if (!isTransientDeepseekError(error) || attempt === DEEPSEEK_MAX_ATTEMPTS) throw error;
            const delayMs = attempt === 1 ? 500 : 1_500;
            console.warn(`[llm] przejściowy błąd DeepSeek dla kroku '${config.step}' — ponawiam ${attempt + 1}/${DEEPSEEK_MAX_ATTEMPTS}`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
    }
    throw lastError;
}

/**
 * Uruchamia jeden krok silnika. Próbuje Claude Code; przy niepowodzeniu przełącza się
 * na DeepSeek (z mostem wyszukiwania OpenRouter, gdy krok tego wymaga). Rzuca
 * `LlmStepFailedError`, gdy oba tory zawiodły, albo `BudgetExceededError` przed
 * wywołaniem DeepSeek, jeśli przekroczyłoby to twardy limit kosztu.
 */
export async function runStep(config: LlmStepConfig, providerConfig: ProviderConfig): Promise<StepOutcome> {
    const attempts: StepAttempt[] = [];
    const exec = providerConfig.exec ?? execClaudeCode;

    if (!providerConfig.disableClaudeCode) {
        const outcome = await runClaudeCodeStep(
            config,
            { cwd: providerConfig.cwd, env: providerConfig.env, model: providerConfig.claudeModel },
            exec,
        );
        if (outcome.ok) {
            attempts.push({ provider: 'claude-code', ok: true });
            return { ...outcome.result, attempts };
        }
        console.warn(`[llm] Claude Code zawiódł dla kroku '${config.step}': ${outcome.failure.reason} — ${outcome.failure.detail}`);
        attempts.push({ provider: 'claude-code', ok: false, reason: outcome.failure.reason });
    }

    // Tor awaryjny — sprawdź budżet PRZED wywołaniem (Claude Code nie liczy się do budżetu USD).
    if (providerConfig.budget.spentUsd >= providerConfig.budget.capUsd) {
        throw new BudgetExceededError(config.step, providerConfig.budget);
    }

    try {
        let deepseekConfig = config;
        let bridgeSources: LlmStepResult['sources'];

        if (config.allowSearch) {
            if (!providerConfig.searchQuery) {
                throw new Error(`Krok '${config.step}' wymaga wyszukiwania, ale nie podano searchQuery`);
            }
            const search = await searchWeb(providerConfig.searchQuery, { apiKey: providerConfig.openrouterApiKey });
            providerConfig.budget.spentUsd += search.costUsd;
            if (search.sources.length === 0) {
                throw new Error('Most wyszukiwania nie zwrócił żadnych wyników');
            }
            const resultsText = search.sources.map((s) => `- [${s.title ?? s.url}](${s.url})`).join('\n');
            deepseekConfig = buildSearchAugmentedConfig(config, resultsText);
            bridgeSources = search.sources;
        }

        const result = await runDeepseekWithRetries(deepseekConfig, providerConfig.deepseekApiKey, providerConfig.fetchFn ?? fetch);
        providerConfig.budget.spentUsd += result.costUsd;
        providerConfig.budget.inputTokens += result.usage?.inputTokens ?? 0;
        providerConfig.budget.outputTokens += result.usage?.outputTokens ?? 0;
        providerConfig.budget.apiCalls += result.usage?.apiCalls ?? 1;
        const provider: LlmProviderName = config.allowSearch ? 'deepseek-via-openrouter' : result.provider;
        attempts.push({ provider, ok: true });

        // Źródła z mostu wyszukiwania (nie z odpowiedzi DeepSeek — most tylko dostarcza kontekst).
        return { ...result, provider, sources: bridgeSources ?? result.sources, attempts };
    } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        console.warn(`[llm] DeepSeek (tor awaryjny) zawiódł dla kroku '${config.step}': ${detail}`);
        attempts.push({ provider: 'deepseek', ok: false, reason: detail });
    }

    throw new LlmStepFailedError(
        config.step,
        attempts.filter((a) => !a.ok).map((a) => ({ provider: a.provider, reason: a.reason ?? 'unknown' })),
    );
}
