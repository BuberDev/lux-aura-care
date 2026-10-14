// Jedna abstrakcja dla wszystkich kroków silnika. Kolejność torów (decyzja właściciela, 14.10.2026):
//   1. Codex CLI (subskrypcja ChatGPT) — tor główny; kroki z `allowSearch` szukają przez `codex --search`,
//   2. Claude Code (subskrypcja Claude) — gdy Codex zawiedzie,
//   3. DeepSeek API — płatny, OSTATNI zapas, wyłącznie w trybie oszczędnym (deepseek-flash, bez
//      thinking), z limitem na artykuł (`budget.capUsd`) i wspólnym limitem miesięcznym (deepseek-guard).
// Kroki z `allowSearch` w torze DeepSeek dostają kontekst z płatnego mostu wyszukiwania OpenRouter.
import { runClaudeCodeStep } from './claude-code';
import { execClaudeCode } from './process';
import { runDeepseekStep, type FetchFn } from './deepseek';
import { searchWeb } from './openrouter-search';
import { runCodexStep } from './codex';
import { appendDeepseekSpend, cheapDeepseekConfig, monthlyDeepseekSpendUsd, type DeepseekGuardConfig } from './deepseek-guard';
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
    /** Płatne wydatki w tym przebiegu (DeepSeek + most wyszukiwania). Subskrypcje się nie liczą. */
    spentUsd: number;
    /** Limit płatnych wydatków na jeden artykuł (DEEPSEEK_ARTICLE_CAP_USD). */
    capUsd: number;
    inputTokens: number;
    outputTokens: number;
    apiCalls: number;
    codexCalls?: number;
}

export interface ProviderConfig {
    claudeModel: string;
    deepseekApiKey: string;
    openrouterApiKey: string;
    cwd: string;
    env: NodeJS.ProcessEnv;
    budget: CostBudget;
    /** Zapytanie do mostu wyszukiwania — wymagane, gdy `config.allowSearch` i tor DeepSeek się uruchomi. */
    searchQuery?: string;
    /** Wstrzykiwalne dla testów; domyślnie prawdziwy proces / fetch. */
    exec?: typeof execClaudeCode;
    fetchFn?: FetchFn;
    /** Pomija tor Codex (env DISABLE_CODEX); ustawiane też automatycznie, gdy Codex jest niedostępny. */
    disableCodex?: boolean;
    /** Pomija tor Claude Code (env DISABLE_CLAUDE_CODE); ustawiane też automatycznie po trwałym błędzie. */
    disableClaudeCode?: boolean;
    /** Zgoda na płatny tor DeepSeek (env ALLOW_PAID_LLM_FALLBACK). Bez niej łańcuch kończy się na Claude Code. */
    allowPaidFallback?: boolean;
    /** Wspólny rejestr i limit miesięczny DeepSeek. Bez niego DeepSeek ma tylko limit na artykuł. */
    deepseekGuard?: DeepseekGuardConfig;
}

/** Rzucane, gdy krok przekroczyłby limit płatnych wydatków na jeden artykuł. */
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

const CLAUDE_UNAVAILABLE_FOR_RUN = new Set([
    'subscription_disabled',
    'not_logged_in',
    'session_limit',
    'usage_limit',
    'billing_error',
    'authentication_failed',
]);

/**
 * Błędy Codex, które nie miną w ciągu tego przebiegu (plan, limit, logowanie, brak CLI).
 * Inne (timeout, pusty/niepoprawny JSON) przekazują tylko bieżący krok do Claude Code.
 */
const CODEX_UNAVAILABLE_PATTERN = /not supported when using Codex|usage limit|hit your limit|rate limit|quota|not logged in|unauthori[sz]ed|\b401\b|\b403\b|ENOENT|subscription|billing/i;

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

function failedAttempts(attempts: StepAttempt[]): { provider: LlmProviderName; reason: string }[] {
    return attempts.filter((a) => !a.ok).map((a) => ({ provider: a.provider, reason: a.reason ?? 'unknown' }));
}

function recordSpend(providerConfig: ProviderConfig, step: string, model: string, costUsd: number): void {
    const guard = providerConfig.deepseekGuard;
    if (!guard || costUsd <= 0) return;
    try {
        appendDeepseekSpend(guard.ledgerPath, { project: guard.project, slot: guard.slot, step, model, costUsd });
    } catch (error) {
        console.warn(`[llm] nie udało się zapisać wydatku DeepSeek w rejestrze: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Uruchamia jeden krok silnika łańcuchem Codex → Claude Code → DeepSeek. Rzuca
 * `LlmStepFailedError`, gdy wszystkie dostępne tory zawiodły (albo strażnik kosztów
 * zablokował DeepSeek), lub `BudgetExceededError` przed wywołaniem DeepSeek, jeśli
 * artykuł przekroczyłby limit płatnych wydatków.
 */
export async function runStep(config: LlmStepConfig, providerConfig: ProviderConfig): Promise<StepOutcome> {
    const attempts: StepAttempt[] = [];
    const exec = providerConfig.exec ?? execClaudeCode;

    // 1. Codex — tor główny. Szuka sam (`--search`), więc nie płacimy za most wyszukiwania.
    if (!providerConfig.disableCodex) {
        try {
            const result = await runCodexStep(config, providerConfig.cwd);
            providerConfig.budget.codexCalls = (providerConfig.budget.codexCalls ?? 0) + 1;
            attempts.push({ provider: 'codex', ok: true });
            return { ...result, attempts };
        } catch (error) {
            const detail = error instanceof Error ? error.message : String(error);
            attempts.push({ provider: 'codex', ok: false, reason: detail.slice(0, 300) });
            console.warn(`[llm] Codex zawiódł dla kroku '${config.step}': ${detail.slice(0, 300)}`);
            if (CODEX_UNAVAILABLE_PATTERN.test(detail)) {
                providerConfig.disableCodex = true;
                console.warn('[llm] wyłączam Codex do końca przebiegu (niedostępny plan, limit albo logowanie); kolejne kroki od razu idą do Claude Code');
            }
        }
    }

    // 2. Claude Code — drugi tor na subskrypcji.
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
        if (CLAUDE_UNAVAILABLE_FOR_RUN.has(outcome.failure.reason)) {
            providerConfig.disableClaudeCode = true;
            console.warn(`[llm] wyłączam Claude Code do końca przebiegu (${outcome.failure.reason}); kolejne kroki pominą ten tor`);
        }
    }

    // 3. DeepSeek — płatny, ostatni zapas, tylko za zgodą i w limitach.
    if (!providerConfig.allowPaidFallback) {
        attempts.push({ provider: 'deepseek', ok: false, reason: 'płatny tor wyłączony (ALLOW_PAID_LLM_FALLBACK)' });
        throw new LlmStepFailedError(config.step, failedAttempts(attempts));
    }
    if (providerConfig.budget.spentUsd >= providerConfig.budget.capUsd) {
        console.warn(`[llm] DeepSeek zablokowany: limit na artykuł ${providerConfig.budget.capUsd.toFixed(2)} USD wyczerpany`);
        throw new BudgetExceededError(config.step, providerConfig.budget);
    }
    const guard = providerConfig.deepseekGuard;
    if (guard) {
        const monthSpend = monthlyDeepseekSpendUsd(guard.ledgerPath);
        if (monthSpend >= guard.monthlyCapUsd) {
            const reason = `DeepSeek zablokowany: miesięczny limit ${guard.monthlyCapUsd.toFixed(2)} USD wyczerpany (wydano ${monthSpend.toFixed(3)} USD)`;
            console.warn(`[llm] ${reason}`);
            attempts.push({ provider: 'deepseek', ok: false, reason });
            throw new LlmStepFailedError(config.step, failedAttempts(attempts));
        }
    }

    const cheapConfig = cheapDeepseekConfig(config);
    try {
        let deepseekConfig: LlmStepConfig = cheapConfig;
        let bridgeSources: LlmStepResult['sources'];

        if (config.allowSearch) {
            if (!providerConfig.searchQuery) {
                throw new Error(`Krok '${config.step}' wymaga wyszukiwania, ale nie podano searchQuery`);
            }
            const search = await searchWeb(providerConfig.searchQuery, { apiKey: providerConfig.openrouterApiKey });
            providerConfig.budget.spentUsd += search.costUsd;
            recordSpend(providerConfig, config.step, 'openrouter-search', search.costUsd);
            if (search.sources.length === 0) {
                throw new Error('Most wyszukiwania nie zwrócił żadnych wyników');
            }
            const resultsText = search.sources.map((s) => `- [${s.title ?? s.url}](${s.url})`).join('\n');
            deepseekConfig = buildSearchAugmentedConfig(cheapConfig, resultsText);
            bridgeSources = search.sources;
        }

        const result = await runDeepseekWithRetries(deepseekConfig, providerConfig.deepseekApiKey, providerConfig.fetchFn ?? fetch);
        providerConfig.budget.spentUsd += result.costUsd;
        providerConfig.budget.inputTokens += result.usage?.inputTokens ?? 0;
        providerConfig.budget.outputTokens += result.usage?.outputTokens ?? 0;
        providerConfig.budget.apiCalls += result.usage?.apiCalls ?? 1;
        recordSpend(providerConfig, config.step, cheapConfig.deepseek.model, result.costUsd);
        const provider: LlmProviderName = config.allowSearch ? 'deepseek-via-openrouter' : result.provider;
        attempts.push({ provider, ok: true });

        // Źródła z mostu wyszukiwania (nie z odpowiedzi DeepSeek — most tylko dostarcza kontekst).
        return { ...result, provider, sources: bridgeSources ?? result.sources, attempts };
    } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        console.warn(`[llm] DeepSeek (ostatni tor) zawiódł dla kroku '${config.step}': ${detail}`);
        attempts.push({ provider: 'deepseek', ok: false, reason: detail });
    }

    throw new LlmStepFailedError(config.step, failedAttempts(attempts));
}
