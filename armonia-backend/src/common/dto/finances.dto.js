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
exports.ExpenseFilterParamsDto = exports.BudgetFilterParamsDto = exports.FeeFilterParamsDto = exports.FinancialReportResponseDto = exports.PaymentGatewayCallbackDto = exports.InitiatePaymentDto = exports.UpdateBudgetDto = exports.CreateBudgetDto = exports.RegisterManualPaymentDto = exports.UpdatePaymentDto = exports.CreatePaymentDto = exports.UpdateFeeDto = exports.CreateFeeDto = exports.FeeListResponseDto = exports.BudgetDto = exports.BudgetItemDto = exports.PaymentDto = exports.FeeDto = exports.BudgetStatus = exports.FeeType = exports.PaymentStatus = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["PAID"] = "PAID";
    PaymentStatus["OVERDUE"] = "OVERDUE";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["PARTIAL"] = "PARTIAL";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
var FeeType;
(function (FeeType) {
    FeeType["ORDINARY"] = "ORDINARY";
    FeeType["EXTRAORDINARY"] = "EXTRAORDINARY";
    FeeType["PENALTY"] = "PENALTY";
    FeeType["UTILITY"] = "UTILITY";
    FeeType["OTHER"] = "OTHER";
})(FeeType || (exports.FeeType = FeeType = {}));
var BudgetStatus;
(function (BudgetStatus) {
    BudgetStatus["DRAFT"] = "DRAFT";
    BudgetStatus["APPROVED"] = "APPROVED";
    BudgetStatus["EXECUTED"] = "EXECUTED";
})(BudgetStatus || (exports.BudgetStatus = BudgetStatus = {}));
var FeeDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _dueDate_decorators;
    var _dueDate_initializers = [];
    var _dueDate_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _paymentDate_decorators;
    var _paymentDate_initializers = [];
    var _paymentDate_extraInitializers = [];
    var _receiptNumber_decorators;
    var _receiptNumber_initializers = [];
    var _receiptNumber_extraInitializers = [];
    var _paymentMethod_decorators;
    var _paymentMethod_initializers = [];
    var _paymentMethod_extraInitializers = [];
    var _paymentReference_decorators;
    var _paymentReference_initializers = [];
    var _paymentReference_extraInitializers = [];
    return _a = /** @class */ (function () {
            function FeeDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.amount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.type = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.dueDate = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.createdAt = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.propertyId = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.status = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.paymentDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _paymentDate_initializers, void 0));
                this.receiptNumber = (__runInitializers(this, _paymentDate_extraInitializers), __runInitializers(this, _receiptNumber_initializers, void 0));
                this.paymentMethod = (__runInitializers(this, _receiptNumber_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                this.paymentReference = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _paymentReference_initializers, void 0));
                __runInitializers(this, _paymentReference_extraInitializers);
            }
            return FeeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _amount_decorators = [(0, class_validator_1.IsNumber)()];
            _type_decorators = [(0, class_validator_1.IsEnum)(FeeType)];
            _dueDate_decorators = [(0, class_validator_1.IsDateString)()];
            _createdAt_decorators = [(0, class_validator_1.IsString)()];
            _updatedAt_decorators = [(0, class_validator_1.IsString)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)()];
            _status_decorators = [(0, class_validator_1.IsEnum)(PaymentStatus)];
            _paymentDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _receiptNumber_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _paymentMethod_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _paymentReference_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: function (obj) { return "dueDate" in obj; }, get: function (obj) { return obj.dueDate; }, set: function (obj, value) { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _paymentDate_decorators, { kind: "field", name: "paymentDate", static: false, private: false, access: { has: function (obj) { return "paymentDate" in obj; }, get: function (obj) { return obj.paymentDate; }, set: function (obj, value) { obj.paymentDate = value; } }, metadata: _metadata }, _paymentDate_initializers, _paymentDate_extraInitializers);
            __esDecorate(null, null, _receiptNumber_decorators, { kind: "field", name: "receiptNumber", static: false, private: false, access: { has: function (obj) { return "receiptNumber" in obj; }, get: function (obj) { return obj.receiptNumber; }, set: function (obj, value) { obj.receiptNumber = value; } }, metadata: _metadata }, _receiptNumber_initializers, _receiptNumber_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: function (obj) { return "paymentMethod" in obj; }, get: function (obj) { return obj.paymentMethod; }, set: function (obj, value) { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _paymentReference_decorators, { kind: "field", name: "paymentReference", static: false, private: false, access: { has: function (obj) { return "paymentReference" in obj; }, get: function (obj) { return obj.paymentReference; }, set: function (obj, value) { obj.paymentReference = value; } }, metadata: _metadata }, _paymentReference_initializers, _paymentReference_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FeeDto = FeeDto;
var PaymentDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _method_decorators;
    var _method_initializers = [];
    var _method_extraInitializers = [];
    var _reference_decorators;
    var _reference_initializers = [];
    var _reference_extraInitializers = [];
    var _receiptNumber_decorators;
    var _receiptNumber_initializers = [];
    var _receiptNumber_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _feeId_decorators;
    var _feeId_initializers = [];
    var _feeId_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _createdBy_decorators;
    var _createdBy_initializers = [];
    var _createdBy_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PaymentDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.amount = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.date = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                this.method = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _method_initializers, void 0));
                this.reference = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _reference_initializers, void 0));
                this.receiptNumber = (__runInitializers(this, _reference_extraInitializers), __runInitializers(this, _receiptNumber_initializers, void 0));
                this.description = (__runInitializers(this, _receiptNumber_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.feeId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _feeId_initializers, void 0));
                this.propertyId = (__runInitializers(this, _feeId_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.createdAt = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.createdBy = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
                __runInitializers(this, _createdBy_extraInitializers);
            }
            return PaymentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _amount_decorators = [(0, class_validator_1.IsNumber)()];
            _date_decorators = [(0, class_validator_1.IsDateString)()];
            _method_decorators = [(0, class_validator_1.IsString)()];
            _reference_decorators = [(0, class_validator_1.IsString)()];
            _receiptNumber_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _feeId_decorators = [(0, class_validator_1.IsNumber)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)()];
            _createdAt_decorators = [(0, class_validator_1.IsString)()];
            _updatedAt_decorators = [(0, class_validator_1.IsString)()];
            _createdBy_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: function (obj) { return "method" in obj; }, get: function (obj) { return obj.method; }, set: function (obj, value) { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
            __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: function (obj) { return "reference" in obj; }, get: function (obj) { return obj.reference; }, set: function (obj, value) { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
            __esDecorate(null, null, _receiptNumber_decorators, { kind: "field", name: "receiptNumber", static: false, private: false, access: { has: function (obj) { return "receiptNumber" in obj; }, get: function (obj) { return obj.receiptNumber; }, set: function (obj, value) { obj.receiptNumber = value; } }, metadata: _metadata }, _receiptNumber_initializers, _receiptNumber_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _feeId_decorators, { kind: "field", name: "feeId", static: false, private: false, access: { has: function (obj) { return "feeId" in obj; }, get: function (obj) { return obj.feeId; }, set: function (obj, value) { obj.feeId = value; } }, metadata: _metadata }, _feeId_initializers, _feeId_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: function (obj) { return "createdBy" in obj; }, get: function (obj) { return obj.createdBy; }, set: function (obj, value) { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PaymentDto = PaymentDto;
var BudgetItemDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _budgetId_decorators;
    var _budgetId_initializers = [];
    var _budgetId_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BudgetItemDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.budgetId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _budgetId_initializers, void 0));
                this.description = (__runInitializers(this, _budgetId_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.amount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.category = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.order = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _order_initializers, void 0));
                __runInitializers(this, _order_extraInitializers);
            }
            return BudgetItemDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _budgetId_decorators = [(0, class_validator_1.IsNumber)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _amount_decorators = [(0, class_validator_1.IsNumber)()];
            _category_decorators = [(0, class_validator_1.IsString)()];
            _order_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _budgetId_decorators, { kind: "field", name: "budgetId", static: false, private: false, access: { has: function (obj) { return "budgetId" in obj; }, get: function (obj) { return obj.budgetId; }, set: function (obj, value) { obj.budgetId = value; } }, metadata: _metadata }, _budgetId_initializers, _budgetId_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BudgetItemDto = BudgetItemDto;
var BudgetDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _month_decorators;
    var _month_initializers = [];
    var _month_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _totalAmount_decorators;
    var _totalAmount_initializers = [];
    var _totalAmount_extraInitializers = [];
    var _approvedDate_decorators;
    var _approvedDate_initializers = [];
    var _approvedDate_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _items_decorators;
    var _items_initializers = [];
    var _items_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function BudgetDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.year = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _year_initializers, void 0));
                this.month = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _month_initializers, void 0));
                this.title = (__runInitializers(this, _month_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.approvedDate = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _approvedDate_initializers, void 0));
                this.status = (__runInitializers(this, _approvedDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.items = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _items_initializers, void 0));
                this.createdAt = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
            return BudgetDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _year_decorators = [(0, class_validator_1.IsNumber)()];
            _month_decorators = [(0, class_validator_1.IsNumber)()];
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _totalAmount_decorators = [(0, class_validator_1.IsNumber)()];
            _approvedDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _status_decorators = [(0, class_validator_1.IsEnum)(BudgetStatus)];
            _items_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return BudgetItemDto; })];
            _createdAt_decorators = [(0, class_validator_1.IsString)()];
            _updatedAt_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _month_decorators, { kind: "field", name: "month", static: false, private: false, access: { has: function (obj) { return "month" in obj; }, get: function (obj) { return obj.month; }, set: function (obj, value) { obj.month = value; } }, metadata: _metadata }, _month_initializers, _month_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: function (obj) { return "totalAmount" in obj; }, get: function (obj) { return obj.totalAmount; }, set: function (obj, value) { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _approvedDate_decorators, { kind: "field", name: "approvedDate", static: false, private: false, access: { has: function (obj) { return "approvedDate" in obj; }, get: function (obj) { return obj.approvedDate; }, set: function (obj, value) { obj.approvedDate = value; } }, metadata: _metadata }, _approvedDate_initializers, _approvedDate_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: function (obj) { return "items" in obj; }, get: function (obj) { return obj.items; }, set: function (obj, value) { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BudgetDto = BudgetDto;
var FeeListResponseDto = function () {
    var _a;
    var _fees_decorators;
    var _fees_initializers = [];
    var _fees_extraInitializers = [];
    var _total_decorators;
    var _total_initializers = [];
    var _total_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function FeeListResponseDto() {
                this.fees = __runInitializers(this, _fees_initializers, void 0);
                this.total = (__runInitializers(this, _fees_extraInitializers), __runInitializers(this, _total_initializers, void 0));
                this.page = (__runInitializers(this, _total_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                __runInitializers(this, _limit_extraInitializers);
            }
            return FeeListResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _fees_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return FeeDto; })];
            _total_decorators = [(0, class_validator_1.IsNumber)()];
            _page_decorators = [(0, class_validator_1.IsNumber)()];
            _limit_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _fees_decorators, { kind: "field", name: "fees", static: false, private: false, access: { has: function (obj) { return "fees" in obj; }, get: function (obj) { return obj.fees; }, set: function (obj, value) { obj.fees = value; } }, metadata: _metadata }, _fees_initializers, _fees_extraInitializers);
            __esDecorate(null, null, _total_decorators, { kind: "field", name: "total", static: false, private: false, access: { has: function (obj) { return "total" in obj; }, get: function (obj) { return obj.total; }, set: function (obj, value) { obj.total = value; } }, metadata: _metadata }, _total_initializers, _total_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FeeListResponseDto = FeeListResponseDto;
var CreateFeeDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _dueDate_decorators;
    var _dueDate_initializers = [];
    var _dueDate_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateFeeDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.amount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.type = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.dueDate = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.propertyId = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                __runInitializers(this, _propertyId_extraInitializers);
            }
            return CreateFeeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _amount_decorators = [(0, class_validator_1.IsNumber)()];
            _type_decorators = [(0, class_validator_1.IsEnum)(FeeType)];
            _dueDate_decorators = [(0, class_validator_1.IsDateString)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: function (obj) { return "dueDate" in obj; }, get: function (obj) { return obj.dueDate; }, set: function (obj, value) { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateFeeDto = CreateFeeDto;
var UpdateFeeDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _dueDate_decorators;
    var _dueDate_initializers = [];
    var _dueDate_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateFeeDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.amount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.type = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.dueDate = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _dueDate_initializers, void 0));
                this.status = (__runInitializers(this, _dueDate_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return UpdateFeeDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _amount_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _type_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(FeeType)];
            _dueDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PaymentStatus)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _dueDate_decorators, { kind: "field", name: "dueDate", static: false, private: false, access: { has: function (obj) { return "dueDate" in obj; }, get: function (obj) { return obj.dueDate; }, set: function (obj, value) { obj.dueDate = value; } }, metadata: _metadata }, _dueDate_initializers, _dueDate_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateFeeDto = UpdateFeeDto;
var CreatePaymentDto = function () {
    var _a;
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _method_decorators;
    var _method_initializers = [];
    var _method_extraInitializers = [];
    var _reference_decorators;
    var _reference_initializers = [];
    var _reference_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _feeId_decorators;
    var _feeId_initializers = [];
    var _feeId_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePaymentDto() {
                this.amount = __runInitializers(this, _amount_initializers, void 0);
                this.date = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                this.method = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _method_initializers, void 0));
                this.reference = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _reference_initializers, void 0));
                this.description = (__runInitializers(this, _reference_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.feeId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _feeId_initializers, void 0));
                this.propertyId = (__runInitializers(this, _feeId_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                __runInitializers(this, _propertyId_extraInitializers);
            }
            return CreatePaymentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _amount_decorators = [(0, class_validator_1.IsNumber)()];
            _date_decorators = [(0, class_validator_1.IsDateString)()];
            _method_decorators = [(0, class_validator_1.IsString)()];
            _reference_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _feeId_decorators = [(0, class_validator_1.IsNumber)()];
            _propertyId_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: function (obj) { return "method" in obj; }, get: function (obj) { return obj.method; }, set: function (obj, value) { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
            __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: function (obj) { return "reference" in obj; }, get: function (obj) { return obj.reference; }, set: function (obj, value) { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _feeId_decorators, { kind: "field", name: "feeId", static: false, private: false, access: { has: function (obj) { return "feeId" in obj; }, get: function (obj) { return obj.feeId; }, set: function (obj, value) { obj.feeId = value; } }, metadata: _metadata }, _feeId_initializers, _feeId_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePaymentDto = CreatePaymentDto;
var UpdatePaymentDto = function () {
    var _a;
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _date_decorators;
    var _date_initializers = [];
    var _date_extraInitializers = [];
    var _method_decorators;
    var _method_initializers = [];
    var _method_extraInitializers = [];
    var _reference_decorators;
    var _reference_initializers = [];
    var _reference_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _feeId_decorators;
    var _feeId_initializers = [];
    var _feeId_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePaymentDto() {
                this.amount = __runInitializers(this, _amount_initializers, void 0);
                this.date = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _date_initializers, void 0));
                this.method = (__runInitializers(this, _date_extraInitializers), __runInitializers(this, _method_initializers, void 0));
                this.reference = (__runInitializers(this, _method_extraInitializers), __runInitializers(this, _reference_initializers, void 0));
                this.description = (__runInitializers(this, _reference_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.feeId = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _feeId_initializers, void 0));
                this.propertyId = (__runInitializers(this, _feeId_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.status = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return UpdatePaymentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _amount_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _date_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _method_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _reference_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _feeId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _propertyId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PaymentStatus)];
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _date_decorators, { kind: "field", name: "date", static: false, private: false, access: { has: function (obj) { return "date" in obj; }, get: function (obj) { return obj.date; }, set: function (obj, value) { obj.date = value; } }, metadata: _metadata }, _date_initializers, _date_extraInitializers);
            __esDecorate(null, null, _method_decorators, { kind: "field", name: "method", static: false, private: false, access: { has: function (obj) { return "method" in obj; }, get: function (obj) { return obj.method; }, set: function (obj, value) { obj.method = value; } }, metadata: _metadata }, _method_initializers, _method_extraInitializers);
            __esDecorate(null, null, _reference_decorators, { kind: "field", name: "reference", static: false, private: false, access: { has: function (obj) { return "reference" in obj; }, get: function (obj) { return obj.reference; }, set: function (obj, value) { obj.reference = value; } }, metadata: _metadata }, _reference_initializers, _reference_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _feeId_decorators, { kind: "field", name: "feeId", static: false, private: false, access: { has: function (obj) { return "feeId" in obj; }, get: function (obj) { return obj.feeId; }, set: function (obj, value) { obj.feeId = value; } }, metadata: _metadata }, _feeId_initializers, _feeId_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePaymentDto = UpdatePaymentDto;
var RegisterManualPaymentDto = function () {
    var _a;
    var _feeId_decorators;
    var _feeId_initializers = [];
    var _feeId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _paymentDate_decorators;
    var _paymentDate_initializers = [];
    var _paymentDate_extraInitializers = [];
    var _paymentMethod_decorators;
    var _paymentMethod_initializers = [];
    var _paymentMethod_extraInitializers = [];
    var _transactionId_decorators;
    var _transactionId_initializers = [];
    var _transactionId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterManualPaymentDto() {
                this.feeId = __runInitializers(this, _feeId_initializers, void 0);
                this.userId = (__runInitializers(this, _feeId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.amount = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _amount_initializers, void 0));
                this.paymentDate = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _paymentDate_initializers, void 0));
                this.paymentMethod = (__runInitializers(this, _paymentDate_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                this.transactionId = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _transactionId_initializers, void 0));
                __runInitializers(this, _transactionId_extraInitializers);
            }
            return RegisterManualPaymentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _feeId_decorators = [(0, class_validator_1.IsNumber)()];
            _userId_decorators = [(0, class_validator_1.IsNumber)()];
            _amount_decorators = [(0, class_validator_1.IsNumber)()];
            _paymentDate_decorators = [(0, class_validator_1.IsDateString)()];
            _paymentMethod_decorators = [(0, class_validator_1.IsString)()];
            _transactionId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _feeId_decorators, { kind: "field", name: "feeId", static: false, private: false, access: { has: function (obj) { return "feeId" in obj; }, get: function (obj) { return obj.feeId; }, set: function (obj, value) { obj.feeId = value; } }, metadata: _metadata }, _feeId_initializers, _feeId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _paymentDate_decorators, { kind: "field", name: "paymentDate", static: false, private: false, access: { has: function (obj) { return "paymentDate" in obj; }, get: function (obj) { return obj.paymentDate; }, set: function (obj, value) { obj.paymentDate = value; } }, metadata: _metadata }, _paymentDate_initializers, _paymentDate_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: function (obj) { return "paymentMethod" in obj; }, get: function (obj) { return obj.paymentMethod; }, set: function (obj, value) { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _transactionId_decorators, { kind: "field", name: "transactionId", static: false, private: false, access: { has: function (obj) { return "transactionId" in obj; }, get: function (obj) { return obj.transactionId; }, set: function (obj, value) { obj.transactionId = value; } }, metadata: _metadata }, _transactionId_initializers, _transactionId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterManualPaymentDto = RegisterManualPaymentDto;
var CreateBudgetDto = function () {
    var _a;
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _month_decorators;
    var _month_initializers = [];
    var _month_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _totalAmount_decorators;
    var _totalAmount_initializers = [];
    var _totalAmount_extraInitializers = [];
    var _items_decorators;
    var _items_initializers = [];
    var _items_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateBudgetDto() {
                this.year = __runInitializers(this, _year_initializers, void 0);
                this.month = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _month_initializers, void 0));
                this.title = (__runInitializers(this, _month_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.items = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _items_initializers, void 0));
                __runInitializers(this, _items_extraInitializers);
            }
            return CreateBudgetDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _year_decorators = [(0, class_validator_1.IsNumber)()];
            _month_decorators = [(0, class_validator_1.IsNumber)()];
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _totalAmount_decorators = [(0, class_validator_1.IsNumber)()];
            _items_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return BudgetItemDto; })];
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _month_decorators, { kind: "field", name: "month", static: false, private: false, access: { has: function (obj) { return "month" in obj; }, get: function (obj) { return obj.month; }, set: function (obj, value) { obj.month = value; } }, metadata: _metadata }, _month_initializers, _month_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: function (obj) { return "totalAmount" in obj; }, get: function (obj) { return obj.totalAmount; }, set: function (obj, value) { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: function (obj) { return "items" in obj; }, get: function (obj) { return obj.items; }, set: function (obj, value) { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateBudgetDto = CreateBudgetDto;
var UpdateBudgetDto = function () {
    var _a;
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    var _month_decorators;
    var _month_initializers = [];
    var _month_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _totalAmount_decorators;
    var _totalAmount_initializers = [];
    var _totalAmount_extraInitializers = [];
    var _items_decorators;
    var _items_initializers = [];
    var _items_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateBudgetDto() {
                this.year = __runInitializers(this, _year_initializers, void 0);
                this.month = (__runInitializers(this, _year_extraInitializers), __runInitializers(this, _month_initializers, void 0));
                this.title = (__runInitializers(this, _month_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.totalAmount = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _totalAmount_initializers, void 0));
                this.items = (__runInitializers(this, _totalAmount_extraInitializers), __runInitializers(this, _items_initializers, void 0));
                this.status = (__runInitializers(this, _items_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                __runInitializers(this, _status_extraInitializers);
            }
            return UpdateBudgetDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _year_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _month_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _title_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _totalAmount_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _items_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return BudgetItemDto; })];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(BudgetStatus)];
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            __esDecorate(null, null, _month_decorators, { kind: "field", name: "month", static: false, private: false, access: { has: function (obj) { return "month" in obj; }, get: function (obj) { return obj.month; }, set: function (obj, value) { obj.month = value; } }, metadata: _metadata }, _month_initializers, _month_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _totalAmount_decorators, { kind: "field", name: "totalAmount", static: false, private: false, access: { has: function (obj) { return "totalAmount" in obj; }, get: function (obj) { return obj.totalAmount; }, set: function (obj, value) { obj.totalAmount = value; } }, metadata: _metadata }, _totalAmount_initializers, _totalAmount_extraInitializers);
            __esDecorate(null, null, _items_decorators, { kind: "field", name: "items", static: false, private: false, access: { has: function (obj) { return "items" in obj; }, get: function (obj) { return obj.items; }, set: function (obj, value) { obj.items = value; } }, metadata: _metadata }, _items_initializers, _items_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateBudgetDto = UpdateBudgetDto;
var InitiatePaymentDto = function () {
    var _a;
    var _feeId_decorators;
    var _feeId_initializers = [];
    var _feeId_extraInitializers = [];
    var _paymentMethod_decorators;
    var _paymentMethod_initializers = [];
    var _paymentMethod_extraInitializers = [];
    var _returnUrl_decorators;
    var _returnUrl_initializers = [];
    var _returnUrl_extraInitializers = [];
    return _a = /** @class */ (function () {
            function InitiatePaymentDto() {
                this.feeId = __runInitializers(this, _feeId_initializers, void 0);
                this.paymentMethod = (__runInitializers(this, _feeId_extraInitializers), __runInitializers(this, _paymentMethod_initializers, void 0));
                this.returnUrl = (__runInitializers(this, _paymentMethod_extraInitializers), __runInitializers(this, _returnUrl_initializers, void 0));
                __runInitializers(this, _returnUrl_extraInitializers);
            }
            return InitiatePaymentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _feeId_decorators = [(0, class_validator_1.IsNumber)()];
            _paymentMethod_decorators = [(0, class_validator_1.IsString)()];
            _returnUrl_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _feeId_decorators, { kind: "field", name: "feeId", static: false, private: false, access: { has: function (obj) { return "feeId" in obj; }, get: function (obj) { return obj.feeId; }, set: function (obj, value) { obj.feeId = value; } }, metadata: _metadata }, _feeId_initializers, _feeId_extraInitializers);
            __esDecorate(null, null, _paymentMethod_decorators, { kind: "field", name: "paymentMethod", static: false, private: false, access: { has: function (obj) { return "paymentMethod" in obj; }, get: function (obj) { return obj.paymentMethod; }, set: function (obj, value) { obj.paymentMethod = value; } }, metadata: _metadata }, _paymentMethod_initializers, _paymentMethod_extraInitializers);
            __esDecorate(null, null, _returnUrl_decorators, { kind: "field", name: "returnUrl", static: false, private: false, access: { has: function (obj) { return "returnUrl" in obj; }, get: function (obj) { return obj.returnUrl; }, set: function (obj, value) { obj.returnUrl = value; } }, metadata: _metadata }, _returnUrl_initializers, _returnUrl_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.InitiatePaymentDto = InitiatePaymentDto;
var PaymentGatewayCallbackDto = function () {
    var _a;
    var _transactionId_decorators;
    var _transactionId_initializers = [];
    var _transactionId_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _signature_decorators;
    var _signature_initializers = [];
    var _signature_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PaymentGatewayCallbackDto() {
                this.transactionId = __runInitializers(this, _transactionId_initializers, void 0);
                this.status = (__runInitializers(this, _transactionId_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.signature = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _signature_initializers, void 0));
                __runInitializers(this, _signature_extraInitializers);
            }
            return PaymentGatewayCallbackDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _transactionId_decorators = [(0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsString)()];
            _signature_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _transactionId_decorators, { kind: "field", name: "transactionId", static: false, private: false, access: { has: function (obj) { return "transactionId" in obj; }, get: function (obj) { return obj.transactionId; }, set: function (obj, value) { obj.transactionId = value; } }, metadata: _metadata }, _transactionId_initializers, _transactionId_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _signature_decorators, { kind: "field", name: "signature", static: false, private: false, access: { has: function (obj) { return "signature" in obj; }, get: function (obj) { return obj.signature; }, set: function (obj, value) { obj.signature = value; } }, metadata: _metadata }, _signature_initializers, _signature_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PaymentGatewayCallbackDto = PaymentGatewayCallbackDto;
var FinancialReportResponseDto = function () {
    var _a;
    var _totalIncome_decorators;
    var _totalIncome_initializers = [];
    var _totalIncome_extraInitializers = [];
    var _totalExpenses_decorators;
    var _totalExpenses_initializers = [];
    var _totalExpenses_extraInitializers = [];
    var _netBalance_decorators;
    var _netBalance_initializers = [];
    var _netBalance_extraInitializers = [];
    var _transactions_decorators;
    var _transactions_initializers = [];
    var _transactions_extraInitializers = [];
    var _fees_decorators;
    var _fees_initializers = [];
    var _fees_extraInitializers = [];
    var _payments_decorators;
    var _payments_initializers = [];
    var _payments_extraInitializers = [];
    return _a = /** @class */ (function () {
            function FinancialReportResponseDto() {
                this.totalIncome = __runInitializers(this, _totalIncome_initializers, void 0);
                this.totalExpenses = (__runInitializers(this, _totalIncome_extraInitializers), __runInitializers(this, _totalExpenses_initializers, void 0));
                this.netBalance = (__runInitializers(this, _totalExpenses_extraInitializers), __runInitializers(this, _netBalance_initializers, void 0));
                this.transactions = (__runInitializers(this, _netBalance_extraInitializers), __runInitializers(this, _transactions_initializers, void 0)); // Simplified for now, could be more specific DTOs
                this.fees = (__runInitializers(this, _transactions_extraInitializers), __runInitializers(this, _fees_initializers, void 0)); // Simplified for now
                this.payments = (__runInitializers(this, _fees_extraInitializers), __runInitializers(this, _payments_initializers, void 0)); // Simplified for now
                __runInitializers(this, _payments_extraInitializers);
            }
            return FinancialReportResponseDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _totalIncome_decorators = [(0, class_validator_1.IsNumber)()];
            _totalExpenses_decorators = [(0, class_validator_1.IsNumber)()];
            _netBalance_decorators = [(0, class_validator_1.IsNumber)()];
            _transactions_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _fees_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _payments_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _totalIncome_decorators, { kind: "field", name: "totalIncome", static: false, private: false, access: { has: function (obj) { return "totalIncome" in obj; }, get: function (obj) { return obj.totalIncome; }, set: function (obj, value) { obj.totalIncome = value; } }, metadata: _metadata }, _totalIncome_initializers, _totalIncome_extraInitializers);
            __esDecorate(null, null, _totalExpenses_decorators, { kind: "field", name: "totalExpenses", static: false, private: false, access: { has: function (obj) { return "totalExpenses" in obj; }, get: function (obj) { return obj.totalExpenses; }, set: function (obj, value) { obj.totalExpenses = value; } }, metadata: _metadata }, _totalExpenses_initializers, _totalExpenses_extraInitializers);
            __esDecorate(null, null, _netBalance_decorators, { kind: "field", name: "netBalance", static: false, private: false, access: { has: function (obj) { return "netBalance" in obj; }, get: function (obj) { return obj.netBalance; }, set: function (obj, value) { obj.netBalance = value; } }, metadata: _metadata }, _netBalance_initializers, _netBalance_extraInitializers);
            __esDecorate(null, null, _transactions_decorators, { kind: "field", name: "transactions", static: false, private: false, access: { has: function (obj) { return "transactions" in obj; }, get: function (obj) { return obj.transactions; }, set: function (obj, value) { obj.transactions = value; } }, metadata: _metadata }, _transactions_initializers, _transactions_extraInitializers);
            __esDecorate(null, null, _fees_decorators, { kind: "field", name: "fees", static: false, private: false, access: { has: function (obj) { return "fees" in obj; }, get: function (obj) { return obj.fees; }, set: function (obj, value) { obj.fees = value; } }, metadata: _metadata }, _fees_initializers, _fees_extraInitializers);
            __esDecorate(null, null, _payments_decorators, { kind: "field", name: "payments", static: false, private: false, access: { has: function (obj) { return "payments" in obj; }, get: function (obj) { return obj.payments; }, set: function (obj, value) { obj.payments = value; } }, metadata: _metadata }, _payments_initializers, _payments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FinancialReportResponseDto = FinancialReportResponseDto;
var FeeFilterParamsDto = function () {
    var _a;
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _propertyId_decorators;
    var _propertyId_initializers = [];
    var _propertyId_extraInitializers = [];
    var _startDate_decorators;
    var _startDate_initializers = [];
    var _startDate_extraInitializers = [];
    var _endDate_decorators;
    var _endDate_initializers = [];
    var _endDate_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    return _a = /** @class */ (function () {
            function FeeFilterParamsDto() {
                this.page = __runInitializers(this, _page_initializers, void 0);
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                this.status = (__runInitializers(this, _limit_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.type = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.propertyId = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _propertyId_initializers, void 0));
                this.startDate = (__runInitializers(this, _propertyId_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.search = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                __runInitializers(this, _search_extraInitializers);
            }
            return FeeFilterParamsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _page_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _limit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PaymentStatus)];
            _type_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(FeeType)];
            _propertyId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _startDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _endDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _search_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _propertyId_decorators, { kind: "field", name: "propertyId", static: false, private: false, access: { has: function (obj) { return "propertyId" in obj; }, get: function (obj) { return obj.propertyId; }, set: function (obj, value) { obj.propertyId = value; } }, metadata: _metadata }, _propertyId_initializers, _propertyId_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: function (obj) { return "startDate" in obj; }, get: function (obj) { return obj.startDate; }, set: function (obj, value) { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: function (obj) { return "endDate" in obj; }, get: function (obj) { return obj.endDate; }, set: function (obj, value) { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.FeeFilterParamsDto = FeeFilterParamsDto;
var BudgetFilterParamsDto = function () {
    var _a;
    var _classSuper = FeeFilterParamsDto;
    var _year_decorators;
    var _year_initializers = [];
    var _year_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(BudgetFilterParamsDto, _super);
            function BudgetFilterParamsDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.year = __runInitializers(_this, _year_initializers, void 0);
                __runInitializers(_this, _year_extraInitializers);
                return _this;
            }
            return BudgetFilterParamsDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _year_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _year_decorators, { kind: "field", name: "year", static: false, private: false, access: { has: function (obj) { return "year" in obj; }, get: function (obj) { return obj.year; }, set: function (obj, value) { obj.year = value; } }, metadata: _metadata }, _year_initializers, _year_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.BudgetFilterParamsDto = BudgetFilterParamsDto;
var ExpenseFilterParamsDto = function () {
    var _a;
    var _classSuper = FeeFilterParamsDto;
    var _categoryId_decorators;
    var _categoryId_initializers = [];
    var _categoryId_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(ExpenseFilterParamsDto, _super);
            function ExpenseFilterParamsDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.categoryId = __runInitializers(_this, _categoryId_initializers, void 0);
                __runInitializers(_this, _categoryId_extraInitializers);
                return _this;
            }
            return ExpenseFilterParamsDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _categoryId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _categoryId_decorators, { kind: "field", name: "categoryId", static: false, private: false, access: { has: function (obj) { return "categoryId" in obj; }, get: function (obj) { return obj.categoryId; }, set: function (obj, value) { obj.categoryId = value; } }, metadata: _metadata }, _categoryId_initializers, _categoryId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ExpenseFilterParamsDto = ExpenseFilterParamsDto;
