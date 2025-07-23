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
exports.CreateAnswerDto = exports.UpdateSurveyDto = exports.CreateSurveyDto = exports.SurveyDto = exports.AnswerDto = exports.QuestionDto = exports.QuestionType = exports.SurveyStatus = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var SurveyStatus;
(function (SurveyStatus) {
    SurveyStatus["DRAFT"] = "DRAFT";
    SurveyStatus["PUBLISHED"] = "PUBLISHED";
    SurveyStatus["CLOSED"] = "CLOSED";
})(SurveyStatus || (exports.SurveyStatus = SurveyStatus = {}));
var QuestionType;
(function (QuestionType) {
    QuestionType["SINGLE_CHOICE"] = "SINGLE_CHOICE";
    QuestionType["MULTIPLE_CHOICE"] = "MULTIPLE_CHOICE";
    QuestionType["TEXT"] = "TEXT";
    QuestionType["RATING"] = "RATING";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
var QuestionDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _surveyId_decorators;
    var _surveyId_initializers = [];
    var _surveyId_extraInitializers = [];
    var _text_decorators;
    var _text_initializers = [];
    var _text_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _options_decorators;
    var _options_initializers = [];
    var _options_extraInitializers = [];
    var _order_decorators;
    var _order_initializers = [];
    var _order_extraInitializers = [];
    return _a = /** @class */ (function () {
            function QuestionDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.surveyId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _surveyId_initializers, void 0));
                this.text = (__runInitializers(this, _surveyId_extraInitializers), __runInitializers(this, _text_initializers, void 0));
                this.type = (__runInitializers(this, _text_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.options = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _options_initializers, void 0));
                this.order = (__runInitializers(this, _options_extraInitializers), __runInitializers(this, _order_initializers, void 0));
                __runInitializers(this, _order_extraInitializers);
            }
            return QuestionDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _surveyId_decorators = [(0, class_validator_1.IsNumber)()];
            _text_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsEnum)(QuestionType)];
            _options_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _order_decorators = [(0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _surveyId_decorators, { kind: "field", name: "surveyId", static: false, private: false, access: { has: function (obj) { return "surveyId" in obj; }, get: function (obj) { return obj.surveyId; }, set: function (obj, value) { obj.surveyId = value; } }, metadata: _metadata }, _surveyId_initializers, _surveyId_extraInitializers);
            __esDecorate(null, null, _text_decorators, { kind: "field", name: "text", static: false, private: false, access: { has: function (obj) { return "text" in obj; }, get: function (obj) { return obj.text; }, set: function (obj, value) { obj.text = value; } }, metadata: _metadata }, _text_initializers, _text_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _options_decorators, { kind: "field", name: "options", static: false, private: false, access: { has: function (obj) { return "options" in obj; }, get: function (obj) { return obj.options; }, set: function (obj, value) { obj.options = value; } }, metadata: _metadata }, _options_initializers, _options_extraInitializers);
            __esDecorate(null, null, _order_decorators, { kind: "field", name: "order", static: false, private: false, access: { has: function (obj) { return "order" in obj; }, get: function (obj) { return obj.order; }, set: function (obj, value) { obj.order = value; } }, metadata: _metadata }, _order_initializers, _order_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.QuestionDto = QuestionDto;
var AnswerDto = function () {
    var _a;
    var _id_decorators;
    var _id_initializers = [];
    var _id_extraInitializers = [];
    var _questionId_decorators;
    var _questionId_initializers = [];
    var _questionId_extraInitializers = [];
    var _userId_decorators;
    var _userId_initializers = [];
    var _userId_extraInitializers = [];
    var _textAnswer_decorators;
    var _textAnswer_initializers = [];
    var _textAnswer_extraInitializers = [];
    var _selectedOptions_decorators;
    var _selectedOptions_initializers = [];
    var _selectedOptions_extraInitializers = [];
    var _rating_decorators;
    var _rating_initializers = [];
    var _rating_extraInitializers = [];
    var _answeredAt_decorators;
    var _answeredAt_initializers = [];
    var _answeredAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AnswerDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.questionId = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _questionId_initializers, void 0));
                this.userId = (__runInitializers(this, _questionId_extraInitializers), __runInitializers(this, _userId_initializers, void 0));
                this.textAnswer = (__runInitializers(this, _userId_extraInitializers), __runInitializers(this, _textAnswer_initializers, void 0));
                this.selectedOptions = (__runInitializers(this, _textAnswer_extraInitializers), __runInitializers(this, _selectedOptions_initializers, void 0));
                this.rating = (__runInitializers(this, _selectedOptions_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
                this.answeredAt = (__runInitializers(this, _rating_extraInitializers), __runInitializers(this, _answeredAt_initializers, void 0));
                __runInitializers(this, _answeredAt_extraInitializers);
            }
            return AnswerDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _questionId_decorators = [(0, class_validator_1.IsNumber)()];
            _userId_decorators = [(0, class_validator_1.IsNumber)()];
            _textAnswer_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _selectedOptions_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)({ each: true })];
            _rating_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _answeredAt_decorators = [(0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _questionId_decorators, { kind: "field", name: "questionId", static: false, private: false, access: { has: function (obj) { return "questionId" in obj; }, get: function (obj) { return obj.questionId; }, set: function (obj, value) { obj.questionId = value; } }, metadata: _metadata }, _questionId_initializers, _questionId_extraInitializers);
            __esDecorate(null, null, _userId_decorators, { kind: "field", name: "userId", static: false, private: false, access: { has: function (obj) { return "userId" in obj; }, get: function (obj) { return obj.userId; }, set: function (obj, value) { obj.userId = value; } }, metadata: _metadata }, _userId_initializers, _userId_extraInitializers);
            __esDecorate(null, null, _textAnswer_decorators, { kind: "field", name: "textAnswer", static: false, private: false, access: { has: function (obj) { return "textAnswer" in obj; }, get: function (obj) { return obj.textAnswer; }, set: function (obj, value) { obj.textAnswer = value; } }, metadata: _metadata }, _textAnswer_initializers, _textAnswer_extraInitializers);
            __esDecorate(null, null, _selectedOptions_decorators, { kind: "field", name: "selectedOptions", static: false, private: false, access: { has: function (obj) { return "selectedOptions" in obj; }, get: function (obj) { return obj.selectedOptions; }, set: function (obj, value) { obj.selectedOptions = value; } }, metadata: _metadata }, _selectedOptions_initializers, _selectedOptions_extraInitializers);
            __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: function (obj) { return "rating" in obj; }, get: function (obj) { return obj.rating; }, set: function (obj, value) { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
            __esDecorate(null, null, _answeredAt_decorators, { kind: "field", name: "answeredAt", static: false, private: false, access: { has: function (obj) { return "answeredAt" in obj; }, get: function (obj) { return obj.answeredAt; }, set: function (obj, value) { obj.answeredAt = value; } }, metadata: _metadata }, _answeredAt_initializers, _answeredAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AnswerDto = AnswerDto;
var SurveyDto = function () {
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
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _startDate_decorators;
    var _startDate_initializers = [];
    var _startDate_extraInitializers = [];
    var _endDate_decorators;
    var _endDate_initializers = [];
    var _endDate_extraInitializers = [];
    var _questions_decorators;
    var _questions_initializers = [];
    var _questions_extraInitializers = [];
    var _complexId_decorators;
    var _complexId_initializers = [];
    var _complexId_extraInitializers = [];
    var _createdBy_decorators;
    var _createdBy_initializers = [];
    var _createdBy_extraInitializers = [];
    var _createdAt_decorators;
    var _createdAt_initializers = [];
    var _createdAt_extraInitializers = [];
    var _updatedAt_decorators;
    var _updatedAt_initializers = [];
    var _updatedAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SurveyDto() {
                this.id = __runInitializers(this, _id_initializers, void 0);
                this.title = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.startDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.questions = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _questions_initializers, void 0));
                this.complexId = (__runInitializers(this, _questions_extraInitializers), __runInitializers(this, _complexId_initializers, void 0));
                this.createdBy = (__runInitializers(this, _complexId_extraInitializers), __runInitializers(this, _createdBy_initializers, void 0));
                this.createdAt = (__runInitializers(this, _createdBy_extraInitializers), __runInitializers(this, _createdAt_initializers, void 0));
                this.updatedAt = (__runInitializers(this, _createdAt_extraInitializers), __runInitializers(this, _updatedAt_initializers, void 0));
                __runInitializers(this, _updatedAt_extraInitializers);
            }
            return SurveyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _id_decorators = [(0, class_validator_1.IsNumber)()];
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsEnum)(SurveyStatus)];
            _startDate_decorators = [(0, class_validator_1.IsDateString)()];
            _endDate_decorators = [(0, class_validator_1.IsDateString)()];
            _questions_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return QuestionDto; })];
            _complexId_decorators = [(0, class_validator_1.IsNumber)()];
            _createdBy_decorators = [(0, class_validator_1.IsNumber)()];
            _createdAt_decorators = [(0, class_validator_1.IsDateString)()];
            _updatedAt_decorators = [(0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: function (obj) { return "id" in obj; }, get: function (obj) { return obj.id; }, set: function (obj, value) { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: function (obj) { return "startDate" in obj; }, get: function (obj) { return obj.startDate; }, set: function (obj, value) { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: function (obj) { return "endDate" in obj; }, get: function (obj) { return obj.endDate; }, set: function (obj, value) { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _questions_decorators, { kind: "field", name: "questions", static: false, private: false, access: { has: function (obj) { return "questions" in obj; }, get: function (obj) { return obj.questions; }, set: function (obj, value) { obj.questions = value; } }, metadata: _metadata }, _questions_initializers, _questions_extraInitializers);
            __esDecorate(null, null, _complexId_decorators, { kind: "field", name: "complexId", static: false, private: false, access: { has: function (obj) { return "complexId" in obj; }, get: function (obj) { return obj.complexId; }, set: function (obj, value) { obj.complexId = value; } }, metadata: _metadata }, _complexId_initializers, _complexId_extraInitializers);
            __esDecorate(null, null, _createdBy_decorators, { kind: "field", name: "createdBy", static: false, private: false, access: { has: function (obj) { return "createdBy" in obj; }, get: function (obj) { return obj.createdBy; }, set: function (obj, value) { obj.createdBy = value; } }, metadata: _metadata }, _createdBy_initializers, _createdBy_extraInitializers);
            __esDecorate(null, null, _createdAt_decorators, { kind: "field", name: "createdAt", static: false, private: false, access: { has: function (obj) { return "createdAt" in obj; }, get: function (obj) { return obj.createdAt; }, set: function (obj, value) { obj.createdAt = value; } }, metadata: _metadata }, _createdAt_initializers, _createdAt_extraInitializers);
            __esDecorate(null, null, _updatedAt_decorators, { kind: "field", name: "updatedAt", static: false, private: false, access: { has: function (obj) { return "updatedAt" in obj; }, get: function (obj) { return obj.updatedAt; }, set: function (obj, value) { obj.updatedAt = value; } }, metadata: _metadata }, _updatedAt_initializers, _updatedAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SurveyDto = SurveyDto;
var CreateSurveyDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _startDate_decorators;
    var _startDate_initializers = [];
    var _startDate_extraInitializers = [];
    var _endDate_decorators;
    var _endDate_initializers = [];
    var _endDate_extraInitializers = [];
    var _questions_decorators;
    var _questions_initializers = [];
    var _questions_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateSurveyDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.startDate = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.questions = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _questions_initializers, void 0));
                __runInitializers(this, _questions_extraInitializers);
            }
            return CreateSurveyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _startDate_decorators = [(0, class_validator_1.IsDateString)()];
            _endDate_decorators = [(0, class_validator_1.IsDateString)()];
            _questions_decorators = [(0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return QuestionDto; })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: function (obj) { return "startDate" in obj; }, get: function (obj) { return obj.startDate; }, set: function (obj, value) { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: function (obj) { return "endDate" in obj; }, get: function (obj) { return obj.endDate; }, set: function (obj, value) { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _questions_decorators, { kind: "field", name: "questions", static: false, private: false, access: { has: function (obj) { return "questions" in obj; }, get: function (obj) { return obj.questions; }, set: function (obj, value) { obj.questions = value; } }, metadata: _metadata }, _questions_initializers, _questions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateSurveyDto = CreateSurveyDto;
var UpdateSurveyDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    var _startDate_decorators;
    var _startDate_initializers = [];
    var _startDate_extraInitializers = [];
    var _endDate_decorators;
    var _endDate_initializers = [];
    var _endDate_extraInitializers = [];
    var _questions_decorators;
    var _questions_initializers = [];
    var _questions_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateSurveyDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.status = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _status_initializers, void 0));
                this.startDate = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _startDate_initializers, void 0));
                this.endDate = (__runInitializers(this, _startDate_extraInitializers), __runInitializers(this, _endDate_initializers, void 0));
                this.questions = (__runInitializers(this, _endDate_extraInitializers), __runInitializers(this, _questions_initializers, void 0));
                __runInitializers(this, _questions_extraInitializers);
            }
            return UpdateSurveyDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(SurveyStatus)];
            _startDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _endDate_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _questions_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.ValidateNested)({ each: true }), (0, class_transformer_1.Type)(function () { return QuestionDto; })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            __esDecorate(null, null, _startDate_decorators, { kind: "field", name: "startDate", static: false, private: false, access: { has: function (obj) { return "startDate" in obj; }, get: function (obj) { return obj.startDate; }, set: function (obj, value) { obj.startDate = value; } }, metadata: _metadata }, _startDate_initializers, _startDate_extraInitializers);
            __esDecorate(null, null, _endDate_decorators, { kind: "field", name: "endDate", static: false, private: false, access: { has: function (obj) { return "endDate" in obj; }, get: function (obj) { return obj.endDate; }, set: function (obj, value) { obj.endDate = value; } }, metadata: _metadata }, _endDate_initializers, _endDate_extraInitializers);
            __esDecorate(null, null, _questions_decorators, { kind: "field", name: "questions", static: false, private: false, access: { has: function (obj) { return "questions" in obj; }, get: function (obj) { return obj.questions; }, set: function (obj, value) { obj.questions = value; } }, metadata: _metadata }, _questions_initializers, _questions_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateSurveyDto = UpdateSurveyDto;
var CreateAnswerDto = function () {
    var _a;
    var _questionId_decorators;
    var _questionId_initializers = [];
    var _questionId_extraInitializers = [];
    var _textAnswer_decorators;
    var _textAnswer_initializers = [];
    var _textAnswer_extraInitializers = [];
    var _selectedOptions_decorators;
    var _selectedOptions_initializers = [];
    var _selectedOptions_extraInitializers = [];
    var _rating_decorators;
    var _rating_initializers = [];
    var _rating_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateAnswerDto() {
                this.questionId = __runInitializers(this, _questionId_initializers, void 0);
                this.textAnswer = (__runInitializers(this, _questionId_extraInitializers), __runInitializers(this, _textAnswer_initializers, void 0));
                this.selectedOptions = (__runInitializers(this, _textAnswer_extraInitializers), __runInitializers(this, _selectedOptions_initializers, void 0));
                this.rating = (__runInitializers(this, _selectedOptions_extraInitializers), __runInitializers(this, _rating_initializers, void 0));
                __runInitializers(this, _rating_extraInitializers);
            }
            return CreateAnswerDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _questionId_decorators = [(0, class_validator_1.IsNumber)()];
            _textAnswer_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _selectedOptions_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _rating_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _questionId_decorators, { kind: "field", name: "questionId", static: false, private: false, access: { has: function (obj) { return "questionId" in obj; }, get: function (obj) { return obj.questionId; }, set: function (obj, value) { obj.questionId = value; } }, metadata: _metadata }, _questionId_initializers, _questionId_extraInitializers);
            __esDecorate(null, null, _textAnswer_decorators, { kind: "field", name: "textAnswer", static: false, private: false, access: { has: function (obj) { return "textAnswer" in obj; }, get: function (obj) { return obj.textAnswer; }, set: function (obj, value) { obj.textAnswer = value; } }, metadata: _metadata }, _textAnswer_initializers, _textAnswer_extraInitializers);
            __esDecorate(null, null, _selectedOptions_decorators, { kind: "field", name: "selectedOptions", static: false, private: false, access: { has: function (obj) { return "selectedOptions" in obj; }, get: function (obj) { return obj.selectedOptions; }, set: function (obj, value) { obj.selectedOptions = value; } }, metadata: _metadata }, _selectedOptions_initializers, _selectedOptions_extraInitializers);
            __esDecorate(null, null, _rating_decorators, { kind: "field", name: "rating", static: false, private: false, access: { has: function (obj) { return "rating" in obj; }, get: function (obj) { return obj.rating; }, set: function (obj, value) { obj.rating = value; } }, metadata: _metadata }, _rating_initializers, _rating_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateAnswerDto = CreateAnswerDto;
