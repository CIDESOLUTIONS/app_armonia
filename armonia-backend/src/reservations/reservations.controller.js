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
exports.ReservationsController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var ReservationsController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('reservations')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createReservation_decorators;
    var _getReservations_decorators;
    var _getReservationById_decorators;
    var _updateReservation_decorators;
    var _updateReservationStatus_decorators;
    var _deleteReservation_decorators;
    var _approveReservation_decorators;
    var _rejectReservation_decorators;
    var ReservationsController = _classThis = /** @class */ (function () {
        function ReservationsController_1(reservationsService) {
            this.reservationsService = (__runInitializers(this, _instanceExtraInitializers), reservationsService);
        }
        // Reservation Endpoints
        ReservationsController_1.prototype.createReservation = function (user, createReservationDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reservationsService.createReservation(user.schemaName, createReservationDto)];
                });
            });
        };
        ReservationsController_1.prototype.getReservations = function (user, filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reservationsService.getReservations(user.schemaName, filters)];
                });
            });
        };
        ReservationsController_1.prototype.getReservationById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reservationsService.getReservationById(user.schemaName, +id)];
                });
            });
        };
        ReservationsController_1.prototype.updateReservation = function (user, id, updateReservationDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reservationsService.updateReservation(user.schemaName, +id, updateReservationDto)];
                });
            });
        };
        ReservationsController_1.prototype.updateReservationStatus = function (user, id, status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reservationsService.updateReservationStatus(user.schemaName, +id, status)];
                });
            });
        };
        ReservationsController_1.prototype.deleteReservation = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reservationsService.deleteReservation(user.schemaName, +id)];
                });
            });
        };
        ReservationsController_1.prototype.approveReservation = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reservationsService.approveReservation(user.schemaName, +id, user.userId)];
                });
            });
        };
        ReservationsController_1.prototype.rejectReservation = function (user, id, reason) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.reservationsService.rejectReservation(user.schemaName, +id, user.userId, reason)];
                });
            });
        };
        return ReservationsController_1;
    }());
    __setFunctionName(_classThis, "ReservationsController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createReservation_decorators = [(0, common_1.Post)()];
        _getReservations_decorators = [(0, common_1.Get)()];
        _getReservationById_decorators = [(0, common_1.Get)(':id')];
        _updateReservation_decorators = [(0, common_1.Put)(':id')];
        _updateReservationStatus_decorators = [(0, common_1.Put)(':id/status')];
        _deleteReservation_decorators = [(0, common_1.Delete)(':id')];
        _approveReservation_decorators = [(0, common_1.Post)(':id/approve')];
        _rejectReservation_decorators = [(0, common_1.Post)(':id/reject')];
        __esDecorate(_classThis, null, _createReservation_decorators, { kind: "method", name: "createReservation", static: false, private: false, access: { has: function (obj) { return "createReservation" in obj; }, get: function (obj) { return obj.createReservation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReservations_decorators, { kind: "method", name: "getReservations", static: false, private: false, access: { has: function (obj) { return "getReservations" in obj; }, get: function (obj) { return obj.getReservations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReservationById_decorators, { kind: "method", name: "getReservationById", static: false, private: false, access: { has: function (obj) { return "getReservationById" in obj; }, get: function (obj) { return obj.getReservationById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateReservation_decorators, { kind: "method", name: "updateReservation", static: false, private: false, access: { has: function (obj) { return "updateReservation" in obj; }, get: function (obj) { return obj.updateReservation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateReservationStatus_decorators, { kind: "method", name: "updateReservationStatus", static: false, private: false, access: { has: function (obj) { return "updateReservationStatus" in obj; }, get: function (obj) { return obj.updateReservationStatus; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteReservation_decorators, { kind: "method", name: "deleteReservation", static: false, private: false, access: { has: function (obj) { return "deleteReservation" in obj; }, get: function (obj) { return obj.deleteReservation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _approveReservation_decorators, { kind: "method", name: "approveReservation", static: false, private: false, access: { has: function (obj) { return "approveReservation" in obj; }, get: function (obj) { return obj.approveReservation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _rejectReservation_decorators, { kind: "method", name: "rejectReservation", static: false, private: false, access: { has: function (obj) { return "rejectReservation" in obj; }, get: function (obj) { return obj.rejectReservation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReservationsController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReservationsController = _classThis;
}();
exports.ReservationsController = ReservationsController;
