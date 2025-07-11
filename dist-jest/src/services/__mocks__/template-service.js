/**
 * Mock de utilidades de plantillas para pruebas unitarias y de integración
 * Proporciona funciones para manejar plantillas de notificaciones y correos
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Obtiene una plantilla por su tipo
 * @param type - Tipo de plantilla
 * @param schema - Esquema del tenant
 * @returns Plantilla encontrada
 */
export function getTemplateByType(type_1) {
    return __awaiter(this, arguments, void 0, function* (type, schema = 'public') {
        // Plantillas predefinidas para pruebas
        const templates = {
            'PQR_STATUS_CHANGE': {
                subject: '✅ {{ticketNumber}} - Solicitud resuelta',
                content: 'Hola {{recipientName}},\n\nTu solicitud {{ticketNumber}} ha sido actualizada a estado {{status}}.\n\nSaludos,\nEquipo de Armonía'
            },
            'PQR_ASSIGNMENT': {
                subject: '👤 {{ticketNumber}} - Solicitud asignada',
                content: 'Hola {{recipientName}},\n\nTu solicitud {{ticketNumber}} ha sido asignada a {{assignedTo}}.\n\nSaludos,\nEquipo de Armonía'
            },
            'PQR_COMMENT': {
                subject: '💬 {{ticketNumber}} - Nuevo comentario',
                content: 'Hola {{recipientName}},\n\nHay un nuevo comentario en tu solicitud {{ticketNumber}}:\n\n"{{comment}}"\n\nSaludos,\nEquipo de Armonía'
            },
            'PQR_SATISFACTION_SURVEY': {
                subject: '📋 {{ticketNumber}} - Encuesta de satisfacción',
                content: 'Hola {{recipientName}},\n\nNos gustaría conocer tu opinión sobre la resolución de tu solicitud {{ticketNumber}}.\n\nPor favor, completa la siguiente encuesta: {{surveyLink}}\n\nSaludos,\nEquipo de Armonía'
            },
            'PQR_REMINDER': {
                subject: '⏰ {{ticketNumber}} - Recordatorio',
                content: 'Hola {{recipientName}},\n\nTe recordamos que tu solicitud {{ticketNumber}} está pendiente de tu acción.\n\nSaludos,\nEquipo de Armonía'
            }
        };
        // Devolver la plantilla solicitada o una plantilla por defecto
        return Promise.resolve(templates[type] || {
            subject: 'Notificación de Armonía',
            content: 'Este es un mensaje automático del sistema Armonía.'
        });
    });
}
/**
 * Aplica variables a una plantilla
 * @param template - Plantilla con placeholders
 * @param variables - Variables a reemplazar
 * @returns Plantilla con variables aplicadas
 */
export function applyTemplateVariables(template, variables) {
    if (!template || !template.subject || !template.content) {
        return {
            subject: 'Notificación de Armonía',
            content: 'Este es un mensaje automático del sistema Armonía.'
        };
    }
    let subject = template.subject;
    let content = template.content;
    // Reemplazar variables en subject y content
    Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        subject = subject.replace(regex, variables[key]);
        content = content.replace(regex, variables[key]);
    });
    return { subject, content };
}
/**
 * Guarda una plantilla personalizada
 * @param type - Tipo de plantilla
 * @param template - Datos de la plantilla
 * @param schema - Esquema del tenant
 * @returns Plantilla guardada
 */
export function saveTemplate(type_1, template_1) {
    return __awaiter(this, arguments, void 0, function* (type, template, schema = 'public') {
        return Promise.resolve(Object.assign(Object.assign({ type }, template), { schemaName: schema, createdAt: new Date(), updatedAt: new Date() }));
    });
}
/**
 * Obtiene todas las plantillas disponibles
 * @param schema - Esquema del tenant
 * @returns Lista de plantillas
 */
export function getAllTemplates() {
    return __awaiter(this, arguments, void 0, function* (schema = 'public') {
        return Promise.resolve([
            {
                type: 'PQR_STATUS_CHANGE',
                subject: '✅ {{ticketNumber}} - Solicitud resuelta',
                content: 'Hola {{recipientName}},\n\nTu solicitud {{ticketNumber}} ha sido actualizada a estado {{status}}.\n\nSaludos,\nEquipo de Armonía',
                schemaName: schema,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                type: 'PQR_ASSIGNMENT',
                subject: '👤 {{ticketNumber}} - Solicitud asignada',
                content: 'Hola {{recipientName}},\n\nTu solicitud {{ticketNumber}} ha sido asignada a {{assignedTo}}.\n\nSaludos,\nEquipo de Armonía',
                schemaName: schema,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    });
}
