var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPrisma } from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { addDays } from 'date-fns';
// Inicializar cliente Prisma
const prisma = getPrisma();
/**
 * Servicio para la gestión de correspondencia y paquetería
 */
export class PackageService {
    /**
     * Obtiene todos los paquetes con paginación y filtros opcionales
     */
    getAllPackages(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, status, type, search, startDate, endDate, unitNumber, residentId, priority } = params;
            const skip = (page - 1) * limit;
            // Construir filtros
            const where = {};
            if (status) {
                where.status = status;
            }
            if (type) {
                where.type = type;
            }
            if (priority) {
                where.priority = priority;
            }
            if (unitNumber) {
                where.unitNumber = unitNumber;
            }
            if (residentId) {
                where.residentId = residentId;
            }
            if (search) {
                where.OR = [
                    { trackingCode: { contains: search, mode: 'insensitive' } },
                    { trackingNumber: { contains: search, mode: 'insensitive' } },
                    { residentName: { contains: search, mode: 'insensitive' } },
                    { unitNumber: { contains: search, mode: 'insensitive' } },
                    { senderName: { contains: search, mode: 'insensitive' } },
                    { senderCompany: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ];
            }
            if (startDate && endDate) {
                where.receivedAt = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                };
            }
            else if (startDate) {
                where.receivedAt = {
                    gte: new Date(startDate)
                };
            }
            else if (endDate) {
                where.receivedAt = {
                    lte: new Date(endDate)
                };
            }
            // Ejecutar consulta con conteo total
            const [packages, total] = yield Promise.all([
                prisma.package.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { receivedAt: 'desc' },
                    include: {
                        statusHistory: {
                            orderBy: { changedAt: 'desc' },
                            take: 5
                        },
                        notifications: {
                            orderBy: { sentAt: 'desc' },
                            take: 3
                        }
                    }
                }),
                prisma.package.count({ where })
            ]);
            return {
                data: packages,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        });
    }
    /**
     * Obtiene un paquete por su ID
     */
    getPackageById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageData = yield prisma.package.findUnique({
                where: { id },
                include: {
                    statusHistory: {
                        orderBy: { changedAt: 'desc' }
                    },
                    notifications: {
                        orderBy: { sentAt: 'desc' }
                    }
                }
            });
            if (!packageData) {
                throw new Error('Paquete no encontrado');
            }
            return packageData;
        });
    }
    /**
     * Obtiene un paquete por su código de seguimiento interno
     */
    getPackageByTrackingCode(trackingCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const packageData = yield prisma.package.findFirst({
                where: { trackingCode },
                include: {
                    statusHistory: {
                        orderBy: { changedAt: 'desc' }
                    },
                    notifications: {
                        orderBy: { sentAt: 'desc' }
                    }
                }
            });
            if (!packageData) {
                throw new Error('Paquete no encontrado');
            }
            return packageData;
        });
    }
    /**
     * Crea un nuevo registro de paquete
     */
    createPackage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validar datos requeridos
            if (!data.type || !data.unitNumber || !data.residentName || !data.receivedByStaffId) {
                throw new Error('Faltan campos requeridos');
            }
            // Generar código de seguimiento interno único
            const trackingCode = this.generateTrackingCode();
            // Obtener configuración de paquetes
            const settings = yield this.getPackageSettings();
            // Calcular fecha de expiración
            const expirationDate = addDays(new Date(), settings.expirationDays);
            // Crear el paquete
            const packageData = yield prisma.package.create({
                data: {
                    trackingCode,
                    type: data.type,
                    trackingNumber: data.trackingNumber,
                    courier: data.courier,
                    senderName: data.senderName,
                    senderCompany: data.senderCompany,
                    residentId: data.residentId,
                    unitId: data.unitId,
                    unitNumber: data.unitNumber,
                    residentName: data.residentName,
                    receivedAt: new Date(),
                    expirationDate,
                    status: 'RECEIVED',
                    priority: data.priority ? data.priority : 'NORMAL',
                    receivedByStaffId: data.receivedByStaffId,
                    receivedByStaffName: data.receivedByStaffName,
                    size: data.size,
                    weight: data.weight,
                    isFragile: data.isFragile || false,
                    needsRefrigeration: data.needsRefrigeration || false,
                    description: data.description,
                    notes: data.notes,
                    tags: data.tags || [],
                    mainPhotoUrl: data.mainPhotoUrl,
                    attachments: data.attachments
                }
            });
            // Crear registro en historial de estados
            yield this.createStatusHistoryEntry({
                packageId: packageData.id,
                newStatus: 'RECEIVED',
                changedByUserId: data.receivedByStaffId,
                changedByUserName: data.receivedByStaffName,
                notes: 'Paquete recibido en recepción'
            });
            // Notificar al residente si está configurado
            if (settings.autoNotifyResident) {
                try {
                    yield this.notifyResident(packageData.id);
                }
                catch (error) {
                    console.error('Error al notificar al residente:', error);
                    // No fallamos la operación completa si falla la notificación
                }
            }
            return packageData;
        });
    }
    /**
     * Actualiza la información de un paquete
     */
    updatePackage(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el paquete exista
            const packageData = yield prisma.package.findUnique({
                where: { id }
            });
            if (!packageData) {
                throw new Error('Paquete no encontrado');
            }
            // Actualizar el paquete
            const updatedPackage = yield prisma.package.update({
                where: { id },
                data: {
                    trackingNumber: data.trackingNumber,
                    courier: data.courier,
                    senderName: data.senderName,
                    senderCompany: data.senderCompany,
                    residentId: data.residentId,
                    unitNumber: data.unitNumber,
                    residentName: data.residentName,
                    size: data.size,
                    weight: data.weight,
                    isFragile: data.isFragile,
                    needsRefrigeration: data.needsRefrigeration,
                    description: data.description,
                    notes: data.notes,
                    tags: data.tags,
                    mainPhotoUrl: data.mainPhotoUrl,
                    attachments: data.attachments,
                    priority: data.priority
                }
            });
            // Crear registro en historial de estados si hay cambios importantes
            if (data.residentId !== packageData.residentId ||
                data.unitNumber !== packageData.unitNumber ||
                data.residentName !== packageData.residentName ||
                data.priority !== packageData.priority) {
                yield this.createStatusHistoryEntry({
                    packageId: id,
                    previousStatus: packageData.status,
                    newStatus: packageData.status,
                    changedByUserId: data.updatedByUserId,
                    changedByUserName: data.updatedByUserName,
                    notes: 'Información del paquete actualizada'
                });
            }
            return updatedPackage;
        });
    }
    /**
     * Cambia el estado de un paquete
     */
    changePackageStatus(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el paquete exista
            const packageData = yield prisma.package.findUnique({
                where: { id }
            });
            if (!packageData) {
                throw new Error('Paquete no encontrado');
            }
            // Validar transición de estado
            if (!this.isValidStatusTransition(packageData.status, data.newStatus)) {
                throw new Error(`Transición de estado inválida: ${packageData.status} -> ${data.newStatus}`);
            }
            // Preparar datos para actualización
            const updateData = {
                status: data.newStatus
            };
            // Si el estado es NOTIFIED, registrar fecha de notificación
            if (data.newStatus === 'NOTIFIED') {
                updateData.notifiedAt = new Date();
            }
            // Si el estado es DELIVERED, registrar fecha de entrega y datos adicionales
            if (data.newStatus === 'DELIVERED') {
                updateData.deliveredAt = new Date();
                updateData.deliveredByStaffId = data.deliveredByStaffId;
                updateData.deliveredByStaffName = data.deliveredByStaffName;
                updateData.receivedByResidentId = data.receivedByResidentId;
                updateData.receivedByResidentName = data.receivedByResidentName;
                updateData.signatureUrl = data.signatureUrl;
            }
            // Actualizar el paquete
            const updatedPackage = yield prisma.package.update({
                where: { id },
                data: updateData
            });
            // Crear registro en historial de estados
            yield this.createStatusHistoryEntry({
                packageId: id,
                previousStatus: packageData.status,
                newStatus: data.newStatus,
                changedByUserId: data.changedByUserId,
                changedByUserName: data.changedByUserName,
                notes: data.notes
            });
            // Si el estado es NOTIFIED, enviar notificación al residente
            if (data.newStatus === 'NOTIFIED') {
                try {
                    yield this.notifyResident(id);
                }
                catch (error) {
                    console.error('Error al notificar al residente:', error);
                    // No fallamos la operación completa si falla la notificación
                }
            }
            return updatedPackage;
        });
    }
    /**
     * Registra la entrega de un paquete
     */
    deliverPackage(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.changePackageStatus(id, {
                newStatus: 'DELIVERED',
                changedByUserId: data.deliveredByStaffId,
                changedByUserName: data.deliveredByStaffName,
                notes: data.notes || 'Paquete entregado al destinatario',
                deliveredByStaffId: data.deliveredByStaffId,
                deliveredByStaffName: data.deliveredByStaffName,
                receivedByResidentId: data.receivedByResidentId,
                receivedByResidentName: data.receivedByResidentName,
                signatureUrl: data.signatureUrl
            });
        });
    }
    /**
     * Marca un paquete como devuelto al remitente
     */
    returnPackage(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.changePackageStatus(id, {
                newStatus: 'RETURNED',
                changedByUserId: data.returnedByStaffId,
                changedByUserName: data.returnedByStaffName,
                notes: data.notes || 'Paquete devuelto al remitente'
            });
        });
    }
    /**
     * Notifica al residente sobre un paquete
     */
    notifyResident(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener datos del paquete
            const packageData = yield this.getPackageById(packageId);
            // Obtener configuración de paquetes
            const settings = yield this.getPackageSettings();
            // Obtener plantilla de notificación
            const template = yield this.getNotificationTemplate('email');
            // Simular envío de notificación (aquí iría la lógica real de envío)
            const notificationContent = this.generateNotificationContent(template, packageData);
            // Registrar notificación
            const notification = yield prisma.packageNotification.create({
                data: {
                    packageId,
                    type: 'email',
                    recipient: `resident_${packageData.residentId}@example.com`, // Simulado
                    status: 'sent',
                    content: notificationContent
                }
            });
            // Actualizar estado del paquete a NOTIFIED si aún no lo está
            if (packageData.status === 'RECEIVED') {
                yield this.changePackageStatus(packageId, {
                    newStatus: 'NOTIFIED',
                    changedByUserId: 0, // Sistema
                    changedByUserName: 'Sistema',
                    notes: 'Notificación enviada automáticamente'
                });
            }
            return notification;
        });
    }
    /**
     * Crea una entrada en el historial de estados
     */
    createStatusHistoryEntry(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma.packageStatusHistory.create({
                data: {
                    packageId: data.packageId,
                    previousStatus: data.previousStatus,
                    newStatus: data.newStatus,
                    changedByUserId: data.changedByUserId,
                    changedByUserName: data.changedByUserName,
                    notes: data.notes
                }
            });
        });
    }
    /**
     * Obtiene estadísticas de paquetes
     */
    getPackageStats(params) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const { startDate, endDate } = params;
            // Construir filtros de fecha
            const dateFilter = {};
            if (startDate && endDate) {
                dateFilter.receivedAt = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                };
            }
            else if (startDate) {
                dateFilter.receivedAt = {
                    gte: new Date(startDate)
                };
            }
            else if (endDate) {
                dateFilter.receivedAt = {
                    lte: new Date(endDate)
                };
            }
            // Obtener estadísticas
            const [totalPackages, pendingPackages, deliveredPackages, returnedPackages, todayCount, packagesByType, packagesByStatus] = yield Promise.all([
                prisma.package.count({ where: dateFilter }),
                prisma.package.count({ where: Object.assign(Object.assign({}, dateFilter), { status: { in: ['RECEIVED', 'NOTIFIED', 'PENDING'] } }) }),
                prisma.package.count({ where: Object.assign(Object.assign({}, dateFilter), { status: 'DELIVERED' }) }),
                prisma.package.count({ where: Object.assign(Object.assign({}, dateFilter), { status: 'RETURNED' }) }),
                prisma.package.count({
                    where: {
                        receivedAt: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                }),
                prisma.$queryRaw `
        SELECT "type", COUNT(*) as count
        FROM "tenant"."Package"
        WHERE ${dateFilter.receivedAt ? `"receivedAt" >= '${dateFilter.receivedAt.gte.toISOString()}'::timestamp 
              AND "receivedAt" <= '${((_a = dateFilter.receivedAt.lte) === null || _a === void 0 ? void 0 : _a.toISOString()) || new Date().toISOString()}'::timestamp` : '1=1'}
        GROUP BY "type"
      `,
                prisma.$queryRaw `
        SELECT "status", COUNT(*) as count
        FROM "tenant"."Package"
        WHERE ${dateFilter.receivedAt ? `"receivedAt" >= '${dateFilter.receivedAt.gte.toISOString()}'::timestamp 
              AND "receivedAt" <= '${((_b = dateFilter.receivedAt.lte) === null || _b === void 0 ? void 0 : _b.toISOString()) || new Date().toISOString()}'::timestamp` : '1=1'}
        GROUP BY "status"
      `
            ]);
            return {
                totalPackages,
                pendingPackages,
                deliveredPackages,
                returnedPackages,
                todayCount,
                packagesByType,
                packagesByStatus
            };
        });
    }
    /**
     * Obtiene la configuración de paquetes
     */
    getPackageSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar configuración existente
            let settings = yield prisma.packageSettings.findFirst();
            // Si no existe, crear configuración por defecto
            if (!settings) {
                settings = yield prisma.packageSettings.create({
                    data: {
                        autoNotifyResident: true,
                        notificationMethods: ['email'],
                        expirationDays: 30,
                        reminderFrequency: 3,
                        requireSignature: true,
                        requirePhoto: true,
                        allowAnyoneToReceive: false
                    }
                });
            }
            return settings;
        });
    }
    /**
     * Actualiza la configuración de paquetes
     */
    updatePackageSettings(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Obtener configuración actual
            const currentSettings = yield this.getPackageSettings();
            // Actualizar configuración
            return prisma.packageSettings.update({
                where: { id: currentSettings.id },
                data
            });
        });
    }
    /**
     * Obtiene una plantilla de notificación
     */
    getNotificationTemplate(type) {
        return __awaiter(this, void 0, void 0, function* () {
            // Buscar plantilla por defecto para el tipo especificado
            let template = yield prisma.packageNotificationTemplate.findFirst({
                where: {
                    type,
                    isDefault: true,
                    isActive: true
                }
            });
            // Si no existe, crear plantilla por defecto
            if (!template) {
                template = yield prisma.packageNotificationTemplate.create({
                    data: {
                        name: `Plantilla por defecto (${type})`,
                        type,
                        subject: 'Notificación de paquete recibido',
                        template: 'Estimado/a {{residentName}}, ha recibido un paquete de tipo {{packageType}} en recepción. Por favor, pase a recogerlo presentando su identificación. Código de seguimiento: {{trackingCode}}.',
                        isDefault: true,
                        isActive: true
                    }
                });
            }
            return template;
        });
    }
    /**
     * Genera un código de seguimiento único
     */
    generateTrackingCode() {
        // Formato: PKG-YYYYMMDD-XXXX (donde XXXX son caracteres alfanuméricos aleatorios)
        const date = new Date();
        const dateStr = date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0');
        const randomStr = uuidv4().substring(0, 4).toUpperCase();
        return `PKG-${dateStr}-${randomStr}`;
    }
    /**
     * Genera el contenido de una notificación
     */
    generateNotificationContent(template, packageData) {
        let content = template.template;
        // Reemplazar variables en la plantilla
        content = content.replace(/{{residentName}}/g, packageData.residentName);
        content = content.replace(/{{packageType}}/g, packageData.type);
        content = content.replace(/{{trackingCode}}/g, packageData.trackingCode);
        content = content.replace(/{{unitNumber}}/g, packageData.unitNumber);
        content = content.replace(/{{receivedAt}}/g, packageData.receivedAt.toLocaleString());
        return content;
    }
    /**
     * Valida si una transición de estado es válida
     */
    isValidStatusTransition(currentStatus, newStatus) {
        var _a;
        // Definir transiciones válidas
        const validTransitions = {
            'RECEIVED': ['NOTIFIED', 'PENDING', 'DELIVERED', 'RETURNED', 'EXPIRED'],
            'NOTIFIED': ['PENDING', 'DELIVERED', 'RETURNED', 'EXPIRED'],
            'PENDING': ['DELIVERED', 'RETURNED', 'EXPIRED'],
            'DELIVERED': [], // Estado final
            'RETURNED': [], // Estado final
            'EXPIRED': ['RETURNED'] // Solo se puede devolver
        };
        // Verificar si la transición es válida
        return ((_a = validTransitions[currentStatus]) === null || _a === void 0 ? void 0 : _a.includes(newStatus)) || false;
    }
}
// Exportar una instancia del servicio
export const packageService = new PackageService();
