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
exports.ScanQrCodeDto = exports.VisitorFilterParamsDto = exports.VisitorDto = exports.UpdateVisitorDto = exports.CreateVisitorDto = exports.PreRegistrationStatus = exports.VisitorStatus = exports.VisitorDocumentType = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var VisitorDocumentType;
(function (VisitorDocumentType) {
    VisitorDocumentType["CC"] = "cc";
    VisitorDocumentType["CE"] = "ce";
    VisitorDocumentType["PASSPORT"] = "passport";
    VisitorDocumentType["OTHER"] = "other";
})(VisitorDocumentType || (exports.VisitorDocumentType = VisitorDocumentType = {}));
var VisitorStatus;
(function (VisitorStatus) {
    VisitorStatus["ACTIVE"] = "active";
    VisitorStatus["DEPARTED"] = "departed";
})(VisitorStatus || (exports.VisitorStatus = VisitorStatus = {}));
var PreRegistrationStatus;
(function (PreRegistrationStatus) {
    PreRegistrationStatus["ACTIVE"] = "active";
    PreRegistrationStatus["USED"] = "used";
    PreRegistrationStatus["EXPIRED"] = "expired";
    PreRegistrationStatus["CANCELLED"] = "cancelled";
})(PreRegistrationStatus || (exports.PreRegistrationStatus = PreRegistrationStatus = {}));
var CreateVisitorDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _documentType_decorators;
    var _documentType_initializers = [];
    var _documentType_extraInitializers = [];
    var _documentNumber_decorators;
    var _documentNumber_initializers = [];
    var _documentNumber_extraInitializers = [];
    var _destination_decorators;
    var _destination_initializers = [];
    var _destination_extraInitializers = [];
    var _residentName_decorators;
    var _residentName_initializers = [];
    var _residentName_extraInitializers = [];
    var _plate_decorators;
    var _plate_initializers = [];
    var _plate_extraInitializers = [];
    var _photoUrl_decorators;
    var _photoUrl_initializers = [];
    var _photoUrl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateVisitorDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.documentType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
                this.documentNumber = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
                this.destination = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _destination_initializers, void 0));
                this.residentName = (__runInitializers(this, _destination_extraInitializers), __runInitializers(this, _residentName_initializers, void 0));
                this.plate = (__runInitializers(this, _residentName_extraInitializers), __runInitializers(this, _plate_initializers, void 0));
                this.photoUrl = (__runInitializers(this, _plate_extraInitializers), __runInitializers(this, _photoUrl_initializers, void 0));
                __runInitializers(this, _photoUrl_extraInitializers);
            }
            return CreateVisitorDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)()];
            _documentType_decorators = [(0, class_validator_1.IsEnum)(VisitorDocumentType)];
            _documentNumber_decorators = [(0, class_validator_1.IsString)()];
            _destination_decorators = [(0, class_validator_1.IsString)()];
            _residentName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _plate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _photoUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: function (obj) { return "documentType" in obj; }, get: function (obj) { return obj.documentType; }, set: function (obj, value) { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
            __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: function (obj) { return "documentNumber" in obj; }, get: function (obj) { return obj.documentNumber; }, set: function (obj, value) { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
            __esDecorate(null, null, _destination_decorators, { kind: "field", name: "destination", static: false, private: false, access: { has: function (obj) { return "destination" in obj; }, get: function (obj) { return obj.destination; }, set: function (obj, value) { obj.destination = value; } }, metadata: _metadata }, _destination_initializers, _destination_extraInitializers);
            __esDecorate(null, null, _residentName_decorators, { kind: "field", name: "residentName", static: false, private: false, access: { has: function (obj) { return "residentName" in obj; }, get: function (obj) { return obj.residentName; }, set: function (obj, value) { obj.residentName = value; } }, metadata: _metadata }, _residentName_initializers, _residentName_extraInitializers);
            __esDecorate(null, null, _plate_decorators, { kind: "field", name: "plate", static: false, private: false, access: { has: function (obj) { return "plate" in obj; }, get: function (obj) { return obj.plate; }, set: function (obj, value) { obj.plate = value; } }, metadata: _metadata }, _plate_initializers, _plate_extraInitializers);
            __esDecorate(null, null, _photoUrl_decorators, { kind: "field", name: "photoUrl", static: false, private: false, access: { has: function (obj) { return "photoUrl" in obj; }, get: function (obj) { return obj.photoUrl; }, set: function (obj, value) { obj.photoUrl = value; } }, metadata: _metadata }, _photoUrl_initializers, _photoUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateVisitorDto = CreateVisitorDto;
var UpdateVisitorDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _documentType_decorators;
    var _documentType_initializers = [];
    var _documentType_extraInitializers = [];
    var _documentNumber_decorators;
    var _documentNumber_initializers = [];
    var _documentNumber_extraInitializers = [];
    var _destination_decorators;
    var _destination_initializers = [];
    var _destination_extraInitializers = [];
    var _residentName_decorators;
    var _residentName_initializers = [];
    var _residentName_extraInitializers = [];
    var _plate_decorators;
    var _plate_initializers = [];
    var _plate_extraInitializers = [];
    var _photoUrl_decorators;
    var _photoUrl_initializers = [];
    var _photoUrl_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _exitTime_decorators;
    var _exitTime_initializers = [];
    var _exitTime_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateVisitorDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.documentType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
                this.documentNumber = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
                this.destination = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _destination_initializers, void 0));
                this.residentName = (__runInitializers(this, _destination_extraInitializers), __runInitializers(this, _residentName_initializers, void 0));
                this.plate = (__runInitializers(this, _residentName_extraInitializers), __runInitializers(this, _plate_initializers, void 0));
                this.photoUrl = (__runInitializers(this, _plate_extraInitializers), __runInitializers(this, _photoUrl_initializers, void 0));
                this.status = (__runInitializers(this, _photoUrl_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.exitTime = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _exitTime_initializers, void 0));
                __runInitializers(this, _exitTime_extraInitializers);
            }
            return UpdateVisitorDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _documentType_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(VisitorDocumentType)];
            _documentNumber_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _destination_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _residentName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _plate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _photoUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(VisitorStatus)];
            _exitTime_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: function (obj) { return "documentType" in obj; }, get: function (obj) { return obj.documentType; }, set: function (obj, value) { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
            __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: function (obj) { return "documentNumber" in obj; }, get: function (obj) { return obj.documentNumber; }, set: function (obj, value) { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
            __esDecorate(null, null, _destination_decorators, { kind: "field", name: "destination", static: false, private: false, access: { has: function (obj) { return "destination" in obj; }, get: function (obj) { return obj.destination; }, set: function (obj, value) { obj.destination = value; } }, metadata: _metadata }, _destination_initializers, _destination_extraInitializers);
            __esDecorate(null, null, _residentName_decorators, { kind: "field", name: "residentName", static: false, private: false, access: { has: function (obj) { return "residentName" in obj; }, get: function (obj) { return obj.residentName; }, set: function (obj, value) { obj.residentName = value; } }, metadata: _metadata }, _residentName_initializers, _residentName_extraInitializers);
            __esDecorate(null, null, _plate_decorators, { kind: "field", name: "plate", static: false, private: false, access: { has: function (obj) { return "plate" in obj; }, get: function (obj) { return obj.plate; }, set: function (obj, value) { obj.plate = value; } }, metadata: _metadata }, _plate_initializers, _plate_extraInitializers);
            __esDecorate(null, null, _photoUrl_decorators, { kind: "field", name: "photoUrl", static: false, private: false, access: { has: function (obj) { return "photoUrl" in obj; }, get: function (obj) { return obj.photoUrl; }, set: function (obj, value) { obj.photoUrl = value; } }, metadata: _metadata }, _photoUrl_initializers, _photoUrl_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _exitTime_decorators, { kind: "field", name: "exitTime", static: false, private: false, access: { has: function (obj) { return "exitTime" in obj; }, get: function (obj) { return obj.exitTime; }, set: function (obj, value) { obj.exitTime = value; } }, metadata: _metadata }, _exitTime_initializers, _exitTime_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateVisitorDto = UpdateVisitorDto;
var VisitorDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _documentType_decorators;
    var _documentType_initializers = [];
    var _documentType_extraInitializers = [];
    var _documentNumber_decorators;
    var _documentNumber_initializers = [];
    var _documentNumber_extraInitializers = [];
    var _destination_decorators;
    var _destination_initializers = [];
    var _destination_extraInitializers = [];
    var _residentName_decorators;
    var _residentName_initializers = [];
    var _residentName_extraInitializers = [];
    var _plate_decorators;
    var _plate_initializers = [];
    var _plate_extraInitializers = [];
    var _photoUrl_decorators;
    var _photoUrl_initializers = [];
    var _photoUrl_extraInitializers = [];
    var _entryTime_decorators;
    var _entryTime_initializers = [];
    var _entryTime_extraInitializers = [];
    var _exitTime_decorators;
    var _exitTime_initializers = [];
    var _exitTime_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VisitorDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.documentType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
                this.documentNumber = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
                this.destination = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _destination_initializers, void 0));
                this.residentName = (__runInitializers(this, _destination_extraInitializers), __runInitializers(this, _residentName_initializers, void 0));
                this.plate = (__runInitializers(this, _residentName_extraInitializers), __runInitializers(this, _plate_initializers, void 0));
                this.photoUrl = (__runInitializers(this, _plate_extraInitializers), __runInitializers(this, _photoUrl_initializers, void 0));
                this.entryTime = (__runInitializers(this, _photoUrl_extraInitializers), __runInitializers(this, _entryTime_initializers, void 0));
                this.exitTime = (__runInitializers(this, _entryTime_extraInitializers), __runInitializers(this, _exitTime_initializers, void 0));
                this.status = (__runInitializers(this, _exitTime_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.createdAt = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
            return VisitorDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _name_decorators = [(0, class_validator_1.IsString)()];
            _documentType_decorators = [(0, class_validator_1.IsEnum)(VisitorDocumentType)];
            _documentNumber_decorators = [(0, class_validator_1.IsString)()];
            _destination_decorators = [(0, class_validator_1.IsString)()];
            _residentName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _plate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _photoUrl_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _entryTime_decorators = [(0, class_validator_1.IsDateString)()];
            _exitTime_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _status_decorators = [(0, class_validator_1.IsEnum)(VisitorStatus)];
            _createdAt_decorators = [(0, class_validator_1.IsString)()];
            _updatedAt_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: function (obj) { return "documentType" in obj; }, get: function (obj) { return obj.documentType; }, set: function (obj, value) { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
            __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: function (obj) { return "documentNumber" in obj; }, get: function (obj) { return obj.documentNumber; }, set: function (obj, value) { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
            __esDecorate(null, null, _destination_decorators, { kind: "field", name: "destination", static: false, private: false, access: { has: function (obj) { return "destination" in obj; }, get: function (obj) { return obj.destination; }, set: function (obj, value) { obj.destination = value; } }, metadata: _metadata }, _destination_initializers, _destination_extraInitializers);
            __esDecorate(null, null, _residentName_decorators, { kind: "field", name: "residentName", static: false, private: false, access: { has: function (obj) { return "residentName" in obj; }, get: function (obj) { return obj.residentName; }, set: function (obj, value) { obj.residentName = value; } }, metadata: _metadata }, _residentName_initializers, _residentName_extraInitializers);
            __esDecorate(null, null, _plate_decorators, { kind: "field", name: "plate", static: false, private: false, access: { has: function (obj) { return "plate" in obj; }, get: function (obj) { return obj.plate; }, set: function (obj, value) { obj.plate = value; } }, metadata: _metadata }, _plate_initializers, _plate_extraInitializers);
            __esDecorate(null, null, _photoUrl_decorators, { kind: "field", name: "photoUrl", static: false, private: false, access: { has: function (obj) { return "photoUrl" in obj; }, get: function (obj) { return obj.photoUrl; }, set: function (obj, value) { obj.photoUrl = value; } }, metadata: _metadata }, _photoUrl_initializers, _photoUrl_extraInitializers);
            __esDecorate(null, null, _entryTime_decorators, { kind: "field", name: "entryTime", static: false, private: false, access: { has: function (obj) { return "entryTime" in obj; }, get: function (obj) { return obj.entryTime; }, set: function (obj, value) { obj.entryTime = value; } }, metadata: _metadata }, _entryTime_initializers, _entryTime_extraInitializers);
            __esDecorate(null, null, _exitTime_decorators, { kind: "field", name: "exitTime", static: false, private: false, access: { has: function (obj) { return "exitTime" in obj; }, get: function (obj) { return obj.exitTime; }, set: function (obj, value) { obj.exitTime = value; } }, metadata: _metadata }, _exitTime_initializers, _exitTime_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VisitorDto = VisitorDto;
var VisitorFilterParamsDto = function () {
    var _a;
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _documentType_decorators;
    var _documentType_initializers = [];
    var _documentType_extraInitializers = [];
    var _documentNumber_decorators;
    var _documentNumber_initializers = [];
    var _documentNumber_extraInitializers = [];
    var _destination_decorators;
    var _destination_initializers = [];
    var _destination_extraInitializers = [];
    var _residentName_decorators;
    var _residentName_initializers = [];
    var _residentName_extraInitializers = [];
    var _plate_decorators;
    var _plate_initializers = [];
    var _plate_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VisitorFilterParamsDto() {
                this.search = __runInitializers(this, _search_initializers, void 0);
                this.status = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.documentType = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _documentType_initializers, void 0));
                this.documentNumber = (__runInitializers(this, _documentType_extraInitializers), __runInitializers(this, _documentNumber_initializers, void 0));
                this.destination = (__runInitializers(this, _documentNumber_extraInitializers), __runInitializers(this, _destination_initializers, void 0));
                this.residentName = (__runInitializers(this, _destination_extraInitializers), __runInitializers(this, _residentName_initializers, void 0));
                this.plate = (__runInitializers(this, _residentName_extraInitializers), __runInitializers(this, _plate_initializers, void 0));
                this.page = (__runInitializers(this, _plate_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                __runInitializers(this, _limit_extraInitializers);
            }
            return VisitorFilterParamsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _search_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(VisitorStatus)];
            _documentType_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(VisitorDocumentType)];
            _documentNumber_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _destination_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _residentName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _plate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _page_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)()];
            _limit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _documentType_decorators, { kind: "field", name: "documentType", static: false, private: false, access: { has: function (obj) { return "documentType" in obj; }, get: function (obj) { return obj.documentType; }, set: function (obj, value) { obj.documentType = value; } }, metadata: _metadata }, _documentType_initializers, _documentType_extraInitializers);
            __esDecorate(null, null, _documentNumber_decorators, { kind: "field", name: "documentNumber", static: false, private: false, access: { has: function (obj) { return "documentNumber" in obj; }, get: function (obj) { return obj.documentNumber; }, set: function (obj, value) { obj.documentNumber = value; } }, metadata: _metadata }, _documentNumber_initializers, _documentNumber_extraInitializers);
            __esDecorate(null, null, _destination_decorators, { kind: "field", name: "destination", static: false, private: false, access: { has: function (obj) { return "destination" in obj; }, get: function (obj) { return obj.destination; }, set: function (obj, value) { obj.destination = value; } }, metadata: _metadata }, _destination_initializers, _destination_extraInitializers);
            __esDecorate(null, null, _residentName_decorators, { kind: "field", name: "residentName", static: false, private: false, access: { has: function (obj) { return "residentName" in obj; }, get: function (obj) { return obj.residentName; }, set: function (obj, value) { obj.residentName = value; } }, metadata: _metadata }, _residentName_initializers, _residentName_extraInitializers);
            __esDecorate(null, null, _plate_decorators, { kind: "field", name: "plate", static: false, private: false, access: { has: function (obj) { return "plate" in obj; }, get: function (obj) { return obj.plate; }, set: function (obj, value) { obj.plate = value; } }, metadata: _metadata }, _plate_initializers, _plate_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VisitorFilterParamsDto = VisitorFilterParamsDto;
var ScanQrCodeDto = function () {
    var _a;
    var _qrCode_decorators;
    var _qrCode_initializers = [];
    var _qrCode_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ScanQrCodeDto() {
                this.qrCode = __runInitializers(this, _qrCode_initializers, void 0);
                __runInitializers(this, _qrCode_extraInitializers);
            }
            return ScanQrCodeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _qrCode_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _qrCode_decorators, { kind: "field", name: "qrCode", static: false, private: false, access: { has: function (obj) { return "qrCode" in obj; }, get: function (obj) { return obj.qrCode; }, set: function (obj, value) { obj.qrCode = value; } }, metadata: _metadata }, _qrCode_initializers, _qrCode_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ScanQrCodeDto = ScanQrCodeDto;
