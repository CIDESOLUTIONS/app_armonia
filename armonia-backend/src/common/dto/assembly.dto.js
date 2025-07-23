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
exports.SubmitVoteDto = exports.CreateVoteDto = exports.RegisterAttendanceDto = exports.AssemblyDto = exports.UpdateAssemblyDto = exports.CreateAssemblyDto = exports.AssemblyStatus = exports.AssemblyType = void 0;
var class_validator_1 = require("class-validator");
var AssemblyType;
(function (AssemblyType) {
    AssemblyType["ORDINARY"] = "ORDINARY";
    AssemblyType["EXTRAORDINARY"] = "EXTRAORDINARY";
})(AssemblyType || (exports.AssemblyType = AssemblyType = {}));
var AssemblyStatus;
(function (AssemblyStatus) {
    AssemblyStatus["SCHEDULED"] = "SCHEDULED";
    AssemblyStatus["IN_PROGRESS"] = "IN_PROGRESS";
    AssemblyStatus["COMPLETED"] = "COMPLETED";
    AssemblyStatus["CANCELLED"] = "CANCELLED";
})(AssemblyStatus || (exports.AssemblyStatus = AssemblyStatus = {}));
var CreateAssemblyDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _scheduledDate_decorators;
    var _scheduledDate_initializers = [];
    var _scheduledDate_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _agenda_decorators;
    var _agenda_initializers = [];
    var _agenda_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateAssemblyDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.scheduledDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _scheduledDate_initializers, void 0));
                this.location = (__runInitializers(this, _scheduledDate_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.type = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.agenda = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _agenda_initializers, void 0));
                __runInitializers(this, _agenda_extraInitializers);
            }
            return CreateAssemblyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _scheduledDate_decorators = [(0, class_validator_1.IsDateString)()];
            _location_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsEnum)(AssemblyType)];
            _agenda_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _scheduledDate_decorators, { kind: "field", name: "scheduledDate", static: false, private: false, access: { has: function (obj) { return "scheduledDate" in obj; }, get: function (obj) { return obj.scheduledDate; }, set: function (obj, value) { obj.scheduledDate = value; } }, metadata: _metadata }, _scheduledDate_initializers, _scheduledDate_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _agenda_decorators, { kind: "field", name: "agenda", static: false, private: false, access: { has: function (obj) { return "agenda" in obj; }, get: function (obj) { return obj.agenda; }, set: function (obj, value) { obj.agenda = value; } }, metadata: _metadata }, _agenda_initializers, _agenda_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateAssemblyDto = CreateAssemblyDto;
var UpdateAssemblyDto = function () {
    var _a;
    var _classSuper = CreateAssemblyDto;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(UpdateAssemblyDto, _super);
            function UpdateAssemblyDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.status = __runInitializers(_this, _status_initializers, void 0);
                __runInitializers(_this, _status_extraInitializers);
                return _this;
            }
            return UpdateAssemblyDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(AssemblyStatus)];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateAssemblyDto = UpdateAssemblyDto;
var AssemblyDto = /** @class */ (function () {
    function AssemblyDto() {
    }
    return AssemblyDto;
}());
exports.AssemblyDto = AssemblyDto;
var RegisterAttendanceDto = function () {
    var _a;
    var _assemblyId_decorators;
    var _assemblyId_initializers = [];
    var _assemblyId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _unitId_decorators;
    var _unitId_initializers = [];
    var _unitId_extraInitializers = [];
    var _present_decorators;
    var _present_initializers = [];
    var _present_extraInitializers = [];
    return _a = /** @class */ (function () {
            function RegisterAttendanceDto() {
                this.assemblyId = __runInitializers(this, _assemblyId_initializers, void 0);
                this.userId = (__runInitializers(this, _assemblyId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.unitId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _unitId_initializers, void 0));
                this.present = (__runInitializers(this, _unitId_extraInitializers), __runInitializers(this, _present_initializers, void 0));
                __runInitializers(this, _present_extraInitializers);
            }
            return RegisterAttendanceDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _assemblyId_decorators = [(0, class_validator_1.IsNumber)()];
            _userId_decorators = [(0, class_validator_1.IsNumber)()];
            _unitId_decorators = [(0, class_validator_1.IsNumber)()];
            _present_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _assemblyId_decorators, { kind: "field", name: "assemblyId", static: false, private: false, access: { has: function (obj) { return "assemblyId" in obj; }, get: function (obj) { return obj.assemblyId; }, set: function (obj, value) { obj.assemblyId = value; } }, metadata: _metadata }, _assemblyId_initializers, _assemblyId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _unitId_decorators, { kind: "field", name: "unitId", static: false, private: false, access: { has: function (obj) { return "unitId" in obj; }, get: function (obj) { return obj.unitId; }, set: function (obj, value) { obj.unitId = value; } }, metadata: _metadata }, _unitId_initializers, _unitId_extraInitializers);
            __esDecorate(null, null, _present_decorators, { kind: "field", name: "present", static: false, private: false, access: { has: function (obj) { return "present" in obj; }, get: function (obj) { return obj.present; }, set: function (obj, value) { obj.present = value; } }, metadata: _metadata }, _present_initializers, _present_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.RegisterAttendanceDto = RegisterAttendanceDto;
var CreateVoteDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _options_decorators;
    var _options_initializers = [];
    var _options_extraInitializers = [];
    var _weightedVoting_decorators;
    var _weightedVoting_initializers = [];
    var _weightedVoting_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateVoteDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.options = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _options_initializers, void 0)); // Array of option texts
                this.weightedVoting = (__runInitializers(this, _options_extraInitializers), __runInitializers(this, _weightedVoting_initializers, void 0));
                __runInitializers(this, _weightedVoting_extraInitializers);
            }
            return CreateVoteDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _options_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _weightedVoting_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _options_decorators, { kind: "field", name: "options", static: false, private: false, access: { has: function (obj) { return "options" in obj; }, get: function (obj) { return obj.options; }, set: function (obj, value) { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
            __esDecorate(null, null, _weightedVoting_decorators, { kind: "field", name: "weightedVoting", static: false, private: false, access: { has: function (obj) { return "weightedVoting" in obj; }, get: function (obj) { return obj.weightedVoting; }, set: function (obj, value) { obj.weightedVoting = value; } }, metadata: _metadata }, _weightedVoting_initializers, _weightedVoting_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateVoteDto = CreateVoteDto;
var SubmitVoteDto = function () {
    var _a;
    var _voteId_decorators;
    var _voteId_initializers = [];
    var _voteId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _unitId_decorators;
    var _unitId_initializers = [];
    var _unitId_extraInitializers = [];
    var _option_decorators;
    var _option_initializers = [];
    var _option_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SubmitVoteDto() {
                this.voteId = __runInitializers(this, _voteId_initializers, void 0);
                this.userId = (__runInitializers(this, _voteId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.unitId = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _unitId_initializers, void 0));
                this.option = (__runInitializers(this, _unitId_extraInitializers), __runInitializers(this, _option_initializers, void 0));
                __runInitializers(this, _option_extraInitializers);
            }
            return SubmitVoteDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _voteId_decorators = [(0, class_validator_1.IsNumber)()];
            _userId_decorators = [(0, class_validator_1.IsNumber)()];
            _unitId_decorators = [(0, class_validator_1.IsNumber)()];
            _option_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _voteId_decorators, { kind: "field", name: "voteId", static: false, private: false, access: { has: function (obj) { return "voteId" in obj; }, get: function (obj) { return obj.voteId; }, set: function (obj, value) { obj.voteId = value; } }, metadata: _metadata }, _voteId_initializers, _voteId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _unitId_decorators, { kind: "field", name: "unitId", static: false, private: false, access: { has: function (obj) { return "unitId" in obj; }, get: function (obj) { return obj.unitId; }, set: function (obj, value) { obj.unitId = value; } }, metadata: _metadata }, _unitId_initializers, _unitId_extraInitializers);
            __esDecorate(null, null, _option_decorators, { kind: "field", name: "option", static: false, private: false, access: { has: function (obj) { return "option" in obj; }, get: function (obj) { return obj.option; }, set: function (obj, value) { obj.option = value; } }, metadata: _metadata }, _option_initializers, _option_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SubmitVoteDto = SubmitVoteDto;
