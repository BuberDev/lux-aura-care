import { describe, expect, it } from 'vitest';
import { candidateDates } from './find-pending-slot';

describe('candidateDates', () => {
    it('zwraca tylko należne sloty od daty aktywacji, od najstarszego', () => {
        expect(candidateDates(new Date('2026-09-30T12:00:00.000Z'), '2026-09-28')).toEqual([
            '2026-09-28',
            '2026-09-30',
        ]);
    });

    it('obejmuje poprzedni piątek po poniedziałkowym uruchomieniu', () => {
        expect(candidateDates(new Date('2026-10-05T12:00:00.000Z'), '2026-10-02')).toEqual([
            '2026-10-02',
            '2026-10-05',
        ]);
    });
});
