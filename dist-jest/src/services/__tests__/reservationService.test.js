var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { getPrisma } from '@/lib/prisma';
import { ReservationStatus } from '@prisma/client';
import reservationService from '../reservationService';
// Mock PrismaClient and ReservationStatus
jest.mock('@prisma/client', () => {
    // Mock ReservationStatus enum
    const ReservationStatus = {
        PENDING: 'PENDING',
        APPROVED: 'APPROVED',
        REJECTED: 'REJECTED',
        CANCELLED: 'CANCELLED',
        COMPLETED: 'COMPLETED'
    };
    const mockPrisma = {
        commonArea: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        },
        availabilityConfig: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        },
        reservationRule: {
            findMany: jest.fn(),
            create: jest.fn()
        },
        reservation: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        },
        reservationNotification: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn()
        }
    };
    return {
        PrismaClient: jest.fn(() => mockPrisma),
        ReservationStatus
    };
});
// Get the mocked prisma instance
const prisma = getPrisma();
describe('ReservationService', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });
    describe('getCommonAreas', () => {
        it('should return all common areas when no filters are provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAreas = [
                { id: 1, name: 'Salón Comunal', isActive: true },
                { id: 2, name: 'Piscina', isActive: true }
            ];
            prisma.commonArea.findMany.mockResolvedValue(mockAreas);
            const result = yield reservationService.getCommonAreas();
            expect(prisma.commonArea.findMany).toHaveBeenCalledWith({
                where: {},
                include: {
                    availabilityConfig: true,
                    reservationRules: {
                        where: { isActive: true },
                    },
                },
            });
            expect(result).toEqual(mockAreas);
        }));
        it('should apply filters when provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAreas = [
                { id: 1, name: 'Salón Comunal', isActive: true, requiresApproval: true }
            ];
            prisma.commonArea.findMany.mockResolvedValue(mockAreas);
            const result = yield reservationService.getCommonAreas({
                active: true,
                requiresApproval: true
            });
            expect(prisma.commonArea.findMany).toHaveBeenCalledWith({
                where: {
                    isActive: true,
                    requiresApproval: true
                },
                include: {
                    availabilityConfig: true,
                    reservationRules: {
                        where: { isActive: true },
                    },
                },
            });
            expect(result).toEqual(mockAreas);
        }));
    });
    describe('getCommonAreaById', () => {
        it('should return a common area by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockArea = {
                id: 1,
                name: 'Salón Comunal',
                isActive: true,
                availabilityConfig: {
                    mondayStart: '08:00',
                    mondayEnd: '20:00'
                },
                reservationRules: [
                    { id: 1, name: 'Regla 1', isActive: true }
                ]
            };
            prisma.commonArea.findUnique.mockResolvedValue(mockArea);
            const result = yield reservationService.getCommonAreaById(1);
            expect(prisma.commonArea.findUnique).toHaveBeenCalledWith({
                where: { id: 1 },
                include: {
                    availabilityConfig: true,
                    reservationRules: {
                        where: { isActive: true },
                    },
                },
            });
            expect(result).toEqual(mockArea);
        }));
    });
    describe('createCommonArea', () => {
        it('should create a new common area', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockAreaData = {
                name: 'Nueva Área',
                location: 'Piso 1',
                capacity: 20
            };
            const mockCreatedArea = Object.assign(Object.assign({ id: 3 }, mockAreaData), { isActive: true, requiresApproval: false, hasFee: false });
            prisma.commonArea.create.mockResolvedValue(mockCreatedArea);
            const result = yield reservationService.createCommonArea(mockAreaData);
            expect(prisma.commonArea.create).toHaveBeenCalledWith({
                data: mockAreaData
            });
            expect(result).toEqual(mockCreatedArea);
        }));
    });
    describe('checkAvailability', () => {
        it('should check availability for a common area', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockArea = {
                id: 1,
                name: 'Salón Comunal',
                isActive: true,
                availabilityConfig: {
                    mondayStart: '08:00',
                    mondayEnd: '20:00'
                },
                reservationRules: []
            };
            const mockReservations = [
                {
                    id: 1,
                    commonAreaId: 1,
                    startDateTime: new Date('2025-06-01T10:00:00Z'),
                    endDateTime: new Date('2025-06-01T12:00:00Z'),
                    status: ReservationStatus.APPROVED
                }
            ];
            prisma.commonArea.findUnique.mockResolvedValue(mockArea);
            prisma.reservation.findMany.mockResolvedValue(mockReservations);
            const startDate = new Date('2025-06-01T00:00:00Z');
            const endDate = new Date('2025-06-02T00:00:00Z');
            const result = yield reservationService.checkAvailability(1, startDate, endDate);
            expect(prisma.commonArea.findUnique).toHaveBeenCalled();
            expect(prisma.reservation.findMany).toHaveBeenCalled();
            expect(result).toHaveProperty('commonArea', mockArea);
            expect(result).toHaveProperty('occupiedSlots');
            expect(result.occupiedSlots.length).toBe(1);
        }));
        it('should throw an error if common area is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            prisma.commonArea.findUnique.mockResolvedValue(null);
            const startDate = new Date('2025-06-01T00:00:00Z');
            const endDate = new Date('2025-06-02T00:00:00Z');
            yield expect(reservationService.checkAvailability(999, startDate, endDate))
                .rejects.toThrow('Área común no encontrada');
        }));
    });
    describe('createReservation', () => {
        it('should create a new reservation when area is available', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockReservationData = {
                commonAreaId: 1,
                userId: 1,
                propertyId: 1,
                title: 'Reunión familiar',
                startDateTime: new Date('2025-06-01T14:00:00Z'),
                endDateTime: new Date('2025-06-01T16:00:00Z')
            };
            const mockArea = {
                id: 1,
                name: 'Salón Comunal',
                requiresApproval: false
            };
            const mockCreatedReservation = Object.assign(Object.assign({ id: 1 }, mockReservationData), { status: ReservationStatus.APPROVED, attendees: 1, requiresPayment: false, createdAt: new Date(), updatedAt: new Date() });
            // Setup mocks
            prisma.commonArea.findUnique.mockResolvedValue(mockArea);
            prisma.reservation.findMany.mockResolvedValue([]);
            prisma.reservation.create.mockResolvedValue(mockCreatedReservation);
            prisma.reservationNotification.create.mockResolvedValue({});
            // Execute
            const result = yield reservationService.createReservation(mockReservationData);
            // Verify
            expect(prisma.reservation.create).toHaveBeenCalledWith({
                data: expect.objectContaining(Object.assign(Object.assign({}, mockReservationData), { status: ReservationStatus.APPROVED }))
            });
            expect(prisma.reservationNotification.create).toHaveBeenCalled();
            expect(result).toEqual(mockCreatedReservation);
        }));
        it('should create a pending reservation when area requires approval', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockReservationData = {
                commonAreaId: 1,
                userId: 1,
                propertyId: 1,
                title: 'Reunión familiar',
                startDateTime: new Date('2025-06-01T14:00:00Z'),
                endDateTime: new Date('2025-06-01T16:00:00Z')
            };
            const mockArea = {
                id: 1,
                name: 'Salón Comunal',
                requiresApproval: true
            };
            const mockCreatedReservation = Object.assign(Object.assign({ id: 1 }, mockReservationData), { status: ReservationStatus.PENDING, attendees: 1, requiresPayment: false, createdAt: new Date(), updatedAt: new Date() });
            // Setup mocks
            prisma.commonArea.findUnique.mockResolvedValue(mockArea);
            prisma.reservation.findMany.mockResolvedValue([]);
            prisma.reservation.create.mockResolvedValue(mockCreatedReservation);
            prisma.reservationNotification.create.mockResolvedValue({});
            // Execute
            const result = yield reservationService.createReservation(mockReservationData);
            // Verify
            expect(prisma.reservation.create).toHaveBeenCalledWith({
                data: expect.objectContaining(Object.assign(Object.assign({}, mockReservationData), { status: ReservationStatus.PENDING }))
            });
            expect(result).toEqual(mockCreatedReservation);
        }));
        it('should throw an error when there is a conflict with existing reservations', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockReservationData = {
                commonAreaId: 1,
                userId: 1,
                propertyId: 1,
                title: 'Reunión familiar',
                startDateTime: new Date('2025-06-01T14:00:00Z'),
                endDateTime: new Date('2025-06-01T16:00:00Z')
            };
            const mockArea = {
                id: 1,
                name: 'Salón Comunal',
                requiresApproval: false
            };
            const mockExistingReservations = [
                {
                    id: 1,
                    commonAreaId: 1,
                    startDateTime: new Date('2025-06-01T15:00:00Z'),
                    endDateTime: new Date('2025-06-01T17:00:00Z'),
                    status: ReservationStatus.APPROVED,
                    reservationId: 1
                }
            ];
            // Setup mocks
            prisma.commonArea.findUnique.mockResolvedValue(mockArea);
            prisma.reservation.findMany.mockResolvedValue(mockExistingReservations);
            // Execute & Verify
            yield expect(reservationService.createReservation(mockReservationData))
                .rejects.toThrow('El horario solicitado no está disponible');
        }));
    });
    describe('cancelReservation', () => {
        it('should cancel a reservation', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockReservation = {
                id: 1,
                userId: 1,
                commonAreaId: 1,
                status: ReservationStatus.APPROVED,
                startDateTime: new Date('2025-06-10T14:00:00Z'), // Future date
                endDateTime: new Date('2025-06-10T16:00:00Z'),
                commonArea: {
                    name: 'Salón Comunal'
                }
            };
            const mockRules = [
                {
                    allowCancellation: true,
                    cancellationHours: 24
                }
            ];
            const mockCancelledReservation = Object.assign(Object.assign({}, mockReservation), { status: ReservationStatus.CANCELLED, cancellationReason: 'Cancelada por el usuario', cancelledAt: expect.any(Date) });
            // Setup mocks
            prisma.reservation.findUnique.mockResolvedValue(mockReservation);
            prisma.reservationRule.findMany.mockResolvedValue(mockRules);
            prisma.reservation.update.mockResolvedValue(mockCancelledReservation);
            prisma.reservationNotification.create.mockResolvedValue({});
            // Execute
            const result = yield reservationService.cancelReservation(1, 'Cancelada por el usuario', 1);
            // Verify
            expect(prisma.reservation.update).toHaveBeenCalledWith({
                where: { id: 1 },
                data: expect.objectContaining({
                    status: ReservationStatus.CANCELLED,
                    cancellationReason: 'Cancelada por el usuario',
                    cancelledAt: expect.any(Date)
                })
            });
            expect(result).toEqual(mockCancelledReservation);
        }));
        it('should throw an error when user is not the owner', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockReservation = {
                id: 1,
                userId: 1, // Owner is user 1
                commonAreaId: 1,
                status: ReservationStatus.APPROVED,
                startDateTime: new Date('2025-06-10T14:00:00Z'),
                endDateTime: new Date('2025-06-10T16:00:00Z')
            };
            // Setup mocks
            prisma.reservation.findUnique.mockResolvedValue(mockReservation);
            // Execute & Verify - User 2 tries to cancel
            yield expect(reservationService.cancelReservation(1, 'Cancelada', 2))
                .rejects.toThrow('Solo el propietario puede cancelar la reserva');
        }));
        it('should throw an error when cancellation is not allowed', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockReservation = {
                id: 1,
                userId: 1,
                commonAreaId: 1,
                status: ReservationStatus.APPROVED,
                startDateTime: new Date('2025-06-10T14:00:00Z'),
                endDateTime: new Date('2025-06-10T16:00:00Z')
            };
            const mockRules = [
                {
                    allowCancellation: false
                }
            ];
            // Setup mocks
            prisma.reservation.findUnique.mockResolvedValue(mockReservation);
            prisma.reservationRule.findMany.mockResolvedValue(mockRules);
            // Execute & Verify
            yield expect(reservationService.cancelReservation(1, 'Cancelada', 1))
                .rejects.toThrow('Las cancelaciones no están permitidas para esta área común');
        }));
    });
    describe('getUserNotifications', () => {
        it('should return user notifications', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockNotifications = [
                {
                    id: 1,
                    userId: 1,
                    type: 'confirmation',
                    message: 'Su reserva ha sido confirmada',
                    isRead: false,
                    sentAt: new Date()
                },
                {
                    id: 2,
                    userId: 1,
                    type: 'reminder',
                    message: 'Recordatorio de su reserva mañana',
                    isRead: true,
                    sentAt: new Date()
                }
            ];
            // Setup mocks
            prisma.reservationNotification.findMany.mockResolvedValue(mockNotifications);
            // Execute
            const result = yield reservationService.getUserNotifications(1);
            // Verify
            expect(prisma.reservationNotification.findMany).toHaveBeenCalledWith({
                where: {
                    userId: 1
                },
                orderBy: {
                    sentAt: 'desc'
                }
            });
            expect(result).toEqual(mockNotifications);
        }));
        it('should apply filters when provided', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock data
            const mockNotifications = [
                {
                    id: 1,
                    userId: 1,
                    type: 'confirmation',
                    message: 'Su reserva ha sido confirmada',
                    isRead: false,
                    sentAt: new Date()
                }
            ];
            // Setup mocks
            prisma.reservationNotification.findMany.mockResolvedValue(mockNotifications);
            // Execute
            const result = yield reservationService.getUserNotifications(1, {
                isRead: false,
                type: 'confirmation'
            });
            // Verify
            expect(prisma.reservationNotification.findMany).toHaveBeenCalledWith({
                where: {
                    userId: 1,
                    isRead: false,
                    type: 'confirmation'
                },
                orderBy: {
                    sentAt: 'desc'
                }
            });
            expect(result).toEqual(mockNotifications);
        }));
    });
});
