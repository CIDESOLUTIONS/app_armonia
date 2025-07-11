// src/services/votingService.ts
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
/**
 * Obtiene estadísticas de votación para un punto específico de la agenda de una asamblea
 */
export function getVotingStats(assemblyId, agendaNumeral) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const agendaItem = yield prisma.agendaItem.findFirst({
                where: {
                    assemblyId,
                    numeral: agendaNumeral
                },
                include: {
                    votes: true
                }
            });
            if (!agendaItem) {
                throw new Error('Punto de agenda no encontrado');
            }
            const totalVotes = agendaItem.votes.length;
            const yesVotes = agendaItem.votes.filter(v => v.value === 'YES').length;
            const noVotes = agendaItem.votes.filter(v => v.value === 'NO').length;
            // Calcular porcentajes ponderados por coeficiente
            const totalCoefficient = agendaItem.votes.reduce((sum, vote) => sum + vote.coefficient, 0);
            const yesCoefficient = agendaItem.votes
                .filter(v => v.value === 'YES')
                .reduce((sum, vote) => sum + vote.coefficient, 0);
            const noCoefficient = agendaItem.votes
                .filter(v => v.value === 'NO')
                .reduce((sum, vote) => sum + vote.coefficient, 0);
            return {
                totalVotes,
                yesVotes,
                noVotes,
                yesPercentage: totalCoefficient > 0 ? Math.round((yesCoefficient / totalCoefficient) * 100) : 0,
                noPercentage: totalCoefficient > 0 ? Math.round((noCoefficient / totalCoefficient) * 100) : 0,
                isOpen: agendaItem.votingStatus === 'open',
                endTime: agendaItem.votingEndTime
            };
        }
        catch (error) {
            console.error('Error al obtener estadísticas de votación:', error);
            throw error;
        }
    });
}
/**
 * Registra un voto de usuario para un punto específico de la agenda
 */
export function submitVote(assemblyId, agendaNumeral, userId, value) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar si el punto de agenda existe y está abierto para votación
            const agendaItem = yield prisma.agendaItem.findFirst({
                where: {
                    assemblyId,
                    numeral: agendaNumeral
                }
            });
            if (!agendaItem) {
                throw new Error('Punto de agenda no encontrado');
            }
            if (agendaItem.votingStatus !== 'open') {
                throw new Error('La votación no está abierta');
            }
            // Verificar si el usuario ya votó
            const existingVote = yield prisma.vote.findFirst({
                where: {
                    agendaItemId: agendaItem.id,
                    userId
                }
            });
            if (existingVote) {
                throw new Error('Ya has emitido tu voto para este punto');
            }
            // Obtener coeficiente de propiedad del usuario
            // Nota: Esta es una implementación simplificada. En un caso real,
            // necesitaríamos obtener el coeficiente de las propiedades del usuario.
            const userCoefficient = yield getUserCoefficient(userId);
            // Registrar el voto
            const vote = yield prisma.vote.create({
                data: {
                    agendaItemId: agendaItem.id,
                    userId,
                    value,
                    coefficient: userCoefficient
                }
            });
            // Registrar la acción en el log de auditoría
            yield logVotingAction(userId, assemblyId, agendaNumeral, 'VOTE_SUBMITTED', { value });
            return vote;
        }
        catch (error) {
            console.error('Error al enviar voto:', error);
            throw error;
        }
    });
}
/**
 * Actualiza el estado de votación de un punto de agenda
 */
export function updateVotingStatus(assemblyId, agendaNumeral, status, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar si el usuario es administrador
            const isAdmin = yield checkUserIsAdmin(userId);
            if (!isAdmin) {
                throw new Error('No tienes permisos para realizar esta acción');
            }
            // Obtener el punto de agenda
            const agendaItem = yield prisma.agendaItem.findFirst({
                where: {
                    assemblyId,
                    numeral: agendaNumeral
                }
            });
            if (!agendaItem) {
                throw new Error('Punto de agenda no encontrado');
            }
            // Actualizar el estado
            const updatedAgendaItem = yield prisma.agendaItem.update({
                where: {
                    id: agendaItem.id
                },
                data: {
                    votingStatus: status,
                    votingStartTime: status === 'open' ? new Date() : agendaItem.votingStartTime,
                    votingEndTime: status === 'closed' ? new Date() : agendaItem.votingEndTime
                }
            });
            // Registrar la acción en el log de auditoría
            yield logVotingAction(userId, assemblyId, agendaNumeral, status === 'open' ? 'VOTING_OPENED' :
                status === 'closed' ? 'VOTING_CLOSED' : 'VOTING_RESET');
            return updatedAgendaItem;
        }
        catch (error) {
            console.error('Error al actualizar estado de votación:', error);
            throw error;
        }
    });
}
/**
 * Registra una acción de votación en el log de auditoría
 */
export function logVotingAction(userId_1, assemblyId_1, agendaNumeral_1, action_1) {
    return __awaiter(this, arguments, void 0, function* (userId, assemblyId, agendaNumeral, action, details = {}) {
        try {
            return yield prisma.auditLog.create({
                data: {
                    userId,
                    entityType: 'VOTING',
                    entityId: `${assemblyId}-${agendaNumeral}`,
                    action,
                    details: JSON.stringify(details)
                }
            });
        }
        catch (error) {
            console.error('Error al registrar acción en log de auditoría:', error);
            // No propagamos el error para no interrumpir el flujo principal
        }
    });
}
/**
 * Obtiene el coeficiente de propiedad de un usuario
 * Nota: Esta es una implementación simplificada. En un caso real,
 * necesitaríamos obtener el coeficiente de las propiedades del usuario.
 */
function getUserCoefficient(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Implementación simplificada para desarrollo
        // En un caso real, consultaríamos la tabla de propiedades del usuario
        try {
            // Intentar obtener el coeficiente real del usuario
            const properties = yield prisma.$queryRaw `
      SELECT SUM(coefficient) as total_coefficient 
      FROM "tenant"."Property" 
      WHERE "ownerId" = ${userId}
    `;
            if (properties && Array.isArray(properties) && properties.length > 0) {
                const totalCoefficient = properties[0].total_coefficient;
                return totalCoefficient || 1.0; // Si no tiene propiedades, usar 1.0 como valor predeterminado
            }
            return 1.0; // Valor predeterminado si no se encuentra información
        }
        catch (error) {
            console.error('Error al obtener coeficiente de usuario:', error);
            return 1.0; // Valor predeterminado en caso de error
        }
    });
}
/**
 * Verifica si un usuario tiene rol de administrador
 */
function checkUserIsAdmin(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma.user.findUnique({
                where: { id: userId },
                select: { role: true }
            });
            return (user === null || user === void 0 ? void 0 : user.role) === 'ADMIN';
        }
        catch (error) {
            console.error('Error al verificar rol de usuario:', error);
            return false;
        }
    });
}
