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
exports.StaffController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var roles_guard_1 = require("../auth/roles.guard");
var roles_decorator_1 = require("../auth/roles.decorator");
var user_role_enum_1 = require("../common/enums/user-role.enum");
var StaffController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, (0, roles_guard_1.RolesGuard)([user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN])), (0, common_1.Controller)('staff')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createStaffUser_decorators;
    var _findAllStaffUsers_decorators;
    var _findOneStaffUser_decorators;
    var _updateStaffUser_decorators;
    var _deleteStaffUser_decorators;
    var StaffController = _classThis = /** @class */ (function () {
        function StaffController_1(userService) {
            this.userService = (__runInitializers(this, _instanceExtraInitializers), userService);
        }
        StaffController_1.prototype.createStaffUser = function (user, createUserDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Ensure the role is STAFF when creating via this endpoint
                    if (createUserDto.role && createUserDto.role !== user_role_enum_1.UserRole.STAFF) {
                        throw new Error('Only STAFF role can be created via this endpoint.');
                    }
                    return [2 /*return*/, this.userService.createUser(user.schemaName, __assign(__assign({}, createUserDto), { role: user_role_enum_1.UserRole.STAFF }))];
                });
            });
        };
        StaffController_1.prototype.findAllStaffUsers = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.userService.findAllUsers(user.schemaName, user_role_enum_1.UserRole.STAFF)];
                });
            });
        };
        StaffController_1.prototype.findOneStaffUser = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                var staffUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.userService.findById(user.schemaName, +id)];
                        case 1:
                            staffUser = _a.sent();
                            if (staffUser && staffUser.role !== user_role_enum_1.UserRole.STAFF) {
                                throw new Error('User is not a STAFF member.');
                            }
                            return [2 /*return*/, staffUser];
                    }
                });
            });
        };
        StaffController_1.prototype.updateStaffUser = function (user, id, updateUserDto) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.userService.findById(+id)];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser && existingUser.role !== user_role_enum_1.UserRole.STAFF) {
                                throw new Error('User is not a STAFF member.');
                            }
                            // Prevent changing role via this endpoint
                            if (updateUserDto.role && updateUserDto.role !== user_role_enum_1.UserRole.STAFF) {
                                throw new Error('Role cannot be changed via this endpoint.');
                            }
                            return [2 /*return*/, this.userService.updateUser(user.schemaName, +id, __assign(__assign({}, updateUserDto), { role: user_role_enum_1.UserRole.STAFF }))];
                    }
                });
            });
        };
        StaffController_1.prototype.deleteStaffUser = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                var existingUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.userService.findById(+id)];
                        case 1:
                            existingUser = _a.sent();
                            if (existingUser && existingUser.role !== user_role_enum_1.UserRole.STAFF) {
                                throw new Error('User is not a STAFF member.');
                            }
                            return [2 /*return*/, this.userService.deleteUser(user.schemaName, +id)];
                    }
                });
            });
        };
        return StaffController_1;
    }());
    __setFunctionName(_classThis, "StaffController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createStaffUser_decorators = [(0, common_1.Post)(), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _findAllStaffUsers_decorators = [(0, common_1.Get)(), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _findOneStaffUser_decorators = [(0, common_1.Get)(':id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _updateStaffUser_decorators = [(0, common_1.Put)(':id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        _deleteStaffUser_decorators = [(0, common_1.Delete)(':id'), (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.COMPLEX_ADMIN, user_role_enum_1.UserRole.ADMIN)];
        __esDecorate(_classThis, null, _createStaffUser_decorators, { kind: "method", name: "createStaffUser", static: false, private: false, access: { has: function (obj) { return "createStaffUser" in obj; }, get: function (obj) { return obj.createStaffUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findAllStaffUsers_decorators, { kind: "method", name: "findAllStaffUsers", static: false, private: false, access: { has: function (obj) { return "findAllStaffUsers" in obj; }, get: function (obj) { return obj.findAllStaffUsers; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _findOneStaffUser_decorators, { kind: "method", name: "findOneStaffUser", static: false, private: false, access: { has: function (obj) { return "findOneStaffUser" in obj; }, get: function (obj) { return obj.findOneStaffUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateStaffUser_decorators, { kind: "method", name: "updateStaffUser", static: false, private: false, access: { has: function (obj) { return "updateStaffUser" in obj; }, get: function (obj) { return obj.updateStaffUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteStaffUser_decorators, { kind: "method", name: "deleteStaffUser", static: false, private: false, access: { has: function (obj) { return "deleteStaffUser" in obj; }, get: function (obj) { return obj.deleteStaffUser; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        StaffController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return StaffController = _classThis;
}();
exports.StaffController = StaffController;
