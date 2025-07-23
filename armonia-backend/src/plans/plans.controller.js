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
exports.PlansController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var user_role_enum_1 = require("../common/enums/user-role.enum");
var PlansController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('plans')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createPlan_decorators;
    var _getPlans_decorators;
    var _getPlanById_decorators;
    var _updatePlan_decorators;
    var _deletePlan_decorators;
    var _createSubscription_decorators;
    var _getSubscriptions_decorators;
    var _getSubscriptionById_decorators;
    var _updateSubscription_decorators;
    var _deleteSubscription_decorators;
    var PlansController = _classThis = /** @class */ (function () {
        function PlansController_1(plansService) {
            this.plansService = (__runInitializers(this, _instanceExtraInitializers), plansService);
        }
        PlansController_1.prototype.createPlan = function (createPlanDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plansService.createPlan(createPlanDto)];
                });
            });
        };
        PlansController_1.prototype.getPlans = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plansService.getPlans(filters)];
                });
            });
        };
        PlansController_1.prototype.getPlanById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plansService.getPlanById(+id)];
                });
            });
        };
        PlansController_1.prototype.updatePlan = function (id, updatePlanDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plansService.updatePlan(+id, updatePlanDto)];
                });
            });
        };
        PlansController_1.prototype.deletePlan = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plansService.deletePlan(+id)];
                });
            });
        };
        PlansController_1.prototype.createSubscription = function (createSubscriptionDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plansService.createSubscription(createSubscriptionDto)];
                });
            });
        };
        PlansController_1.prototype.getSubscriptions = function (filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plansService.getSubscriptions(filters)];
                });
            });
        };
        PlansController_1.prototype.getSubscriptionById = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plansService.getSubscriptionById(+id)];
                });
            });
        };
        PlansController_1.prototype.updateSubscription = function (id, updateSubscriptionDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plansService.updateSubscription(+id, updateSubscriptionDto)];
                });
            });
        };
        PlansController_1.prototype.deleteSubscription = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.plansService.deleteSubscription(+id)];
                });
            });
        };
        return PlansController_1;
    }());
    __setFunctionName(_classThis, "PlansController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createPlan_decorators = [(0, common_1.Post)('plan'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.APP_ADMIN)];
        _getPlans_decorators = [(0, common_1.Get)('plan')];
        _getPlanById_decorators = [(0, common_1.Get)('plan/:id')];
        _updatePlan_decorators = [(0, common_1.Put)('plan/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.APP_ADMIN)];
        _deletePlan_decorators = [(0, common_1.Delete)('plan/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.APP_ADMIN)];
        _createSubscription_decorators = [(0, common_1.Post)('subscription'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.APP_ADMIN, user_role_enum_1.UserRole.COMPLEX_ADMIN)];
        _getSubscriptions_decorators = [(0, common_1.Get)('subscription'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.APP_ADMIN, user_role_enum_1.UserRole.COMPLEX_ADMIN)];
        _getSubscriptionById_decorators = [(0, common_1.Get)('subscription/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.APP_ADMIN, user_role_enum_1.UserRole.COMPLEX_ADMIN)];
        _updateSubscription_decorators = [(0, common_1.Put)('subscription/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.APP_ADMIN, user_role_enum_1.UserRole.COMPLEX_ADMIN)];
        _deleteSubscription_decorators = [(0, common_1.Delete)('subscription/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.APP_ADMIN, user_role_enum_1.UserRole.COMPLEX_ADMIN)];
        __esDecorate(_classThis, null, _createPlan_decorators, { kind: "method", name: "createPlan", static: false, private: false, access: { has: function (obj) { return "createPlan" in obj; }, get: function (obj) { return obj.createPlan; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPlans_decorators, { kind: "method", name: "getPlans", static: false, private: false, access: { has: function (obj) { return "getPlans" in obj; }, get: function (obj) { return obj.getPlans; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPlanById_decorators, { kind: "method", name: "getPlanById", static: false, private: false, access: { has: function (obj) { return "getPlanById" in obj; }, get: function (obj) { return obj.getPlanById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updatePlan_decorators, { kind: "method", name: "updatePlan", static: false, private: false, access: { has: function (obj) { return "updatePlan" in obj; }, get: function (obj) { return obj.updatePlan; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deletePlan_decorators, { kind: "method", name: "deletePlan", static: false, private: false, access: { has: function (obj) { return "deletePlan" in obj; }, get: function (obj) { return obj.deletePlan; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSubscription_decorators, { kind: "method", name: "createSubscription", static: false, private: false, access: { has: function (obj) { return "createSubscription" in obj; }, get: function (obj) { return obj.createSubscription; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSubscriptions_decorators, { kind: "method", name: "getSubscriptions", static: false, private: false, access: { has: function (obj) { return "getSubscriptions" in obj; }, get: function (obj) { return obj.getSubscriptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSubscriptionById_decorators, { kind: "method", name: "getSubscriptionById", static: false, private: false, access: { has: function (obj) { return "getSubscriptionById" in obj; }, get: function (obj) { return obj.getSubscriptionById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateSubscription_decorators, { kind: "method", name: "updateSubscription", static: false, private: false, access: { has: function (obj) { return "updateSubscription" in obj; }, get: function (obj) { return obj.updateSubscription; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteSubscription_decorators, { kind: "method", name: "deleteSubscription", static: false, private: false, access: { has: function (obj) { return "deleteSubscription" in obj; }, get: function (obj) { return obj.deleteSubscription; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PlansController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PlansController = _classThis;
}();
exports.PlansController = PlansController;
