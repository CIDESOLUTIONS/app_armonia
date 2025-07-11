// src/services/__tests__/votingService.test.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getVotingStats, submitVote, updateVotingStatus } from '../votingService';
import { prisma } from '@/lib/prisma';
// Mock de Prisma
jest.mock('@/lib/prisma', () => ({
    prisma: {
        agendaItem: {
            findFirst: jest.fn(),
            update: jest.fn()
        },
        vote: {
            findFirst: jest.fn(),
            create: jest.fn()
        },
        user: {
            findUnique: jest.fn()
        },
        auditLog: {
            create: jest.fn()
        },
        $queryRaw: jest.fn()
    }
}));
describe('Voting Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('getVotingStats', () => {
        it('debe retornar estadísticas correctas para un punto de agenda', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock
            const mockAgendaItem = {
                id: 1,
                assemblyId: 1,
                numeral: 1,
                votingStatus: 'open',
                votingEndTime: null,
                votes: [
                    { userId: 1, value: 'YES', coefficient: 0.5 },
                    { userId: 2, value: 'YES', coefficient: 0.3 },
                    { userId: 3, value: 'NO', coefficient: 0.2 }
                ]
            };
            prisma.agendaItem.findFirst.mockResolvedValue(mockAgendaItem);
            // Ejecutar función
            const stats = yield getVotingStats(1, 1);
            // Verificar resultados
            expect(stats).toEqual({
                totalVotes: 3,
                yesVotes: 2,
                noVotes: 1,
                yesPercentage: 80, // (0.5 + 0.3) / 1.0 * 100 = 80%
                noPercentage: 20, // 0.2 / 1.0 * 100 = 20%
                isOpen: true,
                endTime: null
            });
            // Verificar que se llamó al método correcto
            expect(prisma.agendaItem.findFirst).toHaveBeenCalledWith({
                where: { assemblyId: 1, numeral: 1 },
                include: { votes: true }
            });
        }));
        it('debe lanzar error si el punto de agenda no existe', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock para retornar null
            prisma.agendaItem.findFirst.mockResolvedValue(null);
            // Verificar que se lanza el error
            yield expect(getVotingStats(1, 1)).rejects.toThrow('Punto de agenda no encontrado');
        }));
    });
    describe('submitVote', () => {
        it('debe registrar un voto correctamente', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mocks
            const mockAgendaItem = {
                id: 1,
                assemblyId: 1,
                numeral: 1,
                votingStatus: 'open'
            };
            const mockVote = {
                id: 1,
                agendaItemId: 1,
                userId: 1,
                value: 'YES',
                coefficient: 0.5
            };
            prisma.agendaItem.findFirst.mockResolvedValue(mockAgendaItem);
            prisma.vote.findFirst.mockResolvedValue(null); // No existe voto previo
            prisma.$queryRaw.mockResolvedValue([{ total_coefficient: 0.5 }]);
            prisma.vote.create.mockResolvedValue(mockVote);
            prisma.auditLog.create.mockResolvedValue({});
            // Ejecutar función
            const result = yield submitVote(1, 1, 1, 'YES');
            // Verificar resultado
            expect(result).toEqual(mockVote);
            // Verificar que se llamaron los métodos correctos
            expect(prisma.agendaItem.findFirst).toHaveBeenCalledWith({
                where: { assemblyId: 1, numeral: 1 }
            });
            expect(prisma.vote.findFirst).toHaveBeenCalledWith({
                where: { agendaItemId: 1, userId: 1 }
            });
            expect(prisma.vote.create).toHaveBeenCalledWith({
                data: {
                    agendaItemId: 1,
                    userId: 1,
                    value: 'YES',
                    coefficient: 0.5
                }
            });
        }));
        it('debe lanzar error si la votación no está abierta', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock para votación cerrada
            const mockAgendaItem = {
                id: 1,
                assemblyId: 1,
                numeral: 1,
                votingStatus: 'closed'
            };
            prisma.agendaItem.findFirst.mockResolvedValue(mockAgendaItem);
            // Verificar que se lanza el error
            yield expect(submitVote(1, 1, 1, 'YES')).rejects.toThrow('La votación no está abierta');
        }));
        it('debe lanzar error si el usuario ya votó', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mocks
            const mockAgendaItem = {
                id: 1,
                assemblyId: 1,
                numeral: 1,
                votingStatus: 'open'
            };
            const mockExistingVote = {
                id: 1,
                agendaItemId: 1,
                userId: 1,
                value: 'YES'
            };
            prisma.agendaItem.findFirst.mockResolvedValue(mockAgendaItem);
            prisma.vote.findFirst.mockResolvedValue(mockExistingVote);
            // Verificar que se lanza el error
            yield expect(submitVote(1, 1, 1, 'YES')).rejects.toThrow('Ya has emitido tu voto para este punto');
        }));
    });
    describe('updateVotingStatus', () => {
        it('debe actualizar el estado de votación correctamente', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mocks
            const mockAgendaItem = {
                id: 1,
                assemblyId: 1,
                numeral: 1,
                votingStatus: 'pending',
                votingStartTime: null,
                votingEndTime: null
            };
            const mockUpdatedAgendaItem = Object.assign(Object.assign({}, mockAgendaItem), { votingStatus: 'open', votingStartTime: new Date() });
            prisma.user.findUnique.mockResolvedValue({ role: 'ADMIN' });
            prisma.agendaItem.findFirst.mockResolvedValue(mockAgendaItem);
            prisma.agendaItem.update.mockResolvedValue(mockUpdatedAgendaItem);
            prisma.auditLog.create.mockResolvedValue({});
            // Ejecutar función
            const result = yield updateVotingStatus(1, 1, 'open', 1);
            // Verificar resultado
            expect(result).toEqual(mockUpdatedAgendaItem);
            // Verificar que se llamaron los métodos correctos
            expect(prisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                select: { role: true }
            });
            expect(prisma.agendaItem.findFirst).toHaveBeenCalledWith({
                where: { assemblyId: 1, numeral: 1 }
            });
            expect(prisma.agendaItem.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: {
                    votingStatus: 'open',
                    votingStartTime: expect.any(Date),
                    votingEndTime: null
                }
            });
        }));
        it('debe lanzar error si el usuario no es administrador', () => __awaiter(void 0, void 0, void 0, function* () {
            // Configurar mock para usuario no admin
            prisma.user.findUnique.mockResolvedValue({ role: 'USER' });
            // Verificar que se lanza el error
            yield expect(updateVotingStatus(1, 1, 'open', 1)).rejects.toThrow('No tienes permisos para realizar esta acción');
        }));
    });
});
