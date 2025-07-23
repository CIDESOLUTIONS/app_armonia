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
exports.ServiceProvidersService = void 0;
var common_1 = require("@nestjs/common");
var ServiceProvidersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ServiceProvidersService = _classThis = /** @class */ (function () {
        function ServiceProvidersService_1(prismaClientManager, prisma) {
            this.prismaClientManager = prismaClientManager;
            this.prisma = prisma;
        }
        ServiceProvidersService_1.prototype.getTenantPrismaClient = function (schemaName) {
            return this.prismaClientManager.getClient(schemaName);
        };
        ServiceProvidersService_1.prototype.createServiceProvider = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.serviceProvider.create({
                            data: __assign(__assign({}, data), { rating: 0, reviewCount: 0 }),
                        })];
                });
            });
        };
        ServiceProvidersService_1.prototype.getServiceProviders = function (schemaName, filters) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, where;
                var _a, _b, _c;
                return __generator(this, function (_d) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    where = {};
                    if (filters.search) {
                        where.OR = [
                            { name: { contains: filters.search, mode: 'insensitive' } },
                            { description: { contains: filters.search, mode: 'insensitive' } },
                            { category: { contains: filters.search, mode: 'insensitive' } },
                        ];
                    }
                    if (filters.category) {
                        where.category = filters.category;
                    }
                    if (filters.minRating) {
                        where.rating = { gte: filters.minRating };
                    }
                    return [2 /*return*/, prisma.serviceProvider.findMany({
                            where: where,
                            skip: (((_a = filters.page) !== null && _a !== void 0 ? _a : 1) - 1) * ((_b = filters.limit) !== null && _b !== void 0 ? _b : 10),
                            take: (_c = filters.limit) !== null && _c !== void 0 ? _c : 10,
                            orderBy: { name: 'asc' },
                        })];
                });
            });
        };
        ServiceProvidersService_1.prototype.getServiceProviderById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, provider;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.serviceProvider.findUnique({ where: { id: id } })];
                        case 1:
                            provider = _a.sent();
                            if (!provider) {
                                throw new common_1.NotFoundException("Proveedor de servicios con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, provider];
                    }
                });
            });
        };
        ServiceProvidersService_1.prototype.updateServiceProvider = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, provider;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.serviceProvider.findUnique({ where: { id: id } })];
                        case 1:
                            provider = _a.sent();
                            if (!provider) {
                                throw new common_1.NotFoundException("Proveedor de servicios con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, prisma.serviceProvider.update({
                                    where: { id: id },
                                    data: data,
                                })];
                    }
                });
            });
        };
        ServiceProvidersService_1.prototype.deleteServiceProvider = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.serviceProvider.delete({ where: { id: id } })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ServiceProvidersService_1.prototype.addReview = function (schemaName, serviceProviderId, userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, review, _a, _b, aggregate;
                var _c, _d;
                var _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _b = (_a = prisma.review).create;
                            _c = {};
                            _d = {
                                serviceProviderId: serviceProviderId,
                                userId: userId,
                                rating: data.rating,
                                comment: data.comment
                            };
                            return [4 /*yield*/, prisma.user.findUnique({ where: { id: userId } })];
                        case 1: return [4 /*yield*/, _b.apply(_a, [(_c.data = (_d.userName = ((_e = (_f.sent())) === null || _e === void 0 ? void 0 : _e.name) ||
                                    'Unknown User',
                                    _d),
                                    _c)])];
                        case 2:
                            review = _f.sent();
                            return [4 /*yield*/, prisma.review.aggregate({
                                    _avg: { rating: true },
                                    _count: { rating: true },
                                    where: { serviceProviderId: serviceProviderId },
                                })];
                        case 3:
                            aggregate = _f.sent();
                            return [4 /*yield*/, prisma.serviceProvider.update({
                                    where: { id: serviceProviderId },
                                    data: {
                                        rating: aggregate._avg.rating || 0,
                                        reviewCount: aggregate._count.rating || 0,
                                    },
                                })];
                        case 4:
                            _f.sent();
                            return [2 /*return*/, review];
                    }
                });
            });
        };
        ServiceProvidersService_1.prototype.getReviewsByServiceProvider = function (schemaName, serviceProviderId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.review.findMany({
                            where: { serviceProviderId: serviceProviderId },
                            orderBy: { createdAt: 'desc' },
                        })];
                });
            });
        };
        return ServiceProvidersService_1;
    }());
    __setFunctionName(_classThis, "ServiceProvidersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ServiceProvidersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ServiceProvidersService = _classThis;
}();
exports.ServiceProvidersService = ServiceProvidersService;
