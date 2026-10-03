// Klucze harmonogramu liczymy w strefie Europe/Warsaw, żeby uruchomienie blisko północy
// UTC nie trafiło do złego dnia publikacji.
const WEEKDAY_CODES = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
type WeekdayCode = (typeof WEEKDAY_CODES)[number];

function localDateParts(date: Date, timeZone: string): { year: number; month: number; day: number } {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
    return {
        year: Number(parts.find((part) => part.type === 'year')!.value),
        month: Number(parts.find((part) => part.type === 'month')!.value),
        day: Number(parts.find((part) => part.type === 'day')!.value),
    };
}

function localWeekdayCode(date: Date, timeZone: string): WeekdayCode {
    const { year, month, day } = localDateParts(date, timeZone);
    return WEEKDAY_CODES[new Date(Date.UTC(year, month - 1, day)).getUTCDay()];
}

// ISO weekKey, np. "2026-W39". Pozostaje bazą rotacji i częścią klucza publikacji.
export function isoWeekKey(date: Date, timeZone: string = 'Europe/Warsaw'): string {
    const { year, month, day } = localDateParts(date, timeZone);

    const localMidnightUtc = new Date(Date.UTC(year, month - 1, day));
    const target = new Date(localMidnightUtc.valueOf());
    const dayNr = (localMidnightUtc.getUTCDay() + 6) % 7; // poniedziałek = 0
    target.setUTCDate(target.getUTCDate() - dayNr + 3); // najbliższy czwartek

    const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
    const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
    firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNr + 3);

    const weekNumber = 1 + Math.round((target.valueOf() - firstThursday.valueOf()) / (7 * 24 * 60 * 60 * 1000));
    return `${target.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

/** Osobny, idempotentny slot dla każdego dnia, np. 2026-W39-MON. */
export function scheduledRunKey(date: Date, timeZone: string = 'Europe/Warsaw'): string {
    return `${isoWeekKey(date, timeZone)}-${localWeekdayCode(date, timeZone)}`;
}

/**
 * Trzy kolejne wartości dla poniedziałku, środy i piątku. Dzięki temu każdy z trzech
 * artykułów tygodnia dostaje inny format i wariant okładki, a poziom jest rotowany.
 */
export function editorialRotationNumber(date: Date, timeZone: string = 'Europe/Warsaw'): number {
    const weekNumber = weekNumberFromKey(isoWeekKey(date, timeZone));
    const slotByDay: Record<WeekdayCode, number> = {
        MON: 0,
        TUE: 0,
        WED: 1,
        THU: 1,
        FRI: 2,
        SAT: 2,
        SUN: 2,
    };
    return weekNumber * 3 + slotByDay[localWeekdayCode(date, timeZone)];
}

/** Numer tygodnia (bez roku), także ze slotu typu 2026-W39-WED. */
export function weekNumberFromKey(weekKey: string): number {
    const match = weekKey.match(/W(\d{2})(?:-|$)/);
    return match ? Number(match[1]) : 0;
}
