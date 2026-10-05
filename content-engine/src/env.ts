// Odczyt i walidacja zmiennych środowiskowych silnika. Rzuca wcześnie i czytelnie,
// zamiast pozwolić `undefined` cicho popłynąć dalej do wywołań API.
export interface EngineEnv {
    siteUrl: string;
    cronSecret: string;
    deepseekApiKey: string;
    openrouterApiKey: string;
    aiGatewayApiKey: string;
    articleImageModel: string;
    claudeModel: string;
    mode: 'draft' | 'publish' | 'dry-run';
    force: boolean;
    topicHint?: string;
    telegramBotToken?: string;
    telegramChatId?: string;
    runUrl?: string;
    weeklyArticleAuthorEmail?: string;
    /** Awaryjny wyłącznik toru głównego — do testów i na wypadek, gdyby integracja Claude Code wymagała szybkiego wyłączenia bez zmiany kodu. */
    disableClaudeCode: boolean;
    /** Płatny fallback DeepSeek/OpenRouter jest opt-in, żeby harmonogram nie generował niekontrolowanych kosztów. */
    allowPaidLlmFallback: boolean;
    /** Lokalny tryb dwuetapowy: przygotuj artykuł i briefy, ale poczekaj na grafiki z Codex Imagegen. */
    prepareOnly: boolean;
    /** Data slotu redakcyjnego (YYYY-MM-DD). Używana przez lokalny watchdog do odrabiania pominiętych publikacji. */
    scheduledFor?: string;
}

function required(name: string): string {
    const value = process.env[name];
    if (!value) throw new Error(`Brak wymaganej zmiennej środowiskowej: ${name}`);
    return value;
}

export function loadEnv(): EngineEnv {
    const mode = process.env.MODE ?? 'draft';
    if (mode !== 'draft' && mode !== 'publish' && mode !== 'dry-run') {
        throw new Error(`Niepoprawna wartość MODE: "${mode}" (dozwolone: draft, publish, dry-run)`);
    }

    const scheduledFor = process.env.SCHEDULED_FOR?.trim();
    if (scheduledFor && !/^\d{4}-\d{2}-\d{2}$/.test(scheduledFor)) {
        throw new Error(`Niepoprawna wartość SCHEDULED_FOR: "${scheduledFor}" (oczekiwano YYYY-MM-DD)`);
    }

    return {
        siteUrl: process.env.SITE_URL ?? 'https://luxauracare.com',
        cronSecret: required('CRON_SECRET'),
        deepseekApiKey: required('DEEPSEEK_API_KEY'),
        openrouterApiKey: required('OPENROUTER_API_KEY'),
        // AI Gateway jest wyłącznie ręcznym torem awaryjnym. Lokalny harmonogram
        // Codex korzysta z wbudowanego Imagegen i nie potrzebuje tego sekretu.
        aiGatewayApiKey: process.env.AI_GATEWAY_API_KEY ?? '',
        articleImageModel: process.env.ARTICLE_IMAGE_MODEL ?? 'recraft/recraft-v4.1',
        claudeModel: process.env.CLAUDE_MODEL ?? 'claude-sonnet-5',
        mode,
        force: process.env.FORCE === 'true' || process.env.FORCE === '1',
        topicHint: process.env.TOPIC_HINT || undefined,
        telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || undefined,
        telegramChatId: process.env.TELEGRAM_CHAT_ID || undefined,
        runUrl: process.env.RUN_URL || undefined,
        weeklyArticleAuthorEmail: process.env.WEEKLY_ARTICLE_AUTHOR_EMAIL || undefined,
        disableClaudeCode: process.env.DISABLE_CLAUDE_CODE === 'true' || process.env.DISABLE_CLAUDE_CODE === '1',
        allowPaidLlmFallback: process.env.ALLOW_PAID_LLM_FALLBACK === 'true' || process.env.ALLOW_PAID_LLM_FALLBACK === '1',
        prepareOnly: process.env.PREPARE_ONLY === 'true' || process.env.PREPARE_ONLY === '1',
        scheduledFor: scheduledFor || undefined,
    };
}
