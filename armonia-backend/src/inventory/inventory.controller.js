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
exports.InventoryController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var InventoryController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('inventory')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createCommonArea_decorators;
    var _getCommonAreas_decorators;
    var _getCommonAreaById_decorators;
    var _updateCommonArea_decorators;
    var _deleteCommonArea_decorators;
    var _createParkingSpot_decorators;
    var _getParkingSpots_decorators;
    var _getParkingSpotById_decorators;
    var _updateParkingSpot_decorators;
    var _deleteParkingSpot_decorators;
    var _getProperties_decorators;
    var _createProperty_decorators;
    var _updateProperty_decorators;
    var _getPets_decorators;
    var _createPet_decorators;
    var _getVehicles_decorators;
    var _createVehicle_decorators;
    var _getResidents_decorators;
    var _updateResident_decorators;
    var _createResident_decorators;
    var _deleteResident_decorators;
    var _getServices_decorators;
    var _getInventoryStats_decorators;
    var InventoryController = _classThis = /** @class */ (function () {
        function InventoryController_1(inventoryService) {
            this.inventoryService = (__runInitializers(this, _instanceExtraInitializers), inventoryService);
        }
        // Common Area Endpoints
        InventoryController_1.prototype.createCommonArea = function (user, createCommonAreaDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.createCommonArea(user.schemaName, __assign(__assign({}, createCommonAreaDto), { complexId: user.complexId }))];
                });
            });
        };
        InventoryController_1.prototype.getCommonAreas = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.getCommonAreas(user.schemaName)];
                });
            });
        };
        InventoryController_1.prototype.getCommonAreaById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.getCommonAreaById(user.schemaName, +id)];
                });
            });
        };
        InventoryController_1.prototype.updateCommonArea = function (user, id, updateCommonAreaDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.updateCommonArea(user.schemaName, +id, updateCommonAreaDto)];
                });
            });
        };
        InventoryController_1.prototype.deleteCommonArea = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.deleteCommonArea(user.schemaName, +id)];
                });
            });
        };
        // Parking Spot Endpoints
        InventoryController_1.prototype.createParkingSpot = function (user, createParkingSpotDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.createParkingSpot(user.schemaName, __assign(__assign({}, createParkingSpotDto), { complexId: user.complexId }))];
                });
            });
        };
        InventoryController_1.prototype.getParkingSpots = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.getParkingSpots(user.schemaName, user.complexId)];
                });
            });
        };
        InventoryController_1.prototype.getParkingSpotById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.getParkingSpotById(user.schemaName, +id)];
                });
            });
        };
        InventoryController_1.prototype.updateParkingSpot = function (user, id, updateParkingSpotDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.updateParkingSpot(user.schemaName, +id, updateParkingSpotDto)];
                });
            });
        };
        InventoryController_1.prototype.deleteParkingSpot = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.deleteParkingSpot(user.schemaName, +id)];
                });
            });
        };
        // PROPIEDADES
        InventoryController_1.prototype.getProperties = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.getProperties(user.schemaName, user.complexId)];
                });
            });
        };
        InventoryController_1.prototype.createProperty = function (user, createPropertyDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.createProperty(user.schemaName, __assign(__assign({}, createPropertyDto), { complexId: user.complexId }))];
                });
            });
        };
        InventoryController_1.prototype.updateProperty = function (user, id, updatePropertyDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.updateProperty(user.schemaName, +id, updatePropertyDto)];
                });
            });
        };
        InventoryController_1.prototype.getPets = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.getPets(user.schemaName, user.complexId)];
                });
            });
        };
        InventoryController_1.prototype.createPet = function (user, createPetDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.createPet(user.schemaName, __assign(__assign({}, createPetDto), { complexId: user.complexId }))];
                });
            });
        };
        InventoryController_1.prototype.getVehicles = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.getVehicles(user.schemaName, user.complexId)];
                });
            });
        };
        InventoryController_1.prototype.createVehicle = function (user, createVehicleDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.createVehicle(user.schemaName, createVehicleDto)];
                });
            });
        };
        InventoryController_1.prototype.getResidents = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.getResidents(user.schemaName, user.complexId)];
                });
            });
        };
        InventoryController_1.prototype.updateResident = function (user, id, updateResidentDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.updateResident(user.schemaName, +id, updateResidentDto)];
                });
            });
        };
        InventoryController_1.prototype.createResident = function (user, createResidentDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.createResident(user.schemaName, createResidentDto)];
                });
            });
        };
        InventoryController_1.prototype.deleteResident = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.deleteResident(user.schemaName, +id)];
                });
            });
        };
        InventoryController_1.prototype.getServices = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.getServices(user.schemaName, user.complexId)];
                });
            });
        };
        InventoryController_1.prototype.getInventoryStats = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.inventoryService.getInventoryStats(user.schemaName, user.complexId)];
                });
            });
        };
        return InventoryController_1;
    }());
    __setFunctionName(_classThis, "InventoryController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createCommonArea_decorators = [(0, common_1.Post)('common-areas')];
        _getCommonAreas_decorators = [(0, common_1.Get)('common-areas')];
        _getCommonAreaById_decorators = [(0, common_1.Get)('common-areas/:id')];
        _updateCommonArea_decorators = [(0, common_1.Put)('common-areas/:id')];
        _deleteCommonArea_decorators = [(0, common_1.Delete)('common-areas/:id')];
        _createParkingSpot_decorators = [(0, common_1.Post)('parking-spots')];
        _getParkingSpots_decorators = [(0, common_1.Get)('parking-spots')];
        _getParkingSpotById_decorators = [(0, common_1.Get)('parking-spots/:id')];
        _updateParkingSpot_decorators = [(0, common_1.Put)('parking-spots/:id')];
        _deleteParkingSpot_decorators = [(0, common_1.Delete)('parking-spots/:id')];
        _getProperties_decorators = [(0, common_1.Get)('properties')];
        _createProperty_decorators = [(0, common_1.Post)('properties')];
        _updateProperty_decorators = [(0, common_1.Put)('properties/:id')];
        _getPets_decorators = [(0, common_1.Get)('pets')];
        _createPet_decorators = [(0, common_1.Post)('pets')];
        _getVehicles_decorators = [(0, common_1.Get)('vehicles')];
        _createVehicle_decorators = [(0, common_1.Post)('vehicles')];
        _getResidents_decorators = [(0, common_1.Get)('residents')];
        _updateResident_decorators = [(0, common_1.Put)('residents/:id')];
        _createResident_decorators = [(0, common_1.Post)('residents')];
        _deleteResident_decorators = [(0, common_1.Delete)('residents/:id')];
        _getServices_decorators = [(0, common_1.Get)('services')];
        _getInventoryStats_decorators = [(0, common_1.Get)('stats')];
        __esDecorate(_classThis, null, _createCommonArea_decorators, { kind: "method", name: "createCommonArea", static: false, private: false, access: { has: function (obj) { return "createCommonArea" in obj; }, get: function (obj) { return obj.createCommonArea; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCommonAreas_decorators, { kind: "method", name: "getCommonAreas", static: false, private: false, access: { has: function (obj) { return "getCommonAreas" in obj; }, get: function (obj) { return obj.getCommonAreas; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCommonAreaById_decorators, { kind: "method", name: "getCommonAreaById", static: false, private: false, access: { has: function (obj) { return "getCommonAreaById" in obj; }, get: function (obj) { return obj.getCommonAreaById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateCommonArea_decorators, { kind: "method", name: "updateCommonArea", static: false, private: false, access: { has: function (obj) { return "updateCommonArea" in obj; }, get: function (obj) { return obj.updateCommonArea; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteCommonArea_decorators, { kind: "method", name: "deleteCommonArea", static: false, private: false, access: { has: function (obj) { return "deleteCommonArea" in obj; }, get: function (obj) { return obj.deleteCommonArea; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createParkingSpot_decorators, { kind: "method", name: "createParkingSpot", static: false, private: false, access: { has: function (obj) { return "createParkingSpot" in obj; }, get: function (obj) { return obj.createParkingSpot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getParkingSpots_decorators, { kind: "method", name: "getParkingSpots", static: false, private: false, access: { has: function (obj) { return "getParkingSpots" in obj; }, get: function (obj) { return obj.getParkingSpots; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getParkingSpotById_decorators, { kind: "method", name: "getParkingSpotById", static: false, private: false, access: { has: function (obj) { return "getParkingSpotById" in obj; }, get: function (obj) { return obj.getParkingSpotById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateParkingSpot_decorators, { kind: "method", name: "updateParkingSpot", static: false, private: false, access: { has: function (obj) { return "updateParkingSpot" in obj; }, get: function (obj) { return obj.updateParkingSpot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteParkingSpot_decorators, { kind: "method", name: "deleteParkingSpot", static: false, private: false, access: { has: function (obj) { return "deleteParkingSpot" in obj; }, get: function (obj) { return obj.deleteParkingSpot; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProperties_decorators, { kind: "method", name: "getProperties", static: false, private: false, access: { has: function (obj) { return "getProperties" in obj; }, get: function (obj) { return obj.getProperties; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createProperty_decorators, { kind: "method", name: "createProperty", static: false, private: false, access: { has: function (obj) { return "createProperty" in obj; }, get: function (obj) { return obj.createProperty; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateProperty_decorators, { kind: "method", name: "updateProperty", static: false, private: false, access: { has: function (obj) { return "updateProperty" in obj; }, get: function (obj) { return obj.updateProperty; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getPets_decorators, { kind: "method", name: "getPets", static: false, private: false, access: { has: function (obj) { return "getPets" in obj; }, get: function (obj) { return obj.getPets; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createPet_decorators, { kind: "method", name: "createPet", static: false, private: false, access: { has: function (obj) { return "createPet" in obj; }, get: function (obj) { return obj.createPet; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getVehicles_decorators, { kind: "method", name: "getVehicles", static: false, private: false, access: { has: function (obj) { return "getVehicles" in obj; }, get: function (obj) { return obj.getVehicles; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createVehicle_decorators, { kind: "method", name: "createVehicle", static: false, private: false, access: { has: function (obj) { return "createVehicle" in obj; }, get: function (obj) { return obj.createVehicle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getResidents_decorators, { kind: "method", name: "getResidents", static: false, private: false, access: { has: function (obj) { return "getResidents" in obj; }, get: function (obj) { return obj.getResidents; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateResident_decorators, { kind: "method", name: "updateResident", static: false, private: false, access: { has: function (obj) { return "updateResident" in obj; }, get: function (obj) { return obj.updateResident; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createResident_decorators, { kind: "method", name: "createResident", static: false, private: false, access: { has: function (obj) { return "createResident" in obj; }, get: function (obj) { return obj.createResident; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteResident_decorators, { kind: "method", name: "deleteResident", static: false, private: false, access: { has: function (obj) { return "deleteResident" in obj; }, get: function (obj) { return obj.deleteResident; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getServices_decorators, { kind: "method", name: "getServices", static: false, private: false, access: { has: function (obj) { return "getServices" in obj; }, get: function (obj) { return obj.getServices; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInventoryStats_decorators, { kind: "method", name: "getInventoryStats", static: false, private: false, access: { has: function (obj) { return "getInventoryStats" in obj; }, get: function (obj) { return obj.getInventoryStats; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InventoryController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InventoryController = _classThis;
}();
exports.InventoryController = InventoryController;
