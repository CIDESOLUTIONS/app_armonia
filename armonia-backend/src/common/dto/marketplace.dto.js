"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
exports.ListingFilterParamsDto = exports.MessageDto = exports.CreateMessageDto = exports.ResolveReportDto = exports.ReportListingDto = exports.ListingDto = exports.UpdateListingDto = exports.CreateListingDto = exports.ListingStatus = exports.ListingCategory = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var ListingCategory;
(function (ListingCategory) {
    ListingCategory["HOME"] = "HOME";
    ListingCategory["TECHNOLOGY"] = "TECHNOLOGY";
    ListingCategory["SERVICES"] = "SERVICES";
    ListingCategory["CLASSES"] = "CLASSES";
    ListingCategory["OTHER"] = "OTHER";
})(ListingCategory || (exports.ListingCategory = ListingCategory = {}));
var ListingStatus;
(function (ListingStatus) {
    ListingStatus["ACTIVE"] = "ACTIVE";
    ListingStatus["SOLD"] = "SOLD";
    ListingStatus["REPORTED"] = "REPORTED";
    ListingStatus["DELETED"] = "DELETED";
})(ListingStatus || (exports.ListingStatus = ListingStatus = {}));
var CreateListingDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _price_decorators;
    var _price_initializers = [];
    var _price_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _images_decorators;
    var _images_initializers = [];
    var _images_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateListingDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.price = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _price_initializers, void 0));
                this.category = (__runInitializers(this, _price_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.images = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _images_initializers, void 0)); // URLs de las imágenes
                __runInitializers(this, _images_extraInitializers);
            }
            return CreateListingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _price_decorators = [(0, class_validator_1.IsNumber)()];
            _category_decorators = [(0, class_validator_1.IsEnum)(ListingCategory)];
            _images_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true }), (0, class_validator_1.ArrayMaxSize)(5)];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _price_decorators, { kind: "field", name: "price", static: false, private: false, access: { has: function (obj) { return "price" in obj; }, get: function (obj) { return obj.price; }, set: function (obj, value) { obj.price = value; } }, metadata: _metadata }, _price_initializers, _price_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _images_decorators, { kind: "field", name: "images", static: false, private: false, access: { has: function (obj) { return "images" in obj; }, get: function (obj) { return obj.images; }, set: function (obj, value) { obj.images = value; } }, metadata: _metadata }, _images_initializers, _images_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateListingDto = CreateListingDto;
var UpdateListingDto = function () {
    var _a;
    var _classSuper = CreateListingDto;
    var _status_decorators;
    var _status_initializers = [];
    var _status_extraInitializers = [];
    return _a = /** @class */ (function (_super) {
            __extends(UpdateListingDto, _super);
            function UpdateListingDto() {
                var _this = _super !== null && _super.apply(this, arguments) || this;
                _this.status = __runInitializers(_this, _status_initializers, void 0);
                __runInitializers(_this, _status_extraInitializers);
                return _this;
            }
            return UpdateListingDto;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _status_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ListingStatus)];
            __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: function (obj) { return "status" in obj; }, get: function (obj) { return obj.status; }, set: function (obj, value) { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateListingDto = UpdateListingDto;
var ListingDto = /** @class */ (function () {
    function ListingDto() {
    }
    return ListingDto;
}());
exports.ListingDto = ListingDto;
var ReportListingDto = function () {
    var _a;
    var _listingId_decorators;
    var _listingId_initializers = [];
    var _listingId_extraInitializers = [];
    var _reason_decorators;
    var _reason_initializers = [];
    var _reason_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ReportListingDto() {
                this.listingId = __runInitializers(this, _listingId_initializers, void 0);
                this.reason = (__runInitializers(this, _listingId_extraInitializers), __runInitializers(this, _reason_initializers, void 0));
                __runInitializers(this, _reason_extraInitializers);
            }
            return ReportListingDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _listingId_decorators = [(0, class_validator_1.IsNumber)()];
            _reason_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _listingId_decorators, { kind: "field", name: "listingId", static: false, private: false, access: { has: function (obj) { return "listingId" in obj; }, get: function (obj) { return obj.listingId; }, set: function (obj, value) { obj.listingId = value; } }, metadata: _metadata }, _listingId_initializers, _listingId_extraInitializers);
            __esDecorate(null, null, _reason_decorators, { kind: "field", name: "reason", static: false, private: false, access: { has: function (obj) { return "reason" in obj; }, get: function (obj) { return obj.reason; }, set: function (obj, value) { obj.reason = value; } }, metadata: _metadata }, _reason_initializers, _reason_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ReportListingDto = ReportListingDto;
var ResolveReportDto = function () {
    var _a;
    var _reportId_decorators;
    var _reportId_initializers = [];
    var _reportId_extraInitializers = [];
    var _action_decorators;
    var _action_initializers = [];
    var _action_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ResolveReportDto() {
                this.reportId = __runInitializers(this, _reportId_initializers, void 0);
                this.action = (__runInitializers(this, _reportId_extraInitializers), __runInitializers(this, _action_initializers, void 0));
                __runInitializers(this, _action_extraInitializers);
            }
            return ResolveReportDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _reportId_decorators = [(0, class_validator_1.IsNumber)()];
            _action_decorators = [(0, class_validator_1.IsEnum)(['APPROVE', 'REJECT'])];
            __esDecorate(null, null, _reportId_decorators, { kind: "field", name: "reportId", static: false, private: false, access: { has: function (obj) { return "reportId" in obj; }, get: function (obj) { return obj.reportId; }, set: function (obj, value) { obj.reportId = value; } }, metadata: _metadata }, _reportId_initializers, _reportId_extraInitializers);
            __esDecorate(null, null, _action_decorators, { kind: "field", name: "action", static: false, private: false, access: { has: function (obj) { return "action" in obj; }, get: function (obj) { return obj.action; }, set: function (obj, value) { obj.action = value; } }, metadata: _metadata }, _action_initializers, _action_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ResolveReportDto = ResolveReportDto;
var CreateMessageDto = function () {
    var _a;
    var _listingId_decorators;
    var _listingId_initializers = [];
    var _listingId_extraInitializers = [];
    var _senderId_decorators;
    var _senderId_initializers = [];
    var _senderId_extraInitializers = [];
    var _receiverId_decorators;
    var _receiverId_initializers = [];
    var _receiverId_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateMessageDto() {
                this.listingId = __runInitializers(this, _listingId_initializers, void 0);
                this.senderId = (__runInitializers(this, _listingId_extraInitializers), __runInitializers(this, _senderId_initializers, void 0));
                this.receiverId = (__runInitializers(this, _senderId_extraInitializers), __runInitializers(this, _receiverId_initializers, void 0));
                this.content = (__runInitializers(this, _receiverId_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                __runInitializers(this, _content_extraInitializers);
            }
            return CreateMessageDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _listingId_decorators = [(0, class_validator_1.IsNumber)()];
            _senderId_decorators = [(0, class_validator_1.IsNumber)()];
            _receiverId_decorators = [(0, class_validator_1.IsNumber)()];
            _content_decorators = [(0, class_validator_1.IsString)()];
            __esDecorate(null, null, _listingId_decorators, { kind: "field", name: "listingId", static: false, private: false, access: { has: function (obj) { return "listingId" in obj; }, get: function (obj) { return obj.listingId; }, set: function (obj, value) { obj.listingId = value; } }, metadata: _metadata }, _listingId_initializers, _listingId_extraInitializers);
            __esDecorate(null, null, _senderId_decorators, { kind: "field", name: "senderId", static: false, private: false, access: { has: function (obj) { return "senderId" in obj; }, get: function (obj) { return obj.senderId; }, set: function (obj, value) { obj.senderId = value; } }, metadata: _metadata }, _senderId_initializers, _senderId_extraInitializers);
            __esDecorate(null, null, _receiverId_decorators, { kind: "field", name: "receiverId", static: false, private: false, access: { has: function (obj) { return "receiverId" in obj; }, get: function (obj) { return obj.receiverId; }, set: function (obj, value) { obj.receiverId = value; } }, metadata: _metadata }, _receiverId_initializers, _receiverId_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateMessageDto = CreateMessageDto;
var MessageDto = /** @class */ (function () {
    function MessageDto() {
    }
    return MessageDto;
}());
exports.MessageDto = MessageDto;
var ListingFilterParamsDto = function () {
    var _a;
    var _search_decorators;
    var _search_initializers = [];
    var _search_extraInitializers = [];
    var _category_decorators;
    var _category_initializers = [];
    var _category_extraInitializers = [];
    var _minPrice_decorators;
    var _minPrice_initializers = [];
    var _minPrice_extraInitializers = [];
    var _maxPrice_decorators;
    var _maxPrice_initializers = [];
    var _maxPrice_extraInitializers = [];
    var _page_decorators;
    var _page_initializers = [];
    var _page_extraInitializers = [];
    var _limit_decorators;
    var _limit_initializers = [];
    var _limit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ListingFilterParamsDto() {
                this.search = __runInitializers(this, _search_initializers, void 0);
                this.category = (__runInitializers(this, _search_extraInitializers), __runInitializers(this, _category_initializers, void 0));
                this.minPrice = (__runInitializers(this, _category_extraInitializers), __runInitializers(this, _minPrice_initializers, void 0));
                this.maxPrice = (__runInitializers(this, _minPrice_extraInitializers), __runInitializers(this, _maxPrice_initializers, void 0));
                this.page = (__runInitializers(this, _maxPrice_extraInitializers), __runInitializers(this, _page_initializers, void 0));
                this.limit = (__runInitializers(this, _page_extraInitializers), __runInitializers(this, _limit_initializers, void 0));
                __runInitializers(this, _limit_extraInitializers);
            }
            return ListingFilterParamsDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _search_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _category_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(ListingCategory)];
            _minPrice_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)()];
            _maxPrice_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)()];
            _page_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)()];
            _limit_decorators = [(0, class_validator_1.IsOptional)(), (0, class_transformer_1.Type)(function () { return Number; }), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _search_decorators, { kind: "field", name: "search", static: false, private: false, access: { has: function (obj) { return "search" in obj; }, get: function (obj) { return obj.search; }, set: function (obj, value) { obj.search = value; } }, metadata: _metadata }, _search_initializers, _search_extraInitializers);
            __esDecorate(null, null, _category_decorators, { kind: "field", name: "category", static: false, private: false, access: { has: function (obj) { return "category" in obj; }, get: function (obj) { return obj.category; }, set: function (obj, value) { obj.category = value; } }, metadata: _metadata }, _category_initializers, _category_extraInitializers);
            __esDecorate(null, null, _minPrice_decorators, { kind: "field", name: "minPrice", static: false, private: false, access: { has: function (obj) { return "minPrice" in obj; }, get: function (obj) { return obj.minPrice; }, set: function (obj, value) { obj.minPrice = value; } }, metadata: _metadata }, _minPrice_initializers, _minPrice_extraInitializers);
            __esDecorate(null, null, _maxPrice_decorators, { kind: "field", name: "maxPrice", static: false, private: false, access: { has: function (obj) { return "maxPrice" in obj; }, get: function (obj) { return obj.maxPrice; }, set: function (obj, value) { obj.maxPrice = value; } }, metadata: _metadata }, _maxPrice_initializers, _maxPrice_extraInitializers);
            __esDecorate(null, null, _page_decorators, { kind: "field", name: "page", static: false, private: false, access: { has: function (obj) { return "page" in obj; }, get: function (obj) { return obj.page; }, set: function (obj, value) { obj.page = value; } }, metadata: _metadata }, _page_initializers, _page_extraInitializers);
            __esDecorate(null, null, _limit_decorators, { kind: "field", name: "limit", static: false, private: false, access: { has: function (obj) { return "limit" in obj; }, get: function (obj) { return obj.limit; }, set: function (obj, value) { obj.limit = value; } }, metadata: _metadata }, _limit_initializers, _limit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ListingFilterParamsDto = ListingFilterParamsDto;
