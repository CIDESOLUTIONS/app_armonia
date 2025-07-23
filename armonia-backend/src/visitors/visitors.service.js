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
exports.VisitorsService = void 0;
var common_1 = require("@nestjs/common");
var visitors_dto_1 = require("../common/dto/visitors.dto");
var VisitorsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VisitorsService = _classThis = /** @class */ (function () {
        function VisitorsService_1(prismaClientManager, prisma) {
            this.prismaClientManager = prismaClientManager;
            this.prisma = prisma;
        }
        VisitorsService_1.prototype.getTenantPrismaClient = function (schemaName) {
            // The global PrismaService instance already has access to all schemas
            // via the @@schema("tenant") directive. We just need to ensure we're
            // using the correct client instance.
            return this.prismaClientManager.getClient(schemaName);
        };
        VisitorsService_1.prototype.createVisitor = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.visitor.create({
                            data: __assign(__assign({}, data), { entryTime: new Date().toISOString(), status: visitors_dto_1.VisitorStatus.ACTIVE }),
                        })];
                });
            });
        };
        VisitorsService_1.prototype.getVisitors = function (schemaName, filters) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, where;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    where = {};
                    if (filters.search) {
                        where.OR = [
                            { name: { contains: filters.search, mode: 'insensitive' } },
                            { documentNumber: { contains: filters.search, mode: 'insensitive' } },
                            { destination: { contains: filters.search, mode: 'insensitive' } },
                            { residentName: { contains: filters.search, mode: 'insensitive' } },
                            { plate: { contains: filters.search, mode: 'insensitive' } },
                        ];
                    }
                    if (filters.status) {
                        where.status = filters.status;
                    }
                    if (filters.documentType) {
                        where.documentType = filters.documentType;
                    }
                    if (filters.documentNumber) {
                        where.documentNumber = filters.documentNumber;
                    }
                    if (filters.destination) {
                        where.destination = filters.destination;
                    }
                    if (filters.residentName) {
                        where.residentName = filters.residentName;
                    }
                    if (filters.plate) {
                        where.plate = filters.plate;
                    }
                    return [2 /*return*/, prisma.visitor.findMany({
                            where: where,
                            skip: (((_a = filters.page) !== null && _a !== void 0 ? _a : 1) - 1) * ((_b = filters.limit) !== null && _b !== void 0 ? _b : 10),
                            take: (_c = filters.limit) !== null && _c !== void 0 ? _c : 10,
                            orderBy: { entryTime: 'desc' },
                        })];
                });
            });
        };
        VisitorsService_1.prototype.getVisitorById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, visitor;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.visitor.findUnique({ where: { id: id } })];
                        case 1:
                            visitor = _a.sent();
                            if (!visitor) {
                                throw new common_1.NotFoundException("Visitante con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, visitor];
                    }
                });
            });
        };
        VisitorsService_1.prototype.updateVisitor = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, visitor;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.visitor.findUnique({ where: { id: id } })];
                        case 1:
                            visitor = _a.sent();
                            if (!visitor) {
                                throw new common_1.NotFoundException("Visitante con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, prisma.visitor.update({
                                    where: { id: id },
                                    data: data,
                                })];
                    }
                });
            });
        };
        VisitorsService_1.prototype.deleteVisitor = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.visitor.delete({ where: { id: id } })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        VisitorsService_1.prototype.scanQrCode = function (schemaName, qrCode) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, now, preRegisteredVisitor, newVisitor, accessPass, newVisitor;
                var _a, _b, _c, _d, _e, _f, _g;
                return __generator(this, function (_h) {
                    switch (_h.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            now = new Date();
                            return [4 /*yield*/, prisma.preRegisteredVisitor.findFirst({
                                    where: {
                                        qrCodeUrl: qrCode, // Assuming qrCode is the URL or contains the ID
                                        status: visitors_dto_1.PreRegistrationStatus.ACTIVE,
                                        validFrom: { lte: now },
                                        validUntil: { gte: now },
                                    },
                                    include: { resident: true, property: true },
                                })];
                        case 1:
                            preRegisteredVisitor = _h.sent();
                            if (!preRegisteredVisitor) return [3 /*break*/, 4];
                            return [4 /*yield*/, prisma.visitor.create({
                                    data: {
                                        name: preRegisteredVisitor.name,
                                        documentType: preRegisteredVisitor.documentType || visitors_dto_1.VisitorDocumentType.OTHER,
                                        documentNumber: preRegisteredVisitor.documentNumber || 'N/A',
                                        complexId: preRegisteredVisitor.complexId,
                                        propertyId: preRegisteredVisitor.propertyId,
                                        residentId: preRegisteredVisitor.residentId,
                                        entryTime: now.toISOString(),
                                        status: visitors_dto_1.VisitorStatus.ACTIVE,
                                        preRegisterId: preRegisteredVisitor.id,
                                        purpose: preRegisteredVisitor.purpose,
                                        registeredBy: preRegisteredVisitor.residentId, // Assuming resident who pre-registered is the one registering
                                    },
                                })];
                        case 2:
                            newVisitor = _h.sent();
                            // Update pre-registration status to USED if it's a single-use pass
                            // This logic might need to be more complex based on AccessPassType
                            return [4 /*yield*/, prisma.preRegisteredVisitor.update({
                                    where: { id: preRegisteredVisitor.id },
                                    data: { status: visitors_dto_1.PreRegistrationStatus.USED },
                                })];
                        case 3:
                            // Update pre-registration status to USED if it's a single-use pass
                            // This logic might need to be more complex based on AccessPassType
                            _h.sent();
                            return [2 /*return*/, newVisitor];
                        case 4: return [4 /*yield*/, prisma.accessPass.findFirst({
                                where: {
                                    qrUrl: qrCode, // Assuming qrCode is the URL or contains the ID
                                    status: 'ACTIVE', // Assuming AccessPassStatus.ACTIVE
                                    validFrom: { lte: now },
                                    validUntil: { gte: now },
                                },
                                include: { preRegister: { include: { resident: true, property: true } } },
                            })];
                        case 5:
                            accessPass = _h.sent();
                            if (!accessPass) return [3 /*break*/, 8];
                            return [4 /*yield*/, prisma.visitor.create({
                                    data: {
                                        name: ((_a = accessPass.preRegister) === null || _a === void 0 ? void 0 : _a.name) || 'Visitante con Pase',
                                        documentType: ((_b = accessPass.preRegister) === null || _b === void 0 ? void 0 : _b.documentType) || visitors_dto_1.VisitorDocumentType.OTHER,
                                        documentNumber: ((_c = accessPass.preRegister) === null || _c === void 0 ? void 0 : _c.documentNumber) || 'N/A',
                                        complexId: ((_d = accessPass.preRegister) === null || _d === void 0 ? void 0 : _d.complexId) || 0, // Adjust as needed
                                        propertyId: ((_e = accessPass.preRegister) === null || _e === void 0 ? void 0 : _e.propertyId) || 0, // Adjust as needed
                                        residentId: (_f = accessPass.preRegister) === null || _f === void 0 ? void 0 : _f.residentId,
                                        entryTime: now.toISOString(),
                                        status: visitors_dto_1.VisitorStatus.ACTIVE,
                                        accessPassId: accessPass.id,
                                        registeredBy: ((_g = accessPass.preRegister) === null || _g === void 0 ? void 0 : _g.residentId) || 0, // Assuming resident who pre-registered is the one registering
                                    },
                                })];
                        case 6:
                            newVisitor = _h.sent();
                            // Update access pass usage count and status
                            return [4 /*yield*/, prisma.accessPass.update({
                                    where: { id: accessPass.id },
                                    data: {
                                        usageCount: { increment: 1 },
                                        status: accessPass.maxUsages === 1 ? 'USED' : 'ACTIVE', // Assuming AccessPassStatus.USED
                                    },
                                })];
                        case 7:
                            // Update access pass usage count and status
                            _h.sent();
                            return [2 /*return*/, newVisitor];
                        case 8: throw new common_1.NotFoundException('QR Code inválido o visitante/pase no encontrado.');
                    }
                });
            });
        };
        VisitorsService_1.prototype.getPreRegisteredVisitors = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, now, preRegistered;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            now = new Date();
                            return [4 /*yield*/, prisma.preRegisteredVisitor.findMany({
                                    where: {
                                        status: visitors_dto_1.PreRegistrationStatus.ACTIVE,
                                        validUntil: { gte: now },
                                    },
                                    include: { resident: true, property: true },
                                })];
                        case 1:
                            preRegistered = _a.sent();
                            return [2 /*return*/, preRegistered.map(function (pr) { return ({
                                    id: pr.id,
                                    name: pr.name,
                                    documentType: pr.documentType || visitors_dto_1.VisitorDocumentType.OTHER,
                                    documentNumber: pr.documentNumber || 'N/A',
                                    destination: pr.property.unitNumber, // Assuming property unitNumber is the destination
                                    residentName: pr.resident.name, // Assuming resident name
                                    entryTime: pr.expectedDate.toISOString(), // Using expectedDate as entryTime for pre-registered
                                    status: visitors_dto_1.VisitorStatus.ACTIVE, // Or a specific pre-registered status
                                    plate: null, // Not available in pre-registration
                                    photoUrl: null, // Not available in pre-registration
                                    notes: pr.purpose, // Using purpose as notes
                                    preRegisterId: pr.id,
                                    accessPassId: null,
                                    purpose: pr.purpose,
                                    company: null,
                                    temperature: null,
                                    belongings: null,
                                    signature: null,
                                    registeredBy: pr.residentId,
                                    createdAt: pr.createdAt.toISOString(),
                                    updatedAt: pr.updatedAt.toISOString(),
                                }); })];
                    }
                });
            });
        };
        return VisitorsService_1;
    }());
    __setFunctionName(_classThis, "VisitorsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VisitorsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VisitorsService = _classThis;
}();
exports.VisitorsService = VisitorsService;
