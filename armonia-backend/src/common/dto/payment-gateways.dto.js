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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePaymentGatewayDto = exports.CreatePaymentGatewayDto = exports.PaymentGatewayConfigDto = exports.PaymentGatewayType = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var PaymentGatewayType;
(function (PaymentGatewayType) {
    PaymentGatewayType["STRIPE"] = "STRIPE";
    PaymentGatewayType["PAYU"] = "PAYU";
    PaymentGatewayType["WOMPI"] = "WOMPI";
    PaymentGatewayType["MERCADO_PAGO"] = "MERCADO_PAGO";
    PaymentGatewayType["PAYPAL"] = "PAYPAL";
})(PaymentGatewayType || (exports.PaymentGatewayType = PaymentGatewayType = {}));
var PaymentGatewayConfigDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _apiKey_decorators;
    var _apiKey_initializers = [];
    var _apiKey_extraInitializers = [];
    var _secretKey_decorators;
    var _secretKey_initializers = [];
    var _secretKey_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _supportedCurrencies_decorators;
    var _supportedCurrencies_initializers = [];
    var _supportedCurrencies_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PaymentGatewayConfigDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.type = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.name = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.apiKey = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _apiKey_initializers, void 0));
                this.secretKey = (__runInitializers(this, _apiKey_extraInitializers), __runInitializers(this, _secretKey_initializers, void 0));
                this.isActive = (__runInitializers(this, _secretKey_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                this.supportedCurrencies = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _supportedCurrencies_initializers, void 0));
                this.createdAt = (__runInitializers(this, _supportedCurrencies_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
            return PaymentGatewayConfigDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Unique identifier of the payment gateway configuration',
                }), (0, class_validator_1.IsNumber)()];
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    enum: PaymentGatewayType,
                    description: 'Type of the payment gateway',
                }), (0, class_validator_1.IsEnum)(PaymentGatewayType)];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Name of the payment gateway configuration' }), (0, class_validator_1.IsString)()];
            _apiKey_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'API Key for the payment gateway (masked for security)',
                }), (0, class_validator_1.IsString)()];
            _secretKey_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Secret Key for the payment gateway (masked for security)',
                }), (0, class_validator_1.IsString)()];
            _isActive_decorators = [(0, swagger_1.ApiProperty)({ description: 'Indicates if the payment gateway is active' }), (0, class_validator_1.IsBoolean)()];
            _supportedCurrencies_decorators = [(0, swagger_1.ApiProperty)({
                    type: [String],
                    description: 'List of supported currencies (e.g., USD, COP)',
                }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Date of creation',
                    type: String,
                    format: 'date-time',
                })];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Date of last update',
                    type: String,
                    format: 'date-time',
                })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _apiKey_decorators, { kind: "field", name: "apiKey", static: false, private: false, access: { has: function (obj) { return "apiKey" in obj; }, get: function (obj) { return obj.apiKey; }, set: function (obj, value) { obj.apiKey = value; } }, metadata: _metadata }, _apiKey_initializers, _apiKey_extraInitializers);
            __esDecorate(null, null, _secretKey_decorators, { kind: "field", name: "secretKey", static: false, private: false, access: { has: function (obj) { return "secretKey" in obj; }, get: function (obj) { return obj.secretKey; }, set: function (obj, value) { obj.secretKey = value; } }, metadata: _metadata }, _secretKey_initializers, _secretKey_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _supportedCurrencies_decorators, { kind: "field", name: "supportedCurrencies", static: false, private: false, access: { has: function (obj) { return "supportedCurrencies" in obj; }, get: function (obj) { return obj.supportedCurrencies; }, set: function (obj, value) { obj.supportedCurrencies = value; } }, metadata: _metadata }, _supportedCurrencies_initializers, _supportedCurrencies_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PaymentGatewayConfigDto = PaymentGatewayConfigDto;
var CreatePaymentGatewayDto = function () {
    var _a;
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _apiKey_decorators;
    var _apiKey_initializers = [];
    var _apiKey_extraInitializers = [];
    var _secretKey_decorators;
    var _secretKey_initializers = [];
    var _secretKey_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _supportedCurrencies_decorators;
    var _supportedCurrencies_initializers = [];
    var _supportedCurrencies_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePaymentGatewayDto() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.name = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.apiKey = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _apiKey_initializers, void 0));
                this.secretKey = (__runInitializers(this, _apiKey_extraInitializers), __runInitializers(this, _secretKey_initializers, void 0));
                this.isActive = (__runInitializers(this, _secretKey_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                this.supportedCurrencies = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _supportedCurrencies_initializers, void 0));
                __runInitializers(this, _supportedCurrencies_extraInitializers);
            }
            return CreatePaymentGatewayDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    enum: PaymentGatewayType,
                    description: 'Type of the payment gateway',
                }), (0, class_validator_1.IsEnum)(PaymentGatewayType)];
            _name_decorators = [(0, swagger_1.ApiProperty)({ description: 'Name of the payment gateway configuration' }), (0, class_validator_1.IsString)()];
            _apiKey_decorators = [(0, swagger_1.ApiProperty)({ description: 'API Key for the payment gateway' }), (0, class_validator_1.IsString)()];
            _secretKey_decorators = [(0, swagger_1.ApiProperty)({ description: 'Secret Key for the payment gateway' }), (0, class_validator_1.IsString)()];
            _isActive_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Indicates if the payment gateway is active',
                    required: false,
                    default: true,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _supportedCurrencies_decorators = [(0, swagger_1.ApiProperty)({
                    type: [String],
                    description: 'List of supported currencies (e.g., USD, COP)',
                    required: false,
                    default: [],
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _apiKey_decorators, { kind: "field", name: "apiKey", static: false, private: false, access: { has: function (obj) { return "apiKey" in obj; }, get: function (obj) { return obj.apiKey; }, set: function (obj, value) { obj.apiKey = value; } }, metadata: _metadata }, _apiKey_initializers, _apiKey_extraInitializers);
            __esDecorate(null, null, _secretKey_decorators, { kind: "field", name: "secretKey", static: false, private: false, access: { has: function (obj) { return "secretKey" in obj; }, get: function (obj) { return obj.secretKey; }, set: function (obj, value) { obj.secretKey = value; } }, metadata: _metadata }, _secretKey_initializers, _secretKey_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _supportedCurrencies_decorators, { kind: "field", name: "supportedCurrencies", static: false, private: false, access: { has: function (obj) { return "supportedCurrencies" in obj; }, get: function (obj) { return obj.supportedCurrencies; }, set: function (obj, value) { obj.supportedCurrencies = value; } }, metadata: _metadata }, _supportedCurrencies_initializers, _supportedCurrencies_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePaymentGatewayDto = CreatePaymentGatewayDto;
var UpdatePaymentGatewayDto = function () {
    var _a;
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _apiKey_decorators;
    var _apiKey_initializers = [];
    var _apiKey_extraInitializers = [];
    var _secretKey_decorators;
    var _secretKey_initializers = [];
    var _secretKey_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _supportedCurrencies_decorators;
    var _supportedCurrencies_initializers = [];
    var _supportedCurrencies_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePaymentGatewayDto() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.name = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.apiKey = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _apiKey_initializers, void 0));
                this.secretKey = (__runInitializers(this, _apiKey_extraInitializers), __runInitializers(this, _secretKey_initializers, void 0));
                this.isActive = (__runInitializers(this, _secretKey_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                this.supportedCurrencies = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _supportedCurrencies_initializers, void 0));
                __runInitializers(this, _supportedCurrencies_extraInitializers);
            }
            return UpdatePaymentGatewayDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, swagger_1.ApiProperty)({
                    enum: PaymentGatewayType,
                    description: 'Type of the payment gateway',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PaymentGatewayType)];
            _name_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Name of the payment gateway configuration',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _apiKey_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'API Key for the payment gateway',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _secretKey_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Secret Key for the payment gateway',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _isActive_decorators = [(0, swagger_1.ApiProperty)({
                    description: 'Indicates if the payment gateway is active',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _supportedCurrencies_decorators = [(0, swagger_1.ApiProperty)({
                    type: [String],
                    description: 'List of supported currencies (e.g., USD, COP)',
                    required: false,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _apiKey_decorators, { kind: "field", name: "apiKey", static: false, private: false, access: { has: function (obj) { return "apiKey" in obj; }, get: function (obj) { return obj.apiKey; }, set: function (obj, value) { obj.apiKey = value; } }, metadata: _metadata }, _apiKey_initializers, _apiKey_extraInitializers);
            __esDecorate(null, null, _secretKey_decorators, { kind: "field", name: "secretKey", static: false, private: false, access: { has: function (obj) { return "secretKey" in obj; }, get: function (obj) { return obj.secretKey; }, set: function (obj, value) { obj.secretKey = value; } }, metadata: _metadata }, _secretKey_initializers, _secretKey_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _supportedCurrencies_decorators, { kind: "field", name: "supportedCurrencies", static: false, private: false, access: { has: function (obj) { return "supportedCurrencies" in obj; }, get: function (obj) { return obj.supportedCurrencies; }, set: function (obj, value) { obj.supportedCurrencies = value; } }, metadata: _metadata }, _supportedCurrencies_initializers, _supportedCurrencies_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePaymentGatewayDto = UpdatePaymentGatewayDto;
