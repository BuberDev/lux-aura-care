// Prawdziwa implementacja ExecFn — jedyne miejsce, które faktycznie uruchamia proces `claude`.
// execFile (nie exec/shell): argumenty trafiają do execv jako tablica, żadnego interpretera
// powłoki, więc znaki specjalne w promptach (backticks, $, ;) nie mogą nic wstrzyknąć.
import { execFile } from 'node:child_process';
import type { ExecFn, ExecResult } from './claude-code';

const MAX_BUFFER_BYTES = 16 * 1024 * 1024; // duże structured_output (artykuł + metadane) mieszczą się z zapasem

export const execClaudeCode: ExecFn = (args, { cwd, env, timeoutMs }) =>
    new Promise<ExecResult>((resolve, reject) => {
        execFile(
            'claude',
            args,
            { cwd, env, timeout: timeoutMs, maxBuffer: MAX_BUFFER_BYTES, killSignal: 'SIGTERM' },
            (error, stdout, stderr) => {
                if (error && (error as NodeJS.ErrnoException).code === 'ENOENT') {
                    reject(new Error("Nie znaleziono polecenia 'claude' w PATH"));
                    return;
                }
                // execFile z timeout ustawia error.killed=true i error.signal po zabiciu procesu.
                const killedBySignal = error && 'killed' in error && (error as { killed?: boolean }).killed
                    ? (error as { signal?: string }).signal ?? 'SIGTERM'
                    : null;
                // Niezerowy kod wyjścia bez zabicia to nadal odpowiedź do sparsowania (Claude Code
                // czasem kończy z is_error:true w JSON-ie na stdout, a nie niezerowym kodem) —
                // przekazujemy stdout dalej niezależnie od `error`, chyba że proces został zabity.
                resolve({ stdout: stdout ?? '', stderr: stderr ?? '', killedBySignal });
            },
        );
    });
