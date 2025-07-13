
import TelegramBot from 'node-telegram-bot-api';
import { ServerLogger } from '../logging/server-logger';

const logger = ServerLogger;

const token = process.env.TELEGRAM_BOT_TOKEN || '';
const chatId = process.env.TELEGRAM_CHAT_ID || '';

let bot: TelegramBot;

if (token) {
  bot = new TelegramBot(token);
} else {
  logger.warn('El token del bot de Telegram no está configurado. El servicio de Telegram no estará disponible.');
}

export const sendTelegramMessage = async (message: string) => {
  if (!bot || !chatId) {
    logger.error('El bot de Telegram o el ID del chat no están configurados.');
    return { success: false, error: 'Servicio de Telegram no configurado.' };
  }

  try {
    await bot.sendMessage(chatId, message);
    logger.info('Mensaje de Telegram enviado con éxito.');
    return { success: true };
  } catch (error: any) {
    logger.error(`Error al enviar el mensaje de Telegram: ${error.message}`);
    return { success: false, error: error.message };
  }
};
