// Wspólne typy warstwy LLM. Silnik ma trzy tory: Codex (subskrypcja, tor główny), Claude Code
// (subskrypcja, drugi tor) i DeepSeek (płatne API, ostatni zapas). Wszystkie zwracają ten sam
// kształt wyniku, żeby reszta silnika nie musiała wiedzieć, który dostawca odpowiedział.

export type LlmProviderName = 'claude-code' | 'codex' | 'deepseek' | 'deepseek-via-openrouter';

export interface LlmSource {
    url: string;
    title?: string;
}

export interface LlmStepResult {
    /** Surowy tekst odpowiedzi (dla kroków 'markdown') albo zserializowany JSON (dla 'json'). */
    text: string;
    /** Sparsowany JSON — obecny tylko dla kroków w formacie 'json'. */
    json?: unknown;
    provider: LlmProviderName;
    /** Szacowany koszt w USD (0 dla Claude Code — koszt idzie z limitów subskrypcji, nie z budżetu w USD). */
    costUsd: number;
    /** Faktyczne zużycie raportowane przez API; pozwala kontrolować koszt bez zgadywania. */
    usage?: { inputTokens: number; outputTokens: number; apiCalls: number };
    /** Źródła znalezione podczas wyszukiwania — tylko dla kroków z wyszukiwaniem. */
    sources?: LlmSource[];
}

export interface JsonStepConfig {
    kind: 'json';
    /** Nazwa kroku do logów/kosztów, np. 'select-topic'. */
    step: string;
    systemPrompt: string;
    prompt: string;
    /** JSON Schema (draft-07-ish, taki jaki akceptuje `claude --json-schema`). */
    jsonSchema: Record<string, unknown>;
    /** Czy krok może korzystać z wyszukiwania w internecie (tylko Claude Code; DeepSeek nie ma wyszukiwania). */
    allowSearch?: boolean;
    /** Parametry używane wyłącznie w torze DeepSeek (Claude Code CLI ich nie eksponuje). */
    deepseek: {
        model: 'deepseek-flash' | 'deepseek-v4-pro';
        thinking: boolean;
        reasoningEffort?: 'low' | 'high' | 'max';
        temperature: number;
        maxTokens: number;
    };
}

export interface MarkdownStepConfig {
    kind: 'markdown';
    step: string;
    systemPrompt: string;
    prompt: string;
    allowSearch?: boolean;
    deepseek: {
        model: 'deepseek-flash' | 'deepseek-v4-pro';
        thinking: boolean;
        reasoningEffort?: 'low' | 'high' | 'max';
        temperature: number;
        maxTokens: number;
    };
}

export type LlmStepConfig = JsonStepConfig | MarkdownStepConfig;

/** Rzucany, gdy wszystkie dostępne tory (Codex, Claude Code, DeepSeek) zawiodły dla jednego kroku. */
export class LlmStepFailedError extends Error {
    constructor(
        readonly step: string,
        readonly attempts: { provider: LlmProviderName; reason: string }[],
    ) {
        super(`Krok LLM '${step}' zawiódł na wszystkich torach: ${attempts.map((a) => `${a.provider}: ${a.reason}`).join(' | ')}`);
        this.name = 'LlmStepFailedError';
    }
}
