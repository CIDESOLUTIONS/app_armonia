"use strict";
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
exports.PortfolioService = void 0;
var common_1 = require("@nestjs/common");
var PortfolioService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PortfolioService = _classThis = /** @class */ (function () {
        function PortfolioService_1(prismaClientManager, prisma) {
            this.prismaClientManager = prismaClientManager;
            this.prisma = prisma;
        }
        PortfolioService_1.prototype.getPortfolioMetrics = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var complexes, totalProperties, totalResidents, totalPendingFees, totalIncome, totalOpenPqrs, totalBudgetsApproved, totalExpenses, _i, complexes_1, complex, tenantPrisma, propertiesCount, residentsCount, pendingFees, income, openPqrs, budgetsApproved, expenses;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.residentialComplex.findMany({
                                select: { schemaName: true, id: true, name: true },
                            })];
                        case 1:
                            complexes = _a.sent();
                            totalProperties = 0;
                            totalResidents = 0;
                            totalPendingFees = 0;
                            totalIncome = 0;
                            totalOpenPqrs = 0;
                            totalBudgetsApproved = 0;
                            totalExpenses = 0;
                            _i = 0, complexes_1 = complexes;
                            _a.label = 2;
                        case 2:
                            if (!(_i < complexes_1.length)) return [3 /*break*/, 11];
                            complex = complexes_1[_i];
                            tenantPrisma = this.prismaClientManager.getClient(complex.schemaName);
                            return [4 /*yield*/, tenantPrisma.property.count()];
                        case 3:
                            propertiesCount = _a.sent();
                            totalProperties += propertiesCount;
                            return [4 /*yield*/, tenantPrisma.user.count({
                                    where: { role: 'RESIDENT' },
                                })];
                        case 4:
                            residentsCount = _a.sent();
                            totalResidents += residentsCount;
                            return [4 /*yield*/, tenantPrisma.fee.aggregate({
                                    _sum: { amount: true },
                                    where: { status: 'PENDING' },
                                })];
                        case 5:
                            pendingFees = _a.sent();
                            totalPendingFees += pendingFees._sum.amount || 0;
                            return [4 /*yield*/, tenantPrisma.payment.aggregate({
                                    _sum: { amount: true },
                                    where: { status: 'COMPLETED' },
                                })];
                        case 6:
                            income = _a.sent();
                            totalIncome += income._sum.amount || 0;
                            return [4 /*yield*/, tenantPrisma.pQR.count({
                                    where: { status: { notIn: ['RESOLVED', 'CLOSED'] } },
                                })];
                        case 7:
                            openPqrs = _a.sent();
                            totalOpenPqrs += openPqrs;
                            return [4 /*yield*/, tenantPrisma.budget.aggregate({
                                    _sum: { totalAmount: true },
                                    where: { status: 'APPROVED' },
                                })];
                        case 8:
                            budgetsApproved = _a.sent();
                            totalBudgetsApproved += budgetsApproved._sum.totalAmount || 0;
                            return [4 /*yield*/, tenantPrisma.expense.aggregate({
                                    _sum: { amount: true },
                                    where: { status: 'PAID' },
                                })];
                        case 9:
                            expenses = _a.sent();
                            totalExpenses += expenses._sum.amount || 0;
                            _a.label = 10;
                        case 10:
                            _i++;
                            return [3 /*break*/, 2];
                        case 11: return [2 /*return*/, {
                                totalProperties: totalProperties,
                                totalResidents: totalResidents,
                                totalPendingFees: totalPendingFees,
                                totalIncome: totalIncome,
                                totalOpenPqrs: totalOpenPqrs,
                                totalBudgetsApproved: totalBudgetsApproved,
                                totalExpenses: totalExpenses,
                            }];
                    }
                });
            });
        };
        PortfolioService_1.prototype.getComplexMetrics = function (userId) {
            return __awaiter(this, void 0, void 0, function () {
                var complexes, complexMetrics, _i, complexes_2, complex, tenantPrisma, residents, pendingFees, income, openPqrs, budgetApproved, expenses;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.residentialComplex.findMany({
                                select: { schemaName: true, id: true, name: true },
                            })];
                        case 1:
                            complexes = _a.sent();
                            complexMetrics = [];
                            _i = 0, complexes_2 = complexes;
                            _a.label = 2;
                        case 2:
                            if (!(_i < complexes_2.length)) return [3 /*break*/, 10];
                            complex = complexes_2[_i];
                            tenantPrisma = this.prismaClientManager.getClient(complex.schemaName);
                            return [4 /*yield*/, tenantPrisma.user.count({
                                    where: { role: 'RESIDENT' },
                                })];
                        case 3:
                            residents = _a.sent();
                            return [4 /*yield*/, tenantPrisma.fee.aggregate({
                                    _sum: { amount: true },
                                    where: { status: 'PENDING' },
                                })];
                        case 4:
                            pendingFees = _a.sent();
                            return [4 /*yield*/, tenantPrisma.payment.aggregate({
                                    _sum: { amount: true },
                                    where: { status: 'COMPLETED' },
                                })];
                        case 5:
                            income = _a.sent();
                            return [4 /*yield*/, tenantPrisma.pQR.count({
                                    where: { status: { notIn: ['RESOLVED', 'CLOSED'] } },
                                })];
                        case 6:
                            openPqrs = _a.sent();
                            return [4 /*yield*/, tenantPrisma.budget.aggregate({
                                    _sum: { totalAmount: true },
                                    where: { status: 'APPROVED' },
                                })];
                        case 7:
                            budgetApproved = _a.sent();
                            return [4 /*yield*/, tenantPrisma.expense.aggregate({
                                    _sum: { amount: true },
                                    where: { status: 'PAID' },
                                })];
                        case 8:
                            expenses = _a.sent();
                            complexMetrics.push({
                                id: complex.id,
                                name: complex.name,
                                residents: residents,
                                pendingFees: pendingFees._sum.amount || 0,
                                income: income._sum.amount || 0,
                                openPqrs: openPqrs,
                                budgetApproved: budgetApproved._sum.totalAmount || 0,
                                expenses: expenses._sum.amount || 0,
                            });
                            _a.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 2];
                        case 10: return [2 /*return*/, complexMetrics];
                    }
                });
            });
        };
        PortfolioService_1.prototype.generateConsolidatedFinancialReport = function (startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var complexes, reportData, totalIncomeAllComplexes, totalExpensesAllComplexes, _i, complexes_3, complex, tenantPrisma, income, expenses, complexIncome, complexExpenses;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.residentialComplex.findMany({
                                select: { schemaName: true, name: true },
                            })];
                        case 1:
                            complexes = _a.sent();
                            reportData = [];
                            totalIncomeAllComplexes = 0;
                            totalExpensesAllComplexes = 0;
                            _i = 0, complexes_3 = complexes;
                            _a.label = 2;
                        case 2:
                            if (!(_i < complexes_3.length)) return [3 /*break*/, 6];
                            complex = complexes_3[_i];
                            tenantPrisma = this.prismaClientManager.getClient(complex.schemaName);
                            return [4 /*yield*/, tenantPrisma.payment.aggregate({
                                    _sum: { amount: true },
                                    where: {
                                        date: { gte: new Date(startDate), lte: new Date(endDate) },
                                        status: 'COMPLETED',
                                    },
                                })];
                        case 3:
                            income = _a.sent();
                            return [4 /*yield*/, tenantPrisma.expense.aggregate({
                                    _sum: { amount: true },
                                    where: {
                                        date: { gte: new Date(startDate), lte: new Date(endDate) },
                                        status: 'PAID',
                                    },
                                })];
                        case 4:
                            expenses = _a.sent();
                            complexIncome = income._sum.amount || 0;
                            complexExpenses = expenses._sum.amount || 0;
                            reportData.push({
                                complexName: complex.name,
                                income: complexIncome,
                                expenses: complexExpenses,
                                netBalance: complexIncome - complexExpenses,
                            });
                            totalIncomeAllComplexes += complexIncome;
                            totalExpensesAllComplexes += complexExpenses;
                            _a.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 2];
                        case 6: return [2 /*return*/, {
                                startDate: startDate,
                                endDate: endDate,
                                totalIncomeAllComplexes: totalIncomeAllComplexes,
                                totalExpensesAllComplexes: totalExpensesAllComplexes,
                                netBalanceAllComplexes: totalIncomeAllComplexes - totalExpensesAllComplexes,
                                complexReports: reportData,
                            }];
                    }
                });
            });
        };
        return PortfolioService_1;
    }());
    __setFunctionName(_classThis, "PortfolioService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PortfolioService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PortfolioService = _classThis;
}();
exports.PortfolioService = PortfolioService;
