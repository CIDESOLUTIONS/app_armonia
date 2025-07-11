// src/lib/services/inventory-service-refactored.ts
/**
 * Servicio refactorizado de inventario usando cliente Prisma nativo
 * Reemplaza consultas $queryRawUnsafe por operaciones type-safe
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
import { getPrisma } from '@/lib/prisma';
/**
 * Servicio refactorizado de inventario
 */
export class InventoryServiceRefactored {
    /**
     * PROPIEDADES
     */
    // Obtener todas las propiedades de un complejo con detalles
    getProperties(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const properties = yield prisma.property.findMany({
                    where: { complexId },
                    include: {
                        owner: {
                            select: { id: true, name: true, email: true }
                        },
                        residents: {
                            select: { id: true },
                            where: { status: 'ACTIVE' }
                        }
                    },
                    orderBy: { unitNumber: 'asc' }
                });
                return properties.map(property => {
                    var _a, _b;
                    return ({
                        id: property.id,
                        complexId: property.complexId,
                        unitNumber: property.unitNumber,
                        type: property.type,
                        status: property.status,
                        area: property.area || undefined,
                        block: property.block || undefined,
                        zone: property.zone || undefined,
                        ownerId: property.ownerId || undefined,
                        ownerName: ((_a = property.owner) === null || _a === void 0 ? void 0 : _a.name) || undefined,
                        ownerEmail: ((_b = property.owner) === null || _b === void 0 ? void 0 : _b.email) || undefined,
                        totalResidents: property.residents.length,
                        createdAt: property.createdAt,
                        updatedAt: property.updatedAt
                    });
                });
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error obteniendo propiedades:', error);
                throw new Error('Error obteniendo propiedades');
            }
        });
    }
    // Crear nueva propiedad
    createProperty(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const property = yield prisma.property.create({
                    data: {
                        complexId: data.complexId,
                        unitNumber: data.unitNumber,
                        type: data.type,
                        status: data.status,
                        area: data.area,
                        block: data.block,
                        zone: data.zone,
                        ownerId: data.ownerId
                    },
                    include: {
                        owner: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                });
                return property;
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error creando propiedad:', error);
                throw new Error('Error creando propiedad');
            }
        });
    }
    // Actualizar propiedad
    updateProperty(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const property = yield prisma.property.update({
                    where: { id },
                    data,
                    include: {
                        owner: {
                            select: { id: true, name: true, email: true }
                        }
                    }
                });
                return property;
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error actualizando propiedad:', error);
                throw new Error('Error actualizando propiedad');
            }
        });
    }
    /**
     * MASCOTAS
     */
    // Obtener mascotas de un complejo con filtros
    getPets(complexId, propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const whereClause = {
                    property: { complexId }
                };
                if (propertyId) {
                    whereClause.propertyId = propertyId;
                }
                const pets = yield prisma.pet.findMany({
                    where: whereClause,
                    include: {
                        property: {
                            select: { id: true, unitNumber: true }
                        },
                        resident: {
                            select: { id: true, name: true }
                        }
                    },
                    orderBy: { name: 'asc' }
                });
                return pets.map(pet => ({
                    id: pet.id,
                    name: pet.name,
                    type: pet.type,
                    breed: pet.breed || undefined,
                    age: pet.age || undefined,
                    weight: pet.weight || undefined,
                    color: pet.color || undefined,
                    vaccinated: pet.vaccinated,
                    vaccineExpiryDate: pet.vaccineExpiryDate || undefined,
                    notes: pet.notes || undefined,
                    propertyId: pet.propertyId,
                    residentId: pet.residentId,
                    unitNumber: pet.property.unitNumber,
                    residentName: pet.resident.name,
                    createdAt: pet.createdAt
                }));
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error obteniendo mascotas:', error);
                throw new Error('Error obteniendo mascotas');
            }
        });
    }
    // Crear nueva mascota
    createPet(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const pet = yield prisma.pet.create({
                    data: {
                        name: data.name,
                        type: data.type,
                        breed: data.breed,
                        age: data.age,
                        weight: data.weight,
                        color: data.color,
                        propertyId: data.propertyId,
                        residentId: data.residentId,
                        vaccinated: data.vaccinated,
                        vaccineExpiryDate: data.vaccineExpiryDate ? new Date(data.vaccineExpiryDate) : null,
                        notes: data.notes
                    },
                    include: {
                        property: {
                            select: { unitNumber: true }
                        },
                        resident: {
                            select: { name: true }
                        }
                    }
                });
                return pet;
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error creando mascota:', error);
                throw new Error('Error creando mascota');
            }
        });
    }
    /**
     * VEHÍCULOS
     */
    // Obtener vehículos de un complejo
    getVehicles(complexId, propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const whereClause = {
                    property: { complexId }
                };
                if (propertyId) {
                    whereClause.propertyId = propertyId;
                }
                const vehicles = yield prisma.vehicle.findMany({
                    where: whereClause,
                    include: {
                        property: {
                            select: { id: true, unitNumber: true }
                        },
                        resident: {
                            select: { id: true, name: true }
                        }
                    },
                    orderBy: { licensePlate: 'asc' }
                });
                return vehicles.map(vehicle => ({
                    id: vehicle.id,
                    licensePlate: vehicle.licensePlate,
                    brand: vehicle.brand,
                    model: vehicle.model,
                    year: vehicle.year,
                    color: vehicle.color,
                    type: vehicle.type,
                    parkingSpot: vehicle.parkingSpot || undefined,
                    notes: vehicle.notes || undefined,
                    propertyId: vehicle.propertyId,
                    residentId: vehicle.residentId,
                    unitNumber: vehicle.property.unitNumber,
                    residentName: vehicle.resident.name,
                    createdAt: vehicle.createdAt
                }));
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error obteniendo vehículos:', error);
                throw new Error('Error obteniendo vehículos');
            }
        });
    }
    // Crear nuevo vehículo
    createVehicle(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const vehicle = yield prisma.vehicle.create({
                    data: {
                        licensePlate: data.licensePlate.toUpperCase(),
                        brand: data.brand,
                        model: data.model,
                        year: data.year,
                        color: data.color,
                        type: data.type,
                        parkingSpot: data.parkingSpot,
                        notes: data.notes,
                        propertyId: data.propertyId,
                        residentId: data.residentId
                    },
                    include: {
                        property: {
                            select: { unitNumber: true }
                        },
                        resident: {
                            select: { name: true }
                        }
                    }
                });
                return vehicle;
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error creando vehículo:', error);
                throw new Error('Error creando vehículo');
            }
        });
    }
    /**
     * RESIDENTES
     */
    // Obtener residentes de un complejo
    getResidents(complexId, propertyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const whereClause = {
                    property: { complexId }
                };
                if (propertyId) {
                    whereClause.propertyId = propertyId;
                }
                const residents = yield prisma.resident.findMany({
                    where: whereClause,
                    include: {
                        property: {
                            select: { id: true, unitNumber: true, type: true }
                        },
                        pets: {
                            select: { id: true, name: true, type: true }
                        },
                        vehicles: {
                            select: { id: true, licensePlate: true, brand: true, model: true }
                        }
                    },
                    orderBy: { name: 'asc' }
                });
                return residents;
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error obteniendo residentes:', error);
                throw new Error('Error obteniendo residentes');
            }
        });
    }
    // Actualizar residente
    updateResident(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const resident = yield prisma.resident.update({
                    where: { id },
                    data,
                    include: {
                        property: {
                            select: { unitNumber: true }
                        }
                    }
                });
                return resident;
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error actualizando residente:', error);
                throw new Error('Error actualizando residente');
            }
        });
    }
    /**
     * SERVICIOS COMUNES
     */
    // Obtener servicios de un complejo
    getServices(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const services = yield prisma.commonService.findMany({
                    where: { complexId },
                    include: {
                        _count: {
                            select: { reservations: true }
                        }
                    },
                    orderBy: { name: 'asc' }
                });
                return services;
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error obteniendo servicios:', error);
                throw new Error('Error obteniendo servicios');
            }
        });
    }
    /**
     * ESTADÍSTICAS GENERALES
     */
    // Obtener estadísticas de inventario del complejo
    getInventoryStats(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            const prisma = getPrisma();
            try {
                const [totalProperties, occupiedProperties, totalResidents, totalPets, totalVehicles, totalServices] = yield Promise.all([
                    prisma.property.count({ where: { complexId } }),
                    prisma.property.count({ where: { complexId, status: 'OCCUPIED' } }),
                    prisma.resident.count({
                        where: {
                            property: { complexId },
                            status: 'ACTIVE'
                        }
                    }),
                    prisma.pet.count({ where: { property: { complexId } } }),
                    prisma.vehicle.count({ where: { property: { complexId } } }),
                    prisma.commonService.count({ where: { complexId } })
                ]);
                const occupancyRate = totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0;
                return {
                    properties: {
                        total: totalProperties,
                        occupied: occupiedProperties,
                        available: totalProperties - occupiedProperties,
                        occupancyRate: Math.round(occupancyRate * 100) / 100
                    },
                    residents: {
                        total: totalResidents,
                        averagePerProperty: totalProperties > 0 ? Math.round((totalResidents / totalProperties) * 100) / 100 : 0
                    },
                    pets: {
                        total: totalPets,
                        averagePerProperty: totalProperties > 0 ? Math.round((totalPets / totalProperties) * 100) / 100 : 0
                    },
                    vehicles: {
                        total: totalVehicles,
                        averagePerProperty: totalProperties > 0 ? Math.round((totalVehicles / totalProperties) * 100) / 100 : 0
                    },
                    services: {
                        total: totalServices
                    }
                };
            }
            catch (error) {
                console.error('[INVENTORY SERVICE] Error obteniendo estadísticas:', error);
                throw new Error('Error obteniendo estadísticas de inventario');
            }
        });
    }
}
// Instancia singleton
export const inventoryService = new InventoryServiceRefactored();
