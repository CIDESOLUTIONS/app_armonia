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
exports.ReservationFilterParamsDto = exports.ReservationDto = exports.UpdateReservationDto = exports.CreateReservationDto = exports.ReservationStatus = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var swagger_1 = require("@nestjs/swagger");
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["PENDING"] = "PENDING";
    ReservationStatus["APPROVED"] = "APPROVED";
    ReservationStatus["REJECTED"] = "REJECTED";
    ReservationStatus["CANCELLED"] = "CANCELLED";
    ReservationStatus["COMPLETED"] = "COMPLETED";
})(ReservationStatus || (exports.ReservationStatus = ReservationStatus = {}));
var CreateReservationDto = function () {
    var _a;
    var _commonAreaId_decorators;
    var _commonAreaId_initializers = [];
    var _commonAreaId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _startDateTime_decorators;
    var _startDateTime_initializers = [];
    var _startDateTime_extraInitializers = [];
    var _endDateTime_decorators;
    var _endDateTime_initializers = [];
    var _endDateTime_extraInitializers = [];
    var _attendees_decorators;
    var _attendees_initializers = [];
    var _attendees_extraInitializers = [];
    var _requiresPayment_decorators;
    var _requiresPayment_initializers = [];
    var _requiresPayment_extraInitializers = [];
    var _paymentAmount_decorators;
    var _paymentAmount_initializers = [];
    var _paymentAmount_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateReservationDto() {
                this.commonAreaId = __runInitializers(this, _commonAreaId_initializers, void 0);
                this.userId = (__runInitializers(this, _commonAreaId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.title = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.startDateTime = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _startDateTime_initializers, void 0));
                this.endDateTime = (__runInitializers(this, _startDateTime_extraInitializers), __runInitializers(this, _endDateTime_initializers, void 0));
                this.attendees = (__runInitializers(this, _endDateTime_extraInitializers), __runInitializers(this, _attendees_initializers, void 0));
                this.requiresPayment = (__runInitializers(this, _attendees_extraInitializers), __runInitializers(this, _requiresPayment_initializers, void 0));
                this.paymentAmount = (__runInitializers(this, _requiresPayment_extraInitializers), __runInitializers(this, _paymentAmount_initializers, void 0));
                __runInitializers(this, _paymentAmount_extraInitializers);
            }
            return CreateReservationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _commonAreaId_decorators = [(0, class_validator_1.IsNumber)()];
            _userId_decorators = [(0, class_validator_1.IsNumber)()];
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _startDateTime_decorators = [(0, class_validator_1.IsDateString)()];
            _endDateTime_decorators = [(0, class_validator_1.IsDateString)()];
            _attendees_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            _requiresPayment_decorators = [(0, class_validator_1.IsBoolean)(), (0, class_validator_1.IsOptional)()];
            _paymentAmount_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _commonAreaId_decorators, { kind: "field", name: "commonAreaId", static: false, private: false, access: { has: function (obj) { return "commonAreaId" in obj; }, get: function (obj) { return obj.commonAreaId; }, set: function (obj, value) { obj.commonAreaId = value; } }, metadata: _metadata }, _commonAreaId_initializers, _commonAreaId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _startDateTime_decorators, { kind: "field", name: "startDateTime", static: false, private: false, access: { has: function (obj) { return "startDateTime" in obj; }, get: function (obj) { return obj.startDateTime; }, set: function (obj, value) { obj.startDateTime = value; } }, metadata: _metadata }, _startDateTime_initializers, _startDateTime_extraInitializers);
            __esDecorate(null, null, _endDateTime_decorators, { kind: "field", name: "endDateTime", static: false, private: false, access: { has: function (obj) { return "endDateTime" in obj; }, get: function (obj) { return obj.endDateTime; }, set: function (obj, value) { obj.endDateTime = value; } }, metadata: _metadata }, _endDateTime_initializers, _endDateTime_extraInitializers);
            __esDecorate(null, null, _attendees_decorators, { kind: "field", name: "attendees", static: false, private: false, access: { has: function (obj) { return "attendees" in obj; }, get: function (obj) { return obj.attendees; }, set: function (obj, value) { obj.attendees = value; } }, metadata: _metadata }, _attendees_initializers, _attendees_extraInitializers);
            __esDecorate(null, null, _requiresPayment_decorators, { kind: "field", name: "requiresPayment", static: false, private: false, access: { has: function (obj) { return "requiresPayment" in obj; }, get: function (obj) { return obj.requiresPayment; }, set: function (obj, value) { obj.requiresPayment = value; } }, metadata: _metadata }, _requiresPayment_initializers, _requiresPayment_extraInitializers);
            __esDecorate(null, null, _paymentAmount_decorators, { kind: "field", name: "paymentAmount", static: false, private: false, access: { has: function (obj) { return "paymentAmount" in obj; }, get: function (obj) { return obj.paymentAmount; }, set: function (obj, value) { obj.paymentAmount = value; } }, metadata: _metadata }, _paymentAmount_initializers, _paymentAmount_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateReservationDto = CreateReservationDto;
var UpdateReservationDto = function () {
    var _a;
    var _classSuper = (0, swagger_1.PartialType)(CreateReservationDto);
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _rejectionReason_decorators;
    var _rejectionReason_initializers = [];
    var _rejectionReason_extraInitializers = [];
    var _cancellationReason_decorators;
    var _cancellationReason_initializers = [];
    var _cancellationReason_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(UpdateReservationDto, _super);
            function UpdateReservationDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.status = __runInitializers(_this, _status_initializers, void 0);
                _this.rejectionReason = (__runInitializers(_this, _status_extraInitializers), __runInitializers(_this, _rejectionReason_initializers, void 0));
                _this.cancellationReason = (__runInitializers(_this, _rejectionReason_extraInitializers), __runInitializers(_this, _cancellationReason_initializers, void 0));
                __runInitializers(_this, _cancellationReason_extraInitializers);
                return _this;
            }
            return UpdateReservationDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ReservationStatus)];
            _rejectionReason_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _cancellationReason_decorators = [(0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _rejectionReason_decorators, { kind: "field", name: "rejectionReason", static: false, private: false, access: { has: function (obj) { return "rejectionReason" in obj; }, get: function (obj) { return obj.rejectionReason; }, set: function (obj, value) { obj.rejectionReason = value; } }, metadata: _metadata }, _rejectionReason_initializers, _rejectionReason_extraInitializers);
            __esDecorate(null, null, _cancellationReason_decorators, { kind: "field", name: "cancellationReason", static: false, private: false, access: { has: function (obj) { return "cancellationReason" in obj; }, get: function (obj) { return obj.cancellationReason; }, set: function (obj, value) { obj.cancellationReason = value; } }, metadata: _metadata }, _cancellationReason_initializers, _cancellationReason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateReservationDto = UpdateReservationDto;
var ReservationDto = /** @class */ (function () {
    function ReservationDto() {
    }
    return ReservationDto;
}());
exports.ReservationDto = ReservationDto;
var ReservationFilterParamsDto = function () {
    var _a;
    var _commonAreaId_decorators;
    var _commonAreaId_initializers = [];
    var _commonAreaId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _startDate_decorators;
    var _startDate_initializers = [];
    var _startDate_extraInitializers = [];
    var _endDate_decorators;
    var _endDate_initializers = [];
    var _endDate_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReservationFilterParamsDto() {
                this.commonAreaId = __runInitializers(this, _commonAreaId_initializers, void 0);
                this.userId = (__runInitializers(this, _commonAreaId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.status = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.startDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                __runInitializers(this, _endDate_extraInitializers);
            }
            return ReservationFilterParamsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _commonAreaId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; })];
            _userId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)(), (0, class_transformer_1.Type)(function () { return Number; })];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ReservationStatus)];
            _startDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _endDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _commonAreaId_decorators, { kind: "field", name: "commonAreaId", static: false, private: false, access: { has: function (obj) { return "commonAreaId" in obj; }, get: function (obj) { return obj.commonAreaId; }, set: function (obj, value) { obj.commonAreaId = value; } }, metadata: _metadata }, _commonAreaId_initializers, _commonAreaId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: function (obj) { return "startDate" in obj; }, get: function (obj) { return obj.startDate; }, set: function (obj, value) { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: function (obj) { return "endDate" in obj; }, get: function (obj) { return obj.endDate; }, set: function (obj, value) { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReservationFilterParamsDto = ReservationFilterParamsDto;
