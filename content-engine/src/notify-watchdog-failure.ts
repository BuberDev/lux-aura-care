import { escapeHtml, sendTelegramNotification } from './notify';

const message = process.env.WATCHDOG_ERROR?.trim() || 'Nieznany błąd lokalnego wydawcy';

await sendTelegramNotification(
    `🤖 <b>Lux Aura Care — watchdog publikacji</b>\n\n❌ Automatyczne ponowienia nie opublikowały artykułu.\n${escapeHtml(message.slice(0, 800))}`,
    {
        botToken: process.env.TELEGRAM_BOT_TOKEN,
        chatId: process.env.TELEGRAM_CHAT_ID,
    },
);
