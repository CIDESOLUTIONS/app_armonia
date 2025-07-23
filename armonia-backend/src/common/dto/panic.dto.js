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
exports.CreatePanicResponseDto = exports.UpdatePanicAlertDto = exports.CreatePanicAlertDto = void 0;
var class_validator_1 = require("class-validator");
var panic_enum_1 = require("@backend/common/enums/panic.enum");
var CreatePanicAlertDto = function () {
    var _a;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _complexId_decorators;
    var _complexId_initializers = [];
    var _complexId_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePanicAlertDto() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.complexId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _complexId_initializers, void 0));
                this.propertyId = (__runInitializers(this, _complexId_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.type = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.location = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.description = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
            return CreatePanicAlertDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, class_validator_1.IsNumber)()];
            _complexId_decorators = [(0, class_validator_1.IsNumber)()];
            _propertyId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _type_decorators = [(0, class_validator_1.IsEnum)(panic_enum_1.PanicType)];
            _location_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _complexId_decorators, { kind: "field", name: "complexId", static: false, private: false, access: { has: function (obj) { return "complexId" in obj; }, get: function (obj) { return obj.complexId; }, set: function (obj, value) { obj.complexId = value; } }, metadata: _metadata }, _complexId_initializers, _complexId_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePanicAlertDto = CreatePanicAlertDto;
var UpdatePanicAlertDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _resolvedTime_decorators;
    var _resolvedTime_initializers = [];
    var _resolvedTime_extraInitializers = [];
    var _resolvedById_decorators;
    var _resolvedById_initializers = [];
    var _resolvedById_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePanicAlertDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.resolvedTime = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _resolvedTime_initializers, void 0));
                this.resolvedById = (__runInitializers(this, _resolvedTime_extraInitializers), __runInitializers(this, _resolvedById_initializers, void 0));
                this.location = (__runInitializers(this, _resolvedById_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.description = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                __runInitializers(this, _description_extraInitializers);
            }
            return UpdatePanicAlertDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(panic_enum_1.PanicStatus)];
            _resolvedTime_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _resolvedById_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _location_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _resolvedTime_decorators, { kind: "field", name: "resolvedTime", static: false, private: false, access: { has: function (obj) { return "resolvedTime" in obj; }, get: function (obj) { return obj.resolvedTime; }, set: function (obj, value) { obj.resolvedTime = value; } }, metadata: _metadata }, _resolvedTime_initializers, _resolvedTime_extraInitializers);
            __esDecorate(null, null, _resolvedById_decorators, { kind: "field", name: "resolvedById", static: false, private: false, access: { has: function (obj) { return "resolvedById" in obj; }, get: function (obj) { return obj.resolvedById; }, set: function (obj, value) { obj.resolvedById = value; } }, metadata: _metadata }, _resolvedById_initializers, _resolvedById_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePanicAlertDto = UpdatePanicAlertDto;
var CreatePanicResponseDto = function () {
    var _a;
    var _alertId_decorators;
    var _alertId_initializers = [];
    var _alertId_extraInitializers = [];
    var _respondedBy_decorators;
    var _respondedBy_initializers = [];
    var _respondedBy_extraInitializers = [];
    var _actionTaken_decorators;
    var _actionTaken_initializers = [];
    var _actionTaken_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePanicResponseDto() {
                this.alertId = __runInitializers(this, _alertId_initializers, void 0);
                this.respondedBy = (__runInitializers(this, _alertId_extraInitializers), __runInitializers(this, _respondedBy_initializers, void 0));
                this.actionTaken = (__runInitializers(this, _respondedBy_extraInitializers), __runInitializers(this, _actionTaken_initializers, void 0));
                this.notes = (__runInitializers(this, _actionTaken_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return CreatePanicResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _alertId_decorators = [(0, class_validator_1.IsNumber)()];
            _respondedBy_decorators = [(0, class_validator_1.IsNumber)()];
            _actionTaken_decorators = [(0, class_validator_1.IsString)()];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _alertId_decorators, { kind: "field", name: "alertId", static: false, private: false, access: { has: function (obj) { return "alertId" in obj; }, get: function (obj) { return obj.alertId; }, set: function (obj, value) { obj.alertId = value; } }, metadata: _metadata }, _alertId_initializers, _alertId_extraInitializers);
            __esDecorate(null, null, _respondedBy_decorators, { kind: "field", name: "respondedBy", static: false, private: false, access: { has: function (obj) { return "respondedBy" in obj; }, get: function (obj) { return obj.respondedBy; }, set: function (obj, value) { obj.respondedBy = value; } }, metadata: _metadata }, _respondedBy_initializers, _respondedBy_extraInitializers);
            __esDecorate(null, null, _actionTaken_decorators, { kind: "field", name: "actionTaken", static: false, private: false, access: { has: function (obj) { return "actionTaken" in obj; }, get: function (obj) { return obj.actionTaken; }, set: function (obj, value) { obj.actionTaken = value; } }, metadata: _metadata }, _actionTaken_initializers, _actionTaken_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePanicResponseDto = CreatePanicResponseDto;
