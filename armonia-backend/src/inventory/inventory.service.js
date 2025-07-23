"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
var common_1 = require("@nestjs/common");
var InventoryService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var InventoryService = _classThis = /** @class */ (function () {
        function InventoryService_1(prismaClientManager, prisma) {
            this.prismaClientManager = prismaClientManager;
            this.prisma = prisma;
        }
        InventoryService_1.prototype.getTenantPrismaClient = function (schemaName) {
            return this.prismaClientManager.getClient(schemaName);
        };
        // PROPIEDADES
        InventoryService_1.prototype.getProperties = function (schemaName, complexId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, properties, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.property.findMany({
                                    where: { complexId: complexId },
                                    include: {
                                        owner: {
                                            select: { id: true, name: true, email: true },
                                        },
                                        residents: {
                                            select: { id: true },
                                            where: { status: 'ACTIVE' },
                                        },
                                    },
                                    orderBy: { unitNumber: 'asc' },
                                })];
                        case 2:
                            properties = _a.sent();
                            return [2 /*return*/, properties.map(function (property) {
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
                                        updatedAt: property.updatedAt,
                                    });
                                })];
                        case 3:
                            error_1 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error obteniendo propiedades:', error_1);
                            throw new Error('Error obteniendo propiedades');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        InventoryService_1.prototype.createProperty = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, property, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.property.create({
                                    data: {
                                        complexId: data.complexId,
                                        unitNumber: data.unitNumber,
                                        type: data.type,
                                        status: data.status,
                                        area: data.area,
                                        block: data.block,
                                        zone: data.zone,
                                        ownerId: data.ownerId,
                                    },
                                    include: {
                                        owner: {
                                            select: { id: true, name: true, email: true },
                                        },
                                    },
                                })];
                        case 2:
                            property = _a.sent();
                            return [2 /*return*/, property];
                        case 3:
                            error_2 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error creando propiedad:', error_2);
                            throw new Error('Error creando propiedad');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        InventoryService_1.prototype.updateProperty = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, property, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.property.update({
                                    where: { id: id },
                                    data: data,
                                    include: {
                                        owner: {
                                            select: { id: true, name: true, email: true },
                                        },
                                    },
                                })];
                        case 2:
                            property = _a.sent();
                            return [2 /*return*/, property];
                        case 3:
                            error_3 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error actualizando propiedad:', error_3);
                            throw new Error('Error actualizando propiedad');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // MASCOTAS
        InventoryService_1.prototype.getPets = function (schemaName, complexId, propertyId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, whereClause, pets, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            whereClause = {
                                property: { complexId: complexId },
                            };
                            if (propertyId) {
                                whereClause.propertyId = propertyId;
                            }
                            return [4 /*yield*/, prisma.pet.findMany({
                                    where: whereClause,
                                    include: {
                                        property: {
                                            select: { id: true, unitNumber: true },
                                        },
                                        resident: {
                                            select: { id: true, name: true },
                                        },
                                    },
                                    orderBy: { name: 'asc' },
                                })];
                        case 2:
                            pets = _a.sent();
                            return [2 /*return*/, pets.map(function (pet) { return ({
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
                                    createdAt: pet.createdAt,
                                }); })];
                        case 3:
                            error_4 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error obteniendo mascotas:', error_4);
                            throw new Error('Error obteniendo mascotas');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        InventoryService_1.prototype.createPet = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, pet, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.pet.create({
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
                                        vaccineExpiryDate: data.vaccineExpiryDate
                                            ? new Date(data.vaccineExpiryDate)
                                            : null,
                                        notes: data.notes,
                                    },
                                    include: {
                                        property: {
                                            select: { unitNumber: true },
                                        },
                                        resident: {
                                            select: { name: true },
                                        },
                                    },
                                })];
                        case 2:
                            pet = _a.sent();
                            return [2 /*return*/, pet];
                        case 3:
                            error_5 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error creando mascota:', error_5);
                            throw new Error('Error creando mascota');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // VEHÍCULOS
        InventoryService_1.prototype.getVehicles = function (schemaName, complexId, propertyId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, whereClause, vehicles, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            whereClause = {
                                property: { complexId: complexId },
                            };
                            if (propertyId) {
                                whereClause.propertyId = propertyId;
                            }
                            return [4 /*yield*/, prisma.vehicle.findMany({
                                    where: whereClause,
                                    include: {
                                        property: {
                                            select: { id: true, unitNumber: true },
                                        },
                                        resident: {
                                            select: { id: true, name: true },
                                        },
                                    },
                                    orderBy: { licensePlate: 'asc' },
                                })];
                        case 2:
                            vehicles = _a.sent();
                            return [2 /*return*/, vehicles.map(function (vehicle) { return ({
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
                                    createdAt: vehicle.createdAt,
                                }); })];
                        case 3:
                            error_6 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error obteniendo vehículos:', error_6);
                            throw new Error('Error obteniendo vehículos');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        InventoryService_1.prototype.createVehicle = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, vehicle, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.vehicle.create({
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
                                        residentId: data.residentId,
                                    },
                                    include: {
                                        property: {
                                            select: { unitNumber: true },
                                        },
                                        resident: {
                                            select: { name: true },
                                        },
                                    },
                                })];
                        case 2:
                            vehicle = _a.sent();
                            return [2 /*return*/, vehicle];
                        case 3:
                            error_7 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error creando vehículo:', error_7);
                            throw new Error('Error creando vehículo');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // RESIDENTES
        InventoryService_1.prototype.getResidents = function (schemaName, complexId, propertyId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, whereClause, residents, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            whereClause = {
                                property: { complexId: complexId },
                            };
                            if (propertyId) {
                                whereClause.propertyId = propertyId;
                            }
                            return [4 /*yield*/, prisma.resident.findMany({
                                    where: whereClause,
                                    include: {
                                        property: {
                                            select: { id: true, unitNumber: true, type: true },
                                        },
                                        pets: {
                                            select: { id: true, name: true, type: true },
                                        },
                                        vehicles: {
                                            select: { id: true, licensePlate: true, brand: true, model: true },
                                        },
                                    },
                                    orderBy: { name: 'asc' },
                                })];
                        case 2:
                            residents = _a.sent();
                            return [2 /*return*/, residents];
                        case 3:
                            error_8 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error obteniendo residentes:', error_8);
                            throw new Error('Error obteniendo residentes');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        InventoryService_1.prototype.updateResident = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, resident, error_9;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.resident.update({
                                    where: { id: id },
                                    data: data,
                                    include: {
                                        property: {
                                            select: { unitNumber: true },
                                        },
                                    },
                                })];
                        case 2:
                            resident = _a.sent();
                            return [2 /*return*/, resident];
                        case 3:
                            error_9 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error actualizando residente:', error_9);
                            throw new Error('Error actualizando residente');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        InventoryService_1.prototype.createResident = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, resident, error_10;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.resident.create({
                                    data: __assign(__assign({}, data), { createdAt: new Date(), updatedAt: new Date() }),
                                })];
                        case 2:
                            resident = _a.sent();
                            return [2 /*return*/, resident];
                        case 3:
                            error_10 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error creando residente:', error_10);
                            throw new Error('Error creando residente');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        InventoryService_1.prototype.deleteResident = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, error_11;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.resident.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_11 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error eliminando residente:', error_11);
                            throw new Error('Error eliminando residente');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // SERVICIOS COMUNES
        InventoryService_1.prototype.getServices = function (schemaName, complexId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, services, error_12;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.commonService.findMany({
                                    where: { complexId: complexId },
                                    include: {
                                        _count: {
                                            select: { reservations: true },
                                        },
                                    },
                                    orderBy: { name: 'asc' },
                                })];
                        case 2:
                            services = _a.sent();
                            return [2 /*return*/, services];
                        case 3:
                            error_12 = _a.sent();
                            console.error('[INVENTORY SERVICE] Error obteniendo servicios:', error_12);
                            throw new Error('Error obteniendo servicios');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // ESTADÍSTICAS GENERALES
        InventoryService_1.prototype.getInventoryStats = function (schemaName, complexId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, _a, totalProperties, occupiedProperties, totalResidents, totalPets, totalVehicles, totalServices, occupancyRate, error_13;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, Promise.all([
                                    prisma.property.count({ where: { complexId: complexId } }),
                                    prisma.property.count({ where: { complexId: complexId, status: 'OCCUPIED' } }),
                                    prisma.resident.count({
                                        where: {
                                            property: { complexId: complexId },
                                            status: 'ACTIVE',
                                        },
                                    }),
                                    prisma.pet.count({ where: { property: { complexId: complexId } } }),
                                    prisma.vehicle.count({ where: { property: { complexId: complexId } } }),
                                    prisma.commonService.count({ where: { complexId: complexId } }),
                                ])];
                        case 2:
                            _a = _b.sent(), totalProperties = _a[0], occupiedProperties = _a[1], totalResidents = _a[2], totalPets = _a[3], totalVehicles = _a[4], totalServices = _a[5];
                            occupancyRate = totalProperties > 0 ? (occupiedProperties / totalProperties) * 100 : 0;
                            return [2 /*return*/, {
                                    properties: {
                                        total: totalProperties,
                                        occupied: occupiedProperties,
                                        available: totalProperties - occupiedProperties,
                                        occupancyRate: Math.round(occupancyRate * 100) / 100,
                                    },
                                    residents: {
                                        total: totalResidents,
                                        averagePerProperty: totalProperties > 0
                                            ? Math.round((totalResidents / totalProperties) * 100) / 100
                                            : 0,
                                    },
                                    pets: {
                                        total: totalPets,
                                        averagePerProperty: totalProperties > 0
                                            ? Math.round((totalPets / totalProperties) * 100) / 100
                                            : 0,
                                    },
                                    vehicles: {
                                        total: totalVehicles,
                                        averagePerProperty: totalProperties > 0
                                            ? Math.round((totalVehicles / totalProperties) * 100) / 100
                                            : 0,
                                    },
                                    services: {
                                        total: totalServices,
                                    },
                                }];
                        case 3:
                            error_13 = _b.sent();
                            console.error('[INVENTORY SERVICE] Error obteniendo estadísticas:', error_13);
                            throw new Error('Error obteniendo estadísticas de inventario');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // Common Area Management
        InventoryService_1.prototype.createCommonArea = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.commonArea.create({ data: data })];
                });
            });
        };
        InventoryService_1.prototype.getCommonAreas = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.commonArea.findMany()];
                });
            });
        };
        InventoryService_1.prototype.getCommonAreaById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, commonArea;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.commonArea.findUnique({ where: { id: id } })];
                        case 1:
                            commonArea = _a.sent();
                            if (!commonArea) {
                                throw new common_1.NotFoundException("\u00C1rea com\u00FAn con ID ".concat(id, " no encontrada."));
                            }
                            return [2 /*return*/, commonArea];
                    }
                });
            });
        };
        InventoryService_1.prototype.updateCommonArea = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, commonArea;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.commonArea.findUnique({ where: { id: id } })];
                        case 1:
                            commonArea = _a.sent();
                            if (!commonArea) {
                                throw new common_1.NotFoundException("\u00C1rea com\u00FAn con ID ".concat(id, " no encontrada."));
                            }
                            return [2 /*return*/, prisma.commonArea.update({ where: { id: id }, data: data })];
                    }
                });
            });
        };
        InventoryService_1.prototype.deleteCommonArea = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, commonArea;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.commonArea.findUnique({ where: { id: id } })];
                        case 1:
                            commonArea = _a.sent();
                            if (!commonArea) {
                                throw new common_1.NotFoundException("\u00C1rea com\u00FAn con ID ".concat(id, " no encontrada."));
                            }
                            return [4 /*yield*/, prisma.commonArea.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Parking Spot Management
        InventoryService_1.prototype.createParkingSpot = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.parkingSpot.create({ data: data })];
                });
            });
        };
        InventoryService_1.prototype.getParkingSpots = function (schemaName, complexId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.parkingSpot.findMany({ where: { complexId: complexId } })];
                });
            });
        };
        InventoryService_1.prototype.getParkingSpotById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, parkingSpot;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.parkingSpot.findUnique({ where: { id: id } })];
                        case 1:
                            parkingSpot = _a.sent();
                            if (!parkingSpot) {
                                throw new common_1.NotFoundException("Espacio de estacionamiento con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, parkingSpot];
                    }
                });
            });
        };
        InventoryService_1.prototype.updateParkingSpot = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, parkingSpot;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.parkingSpot.findUnique({ where: { id: id } })];
                        case 1:
                            parkingSpot = _a.sent();
                            if (!parkingSpot) {
                                throw new common_1.NotFoundException("Espacio de estacionamiento con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, prisma.parkingSpot.update({ where: { id: id }, data: data })];
                    }
                });
            });
        };
        InventoryService_1.prototype.deleteParkingSpot = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, parkingSpot;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.parkingSpot.findUnique({ where: { id: id } })];
                        case 1:
                            parkingSpot = _a.sent();
                            if (!parkingSpot) {
                                throw new common_1.NotFoundException("Espacio de estacionamiento con ID ".concat(id, " no encontrado."));
                            }
                            return [4 /*yield*/, prisma.parkingSpot.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return InventoryService_1;
    }());
    __setFunctionName(_classThis, "InventoryService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InventoryService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InventoryService = _classThis;
}();
exports.InventoryService = InventoryService;
