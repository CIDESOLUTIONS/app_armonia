var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/__tests__/security/digital-logs.test.ts
import { useDigitalLogs } from '@/hooks/useDigitalLogs';
import { renderHook, act } from '@testing-library/react';
// Mock de API client
jest.mock('@/lib/api-client', () => ({
    apiClient: {
        post: jest.fn(),
        get: jest.fn(),
        put: jest.fn(),
        delete: jest.fn()
    }
}));
const mockApiClient = require('@/lib/api-client').apiClient;
describe('useDigitalLogs Hook', () => {
    const mockLog = {
        id: 1,
        complexId: 1,
        shiftDate: '2025-06-14T00:00:00.000Z',
        shiftStart: '2025-06-14T06:00:00.000Z',
        shiftEnd: '2025-06-14T14:00:00.000Z',
        guardOnDuty: 1,
        logType: 'GENERAL',
        priority: 'NORMAL',
        title: 'Turno nocturno sin novedades',
        description: 'Turno transcurrió con normalidad, sin incidentes reportados.',
        status: 'OPEN',
        requiresFollowUp: false,
        category: 'OTHER',
        supervisorReview: false,
        createdAt: '2025-06-14T06:00:00.000Z',
        updatedAt: '2025-06-14T06:00:00.000Z',
        guard: {
            id: 1,
            name: 'Juan Pérez',
            email: 'juan.perez@example.com'
        },
        creator: {
            id: 1,
            name: 'Juan Pérez',
            email: 'juan.perez@example.com'
        }
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('createLog', () => {
        it('should create a new digital log successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                success: true,
                digitalLog: mockLog,
                message: 'Minuta digital creada exitosamente'
            };
            mockApiClient.post.mockResolvedValue(mockResponse);
            const { result } = renderHook(() => useDigitalLogs());
            const createData = {
                shiftDate: '2025-06-14T00:00:00.000Z',
                shiftStart: '2025-06-14T06:00:00.000Z',
                title: 'Turno nocturno sin novedades',
                description: 'Turno transcurrió con normalidad, sin incidentes reportados.',
                logType: 'GENERAL',
                priority: 'NORMAL',
                category: 'OTHER',
                requiresFollowUp: false
            };
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                const success = yield result.current.createLog(createData);
                expect(success).toBe(true);
            }));
            expect(mockApiClient.post).toHaveBeenCalledWith('/security/digital-logs', createData);
            expect(result.current.digitalLogs).toContain(mockLog);
        }));
        it('should handle creation errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = {
                success: false,
                message: 'Error creando minuta'
            };
            mockApiClient.post.mockResolvedValue(mockError);
            const { result } = renderHook(() => useDigitalLogs());
            const createData = {
                shiftDate: '2025-06-14T00:00:00.000Z',
                shiftStart: '2025-06-14T06:00:00.000Z',
                title: 'Test',
                description: 'Test description',
                logType: 'GENERAL',
                priority: 'NORMAL',
                category: 'OTHER',
                requiresFollowUp: false
            };
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                const success = yield result.current.createLog(createData);
                expect(success).toBe(false);
            }));
            expect(result.current.error).toBe('Error creando minuta');
        }));
    });
    describe('updateLog', () => {
        it('should update a digital log successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const updatedLog = Object.assign(Object.assign({}, mockLog), { status: 'RESOLVED' });
            const mockResponse = {
                success: true,
                digitalLog: updatedLog,
                message: 'Minuta actualizada exitosamente'
            };
            mockApiClient.put.mockResolvedValue(mockResponse);
            const { result } = renderHook(() => useDigitalLogs());
            // Primero agregar el log original
            act(() => {
                result.current.digitalLogs.push(mockLog);
            });
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                const success = yield result.current.updateLog(1, { status: 'RESOLVED' });
                expect(success).toBe(true);
            }));
            expect(mockApiClient.put).toHaveBeenCalledWith('/security/digital-logs/1', { status: 'RESOLVED' });
        }));
        it('should handle update errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = {
                success: false,
                message: 'Error actualizando minuta'
            };
            mockApiClient.put.mockResolvedValue(mockError);
            const { result } = renderHook(() => useDigitalLogs());
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                const success = yield result.current.updateLog(1, { status: 'RESOLVED' });
                expect(success).toBe(false);
            }));
            expect(result.current.error).toBe('Error actualizando minuta');
        }));
    });
    describe('deleteLog', () => {
        it('should delete a digital log successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                success: true,
                message: 'Minuta eliminada exitosamente'
            };
            mockApiClient.delete.mockResolvedValue(mockResponse);
            const { result } = renderHook(() => useDigitalLogs());
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                const success = yield result.current.deleteLog(1);
                expect(success).toBe(true);
            }));
            expect(mockApiClient.delete).toHaveBeenCalledWith('/security/digital-logs/1');
        }));
    });
    describe('searchLogs', () => {
        it('should search logs with filters', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                success: true,
                digitalLogs: [mockLog],
                pagination: {
                    page: 1,
                    limit: 20,
                    total: 1,
                    totalPages: 1,
                    hasNext: false,
                    hasPrevious: false
                }
            };
            mockApiClient.get.mockResolvedValue(mockResponse);
            const { result } = renderHook(() => useDigitalLogs());
            const filters = {
                startDate: '2025-06-01',
                endDate: '2025-06-30',
                logType: 'GENERAL',
                priority: 'NORMAL'
            };
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                yield result.current.searchLogs(filters);
            }));
            expect(mockApiClient.get).toHaveBeenCalledWith(expect.stringContaining('/security/digital-logs?'));
            expect(result.current.digitalLogs).toEqual([mockLog]);
            expect(result.current.pagination).toEqual(mockResponse.pagination);
        }));
        it('should handle search errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = {
                success: false,
                message: 'Error buscando minutas'
            };
            mockApiClient.get.mockResolvedValue(mockError);
            const { result } = renderHook(() => useDigitalLogs());
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                yield result.current.searchLogs({});
            }));
            expect(result.current.error).toBe('Error buscando minutas');
        }));
    });
    describe('getLog', () => {
        it('should get a specific log by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                success: true,
                digitalLog: mockLog
            };
            mockApiClient.get.mockResolvedValue(mockResponse);
            const { result } = renderHook(() => useDigitalLogs());
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                const log = yield result.current.getLog(1);
                expect(log).toEqual(mockLog);
            }));
            expect(mockApiClient.get).toHaveBeenCalledWith('/security/digital-logs/1');
        }));
        it('should return null on error', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = {
                success: false,
                message: 'Minuta no encontrada'
            };
            mockApiClient.get.mockResolvedValue(mockError);
            const { result } = renderHook(() => useDigitalLogs());
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                const log = yield result.current.getLog(999);
                expect(log).toBeNull();
            }));
            expect(result.current.error).toBe('Minuta no encontrada');
        }));
    });
    describe('reviewLog', () => {
        it('should review a log as supervisor', () => __awaiter(void 0, void 0, void 0, function* () {
            const reviewedLog = Object.assign(Object.assign({}, mockLog), { supervisorReview: true, status: 'IN_REVIEW', reviewNotes: 'Revisado por supervisor' });
            const mockResponse = {
                success: true,
                digitalLog: reviewedLog,
                message: 'Minuta actualizada exitosamente'
            };
            mockApiClient.put.mockResolvedValue(mockResponse);
            const { result } = renderHook(() => useDigitalLogs());
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                const success = yield result.current.reviewLog(1, 'Revisado por supervisor');
                expect(success).toBe(true);
            }));
            expect(mockApiClient.put).toHaveBeenCalledWith('/security/digital-logs/1', {
                supervisorReview: true,
                reviewNotes: 'Revisado por supervisor',
                status: 'IN_REVIEW'
            });
        }));
    });
    describe('getLogStats', () => {
        it('should calculate statistics from loaded logs', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockLogs = [
                Object.assign(Object.assign({}, mockLog), { id: 1, status: 'OPEN', priority: 'NORMAL', category: 'OTHER', requiresFollowUp: false }),
                Object.assign(Object.assign({}, mockLog), { id: 2, status: 'RESOLVED', priority: 'HIGH', category: 'INCIDENT', requiresFollowUp: true }),
                Object.assign(Object.assign({}, mockLog), { id: 3, status: 'IN_REVIEW', priority: 'URGENT', category: 'EMERGENCY', requiresFollowUp: false })
            ];
            const { result } = renderHook(() => useDigitalLogs());
            // Simular logs cargados
            act(() => {
                result.current.digitalLogs = mockLogs;
            });
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                const stats = yield result.current.getLogStats();
                expect(stats).toEqual({
                    total: 3,
                    byStatus: {
                        'OPEN': 1,
                        'RESOLVED': 1,
                        'IN_REVIEW': 1
                    },
                    byPriority: {
                        'NORMAL': 1,
                        'HIGH': 1,
                        'URGENT': 1
                    },
                    byCategory: {
                        'OTHER': 1,
                        'INCIDENT': 1,
                        'EMERGENCY': 1
                    },
                    pending: 2, // OPEN + IN_REVIEW
                    requiresFollowUp: 1
                });
            }));
        }));
    });
    describe('State Management', () => {
        it('should manage selectedLog state', () => {
            const { result } = renderHook(() => useDigitalLogs());
            act(() => {
                result.current.setSelectedLog(mockLog);
            });
            expect(result.current.selectedLog).toEqual(mockLog);
            act(() => {
                result.current.setSelectedLog(null);
            });
            expect(result.current.selectedLog).toBeNull();
        });
        it('should clear errors', () => {
            const { result } = renderHook(() => useDigitalLogs());
            // Simular error
            act(() => {
                result.current.error = 'Test error';
            });
            expect(result.current.error).toBe('Test error');
            act(() => {
                result.current.clearError();
            });
            expect(result.current.error).toBeNull();
        });
        it('should manage loading state during operations', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockResponse = {
                success: true,
                digitalLog: mockLog
            };
            // Simular delay en la respuesta
            mockApiClient.post.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockResponse), 100)));
            const { result } = renderHook(() => useDigitalLogs());
            const createPromise = act(() => __awaiter(void 0, void 0, void 0, function* () {
                yield result.current.createLog({
                    shiftDate: '2025-06-14T00:00:00.000Z',
                    shiftStart: '2025-06-14T06:00:00.000Z',
                    title: 'Test',
                    description: 'Test description',
                    logType: 'GENERAL',
                    priority: 'NORMAL',
                    category: 'OTHER',
                    requiresFollowUp: false
                });
            }));
            // Verificar que loading se activa
            expect(result.current.loading).toBe(true);
            yield createPromise;
            // Verificar que loading se desactiva
            expect(result.current.loading).toBe(false);
        }));
    });
    describe('Edge Cases', () => {
        it('should handle network errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            mockApiClient.post.mockRejectedValue(new Error('Network error'));
            const { result } = renderHook(() => useDigitalLogs());
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                const success = yield result.current.createLog({
                    shiftDate: '2025-06-14T00:00:00.000Z',
                    shiftStart: '2025-06-14T06:00:00.000Z',
                    title: 'Test',
                    description: 'Test description',
                    logType: 'GENERAL',
                    priority: 'NORMAL',
                    category: 'OTHER',
                    requiresFollowUp: false
                });
                expect(success).toBe(false);
            }));
            expect(result.current.error).toBe('Network error');
        }));
        it('should handle invalid responses', () => __awaiter(void 0, void 0, void 0, function* () {
            mockApiClient.get.mockResolvedValue(null);
            const { result } = renderHook(() => useDigitalLogs());
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                yield result.current.searchLogs({});
            }));
            expect(result.current.error).toBe('Error buscando minutas');
        }));
        it('should update selected log when updating same log', () => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const updatedLog = Object.assign(Object.assign({}, mockLog), { status: 'RESOLVED' });
            const mockResponse = {
                success: true,
                digitalLog: updatedLog
            };
            mockApiClient.put.mockResolvedValue(mockResponse);
            const { result } = renderHook(() => useDigitalLogs());
            // Establecer log seleccionado
            act(() => {
                result.current.setSelectedLog(mockLog);
            });
            yield act(() => __awaiter(void 0, void 0, void 0, function* () {
                yield result.current.updateLog(1, { status: 'RESOLVED' });
            }));
            expect((_a = result.current.selectedLog) === null || _a === void 0 ? void 0 : _a.status).toBe('RESOLVED');
        }));
    });
});
