// Tor główny: Claude Code na subskrypcji (`claude -p`), uruchamiany jako proces potomny.
// NIGDY --bare — zweryfikowane 2026-09-22: --bare nie czyta tokenu subskrypcji
// (CLAUDE_CODE_OAUTH_TOKEN ani logowania interaktywnego), więc kończy się "Not logged in".
// Bez --bare repo nie ma zacommitowanych hooków ani CLAUDE.md (sprawdzone), więc koszt
// ładowania ambientnego kontekstu jest znikomy.
import type { LlmSource, LlmStepConfig, LlmStepResult } from './types';

export interface ExecResult {
    stdout: string;
    stderr: string;
    /** `null`, gdy proces zakończył się bez zabicia (kod wyjścia może być != 0). */
    killedBySignal: string | null;
}

/** Wstrzykiwalna funkcja uruchamiająca proces — w testach zastępowana atrapą. */
export type ExecFn = (args: string[], options: { cwd: string; env: NodeJS.ProcessEnv; timeoutMs: number }) => Promise<ExecResult>;

// Zweryfikowane na żywo 23.09.2026: 'critique' (pełny artykuł + pakiet faktów + fragmenty
// źródeł w promptcie, bez allowSearch/narzędzi) dwukrotnie dostało SIGTERM przy 240s —
// sam wolumen kontekstu do przeanalizowania wymaga więcej czasu niż szybkie kroki typu
// 'meta', mimo że nie robi żadnych tur wyszukiwania. Podniesione do wartości używanej
// wcześniej tylko dla allowSearch, żeby ciężkie kroki bez narzędzi też miały zapas.
const DEFAULT_TIMEOUT_MS = 360_000;
// allowSearch dostaje więcej tur (patrz niżej), więc też potrzebuje więcej czasu —
// spójnie z podwyższeniem DEFAULT_MAX_TURNS_WITH_SEARCH.
const DEFAULT_TIMEOUT_MS_WITH_SEARCH = 360_000;
const DEFAULT_MAX_TURNS = 8;
// Zweryfikowane na żywo 22.09.2026: research (kilka zapytań WebSearch + weryfikacja +
// wygenerowanie structured_output) realnie potrzebuje więcej — jedna próba z limitem 8
// urwała się na `terminal_reason: max_turns` po 9 turach, `is_error:true`, `result:null`,
// spalając 1,08 USD limitu subskrypcji na nic. allowSearch dostaje wyższy limit.
const DEFAULT_MAX_TURNS_WITH_SEARCH = 20;

// Wzorce w tekście odpowiedzi, które oznaczają "przełącz na DeepSeek", a nie "treść odrzucona".
const FALLBACK_REASON_PATTERNS: [RegExp, string][] = [
    [/not logged in/i, 'not_logged_in'],
    [/session limit/i, 'session_limit'],
    [/usage limit/i, 'usage_limit'],
    [/rate limit/i, 'rate_limit'],
    [/billing/i, 'billing_error'],
    [/authentication/i, 'authentication_failed'],
    [/overloaded/i, 'overloaded'],
];

export interface ClaudeCodeFailure {
    reason: string;
    detail: string;
}

export interface ClaudeCodeOutcome {
    ok: true;
    result: LlmStepResult;
}

export interface ClaudeCodeError {
    ok: false;
    failure: ClaudeCodeFailure;
}

function classifyFailureText(resultText: string): string {
    for (const [pattern, reason] of FALLBACK_REASON_PATTERNS) {
        if (pattern.test(resultText)) return reason;
    }
    return 'error_result';
}

interface RawClaudeCodeJson {
    is_error?: boolean;
    result?: string;
    structured_output?: unknown;
    total_cost_usd?: number;
    terminal_reason?: string;
    num_turns?: number;
}

/** Wyciąga JSON z bloku ```json ... ``` (albo gołego { ... }) w tekście odpowiedzi. `null`, gdy nic nie pasuje/parsuje się. */
function extractJsonFromCodeFence(text: string): unknown {
    const fenced = text.match(/```(?:json)?\s*\n([\s\S]*?)\n```/i);
    const candidate = fenced ? fenced[1] : text.match(/\{[\s\S]*\}/)?.[0];
    if (!candidate) return null;
    try {
        return JSON.parse(candidate);
    } catch {
        return null;
    }
}

function extractSourcesFromStructured(json: unknown): LlmSource[] | undefined {
    if (!json || typeof json !== 'object') return undefined;
    const sources = (json as { sources?: unknown }).sources;
    if (!Array.isArray(sources)) return undefined;
    const out: LlmSource[] = [];
    for (const entry of sources) {
        if (entry && typeof entry === 'object' && typeof (entry as { url?: unknown }).url === 'string') {
            const title = (entry as { title?: unknown }).title;
            out.push({ url: (entry as { url: string }).url, title: typeof title === 'string' ? title : undefined });
        }
    }
    return out.length > 0 ? out : undefined;
}

/**
 * Uruchamia jeden krok przez `claude -p`. Zwraca `{ok:false}` zamiast rzucać —
 * warstwa `provider.ts` decyduje, czy to znaczy "przełącz na DeepSeek".
 */
export async function runClaudeCodeStep(
    config: LlmStepConfig,
    options: { cwd: string; env: NodeJS.ProcessEnv; model: string; timeoutMs?: number },
    exec: ExecFn,
): Promise<ClaudeCodeOutcome | ClaudeCodeError> {
    const args = [
        '-p',
        config.prompt,
        '--model',
        options.model,
        '--output-format',
        'json',
        '--permission-mode',
        'dontAsk',
        // Celowo BEZ --permission-prompts none: ta flaga wymaga Claude Code >=2.1.259
        // i na starszych wersjach kończy proces błędem "unknown option" (zweryfikowane
        // 22.09.2026 na lokalnie zainstalowanym 2.1.170) — nie wiadomo, jaka wersja CLI
        // będzie na runnerze GitHub Actions. `--permission-mode dontAsk` samo w sobie
        // już odmawia każdego wywołania, które wymagałoby promptu, więc jest wystarczające
        // dla bezobsługowego uruchomienia.
        '--max-turns',
        String(config.allowSearch ? DEFAULT_MAX_TURNS_WITH_SEARCH : DEFAULT_MAX_TURNS),
        '--append-system-prompt',
        config.systemPrompt,
    ];

    if (config.allowSearch) {
        args.push('--allowedTools', 'WebSearch,WebFetch');
    } else {
        args.push('--allowedTools', '');
    }

    if (config.kind === 'json') {
        // `z.toJSONSchema()` dokleja `$schema: ".../draft/2020-12/schema"`. Nowsze wersje CLI
        // (auto-instalowane na CI jako `latest`) walidują --json-schema własnym walidatorem,
        // który nie ma zarejestrowanego tego meta-schematu i odrzuca całość błędem
        // `no schema with key or ref` — zweryfikowane na żywo 23.09.2026 na runnerze GitHub
        // Actions (lokalnie zainstalowany starszy CLI tego nie robił). CLI nie potrzebuje
        // deklaracji meta-schematu, tylko samej definicji, więc usuwamy klucz przed wysłaniem.
        const schemaWithoutMeta = { ...config.jsonSchema } as { $schema?: unknown; [key: string]: unknown };
        delete schemaWithoutMeta.$schema;
        args.push('--json-schema', JSON.stringify(schemaWithoutMeta));
    }

    let execResult: ExecResult;
    try {
        execResult = await exec(args, {
            cwd: options.cwd,
            env: options.env,
            timeoutMs: options.timeoutMs ?? (config.allowSearch ? DEFAULT_TIMEOUT_MS_WITH_SEARCH : DEFAULT_TIMEOUT_MS),
        });
    } catch (error) {
        return { ok: false, failure: { reason: 'exec_failed', detail: error instanceof Error ? error.message : String(error) } };
    }

    if (execResult.killedBySignal) {
        return { ok: false, failure: { reason: 'timeout', detail: `killed by ${execResult.killedBySignal}` } };
    }

    let parsed: RawClaudeCodeJson;
    try {
        parsed = JSON.parse(execResult.stdout) as RawClaudeCodeJson;
    } catch {
        return { ok: false, failure: { reason: 'invalid_output', detail: execResult.stdout.slice(0, 300) || execResult.stderr.slice(0, 300) } };
    }

    if (parsed.is_error) {
        const resultText = parsed.result ?? '';
        // `max_turns`: is_error:true, result:null, więc classifyFailureText('') dałoby mylące
        // 'error_result' — zweryfikowane na żywo 22.09.2026 (research, 9/8 tur, 1,08 USD za nic).
        if (parsed.terminal_reason === 'max_turns') {
            return { ok: false, failure: { reason: 'max_turns', detail: `${parsed.num_turns ?? '?'} tur, limit wyczerpany` } };
        }
        return { ok: false, failure: { reason: classifyFailureText(resultText), detail: resultText.slice(0, 300) } };
    }

    const resultText = parsed.result ?? '';
    const costUsd = typeof parsed.total_cost_usd === 'number' ? parsed.total_cost_usd : 0;

    if (config.kind === 'json') {
        // Zweryfikowane na żywo 22.09.2026: przy krokach z wyszukiwaniem (allowSearch) model
        // czasem robi całą pracę poprawnie, ale zamiast wypełnić structured_output, wypisuje
        // gotowy JSON w bloku ```json wewnątrz result. Zanim uznamy to za porażkę, spróbujmy
        // wyciągnąć taki blok — to prawdziwa, użyteczna odpowiedź, tylko źle opakowana.
        const structuredOutput = parsed.structured_output ?? extractJsonFromCodeFence(resultText);
        if (structuredOutput === undefined || structuredOutput === null) {
            return { ok: false, failure: { reason: 'no_structured_output', detail: resultText.slice(0, 300) } };
        }
        return {
            ok: true,
            result: {
                text: JSON.stringify(structuredOutput),
                json: structuredOutput,
                provider: 'claude-code',
                costUsd,
                sources: extractSourcesFromStructured(structuredOutput),
            },
        };
    }

    if (resultText.trim() === '') {
        return { ok: false, failure: { reason: 'empty_result', detail: '' } };
    }

    return { ok: true, result: { text: resultText, provider: 'claude-code', costUsd } };
}
