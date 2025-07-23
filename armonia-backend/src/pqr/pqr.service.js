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
exports.PqrService = void 0;
var common_1 = require("@nestjs/common");
var PqrService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PqrService = _classThis = /** @class */ (function () {
        function PqrService_1(prismaClientManager, prisma) {
            this.prismaClientManager = prismaClientManager;
            this.prisma = prisma;
        }
        PqrService_1.prototype.getTenantPrismaClient = function (schemaName) {
            return this.prismaClientManager.getClient(schemaName);
        };
        PqrService_1.prototype.getPQRs = function (schemaName, params) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, where, pqrs, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            where = {};
                            if (params === null || params === void 0 ? void 0 : params.status)
                                where.status = params.status;
                            if (params === null || params === void 0 ? void 0 : params.priority)
                                where.priority = params.priority;
                            if (params === null || params === void 0 ? void 0 : params.search) {
                                where.OR = [
                                    { subject: { contains: params.search, mode: 'insensitive' } },
                                    { description: { contains: params.search, mode: 'insensitive' } },
                                ];
                            }
                            return [4 /*yield*/, prisma.pQR.findMany({
                                    where: where,
                                    include: {
                                        reportedBy: { select: { name: true } }, // Usar el modelo User del esquema del tenant
                                        assignedTo: { select: { name: true } }, // Usar el modelo User del esquema del tenant
                                    },
                                })];
                        case 2:
                            pqrs = _a.sent();
                            return [2 /*return*/, pqrs.map(function (pqr) {
                                    var _a, _b;
                                    return (__assign(__assign({}, pqr), { reportedByName: ((_a = pqr.reportedBy) === null || _a === void 0 ? void 0 : _a.name) || 'N/A', assignedToName: ((_b = pqr.assignedTo) === null || _b === void 0 ? void 0 : _b.name) || 'N/A' }));
                                })];
                        case 3:
                            error_1 = _a.sent();
                            console.error('Error fetching PQRs:', error_1);
                            throw new Error('Error fetching PQRs');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PqrService_1.prototype.getPQRById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, pqr, error_2;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _c.label = 1;
                        case 1:
                            _c.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.pQR.findUnique({
                                    where: { id: id },
                                    include: {
                                        reportedBy: { select: { name: true } },
                                        assignedTo: { select: { name: true } },
                                        comments: { include: { author: { select: { name: true } } } },
                                    },
                                })];
                        case 2:
                            pqr = _c.sent();
                            if (!pqr) {
                                throw new Error('PQR no encontrada');
                            }
                            return [2 /*return*/, __assign(__assign({}, pqr), { reportedByName: ((_a = pqr.reportedBy) === null || _a === void 0 ? void 0 : _a.name) || 'N/A', assignedToName: ((_b = pqr.assignedTo) === null || _b === void 0 ? void 0 : _b.name) || 'N/A', comments: pqr.comments.map(function (comment) {
                                        var _a;
                                        return (__assign(__assign({}, comment), { authorName: ((_a = comment.author) === null || _a === void 0 ? void 0 : _a.name) || 'N/A' }));
                                    }) })];
                        case 3:
                            error_2 = _c.sent();
                            console.error("Error fetching PQR with ID ".concat(id, ":"), error_2);
                            throw new Error('Error fetching PQR');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PqrService_1.prototype.createPQR = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, pqr, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.pQR.create({ data: data })];
                        case 2:
                            pqr = _a.sent();
                            return [2 /*return*/, this.getPQRById(schemaName, pqr.id)];
                        case 3:
                            error_3 = _a.sent();
                            console.error('Error creating PQR:', error_3);
                            throw new Error('Error creating PQR');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PqrService_1.prototype.updatePQR = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, pqr, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.pQR.update({ where: { id: id }, data: data })];
                        case 2:
                            pqr = _a.sent();
                            return [2 /*return*/, this.getPQRById(schemaName, pqr.id)];
                        case 3:
                            error_4 = _a.sent();
                            console.error('Error updating PQR:', error_4);
                            throw new Error('Error updating PQR');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PqrService_1.prototype.deletePQR = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.pQR.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            error_5 = _a.sent();
                            console.error('Error deleting PQR:', error_5);
                            throw new Error('Error deleting PQR');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PqrService_1.prototype.addPQRComment = function (schemaName, pqrId, comment, authorId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, pqrComment, error_6;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.pQRComment.create({
                                    data: { pqrId: pqrId, comment: comment, authorId: authorId },
                                    include: { author: { select: { name: true } } }, // Usar el modelo User del esquema del tenant
                                })];
                        case 2:
                            pqrComment = _b.sent();
                            return [2 /*return*/, __assign(__assign({}, pqrComment), { authorName: ((_a = pqrComment.author) === null || _a === void 0 ? void 0 : _a.name) || 'N/A' })];
                        case 3:
                            error_6 = _b.sent();
                            console.error('Error adding PQR comment:', error_6);
                            throw new Error('Error adding PQR comment');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        PqrService_1.prototype.assignPQR = function (schemaName, pqrId, assignedToId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, pqr, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.pQR.update({
                                    where: { id: pqrId },
                                    data: { assignedToId: assignedToId },
                                })];
                        case 2:
                            pqr = _a.sent();
                            return [2 /*return*/, this.getPQRById(schemaName, pqr.id)];
                        case 3:
                            error_7 = _a.sent();
                            console.error('Error assigning PQR:', error_7);
                            throw new Error('Error assigning PQR');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return PqrService_1;
    }());
    __setFunctionName(_classThis, "PqrService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PqrService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PqrService = _classThis;
}();
exports.PqrService = PqrService;
