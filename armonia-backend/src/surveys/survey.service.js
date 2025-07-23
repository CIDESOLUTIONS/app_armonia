"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SurveyService = void 0;
var common_1 = require("@nestjs/common");
var surveys_dto_1 = require("../common/dto/surveys.dto");
var SurveyService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SurveyService = _classThis = /** @class */ (function () {
        function SurveyService_1(prismaClientManager) {
            this.prismaClientManager = prismaClientManager;
        }
        SurveyService_1.prototype.getTenantPrismaClient = function (schemaName) {
            return this.prismaClientManager.getClient(schemaName);
        };
        SurveyService_1.prototype.createSurvey = function (schemaName, userId, complexId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, questions, surveyData, survey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            questions = data.questions, surveyData = __rest(data, ["questions"]);
                            return [4 /*yield*/, prisma.survey.create({
                                    data: __assign(__assign({}, surveyData), { complexId: complexId, createdBy: userId, status: surveys_dto_1.SurveyStatus.DRAFT, questions: {
                                            create: questions.map(function (q, index) { return ({
                                                text: q.text,
                                                type: q.type,
                                                options: q.options || [],
                                                order: index,
                                            }); }),
                                        } }),
                                    include: { questions: true },
                                })];
                        case 1:
                            survey = _a.sent();
                            return [2 /*return*/, survey];
                    }
                });
            });
        };
        SurveyService_1.prototype.getSurveys = function (schemaName, complexId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    return [2 /*return*/, prisma.survey.findMany({
                            where: { complexId: complexId },
                            include: { questions: true },
                            orderBy: { createdAt: 'desc' },
                        })];
                });
            });
        };
        SurveyService_1.prototype.getSurveyById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, survey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.survey.findUnique({
                                    where: { id: id },
                                    include: { questions: true },
                                })];
                        case 1:
                            survey = _a.sent();
                            if (!survey) {
                                throw new common_1.NotFoundException("Encuesta con ID ".concat(id, " no encontrada."));
                            }
                            return [2 /*return*/, survey];
                    }
                });
            });
        };
        SurveyService_1.prototype.updateSurvey = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, questions, surveyData, survey, updatedSurvey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            questions = data.questions, surveyData = __rest(data, ["questions"]);
                            return [4 /*yield*/, prisma.survey.findUnique({ where: { id: id } })];
                        case 1:
                            survey = _a.sent();
                            if (!survey) {
                                throw new common_1.NotFoundException("Encuesta con ID ".concat(id, " no encontrada."));
                            }
                            if (!questions) return [3 /*break*/, 4];
                            return [4 /*yield*/, prisma.question.deleteMany({ where: { surveyId: id } })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, prisma.question.createMany({
                                    data: questions.map(function (q, index) { return ({
                                        surveyId: id,
                                        text: q.text,
                                        type: q.type,
                                        options: q.options || [],
                                        order: index,
                                    }); }),
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, prisma.survey.update({
                                where: { id: id },
                                data: surveyData,
                                include: { questions: true },
                            })];
                        case 5:
                            updatedSurvey = _a.sent();
                            return [2 /*return*/, updatedSurvey];
                    }
                });
            });
        };
        SurveyService_1.prototype.deleteSurvey = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, survey;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.survey.findUnique({ where: { id: id } })];
                        case 1:
                            survey = _a.sent();
                            if (!survey) {
                                throw new common_1.NotFoundException("Encuesta con ID ".concat(id, " no encontrada."));
                            }
                            return [4 /*yield*/, prisma.answer.deleteMany({ where: { question: { surveyId: id } } })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, prisma.question.deleteMany({ where: { surveyId: id } })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, prisma.survey.delete({ where: { id: id } })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        SurveyService_1.prototype.submitAnswer = function (schemaName, surveyId, userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, survey, question, _i, _a, option, answer;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.survey.findUnique({
                                    where: { id: surveyId },
                                    include: { questions: true },
                                })];
                        case 1:
                            survey = _b.sent();
                            if (!survey) {
                                throw new common_1.NotFoundException("Encuesta con ID ".concat(surveyId, " no encontrada."));
                            }
                            if (survey.status !== surveys_dto_1.SurveyStatus.PUBLISHED) {
                                throw new Error('La encuesta no está publicada o ya ha finalizado.');
                            }
                            question = survey.questions.find(function (q) { return q.id === data.questionId; });
                            if (!question) {
                                throw new common_1.NotFoundException("Pregunta con ID ".concat(data.questionId, " no encontrada en esta encuesta."));
                            }
                            // Basic validation based on question type
                            if (question.type === surveys_dto_1.QuestionType.SINGLE_CHOICE ||
                                question.type === surveys_dto_1.QuestionType.MULTIPLE_CHOICE) {
                                if (!data.selectedOptions || data.selectedOptions.length === 0) {
                                    throw new Error('Debe seleccionar al menos una opción.');
                                }
                                for (_i = 0, _a = data.selectedOptions; _i < _a.length; _i++) {
                                    option = _a[_i];
                                    if (!question.options.includes(option)) {
                                        throw new Error("Opci\u00F3n '".concat(option, "' no v\u00E1lida para la pregunta."));
                                    }
                                }
                            }
                            else if (question.type === surveys_dto_1.QuestionType.TEXT) {
                                if (!data.textAnswer || data.textAnswer.trim() === '') {
                                    throw new Error('La respuesta de texto no puede estar vacía.');
                                }
                            }
                            else if (question.type === surveys_dto_1.QuestionType.RATING) {
                                if (data.rating === undefined || data.rating < 1 || data.rating > 5) {
                                    throw new Error('La calificación debe ser un número entre 1 y 5.');
                                }
                            }
                            return [4 /*yield*/, prisma.answer.create({
                                    data: {
                                        questionId: data.questionId,
                                        userId: userId,
                                        textAnswer: data.textAnswer,
                                        selectedOptions: data.selectedOptions || [],
                                        rating: data.rating,
                                        answeredAt: new Date(),
                                    },
                                })];
                        case 2:
                            answer = _b.sent();
                            return [2 /*return*/, answer];
                    }
                });
            });
        };
        SurveyService_1.prototype.getSurveyResults = function (schemaName, surveyId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, survey, results, allAnswers, _loop_1, _i, _a, question;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.survey.findUnique({
                                    where: { id: surveyId },
                                    include: {
                                        questions: {
                                            include: { answers: true },
                                        },
                                    },
                                })];
                        case 1:
                            survey = _b.sent();
                            if (!survey) {
                                throw new common_1.NotFoundException("Encuesta con ID ".concat(surveyId, " no encontrada."));
                            }
                            results = {
                                surveyId: survey.id,
                                title: survey.title,
                                description: survey.description,
                                status: survey.status,
                                startDate: survey.startDate,
                                endDate: survey.endDate,
                                totalResponses: 0,
                                questions: [],
                            };
                            return [4 /*yield*/, prisma.answer.findMany({
                                    where: { question: { surveyId: surveyId } },
                                })];
                        case 2:
                            allAnswers = _b.sent();
                            results.totalResponses = new Set(allAnswers.map(function (a) { return a.userId; })).size; // Unique users who answered
                            _loop_1 = function (question) {
                                var questionResults = {
                                    questionId: question.id,
                                    text: question.text,
                                    type: question.type,
                                    totalAnswers: question.answers.length,
                                };
                                if (question.type === surveys_dto_1.QuestionType.SINGLE_CHOICE ||
                                    question.type === surveys_dto_1.QuestionType.MULTIPLE_CHOICE) {
                                    var optionCounts_1 = {};
                                    question.options.forEach(function (option) { return (optionCounts_1[option] = 0); });
                                    question.answers.forEach(function (answer) {
                                        var _a;
                                        (_a = answer.selectedOptions) === null || _a === void 0 ? void 0 : _a.forEach(function (option) {
                                            if (optionCounts_1[option] !== undefined) {
                                                optionCounts_1[option]++;
                                            }
                                        });
                                    });
                                    questionResults.optionCounts = optionCounts_1;
                                }
                                else if (question.type === surveys_dto_1.QuestionType.RATING) {
                                    var totalRating = question.answers.reduce(function (sum, answer) { return sum + (answer.rating || 0); }, 0);
                                    questionResults.averageRating =
                                        question.answers.length > 0
                                            ? totalRating / question.answers.length
                                            : 0;
                                }
                                else if (question.type === surveys_dto_1.QuestionType.TEXT) {
                                    questionResults.textAnswers = question.answers.map(function (answer) { return answer.textAnswer; });
                                }
                                results.questions.push(questionResults);
                            };
                            for (_i = 0, _a = survey.questions; _i < _a.length; _i++) {
                                question = _a[_i];
                                _loop_1(question);
                            }
                            return [2 /*return*/, results];
                    }
                });
            });
        };
        return SurveyService_1;
    }());
    __setFunctionName(_classThis, "SurveyService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SurveyService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SurveyService = _classThis;
}();
exports.SurveyService = SurveyService;
