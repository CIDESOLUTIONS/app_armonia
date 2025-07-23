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
exports.CreateAccessAttemptDto = exports.CreateSecurityLogDto = void 0;
var class_validator_1 = require("class-validator");
var security_event_type_enum_1 = require("@backend/common/enums/security-event-type.enum");
var CreateSecurityLogDto = function () {
    var _a;
    var _complexId_decorators;
    var _complexId_initializers = [];
    var _complexId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _eventType_decorators;
    var _eventType_initializers = [];
    var _eventType_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _ipAddress_decorators;
    var _ipAddress_initializers = [];
    var _ipAddress_extraInitializers = [];
    var _userAgent_decorators;
    var _userAgent_initializers = [];
    var _userAgent_extraInitializers = [];
    var _details_decorators;
    var _details_initializers = [];
    var _details_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateSecurityLogDto() {
                this.complexId = __runInitializers(this, _complexId_initializers, void 0);
                this.userId = (__runInitializers(this, _complexId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.eventType = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
                this.description = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.ipAddress = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
                this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
                this.details = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _details_initializers, void 0));
                __runInitializers(this, _details_extraInitializers);
            }
            return CreateSecurityLogDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _complexId_decorators = [(0, class_validator_1.IsNumber)()];
            _userId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _eventType_decorators = [(0, class_validator_1.IsEnum)(security_event_type_enum_1.SecurityEventType)];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _ipAddress_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _userAgent_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _details_decorators = [(0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _complexId_decorators, { kind: "field", name: "complexId", static: false, private: false, access: { has: function (obj) { return "complexId" in obj; }, get: function (obj) { return obj.complexId; }, set: function (obj, value) { obj.complexId = value; } }, metadata: _metadata }, _complexId_initializers, _complexId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: function (obj) { return "eventType" in obj; }, get: function (obj) { return obj.eventType; }, set: function (obj, value) { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: function (obj) { return "ipAddress" in obj; }, get: function (obj) { return obj.ipAddress; }, set: function (obj, value) { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: function (obj) { return "userAgent" in obj; }, get: function (obj) { return obj.userAgent; }, set: function (obj, value) { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
            __esDecorate(null, null, _details_decorators, { kind: "field", name: "details", static: false, private: false, access: { has: function (obj) { return "details" in obj; }, get: function (obj) { return obj.details; }, set: function (obj, value) { obj.details = value; } }, metadata: _metadata }, _details_initializers, _details_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSecurityLogDto = CreateSecurityLogDto;
var CreateAccessAttemptDto = function () {
    var _a;
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _ipAddress_decorators;
    var _ipAddress_initializers = [];
    var _ipAddress_extraInitializers = [];
    var _userAgent_decorators;
    var _userAgent_initializers = [];
    var _userAgent_extraInitializers = [];
    var _success_decorators;
    var _success_initializers = [];
    var _success_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateAccessAttemptDto() {
                this.userId = __runInitializers(this, _userId_initializers, void 0);
                this.ipAddress = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _ipAddress_initializers, void 0));
                this.userAgent = (__runInitializers(this, _ipAddress_extraInitializers), __runInitializers(this, _userAgent_initializers, void 0));
                this.success = (__runInitializers(this, _userAgent_extraInitializers), __runInitializers(this, _success_initializers, void 0));
                this.reason = (__runInitializers(this, _success_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
            return CreateAccessAttemptDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _userId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _ipAddress_decorators = [(0, class_validator_1.IsString)()];
            _userAgent_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _success_decorators = [(0, class_validator_1.IsBoolean)()];
            _reason_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _ipAddress_decorators, { kind: "field", name: "ipAddress", static: false, private: false, access: { has: function (obj) { return "ipAddress" in obj; }, get: function (obj) { return obj.ipAddress; }, set: function (obj, value) { obj.ipAddress = value; } }, metadata: _metadata }, _ipAddress_initializers, _ipAddress_extraInitializers);
            __esDecorate(null, null, _userAgent_decorators, { kind: "field", name: "userAgent", static: false, private: false, access: { has: function (obj) { return "userAgent" in obj; }, get: function (obj) { return obj.userAgent; }, set: function (obj, value) { obj.userAgent = value; } }, metadata: _metadata }, _userAgent_initializers, _userAgent_extraInitializers);
            __esDecorate(null, null, _success_decorators, { kind: "field", name: "success", static: false, private: false, access: { has: function (obj) { return "success" in obj; }, get: function (obj) { return obj.success; }, set: function (obj, value) { obj.success = value; } }, metadata: _metadata }, _success_initializers, _success_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateAccessAttemptDto = CreateAccessAttemptDto;
