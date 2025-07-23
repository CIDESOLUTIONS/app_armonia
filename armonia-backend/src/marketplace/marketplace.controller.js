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
exports.MarketplaceController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
var MarketplaceController = function () {
    var _classDecorators = [(0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('marketplace')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _uploadImage_decorators;
    var _createMessage_decorators;
    var _getMessages_decorators;
    var _createListing_decorators;
    var _getListings_decorators;
    var _getListingById_decorators;
    var _updateListing_decorators;
    var _deleteListing_decorators;
    var _reportListing_decorators;
    var _getReportedListings_decorators;
    var _resolveReport_decorators;
    var _getCategories_decorators;
    var MarketplaceController = _classThis = /** @class */ (function () {
        function MarketplaceController_1(marketplaceService) {
            this.marketplaceService = (__runInitializers(this, _instanceExtraInitializers), marketplaceService);
        }
        MarketplaceController_1.prototype.uploadImage = function (file) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.uploadImage(file)];
                });
            });
        };
        MarketplaceController_1.prototype.createMessage = function (user, createMessageDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.createMessage(user.schemaName, __assign(__assign({}, createMessageDto), { senderId: user.userId }))];
                });
            });
        };
        MarketplaceController_1.prototype.getMessages = function (user, listingId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.getMessages(user.schemaName, +listingId, user.userId)];
                });
            });
        };
        MarketplaceController_1.prototype.createListing = function (user, createListingDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.createListing(user.schemaName, user.userId, createListingDto)];
                });
            });
        };
        MarketplaceController_1.prototype.getListings = function (user, filters) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.getListings(user.schemaName, filters)];
                });
            });
        };
        MarketplaceController_1.prototype.getListingById = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.getListingById(user.schemaName, +id)];
                });
            });
        };
        MarketplaceController_1.prototype.updateListing = function (user, id, updateListingDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.updateListing(user.schemaName, +id, user.userId, updateListingDto)];
                });
            });
        };
        MarketplaceController_1.prototype.deleteListing = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.deleteListing(user.schemaName, +id, user.userId)];
                });
            });
        };
        MarketplaceController_1.prototype.reportListing = function (user, reportListingDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.reportListing(user.schemaName, reportListingDto.listingId, user.userId, reportListingDto.reason)];
                });
            });
        };
        MarketplaceController_1.prototype.getReportedListings = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Solo administradores de conjunto pueden acceder a esto
                    return [2 /*return*/, this.marketplaceService.getReportedListings(user.schemaName)];
                });
            });
        };
        MarketplaceController_1.prototype.resolveReport = function (user, id, resolveReportDto) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Solo administradores de conjunto pueden acceder a esto
                    return [2 /*return*/, this.marketplaceService.resolveReport(user.schemaName, +id, resolveReportDto.action)];
                });
            });
        };
        MarketplaceController_1.prototype.getCategories = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.getListingCategories()];
                });
            });
        };
        return MarketplaceController_1;
    }());
    __setFunctionName(_classThis, "MarketplaceController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _uploadImage_decorators = [(0, common_1.Post)('upload-image'), (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file'))];
        _createMessage_decorators = [(0, common_1.Post)('messages')];
        _getMessages_decorators = [(0, common_1.Get)('messages/:listingId')];
        _createListing_decorators = [(0, common_1.Post)('listings')];
        _getListings_decorators = [(0, common_1.Get)('listings')];
        _getListingById_decorators = [(0, common_1.Get)('listings/:id')];
        _updateListing_decorators = [(0, common_1.Put)('listings/:id')];
        _deleteListing_decorators = [(0, common_1.Delete)('listings/:id')];
        _reportListing_decorators = [(0, common_1.Post)('listings/report')];
        _getReportedListings_decorators = [(0, common_1.Get)('moderation/reports')];
        _resolveReport_decorators = [(0, common_1.Post)('moderation/reports/:id/resolve')];
        _getCategories_decorators = [(0, common_1.Get)('categories')];
        __esDecorate(_classThis, null, _uploadImage_decorators, { kind: "method", name: "uploadImage", static: false, private: false, access: { has: function (obj) { return "uploadImage" in obj; }, get: function (obj) { return obj.uploadImage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createMessage_decorators, { kind: "method", name: "createMessage", static: false, private: false, access: { has: function (obj) { return "createMessage" in obj; }, get: function (obj) { return obj.createMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMessages_decorators, { kind: "method", name: "getMessages", static: false, private: false, access: { has: function (obj) { return "getMessages" in obj; }, get: function (obj) { return obj.getMessages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createListing_decorators, { kind: "method", name: "createListing", static: false, private: false, access: { has: function (obj) { return "createListing" in obj; }, get: function (obj) { return obj.createListing; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getListings_decorators, { kind: "method", name: "getListings", static: false, private: false, access: { has: function (obj) { return "getListings" in obj; }, get: function (obj) { return obj.getListings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getListingById_decorators, { kind: "method", name: "getListingById", static: false, private: false, access: { has: function (obj) { return "getListingById" in obj; }, get: function (obj) { return obj.getListingById; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateListing_decorators, { kind: "method", name: "updateListing", static: false, private: false, access: { has: function (obj) { return "updateListing" in obj; }, get: function (obj) { return obj.updateListing; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteListing_decorators, { kind: "method", name: "deleteListing", static: false, private: false, access: { has: function (obj) { return "deleteListing" in obj; }, get: function (obj) { return obj.deleteListing; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _reportListing_decorators, { kind: "method", name: "reportListing", static: false, private: false, access: { has: function (obj) { return "reportListing" in obj; }, get: function (obj) { return obj.reportListing; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getReportedListings_decorators, { kind: "method", name: "getReportedListings", static: false, private: false, access: { has: function (obj) { return "getReportedListings" in obj; }, get: function (obj) { return obj.getReportedListings; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _resolveReport_decorators, { kind: "method", name: "resolveReport", static: false, private: false, access: { has: function (obj) { return "resolveReport" in obj; }, get: function (obj) { return obj.resolveReport; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getCategories_decorators, { kind: "method", name: "getCategories", static: false, private: false, access: { has: function (obj) { return "getCategories" in obj; }, get: function (obj) { return obj.getCategories; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MarketplaceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MarketplaceController = _classThis;
}();
exports.MarketplaceController = MarketplaceController;
