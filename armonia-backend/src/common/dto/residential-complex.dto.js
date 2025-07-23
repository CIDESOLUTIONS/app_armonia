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
exports.UpdateResidentialComplexDto = exports.CreateResidentialComplexDto = exports.ResidentialComplexDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var ResidentialComplexDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _country_decorators;
    var _country_initializers = [];
    var _country_extraInitializers = [];
    var _schemaName_decorators;
    var _schemaName_initializers = [];
    var _schemaName_extraInitializers = [];
    var _adminId_decorators;
    var _adminId_initializers = [];
    var _adminId_extraInitializers = [];
    var _contactEmail_decorators;
    var _contactEmail_initializers = [];
    var _contactEmail_extraInitializers = [];
    var _contactPhone_decorators;
    var _contactPhone_initializers = [];
    var _contactPhone_extraInitializers = [];
    var _logoUrl_decorators;
    var _logoUrl_initializers = [];
    var _logoUrl_extraInitializers = [];
    var _primaryColor_decorators;
    var _primaryColor_initializers = [];
    var _primaryColor_extraInitializers = [];
    var _secondaryColor_decorators;
    var _secondaryColor_initializers = [];
    var _secondaryColor_extraInitializers = [];
    var _planId_decorators;
    var _planId_initializers = [];
    var _planId_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ResidentialComplexDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.name = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _name_initializers, void 0));
                this.address = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.city = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.country = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _country_initializers, void 0));
                this.schemaName = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _schemaName_initializers, void 0));
                this.adminId = (__runInitializers(this, _schemaName_extraInitializers), __runInitializers(this, _adminId_initializers, void 0));
                this.contactEmail = (__runInitializers(this, _adminId_extraInitializers), __runInitializers(this, _contactEmail_initializers, void 0));
                this.contactPhone = (__runInitializers(this, _contactEmail_extraInitializers), __runInitializers(this, _contactPhone_initializers, void 0));
                this.logoUrl = (__runInitializers(this, _contactPhone_extraInitializers), __runInitializers(this, _logoUrl_initializers, void 0));
                this.primaryColor = (__runInitializers(this, _logoUrl_extraInitializers), __runInitializers(this, _primaryColor_initializers, void 0));
                this.secondaryColor = (__runInitializers(this, _primaryColor_extraInitializers), __runInitializers(this, _secondaryColor_initializers, void 0));
                this.planId = (__runInitializers(this, _secondaryColor_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
                this.isActive = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                this.createdAt = (__runInitializers(this, _isActive_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
            return ResidentialComplexDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, swagger_1.ApiProperty)()];
            _name_decorators = [(0, swagger_1.ApiProperty)()];
            _address_decorators = [(0, swagger_1.ApiProperty)()];
            _city_decorators = [(0, swagger_1.ApiProperty)()];
            _country_decorators = [(0, swagger_1.ApiProperty)()];
            _schemaName_decorators = [(0, swagger_1.ApiProperty)()];
            _adminId_decorators = [(0, swagger_1.ApiProperty)()];
            _contactEmail_decorators = [(0, swagger_1.ApiProperty)()];
            _contactPhone_decorators = [(0, swagger_1.ApiProperty)()];
            _logoUrl_decorators = [(0, swagger_1.ApiProperty)({ required: false, nullable: true })];
            _primaryColor_decorators = [(0, swagger_1.ApiProperty)({ required: false, nullable: true })];
            _secondaryColor_decorators = [(0, swagger_1.ApiProperty)({ required: false, nullable: true })];
            _planId_decorators = [(0, swagger_1.ApiProperty)()];
            _isActive_decorators = [(0, swagger_1.ApiProperty)()];
            _createdAt_decorators = [(0, swagger_1.ApiProperty)()];
            _updatedAt_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: function (obj) { return "country" in obj; }, get: function (obj) { return obj.country; }, set: function (obj, value) { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            __esDecorate(null, null, _schemaName_decorators, { kind: "field", name: "schemaName", static: false, private: false, access: { has: function (obj) { return "schemaName" in obj; }, get: function (obj) { return obj.schemaName; }, set: function (obj, value) { obj.schemaName = value; } }, metadata: _metadata }, _schemaName_initializers, _schemaName_extraInitializers);
            __esDecorate(null, null, _adminId_decorators, { kind: "field", name: "adminId", static: false, private: false, access: { has: function (obj) { return "adminId" in obj; }, get: function (obj) { return obj.adminId; }, set: function (obj, value) { obj.adminId = value; } }, metadata: _metadata }, _adminId_initializers, _adminId_extraInitializers);
            __esDecorate(null, null, _contactEmail_decorators, { kind: "field", name: "contactEmail", static: false, private: false, access: { has: function (obj) { return "contactEmail" in obj; }, get: function (obj) { return obj.contactEmail; }, set: function (obj, value) { obj.contactEmail = value; } }, metadata: _metadata }, _contactEmail_initializers, _contactEmail_extraInitializers);
            __esDecorate(null, null, _contactPhone_decorators, { kind: "field", name: "contactPhone", static: false, private: false, access: { has: function (obj) { return "contactPhone" in obj; }, get: function (obj) { return obj.contactPhone; }, set: function (obj, value) { obj.contactPhone = value; } }, metadata: _metadata }, _contactPhone_initializers, _contactPhone_extraInitializers);
            __esDecorate(null, null, _logoUrl_decorators, { kind: "field", name: "logoUrl", static: false, private: false, access: { has: function (obj) { return "logoUrl" in obj; }, get: function (obj) { return obj.logoUrl; }, set: function (obj, value) { obj.logoUrl = value; } }, metadata: _metadata }, _logoUrl_initializers, _logoUrl_extraInitializers);
            __esDecorate(null, null, _primaryColor_decorators, { kind: "field", name: "primaryColor", static: false, private: false, access: { has: function (obj) { return "primaryColor" in obj; }, get: function (obj) { return obj.primaryColor; }, set: function (obj, value) { obj.primaryColor = value; } }, metadata: _metadata }, _primaryColor_initializers, _primaryColor_extraInitializers);
            __esDecorate(null, null, _secondaryColor_decorators, { kind: "field", name: "secondaryColor", static: false, private: false, access: { has: function (obj) { return "secondaryColor" in obj; }, get: function (obj) { return obj.secondaryColor; }, set: function (obj, value) { obj.secondaryColor = value; } }, metadata: _metadata }, _secondaryColor_initializers, _secondaryColor_extraInitializers);
            __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: function (obj) { return "planId" in obj; }, get: function (obj) { return obj.planId; }, set: function (obj, value) { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ResidentialComplexDto = ResidentialComplexDto;
var CreateResidentialComplexDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _country_decorators;
    var _country_initializers = [];
    var _country_extraInitializers = [];
    var _schemaName_decorators;
    var _schemaName_initializers = [];
    var _schemaName_extraInitializers = [];
    var _adminId_decorators;
    var _adminId_initializers = [];
    var _adminId_extraInitializers = [];
    var _contactEmail_decorators;
    var _contactEmail_initializers = [];
    var _contactEmail_extraInitializers = [];
    var _contactPhone_decorators;
    var _contactPhone_initializers = [];
    var _contactPhone_extraInitializers = [];
    var _logoUrl_decorators;
    var _logoUrl_initializers = [];
    var _logoUrl_extraInitializers = [];
    var _primaryColor_decorators;
    var _primaryColor_initializers = [];
    var _primaryColor_extraInitializers = [];
    var _secondaryColor_decorators;
    var _secondaryColor_initializers = [];
    var _secondaryColor_extraInitializers = [];
    var _planId_decorators;
    var _planId_initializers = [];
    var _planId_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateResidentialComplexDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.address = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.city = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.country = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _country_initializers, void 0));
                this.schemaName = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _schemaName_initializers, void 0));
                this.adminId = (__runInitializers(this, _schemaName_extraInitializers), __runInitializers(this, _adminId_initializers, void 0));
                this.contactEmail = (__runInitializers(this, _adminId_extraInitializers), __runInitializers(this, _contactEmail_initializers, void 0));
                this.contactPhone = (__runInitializers(this, _contactEmail_extraInitializers), __runInitializers(this, _contactPhone_initializers, void 0));
                this.logoUrl = (__runInitializers(this, _contactPhone_extraInitializers), __runInitializers(this, _logoUrl_initializers, void 0));
                this.primaryColor = (__runInitializers(this, _logoUrl_extraInitializers), __runInitializers(this, _primaryColor_initializers, void 0));
                this.secondaryColor = (__runInitializers(this, _primaryColor_extraInitializers), __runInitializers(this, _secondaryColor_initializers, void 0));
                this.planId = (__runInitializers(this, _secondaryColor_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
                this.isActive = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return CreateResidentialComplexDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _address_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _city_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _country_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _schemaName_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _adminId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsInt)()];
            _contactEmail_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _contactPhone_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)()];
            _logoUrl_decorators = [(0, swagger_1.ApiProperty)({ required: false, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _primaryColor_decorators = [(0, swagger_1.ApiProperty)({ required: false, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _secondaryColor_decorators = [(0, swagger_1.ApiProperty)({ required: false, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _planId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsInt)()];
            _isActive_decorators = [(0, swagger_1.ApiProperty)({ required: false, default: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: function (obj) { return "country" in obj; }, get: function (obj) { return obj.country; }, set: function (obj, value) { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            __esDecorate(null, null, _schemaName_decorators, { kind: "field", name: "schemaName", static: false, private: false, access: { has: function (obj) { return "schemaName" in obj; }, get: function (obj) { return obj.schemaName; }, set: function (obj, value) { obj.schemaName = value; } }, metadata: _metadata }, _schemaName_initializers, _schemaName_extraInitializers);
            __esDecorate(null, null, _adminId_decorators, { kind: "field", name: "adminId", static: false, private: false, access: { has: function (obj) { return "adminId" in obj; }, get: function (obj) { return obj.adminId; }, set: function (obj, value) { obj.adminId = value; } }, metadata: _metadata }, _adminId_initializers, _adminId_extraInitializers);
            __esDecorate(null, null, _contactEmail_decorators, { kind: "field", name: "contactEmail", static: false, private: false, access: { has: function (obj) { return "contactEmail" in obj; }, get: function (obj) { return obj.contactEmail; }, set: function (obj, value) { obj.contactEmail = value; } }, metadata: _metadata }, _contactEmail_initializers, _contactEmail_extraInitializers);
            __esDecorate(null, null, _contactPhone_decorators, { kind: "field", name: "contactPhone", static: false, private: false, access: { has: function (obj) { return "contactPhone" in obj; }, get: function (obj) { return obj.contactPhone; }, set: function (obj, value) { obj.contactPhone = value; } }, metadata: _metadata }, _contactPhone_initializers, _contactPhone_extraInitializers);
            __esDecorate(null, null, _logoUrl_decorators, { kind: "field", name: "logoUrl", static: false, private: false, access: { has: function (obj) { return "logoUrl" in obj; }, get: function (obj) { return obj.logoUrl; }, set: function (obj, value) { obj.logoUrl = value; } }, metadata: _metadata }, _logoUrl_initializers, _logoUrl_extraInitializers);
            __esDecorate(null, null, _primaryColor_decorators, { kind: "field", name: "primaryColor", static: false, private: false, access: { has: function (obj) { return "primaryColor" in obj; }, get: function (obj) { return obj.primaryColor; }, set: function (obj, value) { obj.primaryColor = value; } }, metadata: _metadata }, _primaryColor_initializers, _primaryColor_extraInitializers);
            __esDecorate(null, null, _secondaryColor_decorators, { kind: "field", name: "secondaryColor", static: false, private: false, access: { has: function (obj) { return "secondaryColor" in obj; }, get: function (obj) { return obj.secondaryColor; }, set: function (obj, value) { obj.secondaryColor = value; } }, metadata: _metadata }, _secondaryColor_initializers, _secondaryColor_extraInitializers);
            __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: function (obj) { return "planId" in obj; }, get: function (obj) { return obj.planId; }, set: function (obj, value) { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateResidentialComplexDto = CreateResidentialComplexDto;
var UpdateResidentialComplexDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _address_decorators;
    var _address_initializers = [];
    var _address_extraInitializers = [];
    var _city_decorators;
    var _city_initializers = [];
    var _city_extraInitializers = [];
    var _country_decorators;
    var _country_initializers = [];
    var _country_extraInitializers = [];
    var _contactEmail_decorators;
    var _contactEmail_initializers = [];
    var _contactEmail_extraInitializers = [];
    var _contactPhone_decorators;
    var _contactPhone_initializers = [];
    var _contactPhone_extraInitializers = [];
    var _logoUrl_decorators;
    var _logoUrl_initializers = [];
    var _logoUrl_extraInitializers = [];
    var _primaryColor_decorators;
    var _primaryColor_initializers = [];
    var _primaryColor_extraInitializers = [];
    var _secondaryColor_decorators;
    var _secondaryColor_initializers = [];
    var _secondaryColor_extraInitializers = [];
    var _planId_decorators;
    var _planId_initializers = [];
    var _planId_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateResidentialComplexDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.address = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _address_initializers, void 0));
                this.city = (__runInitializers(this, _address_extraInitializers), __runInitializers(this, _city_initializers, void 0));
                this.country = (__runInitializers(this, _city_extraInitializers), __runInitializers(this, _country_initializers, void 0));
                this.contactEmail = (__runInitializers(this, _country_extraInitializers), __runInitializers(this, _contactEmail_initializers, void 0));
                this.contactPhone = (__runInitializers(this, _contactEmail_extraInitializers), __runInitializers(this, _contactPhone_initializers, void 0));
                this.logoUrl = (__runInitializers(this, _contactPhone_extraInitializers), __runInitializers(this, _logoUrl_initializers, void 0));
                this.primaryColor = (__runInitializers(this, _logoUrl_extraInitializers), __runInitializers(this, _primaryColor_initializers, void 0));
                this.secondaryColor = (__runInitializers(this, _primaryColor_extraInitializers), __runInitializers(this, _secondaryColor_initializers, void 0));
                this.planId = (__runInitializers(this, _secondaryColor_extraInitializers), __runInitializers(this, _planId_initializers, void 0));
                this.isActive = (__runInitializers(this, _planId_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return UpdateResidentialComplexDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _address_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _city_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _country_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _contactEmail_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _contactPhone_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _logoUrl_decorators = [(0, swagger_1.ApiProperty)({ required: false, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _primaryColor_decorators = [(0, swagger_1.ApiProperty)({ required: false, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _secondaryColor_decorators = [(0, swagger_1.ApiProperty)({ required: false, nullable: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _planId_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsInt)()];
            _isActive_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _address_decorators, { kind: "field", name: "address", static: false, private: false, access: { has: function (obj) { return "address" in obj; }, get: function (obj) { return obj.address; }, set: function (obj, value) { obj.address = value; } }, metadata: _metadata }, _address_initializers, _address_extraInitializers);
            __esDecorate(null, null, _city_decorators, { kind: "field", name: "city", static: false, private: false, access: { has: function (obj) { return "city" in obj; }, get: function (obj) { return obj.city; }, set: function (obj, value) { obj.city = value; } }, metadata: _metadata }, _city_initializers, _city_extraInitializers);
            __esDecorate(null, null, _country_decorators, { kind: "field", name: "country", static: false, private: false, access: { has: function (obj) { return "country" in obj; }, get: function (obj) { return obj.country; }, set: function (obj, value) { obj.country = value; } }, metadata: _metadata }, _country_initializers, _country_extraInitializers);
            __esDecorate(null, null, _contactEmail_decorators, { kind: "field", name: "contactEmail", static: false, private: false, access: { has: function (obj) { return "contactEmail" in obj; }, get: function (obj) { return obj.contactEmail; }, set: function (obj, value) { obj.contactEmail = value; } }, metadata: _metadata }, _contactEmail_initializers, _contactEmail_extraInitializers);
            __esDecorate(null, null, _contactPhone_decorators, { kind: "field", name: "contactPhone", static: false, private: false, access: { has: function (obj) { return "contactPhone" in obj; }, get: function (obj) { return obj.contactPhone; }, set: function (obj, value) { obj.contactPhone = value; } }, metadata: _metadata }, _contactPhone_initializers, _contactPhone_extraInitializers);
            __esDecorate(null, null, _logoUrl_decorators, { kind: "field", name: "logoUrl", static: false, private: false, access: { has: function (obj) { return "logoUrl" in obj; }, get: function (obj) { return obj.logoUrl; }, set: function (obj, value) { obj.logoUrl = value; } }, metadata: _metadata }, _logoUrl_initializers, _logoUrl_extraInitializers);
            __esDecorate(null, null, _primaryColor_decorators, { kind: "field", name: "primaryColor", static: false, private: false, access: { has: function (obj) { return "primaryColor" in obj; }, get: function (obj) { return obj.primaryColor; }, set: function (obj, value) { obj.primaryColor = value; } }, metadata: _metadata }, _primaryColor_initializers, _primaryColor_extraInitializers);
            __esDecorate(null, null, _secondaryColor_decorators, { kind: "field", name: "secondaryColor", static: false, private: false, access: { has: function (obj) { return "secondaryColor" in obj; }, get: function (obj) { return obj.secondaryColor; }, set: function (obj, value) { obj.secondaryColor = value; } }, metadata: _metadata }, _secondaryColor_initializers, _secondaryColor_extraInitializers);
            __esDecorate(null, null, _planId_decorators, { kind: "field", name: "planId", static: false, private: false, access: { has: function (obj) { return "planId" in obj; }, get: function (obj) { return obj.planId; }, set: function (obj, value) { obj.planId = value; } }, metadata: _metadata }, _planId_initializers, _planId_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateResidentialComplexDto = UpdateResidentialComplexDto;
