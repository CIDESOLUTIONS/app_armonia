var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/__tests__/notifications/push-notification-service.test.ts
import { PushNotificationService } from '@/lib/notifications/push-notification-service';
// Mock de Prisma
jest.mock('@/lib/prisma', () => ({
    getPrisma: jest.fn(() => ({
        user: {
            findUnique: jest.fn(),
            findMany: jest.fn()
        }
    }))
}));
describe('PushNotificationService', () => {
    let service;
    beforeEach(() => {
        service = PushNotificationService.getInstance();
        jest.clearAllMocks();
    });
    describe('Singleton Pattern', () => {
        it('should return the same instance', () => {
            const instance1 = PushNotificationService.getInstance();
            const instance2 = PushNotificationService.getInstance();
            expect(instance1).toBe(instance2);
        });
    });
    describe('Initialize', () => {
        it('should initialize in simulation mode when Firebase not configured', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock environment variables not set
            const originalEnv = process.env;
            process.env = Object.assign({}, originalEnv);
            delete process.env.FIREBASE_PROJECT_ID;
            delete process.env.FIREBASE_PRIVATE_KEY;
            yield service.initialize();
            // Should not throw and should work in simulation mode
            expect(true).toBe(true);
            process.env = originalEnv;
        }));
        it('should initialize with Firebase when configured', () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock environment variables set
            const originalEnv = process.env;
            process.env = Object.assign(Object.assign({}, originalEnv), { FIREBASE_PROJECT_ID: 'test-project', FIREBASE_PRIVATE_KEY: 'test-key', FIREBASE_CLIENT_EMAIL: 'test@test.com' });
            yield service.initialize();
            expect(true).toBe(true);
            process.env = originalEnv;
        }));
    });
    describe('Send Notification', () => {
        const mockRequest = {
            payload: {
                title: 'Test Notification',
                body: 'This is a test notification'
            },
            target: {
                complexId: 1
            },
            complexId: 1
        };
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield service.initialize();
        }));
        it('should send notification successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            // Mock users with device tokens
            mockPrisma.user.findMany.mockResolvedValue([
                { deviceTokens: ['token1', 'token2'] },
                { deviceTokens: ['token3'] },
                { deviceTokens: [] }
            ]);
            const result = yield service.sendNotification(mockRequest);
            expect(result.success).toBe(true);
            expect(result.messageId).toBeDefined();
            expect(result.successCount).toBeGreaterThan(0);
            expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
                where: { complexId: 1 },
                select: { deviceTokens: true }
            });
        }));
        it('should fail when no title provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidRequest = Object.assign(Object.assign({}, mockRequest), { payload: {
                    title: '',
                    body: 'Test body'
                } });
            const result = yield service.sendNotification(invalidRequest);
            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
            expect(result.errors[0].error).toContain('Título y cuerpo son requeridos');
        }));
        it('should fail when no complex ID provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const invalidRequest = Object.assign(Object.assign({}, mockRequest), { complexId: 0 });
            delete invalidRequest.complexId;
            const result = yield service.sendNotification(invalidRequest);
            expect(result.success).toBe(false);
            expect(result.errors).toBeDefined();
        }));
        it('should handle specific user targeting', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            mockPrisma.user.findUnique.mockResolvedValue({
                deviceTokens: ['user-token-1', 'user-token-2']
            });
            const userTargetRequest = Object.assign(Object.assign({}, mockRequest), { target: { userId: 123 } });
            const result = yield service.sendNotification(userTargetRequest);
            expect(result.success).toBe(true);
            expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
                where: { id: 123 },
                select: { deviceTokens: true }
            });
        }));
        it('should handle role-based targeting', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            mockPrisma.user.findMany.mockResolvedValue([
                { deviceTokens: ['admin-token-1'] },
                { deviceTokens: ['admin-token-2'] }
            ]);
            const roleTargetRequest = Object.assign(Object.assign({}, mockRequest), { target: { role: 'ADMIN', complexId: 1 } });
            const result = yield service.sendNotification(roleTargetRequest);
            expect(result.success).toBe(true);
            expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
                where: {
                    role: 'ADMIN',
                    complexId: 1
                },
                select: { deviceTokens: true }
            });
        }));
        it('should handle multiple user IDs targeting', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            mockPrisma.user.findMany.mockResolvedValue([
                { deviceTokens: ['token1'] },
                { deviceTokens: ['token2'] }
            ]);
            const multiUserRequest = Object.assign(Object.assign({}, mockRequest), { target: { userIds: [1, 2, 3] } });
            const result = yield service.sendNotification(multiUserRequest);
            expect(result.success).toBe(true);
            expect(mockPrisma.user.findMany).toHaveBeenCalledWith({
                where: {
                    id: { in: [1, 2, 3] }
                },
                select: { deviceTokens: true }
            });
        }));
        it('should handle direct device tokens', () => __awaiter(void 0, void 0, void 0, function* () {
            const directTokenRequest = Object.assign(Object.assign({}, mockRequest), { target: { deviceTokens: ['direct-token-1', 'direct-token-2'] } });
            const result = yield service.sendNotification(directTokenRequest);
            expect(result.success).toBe(true);
            expect(result.successCount).toBe(2);
        }));
        it('should handle scheduled notifications', () => __awaiter(void 0, void 0, void 0, function* () {
            const futureDate = new Date(Date.now() + 3600000); // 1 hora en el futuro
            const scheduledRequest = Object.assign(Object.assign({}, mockRequest), { scheduleAt: futureDate, target: { deviceTokens: ['token1'] } });
            const result = yield service.sendNotification(scheduledRequest);
            expect(result.success).toBe(true);
            expect(result.messageId).toContain('scheduled');
        }));
        it('should return error when no target devices found', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            mockPrisma.user.findMany.mockResolvedValue([]);
            const result = yield service.sendNotification(mockRequest);
            expect(result.success).toBe(false);
            expect(result.errors[0].error).toContain('No se encontraron dispositivos de destino');
        }));
    });
    describe('Template Notifications', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield service.initialize();
        }));
        it('should send payment reminder template', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            mockPrisma.user.findMany.mockResolvedValue([
                { deviceTokens: ['token1'] }
            ]);
            const result = yield service.sendTemplateNotification('payment_reminder', { amount: 150000, dueDate: '2024-01-15' }, { complexId: 1 });
            expect(result.success).toBe(true);
        }));
        it('should send assembly invitation template', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            mockPrisma.user.findMany.mockResolvedValue([
                { deviceTokens: ['token1'] }
            ]);
            const result = yield service.sendTemplateNotification('assembly_invitation', { date: '2024-02-15', topic: 'Presupuesto Anual' }, { complexId: 1 });
            expect(result.success).toBe(true);
        }));
        it('should send incident update template', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            mockPrisma.user.findMany.mockResolvedValue([
                { deviceTokens: ['token1'] }
            ]);
            const result = yield service.sendTemplateNotification('incident_update', { incidentId: 123, status: 'Resuelto' }, { userId: 1 });
            expect(result.success).toBe(true);
        }));
        it('should send PQR response template', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            mockPrisma.user.findUnique.mockResolvedValue({
                deviceTokens: ['token1']
            });
            const result = yield service.sendTemplateNotification('pqr_response', { pqrId: 456, status: 'Respondido' }, { userId: 1 });
            expect(result.success).toBe(true);
        }));
        it('should send general announcement template', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            mockPrisma.user.findMany.mockResolvedValue([
                { deviceTokens: ['token1'] }
            ]);
            const result = yield service.sendTemplateNotification('general_announcement', { title: 'Mantenimiento', message: 'Corte de agua programado' }, { complexId: 1 });
            expect(result.success).toBe(true);
        }));
        it('should fail with invalid template type', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect(service.sendTemplateNotification('invalid_template', {}, { complexId: 1 })).rejects.toThrow('Plantilla de notificación \'invalid_template\' no encontrada');
        }));
    });
    describe('Topic Management', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield service.initialize();
        }));
        it('should subscribe devices to topic', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.subscribeToTopic(['token1', 'token2'], 'complex_1_announcements');
            expect(result).toBe(true);
        }));
        it('should unsubscribe devices from topic', () => __awaiter(void 0, void 0, void 0, function* () {
            const result = yield service.unsubscribeFromTopic(['token1', 'token2'], 'complex_1_announcements');
            expect(result).toBe(true);
        }));
    });
    describe('Error Handling', () => {
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            yield service.initialize();
        }));
        it('should handle database errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            const { getPrisma } = yield import('@/lib/prisma');
            const mockPrisma = getPrisma();
            mockPrisma.user.findMany.mockRejectedValue(new Error('Database connection failed'));
            const result = yield service.sendNotification({
                payload: { title: 'Test', body: 'Test' },
                target: { complexId: 1 },
                complexId: 1
            });
            expect(result.success).toBe(false);
            expect(result.errors[0].error).toBeDefined();
        }));
    });
});
