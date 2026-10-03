// Powiadomienia Telegram — ten sam wzorzec co src/lib/utils.ts w głównym serwisie
// (sendTelegramNotification), ale content-engine to osobny pakiet bez dostępu do niego.
export interface TelegramConfig {
    botToken?: string;
    chatId?: string;
}

/** Escapuje znaki specjalne HTML — parse_mode:'HTML' w API Telegrama parsuje `<`/`&`. */
export function escapeHtml(text: string): string {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Nigdy nie rzuca — brak konfiguracji albo błąd sieci tylko logują ostrzeżenie. */
export async function sendTelegramNotification(message: string, config: TelegramConfig, fetchFn: typeof fetch = fetch): Promise<void> {
    if (!config.botToken || !config.chatId) {
        console.warn('Telegram nieskonfigurowany (brak TELEGRAM_BOT_TOKEN/TELEGRAM_CHAT_ID) — pomijam powiadomienie');
        return;
    }
    try {
        const response = await fetchFn(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: config.chatId, text: message, parse_mode: 'HTML' }),
        });
        if (!response.ok) console.error(`Telegram API zwróciło błąd: ${response.status}`);
    } catch (error) {
        console.error('Nie udało się wysłać powiadomienia Telegram:', error);
    }
}
