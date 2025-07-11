var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Adaptador para Telegram
export class TelegramAdapter {
    constructor(config) {
        this.apiUrl = 'https://api.telegram.org/bot';
        this.botToken = config.botToken;
        // Importamos axios solo cuando se instancia el adaptador
        this.axios = require('axios').default;
    }
    sendMessage(to, message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Preparar datos para la API de Telegram
                const data = {
                    chat_id: to,
                    text: message,
                    parse_mode: 'HTML'
                };
                // Agregar botones si están en las opciones
                if (options === null || options === void 0 ? void 0 : options.buttons) {
                    data.reply_markup = {
                        inline_keyboard: options.buttons.map((button) => [{
                                text: button.text,
                                callback_data: button.payload
                            }])
                    };
                }
                // Enviar el mensaje
                const response = yield this.axios.post(`${this.apiUrl}${this.botToken}/sendMessage`, data);
                if (response.data.ok) {
                    return {
                        success: true,
                        messageId: response.data.result.message_id.toString()
                    };
                }
                else {
                    return {
                        success: false,
                        error: response.data.description
                    };
                }
            }
            catch (error) {
                console.error('Error al enviar mensaje de Telegram:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        });
    }
    verifyWebhook(payload) {
        // Telegram no proporciona un mecanismo de firma para webhooks
        // pero podemos verificar que el payload tenga la estructura esperada
        return payload && payload.update_id &&
            (payload.message || payload.callback_query);
    }
    parseResponse(payload) {
        // Determinar si es un mensaje de texto o una respuesta de botón
        if (payload.callback_query) {
            // Es una respuesta de botón
            const { from, data } = payload.callback_query;
            return {
                from: from.id.toString(),
                text: '',
                timestamp: new Date(),
                messageId: payload.update_id.toString(),
                type: 'button',
                buttonPayload: data
            };
        }
        else if (payload.message) {
            // Es un mensaje de texto
            const { from, text, message_id } = payload.message;
            return {
                from: from.id.toString(),
                text: text || '',
                timestamp: new Date(payload.message.date * 1000),
                messageId: message_id.toString(),
                type: 'text'
            };
        }
        throw new Error('Formato de mensaje no reconocido');
    }
}
