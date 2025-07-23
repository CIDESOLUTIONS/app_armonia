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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinancesService = void 0;
var common_1 = require("@nestjs/common");
var finances_dto_1 = require("../common/dto/finances.dto");
var communications_dto_1 = require("../common/dto/communications.dto");
var FinancesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FinancesService = _classThis = /** @class */ (function () {
        function FinancesService_1(prismaClientManager, prisma, communicationsService) {
            this.prismaClientManager = prismaClientManager;
            this.prisma = prisma;
            this.communicationsService = communicationsService;
        }
        FinancesService_1.prototype.getTenantPrismaClient = function (schemaName) {
            return this.prismaClientManager.getClient(schemaName);
        };
        // Fees
        FinancesService_1.prototype.createFee = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.fee.create({
                                    data: __assign(__assign({}, data), { status: finances_dto_1.PaymentStatus.PENDING }),
                                })];
                        case 1:
                            fee = _a.sent();
                            return [2 /*return*/, fee];
                    }
                });
            });
        };
        FinancesService_1.prototype.getFees = function (schemaName, filters) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, where, page, limit, skip, _a, fees, total, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            prisma = this.getTenantPrismaClient(schemaName);
                            where = {};
                            if (filters.status)
                                where.status = filters.status;
                            if (filters.type)
                                where.type = filters.type;
                            if (filters.propertyId)
                                where.propertyId = filters.propertyId;
                            page = filters.page || 1;
                            limit = filters.limit || 10;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    prisma.fee.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: { createdAt: 'desc' },
                                    }),
                                    prisma.fee.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), fees = _a[0], total = _a[1];
                            return [2 /*return*/, { fees: fees, total: total }];
                        case 2:
                            error_1 = _b.sent();
                            throw new common_1.BadRequestException('Error al obtener cuotas');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        FinancesService_1.prototype.getFeeById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.fee.findUnique({ where: { id: id } })];
                        case 1:
                            fee = _a.sent();
                            if (!fee) {
                                throw new common_1.NotFoundException("Cuota con ID ".concat(id, " no encontrada."));
                            }
                            return [2 /*return*/, fee];
                    }
                });
            });
        };
        FinancesService_1.prototype.getFee = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, fee, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.fee.findUnique({ where: { id: id } })];
                        case 1:
                            fee = _a.sent();
                            return [2 /*return*/, fee];
                        case 2:
                            error_2 = _a.sent();
                            throw new common_1.BadRequestException('Error al obtener cuota');
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        FinancesService_1.prototype.updateFee = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.fee.findUnique({ where: { id: id } })];
                        case 1:
                            fee = _a.sent();
                            if (!fee) {
                                throw new common_1.NotFoundException("Cuota con ID ".concat(id, " no encontrada."));
                            }
                            return [2 /*return*/, prisma.fee.update({ where: { id: id }, data: data })];
                    }
                });
            });
        };
        FinancesService_1.prototype.deleteFee = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, fee;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.fee.findUnique({ where: { id: id } })];
                        case 1:
                            fee = _a.sent();
                            if (!fee) {
                                throw new common_1.NotFoundException("Cuota con ID ".concat(id, " no encontrada."));
                            }
                            return [4 /*yield*/, prisma.fee.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Payments
        FinancesService_1.prototype.createPayment = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, payment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.payment.create({ data: data })];
                        case 1:
                            payment = _a.sent();
                            if (!(payment.status === finances_dto_1.PaymentStatus.PAID && payment.feeId)) return [3 /*break*/, 3];
                            return [4 /*yield*/, prisma.fee.update({
                                    where: { id: payment.feeId },
                                    data: { status: finances_dto_1.PaymentStatus.PAID },
                                })];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/, payment];
                    }
                });
            });
        };
        FinancesService_1.prototype.registerManualPayment = function (schemaName, feeId, userId, amount, paymentDate, paymentMethod, transactionId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, fee, payment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.fee.findUnique({ where: { id: feeId } })];
                        case 1:
                            fee = _a.sent();
                            if (!fee) {
                                throw new common_1.NotFoundException("Cuota con ID ".concat(feeId, " no encontrada."));
                            }
                            if (fee.status === finances_dto_1.PaymentStatus.PAID) {
                                throw new common_1.BadRequestException("La cuota ".concat(feeId, " ya ha sido pagada."));
                            }
                            return [4 /*yield*/, prisma.payment.create({
                                    data: {
                                        feeId: fee.id,
                                        userId: userId,
                                        amount: amount,
                                        paymentDate: paymentDate,
                                        status: finances_dto_1.PaymentStatus.PAID,
                                        transactionId: transactionId || "MANUAL_".concat(Date.now()),
                                        paymentMethod: 'Simulated Gateway',
                                    },
                                })];
                        case 2:
                            payment = _a.sent();
                            return [4 /*yield*/, prisma.fee.update({
                                    where: { id: fee.id },
                                    data: { status: finances_dto_1.PaymentStatus.PAID },
                                })];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, payment];
                    }
                });
            });
        };
        FinancesService_1.prototype.getPayments = function (schemaName, filters) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, where, page, limit, skip, _a, data, total;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            where = {};
                            if (filters.status)
                                where.status = filters.status;
                            if (filters.propertyId)
                                where.propertyId = filters.propertyId;
                            page = filters.page || 1;
                            limit = filters.limit || 10;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    prisma.payment.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: { paymentDate: 'desc' },
                                    }),
                                    prisma.payment.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), data = _a[0], total = _a[1];
                            return [2 /*return*/, { data: data, total: total }];
                    }
                });
            });
        };
        FinancesService_1.prototype.getPaymentById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, payment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.payment.findUnique({ where: { id: id } })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException("Pago con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, payment];
                    }
                });
            });
        };
        FinancesService_1.prototype.updatePayment = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, payment, updatedPayment, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.payment.findUnique({ where: { id: id } })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException("Pago con ID ".concat(id, " no encontrado."));
                            }
                            return [4 /*yield*/, prisma.payment.update({ where: { id: id }, data: data })];
                        case 2:
                            updatedPayment = _a.sent();
                            if (!(updatedPayment.status === finances_dto_1.PaymentStatus.PAID &&
                                updatedPayment.feeId)) return [3 /*break*/, 6];
                            return [4 /*yield*/, prisma.fee.update({
                                    where: { id: updatedPayment.feeId },
                                    data: { status: finances_dto_1.PaymentStatus.PAID },
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, prisma.user.findUnique({
                                    where: { id: updatedPayment.userId },
                                })];
                        case 4:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.communicationsService.notifyUser(schemaName, user.id, {
                                    type: communications_dto_1.NotificationType.INFO,
                                    title: 'Pago Confirmado',
                                    message: "Tu pago de ".concat(updatedPayment.amount, " para la cuota ").concat(updatedPayment.feeId, " ha sido confirmado."),
                                    link: "/resident/finances/payments/".concat(updatedPayment.id),
                                    sourceType: communications_dto_1.NotificationSourceType.FINANCIAL,
                                    sourceId: updatedPayment.id.toString(),
                                })];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [2 /*return*/, updatedPayment];
                    }
                });
            });
        };
        FinancesService_1.prototype.deletePayment = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, payment;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.payment.findUnique({ where: { id: id } })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException("Pago con ID ".concat(id, " no encontrado."));
                            }
                            return [4 /*yield*/, prisma.payment.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        // Budgets
        FinancesService_1.prototype.createBudget = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.budget.create({ data: data })];
                });
            });
        };
        FinancesService_1.prototype.getBudgets = function (schemaName, filters) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, where, page, limit, skip, _a, data, total;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            where = {};
                            if (filters.year)
                                where.year = filters.year;
                            if (filters.status)
                                where.status = filters.status;
                            page = filters.page || 1;
                            limit = filters.limit || 10;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    prisma.budget.findMany({
                                        where: where,
                                        include: { items: true },
                                        skip: skip,
                                        take: limit,
                                        orderBy: { year: 'desc' },
                                    }),
                                    prisma.budget.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), data = _a[0], total = _a[1];
                            return [2 /*return*/, { data: data, total: total }];
                    }
                });
            });
        };
        FinancesService_1.prototype.getBudgetById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, budget;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.budget.findUnique({
                                    where: { id: id },
                                    include: { items: true },
                                })];
                        case 1:
                            budget = _a.sent();
                            if (!budget) {
                                throw new common_1.NotFoundException("Presupuesto con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, budget];
                    }
                });
            });
        };
        FinancesService_1.prototype.updateBudget = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, budget;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.budget.findUnique({ where: { id: id } })];
                        case 1:
                            budget = _a.sent();
                            if (!budget) {
                                throw new common_1.NotFoundException("Presupuesto con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, prisma.budget.update({ where: { id: id }, data: data })];
                    }
                });
            });
        };
        FinancesService_1.prototype.deleteBudget = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, budget;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.budget.findUnique({ where: { id: id } })];
                        case 1:
                            budget = _a.sent();
                            if (!budget) {
                                throw new common_1.NotFoundException("Presupuesto con ID ".concat(id, " no encontrado."));
                            }
                            return [4 /*yield*/, prisma.budget.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        FinancesService_1.prototype.approveBudget = function (schemaName, id, approvedById) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, budget;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.budget.findUnique({ where: { id: id } })];
                        case 1:
                            budget = _a.sent();
                            if (!budget) {
                                throw new common_1.NotFoundException("Presupuesto con ID ".concat(id, " no encontrado."));
                            }
                            if (budget.status !== finances_dto_1.BudgetStatus.DRAFT) {
                                throw new common_1.BadRequestException("El presupuesto no est\u00E1 en estado BORRADOR y no puede ser aprobado.");
                            }
                            return [2 /*return*/, prisma.budget.update({
                                    where: { id: id },
                                    data: {
                                        status: finances_dto_1.BudgetStatus.APPROVED,
                                        approvedById: approvedById,
                                        approvedAt: new Date(),
                                    },
                                })];
                    }
                });
            });
        };
        // Expenses
        FinancesService_1.prototype.createExpense = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.expense.create({ data: data })];
                });
            });
        };
        FinancesService_1.prototype.getExpenses = function (schemaName, filters) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, where, page, limit, skip, _a, data, total;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            where = {};
                            if (filters.status)
                                where.status = filters.status;
                            if (filters.categoryId)
                                where.categoryId = filters.categoryId;
                            page = filters.page || 1;
                            limit = filters.limit || 10;
                            skip = (page - 1) * limit;
                            return [4 /*yield*/, Promise.all([
                                    prisma.expense.findMany({
                                        where: where,
                                        skip: skip,
                                        take: limit,
                                        orderBy: { date: 'desc' },
                                    }),
                                    prisma.expense.count({ where: where }),
                                ])];
                        case 1:
                            _a = _b.sent(), data = _a[0], total = _a[1];
                            return [2 /*return*/, { data: data, total: total }];
                    }
                });
            });
        };
        FinancesService_1.prototype.getExpenseById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, expense;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.expense.findUnique({ where: { id: id } })];
                        case 1:
                            expense = _a.sent();
                            if (!expense) {
                                throw new common_1.NotFoundException("Gasto con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, expense];
                    }
                });
            });
        };
        FinancesService_1.prototype.updateExpense = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, expense;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.expense.findUnique({ where: { id: id } })];
                        case 1:
                            expense = _a.sent();
                            if (!expense) {
                                throw new common_1.NotFoundException("Gasto con ID ".concat(id, " no encontrado."));
                            }
                            return [2 /*return*/, prisma.expense.update({ where: { id: id }, data: data })];
                    }
                });
            });
        };
        FinancesService_1.prototype.deleteExpense = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, expense;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.expense.findUnique({ where: { id: id } })];
                        case 1:
                            expense = _a.sent();
                            if (!expense) {
                                throw new common_1.NotFoundException("Gasto con ID ".concat(id, " no encontrado."));
                            }
                            return [4 /*yield*/, prisma.expense.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        FinancesService_1.prototype.getFinancialSummary = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, totalIncome, totalExpenses, currentBalance, monthlyIncome, monthlyExpenses, pendingBills, pendingBillsAmount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.payment.aggregate({
                                    _sum: { amount: true },
                                    where: { status: finances_dto_1.PaymentStatus.PAID },
                                })];
                        case 1:
                            totalIncome = _a.sent();
                            return [4 /*yield*/, prisma.expense.aggregate({
                                    _sum: { amount: true },
                                    where: { status: 'PAID' }, // Assuming ExpenseStatus.PAID is 'PAID' string
                                })];
                        case 2:
                            totalExpenses = _a.sent();
                            currentBalance = (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0);
                            return [4 /*yield*/, prisma.payment.aggregate({
                                    _sum: { amount: true },
                                    where: {
                                        status: finances_dto_1.PaymentStatus.PAID,
                                        paymentDate: {
                                            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                        },
                                    },
                                })];
                        case 3:
                            monthlyIncome = _a.sent();
                            return [4 /*yield*/, prisma.expense.aggregate({
                                    _sum: { amount: true },
                                    where: {
                                        status: 'PAID',
                                        date: {
                                            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                                        },
                                    },
                                })];
                        case 4:
                            monthlyExpenses = _a.sent();
                            return [4 /*yield*/, prisma.fee.count({
                                    where: { status: finances_dto_1.PaymentStatus.PENDING },
                                })];
                        case 5:
                            pendingBills = _a.sent();
                            return [4 /*yield*/, prisma.fee.aggregate({
                                    _sum: { amount: true },
                                    where: { status: finances_dto_1.PaymentStatus.PENDING },
                                })];
                        case 6:
                            pendingBillsAmount = _a.sent();
                            return [2 /*return*/, {
                                    currentBalance: currentBalance,
                                    balanceChange: '+5.2%',
                                    monthlyIncome: monthlyIncome._sum.amount || 0,
                                    incomeChange: '+2.1%',
                                    monthlyExpenses: monthlyExpenses._sum.amount || 0,
                                    expenseChange: '-1.5%',
                                    pendingBills: pendingBills,
                                    pendingBillsAmount: pendingBillsAmount._sum.amount || 0,
                                }];
                    }
                });
            });
        };
        FinancesService_1.prototype.getRecentTransactions = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, recentPayments, recentExpenses, transactions;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.payment.findMany({
                                    orderBy: { paymentDate: 'desc' },
                                    take: 5,
                                })];
                        case 1:
                            recentPayments = _a.sent();
                            return [4 /*yield*/, prisma.expense.findMany({
                                    orderBy: { date: 'desc' },
                                    take: 5,
                                })];
                        case 2:
                            recentExpenses = _a.sent();
                            transactions = __spreadArray(__spreadArray([], recentPayments.map(function (p) { return ({
                                id: p.id,
                                date: p.paymentDate,
                                description: "Pago de cuota ".concat(p.feeId),
                                amount: p.amount,
                                type: 'income',
                            }); }), true), recentExpenses.map(function (e) { return ({
                                id: e.id,
                                date: e.date,
                                description: e.description,
                                amount: e.amount,
                                type: 'expense',
                            }); }), true);
                            transactions.sort(function (a, b) { return b.date.getTime() - a.date.getTime(); });
                            return [2 /*return*/, transactions.slice(0, 5)];
                    }
                });
            });
        };
        FinancesService_1.prototype.initiatePayment = function (schemaName, feeId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, fee, simulatedPaymentUrl, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.fee.findUnique({ where: { id: feeId } })];
                        case 1:
                            fee = _a.sent();
                            if (!fee) {
                                throw new common_1.NotFoundException("Cuota con ID ".concat(feeId, " no encontrada."));
                            }
                            if (fee.status !== finances_dto_1.PaymentStatus.PENDING) {
                                throw new common_1.BadRequestException("La cuota ".concat(feeId, " no est\u00E1 pendiente de pago."));
                            }
                            simulatedPaymentUrl = "https://simulated-payment-gateway.com/pay?amount=".concat(fee.amount, "&feeId=").concat(fee.id, "&userId=").concat(userId);
                            // Create a pending payment record
                            return [4 /*yield*/, prisma.payment.create({
                                    data: {
                                        feeId: fee.id,
                                        userId: userId,
                                        amount: fee.amount,
                                        paymentDate: new Date(),
                                        status: finances_dto_1.PaymentStatus.PENDING,
                                        transactionId: "simulated_tx_".concat(Date.now()),
                                        paymentMethod: 'Simulated Gateway',
                                    },
                                })];
                        case 2:
                            // Create a pending payment record
                            _a.sent();
                            return [4 /*yield*/, prisma.user.findUnique({ where: { id: userId } })];
                        case 3:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.communicationsService.notifyUser(schemaName, user.id, {
                                    type: communications_dto_1.NotificationType.INFO,
                                    title: 'Pago Iniciado',
                                    message: "Se ha iniciado el pago de tu cuota ".concat(fee.title, ". Por favor, completa la transacci\u00F3n."),
                                    link: simulatedPaymentUrl,
                                    sourceType: communications_dto_1.NotificationSourceType.FINANCIAL,
                                    sourceId: fee.id.toString(),
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/, simulatedPaymentUrl];
                    }
                });
            });
        };
        FinancesService_1.prototype.handlePaymentWebhook = function (schemaName, transactionId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, payment, updatedPayment, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.payment.findUnique({
                                    where: { transactionId: transactionId },
                                })];
                        case 1:
                            payment = _a.sent();
                            if (!payment) {
                                throw new common_1.NotFoundException("Transacci\u00F3n ".concat(transactionId, " no encontrada."));
                            }
                            if (payment.status === finances_dto_1.PaymentStatus.PAID) {
                                return [2 /*return*/, payment]; // Already completed, no action needed
                            }
                            return [4 /*yield*/, prisma.payment.update({
                                    where: { id: payment.id },
                                    data: { status: status, paymentDate: new Date() },
                                })];
                        case 2:
                            updatedPayment = _a.sent();
                            if (!(updatedPayment.status === finances_dto_1.PaymentStatus.PAID &&
                                updatedPayment.feeId)) return [3 /*break*/, 6];
                            return [4 /*yield*/, prisma.fee.update({
                                    where: { id: updatedPayment.feeId },
                                    data: { status: finances_dto_1.PaymentStatus.PAID },
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, prisma.user.findUnique({
                                    where: { id: updatedPayment.userId },
                                })];
                        case 4:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.communicationsService.notifyUser(schemaName, user.id, {
                                    type: communications_dto_1.NotificationType.INFO,
                                    title: 'Pago Confirmado',
                                    message: "Tu pago de ".concat(updatedPayment.amount, " para la cuota ").concat(updatedPayment.feeId, " ha sido confirmado."),
                                    link: "/resident/finances/payments/".concat(updatedPayment.id),
                                    sourceType: communications_dto_1.NotificationSourceType.FINANCIAL,
                                    sourceId: updatedPayment.id.toString(),
                                })];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [2 /*return*/, updatedPayment];
                    }
                });
            });
        };
        return FinancesService_1;
    }());
    __setFunctionName(_classThis, "FinancesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinancesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinancesService = _classThis;
}();
exports.FinancesService = FinancesService;
