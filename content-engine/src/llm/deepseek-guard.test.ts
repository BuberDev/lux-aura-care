import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { appendDeepseekSpend, cheapDeepseekConfig, monthlyDeepseekSpendUsd } from './deepseek-guard';
import type { MarkdownStepConfig } from './types';

let dir: string;
let ledgerPath: string;

beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'deepseek-guard-'));
    ledgerPath = join(dir, 'nested', 'ledger.jsonl');
});

afterEach(() => {
    rmSync(dir, { recursive: true, force: true });
});

describe('rejestr wydatków DeepSeek', () => {
    it('brak pliku oznacza zero wydatków', () => {
        expect(monthlyDeepseekSpendUsd(ledgerPath)).toBe(0);
    });

    it('dopisuje wpis (tworząc katalog) i sumuje tylko bieżący miesiąc czasu warszawskiego', () => {
        const now = new Date('2026-10-14T10:00:00.000Z');
        appendDeepseekSpend(ledgerPath, { project: 'tensor-deep', slot: '2026-10-07', step: 'write', model: 'deepseek-flash', costUsd: 0.012 }, now);
        appendDeepseekSpend(ledgerPath, { project: 'it-finance', slot: '2026-10-07', step: 'meta', model: 'deepseek-flash', costUsd: 0.003 }, now);
        // 30.09 23:30 w Warszawie — poprzedni miesiąc, nie wlicza się.
        appendDeepseekSpend(ledgerPath, { project: 'tensor-deep', slot: '2026-09-30', step: 'write', model: 'deepseek-flash', costUsd: 0.5 }, new Date('2026-09-30T21:30:00.000Z'));
        expect(monthlyDeepseekSpendUsd(ledgerPath, now)).toBeCloseTo(0.015, 6);
        const lines = readFileSync(ledgerPath, 'utf8').trim().split('\n');
        expect(JSON.parse(lines[0])).toMatchObject({ project: 'tensor-deep', step: 'write', costUsd: 0.012, ts: now.toISOString() });
    });

    it('pomija uszkodzone linie', () => {
        appendDeepseekSpend(ledgerPath, { project: 'a', step: 'x', model: 'deepseek-flash', costUsd: 0.01 }, new Date('2026-10-01T10:00:00.000Z'));
        writeFileSync(ledgerPath, `${readFileSync(ledgerPath, 'utf8')}not-json\n`);
        expect(monthlyDeepseekSpendUsd(ledgerPath, new Date('2026-10-02T10:00:00.000Z'))).toBeCloseTo(0.01, 6);
    });
});

describe('tryb oszczędny DeepSeek', () => {
    it('wymusza najtańszy model bez thinking, zachowując resztę kroku', () => {
        const step: MarkdownStepConfig = {
            kind: 'markdown',
            step: 'write',
            systemPrompt: 's',
            prompt: 'p',
            deepseek: { model: 'deepseek-v4-pro', thinking: true, reasoningEffort: 'high', temperature: 0.3, maxTokens: 8000 },
        };
        const cheap = cheapDeepseekConfig(step);
        expect(cheap.deepseek).toEqual({ model: 'deepseek-flash', thinking: false, temperature: 0.3, maxTokens: 8000 });
        expect(cheap.prompt).toBe('p');
        expect(step.deepseek.model).toBe('deepseek-v4-pro');
    });
});
