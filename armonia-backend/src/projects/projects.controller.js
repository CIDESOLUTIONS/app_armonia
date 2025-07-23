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
exports.ProjectsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../auth/roles.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var user_role_enum_1 = require("../common/enums/user-role.enum");
var ProjectsController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, (0, roles_guard_1.RolesGuard)([user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN])), (0, common_1.Controller)('projects')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createProject_decorators;
    var _getProjects_decorators;
    var _getProjectById_decorators;
    var _updateProject_decorators;
    var _deleteProject_decorators;
    var _createTask_decorators;
    var _updateTask_decorators;
    var _deleteTask_decorators;
    var _addProjectUpdate_decorators;
    var _getProjectUpdates_decorators;
    var ProjectsController = _classThis = /** @class */ (function () {
        function ProjectsController_1(projectsService) {
            this.projectsService = (__runInitializers(this, _instanceExtraInitializers), projectsService);
        }
        ProjectsController_1.prototype.createProject = function (user, createProjectDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.createProject(user.schemaName, createProjectDto)];
                });
            });
        };
        ProjectsController_1.prototype.getProjects = function (user, filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.getProjects(user.schemaName, filters)];
                });
            });
        };
        ProjectsController_1.prototype.getProjectById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.getProjectById(user.schemaName, +id)];
                });
            });
        };
        ProjectsController_1.prototype.updateProject = function (user, id, updateProjectDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.updateProject(user.schemaName, +id, updateProjectDto)];
                });
            });
        };
        ProjectsController_1.prototype.deleteProject = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.deleteProject(user.schemaName, +id)];
                });
            });
        };
        ProjectsController_1.prototype.createTask = function (user, createTaskDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.createTask(user.schemaName, createTaskDto)];
                });
            });
        };
        ProjectsController_1.prototype.updateTask = function (user, id, updateTaskDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.updateTask(user.schemaName, +id, updateTaskDto)];
                });
            });
        };
        ProjectsController_1.prototype.deleteTask = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.deleteTask(user.schemaName, +id)];
                });
            });
        };
        ProjectsController_1.prototype.addProjectUpdate = function (user, createProjectUpdateDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.addProjectUpdate(user.schemaName, createProjectUpdateDto)];
                });
            });
        };
        ProjectsController_1.prototype.getProjectUpdates = function (user, projectId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.projectsService.getProjectUpdates(user.schemaName, +projectId)];
                });
            });
        };
        return ProjectsController_1;
    }());
    __setFunctionName(_classThis, "ProjectsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createProject_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _getProjects_decorators = [(0, common_1.Get)(), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RESIDENT)];
        _getProjectById_decorators = [(0, common_1.Get)(':id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RESIDENT)];
        _updateProject_decorators = [(0, common_1.Put)(':id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _deleteProject_decorators = [(0, common_1.Delete)(':id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _createTask_decorators = [(0, common_1.Post)('tasks'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _updateTask_decorators = [(0, common_1.Put)('tasks/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _deleteTask_decorators = [(0, common_1.Delete)('tasks/:id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _addProjectUpdate_decorators = [(0, common_1.Post)('updates'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _getProjectUpdates_decorators = [(0, common_1.Get)(':projectId/updates'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN, user_role_enum_1.UserRole.RESIDENT)];
        __esDecorate(_classThis, null, _createProject_decorators, { kind: "method", name: "createProject", static: false, private: false, access: { has: function (obj) { return "createProject" in obj; }, get: function (obj) { return obj.createProject; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProjects_decorators, { kind: "method", name: "getProjects", static: false, private: false, access: { has: function (obj) { return "getProjects" in obj; }, get: function (obj) { return obj.getProjects; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProjectById_decorators, { kind: "method", name: "getProjectById", static: false, private: false, access: { has: function (obj) { return "getProjectById" in obj; }, get: function (obj) { return obj.getProjectById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProject_decorators, { kind: "method", name: "updateProject", static: false, private: false, access: { has: function (obj) { return "updateProject" in obj; }, get: function (obj) { return obj.updateProject; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteProject_decorators, { kind: "method", name: "deleteProject", static: false, private: false, access: { has: function (obj) { return "deleteProject" in obj; }, get: function (obj) { return obj.deleteProject; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createTask_decorators, { kind: "method", name: "createTask", static: false, private: false, access: { has: function (obj) { return "createTask" in obj; }, get: function (obj) { return obj.createTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateTask_decorators, { kind: "method", name: "updateTask", static: false, private: false, access: { has: function (obj) { return "updateTask" in obj; }, get: function (obj) { return obj.updateTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteTask_decorators, { kind: "method", name: "deleteTask", static: false, private: false, access: { has: function (obj) { return "deleteTask" in obj; }, get: function (obj) { return obj.deleteTask; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addProjectUpdate_decorators, { kind: "method", name: "addProjectUpdate", static: false, private: false, access: { has: function (obj) { return "addProjectUpdate" in obj; }, get: function (obj) { return obj.addProjectUpdate; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProjectUpdates_decorators, { kind: "method", name: "getProjectUpdates", static: false, private: false, access: { has: function (obj) { return "getProjectUpdates" in obj; }, get: function (obj) { return obj.getProjectUpdates; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProjectsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProjectsController = _classThis;
}();
exports.ProjectsController = ProjectsController;
