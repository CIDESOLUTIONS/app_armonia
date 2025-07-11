var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
export class NotificationService {
    /**
     * Enviar notificación por correo electrónico
     * @param data Datos de la notificación
     */
    static sendEmail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const info = yield this.transporter.sendMail({
                    from: process.env.EMAIL_FROM,
                    to: data.recipient,
                    subject: data.subject,
                    html: data.body
                });
                return this.saveNotification(Object.assign(Object.assign({}, data), { status: 'SENT', messageId: info.messageId }));
            }
            catch (error) {
                console.error('Error enviando correo:', error);
                return this.saveNotification(Object.assign(Object.assign({}, data), { status: 'FAILED' }));
            }
        });
    }
    /**
     * Guardar registro de notificación
     * @param notificationData Datos de la notificación
     */
    static saveNotification(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.notification.create({
                data: {
                    type: notificationData.type,
                    recipient: notificationData.recipient,
                    subject: notificationData.subject,
                    body: notificationData.body,
                    entityType: notificationData.entityType,
                    entityId: notificationData.entityId,
                    status: notificationData.status,
                    messageId: notificationData.messageId
                }
            });
        });
    }
    /**
     * Notificar creación de PQR
     * @param pqr Datos de la PQR
     */
    static notifyPQRCreation(pqr) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener administradores del conjunto
            const admins = yield prisma.user.findMany({
                where: {
                    complexId: pqr.complexId,
                    role: 'COMPLEX_ADMIN'
                }
            });
            // Enviar notificación a cada administrador
            for (const admin of admins) {
                yield this.sendEmail({
                    type: 'EMAIL',
                    recipient: admin.email,
                    subject: `Nueva PQR: ${pqr.title}`,
                    body: `
          <h1>Nueva Petición, Queja o Reclamo</h1>
          <p>Se ha creado una nueva PQR en su conjunto residencial:</p>
          <ul>
            <li><strong>Título:</strong> ${pqr.title}</li>
            <li><strong>Tipo:</strong> ${pqr.type}</li>
            <li><strong>Prioridad:</strong> ${pqr.priority}</li>
          </ul>
          <p>Por favor, revise y gestione esta solicitud.</p>
        `,
                    entityType: 'PQR',
                    entityId: pqr.id
                });
            }
        });
    }
    /**
     * Notificar cambio de estado de PQR
     * @param pqr Datos de la PQR
     * @param oldStatus Estado anterior
     */
    static notifyPQRStatusChange(pqr, oldStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener usuario que creó la PQR
            const creator = yield prisma.user.findUnique({
                where: { id: pqr.userId }
            });
            if (creator) {
                yield this.sendEmail({
                    type: 'EMAIL',
                    recipient: creator.email,
                    subject: `Actualización de PQR: ${pqr.title}`,
                    body: `
          <h1>Actualización de su Solicitud</h1>
          <p>El estado de su PQR ha cambiado:</p>
          <ul>
            <li><strong>Título:</strong> ${pqr.title}</li>
            <li><strong>Estado Anterior:</strong> ${oldStatus}</li>
            <li><strong>Estado Actual:</strong> ${pqr.status}</li>
          </ul>
          <p>Puede consultar más detalles en el portal de su conjunto residencial.</p>
        `,
                    entityType: 'PQR',
                    entityId: pqr.id
                });
            }
        });
    }
}
NotificationService.transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
