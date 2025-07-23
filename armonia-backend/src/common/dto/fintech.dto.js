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
exports.MicroCreditApplicationDto = exports.UpdateMicroCreditApplicationDto = exports.CreateMicroCreditApplicationDto = exports.MicroCreditStatus = void 0;
var class_validator_1 = require("class-validator");
var MicroCreditStatus;
(function (MicroCreditStatus) {
    MicroCreditStatus["PENDING"] = "pending";
    MicroCreditStatus["APPROVED"] = "approved";
    MicroCreditStatus["REJECTED"] = "rejected";
    MicroCreditStatus["PAID"] = "paid";
})(MicroCreditStatus || (exports.MicroCreditStatus = MicroCreditStatus = {}));
var CreateMicroCreditApplicationDto = function () {
    var _a;
    var _amount_decorators;
    var _amount_initializers = [];
    var _amount_extraInitializers = [];
    var _purpose_decorators;
    var _purpose_initializers = [];
    var _purpose_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateMicroCreditApplicationDto() {
                this.amount = __runInitializers(this, _amount_initializers, void 0);
                this.purpose = (__runInitializers(this, _amount_extraInitializers), __runInitializers(this, _purpose_initializers, void 0));
                __runInitializers(this, _purpose_extraInitializers);
            }
            return CreateMicroCreditApplicationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _amount_decorators = [(0, class_validator_1.IsNumber)()];
            _purpose_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _amount_decorators, { kind: "field", name: "amount", static: false, private: false, access: { has: function (obj) { return "amount" in obj; }, get: function (obj) { return obj.amount; }, set: function (obj, value) { obj.amount = value; } }, metadata: _metadata }, _amount_initializers, _amount_extraInitializers);
            __esDecorate(null, null, _purpose_decorators, { kind: "field", name: "purpose", static: false, private: false, access: { has: function (obj) { return "purpose" in obj; }, get: function (obj) { return obj.purpose; }, set: function (obj, value) { obj.purpose = value; } }, metadata: _metadata }, _purpose_initializers, _purpose_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateMicroCreditApplicationDto = CreateMicroCreditApplicationDto;
var UpdateMicroCreditApplicationDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _approvalDate_decorators;
    var _approvalDate_initializers = [];
    var _approvalDate_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateMicroCreditApplicationDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.approvalDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _approvalDate_initializers, void 0));
                __runInitializers(this, _approvalDate_extraInitializers);
            }
            return UpdateMicroCreditApplicationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(MicroCreditStatus)];
            _approvalDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _approvalDate_decorators, { kind: "field", name: "approvalDate", static: false, private: false, access: { has: function (obj) { return "approvalDate" in obj; }, get: function (obj) { return obj.approvalDate; }, set: function (obj, value) { obj.approvalDate = value; } }, metadata: _metadata }, _approvalDate_initializers, _approvalDate_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateMicroCreditApplicationDto = UpdateMicroCreditApplicationDto;
var MicroCreditApplicationDto = /** @class */ (function () {
    function MicroCreditApplicationDto() {
    }
    return MicroCreditApplicationDto;
}());
exports.MicroCreditApplicationDto = MicroCreditApplicationDto;
