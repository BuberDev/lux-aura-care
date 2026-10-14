import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { LlmStepConfig, LlmStepResult } from './types';

const CODEX_BIN = process.env.CODEX_BIN ?? '/Users/dawidbubernak/.nvm/versions/node/v20.19.2/bin/codex';
const CODEX_MODEL = process.env.CODEX_MODEL ?? 'gpt-6-luna';
const CODEX_TIMEOUT_MS = 360_000;
const MAX_OUTPUT_BYTES = 16 * 1024 * 1024;

function withoutSchemaMeta(schema: Record<string, unknown>): Record<string, unknown> {
    const { $schema: _schema, ...rest } = schema;
    return rest;
}

function parseJson(text: string, step: string): unknown {
    const trimmed = text.trim();
    const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    const candidate = fenced?.[1] ?? trimmed;
    try {
        return JSON.parse(candidate);
    } catch (error) {
        throw new Error(`Codex zwrócił niepoprawny JSON w kroku '${step}': ${error instanceof Error ? error.message : String(error)}`);
    }
}

export async function runCodexStep(config: LlmStepConfig, cwd: string): Promise<LlmStepResult> {
    const tempDir = mkdtempSync(join(tmpdir(), 'luxauracare-codex-step-'));
    const answerPath = join(tempDir, 'answer.txt');
    const prompt = `${config.systemPrompt}\n\nWykonujesz krok '${config.step}'. Zwróć wyłącznie wynik zadania, bez komentarza o narzędziach.\n\n${config.prompt}`;
    // Kroki z wyszukiwaniem używają natywnego web_search Codex (`--search` jest flagą globalną,
    // więc musi stać przed `exec`) — bez płatnego mostu OpenRouter.
    const args = [
        ...(config.allowSearch ? ['--search'] : []),
        'exec',
        '--ignore-user-config',
        '--ephemeral',
        '--skip-git-repo-check',
        '-C', cwd,
        '-m', CODEX_MODEL,
        '-c', 'model_reasoning_effort=low',
        '-o', answerPath,
    ];

    if (config.kind === 'json') {
        const schemaPath = join(tempDir, 'output-schema.json');
        writeFileSync(schemaPath, JSON.stringify(withoutSchemaMeta(config.jsonSchema)), 'utf8');
        args.push('--output-schema', schemaPath);
    }
    args.push('-');

    try {
        const { code, stderr } = await new Promise<{ code: number | null; stderr: string }>((resolve, reject) => {
            const child = spawn(CODEX_BIN, args, {
                cwd,
                env: process.env,
                stdio: ['pipe', 'ignore', 'pipe'],
            });
            let stderr = '';
            let timedOut = false;
            const timeout = setTimeout(() => {
                timedOut = true;
                child.kill('SIGTERM');
            }, CODEX_TIMEOUT_MS);
            child.stderr.setEncoding('utf8');
            child.stderr.on('data', (chunk: string) => {
                stderr = `${stderr}${chunk}`.slice(-MAX_OUTPUT_BYTES);
            });
            child.on('error', (error) => {
                clearTimeout(timeout);
                reject(error);
            });
            child.on('close', (code) => {
                clearTimeout(timeout);
                if (timedOut) reject(new Error(`Codex przekroczył limit ${CODEX_TIMEOUT_MS / 1000}s dla kroku '${config.step}'`));
                else resolve({ code, stderr });
            });
            child.stdin.end(prompt);
        });

        if (code !== 0) {
            throw new Error(`Codex zakończył krok '${config.step}' kodem ${String(code)}: ${stderr.slice(-1200)}`);
        }

        const text = readFileSync(answerPath, 'utf8').trim();
        if (!text) throw new Error(`Codex zwrócił pustą odpowiedź dla kroku '${config.step}'`);
        if (config.kind === 'json') {
            const json = parseJson(text, config.step);
            return { text: JSON.stringify(json), json, provider: 'codex', costUsd: 0 };
        }
        return { text, provider: 'codex', costUsd: 0 };
    } finally {
        rmSync(tempDir, { recursive: true, force: true });
    }
}
