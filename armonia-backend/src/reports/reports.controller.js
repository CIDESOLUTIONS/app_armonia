"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../auth/roles.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var user_role_enum_1 = require("../common/enums/user-role.enum");
var ReportsController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, (0, roles_guard_1.RolesGuard)([
            user_role_enum_1.UserRole.COMPLEX_ADMIN,
            user_role_enum_1.UserRole.ADMIN,
            user_role_enum_1.UserRole.RECEPTION,
            user_role_enum_1.UserRole.STAFF,
        ])), (0, common_1.Controller)('reports')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getVisitorsReportPdf_decorators;
    var _getVisitorsReportExcel_decorators;
    var _getPackagesReportPdf_decorators;
    var _getPackagesReportExcel_decorators;
    var _getIncidentsReportPdf_decorators;
    var _getIncidentsReportExcel_decorators;
    var _getConsolidatedFinancialReportPdf_decorators;
    var ReportsController = _classThis = /** @class */ (function () {
        function ReportsController_1(reportsService) {
            this.reportsService = (__runInitializers(this, _instanceExtraInitializers), reportsService);
        }
        ReportsController_1.prototype.getVisitorsReportPdf = function (req, startDate, endDate, res) {
            return __awaiter(this, void 0, void 0, function () {
                var buffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reportsService.generateVisitorsReportPdf(req.user.schemaName, new Date(startDate), new Date(endDate))];
                        case 1:
                            buffer = _a.sent();
                            res.set({
                                'Content-Type': 'application/pdf',
                                'Content-Disposition': 'attachment; filename="reporte_visitantes.pdf"',
                                'Content-Length': buffer.length,
                            });
                            res.end(buffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ReportsController_1.prototype.getVisitorsReportExcel = function (req, startDate, endDate, res) {
            return __awaiter(this, void 0, void 0, function () {
                var buffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reportsService.generateVisitorsReportExcel(req.user.schemaName, new Date(startDate), new Date(endDate))];
                        case 1:
                            buffer = _a.sent();
                            res.set({
                                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'Content-Disposition': 'attachment; filename="reporte_visitantes.xlsx"',
                                'Content-Length': buffer.length,
                            });
                            res.end(buffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ReportsController_1.prototype.getPackagesReportPdf = function (req, startDate, endDate, res) {
            return __awaiter(this, void 0, void 0, function () {
                var buffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reportsService.generatePackagesReportPdf(req.user.schemaName, new Date(startDate), new Date(endDate))];
                        case 1:
                            buffer = _a.sent();
                            res.set({
                                'Content-Type': 'application/pdf',
                                'Content-Disposition': 'attachment; filename="reporte_paquetes.pdf"',
                                'Content-Length': buffer.length,
                            });
                            res.end(buffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ReportsController_1.prototype.getPackagesReportExcel = function (req, startDate, endDate, res) {
            return __awaiter(this, void 0, void 0, function () {
                var buffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reportsService.generatePackagesReportExcel(req.user.schemaName, new Date(startDate), new Date(endDate))];
                        case 1:
                            buffer = _a.sent();
                            res.set({
                                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'Content-Disposition': 'attachment; filename="reporte_paquetes.xlsx"',
                                'Content-Length': buffer.length,
                            });
                            res.end(buffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ReportsController_1.prototype.getIncidentsReportPdf = function (req, startDate, endDate, res) {
            return __awaiter(this, void 0, void 0, function () {
                var buffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reportsService.generateIncidentsReportPdf(req.user.schemaName, new Date(startDate), new Date(endDate))];
                        case 1:
                            buffer = _a.sent();
                            res.set({
                                'Content-Type': 'application/pdf',
                                'Content-Disposition': 'attachment; filename="reporte_incidentes.pdf"',
                                'Content-Length': buffer.length,
                            });
                            res.end(buffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ReportsController_1.prototype.getIncidentsReportExcel = function (req, startDate, endDate, res) {
            return __awaiter(this, void 0, void 0, function () {
                var buffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reportsService.generateIncidentsReportExcel(req.user.schemaName, new Date(startDate), new Date(endDate))];
                        case 1:
                            buffer = _a.sent();
                            res.set({
                                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                                'Content-Disposition': 'attachment; filename="reporte_incidentes.xlsx"',
                                'Content-Length': buffer.length,
                            });
                            res.end(buffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        ReportsController_1.prototype.getConsolidatedFinancialReportPdf = function (schemaNames, startDate, endDate, res) {
            return __awaiter(this, void 0, void 0, function () {
                var buffer;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.reportsService.generateConsolidatedFinancialReportPdf(schemaNames, new Date(startDate), new Date(endDate))];
                        case 1:
                            buffer = _a.sent();
                            res.set({
                                'Content-Type': 'application/pdf',
                                'Content-Disposition': 'attachment; filename="reporte_financiero_consolidado.pdf"',
                                'Content-Length': buffer.length,
                            });
                            res.end(buffer);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return ReportsController_1;
    }());
    __setFunctionName(_classThis, "ReportsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getVisitorsReportPdf_decorators = [(0, common_1.Get)('visitors/pdf'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTION, user_role_enum_1.UserRole.STAFF)];
        _getVisitorsReportExcel_decorators = [(0, common_1.Get)('visitors/excel'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTION, user_role_enum_1.UserRole.STAFF)];
        _getPackagesReportPdf_decorators = [(0, common_1.Get)('packages/pdf'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTION, user_role_enum_1.UserRole.STAFF)];
        _getPackagesReportExcel_decorators = [(0, common_1.Get)('packages/excel'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTION, user_role_enum_1.UserRole.STAFF)];
        _getIncidentsReportPdf_decorators = [(0, common_1.Get)('incidents/pdf'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTION, user_role_enum_1.UserRole.STAFF)];
        _getIncidentsReportExcel_decorators = [(0, common_1.Get)('incidents/excel'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RECEPTION, user_role_enum_1.UserRole.STAFF)];
        _getConsolidatedFinancialReportPdf_decorators = [(0, common_1.Post)('consolidated-financial/pdf'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.ADMIN)];
        __esDecorate(_classThis, null, _getVisitorsReportPdf_decorators, { kind: "method", name: "getVisitorsReportPdf", static: false, private: false, access: { has: function (obj) { return "getVisitorsReportPdf" in obj; }, get: function (obj) { return obj.getVisitorsReportPdf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVisitorsReportExcel_decorators, { kind: "method", name: "getVisitorsReportExcel", static: false, private: false, access: { has: function (obj) { return "getVisitorsReportExcel" in obj; }, get: function (obj) { return obj.getVisitorsReportExcel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPackagesReportPdf_decorators, { kind: "method", name: "getPackagesReportPdf", static: false, private: false, access: { has: function (obj) { return "getPackagesReportPdf" in obj; }, get: function (obj) { return obj.getPackagesReportPdf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPackagesReportExcel_decorators, { kind: "method", name: "getPackagesReportExcel", static: false, private: false, access: { has: function (obj) { return "getPackagesReportExcel" in obj; }, get: function (obj) { return obj.getPackagesReportExcel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getIncidentsReportPdf_decorators, { kind: "method", name: "getIncidentsReportPdf", static: false, private: false, access: { has: function (obj) { return "getIncidentsReportPdf" in obj; }, get: function (obj) { return obj.getIncidentsReportPdf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getIncidentsReportExcel_decorators, { kind: "method", name: "getIncidentsReportExcel", static: false, private: false, access: { has: function (obj) { return "getIncidentsReportExcel" in obj; }, get: function (obj) { return obj.getIncidentsReportExcel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getConsolidatedFinancialReportPdf_decorators, { kind: "method", name: "getConsolidatedFinancialReportPdf", static: false, private: false, access: { has: function (obj) { return "getConsolidatedFinancialReportPdf" in obj; }, get: function (obj) { return obj.getConsolidatedFinancialReportPdf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportsController = _classThis;
}();
exports.ReportsController = ReportsController;
