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
import { ServerLogger } from '@/lib/logging/server-logger';
export class CommunityEventService {
    constructor(schemaName) {
        this.schemaName = schemaName;
        this.prisma = getPrisma(schemaName);
    }
    getEvents(complexId, filters, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const where = { complexId };
                if (filters.startDate && filters.endDate) {
                    where.OR = [
                        {
                            startDate: {
                                gte: new Date(filters.startDate),
                                lte: new Date(filters.endDate),
                            },
                        },
                        {
                            endDate: {
                                gte: new Date(filters.startDate),
                                lte: new Date(filters.endDate),
                            },
                        },
                        {
                            AND: [
                                { startDate: { lte: new Date(filters.startDate) } },
                                { endDate: { gte: new Date(filters.endDate) } },
                            ],
                        },
                    ];
                }
                if (filters.type) {
                    where.type = filters.type;
                }
                // Filtrar por roles si no es admin
                if (userRole !== 'ADMIN' && userRole !== 'COMPLEX_ADMIN') {
                    where.OR = [
                        ...(where.OR || []),
                        { visibility: 'public' },
                        { targetRoles: { has: userRole } },
                    ];
                }
                const events = yield this.prisma.communityEvent.findMany({
                    where,
                    orderBy: { startDate: 'asc' },
                    include: {
                        createdBy: { select: { id: true, name: true } },
                        attendees: { select: { userId: true, name: true, status: true } },
                    },
                });
                return events;
            }
            catch (error) {
                ServerLogger.error(`[CommunityEventService] Error al obtener eventos para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    getEventById(id, complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const event = yield this.prisma.communityEvent.findUnique({
                    where: { id, complexId },
                    include: {
                        createdBy: { select: { id: true, name: true } },
                        attendees: { select: { userId: true, name: true, status: true } },
                    },
                });
                return event;
            }
            catch (error) {
                ServerLogger.error(`[CommunityEventService] Error al obtener evento ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    createEvent(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newEvent = yield this.prisma.communityEvent.create({
                    data: {
                        title: data.title,
                        description: data.description,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        location: data.location,
                        type: data.type,
                        visibility: data.visibility,
                        targetRoles: data.targetRoles,
                        maxAttendees: data.maxAttendees,
                        createdById: data.createdById,
                        complexId: data.complexId,
                    },
                });
                ServerLogger.info(`[CommunityEventService] Evento ${newEvent.id} creado para ${this.schemaName}`);
                return newEvent;
            }
            catch (error) {
                ServerLogger.error(`[CommunityEventService] Error al crear evento para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    updateEvent(id, complexId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedEvent = yield this.prisma.communityEvent.update({
                    where: { id, complexId },
                    data: {
                        title: data.title,
                        description: data.description,
                        startDate: data.startDate,
                        endDate: data.endDate,
                        location: data.location,
                        type: data.type,
                        visibility: data.visibility,
                        targetRoles: data.targetRoles,
                        maxAttendees: data.maxAttendees,
                        updatedAt: new Date(),
                    },
                });
                ServerLogger.info(`[CommunityEventService] Evento ${id} actualizado para ${this.schemaName}`);
                return updatedEvent;
            }
            catch (error) {
                ServerLogger.error(`[CommunityEventService] Error al actualizar evento ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
    deleteEvent(id, complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prisma.communityEvent.delete({
                    where: { id, complexId },
                });
                ServerLogger.info(`[CommunityEventService] Evento ${id} eliminado para ${this.schemaName}`);
            }
            catch (error) {
                ServerLogger.error(`[CommunityEventService] Error al eliminar evento ${id} para ${this.schemaName}:`, error);
                throw error;
            }
        });
    }
}
