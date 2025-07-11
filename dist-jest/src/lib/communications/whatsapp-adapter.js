var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Adaptador para WhatsApp (usando Twilio como proveedor)
export class WhatsAppAdapter {
    constructor(config) {
        this.accountSid = config.accountSid;
        this.authToken = config.authToken;
        this.fromNumber = config.fromNumber;
        // Importamos Twilio solo cuando se instancia el adaptador
        const twilio = require('twilio');
        this.client = twilio(this.accountSid, this.authToken);
    }
    sendMessage(to, message, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Normalizar el número de teléfono
                const normalizedNumber = this.normalizePhoneNumber(to);
                // Preparar opciones para el mensaje
                const messageOptions = {
                    from: `whatsapp:${this.fromNumber}`,
                    to: `whatsapp:${normalizedNumber}`,
                    body: message
                };
                // Agregar imagen si está en las opciones
                if (options === null || options === void 0 ? void 0 : options.mediaUrl) {
                    messageOptions.mediaUrl = [options.mediaUrl];
                }
                // Enviar el mensaje
                const twilioMessage = yield this.client.messages.create(messageOptions);
                return {
                    success: true,
                    messageId: twilioMessage.sid
                };
            }
            catch (error) {
                console.error('Error al enviar mensaje de WhatsApp:', error);
                return {
                    success: false,
                    error: error.message
                };
            }
        });
    }
    verifyWebhook(payload, signature) {
        try {
            // Implementar verificación de firma para webhooks de Twilio
            if (!signature)
                return false;
            const twilio = require('twilio');
            const { url, method, headers } = payload;
            return twilio.validateRequest(this.authToken, signature, url, payload.body);
        }
        catch (error) {
            console.error('Error al verificar webhook de WhatsApp:', error);
            return false;
        }
    }
    parseResponse(payload) {
        // Extraer información relevante del webhook de Twilio
        const from = payload.From.replace('whatsapp:', '');
        const text = payload.Body;
        const messageId = payload.MessageSid;
        return {
            from,
            text,
            timestamp: new Date(),
            messageId,
            type: 'text'
        };
    }
    normalizePhoneNumber(phone) {
        // Eliminar espacios, guiones y paréntesis
        let normalized = phone.replace(/[\s\-()]/g, '');
        // Asegurar que tenga el código de país
        if (!normalized.startsWith('+')) {
            normalized = '+57' + normalized; // Asumimos Colombia como país por defecto
        }
        return normalized;
    }
}
