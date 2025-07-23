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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentGatewaysController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var passport_1 = require("@nestjs/passport");
var roles_guard_1 = require("../auth/roles.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var user_role_enum_1 = require("../common/enums/user-role.enum");
var PaymentGatewaysController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('payment-gateways'), (0, common_1.Controller)('payment-gateways'), (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt'), roles_guard_1.RolesGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _create_decorators;
    var _findAll_decorators;
    var _findOne_decorators;
    var _update_decorators;
    var _remove_decorators;
    var PaymentGatewaysController = _classThis = /** @class */ (function () {
        function PaymentGatewaysController_1(paymentGatewaysService) {
            this.paymentGatewaysService = (__runInitializers(this, _instanceExtraInitializers), paymentGatewaysService);
        }
        PaymentGatewaysController_1.prototype.create = function (req, createPaymentGatewayDto) {
            var schemaName = req.user.schemaName;
            return this.paymentGatewaysService.createPaymentGateway(schemaName, createPaymentGatewayDto);
        };
        PaymentGatewaysController_1.prototype.findAll = function (req) {
            var schemaName = req.user.schemaName;
            return this.paymentGatewaysService.getPaymentGateways(schemaName);
        };
        PaymentGatewaysController_1.prototype.findOne = function (req, id) {
            var schemaName = req.user.schemaName;
            return this.paymentGatewaysService.getPaymentGatewayById(schemaName, +id);
        };
        PaymentGatewaysController_1.prototype.update = function (req, id, updatePaymentGatewayDto) {
            var schemaName = req.user.schemaName;
            return this.paymentGatewaysService.updatePaymentGateway(schemaName, +id, updatePaymentGatewayDto);
        };
        PaymentGatewaysController_1.prototype.remove = function (req, id) {
            var schemaName = req.user.schemaName;
            return this.paymentGatewaysService.deletePaymentGateway(schemaName, +id);
        };
        return PaymentGatewaysController_1;
    }());
    __setFunctionName(_classThis, "PaymentGatewaysController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _create_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.COMPLEX_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Create a new payment gateway configuration' }), (0, swagger_1.ApiResponse)({
                status: 201,
                description: 'The payment gateway has been successfully created.',
            }), (0, swagger_1.ApiResponse)({ status: 403, description: 'Forbidden.' }), (0, swagger_1.ApiBearerAuth)()];
        _findAll_decorators = [(0, common_1.Get)(), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.COMPLEX_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get all payment gateway configurations' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Return all payment gateway configurations.',
            }), (0, swagger_1.ApiBearerAuth)()];
        _findOne_decorators = [(0, common_1.Get)(':id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.COMPLEX_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Get a payment gateway configuration by ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Return the payment gateway configuration.',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment gateway not found.' }), (0, swagger_1.ApiBearerAuth)()];
        _update_decorators = [(0, common_1.Put)(':id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.COMPLEX_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Update a payment gateway configuration by ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'The payment gateway has been successfully updated.',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment gateway not found.' }), (0, swagger_1.ApiBearerAuth)()];
        _remove_decorators = [(0, common_1.Delete)(':id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.COMPLEX_ADMIN), (0, swagger_1.ApiOperation)({ summary: 'Delete a payment gateway configuration by ID' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'The payment gateway has been successfully deleted.',
            }), (0, swagger_1.ApiResponse)({ status: 404, description: 'Payment gateway not found.' }), (0, swagger_1.ApiBearerAuth)()];
        __esDecorate(_classThis, null, _create_decorators, { kind: "method", name: "create", static: false, private: false, access: { has: function (obj) { return "create" in obj; }, get: function (obj) { return obj.create; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAll_decorators, { kind: "method", name: "findAll", static: false, private: false, access: { has: function (obj) { return "findAll" in obj; }, get: function (obj) { return obj.findAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOne_decorators, { kind: "method", name: "findOne", static: false, private: false, access: { has: function (obj) { return "findOne" in obj; }, get: function (obj) { return obj.findOne; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _update_decorators, { kind: "method", name: "update", static: false, private: false, access: { has: function (obj) { return "update" in obj; }, get: function (obj) { return obj.update; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _remove_decorators, { kind: "method", name: "remove", static: false, private: false, access: { has: function (obj) { return "remove" in obj; }, get: function (obj) { return obj.remove; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PaymentGatewaysController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PaymentGatewaysController = _classThis;
}();
exports.PaymentGatewaysController = PaymentGatewaysController;
