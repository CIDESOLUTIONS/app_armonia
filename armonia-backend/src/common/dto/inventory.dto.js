"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.UpdateResidentDto = exports.CreateResidentDto = exports.CreateVehicleDto = exports.CreatePetDto = exports.UpdatePropertyDto = exports.CreatePropertyDto = exports.VehicleWithDetailsDto = exports.PetWithDetailsDto = exports.PropertyWithDetailsDto = exports.ParkingSpotDto = exports.UpdateParkingSpotDto = exports.CreateParkingSpotDto = exports.ParkingSpotStatus = exports.ParkingSpotType = exports.CommonAreaDto = exports.UpdateCommonAreaDto = exports.CreateCommonAreaDto = exports.CommonAreaType = void 0;
var class_validator_1 = require("class-validator");
var CommonAreaType;
(function (CommonAreaType) {
    CommonAreaType["SALON"] = "SALON";
    CommonAreaType["BBQ"] = "BBQ";
    CommonAreaType["COURT"] = "COURT";
    CommonAreaType["POOL"] = "POOL";
    CommonAreaType["GYM"] = "GYM";
    CommonAreaType["OTHER"] = "OTHER";
})(CommonAreaType || (exports.CommonAreaType = CommonAreaType = {}));
var CreateCommonAreaDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _capacity_decorators;
    var _capacity_initializers = [];
    var _capacity_extraInitializers = [];
    var _requiresApproval_decorators;
    var _requiresApproval_initializers = [];
    var _requiresApproval_extraInitializers = [];
    var _hourlyRate_decorators;
    var _hourlyRate_initializers = [];
    var _hourlyRate_extraInitializers = [];
    var _availableDays_decorators;
    var _availableDays_initializers = [];
    var _availableDays_extraInitializers = [];
    var _openingTime_decorators;
    var _openingTime_initializers = [];
    var _openingTime_extraInitializers = [];
    var _closingTime_decorators;
    var _closingTime_initializers = [];
    var _closingTime_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateCommonAreaDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.description = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.type = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.capacity = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _capacity_initializers, void 0));
                this.requiresApproval = (__runInitializers(this, _capacity_extraInitializers), __runInitializers(this, _requiresApproval_initializers, void 0));
                this.hourlyRate = (__runInitializers(this, _requiresApproval_extraInitializers), __runInitializers(this, _hourlyRate_initializers, void 0));
                this.availableDays = (__runInitializers(this, _hourlyRate_extraInitializers), __runInitializers(this, _availableDays_initializers, void 0)); // e.g., ["MONDAY", "TUESDAY"]
                this.openingTime = (__runInitializers(this, _availableDays_extraInitializers), __runInitializers(this, _openingTime_initializers, void 0)); // e.g., "08:00"
                this.closingTime = (__runInitializers(this, _openingTime_extraInitializers), __runInitializers(this, _closingTime_initializers, void 0)); // e.g., "22:00"
                __runInitializers(this, _closingTime_extraInitializers);
            }
            return CreateCommonAreaDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _type_decorators = [(0, class_validator_1.IsEnum)(CommonAreaType)];
            _capacity_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _requiresApproval_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _hourlyRate_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _availableDays_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.IsOptional)()];
            _openingTime_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _closingTime_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _capacity_decorators, { kind: "field", name: "capacity", static: false, private: false, access: { has: function (obj) { return "capacity" in obj; }, get: function (obj) { return obj.capacity; }, set: function (obj, value) { obj.capacity = value; } }, metadata: _metadata }, _capacity_initializers, _capacity_extraInitializers);
            __esDecorate(null, null, _requiresApproval_decorators, { kind: "field", name: "requiresApproval", static: false, private: false, access: { has: function (obj) { return "requiresApproval" in obj; }, get: function (obj) { return obj.requiresApproval; }, set: function (obj, value) { obj.requiresApproval = value; } }, metadata: _metadata }, _requiresApproval_initializers, _requiresApproval_extraInitializers);
            __esDecorate(null, null, _hourlyRate_decorators, { kind: "field", name: "hourlyRate", static: false, private: false, access: { has: function (obj) { return "hourlyRate" in obj; }, get: function (obj) { return obj.hourlyRate; }, set: function (obj, value) { obj.hourlyRate = value; } }, metadata: _metadata }, _hourlyRate_initializers, _hourlyRate_extraInitializers);
            __esDecorate(null, null, _availableDays_decorators, { kind: "field", name: "availableDays", static: false, private: false, access: { has: function (obj) { return "availableDays" in obj; }, get: function (obj) { return obj.availableDays; }, set: function (obj, value) { obj.availableDays = value; } }, metadata: _metadata }, _availableDays_initializers, _availableDays_extraInitializers);
            __esDecorate(null, null, _openingTime_decorators, { kind: "field", name: "openingTime", static: false, private: false, access: { has: function (obj) { return "openingTime" in obj; }, get: function (obj) { return obj.openingTime; }, set: function (obj, value) { obj.openingTime = value; } }, metadata: _metadata }, _openingTime_initializers, _openingTime_extraInitializers);
            __esDecorate(null, null, _closingTime_decorators, { kind: "field", name: "closingTime", static: false, private: false, access: { has: function (obj) { return "closingTime" in obj; }, get: function (obj) { return obj.closingTime; }, set: function (obj, value) { obj.closingTime = value; } }, metadata: _metadata }, _closingTime_initializers, _closingTime_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateCommonAreaDto = CreateCommonAreaDto;
var UpdateCommonAreaDto = /** @class */ (function (_super) {
    __extends(UpdateCommonAreaDto, _super);
    function UpdateCommonAreaDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateCommonAreaDto;
}(PartialType(CreateCommonAreaDto)));
exports.UpdateCommonAreaDto = UpdateCommonAreaDto;
var CommonAreaDto = /** @class */ (function () {
    function CommonAreaDto() {
    }
    return CommonAreaDto;
}());
exports.CommonAreaDto = CommonAreaDto;
var ParkingSpotType;
(function (ParkingSpotType) {
    ParkingSpotType["COVERED"] = "COVERED";
    ParkingSpotType["UNCOVERED"] = "UNCOVERED";
    ParkingSpotType["VISITOR"] = "VISITOR";
    ParkingSpotType["DISABLED"] = "DISABLED";
})(ParkingSpotType || (exports.ParkingSpotType = ParkingSpotType = {}));
var ParkingSpotStatus;
(function (ParkingSpotStatus) {
    ParkingSpotStatus["AVAILABLE"] = "AVAILABLE";
    ParkingSpotStatus["OCCUPIED"] = "OCCUPIED";
    ParkingSpotStatus["RESERVED"] = "RESERVED";
    ParkingSpotStatus["MAINTENANCE"] = "MAINTENANCE";
})(ParkingSpotStatus || (exports.ParkingSpotStatus = ParkingSpotStatus = {}));
var CreateParkingSpotDto = function () {
    var _a;
    var _number_decorators;
    var _number_initializers = [];
    var _number_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _residentId_decorators;
    var _residentId_initializers = [];
    var _residentId_extraInitializers = [];
    var _complexId_decorators;
    var _complexId_initializers = [];
    var _complexId_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateParkingSpotDto() {
                this.number = __runInitializers(this, _number_initializers, void 0);
                this.type = (__runInitializers(this, _number_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.propertyId = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.residentId = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _residentId_initializers, void 0));
                this.complexId = (__runInitializers(this, _residentId_extraInitializers), __runInitializers(this, _complexId_initializers, void 0));
                this.notes = (__runInitializers(this, _complexId_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                __runInitializers(this, _notes_extraInitializers);
            }
            return CreateParkingSpotDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _number_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsEnum)(ParkingSpotType)];
            _status_decorators = [(0, class_validator_1.IsEnum)(ParkingSpotStatus), (0, class_validator_1.IsOptional)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _residentId_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _complexId_decorators = [(0, class_validator_1.IsNumber)()];
            _notes_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _number_decorators, { kind: "field", name: "number", static: false, private: false, access: { has: function (obj) { return "number" in obj; }, get: function (obj) { return obj.number; }, set: function (obj, value) { obj.number = value; } }, metadata: _metadata }, _number_initializers, _number_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _residentId_decorators, { kind: "field", name: "residentId", static: false, private: false, access: { has: function (obj) { return "residentId" in obj; }, get: function (obj) { return obj.residentId; }, set: function (obj, value) { obj.residentId = value; } }, metadata: _metadata }, _residentId_initializers, _residentId_extraInitializers);
            __esDecorate(null, null, _complexId_decorators, { kind: "field", name: "complexId", static: false, private: false, access: { has: function (obj) { return "complexId" in obj; }, get: function (obj) { return obj.complexId; }, set: function (obj, value) { obj.complexId = value; } }, metadata: _metadata }, _complexId_initializers, _complexId_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateParkingSpotDto = CreateParkingSpotDto;
var UpdateParkingSpotDto = /** @class */ (function (_super) {
    __extends(UpdateParkingSpotDto, _super);
    function UpdateParkingSpotDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateParkingSpotDto;
}(PartialType(CreateParkingSpotDto)));
exports.UpdateParkingSpotDto = UpdateParkingSpotDto;
var ParkingSpotDto = /** @class */ (function () {
    function ParkingSpotDto() {
    }
    return ParkingSpotDto;
}());
exports.ParkingSpotDto = ParkingSpotDto;
var PropertyWithDetailsDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _complexId_decorators;
    var _complexId_initializers = [];
    var _complexId_extraInitializers = [];
    var _unitNumber_decorators;
    var _unitNumber_initializers = [];
    var _unitNumber_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _area_decorators;
    var _area_initializers = [];
    var _area_extraInitializers = [];
    var _block_decorators;
    var _block_initializers = [];
    var _block_extraInitializers = [];
    var _zone_decorators;
    var _zone_initializers = [];
    var _zone_extraInitializers = [];
    var _ownerId_decorators;
    var _ownerId_initializers = [];
    var _ownerId_extraInitializers = [];
    var _ownerName_decorators;
    var _ownerName_initializers = [];
    var _ownerName_extraInitializers = [];
    var _ownerEmail_decorators;
    var _ownerEmail_initializers = [];
    var _ownerEmail_extraInitializers = [];
    var _totalResidents_decorators;
    var _totalResidents_initializers = [];
    var _totalResidents_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PropertyWithDetailsDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.complexId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _complexId_initializers, void 0));
                this.unitNumber = (__runInitializers(this, _complexId_extraInitializers), __runInitializers(this, _unitNumber_initializers, void 0));
                this.type = (__runInitializers(this, _unitNumber_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.area = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _area_initializers, void 0));
                this.block = (__runInitializers(this, _area_extraInitializers), __runInitializers(this, _block_initializers, void 0));
                this.zone = (__runInitializers(this, _block_extraInitializers), __runInitializers(this, _zone_initializers, void 0));
                this.ownerId = (__runInitializers(this, _zone_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                this.ownerName = (__runInitializers(this, _ownerId_extraInitializers), __runInitializers(this, _ownerName_initializers, void 0));
                this.ownerEmail = (__runInitializers(this, _ownerName_extraInitializers), __runInitializers(this, _ownerEmail_initializers, void 0));
                this.totalResidents = (__runInitializers(this, _ownerEmail_extraInitializers), __runInitializers(this, _totalResidents_initializers, void 0));
                this.createdAt = (__runInitializers(this, _totalResidents_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
            return PropertyWithDetailsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _complexId_decorators = [(0, class_validator_1.IsNumber)()];
            _unitNumber_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsString)()];
            _area_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _block_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _zone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _ownerId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _ownerName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _ownerEmail_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _totalResidents_decorators = [(0, class_validator_1.IsNumber)()];
            _createdAt_decorators = [(0, class_validator_1.IsDateString)()];
            _updatedAt_decorators = [(0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _complexId_decorators, { kind: "field", name: "complexId", static: false, private: false, access: { has: function (obj) { return "complexId" in obj; }, get: function (obj) { return obj.complexId; }, set: function (obj, value) { obj.complexId = value; } }, metadata: _metadata }, _complexId_initializers, _complexId_extraInitializers);
            __esDecorate(null, null, _unitNumber_decorators, { kind: "field", name: "unitNumber", static: false, private: false, access: { has: function (obj) { return "unitNumber" in obj; }, get: function (obj) { return obj.unitNumber; }, set: function (obj, value) { obj.unitNumber = value; } }, metadata: _metadata }, _unitNumber_initializers, _unitNumber_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _area_decorators, { kind: "field", name: "area", static: false, private: false, access: { has: function (obj) { return "area" in obj; }, get: function (obj) { return obj.area; }, set: function (obj, value) { obj.area = value; } }, metadata: _metadata }, _area_initializers, _area_extraInitializers);
            __esDecorate(null, null, _block_decorators, { kind: "field", name: "block", static: false, private: false, access: { has: function (obj) { return "block" in obj; }, get: function (obj) { return obj.block; }, set: function (obj, value) { obj.block = value; } }, metadata: _metadata }, _block_initializers, _block_extraInitializers);
            __esDecorate(null, null, _zone_decorators, { kind: "field", name: "zone", static: false, private: false, access: { has: function (obj) { return "zone" in obj; }, get: function (obj) { return obj.zone; }, set: function (obj, value) { obj.zone = value; } }, metadata: _metadata }, _zone_initializers, _zone_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: function (obj) { return "ownerId" in obj; }, get: function (obj) { return obj.ownerId; }, set: function (obj, value) { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            __esDecorate(null, null, _ownerName_decorators, { kind: "field", name: "ownerName", static: false, private: false, access: { has: function (obj) { return "ownerName" in obj; }, get: function (obj) { return obj.ownerName; }, set: function (obj, value) { obj.ownerName = value; } }, metadata: _metadata }, _ownerName_initializers, _ownerName_extraInitializers);
            __esDecorate(null, null, _ownerEmail_decorators, { kind: "field", name: "ownerEmail", static: false, private: false, access: { has: function (obj) { return "ownerEmail" in obj; }, get: function (obj) { return obj.ownerEmail; }, set: function (obj, value) { obj.ownerEmail = value; } }, metadata: _metadata }, _ownerEmail_initializers, _ownerEmail_extraInitializers);
            __esDecorate(null, null, _totalResidents_decorators, { kind: "field", name: "totalResidents", static: false, private: false, access: { has: function (obj) { return "totalResidents" in obj; }, get: function (obj) { return obj.totalResidents; }, set: function (obj, value) { obj.totalResidents = value; } }, metadata: _metadata }, _totalResidents_initializers, _totalResidents_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PropertyWithDetailsDto = PropertyWithDetailsDto;
var PetWithDetailsDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _breed_decorators;
    var _breed_initializers = [];
    var _breed_extraInitializers = [];
    var _age_decorators;
    var _age_initializers = [];
    var _age_extraInitializers = [];
    var _weight_decorators;
    var _weight_initializers = [];
    var _weight_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _vaccinated_decorators;
    var _vaccinated_initializers = [];
    var _vaccinated_extraInitializers = [];
    var _vaccineExpiryDate_decorators;
    var _vaccineExpiryDate_initializers = [];
    var _vaccineExpiryDate_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _residentId_decorators;
    var _residentId_initializers = [];
    var _residentId_extraInitializers = [];
    var _unitNumber_decorators;
    var _unitNumber_initializers = [];
    var _unitNumber_extraInitializers = [];
    var _residentName_decorators;
    var _residentName_initializers = [];
    var _residentName_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PetWithDetailsDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.breed = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _breed_initializers, void 0));
                this.age = (__runInitializers(this, _breed_extraInitializers), __runInitializers(this, _age_initializers, void 0));
                this.weight = (__runInitializers(this, _age_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                this.color = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.vaccinated = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _vaccinated_initializers, void 0));
                this.vaccineExpiryDate = (__runInitializers(this, _vaccinated_extraInitializers), __runInitializers(this, _vaccineExpiryDate_initializers, void 0));
                this.notes = (__runInitializers(this, _vaccineExpiryDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.propertyId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.residentId = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _residentId_initializers, void 0));
                this.unitNumber = (__runInitializers(this, _residentId_extraInitializers), __runInitializers(this, _unitNumber_initializers, void 0));
                this.residentName = (__runInitializers(this, _unitNumber_extraInitializers), __runInitializers(this, _residentName_initializers, void 0));
                this.createdAt = (__runInitializers(this, _residentName_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                __runInitializers(this, _createdAt_extraInitializers);
            }
            return PetWithDetailsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _name_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsString)()];
            _breed_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _age_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _weight_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _color_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _vaccinated_decorators = [(0, class_validator_1.IsBoolean)()];
            _vaccineExpiryDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)()];
            _residentId_decorators = [(0, class_validator_1.IsNumber)()];
            _unitNumber_decorators = [(0, class_validator_1.IsString)()];
            _residentName_decorators = [(0, class_validator_1.IsString)()];
            _createdAt_decorators = [(0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _breed_decorators, { kind: "field", name: "breed", static: false, private: false, access: { has: function (obj) { return "breed" in obj; }, get: function (obj) { return obj.breed; }, set: function (obj, value) { obj.breed = value; } }, metadata: _metadata }, _breed_initializers, _breed_extraInitializers);
            __esDecorate(null, null, _age_decorators, { kind: "field", name: "age", static: false, private: false, access: { has: function (obj) { return "age" in obj; }, get: function (obj) { return obj.age; }, set: function (obj, value) { obj.age = value; } }, metadata: _metadata }, _age_initializers, _age_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: function (obj) { return "weight" in obj; }, get: function (obj) { return obj.weight; }, set: function (obj, value) { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _vaccinated_decorators, { kind: "field", name: "vaccinated", static: false, private: false, access: { has: function (obj) { return "vaccinated" in obj; }, get: function (obj) { return obj.vaccinated; }, set: function (obj, value) { obj.vaccinated = value; } }, metadata: _metadata }, _vaccinated_initializers, _vaccinated_extraInitializers);
            __esDecorate(null, null, _vaccineExpiryDate_decorators, { kind: "field", name: "vaccineExpiryDate", static: false, private: false, access: { has: function (obj) { return "vaccineExpiryDate" in obj; }, get: function (obj) { return obj.vaccineExpiryDate; }, set: function (obj, value) { obj.vaccineExpiryDate = value; } }, metadata: _metadata }, _vaccineExpiryDate_initializers, _vaccineExpiryDate_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _residentId_decorators, { kind: "field", name: "residentId", static: false, private: false, access: { has: function (obj) { return "residentId" in obj; }, get: function (obj) { return obj.residentId; }, set: function (obj, value) { obj.residentId = value; } }, metadata: _metadata }, _residentId_initializers, _residentId_extraInitializers);
            __esDecorate(null, null, _unitNumber_decorators, { kind: "field", name: "unitNumber", static: false, private: false, access: { has: function (obj) { return "unitNumber" in obj; }, get: function (obj) { return obj.unitNumber; }, set: function (obj, value) { obj.unitNumber = value; } }, metadata: _metadata }, _unitNumber_initializers, _unitNumber_extraInitializers);
            __esDecorate(null, null, _residentName_decorators, { kind: "field", name: "residentName", static: false, private: false, access: { has: function (obj) { return "residentName" in obj; }, get: function (obj) { return obj.residentName; }, set: function (obj, value) { obj.residentName = value; } }, metadata: _metadata }, _residentName_initializers, _residentName_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PetWithDetailsDto = PetWithDetailsDto;
var VehicleWithDetailsDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _licensePlate_decorators;
    var _licensePlate_initializers = [];
    var _licensePlate_extraInitializers = [];
    var _brand_decorators;
    var _brand_initializers = [];
    var _brand_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _parkingSpot_decorators;
    var _parkingSpot_initializers = [];
    var _parkingSpot_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _residentId_decorators;
    var _residentId_initializers = [];
    var _residentId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function VehicleWithDetailsDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.licensePlate = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _licensePlate_initializers, void 0));
                this.brand = (__runInitializers(this, _licensePlate_extraInitializers), __runInitializers(this, _brand_initializers, void 0));
                this.model = (__runInitializers(this, _brand_extraInitializers), __runInitializers(this, _model_initializers, void 0));
                this.year = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.color = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.type = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.parkingSpot = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _parkingSpot_initializers, void 0));
                this.notes = (__runInitializers(this, _parkingSpot_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.propertyId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.residentId = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _residentId_initializers, void 0));
                __runInitializers(this, _residentId_extraInitializers);
            }
            return VehicleWithDetailsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _licensePlate_decorators = [(0, class_validator_1.IsString)()];
            _brand_decorators = [(0, class_validator_1.IsString)()];
            _model_decorators = [(0, class_validator_1.IsString)()];
            _year_decorators = [(0, class_validator_1.IsNumber)()];
            _color_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsString)()];
            _parkingSpot_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)()];
            _residentId_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _licensePlate_decorators, { kind: "field", name: "licensePlate", static: false, private: false, access: { has: function (obj) { return "licensePlate" in obj; }, get: function (obj) { return obj.licensePlate; }, set: function (obj, value) { obj.licensePlate = value; } }, metadata: _metadata }, _licensePlate_initializers, _licensePlate_extraInitializers);
            __esDecorate(null, null, _brand_decorators, { kind: "field", name: "brand", static: false, private: false, access: { has: function (obj) { return "brand" in obj; }, get: function (obj) { return obj.brand; }, set: function (obj, value) { obj.brand = value; } }, metadata: _metadata }, _brand_initializers, _brand_extraInitializers);
            __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _parkingSpot_decorators, { kind: "field", name: "parkingSpot", static: false, private: false, access: { has: function (obj) { return "parkingSpot" in obj; }, get: function (obj) { return obj.parkingSpot; }, set: function (obj, value) { obj.parkingSpot = value; } }, metadata: _metadata }, _parkingSpot_initializers, _parkingSpot_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _residentId_decorators, { kind: "field", name: "residentId", static: false, private: false, access: { has: function (obj) { return "residentId" in obj; }, get: function (obj) { return obj.residentId; }, set: function (obj, value) { obj.residentId = value; } }, metadata: _metadata }, _residentId_initializers, _residentId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.VehicleWithDetailsDto = VehicleWithDetailsDto;
var CreatePropertyDto = function () {
    var _a;
    var _complexId_decorators;
    var _complexId_initializers = [];
    var _complexId_extraInitializers = [];
    var _unitNumber_decorators;
    var _unitNumber_initializers = [];
    var _unitNumber_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _area_decorators;
    var _area_initializers = [];
    var _area_extraInitializers = [];
    var _block_decorators;
    var _block_initializers = [];
    var _block_extraInitializers = [];
    var _zone_decorators;
    var _zone_initializers = [];
    var _zone_extraInitializers = [];
    var _ownerId_decorators;
    var _ownerId_initializers = [];
    var _ownerId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePropertyDto() {
                this.complexId = __runInitializers(this, _complexId_initializers, void 0);
                this.unitNumber = (__runInitializers(this, _complexId_extraInitializers), __runInitializers(this, _unitNumber_initializers, void 0));
                this.type = (__runInitializers(this, _unitNumber_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.area = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _area_initializers, void 0));
                this.block = (__runInitializers(this, _area_extraInitializers), __runInitializers(this, _block_initializers, void 0));
                this.zone = (__runInitializers(this, _block_extraInitializers), __runInitializers(this, _zone_initializers, void 0));
                this.ownerId = (__runInitializers(this, _zone_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                __runInitializers(this, _ownerId_extraInitializers);
            }
            return CreatePropertyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _complexId_decorators = [(0, class_validator_1.IsNumber)()];
            _unitNumber_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsString)()];
            _area_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _block_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _zone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _ownerId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _complexId_decorators, { kind: "field", name: "complexId", static: false, private: false, access: { has: function (obj) { return "complexId" in obj; }, get: function (obj) { return obj.complexId; }, set: function (obj, value) { obj.complexId = value; } }, metadata: _metadata }, _complexId_initializers, _complexId_extraInitializers);
            __esDecorate(null, null, _unitNumber_decorators, { kind: "field", name: "unitNumber", static: false, private: false, access: { has: function (obj) { return "unitNumber" in obj; }, get: function (obj) { return obj.unitNumber; }, set: function (obj, value) { obj.unitNumber = value; } }, metadata: _metadata }, _unitNumber_initializers, _unitNumber_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _area_decorators, { kind: "field", name: "area", static: false, private: false, access: { has: function (obj) { return "area" in obj; }, get: function (obj) { return obj.area; }, set: function (obj, value) { obj.area = value; } }, metadata: _metadata }, _area_initializers, _area_extraInitializers);
            __esDecorate(null, null, _block_decorators, { kind: "field", name: "block", static: false, private: false, access: { has: function (obj) { return "block" in obj; }, get: function (obj) { return obj.block; }, set: function (obj, value) { obj.block = value; } }, metadata: _metadata }, _block_initializers, _block_extraInitializers);
            __esDecorate(null, null, _zone_decorators, { kind: "field", name: "zone", static: false, private: false, access: { has: function (obj) { return "zone" in obj; }, get: function (obj) { return obj.zone; }, set: function (obj, value) { obj.zone = value; } }, metadata: _metadata }, _zone_initializers, _zone_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: function (obj) { return "ownerId" in obj; }, get: function (obj) { return obj.ownerId; }, set: function (obj, value) { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePropertyDto = CreatePropertyDto;
var UpdatePropertyDto = function () {
    var _a;
    var _unitNumber_decorators;
    var _unitNumber_initializers = [];
    var _unitNumber_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _area_decorators;
    var _area_initializers = [];
    var _area_extraInitializers = [];
    var _block_decorators;
    var _block_initializers = [];
    var _block_extraInitializers = [];
    var _zone_decorators;
    var _zone_initializers = [];
    var _zone_extraInitializers = [];
    var _ownerId_decorators;
    var _ownerId_initializers = [];
    var _ownerId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePropertyDto() {
                this.unitNumber = __runInitializers(this, _unitNumber_initializers, void 0);
                this.type = (__runInitializers(this, _unitNumber_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.status = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.area = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _area_initializers, void 0));
                this.block = (__runInitializers(this, _area_extraInitializers), __runInitializers(this, _block_initializers, void 0));
                this.zone = (__runInitializers(this, _block_extraInitializers), __runInitializers(this, _zone_initializers, void 0));
                this.ownerId = (__runInitializers(this, _zone_extraInitializers), __runInitializers(this, _ownerId_initializers, void 0));
                __runInitializers(this, _ownerId_extraInitializers);
            }
            return UpdatePropertyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _unitNumber_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _area_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _block_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _zone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _ownerId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _unitNumber_decorators, { kind: "field", name: "unitNumber", static: false, private: false, access: { has: function (obj) { return "unitNumber" in obj; }, get: function (obj) { return obj.unitNumber; }, set: function (obj, value) { obj.unitNumber = value; } }, metadata: _metadata }, _unitNumber_initializers, _unitNumber_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _area_decorators, { kind: "field", name: "area", static: false, private: false, access: { has: function (obj) { return "area" in obj; }, get: function (obj) { return obj.area; }, set: function (obj, value) { obj.area = value; } }, metadata: _metadata }, _area_initializers, _area_extraInitializers);
            __esDecorate(null, null, _block_decorators, { kind: "field", name: "block", static: false, private: false, access: { has: function (obj) { return "block" in obj; }, get: function (obj) { return obj.block; }, set: function (obj, value) { obj.block = value; } }, metadata: _metadata }, _block_initializers, _block_extraInitializers);
            __esDecorate(null, null, _zone_decorators, { kind: "field", name: "zone", static: false, private: false, access: { has: function (obj) { return "zone" in obj; }, get: function (obj) { return obj.zone; }, set: function (obj, value) { obj.zone = value; } }, metadata: _metadata }, _zone_initializers, _zone_extraInitializers);
            __esDecorate(null, null, _ownerId_decorators, { kind: "field", name: "ownerId", static: false, private: false, access: { has: function (obj) { return "ownerId" in obj; }, get: function (obj) { return obj.ownerId; }, set: function (obj, value) { obj.ownerId = value; } }, metadata: _metadata }, _ownerId_initializers, _ownerId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePropertyDto = UpdatePropertyDto;
var CreatePetDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _breed_decorators;
    var _breed_initializers = [];
    var _breed_extraInitializers = [];
    var _age_decorators;
    var _age_initializers = [];
    var _age_extraInitializers = [];
    var _weight_decorators;
    var _weight_initializers = [];
    var _weight_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _vaccinated_decorators;
    var _vaccinated_initializers = [];
    var _vaccinated_extraInitializers = [];
    var _vaccineExpiryDate_decorators;
    var _vaccineExpiryDate_initializers = [];
    var _vaccineExpiryDate_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _residentId_decorators;
    var _residentId_initializers = [];
    var _residentId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePetDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.type = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.breed = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _breed_initializers, void 0));
                this.age = (__runInitializers(this, _breed_extraInitializers), __runInitializers(this, _age_initializers, void 0));
                this.weight = (__runInitializers(this, _age_extraInitializers), __runInitializers(this, _weight_initializers, void 0));
                this.color = (__runInitializers(this, _weight_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.vaccinated = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _vaccinated_initializers, void 0));
                this.vaccineExpiryDate = (__runInitializers(this, _vaccinated_extraInitializers), __runInitializers(this, _vaccineExpiryDate_initializers, void 0));
                this.notes = (__runInitializers(this, _vaccineExpiryDate_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.propertyId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.residentId = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _residentId_initializers, void 0));
                __runInitializers(this, _residentId_extraInitializers);
            }
            return CreatePetDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsString)()];
            _breed_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _age_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _weight_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _color_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _vaccinated_decorators = [(0, class_validator_1.IsBoolean)()];
            _vaccineExpiryDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)()];
            _residentId_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _breed_decorators, { kind: "field", name: "breed", static: false, private: false, access: { has: function (obj) { return "breed" in obj; }, get: function (obj) { return obj.breed; }, set: function (obj, value) { obj.breed = value; } }, metadata: _metadata }, _breed_initializers, _breed_extraInitializers);
            __esDecorate(null, null, _age_decorators, { kind: "field", name: "age", static: false, private: false, access: { has: function (obj) { return "age" in obj; }, get: function (obj) { return obj.age; }, set: function (obj, value) { obj.age = value; } }, metadata: _metadata }, _age_initializers, _age_extraInitializers);
            __esDecorate(null, null, _weight_decorators, { kind: "field", name: "weight", static: false, private: false, access: { has: function (obj) { return "weight" in obj; }, get: function (obj) { return obj.weight; }, set: function (obj, value) { obj.weight = value; } }, metadata: _metadata }, _weight_initializers, _weight_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _vaccinated_decorators, { kind: "field", name: "vaccinated", static: false, private: false, access: { has: function (obj) { return "vaccinated" in obj; }, get: function (obj) { return obj.vaccinated; }, set: function (obj, value) { obj.vaccinated = value; } }, metadata: _metadata }, _vaccinated_initializers, _vaccinated_extraInitializers);
            __esDecorate(null, null, _vaccineExpiryDate_decorators, { kind: "field", name: "vaccineExpiryDate", static: false, private: false, access: { has: function (obj) { return "vaccineExpiryDate" in obj; }, get: function (obj) { return obj.vaccineExpiryDate; }, set: function (obj, value) { obj.vaccineExpiryDate = value; } }, metadata: _metadata }, _vaccineExpiryDate_initializers, _vaccineExpiryDate_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _residentId_decorators, { kind: "field", name: "residentId", static: false, private: false, access: { has: function (obj) { return "residentId" in obj; }, get: function (obj) { return obj.residentId; }, set: function (obj, value) { obj.residentId = value; } }, metadata: _metadata }, _residentId_initializers, _residentId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePetDto = CreatePetDto;
var CreateVehicleDto = function () {
    var _a;
    var _complexId_decorators;
    var _complexId_initializers = [];
    var _complexId_extraInitializers = [];
    var _licensePlate_decorators;
    var _licensePlate_initializers = [];
    var _licensePlate_extraInitializers = [];
    var _brand_decorators;
    var _brand_initializers = [];
    var _brand_extraInitializers = [];
    var _model_decorators;
    var _model_initializers = [];
    var _model_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _color_decorators;
    var _color_initializers = [];
    var _color_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _parkingSpot_decorators;
    var _parkingSpot_initializers = [];
    var _parkingSpot_extraInitializers = [];
    var _notes_decorators;
    var _notes_initializers = [];
    var _notes_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _residentId_decorators;
    var _residentId_initializers = [];
    var _residentId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateVehicleDto() {
                this.complexId = __runInitializers(this, _complexId_initializers, void 0);
                this.licensePlate = (__runInitializers(this, _complexId_extraInitializers), __runInitializers(this, _licensePlate_initializers, void 0));
                this.brand = (__runInitializers(this, _licensePlate_extraInitializers), __runInitializers(this, _brand_initializers, void 0));
                this.model = (__runInitializers(this, _brand_extraInitializers), __runInitializers(this, _model_initializers, void 0));
                this.year = (__runInitializers(this, _model_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.color = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _color_initializers, void 0));
                this.type = (__runInitializers(this, _color_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.parkingSpot = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _parkingSpot_initializers, void 0));
                this.notes = (__runInitializers(this, _parkingSpot_extraInitializers), __runInitializers(this, _notes_initializers, void 0));
                this.propertyId = (__runInitializers(this, _notes_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.residentId = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _residentId_initializers, void 0));
                __runInitializers(this, _residentId_extraInitializers);
            }
            return CreateVehicleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _complexId_decorators = [(0, class_validator_1.IsNumber)()];
            _licensePlate_decorators = [(0, class_validator_1.IsString)()];
            _brand_decorators = [(0, class_validator_1.IsString)()];
            _model_decorators = [(0, class_validator_1.IsString)()];
            _year_decorators = [(0, class_validator_1.IsNumber)()];
            _color_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsString)()];
            _parkingSpot_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _notes_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)()];
            _residentId_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _complexId_decorators, { kind: "field", name: "complexId", static: false, private: false, access: { has: function (obj) { return "complexId" in obj; }, get: function (obj) { return obj.complexId; }, set: function (obj, value) { obj.complexId = value; } }, metadata: _metadata }, _complexId_initializers, _complexId_extraInitializers);
            __esDecorate(null, null, _licensePlate_decorators, { kind: "field", name: "licensePlate", static: false, private: false, access: { has: function (obj) { return "licensePlate" in obj; }, get: function (obj) { return obj.licensePlate; }, set: function (obj, value) { obj.licensePlate = value; } }, metadata: _metadata }, _licensePlate_initializers, _licensePlate_extraInitializers);
            __esDecorate(null, null, _brand_decorators, { kind: "field", name: "brand", static: false, private: false, access: { has: function (obj) { return "brand" in obj; }, get: function (obj) { return obj.brand; }, set: function (obj, value) { obj.brand = value; } }, metadata: _metadata }, _brand_initializers, _brand_extraInitializers);
            __esDecorate(null, null, _model_decorators, { kind: "field", name: "model", static: false, private: false, access: { has: function (obj) { return "model" in obj; }, get: function (obj) { return obj.model; }, set: function (obj, value) { obj.model = value; } }, metadata: _metadata }, _model_initializers, _model_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _color_decorators, { kind: "field", name: "color", static: false, private: false, access: { has: function (obj) { return "color" in obj; }, get: function (obj) { return obj.color; }, set: function (obj, value) { obj.color = value; } }, metadata: _metadata }, _color_initializers, _color_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _parkingSpot_decorators, { kind: "field", name: "parkingSpot", static: false, private: false, access: { has: function (obj) { return "parkingSpot" in obj; }, get: function (obj) { return obj.parkingSpot; }, set: function (obj, value) { obj.parkingSpot = value; } }, metadata: _metadata }, _parkingSpot_initializers, _parkingSpot_extraInitializers);
            __esDecorate(null, null, _notes_decorators, { kind: "field", name: "notes", static: false, private: false, access: { has: function (obj) { return "notes" in obj; }, get: function (obj) { return obj.notes; }, set: function (obj, value) { obj.notes = value; } }, metadata: _metadata }, _notes_initializers, _notes_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _residentId_decorators, { kind: "field", name: "residentId", static: false, private: false, access: { has: function (obj) { return "residentId" in obj; }, get: function (obj) { return obj.residentId; }, set: function (obj, value) { obj.residentId = value; } }, metadata: _metadata }, _residentId_initializers, _residentId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateVehicleDto = CreateVehicleDto;
var CreateResidentDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _idNumber_decorators;
    var _idNumber_initializers = [];
    var _idNumber_extraInitializers = [];
    var _idType_decorators;
    var _idType_initializers = [];
    var _idType_extraInitializers = [];
    var _isOwner_decorators;
    var _isOwner_initializers = [];
    var _isOwner_extraInitializers = [];
    var _relationshipWithOwner_decorators;
    var _relationshipWithOwner_initializers = [];
    var _relationshipWithOwner_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateResidentDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.propertyId = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.role = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.isActive = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                this.idNumber = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _idNumber_initializers, void 0));
                this.idType = (__runInitializers(this, _idNumber_extraInitializers), __runInitializers(this, _idType_initializers, void 0));
                this.isOwner = (__runInitializers(this, _idType_extraInitializers), __runInitializers(this, _isOwner_initializers, void 0));
                this.relationshipWithOwner = (__runInitializers(this, _isOwner_extraInitializers), __runInitializers(this, _relationshipWithOwner_initializers, void 0));
                __runInitializers(this, _relationshipWithOwner_extraInitializers);
            }
            return CreateResidentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)()];
            _email_decorators = [(0, class_validator_1.IsString)()];
            _phone_decorators = [(0, class_validator_1.IsString)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)()];
            _role_decorators = [(0, class_validator_1.IsString)()];
            _isActive_decorators = [(0, class_validator_1.IsBoolean)()];
            _idNumber_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _idType_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _isOwner_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _relationshipWithOwner_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _idNumber_decorators, { kind: "field", name: "idNumber", static: false, private: false, access: { has: function (obj) { return "idNumber" in obj; }, get: function (obj) { return obj.idNumber; }, set: function (obj, value) { obj.idNumber = value; } }, metadata: _metadata }, _idNumber_initializers, _idNumber_extraInitializers);
            __esDecorate(null, null, _idType_decorators, { kind: "field", name: "idType", static: false, private: false, access: { has: function (obj) { return "idType" in obj; }, get: function (obj) { return obj.idType; }, set: function (obj, value) { obj.idType = value; } }, metadata: _metadata }, _idType_initializers, _idType_extraInitializers);
            __esDecorate(null, null, _isOwner_decorators, { kind: "field", name: "isOwner", static: false, private: false, access: { has: function (obj) { return "isOwner" in obj; }, get: function (obj) { return obj.isOwner; }, set: function (obj, value) { obj.isOwner = value; } }, metadata: _metadata }, _isOwner_initializers, _isOwner_extraInitializers);
            __esDecorate(null, null, _relationshipWithOwner_decorators, { kind: "field", name: "relationshipWithOwner", static: false, private: false, access: { has: function (obj) { return "relationshipWithOwner" in obj; }, get: function (obj) { return obj.relationshipWithOwner; }, set: function (obj, value) { obj.relationshipWithOwner = value; } }, metadata: _metadata }, _relationshipWithOwner_initializers, _relationshipWithOwner_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateResidentDto = CreateResidentDto;
var UpdateResidentDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _email_decorators;
    var _email_initializers = [];
    var _email_extraInitializers = [];
    var _phone_decorators;
    var _phone_initializers = [];
    var _phone_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _role_decorators;
    var _role_initializers = [];
    var _role_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _idNumber_decorators;
    var _idNumber_initializers = [];
    var _idNumber_extraInitializers = [];
    var _idType_decorators;
    var _idType_initializers = [];
    var _idType_extraInitializers = [];
    var _isOwner_decorators;
    var _isOwner_initializers = [];
    var _isOwner_extraInitializers = [];
    var _relationshipWithOwner_decorators;
    var _relationshipWithOwner_initializers = [];
    var _relationshipWithOwner_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateResidentDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.email = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _email_initializers, void 0));
                this.phone = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _phone_initializers, void 0));
                this.propertyId = (__runInitializers(this, _phone_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.role = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _role_initializers, void 0));
                this.isActive = (__runInitializers(this, _role_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                this.idNumber = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _idNumber_initializers, void 0));
                this.idType = (__runInitializers(this, _idNumber_extraInitializers), __runInitializers(this, _idType_initializers, void 0));
                this.isOwner = (__runInitializers(this, _idType_extraInitializers), __runInitializers(this, _isOwner_initializers, void 0));
                this.relationshipWithOwner = (__runInitializers(this, _isOwner_extraInitializers), __runInitializers(this, _relationshipWithOwner_initializers, void 0));
                __runInitializers(this, _relationshipWithOwner_extraInitializers);
            }
            return UpdateResidentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _email_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _phone_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _propertyId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _role_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _isActive_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _idNumber_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _idType_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _isOwner_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _relationshipWithOwner_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: function (obj) { return "email" in obj; }, get: function (obj) { return obj.email; }, set: function (obj, value) { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
            __esDecorate(null, null, _phone_decorators, { kind: "field", name: "phone", static: false, private: false, access: { has: function (obj) { return "phone" in obj; }, get: function (obj) { return obj.phone; }, set: function (obj, value) { obj.phone = value; } }, metadata: _metadata }, _phone_initializers, _phone_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _role_decorators, { kind: "field", name: "role", static: false, private: false, access: { has: function (obj) { return "role" in obj; }, get: function (obj) { return obj.role; }, set: function (obj, value) { obj.role = value; } }, metadata: _metadata }, _role_initializers, _role_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _idNumber_decorators, { kind: "field", name: "idNumber", static: false, private: false, access: { has: function (obj) { return "idNumber" in obj; }, get: function (obj) { return obj.idNumber; }, set: function (obj, value) { obj.idNumber = value; } }, metadata: _metadata }, _idNumber_initializers, _idNumber_extraInitializers);
            __esDecorate(null, null, _idType_decorators, { kind: "field", name: "idType", static: false, private: false, access: { has: function (obj) { return "idType" in obj; }, get: function (obj) { return obj.idType; }, set: function (obj, value) { obj.idType = value; } }, metadata: _metadata }, _idType_initializers, _idType_extraInitializers);
            __esDecorate(null, null, _isOwner_decorators, { kind: "field", name: "isOwner", static: false, private: false, access: { has: function (obj) { return "isOwner" in obj; }, get: function (obj) { return obj.isOwner; }, set: function (obj, value) { obj.isOwner = value; } }, metadata: _metadata }, _isOwner_initializers, _isOwner_extraInitializers);
            __esDecorate(null, null, _relationshipWithOwner_decorators, { kind: "field", name: "relationshipWithOwner", static: false, private: false, access: { has: function (obj) { return "relationshipWithOwner" in obj; }, get: function (obj) { return obj.relationshipWithOwner; }, set: function (obj, value) { obj.relationshipWithOwner = value; } }, metadata: _metadata }, _relationshipWithOwner_initializers, _relationshipWithOwner_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateResidentDto = UpdateResidentDto;
