var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextRequest } from 'next/server';
import { GET as getPets, POST as postPets } from '@/app/api/inventory/pets/route';
import { GET as getProperties, POST as postProperties } from '@/app/api/inventory/properties/route';
import { GET as getVehicles, POST as postVehicles } from '@/app/api/inventory/vehicles/route';
import { GET as getStatistics } from '@/app/api/inventory/statistics/route';
// Mock de next/server para simular NextResponse
jest.mock('next/server', () => ({
    NextRequest: jest.fn().mockImplementation((input, init) => new Request(input, init)),
    NextResponse: {
        json: jest.fn((data, options) => {
            return {
                status: (options === null || options === void 0 ? void 0 : options.status) || 200,
                json: () => Promise.resolve(data),
                text: () => Promise.resolve(JSON.stringify(data)),
            };
        }),
    },
}));
// Mock de auth
jest.mock('@/lib/auth', () => ({
    verifyAuth: jest.fn(() => Promise.resolve({
        auth: true,
        payload: {
            userId: 1,
            email: 'admin@test.com',
            role: 'COMPLEX_ADMIN',
            complexId: 1
        }
    }))
}));
// Mock del servicio de inventario
jest.mock('@/lib/services/inventory-service-refactored', () => ({
    inventoryService: {
        getPets: jest.fn(),
        createPet: jest.fn(),
        getProperties: jest.fn(),
        createProperty: jest.fn(),
        updateProperty: jest.fn(), // Added mock for updateProperty
        getVehicles: jest.fn(),
        createVehicle: jest.fn(),
        getResidents: jest.fn(), // Added mock for getResidents
        updateResident: jest.fn(), // Added mock for updateResident
        getServices: jest.fn(), // Added mock for getServices
        getInventoryStats: jest.fn()
    }
}));
const mockInventoryService = require('@/lib/services/inventory-service-refactored').inventoryService;
describe('Inventory API Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('Pets API', () => {
        describe('GET /api/inventory/pets', () => {
            it('should return pets successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockPets = [
                    {
                        id: 1,
                        name: 'Firulais',
                        type: 'DOG',
                        unitNumber: '101A',
                        residentName: 'Juan Pérez',
                        createdAt: new Date()
                    }
                ];
                mockInventoryService.getPets.mockResolvedValue(mockPets);
                const request = new NextRequest('http://localhost:3000/api/inventory/pets?complexId=1');
                const response = yield getPets(request);
                const data = yield response.json();
                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.pets).toEqual(mockPets);
                expect(data.total).toBe(1);
                expect(mockInventoryService.getPets).toHaveBeenCalledWith(1, undefined);
            }));
            it('should filter by propertyId when provided', () => __awaiter(void 0, void 0, void 0, function* () {
                mockInventoryService.getPets.mockResolvedValue([]);
                const request = new NextRequest('http://localhost:3000/api/inventory/pets?complexId=1&propertyId=5');
                const response = yield getPets(request);
                expect(response.status).toBe(200);
                expect(mockInventoryService.getPets).toHaveBeenCalledWith(1, 5);
            }));
            it('should return 400 for invalid complexId', () => __awaiter(void 0, void 0, void 0, function* () {
                const request = new NextRequest('http://localhost:3000/api/inventory/pets?complexId=invalid');
                const response = yield getPets(request);
                const data = yield response.json();
                expect(response.status).toBe(400);
                expect(data.message).toBe('Parámetros inválidos');
            }));
            it('should return 403 for access to different complex', () => __awaiter(void 0, void 0, void 0, function* () {
                const { verifyAuth } = require('@/lib/auth');
                verifyAuth.mockResolvedValueOnce({
                    auth: true,
                    payload: {
                        userId: 1,
                        email: 'admin@test.com',
                        role: 'COMPLEX_ADMIN',
                        complexId: 2 // Different complex
                    }
                });
                const request = new NextRequest('http://localhost:3000/api/inventory/pets?complexId=1');
                const response = yield getPets(request);
                const data = yield response.json();
                expect(response.status).toBe(403);
                expect(data.message).toBe('Sin acceso a este complejo');
            }));
        });
        describe('POST /api/inventory/pets', () => {
            it('should create pet successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                const petData = {
                    name: 'Miau',
                    type: 'CAT',
                    propertyId: 1,
                    residentId: 1,
                    vaccinated: true
                };
                const mockCreatedPet = Object.assign(Object.assign({ id: 2 }, petData), { createdAt: new Date() });
                mockInventoryService.createPet.mockResolvedValue(mockCreatedPet);
                const request = new NextRequest('http://localhost:3000/api/inventory/pets', {
                    method: 'POST',
                    body: JSON.stringify(petData)
                });
                const response = yield postPets(request);
                const data = yield response.json();
                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.message).toBe('Mascota registrada exitosamente');
                expect(data.pet).toEqual(mockCreatedPet);
            }));
            it('should return 403 for unauthorized role', () => __awaiter(void 0, void 0, void 0, function* () {
                const { verifyAuth } = require('@/lib/auth');
                verifyAuth.mockResolvedValueOnce({
                    auth: true,
                    payload: {
                        userId: 1,
                        email: 'resident@test.com',
                        role: 'RESIDENT',
                        complexId: 1
                    }
                });
                const request = new NextRequest('http://localhost:3000/api/inventory/pets', {
                    method: 'POST',
                    body: JSON.stringify({ name: 'Test', type: 'DOG' })
                });
                const response = yield postPets(request);
                const data = yield response.json();
                expect(response.status).toBe(403);
                expect(data.message).toBe('Sin permisos para registrar mascotas');
            }));
            it('should return 400 for invalid data', () => __awaiter(void 0, void 0, void 0, function* () {
                const invalidData = {
                    name: '', // Empty name
                    type: 'INVALID_TYPE'
                };
                const request = new NextRequest('http://localhost:3000/api/inventory/pets', {
                    method: 'POST',
                    body: JSON.stringify(invalidData)
                });
                const response = yield postPets(request);
                const data = yield response.json();
                expect(response.status).toBe(400);
                expect(data.message).toBe('Datos inválidos');
                expect(data.errors).toBeDefined();
            }));
        });
    });
    describe('Properties API', () => {
        describe('GET /api/inventory/properties', () => {
            it('should return properties successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockProperties = [
                    {
                        id: 1,
                        unitNumber: '101A',
                        type: 'APARTMENT',
                        status: 'OCCUPIED',
                        ownerName: 'Juan Pérez',
                        totalResidents: 2,
                        createdAt: new Date()
                    }
                ];
                mockInventoryService.getProperties.mockResolvedValue(mockProperties);
                const request = new NextRequest('http://localhost:3000/api/inventory/properties?complexId=1');
                const response = yield getProperties(request);
                const data = yield response.json();
                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.properties).toEqual(mockProperties);
                expect(mockInventoryService.getProperties).toHaveBeenCalledWith(1);
            }));
        });
        describe('POST /api/inventory/properties', () => {
            it('should create property successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                const propertyData = {
                    complexId: 1,
                    unitNumber: '102B',
                    type: 'APARTMENT',
                    status: 'AVAILABLE'
                };
                const mockCreatedProperty = Object.assign(Object.assign({ id: 2 }, propertyData), { createdAt: new Date() });
                mockInventoryService.createProperty.mockResolvedValue(mockCreatedProperty);
                const request = new NextRequest('http://localhost:3000/api/inventory/properties', {
                    method: 'POST',
                    body: JSON.stringify(propertyData)
                });
                const response = yield postProperties(request);
                const data = yield response.json();
                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.property).toEqual(mockCreatedProperty);
            }));
            it('should return 403 for non-admin role', () => __awaiter(void 0, void 0, void 0, function* () {
                const { verifyAuth } = require('@/lib/auth');
                verifyAuth.mockResolvedValueOnce({
                    auth: true,
                    payload: {
                        userId: 1,
                        email: 'reception@test.com',
                        role: 'RECEPTION',
                        complexId: 1
                    }
                });
                const request = new NextRequest('http://localhost:3000/api/inventory/properties', {
                    method: 'POST',
                    body: JSON.stringify({ complexId: 1, unitNumber: '103C', type: 'APARTMENT' })
                });
                const response = yield postProperties(request);
                const data = yield response.json();
                expect(response.status).toBe(403);
                expect(data.message).toBe('Solo administradores pueden crear propiedades');
            }));
        });
    });
    describe('Vehicles API', () => {
        describe('GET /api/inventory/vehicles', () => {
            it('should return vehicles successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockVehicles = [
                    {
                        id: 1,
                        licensePlate: 'ABC123',
                        brand: 'Toyota',
                        model: 'Corolla',
                        unitNumber: '101A',
                        residentName: 'Juan Pérez',
                        createdAt: new Date()
                    }
                ];
                mockInventoryService.getVehicles.mockResolvedValue(mockVehicles);
                const request = new NextRequest('http://localhost:3000/api/inventory/vehicles?complexId=1');
                const response = yield getVehicles(request);
                const data = yield response.json();
                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.vehicles).toEqual(mockVehicles);
                expect(mockInventoryService.getVehicles).toHaveBeenCalledWith(1, undefined);
            }));
        });
        describe('POST /api/inventory/vehicles', () => {
            it('should create vehicle successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                const vehicleData = {
                    licensePlate: 'DEF456',
                    brand: 'Honda',
                    model: 'Civic',
                    year: 2020,
                    color: 'Azul',
                    type: 'CAR',
                    propertyId: 1,
                    residentId: 1
                };
                const mockCreatedVehicle = Object.assign(Object.assign({ id: 2 }, vehicleData), { createdAt: new Date() });
                mockInventoryService.createVehicle.mockResolvedValue(mockCreatedVehicle);
                const request = new NextRequest('http://localhost:3000/api/inventory/vehicles', {
                    method: 'POST',
                    body: JSON.stringify(vehicleData)
                });
                const response = yield postVehicles(request);
                const data = yield response.json();
                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.vehicle).toEqual(mockCreatedVehicle);
            }));
        });
    });
    describe('Statistics API', () => {
        describe('GET /api/inventory/statistics', () => {
            it('should return inventory statistics successfully', () => __awaiter(void 0, void 0, void 0, function* () {
                const mockStats = {
                    properties: {
                        total: 100,
                        occupied: 85,
                        available: 15,
                        occupancyRate: 85
                    },
                    residents: {
                        total: 180,
                        averagePerProperty: 1.8
                    },
                    pets: {
                        total: 45,
                        averagePerProperty: 0.45
                    },
                    vehicles: {
                        total: 120,
                        averagePerProperty: 1.2
                    },
                    services: {
                        total: 8
                    }
                };
                mockInventoryService.getInventoryStats.mockResolvedValue(mockStats);
                const request = new NextRequest('http://localhost:3000/api/inventory/statistics?complexId=1');
                const response = yield getStatistics(request);
                const data = yield response.json();
                expect(response.status).toBe(200);
                expect(data.success).toBe(true);
                expect(data.statistics).toEqual(mockStats);
                expect(data.complexId).toBe(1);
                expect(data.generatedAt).toBeDefined();
                expect(mockInventoryService.getInventoryStats).toHaveBeenCalledWith(1);
            }));
        });
    });
    describe('Error Handling', () => {
        it('should handle service errors gracefully', () => __awaiter(void 0, void 0, void 0, function* () {
            mockInventoryService.getPets.mockRejectedValue(new Error('Database connection failed'));
            const request = new NextRequest('http://localhost:3000/api/inventory/pets?complexId=1');
            const response = yield getPets(request);
            const data = yield response.json();
            expect(response.status).toBe(500);
            expect(data.message).toBe('Database connection failed');
        }));
        it('should handle authentication errors', () => __awaiter(void 0, void 0, void 0, function* () {
            const { verifyAuth } = require('@/lib/auth');
            verifyAuth.mockResolvedValueOnce({
                auth: false,
                payload: null
            });
            const request = new NextRequest('http://localhost:3000/api/inventory/pets?complexId=1');
            const response = yield getPets(request);
            const data = yield response.json();
            expect(response.status).toBe(401);
            expect(data.message).toBe('Token requerido');
        }));
        it('should handle malformed request bodies', () => __awaiter(void 0, void 0, void 0, function* () {
            const request = new NextRequest('http://localhost:3000/api/inventory/pets', {
                method: 'POST',
                body: 'invalid-json'
            });
            const response = yield postPets(request);
            expect(response.status).toBe(500);
        }));
    });
    describe('Performance Tests', () => {
        it('should handle large datasets efficiently', () => __awaiter(void 0, void 0, void 0, function* () {
            const largePetArray = Array.from({ length: 1000 }, (_, i) => ({
                id: i + 1,
                name: `Pet${i + 1}`,
                type: 'DOG',
                unitNumber: `${Math.floor(i / 10) + 1}A`,
                residentName: `Resident${i + 1}`,
                createdAt: new Date()
            }));
            mockInventoryService.getPets.mockResolvedValue(largePetArray);
            const startTime = Date.now();
            const request = new NextRequest('http://localhost:3000/api/inventory/pets?complexId=1');
            const response = yield getPets(request);
            const endTime = Date.now();
            expect(response.status).toBe(200);
            expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
            const data = yield response.json();
            expect(data.total).toBe(1000);
        }));
    });
});
