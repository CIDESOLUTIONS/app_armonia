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
exports.AssemblyController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var AssemblyController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('assemblies')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createAssembly_decorators;
    var _getAssemblies_decorators;
    var _getAssemblyById_decorators;
    var _updateAssembly_decorators;
    var _deleteAssembly_decorators;
    var _registerAttendance_decorators;
    var _getQuorumStatus_decorators;
    var _createVote_decorators;
    var _submitVote_decorators;
    var _getVoteResults_decorators;
    var _generateMeetingMinutes_decorators;
    var AssemblyController = _classThis = /** @class */ (function () {
        function AssemblyController_1(assemblyService) {
            this.assemblyService = (__runInitializers(this, _instanceExtraInitializers), assemblyService);
        }
        AssemblyController_1.prototype.createAssembly = function (user, createAssemblyDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.createAssembly(user.schemaName, createAssemblyDto, user.userId)];
                });
            });
        };
        AssemblyController_1.prototype.getAssemblies = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.getAssemblies(user.schemaName)];
                });
            });
        };
        AssemblyController_1.prototype.getAssemblyById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.getAssemblyById(user.schemaName, +id)];
                });
            });
        };
        AssemblyController_1.prototype.updateAssembly = function (user, id, updateAssemblyDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.updateAssembly(user.schemaName, +id, updateAssemblyDto)];
                });
            });
        };
        AssemblyController_1.prototype.deleteAssembly = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.deleteAssembly(user.schemaName, +id)];
                });
            });
        };
        AssemblyController_1.prototype.registerAttendance = function (user, assemblyId, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.registerAttendance(user.schemaName, +assemblyId, user.userId, body.unitId)];
                });
            });
        };
        AssemblyController_1.prototype.getQuorumStatus = function (user, assemblyId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.getAssemblyQuorumStatus(user.schemaName, +assemblyId)];
                });
            });
        };
        AssemblyController_1.prototype.createVote = function (user, assemblyId, createVoteDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.createVote(user.schemaName, +assemblyId, createVoteDto)];
                });
            });
        };
        AssemblyController_1.prototype.submitVote = function (user, voteId, submitVoteDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.castVote(user.schemaName, +voteId, user.userId, submitVoteDto.unitId, submitVoteDto.option)];
                });
            });
        };
        AssemblyController_1.prototype.getVoteResults = function (user, voteId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.calculateVoteResults(user.schemaName, +voteId)];
                });
            });
        };
        AssemblyController_1.prototype.generateMeetingMinutes = function (user, assemblyId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.assemblyService.generateMeetingMinutes(user.schemaName, +assemblyId)];
                });
            });
        };
        return AssemblyController_1;
    }());
    __setFunctionName(_classThis, "AssemblyController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createAssembly_decorators = [(0, common_1.Post)()];
        _getAssemblies_decorators = [(0, common_1.Get)()];
        _getAssemblyById_decorators = [(0, common_1.Get)(':id')];
        _updateAssembly_decorators = [(0, common_1.Put)(':id')];
        _deleteAssembly_decorators = [(0, common_1.Delete)(':id')];
        _registerAttendance_decorators = [(0, common_1.Post)(':id/attendance')];
        _getQuorumStatus_decorators = [(0, common_1.Get)(':id/quorum-status')];
        _createVote_decorators = [(0, common_1.Post)(':id/votes')];
        _submitVote_decorators = [(0, common_1.Post)(':voteId/submit-vote')];
        _getVoteResults_decorators = [(0, common_1.Get)(':voteId/results')];
        _generateMeetingMinutes_decorators = [(0, common_1.Post)(':id/generate-minutes')];
        __esDecorate(_classThis, null, _createAssembly_decorators, { kind: "method", name: "createAssembly", static: false, private: false, access: { has: function (obj) { return "createAssembly" in obj; }, get: function (obj) { return obj.createAssembly; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAssemblies_decorators, { kind: "method", name: "getAssemblies", static: false, private: false, access: { has: function (obj) { return "getAssemblies" in obj; }, get: function (obj) { return obj.getAssemblies; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAssemblyById_decorators, { kind: "method", name: "getAssemblyById", static: false, private: false, access: { has: function (obj) { return "getAssemblyById" in obj; }, get: function (obj) { return obj.getAssemblyById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateAssembly_decorators, { kind: "method", name: "updateAssembly", static: false, private: false, access: { has: function (obj) { return "updateAssembly" in obj; }, get: function (obj) { return obj.updateAssembly; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteAssembly_decorators, { kind: "method", name: "deleteAssembly", static: false, private: false, access: { has: function (obj) { return "deleteAssembly" in obj; }, get: function (obj) { return obj.deleteAssembly; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerAttendance_decorators, { kind: "method", name: "registerAttendance", static: false, private: false, access: { has: function (obj) { return "registerAttendance" in obj; }, get: function (obj) { return obj.registerAttendance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getQuorumStatus_decorators, { kind: "method", name: "getQuorumStatus", static: false, private: false, access: { has: function (obj) { return "getQuorumStatus" in obj; }, get: function (obj) { return obj.getQuorumStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createVote_decorators, { kind: "method", name: "createVote", static: false, private: false, access: { has: function (obj) { return "createVote" in obj; }, get: function (obj) { return obj.createVote; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitVote_decorators, { kind: "method", name: "submitVote", static: false, private: false, access: { has: function (obj) { return "submitVote" in obj; }, get: function (obj) { return obj.submitVote; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVoteResults_decorators, { kind: "method", name: "getVoteResults", static: false, private: false, access: { has: function (obj) { return "getVoteResults" in obj; }, get: function (obj) { return obj.getVoteResults; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateMeetingMinutes_decorators, { kind: "method", name: "generateMeetingMinutes", static: false, private: false, access: { has: function (obj) { return "generateMeetingMinutes" in obj; }, get: function (obj) { return obj.generateMeetingMinutes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssemblyController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssemblyController = _classThis;
}();
exports.AssemblyController = AssemblyController;
