// Strażnik kosztów DeepSeek — płatnego, OSTATNIEGO toru (po Codex i Claude Code).
// Wspólny rejestr wydatków (JSONL) dzielą wszystkie publishery, a centrum CopyWritter
// czyta go do raportów. Dzięki temu miesięczny limit obejmuje łącznie wszystkie projekty.
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import type { LlmStepConfig } from './types';

export const DEFAULT_DEEPSEEK_LEDGER_PATH = join(homedir(), 'Library', 'Application Support', 'CopyWritter', 'deepseek-ledger.jsonl');

export interface DeepseekGuardConfig {
    /** Identyfikator publishera w rejestrze, np. 'tensor-deep'. */
    project: string;
    /** Slot (data) artykułu — do raportów, który artykuł kosztował. */
    slot?: string;
    ledgerPath: string;
    monthlyCapUsd: number;
}

export interface DeepseekSpendEntry {
    project: string;
    slot?: string;
    step: string;
    model: string;
    costUsd: number;
}

/** Odmowa wywołania DeepSeek przez strażnika kosztów (nie błąd sieci/API). */
export class DeepseekBlockedError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DeepseekBlockedError';
    }
}

function warsawMonth(date: Date): string {
    return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit' }).format(date);
}

/** Suma wydatków DeepSeek (wszystkie projekty) w bieżącym miesiącu kalendarzowym. */
export function monthlyDeepseekSpendUsd(ledgerPath: string, now: Date = new Date()): number {
    let raw: string;
    try {
        raw = readFileSync(ledgerPath, 'utf8');
    } catch {
        return 0;
    }
    const month = warsawMonth(now);
    let total = 0;
    for (const line of raw.split('\n')) {
        if (!line.trim()) continue;
        try {
            const entry = JSON.parse(line) as { ts?: string; costUsd?: number };
            if (typeof entry.costUsd !== 'number' || typeof entry.ts !== 'string') continue;
            if (warsawMonth(new Date(entry.ts)) === month) total += entry.costUsd;
        } catch {
            // Uszkodzona linia (np. przerwany zapis) nie może zablokować publikacji.
        }
    }
    return total;
}

/** Dopisuje jeden wydatek. Zapis append jest atomowy dla krótkich linii, więc równoległe publishery się nie nadpisują. */
export function appendDeepseekSpend(ledgerPath: string, entry: DeepseekSpendEntry, now: Date = new Date()): void {
    mkdirSync(dirname(ledgerPath), { recursive: true });
    appendFileSync(ledgerPath, `${JSON.stringify({ ts: now.toISOString(), ...entry })}\n`, { encoding: 'utf8', mode: 0o600 });
}

/**
 * Tryb oszczędny: każdy krok idzie przez najtańszy model bez rozumowania (thinking zjada
 * tokeny wyjścia). Pełny artykuł na deepseek-flash mieści się w ~0,04 USD zamiast ~0,30 USD.
 */
export function cheapDeepseekConfig<T extends LlmStepConfig>(config: T): T {
    const { reasoningEffort: _reasoningEffort, ...rest } = config.deepseek;
    return { ...config, deepseek: { ...rest, model: 'deepseek-flash', thinking: false } };
}
