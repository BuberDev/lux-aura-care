import { createHash, timingSafeEqual } from 'node:crypto';

const sha256 = (value: string): Buffer => createHash('sha256').update(value).digest();

/**
 * Sprawdza nagłówek `Authorization: Bearer <CRON_SECRET>`.
 * Fail-closed: brak lub pusty sekret odrzuca każde żądanie (cron outreach robi odwrotnie — nie kopiować).
 * Porównanie w stałym czasie na skrótach o równej długości.
 */
export function isAuthorizedCron(authorizationHeader: string | null, secret: string | undefined): boolean {
    if (!secret || !authorizationHeader) return false;
    return timingSafeEqual(sha256(authorizationHeader), sha256(`Bearer ${secret}`));
}
