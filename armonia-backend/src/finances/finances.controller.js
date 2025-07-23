"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.FinancesController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../auth/roles.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var user_role_enum_1 = require("../common/enums/user-role.enum");
var FinancesController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, (0, roles_guard_1.RolesGuard)([user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN])), (0, common_1.Controller)('finances')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createFee_decorators;
    var _getFees_decorators;
    var _getFeeById_decorators;
    var _updateFee_decorators;
    var _deleteFee_decorators;
    var _createPayment_decorators;
    var _registerManualPayment_decorators;
    var _getPayments_decorators;
    var _getPaymentById_decorators;
    var _updatePayment_decorators;
    var _deletePayment_decorators;
    var _createBudget_decorators;
    var _getBudgets_decorators;
    var _getBudgetById_decorators;
    var _updateBudget_decorators;
    var _deleteBudget_decorators;
    var _approveBudget_decorators;
    var _createExpense_decorators;
    var _getExpenses_decorators;
    var _getExpenseById_decorators;
    var _updateExpense_decorators;
    var _deleteExpense_decorators;
    var _getFinancialSummary_decorators;
    var _getRecentTransactions_decorators;
    var _initiatePayment_decorators;
    var _handlePaymentWebhook_decorators;
    var FinancesController = _classThis = /** @class */ (function () {
        function FinancesController_1(financesService) {
            this.financesService = (__runInitializers(this, _instanceExtraInitializers), financesService);
        }
        // Fees
        FinancesController_1.prototype.createFee = function (user, createFeeDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.createFee(user.schemaName, createFeeDto)];
                });
            });
        };
        FinancesController_1.prototype.getFees = function (user, filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.getFees(user.schemaName, filters)];
                });
            });
        };
        FinancesController_1.prototype.getFeeById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.getFeeById(user.schemaName, +id)];
                });
            });
        };
        FinancesController_1.prototype.updateFee = function (user, id, updateFeeDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.updateFee(user.schemaName, +id, updateFeeDto)];
                });
            });
        };
        FinancesController_1.prototype.deleteFee = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.deleteFee(user.schemaName, +id)];
                });
            });
        };
        // Payments
        FinancesController_1.prototype.createPayment = function (user, createPaymentDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.createPayment(user.schemaName, createPaymentDto)];
                });
            });
        };
        FinancesController_1.prototype.registerManualPayment = function (user, registerManualPaymentDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.registerManualPayment(user.schemaName, registerManualPaymentDto.feeId, registerManualPaymentDto.userId, registerManualPaymentDto.amount, new Date(registerManualPaymentDto.paymentDate), registerManualPaymentDto.paymentMethod, registerManualPaymentDto.transactionId)];
                });
            });
        };
        FinancesController_1.prototype.getPayments = function (user, filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.getPayments(user.schemaName, filters)];
                });
            });
        };
        FinancesController_1.prototype.getPaymentById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.getPaymentById(user.schemaName, +id)];
                });
            });
        };
        FinancesController_1.prototype.updatePayment = function (user, id, updatePaymentDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.updatePayment(user.schemaName, +id, updatePaymentDto)];
                });
            });
        };
        FinancesController_1.prototype.deletePayment = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.deletePayment(user.schemaName, +id)];
                });
            });
        };
        // Budgets
        FinancesController_1.prototype.createBudget = function (user, createBudgetDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.createBudget(user.schemaName, createBudgetDto)];
                });
            });
        };
        FinancesController_1.prototype.getBudgets = function (user, filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.getBudgets(user.schemaName, filters)];
                });
            });
        };
        FinancesController_1.prototype.getBudgetById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.getBudgetById(user.schemaName, +id)];
                });
            });
        };
        FinancesController_1.prototype.updateBudget = function (user, id, updateBudgetDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.updateBudget(user.schemaName, +id, updateBudgetDto)];
                });
            });
        };
        FinancesController_1.prototype.deleteBudget = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.deleteBudget(user.schemaName, +id)];
                });
            });
        };
        FinancesController_1.prototype.approveBudget = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.approveBudget(user.schemaName, +id, user.userId)];
                });
            });
        };
        // Expenses
        FinancesController_1.prototype.createExpense = function (user, createExpenseDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.createExpense(user.schemaName, createExpenseDto)];
                });
            });
        };
        FinancesController_1.prototype.getExpenses = function (user, filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.getExpenses(user.schemaName, filters)];
                });
            });
        };
        FinancesController_1.prototype.getExpenseById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.getExpenseById(user.schemaName, +id)];
                });
            });
        };
        FinancesController_1.prototype.updateExpense = function (user, id, updateExpenseDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.updateExpense(user.schemaName, +id, updateExpenseDto)];
                });
            });
        };
        FinancesController_1.prototype.deleteExpense = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.deleteExpense(user.schemaName, +id)];
                });
            });
        };
        FinancesController_1.prototype.getFinancialSummary = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.getFinancialSummary(user.schemaName)];
                });
            });
        };
        FinancesController_1.prototype.getRecentTransactions = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.getRecentTransactions(user.schemaName)];
                });
            });
        };
        FinancesController_1.prototype.initiatePayment = function (user, feeId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.initiatePayment(user.schemaName, feeId, user.userId)];
                });
            });
        };
        FinancesController_1.prototype.handlePaymentWebhook = function (transactionId, status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.financesService.handlePaymentWebhook(transactionId, status)];
                });
            });
        };
        return FinancesController_1;
    }());
    __setFunctionName(_classThis, "FinancesController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createFee_decorators = [(0, common_1.Post)('fees'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _getFees_decorators = [(0, common_1.Get)('fees'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RESIDENT)];
        _getFeeById_decorators = [(0, common_1.Get)('fees/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RESIDENT)];
        _updateFee_decorators = [(0, common_1.Put)('fees/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _deleteFee_decorators = [(0, common_1.Delete)('fees/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _createPayment_decorators = [(0, common_1.Post)('payments'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _registerManualPayment_decorators = [(0, common_1.Post)('payments/manual'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _getPayments_decorators = [(0, common_1.Get)('payments'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RESIDENT)];
        _getPaymentById_decorators = [(0, common_1.Get)('payments/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RESIDENT)];
        _updatePayment_decorators = [(0, common_1.Put)('payments/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _deletePayment_decorators = [(0, common_1.Delete)('payments/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _createBudget_decorators = [(0, common_1.Post)('budgets'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _getBudgets_decorators = [(0, common_1.Get)('budgets'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _getBudgetById_decorators = [(0, common_1.Get)('budgets/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _updateBudget_decorators = [(0, common_1.Put)('budgets/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _deleteBudget_decorators = [(0, common_1.Delete)('budgets/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _approveBudget_decorators = [(0, common_1.Post)('budgets/:id/approve'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _createExpense_decorators = [(0, common_1.Post)('expenses'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _getExpenses_decorators = [(0, common_1.Get)('expenses'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _getExpenseById_decorators = [(0, common_1.Get)('expenses/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _updateExpense_decorators = [(0, common_1.Put)('expenses/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _deleteExpense_decorators = [(0, common_1.Delete)('expenses/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _getFinancialSummary_decorators = [(0, common_1.Get)('summary'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RESIDENT)];
        _getRecentTransactions_decorators = [(0, common_1.Get)('transactions/recent'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RESIDENT)];
        _initiatePayment_decorators = [(0, common_1.Post)('payments/initiate'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.RESIDENT)];
        _handlePaymentWebhook_decorators = [(0, common_1.Post)('payments/webhook')];
        __esDecorate(_classThis, null, _createFee_decorators, { kind: "method", name: "createFee", static: false, private: false, access: { has: function (obj) { return "createFee" in obj; }, get: function (obj) { return obj.createFee; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFees_decorators, { kind: "method", name: "getFees", static: false, private: false, access: { has: function (obj) { return "getFees" in obj; }, get: function (obj) { return obj.getFees; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFeeById_decorators, { kind: "method", name: "getFeeById", static: false, private: false, access: { has: function (obj) { return "getFeeById" in obj; }, get: function (obj) { return obj.getFeeById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateFee_decorators, { kind: "method", name: "updateFee", static: false, private: false, access: { has: function (obj) { return "updateFee" in obj; }, get: function (obj) { return obj.updateFee; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteFee_decorators, { kind: "method", name: "deleteFee", static: false, private: false, access: { has: function (obj) { return "deleteFee" in obj; }, get: function (obj) { return obj.deleteFee; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createPayment_decorators, { kind: "method", name: "createPayment", static: false, private: false, access: { has: function (obj) { return "createPayment" in obj; }, get: function (obj) { return obj.createPayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerManualPayment_decorators, { kind: "method", name: "registerManualPayment", static: false, private: false, access: { has: function (obj) { return "registerManualPayment" in obj; }, get: function (obj) { return obj.registerManualPayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPayments_decorators, { kind: "method", name: "getPayments", static: false, private: false, access: { has: function (obj) { return "getPayments" in obj; }, get: function (obj) { return obj.getPayments; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPaymentById_decorators, { kind: "method", name: "getPaymentById", static: false, private: false, access: { has: function (obj) { return "getPaymentById" in obj; }, get: function (obj) { return obj.getPaymentById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updatePayment_decorators, { kind: "method", name: "updatePayment", static: false, private: false, access: { has: function (obj) { return "updatePayment" in obj; }, get: function (obj) { return obj.updatePayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deletePayment_decorators, { kind: "method", name: "deletePayment", static: false, private: false, access: { has: function (obj) { return "deletePayment" in obj; }, get: function (obj) { return obj.deletePayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createBudget_decorators, { kind: "method", name: "createBudget", static: false, private: false, access: { has: function (obj) { return "createBudget" in obj; }, get: function (obj) { return obj.createBudget; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBudgets_decorators, { kind: "method", name: "getBudgets", static: false, private: false, access: { has: function (obj) { return "getBudgets" in obj; }, get: function (obj) { return obj.getBudgets; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getBudgetById_decorators, { kind: "method", name: "getBudgetById", static: false, private: false, access: { has: function (obj) { return "getBudgetById" in obj; }, get: function (obj) { return obj.getBudgetById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateBudget_decorators, { kind: "method", name: "updateBudget", static: false, private: false, access: { has: function (obj) { return "updateBudget" in obj; }, get: function (obj) { return obj.updateBudget; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteBudget_decorators, { kind: "method", name: "deleteBudget", static: false, private: false, access: { has: function (obj) { return "deleteBudget" in obj; }, get: function (obj) { return obj.deleteBudget; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approveBudget_decorators, { kind: "method", name: "approveBudget", static: false, private: false, access: { has: function (obj) { return "approveBudget" in obj; }, get: function (obj) { return obj.approveBudget; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createExpense_decorators, { kind: "method", name: "createExpense", static: false, private: false, access: { has: function (obj) { return "createExpense" in obj; }, get: function (obj) { return obj.createExpense; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getExpenses_decorators, { kind: "method", name: "getExpenses", static: false, private: false, access: { has: function (obj) { return "getExpenses" in obj; }, get: function (obj) { return obj.getExpenses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getExpenseById_decorators, { kind: "method", name: "getExpenseById", static: false, private: false, access: { has: function (obj) { return "getExpenseById" in obj; }, get: function (obj) { return obj.getExpenseById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateExpense_decorators, { kind: "method", name: "updateExpense", static: false, private: false, access: { has: function (obj) { return "updateExpense" in obj; }, get: function (obj) { return obj.updateExpense; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteExpense_decorators, { kind: "method", name: "deleteExpense", static: false, private: false, access: { has: function (obj) { return "deleteExpense" in obj; }, get: function (obj) { return obj.deleteExpense; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFinancialSummary_decorators, { kind: "method", name: "getFinancialSummary", static: false, private: false, access: { has: function (obj) { return "getFinancialSummary" in obj; }, get: function (obj) { return obj.getFinancialSummary; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getRecentTransactions_decorators, { kind: "method", name: "getRecentTransactions", static: false, private: false, access: { has: function (obj) { return "getRecentTransactions" in obj; }, get: function (obj) { return obj.getRecentTransactions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _initiatePayment_decorators, { kind: "method", name: "initiatePayment", static: false, private: false, access: { has: function (obj) { return "initiatePayment" in obj; }, get: function (obj) { return obj.initiatePayment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _handlePaymentWebhook_decorators, { kind: "method", name: "handlePaymentWebhook", static: false, private: false, access: { has: function (obj) { return "handlePaymentWebhook" in obj; }, get: function (obj) { return obj.handlePaymentWebhook; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinancesController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinancesController = _classThis;
}();
exports.FinancesController = FinancesController;
