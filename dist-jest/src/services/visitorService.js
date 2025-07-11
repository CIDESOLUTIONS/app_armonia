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
// Inicializar cliente Prisma
const prisma = getPrisma();
/**
 * Servicio para la gestión de visitantes
 */
export class VisitorService {
    /**
     * Obtiene todos los visitantes con paginación y filtros opcionales
     */
    getAllVisitors(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10, status, search, startDate, endDate } = params;
            const skip = (page - 1) * limit;
            // Construir filtros
            const where = {};
            if (status) {
                where.status = status;
            }
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { documentNumber: { contains: search } },
                    { destination: { contains: search, mode: 'insensitive' } },
                    { residentName: { contains: search, mode: 'insensitive' } }
                ];
            }
            if (startDate && endDate) {
                where.entryTime = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                };
            }
            else if (startDate) {
                where.entryTime = {
                    gte: new Date(startDate)
                };
            }
            else if (endDate) {
                where.entryTime = {
                    lte: new Date(endDate)
                };
            }
            // Ejecutar consulta con conteo total
            const [visitors, total] = yield Promise.all([
                prisma.visitor.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: { entryTime: 'desc' },
                    include: {
                        preRegister: true,
                        accessPass: true,
                        accessLogs: {
                            orderBy: { timestamp: 'desc' },
                            take: 5
                        }
                    }
                }),
                prisma.visitor.count({ where })
            ]);
            return {
                data: visitors,
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
     * Obtiene un visitante por su ID
     */
    getVisitorById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const visitor = yield prisma.visitor.findUnique({
                where: { id },
                include: {
                    preRegister: true,
                    accessPass: true,
                    accessLogs: {
                        orderBy: { timestamp: 'desc' }
                    }
                }
            });
            if (!visitor) {
                throw new Error('Visitante no encontrado');
            }
            return visitor;
        });
    }
    /**
     * Crea un nuevo registro de visitante
     */
    createVisitor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validar datos requeridos
            if (!data.name || !data.documentType || !data.documentNumber || !data.destination) {
                throw new Error('Faltan campos requeridos');
            }
            // Verificar si ya existe un visitante activo con el mismo documento
            const existingVisitor = yield prisma.visitor.findFirst({
                where: {
                    documentNumber: data.documentNumber,
                    documentType: data.documentType,
                    status: 'ACTIVE'
                }
            });
            if (existingVisitor) {
                throw new Error('Ya existe un visitante activo con este documento');
            }
            // Crear el visitante
            const visitor = yield prisma.visitor.create({
                data: {
                    name: data.name,
                    documentType: data.documentType,
                    documentNumber: data.documentNumber,
                    destination: data.destination,
                    residentName: data.residentName,
                    entryTime: new Date(),
                    plate: data.plate,
                    photoUrl: data.photoUrl,
                    status: 'ACTIVE',
                    purpose: data.purpose,
                    company: data.company,
                    temperature: data.temperature,
                    belongings: data.belongings,
                    signature: data.signature,
                    registeredBy: data.registeredBy,
                    preRegisterId: data.preRegisterId,
                    accessPassId: data.accessPassId
                }
            });
            // Crear registro en bitácora de accesos
            yield prisma.accessLog.create({
                data: {
                    action: 'ENTRY',
                    location: 'Entrada principal',
                    registeredBy: data.registeredBy,
                    visitorId: visitor.id,
                    accessPassId: data.accessPassId
                }
            });
            // Si hay un pase de acceso, actualizar su contador de uso
            if (data.accessPassId) {
                yield prisma.accessPass.update({
                    where: { id: data.accessPassId },
                    data: {
                        usageCount: { increment: 1 },
                        status: 'USED'
                    }
                });
            }
            return visitor;
        });
    }
    /**
     * Registra la salida de un visitante
     */
    registerExit(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el visitante exista y esté activo
            const visitor = yield prisma.visitor.findUnique({
                where: { id }
            });
            if (!visitor) {
                throw new Error('Visitante no encontrado');
            }
            if (visitor.status !== 'ACTIVE') {
                throw new Error('El visitante ya ha salido');
            }
            // Actualizar el visitante
            const updatedVisitor = yield prisma.visitor.update({
                where: { id },
                data: {
                    exitTime: new Date(),
                    status: 'DEPARTED',
                    notes: data.notes
                }
            });
            // Crear registro en bitácora de accesos
            yield prisma.accessLog.create({
                data: {
                    action: 'EXIT',
                    location: 'Salida principal',
                    notes: data.notes,
                    registeredBy: data.registeredBy,
                    visitorId: id
                }
            });
            return updatedVisitor;
        });
    }
    /**
     * Actualiza la información de un visitante
     */
    updateVisitor(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Verificar que el visitante exista
            const visitor = yield prisma.visitor.findUnique({
                where: { id }
            });
            if (!visitor) {
                throw new Error('Visitante no encontrado');
            }
            // Actualizar el visitante
            const updatedVisitor = yield prisma.visitor.update({
                where: { id },
                data
            });
            return updatedVisitor;
        });
    }
    /**
     * Obtiene estadísticas de visitantes
     */
    getVisitorStats(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { startDate, endDate } = params;
            // Construir filtros de fecha
            const dateFilter = {};
            if (startDate && endDate) {
                dateFilter.entryTime = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                };
            }
            else if (startDate) {
                dateFilter.entryTime = {
                    gte: new Date(startDate)
                };
            }
            else if (endDate) {
                dateFilter.entryTime = {
                    lte: new Date(endDate)
                };
            }
            // Obtener estadísticas
            const [totalVisitors, activeVisitors, preRegisteredCount, todayCount] = yield Promise.all([
                prisma.visitor.count({ where: dateFilter }),
                prisma.visitor.count({ where: Object.assign(Object.assign({}, dateFilter), { status: 'ACTIVE' }) }),
                prisma.preRegisteredVisitor.count({
                    where: {
                        status: 'ACTIVE',
                        validUntil: { gte: new Date() }
                    }
                }),
                prisma.visitor.count({
                    where: {
                        entryTime: {
                            gte: new Date(new Date().setHours(0, 0, 0, 0))
                        }
                    }
                })
            ]);
            return {
                totalVisitors,
                activeVisitors,
                preRegisteredCount,
                todayCount
            };
        });
    }
}
// Exportar una instancia del servicio
export const visitorService = new VisitorService();
