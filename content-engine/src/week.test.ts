import { describe, expect, it } from 'vitest';
import { editorialRotationNumber, isoWeekKey, scheduledRunKey, weekNumberFromKey } from './week';

describe('harmonogram artykułów', () => {
    it('buduje osobne klucze dla poniedziałku, środy i piątku tego samego tygodnia', () => {
        expect(scheduledRunKey(new Date('2026-09-21T06:23:00Z'))).toBe('2026-W39-MON');
        expect(scheduledRunKey(new Date('2026-09-23T06:23:00Z'))).toBe('2026-W39-WED');
        expect(scheduledRunKey(new Date('2026-09-25T06:23:00Z'))).toBe('2026-W39-FRI');
    });

    it('wyznacza dzień według czasu w Warszawie, również przy granicy UTC', () => {
        expect(scheduledRunKey(new Date('2026-09-20T22:30:00Z'))).toBe('2026-W39-MON');
    });

    it('nadaje trzem slotom trzy kolejne numery rotacji', () => {
        const values = [
            editorialRotationNumber(new Date('2026-09-21T06:23:00Z')),
            editorialRotationNumber(new Date('2026-09-23T06:23:00Z')),
            editorialRotationNumber(new Date('2026-09-25T06:23:00Z')),
        ];
        expect(values).toEqual([117, 118, 119]);
    });

    it('zachowuje zgodność klucza ISO i odczytuje numer tygodnia ze slotu', () => {
        expect(isoWeekKey(new Date('2025-12-29T12:00:00Z'))).toBe('2026-W01');
        expect(weekNumberFromKey('2026-W39-WED')).toBe(39);
    });
});
