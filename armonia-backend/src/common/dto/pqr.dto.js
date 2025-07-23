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
exports.UpdatePQRDto = exports.CreatePQRDto = exports.GetPQRParamsDto = exports.PQRDto = exports.PQRCommentDto = exports.PQRPriority = exports.PQRStatus = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var PQRStatus;
(function (PQRStatus) {
    PQRStatus["OPEN"] = "OPEN";
    PQRStatus["IN_PROGRESS"] = "IN_PROGRESS";
    PQRStatus["CLOSED"] = "CLOSED";
    PQRStatus["REJECTED"] = "REJECTED";
})(PQRStatus || (exports.PQRStatus = PQRStatus = {}));
var PQRPriority;
(function (PQRPriority) {
    PQRPriority["LOW"] = "LOW";
    PQRPriority["MEDIUM"] = "MEDIUM";
    PQRPriority["HIGH"] = "HIGH";
})(PQRPriority || (exports.PQRPriority = PQRPriority = {}));
var PQRCommentDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _pqrId_decorators;
    var _pqrId_initializers = [];
    var _pqrId_extraInitializers = [];
    var _authorId_decorators;
    var _authorId_initializers = [];
    var _authorId_extraInitializers = [];
    var _authorName_decorators;
    var _authorName_initializers = [];
    var _authorName_extraInitializers = [];
    var _comment_decorators;
    var _comment_initializers = [];
    var _comment_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PQRCommentDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.pqrId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _pqrId_initializers, void 0));
                this.authorId = (__runInitializers(this, _pqrId_extraInitializers), __runInitializers(this, _authorId_initializers, void 0));
                this.authorName = (__runInitializers(this, _authorId_extraInitializers), __runInitializers(this, _authorName_initializers, void 0));
                this.comment = (__runInitializers(this, _authorName_extraInitializers), __runInitializers(this, _comment_initializers, void 0));
                this.createdAt = (__runInitializers(this, _comment_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                __runInitializers(this, _createdAt_extraInitializers);
            }
            return PQRCommentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _pqrId_decorators = [(0, class_validator_1.IsNumber)()];
            _authorId_decorators = [(0, class_validator_1.IsNumber)()];
            _authorName_decorators = [(0, class_validator_1.IsString)()];
            _comment_decorators = [(0, class_validator_1.IsString)()];
            _createdAt_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _pqrId_decorators, { kind: "field", name: "pqrId", static: false, private: false, access: { has: function (obj) { return "pqrId" in obj; }, get: function (obj) { return obj.pqrId; }, set: function (obj, value) { obj.pqrId = value; } }, metadata: _metadata }, _pqrId_initializers, _pqrId_extraInitializers);
            __esDecorate(null, null, _authorId_decorators, { kind: "field", name: "authorId", static: false, private: false, access: { has: function (obj) { return "authorId" in obj; }, get: function (obj) { return obj.authorId; }, set: function (obj, value) { obj.authorId = value; } }, metadata: _metadata }, _authorId_initializers, _authorId_extraInitializers);
            __esDecorate(null, null, _authorName_decorators, { kind: "field", name: "authorName", static: false, private: false, access: { has: function (obj) { return "authorName" in obj; }, get: function (obj) { return obj.authorName; }, set: function (obj, value) { obj.authorName = value; } }, metadata: _metadata }, _authorName_initializers, _authorName_extraInitializers);
            __esDecorate(null, null, _comment_decorators, { kind: "field", name: "comment", static: false, private: false, access: { has: function (obj) { return "comment" in obj; }, get: function (obj) { return obj.comment; }, set: function (obj, value) { obj.comment = value; } }, metadata: _metadata }, _comment_initializers, _comment_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PQRCommentDto = PQRCommentDto;
var PQRDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _reportedById_decorators;
    var _reportedById_initializers = [];
    var _reportedById_extraInitializers = [];
    var _reportedByName_decorators;
    var _reportedByName_initializers = [];
    var _reportedByName_extraInitializers = [];
    var _assignedToId_decorators;
    var _assignedToId_initializers = [];
    var _assignedToId_extraInitializers = [];
    var _assignedToName_decorators;
    var _assignedToName_initializers = [];
    var _assignedToName_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    var _comments_decorators;
    var _comments_initializers = [];
    var _comments_extraInitializers = [];
    return _a = /** @class */ (function () {
            function PQRDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.subject = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
                this.description = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.category = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.reportedById = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _reportedById_initializers, void 0));
                this.reportedByName = (__runInitializers(this, _reportedById_extraInitializers), __runInitializers(this, _reportedByName_initializers, void 0));
                this.assignedToId = (__runInitializers(this, _reportedByName_extraInitializers), __runInitializers(this, _assignedToId_initializers, void 0));
                this.assignedToName = (__runInitializers(this, _assignedToId_extraInitializers), __runInitializers(this, _assignedToName_initializers, void 0));
                this.createdAt = (__runInitializers(this, _assignedToName_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                this.comments = (__runInitializers(this, _updatedAt_extraInitializers), __runInitializers(this, _comments_initializers, void 0));
                __runInitializers(this, _comments_extraInitializers);
            }
            return PQRDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _subject_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsEnum)(PQRStatus)];
            _priority_decorators = [(0, class_validator_1.IsEnum)(PQRPriority)];
            _category_decorators = [(0, class_validator_1.IsString)()];
            _reportedById_decorators = [(0, class_validator_1.IsNumber)()];
            _reportedByName_decorators = [(0, class_validator_1.IsString)()];
            _assignedToId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _assignedToName_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _createdAt_decorators = [(0, class_validator_1.IsString)()];
            _updatedAt_decorators = [(0, class_validator_1.IsString)()];
            _comments_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return PQRCommentDto; })];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _reportedById_decorators, { kind: "field", name: "reportedById", static: false, private: false, access: { has: function (obj) { return "reportedById" in obj; }, get: function (obj) { return obj.reportedById; }, set: function (obj, value) { obj.reportedById = value; } }, metadata: _metadata }, _reportedById_initializers, _reportedById_extraInitializers);
            __esDecorate(null, null, _reportedByName_decorators, { kind: "field", name: "reportedByName", static: false, private: false, access: { has: function (obj) { return "reportedByName" in obj; }, get: function (obj) { return obj.reportedByName; }, set: function (obj, value) { obj.reportedByName = value; } }, metadata: _metadata }, _reportedByName_initializers, _reportedByName_extraInitializers);
            __esDecorate(null, null, _assignedToId_decorators, { kind: "field", name: "assignedToId", static: false, private: false, access: { has: function (obj) { return "assignedToId" in obj; }, get: function (obj) { return obj.assignedToId; }, set: function (obj, value) { obj.assignedToId = value; } }, metadata: _metadata }, _assignedToId_initializers, _assignedToId_extraInitializers);
            __esDecorate(null, null, _assignedToName_decorators, { kind: "field", name: "assignedToName", static: false, private: false, access: { has: function (obj) { return "assignedToName" in obj; }, get: function (obj) { return obj.assignedToName; }, set: function (obj, value) { obj.assignedToName = value; } }, metadata: _metadata }, _assignedToName_initializers, _assignedToName_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            __esDecorate(null, null, _comments_decorators, { kind: "field", name: "comments", static: false, private: false, access: { has: function (obj) { return "comments" in obj; }, get: function (obj) { return obj.comments; }, set: function (obj, value) { obj.comments = value; } }, metadata: _metadata }, _comments_initializers, _comments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.PQRDto = PQRDto;
var GetPQRParamsDto = function () {
    var _a;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    return _a = /** @class */ (function () {
            function GetPQRParamsDto() {
                this.status = __runInitializers(this, _status_initializers, void 0);
                this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.search = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _search_initializers, void 0));
                __runInitializers(this, _search_extraInitializers);
            }
            return GetPQRParamsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PQRStatus)];
            _priority_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PQRPriority)];
            _search_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.GetPQRParamsDto = GetPQRParamsDto;
var CreatePQRDto = function () {
    var _a;
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    var _reportedById_decorators;
    var _reportedById_initializers = [];
    var _reportedById_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreatePQRDto() {
                this.subject = __runInitializers(this, _subject_initializers, void 0);
                this.description = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.category = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.priority = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.reportedById = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _reportedById_initializers, void 0));
                __runInitializers(this, _reportedById_extraInitializers);
            }
            return CreatePQRDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _subject_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _category_decorators = [(0, class_validator_1.IsString)()];
            _priority_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PQRPriority)];
            _reportedById_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _reportedById_decorators, { kind: "field", name: "reportedById", static: false, private: false, access: { has: function (obj) { return "reportedById" in obj; }, get: function (obj) { return obj.reportedById; }, set: function (obj, value) { obj.reportedById = value; } }, metadata: _metadata }, _reportedById_initializers, _reportedById_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreatePQRDto = CreatePQRDto;
var UpdatePQRDto = function () {
    var _a;
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _assignedToId_decorators;
    var _assignedToId_initializers = [];
    var _assignedToId_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdatePQRDto() {
                this.subject = __runInitializers(this, _subject_initializers, void 0);
                this.description = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.priority = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.category = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.assignedToId = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _assignedToId_initializers, void 0));
                __runInitializers(this, _assignedToId_extraInitializers);
            }
            return UpdatePQRDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _subject_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PQRStatus)];
            _priority_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(PQRPriority)];
            _category_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _assignedToId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _assignedToId_decorators, { kind: "field", name: "assignedToId", static: false, private: false, access: { has: function (obj) { return "assignedToId" in obj; }, get: function (obj) { return obj.assignedToId; }, set: function (obj, value) { obj.assignedToId = value; } }, metadata: _metadata }, _assignedToId_initializers, _assignedToId_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdatePQRDto = UpdatePQRDto;
