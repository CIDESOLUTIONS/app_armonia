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
exports.IncidentsController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var IncidentsController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('incidents')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createIncident_decorators;
    var _getIncidents_decorators;
    var _getIncidentById_decorators;
    var _updateIncident_decorators;
    var _deleteIncident_decorators;
    var _addIncidentUpdate_decorators;
    var _uploadAttachment_decorators;
    var IncidentsController = _classThis = /** @class */ (function () {
        function IncidentsController_1(incidentsService) {
            this.incidentsService = (__runInitializers(this, _instanceExtraInitializers), incidentsService);
        }
        IncidentsController_1.prototype.createIncident = function (user, createIncidentDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.incidentsService.createIncident(user.schemaName, createIncidentDto)];
                });
            });
        };
        IncidentsController_1.prototype.getIncidents = function (user, filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.incidentsService.getIncidents(user.schemaName, filters)];
                });
            });
        };
        IncidentsController_1.prototype.getIncidentById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.incidentsService.getIncidentById(user.schemaName, +id)];
                });
            });
        };
        IncidentsController_1.prototype.updateIncident = function (user, id, updateIncidentDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.incidentsService.updateIncident(user.schemaName, +id, updateIncidentDto)];
                });
            });
        };
        IncidentsController_1.prototype.deleteIncident = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.incidentsService.deleteIncident(user.schemaName, +id)];
                });
            });
        };
        IncidentsController_1.prototype.addIncidentUpdate = function (user, id, content, status, attachments) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.incidentsService.addIncidentUpdate(user.schemaName, +id, content, status, attachments)];
                });
            });
        };
        IncidentsController_1.prototype.uploadAttachment = function (files) {
            return __awaiter(this, void 0, void 0, function () {
                var urls;
                return __generator(this, function (_a) {
                    urls = files.map(function (file) { return "http://localhost:3000/uploads/".concat(file.originalname); });
                    return [2 /*return*/, { urls: urls }];
                });
            });
        };
        return IncidentsController_1;
    }());
    __setFunctionName(_classThis, "IncidentsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createIncident_decorators = [(0, common_1.Post)()];
        _getIncidents_decorators = [(0, common_1.Get)()];
        _getIncidentById_decorators = [(0, common_1.Get)(':id')];
        _updateIncident_decorators = [(0, common_1.Put)(':id')];
        _deleteIncident_decorators = [(0, common_1.Delete)(':id')];
        _addIncidentUpdate_decorators = [(0, common_1.Post)(':id/update')];
        _uploadAttachment_decorators = [(0, common_1.Post)('upload-attachment'), (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files'))];
        __esDecorate(_classThis, null, _createIncident_decorators, { kind: "method", name: "createIncident", static: false, private: false, access: { has: function (obj) { return "createIncident" in obj; }, get: function (obj) { return obj.createIncident; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getIncidents_decorators, { kind: "method", name: "getIncidents", static: false, private: false, access: { has: function (obj) { return "getIncidents" in obj; }, get: function (obj) { return obj.getIncidents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getIncidentById_decorators, { kind: "method", name: "getIncidentById", static: false, private: false, access: { has: function (obj) { return "getIncidentById" in obj; }, get: function (obj) { return obj.getIncidentById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateIncident_decorators, { kind: "method", name: "updateIncident", static: false, private: false, access: { has: function (obj) { return "updateIncident" in obj; }, get: function (obj) { return obj.updateIncident; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteIncident_decorators, { kind: "method", name: "deleteIncident", static: false, private: false, access: { has: function (obj) { return "deleteIncident" in obj; }, get: function (obj) { return obj.deleteIncident; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addIncidentUpdate_decorators, { kind: "method", name: "addIncidentUpdate", static: false, private: false, access: { has: function (obj) { return "addIncidentUpdate" in obj; }, get: function (obj) { return obj.addIncidentUpdate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uploadAttachment_decorators, { kind: "method", name: "uploadAttachment", static: false, private: false, access: { has: function (obj) { return "uploadAttachment" in obj; }, get: function (obj) { return obj.uploadAttachment; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        IncidentsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return IncidentsController = _classThis;
}();
exports.IncidentsController = IncidentsController;
