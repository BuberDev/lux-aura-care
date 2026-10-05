import { loadEnv } from './env';
import { SiteClient } from './site-client';
import { scheduledRunKey } from './week';
import { pathToFileURL } from 'node:url';

const WARSAW_TIME_ZONE = 'Europe/Warsaw';
const SCHEDULED_DAYS = new Set([1, 3, 5]); // poniedziałek, środa, piątek
// Lokalny komputer może być wyłączony dłużej niż weekend. Data aktywacji
// zapisana przez instalator odcina historyczne, ręczne publikacje sprzed wdrożenia.
const LOOKBACK_DAYS = 20;

function warsawDateParts(date: Date): { year: number; month: number; day: number } {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: WARSAW_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(date);

    return {
        year: Number(parts.find((part) => part.type === 'year')!.value),
        month: Number(parts.find((part) => part.type === 'month')!.value),
        day: Number(parts.find((part) => part.type === 'day')!.value),
    };
}

function isoDate(year: number, month: number, day: number): string {
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function candidateDates(now = new Date(), notBefore = process.env.SLOT_NOT_BEFORE): string[] {
    const local = warsawDateParts(now);
    const today = new Date(Date.UTC(local.year, local.month - 1, local.day, 12));
    const candidates: string[] = [];

    for (let offset = LOOKBACK_DAYS; offset >= 0; offset -= 1) {
        const candidate = new Date(today);
        candidate.setUTCDate(today.getUTCDate() - offset);
        if (!SCHEDULED_DAYS.has(candidate.getUTCDay())) continue;
        const date = isoDate(candidate.getUTCFullYear(), candidate.getUTCMonth() + 1, candidate.getUTCDate());
        if (notBefore && date < notBefore) continue;
        candidates.push(date);
    }

    return candidates;
}

async function main(): Promise<void> {
    const env = loadEnv();
    const site = new SiteClient(env.siteUrl, env.cronSecret);

    for (const date of candidateDates()) {
        const runKey = scheduledRunKey(new Date(`${date}T12:00:00.000Z`));
        const context = await site.getContext(runKey);
        if (!context.done) {
            process.stdout.write(`${date}\n`);
            return;
        }
    }

    process.exitCode = 10;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    const processKeepAlive = setInterval(() => undefined, 30_000);
    await main().catch((error) => {
        console.error(`[weekly-article] nie udało się sprawdzić zaległych slotów: ${error instanceof Error ? error.message : String(error)}`);
        process.exitCode = 1;
    }).finally(() => {
        clearInterval(processKeepAlive);
    });
}
