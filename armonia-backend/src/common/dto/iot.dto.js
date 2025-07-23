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
exports.AutomatedBillingDto = exports.SmartMeterFilterParamsDto = exports.SmartMeterReadingDto = exports.SmartMeterUnit = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var SmartMeterUnit;
(function (SmartMeterUnit) {
    SmartMeterUnit["KWH"] = "kWh";
    SmartMeterUnit["M3"] = "m3";
    SmartMeterUnit["LITERS"] = "liters";
    SmartMeterUnit["OTHER"] = "other";
})(SmartMeterUnit || (exports.SmartMeterUnit = SmartMeterUnit = {}));
var SmartMeterReadingDto = function () {
    var _a;
    var _meterId_decorators;
    var _meterId_initializers = [];
    var _meterId_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _reading_decorators;
    var _reading_initializers = [];
    var _reading_extraInitializers = [];
    var _unit_decorators;
    var _unit_initializers = [];
    var _unit_extraInitializers = [];
    var _timestamp_decorators;
    var _timestamp_initializers = [];
    var _timestamp_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SmartMeterReadingDto() {
                this.meterId = __runInitializers(this, _meterId_initializers, void 0);
                this.propertyId = (__runInitializers(this, _meterId_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0)); // Relacionar con Property
                this.reading = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _reading_initializers, void 0));
                this.unit = (__runInitializers(this, _reading_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.timestamp = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _timestamp_initializers, void 0));
                __runInitializers(this, _timestamp_extraInitializers);
            }
            return SmartMeterReadingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _meterId_decorators = [(0, class_validator_1.IsString)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)()];
            _reading_decorators = [(0, class_validator_1.IsNumber)()];
            _unit_decorators = [(0, class_validator_1.IsEnum)(SmartMeterUnit)];
            _timestamp_decorators = [(0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _meterId_decorators, { kind: "field", name: "meterId", static: false, private: false, access: { has: function (obj) { return "meterId" in obj; }, get: function (obj) { return obj.meterId; }, set: function (obj, value) { obj.meterId = value; } }, metadata: _metadata }, _meterId_initializers, _meterId_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _reading_decorators, { kind: "field", name: "reading", static: false, private: false, access: { has: function (obj) { return "reading" in obj; }, get: function (obj) { return obj.reading; }, set: function (obj, value) { obj.reading = value; } }, metadata: _metadata }, _reading_initializers, _reading_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: function (obj) { return "unit" in obj; }, get: function (obj) { return obj.unit; }, set: function (obj, value) { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _timestamp_decorators, { kind: "field", name: "timestamp", static: false, private: false, access: { has: function (obj) { return "timestamp" in obj; }, get: function (obj) { return obj.timestamp; }, set: function (obj, value) { obj.timestamp = value; } }, metadata: _metadata }, _timestamp_initializers, _timestamp_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SmartMeterReadingDto = SmartMeterReadingDto;
var SmartMeterFilterParamsDto = function () {
    var _a;
    var _meterId_decorators;
    var _meterId_initializers = [];
    var _meterId_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _unit_decorators;
    var _unit_initializers = [];
    var _unit_extraInitializers = [];
    var _startDate_decorators;
    var _startDate_initializers = [];
    var _startDate_extraInitializers = [];
    var _endDate_decorators;
    var _endDate_initializers = [];
    var _endDate_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SmartMeterFilterParamsDto() {
                this.meterId = __runInitializers(this, _meterId_initializers, void 0);
                this.propertyId = (__runInitializers(this, _meterId_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.unit = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _unit_initializers, void 0));
                this.startDate = (__runInitializers(this, _unit_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.page = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                __runInitializers(this, _limit_extraInitializers);
            }
            return SmartMeterFilterParamsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _meterId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _propertyId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _unit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(SmartMeterUnit)];
            _startDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _endDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _page_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)()];
            _limit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _meterId_decorators, { kind: "field", name: "meterId", static: false, private: false, access: { has: function (obj) { return "meterId" in obj; }, get: function (obj) { return obj.meterId; }, set: function (obj, value) { obj.meterId = value; } }, metadata: _metadata }, _meterId_initializers, _meterId_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _unit_decorators, { kind: "field", name: "unit", static: false, private: false, access: { has: function (obj) { return "unit" in obj; }, get: function (obj) { return obj.unit; }, set: function (obj, value) { obj.unit = value; } }, metadata: _metadata }, _unit_initializers, _unit_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: function (obj) { return "startDate" in obj; }, get: function (obj) { return obj.startDate; }, set: function (obj, value) { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: function (obj) { return "endDate" in obj; }, get: function (obj) { return obj.endDate; }, set: function (obj, value) { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SmartMeterFilterParamsDto = SmartMeterFilterParamsDto;
var AutomatedBillingDto = function () {
    var _a;
    var _complexId_decorators;
    var _complexId_initializers = [];
    var _complexId_extraInitializers = [];
    var _billingPeriodStart_decorators;
    var _billingPeriodStart_initializers = [];
    var _billingPeriodStart_extraInitializers = [];
    var _billingPeriodEnd_decorators;
    var _billingPeriodEnd_initializers = [];
    var _billingPeriodEnd_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AutomatedBillingDto() {
                this.complexId = __runInitializers(this, _complexId_initializers, void 0);
                this.billingPeriodStart = (__runInitializers(this, _complexId_extraInitializers), __runInitializers(this, _billingPeriodStart_initializers, void 0));
                this.billingPeriodEnd = (__runInitializers(this, _billingPeriodStart_extraInitializers), __runInitializers(this, _billingPeriodEnd_initializers, void 0));
                this.notes = (__runInitializers(this, _billingPeriodEnd_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return AutomatedBillingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _complexId_decorators = [(0, class_validator_1.IsNumber)()];
            _billingPeriodStart_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _billingPeriodEnd_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _complexId_decorators, { kind: "field", name: "complexId", static: false, private: false, access: { has: function (obj) { return "complexId" in obj; }, get: function (obj) { return obj.complexId; }, set: function (obj, value) { obj.complexId = value; } }, metadata: _metadata }, _complexId_initializers, _complexId_extraInitializers);
            __esDecorate(null, null, _billingPeriodStart_decorators, { kind: "field", name: "billingPeriodStart", static: false, private: false, access: { has: function (obj) { return "billingPeriodStart" in obj; }, get: function (obj) { return obj.billingPeriodStart; }, set: function (obj, value) { obj.billingPeriodStart = value; } }, metadata: _metadata }, _billingPeriodStart_initializers, _billingPeriodStart_extraInitializers);
            __esDecorate(null, null, _billingPeriodEnd_decorators, { kind: "field", name: "billingPeriodEnd", static: false, private: false, access: { has: function (obj) { return "billingPeriodEnd" in obj; }, get: function (obj) { return obj.billingPeriodEnd; }, set: function (obj, value) { obj.billingPeriodEnd = value; } }, metadata: _metadata }, _billingPeriodEnd_initializers, _billingPeriodEnd_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AutomatedBillingDto = AutomatedBillingDto;
