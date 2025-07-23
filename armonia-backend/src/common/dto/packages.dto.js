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
exports.PackageFilterParamsDto = exports.PackageDto = exports.UpdatePackageDto = exports.RegisterPackageDto = exports.PackageStatus = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var PackageStatus;
(function (PackageStatus) {
    PackageStatus["REGISTERED"] = "REGISTERED";
    PackageStatus["DELIVERED"] = "DELIVERED";
    PackageStatus["RETURNED"] = "RETURNED";
})(PackageStatus || (exports.PackageStatus = PackageStatus = {}));
var RegisterPackageDto = function () {
    var _a;
    var _trackingNumber_decorators;
    var _trackingNumber_initializers = [];
    var _trackingNumber_extraInitializers = [];
    var _recipientUnit_decorators;
    var _recipientUnit_initializers = [];
    var _recipientUnit_extraInitializers = [];
    var _sender_decorators;
    var _sender_initializers = [];
    var _sender_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _deliveryPersonName_decorators;
    var _deliveryPersonName_initializers = [];
    var _deliveryPersonName_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterPackageDto() {
                this.trackingNumber = __runInitializers(this, _trackingNumber_initializers, void 0);
                this.recipientUnit = (__runInitializers(this, _trackingNumber_extraInitializers), __runInitializers(this, _recipientUnit_initializers, void 0));
                this.sender = (__runInitializers(this, _recipientUnit_extraInitializers), __runInitializers(this, _sender_initializers, void 0));
                this.description = (__runInitializers(this, _sender_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.deliveryPersonName = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _deliveryPersonName_initializers, void 0));
                __runInitializers(this, _deliveryPersonName_extraInitializers);
            }
            return RegisterPackageDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _trackingNumber_decorators = [(0, class_validator_1.IsString)()];
            _recipientUnit_decorators = [(0, class_validator_1.IsString)()];
            _sender_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _deliveryPersonName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _trackingNumber_decorators, { kind: "field", name: "trackingNumber", static: false, private: false, access: { has: function (obj) { return "trackingNumber" in obj; }, get: function (obj) { return obj.trackingNumber; }, set: function (obj, value) { obj.trackingNumber = value; } }, metadata: _metadata }, _trackingNumber_initializers, _trackingNumber_extraInitializers);
            __esDecorate(null, null, _recipientUnit_decorators, { kind: "field", name: "recipientUnit", static: false, private: false, access: { has: function (obj) { return "recipientUnit" in obj; }, get: function (obj) { return obj.recipientUnit; }, set: function (obj, value) { obj.recipientUnit = value; } }, metadata: _metadata }, _recipientUnit_initializers, _recipientUnit_extraInitializers);
            __esDecorate(null, null, _sender_decorators, { kind: "field", name: "sender", static: false, private: false, access: { has: function (obj) { return "sender" in obj; }, get: function (obj) { return obj.sender; }, set: function (obj, value) { obj.sender = value; } }, metadata: _metadata }, _sender_initializers, _sender_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _deliveryPersonName_decorators, { kind: "field", name: "deliveryPersonName", static: false, private: false, access: { has: function (obj) { return "deliveryPersonName" in obj; }, get: function (obj) { return obj.deliveryPersonName; }, set: function (obj, value) { obj.deliveryPersonName = value; } }, metadata: _metadata }, _deliveryPersonName_initializers, _deliveryPersonName_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterPackageDto = RegisterPackageDto;
var UpdatePackageDto = function () {
    var _a;
    var _trackingNumber_decorators;
    var _trackingNumber_initializers = [];
    var _trackingNumber_extraInitializers = [];
    var _recipientUnit_decorators;
    var _recipientUnit_initializers = [];
    var _recipientUnit_extraInitializers = [];
    var _sender_decorators;
    var _sender_initializers = [];
    var _sender_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _deliveryPersonName_decorators;
    var _deliveryPersonName_initializers = [];
    var _deliveryPersonName_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _deliveryDate_decorators;
    var _deliveryDate_initializers = [];
    var _deliveryDate_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePackageDto() {
                this.trackingNumber = __runInitializers(this, _trackingNumber_initializers, void 0);
                this.recipientUnit = (__runInitializers(this, _trackingNumber_extraInitializers), __runInitializers(this, _recipientUnit_initializers, void 0));
                this.sender = (__runInitializers(this, _recipientUnit_extraInitializers), __runInitializers(this, _sender_initializers, void 0));
                this.description = (__runInitializers(this, _sender_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.deliveryPersonName = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _deliveryPersonName_initializers, void 0));
                this.status = (__runInitializers(this, _deliveryPersonName_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.deliveryDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _deliveryDate_initializers, void 0));
                __runInitializers(this, _deliveryDate_extraInitializers);
            }
            return UpdatePackageDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _trackingNumber_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _recipientUnit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sender_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _deliveryPersonName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PackageStatus)];
            _deliveryDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _trackingNumber_decorators, { kind: "field", name: "trackingNumber", static: false, private: false, access: { has: function (obj) { return "trackingNumber" in obj; }, get: function (obj) { return obj.trackingNumber; }, set: function (obj, value) { obj.trackingNumber = value; } }, metadata: _metadata }, _trackingNumber_initializers, _trackingNumber_extraInitializers);
            __esDecorate(null, null, _recipientUnit_decorators, { kind: "field", name: "recipientUnit", static: false, private: false, access: { has: function (obj) { return "recipientUnit" in obj; }, get: function (obj) { return obj.recipientUnit; }, set: function (obj, value) { obj.recipientUnit = value; } }, metadata: _metadata }, _recipientUnit_initializers, _recipientUnit_extraInitializers);
            __esDecorate(null, null, _sender_decorators, { kind: "field", name: "sender", static: false, private: false, access: { has: function (obj) { return "sender" in obj; }, get: function (obj) { return obj.sender; }, set: function (obj, value) { obj.sender = value; } }, metadata: _metadata }, _sender_initializers, _sender_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _deliveryPersonName_decorators, { kind: "field", name: "deliveryPersonName", static: false, private: false, access: { has: function (obj) { return "deliveryPersonName" in obj; }, get: function (obj) { return obj.deliveryPersonName; }, set: function (obj, value) { obj.deliveryPersonName = value; } }, metadata: _metadata }, _deliveryPersonName_initializers, _deliveryPersonName_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _deliveryDate_decorators, { kind: "field", name: "deliveryDate", static: false, private: false, access: { has: function (obj) { return "deliveryDate" in obj; }, get: function (obj) { return obj.deliveryDate; }, set: function (obj, value) { obj.deliveryDate = value; } }, metadata: _metadata }, _deliveryDate_initializers, _deliveryDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePackageDto = UpdatePackageDto;
var PackageDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _trackingNumber_decorators;
    var _trackingNumber_initializers = [];
    var _trackingNumber_extraInitializers = [];
    var _recipientUnit_decorators;
    var _recipientUnit_initializers = [];
    var _recipientUnit_extraInitializers = [];
    var _sender_decorators;
    var _sender_initializers = [];
    var _sender_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _deliveryPersonName_decorators;
    var _deliveryPersonName_initializers = [];
    var _deliveryPersonName_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _registrationDate_decorators;
    var _registrationDate_initializers = [];
    var _registrationDate_extraInitializers = [];
    var _deliveryDate_decorators;
    var _deliveryDate_initializers = [];
    var _deliveryDate_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PackageDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.trackingNumber = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _trackingNumber_initializers, void 0));
                this.recipientUnit = (__runInitializers(this, _trackingNumber_extraInitializers), __runInitializers(this, _recipientUnit_initializers, void 0));
                this.sender = (__runInitializers(this, _recipientUnit_extraInitializers), __runInitializers(this, _sender_initializers, void 0));
                this.description = (__runInitializers(this, _sender_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.deliveryPersonName = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _deliveryPersonName_initializers, void 0));
                this.status = (__runInitializers(this, _deliveryPersonName_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.registrationDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _registrationDate_initializers, void 0));
                this.deliveryDate = (__runInitializers(this, _registrationDate_extraInitializers), __runInitializers(this, _deliveryDate_initializers, void 0));
                this.createdAt = (__runInitializers(this, _deliveryDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
            return PackageDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _trackingNumber_decorators = [(0, class_validator_1.IsString)()];
            _recipientUnit_decorators = [(0, class_validator_1.IsString)()];
            _sender_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _deliveryPersonName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsEnum)(PackageStatus)];
            _registrationDate_decorators = [(0, class_validator_1.IsDateString)()];
            _deliveryDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _createdAt_decorators = [(0, class_validator_1.IsString)()];
            _updatedAt_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _trackingNumber_decorators, { kind: "field", name: "trackingNumber", static: false, private: false, access: { has: function (obj) { return "trackingNumber" in obj; }, get: function (obj) { return obj.trackingNumber; }, set: function (obj, value) { obj.trackingNumber = value; } }, metadata: _metadata }, _trackingNumber_initializers, _trackingNumber_extraInitializers);
            __esDecorate(null, null, _recipientUnit_decorators, { kind: "field", name: "recipientUnit", static: false, private: false, access: { has: function (obj) { return "recipientUnit" in obj; }, get: function (obj) { return obj.recipientUnit; }, set: function (obj, value) { obj.recipientUnit = value; } }, metadata: _metadata }, _recipientUnit_initializers, _recipientUnit_extraInitializers);
            __esDecorate(null, null, _sender_decorators, { kind: "field", name: "sender", static: false, private: false, access: { has: function (obj) { return "sender" in obj; }, get: function (obj) { return obj.sender; }, set: function (obj, value) { obj.sender = value; } }, metadata: _metadata }, _sender_initializers, _sender_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _deliveryPersonName_decorators, { kind: "field", name: "deliveryPersonName", static: false, private: false, access: { has: function (obj) { return "deliveryPersonName" in obj; }, get: function (obj) { return obj.deliveryPersonName; }, set: function (obj, value) { obj.deliveryPersonName = value; } }, metadata: _metadata }, _deliveryPersonName_initializers, _deliveryPersonName_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _registrationDate_decorators, { kind: "field", name: "registrationDate", static: false, private: false, access: { has: function (obj) { return "registrationDate" in obj; }, get: function (obj) { return obj.registrationDate; }, set: function (obj, value) { obj.registrationDate = value; } }, metadata: _metadata }, _registrationDate_initializers, _registrationDate_extraInitializers);
            __esDecorate(null, null, _deliveryDate_decorators, { kind: "field", name: "deliveryDate", static: false, private: false, access: { has: function (obj) { return "deliveryDate" in obj; }, get: function (obj) { return obj.deliveryDate; }, set: function (obj, value) { obj.deliveryDate = value; } }, metadata: _metadata }, _deliveryDate_initializers, _deliveryDate_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PackageDto = PackageDto;
var PackageFilterParamsDto = function () {
    var _a;
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _recipientUnit_decorators;
    var _recipientUnit_initializers = [];
    var _recipientUnit_extraInitializers = [];
    var _sender_decorators;
    var _sender_initializers = [];
    var _sender_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PackageFilterParamsDto() {
                this.search = __runInitializers(this, _search_initializers, void 0);
                this.status = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.recipientUnit = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _recipientUnit_initializers, void 0));
                this.sender = (__runInitializers(this, _recipientUnit_extraInitializers), __runInitializers(this, _sender_initializers, void 0));
                this.page = (__runInitializers(this, _sender_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                __runInitializers(this, _limit_extraInitializers);
            }
            return PackageFilterParamsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _search_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PackageStatus)];
            _recipientUnit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _sender_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _page_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)()];
            _limit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _recipientUnit_decorators, { kind: "field", name: "recipientUnit", static: false, private: false, access: { has: function (obj) { return "recipientUnit" in obj; }, get: function (obj) { return obj.recipientUnit; }, set: function (obj, value) { obj.recipientUnit = value; } }, metadata: _metadata }, _recipientUnit_initializers, _recipientUnit_extraInitializers);
            __esDecorate(null, null, _sender_decorators, { kind: "field", name: "sender", static: false, private: false, access: { has: function (obj) { return "sender" in obj; }, get: function (obj) { return obj.sender; }, set: function (obj, value) { obj.sender = value; } }, metadata: _metadata }, _sender_initializers, _sender_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PackageFilterParamsDto = PackageFilterParamsDto;
