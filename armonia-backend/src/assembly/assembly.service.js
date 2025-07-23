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
exports.AssemblyService = void 0;
var common_1 = require("@nestjs/common");
var assembly_dto_1 = require("../common/dto/assembly.dto");
var server_logger_1 = require("../lib/logging/server-logger");
var assembly_notifications_1 = require("../communications/integrations/assembly-notifications");
var AssemblyService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AssemblyService = _classThis = /** @class */ (function () {
        function AssemblyService_1(prismaClientManager, prisma, activityLogger, wsService, signatureService) {
            this.prismaClientManager = prismaClientManager;
            this.prisma = prisma;
            this.activityLogger = activityLogger;
            this.wsService = wsService;
            this.signatureService = signatureService;
        }
        AssemblyService_1.prototype.getTenantPrismaClient = function (schemaName) {
            return this.prismaClientManager.getClient(schemaName);
        };
        AssemblyService_1.prototype.createAssembly = function (schemaName, data, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, realtimeChannel, assembly, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            realtimeChannel = "assembly-".concat(Date.now(), "-").concat(Math.floor(Math.random() * 1000));
                            return [4 /*yield*/, prisma.assembly.create({
                                    data: __assign(__assign({}, data), { status: assembly_dto_1.AssemblyStatus.SCHEDULED, realtimeChannel: realtimeChannel, createdBy: userId }),
                                })];
                        case 2:
                            assembly = _a.sent();
                            return [4 /*yield*/, this.activityLogger.logActivity({
                                    userId: userId,
                                    action: 'CREATE_ASSEMBLY',
                                    resourceType: 'ASSEMBLY',
                                    resourceId: assembly.id,
                                    details: {
                                        title: assembly.title,
                                        date: assembly.scheduledDate,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, (0, assembly_notifications_1.notifyAssemblyConvocation)(assembly.id, assembly.title, assembly.scheduledDate, assembly.location)];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, assembly];
                        case 5:
                            error_1 = _a.sent();
                            if (error_1 instanceof Error) {
                                server_logger_1.ServerLogger.error('Error al crear asamblea avanzada:', error_1.message);
                            }
                            else {
                                server_logger_1.ServerLogger.error('Error al crear asamblea avanzada:', error_1);
                            }
                            throw error_1;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        AssemblyService_1.prototype.getAssemblies = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.assembly.findMany({ orderBy: { scheduledDate: 'desc' } })];
                });
            });
        };
        AssemblyService_1.prototype.getAssemblyById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, assembly;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.assembly.findUnique({ where: { id: id } })];
                        case 1:
                            assembly = _a.sent();
                            if (!assembly) {
                                throw new common_1.NotFoundException("Asamblea con ID ".concat(id, " no encontrada."));
                            }
                            return [2 /*return*/, assembly];
                    }
                });
            });
        };
        AssemblyService_1.prototype.updateAssembly = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.assembly.update({ where: { id: id }, data: data })];
                });
            });
        };
        AssemblyService_1.prototype.deleteAssembly = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.assembly.delete({ where: { id: id } })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        AssemblyService_1.prototype.registerAttendance = function (schemaName, assemblyId, userId, unitId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, assembly, unit, isOwner, isDelegate, existingAttendance, updatedAttendance, attendance, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 9, , 10]);
                            if (!assemblyId || !userId || !unitId) {
                                throw new Error('Se requieren ID de asamblea, usuario y unidad para registrar asistencia');
                            }
                            return [4 /*yield*/, prisma.assembly.findUnique({
                                    where: { id: assemblyId },
                                })];
                        case 2:
                            assembly = _a.sent();
                            if (!assembly) {
                                server_logger_1.ServerLogger.warn("Asamblea no encontrada: ".concat(assemblyId));
                                throw new common_1.NotFoundException('Asamblea no encontrada');
                            }
                            if (assembly.status !== assembly_dto_1.AssemblyStatus.IN_PROGRESS &&
                                assembly.status !== assembly_dto_1.AssemblyStatus.SCHEDULED) {
                                server_logger_1.ServerLogger.warn("Intento de registro en asamblea no activa: ".concat(assemblyId, " (estado: ").concat(assembly.status, ")"));
                                throw new Error("La asamblea no est\u00E1 en progreso (estado actual: ".concat(assembly.status, ")"));
                            }
                            return [4 /*yield*/, prisma.unit.findUnique({
                                    where: { id: unitId },
                                    include: {
                                        owners: true,
                                        delegates: true,
                                    },
                                })];
                        case 3:
                            unit = _a.sent();
                            if (!unit) {
                                server_logger_1.ServerLogger.warn("Unidad no encontrada: ".concat(unitId));
                                throw new common_1.NotFoundException('Unidad no encontrada');
                            }
                            isOwner = unit.owners.some(function (owner) { return owner.id === userId; });
                            isDelegate = unit.delegates.some(function (delegate) { return delegate.id === userId; });
                            if (!isOwner && !isDelegate) {
                                server_logger_1.ServerLogger.warn("Usuario ".concat(userId, " no autorizado para asistir por unidad ").concat(unitId));
                                throw new Error('Usuario no autorizado para asistir por esta unidad');
                            }
                            return [4 /*yield*/, prisma.assemblyAttendance.findFirst({
                                    where: {
                                        assemblyId: assemblyId,
                                        unitId: unitId,
                                    },
                                })];
                        case 4:
                            existingAttendance = _a.sent();
                            if (!existingAttendance) return [3 /*break*/, 7];
                            server_logger_1.ServerLogger.warn("Ya existe registro de asistencia para unidad ".concat(unitId, " en asamblea ").concat(assemblyId));
                            if (!(existingAttendance.userId !== userId)) return [3 /*break*/, 6];
                            return [4 /*yield*/, prisma.assemblyAttendance.update({
                                    where: { id: existingAttendance.id },
                                    data: {
                                        userId: userId,
                                        updatedAt: new Date(),
                                    },
                                })];
                        case 5:
                            updatedAttendance = _a.sent();
                            server_logger_1.ServerLogger.info("Registro de asistencia actualizado para unidad ".concat(unitId, " en asamblea ").concat(assemblyId));
                            return [2 /*return*/, updatedAttendance];
                        case 6: return [2 /*return*/, existingAttendance];
                        case 7: return [4 /*yield*/, prisma.assemblyAttendance.create({
                                data: {
                                    assemblyId: assemblyId,
                                    userId: userId,
                                    unitId: unitId,
                                    checkInTime: new Date(),
                                    notes: '',
                                    proxyName: null,
                                    proxyDocument: null,
                                    isDelegate: isDelegate,
                                    isOwner: isOwner,
                                },
                            })];
                        case 8:
                            attendance = _a.sent();
                            server_logger_1.ServerLogger.info("Registrada asistencia para unidad ".concat(unitId, " en asamblea ").concat(assemblyId));
                            return [2 /*return*/, attendance];
                        case 9:
                            error_2 = _a.sent();
                            if (error_2 instanceof Error) {
                                server_logger_1.ServerLogger.error("Error al registrar asistencia: ".concat(error_2.message));
                            }
                            else {
                                server_logger_1.ServerLogger.error("Error al registrar asistencia: ".concat(error_2));
                            }
                            throw error_2;
                        case 10: return [2 /*return*/];
                    }
                });
            });
        };
        AssemblyService_1.prototype.calculateQuorum = function (schemaName, assemblyId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, assembly_1, totalCoefficients, presentCoefficients, quorumPercentage, requiredQuorum, quorumReached, result, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            if (!assemblyId) {
                                throw new Error('Se requiere un ID de asamblea para calcular quórum');
                            }
                            return [4 /*yield*/, prisma.assembly.findUnique({
                                    where: { id: assemblyId },
                                    include: {
                                        attendees: true,
                                        property: {
                                            include: {
                                                units: true,
                                            },
                                        },
                                    },
                                })];
                        case 2:
                            assembly_1 = _a.sent();
                            if (!assembly_1) {
                                server_logger_1.ServerLogger.warn("Asamblea no encontrada: ".concat(assemblyId));
                                throw new common_1.NotFoundException("Asamblea con ID ".concat(assemblyId, " no encontrada."));
                            }
                            totalCoefficients = assembly_1.property.units.reduce(function (sum, unit) { return sum + (unit.coefficient || 0); }, 0);
                            presentCoefficients = assembly_1.attendees.reduce(function (sum, attendee) {
                                var unit = assembly_1.property.units.find(function (u) { return u.id === attendee.unitId; });
                                return sum + (unit ? unit.coefficient || 0 : 0);
                            }, 0);
                            quorumPercentage = totalCoefficients > 0
                                ? (presentCoefficients / totalCoefficients) * 100
                                : 0;
                            requiredQuorum = assembly_1.requiredQuorum || 50;
                            quorumReached = quorumPercentage >= requiredQuorum;
                            result = {
                                assemblyId: assemblyId,
                                totalUnits: assembly_1.property.units.length,
                                presentUnits: assembly_1.attendees.length,
                                totalCoefficients: totalCoefficients,
                                presentCoefficients: presentCoefficients,
                                quorumPercentage: quorumPercentage,
                                requiredQuorum: requiredQuorum,
                                quorumReached: quorumReached,
                                timestamp: new Date().toISOString(),
                            };
                            server_logger_1.ServerLogger.info("Qu\u00F3rum calculado para asamblea ".concat(assemblyId, ": ").concat(quorumPercentage.toFixed(2), "% (requerido: ").concat(requiredQuorum, "%)"));
                            return [2 /*return*/, result];
                        case 3:
                            error_3 = _a.sent();
                            if (error_3 instanceof Error) {
                                server_logger_1.ServerLogger.error("Error al calcular qu\u00F3rum para asamblea ".concat(assemblyId, ": ").concat(error_3.message));
                            }
                            else {
                                server_logger_1.ServerLogger.error("Error al calcular qu\u00F3rum para asamblea ".concat(assemblyId, ": ").concat(error_3));
                            }
                            throw error_3;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        AssemblyService_1.prototype.createVote = function (schemaName, assemblyId, voteData) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, assembly, vote, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            if (!assemblyId) {
                                throw new Error('Se requiere un ID de asamblea para crear votación');
                            }
                            if (!voteData || !voteData.title || !voteData.description) {
                                throw new Error('Datos de votación incompletos');
                            }
                            return [4 /*yield*/, prisma.assembly.findUnique({
                                    where: { id: assemblyId },
                                })];
                        case 2:
                            assembly = _a.sent();
                            if (!assembly) {
                                server_logger_1.ServerLogger.warn("Asamblea no encontrada: ".concat(assemblyId));
                                throw new common_1.NotFoundException('Asamblea no encontrada');
                            }
                            if (assembly.status !== assembly_dto_1.AssemblyStatus.IN_PROGRESS) {
                                server_logger_1.ServerLogger.warn("Intento de crear votaci\u00F3n en asamblea no activa: ".concat(assemblyId, " (estado: ").concat(assembly.status, ")"));
                                throw new Error("La asamblea no est\u00E1 en progreso (estado actual: ".concat(assembly.status, ")"));
                            }
                            return [4 /*yield*/, prisma.assemblyVote.create({
                                    data: {
                                        assemblyId: assemblyId,
                                        title: voteData.title,
                                        description: voteData.description,
                                        options: voteData.options || ['A favor', 'En contra', 'Abstención'],
                                        startTime: voteData.startTime || new Date(),
                                        endTime: voteData.endTime || null,
                                        status: 'ACTIVE',
                                        weightedVoting: voteData.weightedVoting !== undefined
                                            ? voteData.weightedVoting
                                            : true,
                                        createdBy: voteData.createdBy || 'system',
                                    },
                                })];
                        case 3:
                            vote = _a.sent();
                            server_logger_1.ServerLogger.info("Creada votaci\u00F3n ".concat(vote.id, " para asamblea ").concat(assemblyId));
                            return [2 /*return*/, vote];
                        case 4:
                            error_4 = _a.sent();
                            if (error_4 instanceof Error) {
                                server_logger_1.ServerLogger.error("Error al crear votaci\u00F3n: ".concat(error_4.message));
                            }
                            else {
                                server_logger_1.ServerLogger.error("Error al crear votaci\u00F3n: ".concat(error_4));
                            }
                            throw error_4;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        AssemblyService_1.prototype.castVote = function (schemaName, voteId, userId, unitId, option) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, vote, attendance, existingVote, updatedVote, coefficient, unit, voteRecord, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 11, , 12]);
                            if (!voteId || !userId || !unitId || !option) {
                                throw new Error('Se requieren ID de votación, usuario, unidad y opción para registrar voto');
                            }
                            return [4 /*yield*/, prisma.assemblyVote.findUnique({
                                    where: { id: voteId },
                                    include: {
                                        assembly: true,
                                    },
                                })];
                        case 2:
                            vote = _a.sent();
                            if (!vote) {
                                server_logger_1.ServerLogger.warn("Votaci\u00F3n no encontrada: ".concat(voteId));
                                throw new common_1.NotFoundException('Votación no encontrada');
                            }
                            if (vote.status !== 'ACTIVE') {
                                server_logger_1.ServerLogger.warn("Intento de votar en votaci\u00F3n no activa: ".concat(voteId, " (estado: ").concat(vote.status, ")"));
                                throw new Error("La votaci\u00F3n no est\u00E1 activa (estado actual: ".concat(vote.status, ")"));
                            }
                            if (!vote.options.includes(option)) {
                                server_logger_1.ServerLogger.warn("Opci\u00F3n de voto inv\u00E1lida: ".concat(option));
                                throw new Error('Opción de voto inválida');
                            }
                            return [4 /*yield*/, prisma.assemblyAttendance.findFirst({
                                    where: {
                                        assemblyId: vote.assemblyId,
                                        unitId: unitId,
                                        userId: userId,
                                    },
                                })];
                        case 3:
                            attendance = _a.sent();
                            if (!attendance) {
                                server_logger_1.ServerLogger.warn("Usuario ".concat(userId, " no registrado como asistente para unidad ").concat(unitId));
                                throw new Error('Usuario no registrado como asistente para esta unidad');
                            }
                            return [4 /*yield*/, prisma.assemblyVoteRecord.findFirst({
                                    where: {
                                        voteId: voteId,
                                        unitId: unitId,
                                    },
                                })];
                        case 4:
                            existingVote = _a.sent();
                            if (!existingVote) return [3 /*break*/, 6];
                            server_logger_1.ServerLogger.warn("Ya existe un voto para unidad ".concat(unitId, " en votaci\u00F3n ").concat(voteId));
                            return [4 /*yield*/, prisma.assemblyVoteRecord.update({
                                    where: { id: existingVote.id },
                                    data: {
                                        userId: userId,
                                        option: option,
                                        updatedAt: new Date(),
                                    },
                                })];
                        case 5:
                            updatedVote = _a.sent();
                            server_logger_1.ServerLogger.info("Voto actualizado para unidad ".concat(unitId, " en votaci\u00F3n ").concat(voteId));
                            return [2 /*return*/, updatedVote];
                        case 6:
                            coefficient = 1;
                            if (!vote.weightedVoting) return [3 /*break*/, 8];
                            return [4 /*yield*/, prisma.unit.findUnique({
                                    where: { id: unitId },
                                })];
                        case 7:
                            unit = _a.sent();
                            coefficient = unit ? unit.coefficient || 1 : 1;
                            _a.label = 8;
                        case 8: return [4 /*yield*/, prisma.assemblyVoteRecord.create({
                                data: {
                                    voteId: voteId,
                                    userId: userId,
                                    unitId: unitId,
                                    option: option,
                                    coefficient: coefficient,
                                    timestamp: new Date(),
                                },
                            })];
                        case 9:
                            voteRecord = _a.sent();
                            server_logger_1.ServerLogger.info("Registrado voto para unidad ".concat(unitId, " en votaci\u00F3n ").concat(voteId));
                            return [4 /*yield*/, this.calculateVoteResults(schemaName, voteId)];
                        case 10:
                            _a.sent();
                            return [2 /*return*/, voteRecord];
                        case 11:
                            error_5 = _a.sent();
                            if (error_5 instanceof Error) {
                                server_logger_1.ServerLogger.error("Error al registrar voto: ".concat(error_5.message));
                            }
                            else {
                                server_logger_1.ServerLogger.error("Error al registrar voto: ".concat(error_5));
                            }
                            throw error_5;
                        case 12: return [2 /*return*/];
                    }
                });
            });
        };
        AssemblyService_1.prototype.calculateVoteResults = function (schemaName, voteId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, vote, voteRecords, results_1, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 4, , 5]);
                            if (!voteId) {
                                throw new Error('Se requiere un ID de votación para calcular resultados');
                            }
                            return [4 /*yield*/, prisma.assemblyVote.findUnique({
                                    where: { id: voteId },
                                })];
                        case 2:
                            vote = _a.sent();
                            if (!vote) {
                                server_logger_1.ServerLogger.warn("Votaci\u00F3n no encontrada: ".concat(voteId));
                                throw new common_1.NotFoundException("Votaci\u00F3n con ID ".concat(voteId, " no encontrada."));
                            }
                            return [4 /*yield*/, prisma.assemblyVoteRecord.findMany({
                                    where: { voteId: voteId },
                                })];
                        case 3:
                            voteRecords = _a.sent();
                            results_1 = {
                                voteId: voteId,
                                title: vote.title,
                                totalVotes: voteRecords.length,
                                totalWeight: 0,
                                options: {},
                                timestamp: new Date().toISOString(),
                            };
                            vote.options.forEach(function (option) {
                                results_1.options[option] = {
                                    count: 0,
                                    weight: 0,
                                    percentage: 0,
                                };
                            });
                            Object.keys(results_1.options).forEach(function (option) {
                                results_1.options[option] = {
                                    count: 0,
                                    weight: 0,
                                    percentage: 0,
                                };
                            });
                            voteRecords.forEach(function (record) {
                                var option = record.option;
                                if (results_1.options[option]) {
                                    results_1.options[option].count++;
                                    results_1.options[option].weight += record.coefficient || 1;
                                    results_1.totalWeight += record.coefficient || 1;
                                }
                            });
                            if (results_1.totalWeight > 0) {
                                Object.keys(results_1.options).forEach(function (option) {
                                    results_1.options[option].percentage =
                                        (results_1.options[option].weight / results_1.totalWeight) * 100;
                                });
                            }
                            server_logger_1.ServerLogger.info("Resultados calculados para votaci\u00F3n ".concat(voteId));
                            return [2 /*return*/, results_1];
                        case 4:
                            error_6 = _a.sent();
                            if (error_6 instanceof Error) {
                                server_logger_1.ServerLogger.error("Error al calcular resultados de votaci\u00F3n ".concat(voteId, ": ").concat(error_6.message));
                            }
                            else {
                                server_logger_1.ServerLogger.error("Error al calcular resultados de votaci\u00F3n ".concat(voteId, ": ").concat(error_6));
                            }
                            throw error_6;
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        AssemblyService_1.prototype.endVote = function (schemaName, voteId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, vote, updatedVote, results, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 6, , 7]);
                            if (!voteId) {
                                throw new Error('Se requiere un ID de votación para finalizar');
                            }
                            return [4 /*yield*/, prisma.assemblyVote.findUnique({
                                    where: { id: voteId },
                                })];
                        case 2:
                            vote = _a.sent();
                            if (!vote) {
                                server_logger_1.ServerLogger.warn("Votaci\u00F3n no encontrada: ".concat(voteId));
                                throw new common_1.NotFoundException('Votación no encontrada');
                            }
                            if (vote.status !== 'ACTIVE') {
                                server_logger_1.ServerLogger.warn("Intento de finalizar votaci\u00F3n no activa: ".concat(voteId, " (estado: ").concat(vote.status, ")"));
                                throw new Error("La votaci\u00F3n no est\u00E1 activa (estado actual: ".concat(vote.status, ")"));
                            }
                            return [4 /*yield*/, prisma.assemblyVote.update({
                                    where: { id: voteId },
                                    data: {
                                        status: 'COMPLETED',
                                        endTime: new Date(),
                                    },
                                })];
                        case 3:
                            updatedVote = _a.sent();
                            server_logger_1.ServerLogger.info("Finalizada votaci\u00F3n ".concat(voteId));
                            return [4 /*yield*/, this.calculateVoteResults(schemaName, voteId)];
                        case 4:
                            results = _a.sent();
                            return [4 /*yield*/, prisma.assemblyVote.update({
                                    where: { id: voteId },
                                    data: {
                                        results: results,
                                    },
                                })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {
                                    vote: updatedVote,
                                    results: results,
                                }];
                        case 6:
                            error_7 = _a.sent();
                            if (error_7 instanceof Error) {
                                server_logger_1.ServerLogger.error("Error al finalizar votaci\u00F3n ".concat(voteId, ": ").concat(error_7.message));
                            }
                            else {
                                server_logger_1.ServerLogger.error("Error al finalizar votaci\u00F3n ".concat(voteId, ": ").concat(error_7));
                            }
                            throw error_7;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        AssemblyService_1.prototype.generateMeetingMinutes = function (schemaName, assemblyId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, assembly, quorum, minutesData, minutes, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            if (!assemblyId) {
                                throw new Error('Se requiere un ID de asamblea para generar acta');
                            }
                            return [4 /*yield*/, prisma.assembly.findUnique({
                                    where: { id: assemblyId },
                                    include: {
                                        property: true,
                                        attendees: {
                                            include: {
                                                user: true,
                                                unit: true,
                                            },
                                        },
                                        votes: {
                                            include: {
                                                voteRecords: true,
                                            },
                                        },
                                        topics: true,
                                    },
                                })];
                        case 2:
                            assembly = _a.sent();
                            if (!assembly) {
                                server_logger_1.ServerLogger.warn("Asamblea no encontrada: ".concat(assemblyId));
                                throw new common_1.NotFoundException('Asamblea no encontrada');
                            }
                            return [4 /*yield*/, this.calculateQuorum(schemaName, assemblyId)];
                        case 3:
                            quorum = _a.sent();
                            minutesData = {
                                assemblyId: assemblyId,
                                title: "Acta de Asamblea: ".concat(assembly.title),
                                date: assembly.scheduledDate,
                                location: assembly.location,
                                property: assembly.property.name,
                                quorum: quorum,
                                attendees: assembly.attendees.map(function (a) { return ({
                                    name: "".concat(a.user.firstName, " ").concat(a.user.lastName),
                                    unit: a.unit.name,
                                    coefficient: a.unit.coefficient || 0,
                                    checkInTime: a.checkInTime,
                                }); }),
                                topics: assembly.topics.map(function (t) { return ({
                                    title: t.title,
                                    description: t.description,
                                    decisions: t.decisions || 'Sin decisiones registradas',
                                }); }),
                                votes: assembly.votes.map(function (v) {
                                    var results = {};
                                    v.options.forEach(function (option) {
                                        results[option] = {
                                            count: 0,
                                            weight: 0,
                                        };
                                    });
                                    v.voteRecords.forEach(function (record) {
                                        if (results[record.option]) {
                                            results[record.option].count++;
                                            results[record.option].weight += record.coefficient || 1;
                                        }
                                    });
                                    return {
                                        title: v.title,
                                        description: v.description,
                                        options: v.options,
                                        results: results,
                                        startTime: v.startTime,
                                        endTime: v.endTime || new Date(),
                                    };
                                }),
                                conclusions: assembly.conclusions || 'Sin conclusiones registradas',
                                generatedAt: new Date().toISOString(),
                            };
                            return [4 /*yield*/, prisma.assemblyMinutes.create({
                                    data: {
                                        assemblyId: assemblyId,
                                        content: minutesData,
                                        generatedBy: 'system',
                                        status: 'DRAFT',
                                    },
                                })];
                        case 4:
                            minutes = _a.sent();
                            server_logger_1.ServerLogger.info("Acta generada para asamblea ".concat(assemblyId, ": ").concat(minutes.id));
                            // PDFKit related code commented out due to import issues
                            return [2 /*return*/, Buffer.from('PDF generation temporarily disabled')];
                        case 5:
                            error_8 = _a.sent();
                            if (error_8 instanceof Error) {
                                server_logger_1.ServerLogger.error("Error al generar acta para asamblea ".concat(assemblyId, ": ").concat(error_8.message));
                            }
                            else {
                                server_logger_1.ServerLogger.error("Error al generar acta para asamblea ".concat(assemblyId, ": ").concat(error_8));
                            }
                            throw error_8;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        AssemblyService_1.prototype.getAssemblyQuorumStatus = function (schemaName, assemblyId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, assembly, currentAttendance, quorum, quorumMet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.assembly.findUnique({
                                    where: { id: assemblyId },
                                })];
                        case 1:
                            assembly = _a.sent();
                            if (!assembly) {
                                throw new common_1.NotFoundException("Asamblea con ID ".concat(assemblyId, " no encontrada."));
                            }
                            return [4 /*yield*/, prisma.attendance.count({
                                    where: { assemblyId: assemblyId, present: true },
                                })];
                        case 2:
                            currentAttendance = _a.sent();
                            return [4 /*yield*/, this.calculateQuorum(schemaName, assemblyId)];
                        case 3:
                            quorum = _a.sent();
                            quorumMet = quorum.quorumReached;
                            return [2 /*return*/, { currentAttendance: currentAttendance, quorumMet: quorumMet }];
                    }
                });
            });
        };
        return AssemblyService_1;
    }());
    __setFunctionName(_classThis, "AssemblyService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssemblyService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssemblyService = _classThis;
}();
exports.AssemblyService = AssemblyService;
