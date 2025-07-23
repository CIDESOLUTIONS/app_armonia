"use strict";
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
exports.EventDataDto = exports.MessageDataDto = exports.AnnouncementDataDto = exports.AttachmentDto = exports.NotificationDataDto = exports.NotificationSourceType = exports.NotificationPriority = exports.NotificationType = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "EMAIL";
    NotificationType["SMS"] = "SMS";
    NotificationType["PUSH"] = "PUSH";
    NotificationType["APP"] = "APP";
    NotificationType["WHATSAPP"] = "WHATSAPP";
    NotificationType["INFO"] = "info";
    NotificationType["WARNING"] = "warning";
    NotificationType["ERROR"] = "error";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "low";
    NotificationPriority["MEDIUM"] = "medium";
    NotificationPriority["HIGH"] = "high";
    NotificationPriority["URGENT"] = "urgent";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var NotificationSourceType;
(function (NotificationSourceType) {
    NotificationSourceType["SYSTEM"] = "system";
    NotificationSourceType["RESERVATION"] = "reservation";
    NotificationSourceType["ASSEMBLY"] = "assembly";
    NotificationSourceType["FINANCIAL"] = "financial";
    NotificationSourceType["SECURITY"] = "security";
    NotificationSourceType["MESSAGE"] = "message";
    NotificationSourceType["PACKAGE"] = "package";
})(NotificationSourceType || (exports.NotificationSourceType = NotificationSourceType = {}));
var NotificationDataDto = function () {
    var _a;
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _message_decorators;
    var _message_initializers = [];
    var _message_extraInitializers = [];
    var _link_decorators;
    var _link_initializers = [];
    var _link_extraInitializers = [];
    var _data_decorators;
    var _data_initializers = [];
    var _data_extraInitializers = [];
    var _sourceType_decorators;
    var _sourceType_initializers = [];
    var _sourceType_extraInitializers = [];
    var _sourceId_decorators;
    var _sourceId_initializers = [];
    var _sourceId_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    var _requireConfirmation_decorators;
    var _requireConfirmation_initializers = [];
    var _requireConfirmation_extraInitializers = [];
    var _expiresAt_decorators;
    var _expiresAt_initializers = [];
    var _expiresAt_extraInitializers = [];
    return _a = /** @class */ (function () {
            function NotificationDataDto() {
                this.type = __runInitializers(this, _type_initializers, void 0);
                this.title = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.message = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _message_initializers, void 0));
                this.link = (__runInitializers(this, _message_extraInitializers), __runInitializers(this, _link_initializers, void 0));
                this.data = (__runInitializers(this, _link_extraInitializers), __runInitializers(this, _data_initializers, void 0));
                this.sourceType = (__runInitializers(this, _data_extraInitializers), __runInitializers(this, _sourceType_initializers, void 0));
                this.sourceId = (__runInitializers(this, _sourceType_extraInitializers), __runInitializers(this, _sourceId_initializers, void 0));
                this.priority = (__runInitializers(this, _sourceId_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.requireConfirmation = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _requireConfirmation_initializers, void 0));
                this.expiresAt = (__runInitializers(this, _requireConfirmation_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
                __runInitializers(this, _expiresAt_extraInitializers);
            }
            return NotificationDataDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _type_decorators = [(0, class_validator_1.IsEnum)(NotificationType)];
            _title_decorators = [(0, class_validator_1.IsString)()];
            _message_decorators = [(0, class_validator_1.IsString)()];
            _link_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _data_decorators = [(0, class_validator_1.IsOptional)()];
            _sourceType_decorators = [(0, class_validator_1.IsEnum)(NotificationSourceType)];
            _sourceId_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _priority_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(NotificationPriority)];
            _requireConfirmation_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _expiresAt_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _message_decorators, { kind: "field", name: "message", static: false, private: false, access: { has: function (obj) { return "message" in obj; }, get: function (obj) { return obj.message; }, set: function (obj, value) { obj.message = value; } }, metadata: _metadata }, _message_initializers, _message_extraInitializers);
            __esDecorate(null, null, _link_decorators, { kind: "field", name: "link", static: false, private: false, access: { has: function (obj) { return "link" in obj; }, get: function (obj) { return obj.link; }, set: function (obj, value) { obj.link = value; } }, metadata: _metadata }, _link_initializers, _link_extraInitializers);
            __esDecorate(null, null, _data_decorators, { kind: "field", name: "data", static: false, private: false, access: { has: function (obj) { return "data" in obj; }, get: function (obj) { return obj.data; }, set: function (obj, value) { obj.data = value; } }, metadata: _metadata }, _data_initializers, _data_extraInitializers);
            __esDecorate(null, null, _sourceType_decorators, { kind: "field", name: "sourceType", static: false, private: false, access: { has: function (obj) { return "sourceType" in obj; }, get: function (obj) { return obj.sourceType; }, set: function (obj, value) { obj.sourceType = value; } }, metadata: _metadata }, _sourceType_initializers, _sourceType_extraInitializers);
            __esDecorate(null, null, _sourceId_decorators, { kind: "field", name: "sourceId", static: false, private: false, access: { has: function (obj) { return "sourceId" in obj; }, get: function (obj) { return obj.sourceId; }, set: function (obj, value) { obj.sourceId = value; } }, metadata: _metadata }, _sourceId_initializers, _sourceId_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _requireConfirmation_decorators, { kind: "field", name: "requireConfirmation", static: false, private: false, access: { has: function (obj) { return "requireConfirmation" in obj; }, get: function (obj) { return obj.requireConfirmation; }, set: function (obj, value) { obj.requireConfirmation = value; } }, metadata: _metadata }, _requireConfirmation_initializers, _requireConfirmation_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: function (obj) { return "expiresAt" in obj; }, get: function (obj) { return obj.expiresAt; }, set: function (obj, value) { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.NotificationDataDto = NotificationDataDto;
var AttachmentDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _url_decorators;
    var _url_initializers = [];
    var _url_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _size_decorators;
    var _size_initializers = [];
    var _size_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AttachmentDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.url = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _url_initializers, void 0));
                this.type = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.size = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _size_initializers, void 0));
                __runInitializers(this, _size_extraInitializers);
            }
            return AttachmentDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, class_validator_1.IsString)()];
            _url_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsString)()];
            _size_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: function (obj) { return "url" in obj; }, get: function (obj) { return obj.url; }, set: function (obj, value) { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _size_decorators, { kind: "field", name: "size", static: false, private: false, access: { has: function (obj) { return "size" in obj; }, get: function (obj) { return obj.size; }, set: function (obj, value) { obj.size = value; } }, metadata: _metadata }, _size_initializers, _size_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AttachmentDto = AttachmentDto;
var AnnouncementDataDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _visibility_decorators;
    var _visibility_initializers = [];
    var _visibility_extraInitializers = [];
    var _targetRoles_decorators;
    var _targetRoles_initializers = [];
    var _targetRoles_extraInitializers = [];
    var _requireConfirmation_decorators;
    var _requireConfirmation_initializers = [];
    var _requireConfirmation_extraInitializers = [];
    var _expiresAt_decorators;
    var _expiresAt_initializers = [];
    var _expiresAt_extraInitializers = [];
    var _attachments_decorators;
    var _attachments_initializers = [];
    var _attachments_extraInitializers = [];
    return _a = /** @class */ (function () {
            function AnnouncementDataDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.content = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _content_initializers, void 0));
                this.type = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.visibility = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
                this.targetRoles = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _targetRoles_initializers, void 0));
                this.requireConfirmation = (__runInitializers(this, _targetRoles_extraInitializers), __runInitializers(this, _requireConfirmation_initializers, void 0)); // Corregido de requiresConfirmation
                this.expiresAt = (__runInitializers(this, _requireConfirmation_extraInitializers), __runInitializers(this, _expiresAt_initializers, void 0));
                this.attachments = (__runInitializers(this, _expiresAt_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                __runInitializers(this, _attachments_extraInitializers);
            }
            return AnnouncementDataDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)()];
            _content_decorators = [(0, class_validator_1.IsString)()];
            _type_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visibility_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _targetRoles_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _requireConfirmation_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            _expiresAt_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsDateString)()];
            _attachments_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_transformer_1.Type)(function () { return AttachmentDto; })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: function (obj) { return "visibility" in obj; }, get: function (obj) { return obj.visibility; }, set: function (obj, value) { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
            __esDecorate(null, null, _targetRoles_decorators, { kind: "field", name: "targetRoles", static: false, private: false, access: { has: function (obj) { return "targetRoles" in obj; }, get: function (obj) { return obj.targetRoles; }, set: function (obj, value) { obj.targetRoles = value; } }, metadata: _metadata }, _targetRoles_initializers, _targetRoles_extraInitializers);
            __esDecorate(null, null, _requireConfirmation_decorators, { kind: "field", name: "requireConfirmation", static: false, private: false, access: { has: function (obj) { return "requireConfirmation" in obj; }, get: function (obj) { return obj.requireConfirmation; }, set: function (obj, value) { obj.requireConfirmation = value; } }, metadata: _metadata }, _requireConfirmation_initializers, _requireConfirmation_extraInitializers);
            __esDecorate(null, null, _expiresAt_decorators, { kind: "field", name: "expiresAt", static: false, private: false, access: { has: function (obj) { return "expiresAt" in obj; }, get: function (obj) { return obj.expiresAt; }, set: function (obj, value) { obj.expiresAt = value; } }, metadata: _metadata }, _expiresAt_initializers, _expiresAt_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: function (obj) { return "attachments" in obj; }, get: function (obj) { return obj.attachments; }, set: function (obj, value) { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.AnnouncementDataDto = AnnouncementDataDto;
var MessageDataDto = function () {
    var _a;
    var _content_decorators;
    var _content_initializers = [];
    var _content_extraInitializers = [];
    var _attachments_decorators;
    var _attachments_initializers = [];
    var _attachments_extraInitializers = [];
    return _a = /** @class */ (function () {
            function MessageDataDto() {
                this.content = __runInitializers(this, _content_initializers, void 0);
                this.attachments = (__runInitializers(this, _content_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                __runInitializers(this, _attachments_extraInitializers);
            }
            return MessageDataDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _content_decorators = [(0, class_validator_1.IsString)()];
            _attachments_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_transformer_1.Type)(function () { return AttachmentDto; })];
            __esDecorate(null, null, _content_decorators, { kind: "field", name: "content", static: false, private: false, access: { has: function (obj) { return "content" in obj; }, get: function (obj) { return obj.content; }, set: function (obj, value) { obj.content = value; } }, metadata: _metadata }, _content_initializers, _content_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: function (obj) { return "attachments" in obj; }, get: function (obj) { return obj.attachments; }, set: function (obj, value) { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.MessageDataDto = MessageDataDto;
var EventDataDto = function () {
    var _a;
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _description_decorators;
    var _description_initializers = [];
    var _description_extraInitializers = [];
    var _location_decorators;
    var _location_initializers = [];
    var _location_extraInitializers = [];
    var _startDateTime_decorators;
    var _startDateTime_initializers = [];
    var _startDateTime_extraInitializers = [];
    var _endDateTime_decorators;
    var _endDateTime_initializers = [];
    var _endDateTime_extraInitializers = [];
    var _type_decorators;
    var _type_initializers = [];
    var _type_extraInitializers = [];
    var _visibility_decorators;
    var _visibility_initializers = [];
    var _visibility_extraInitializers = [];
    var _targetRoles_decorators;
    var _targetRoles_initializers = [];
    var _targetRoles_extraInitializers = [];
    var _maxAttendees_decorators;
    var _maxAttendees_initializers = [];
    var _maxAttendees_extraInitializers = [];
    var _attachments_decorators;
    var _attachments_initializers = [];
    var _attachments_extraInitializers = [];
    return _a = /** @class */ (function () {
            function EventDataDto() {
                this.title = __runInitializers(this, _title_initializers, void 0);
                this.description = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _description_initializers, void 0));
                this.location = (__runInitializers(this, _description_extraInitializers), __runInitializers(this, _location_initializers, void 0));
                this.startDateTime = (__runInitializers(this, _location_extraInitializers), __runInitializers(this, _startDateTime_initializers, void 0));
                this.endDateTime = (__runInitializers(this, _startDateTime_extraInitializers), __runInitializers(this, _endDateTime_initializers, void 0));
                this.type = (__runInitializers(this, _endDateTime_extraInitializers), __runInitializers(this, _type_initializers, void 0));
                this.visibility = (__runInitializers(this, _type_extraInitializers), __runInitializers(this, _visibility_initializers, void 0));
                this.targetRoles = (__runInitializers(this, _visibility_extraInitializers), __runInitializers(this, _targetRoles_initializers, void 0));
                this.maxAttendees = (__runInitializers(this, _targetRoles_extraInitializers), __runInitializers(this, _maxAttendees_initializers, void 0));
                this.attachments = (__runInitializers(this, _maxAttendees_extraInitializers), __runInitializers(this, _attachments_initializers, void 0));
                __runInitializers(this, _attachments_extraInitializers);
            }
            return EventDataDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _title_decorators = [(0, class_validator_1.IsString)()];
            _description_decorators = [(0, class_validator_1.IsString)()];
            _location_decorators = [(0, class_validator_1.IsString)()];
            _startDateTime_decorators = [(0, class_validator_1.IsDateString)()];
            _endDateTime_decorators = [(0, class_validator_1.IsDateString)()];
            _type_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _visibility_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _targetRoles_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsString)({ each: true })];
            _maxAttendees_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsNumber)()];
            _attachments_decorators = [(0, class_validator_1.IsOptional)(), (0, class_validator_1.IsArray)(), (0, class_transformer_1.Type)(function () { return AttachmentDto; })];
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _description_decorators, { kind: "field", name: "description", static: false, private: false, access: { has: function (obj) { return "description" in obj; }, get: function (obj) { return obj.description; }, set: function (obj, value) { obj.description = value; } }, metadata: _metadata }, _description_initializers, _description_extraInitializers);
            __esDecorate(null, null, _location_decorators, { kind: "field", name: "location", static: false, private: false, access: { has: function (obj) { return "location" in obj; }, get: function (obj) { return obj.location; }, set: function (obj, value) { obj.location = value; } }, metadata: _metadata }, _location_initializers, _location_extraInitializers);
            __esDecorate(null, null, _startDateTime_decorators, { kind: "field", name: "startDateTime", static: false, private: false, access: { has: function (obj) { return "startDateTime" in obj; }, get: function (obj) { return obj.startDateTime; }, set: function (obj, value) { obj.startDateTime = value; } }, metadata: _metadata }, _startDateTime_initializers, _startDateTime_extraInitializers);
            __esDecorate(null, null, _endDateTime_decorators, { kind: "field", name: "endDateTime", static: false, private: false, access: { has: function (obj) { return "endDateTime" in obj; }, get: function (obj) { return obj.endDateTime; }, set: function (obj, value) { obj.endDateTime = value; } }, metadata: _metadata }, _endDateTime_initializers, _endDateTime_extraInitializers);
            __esDecorate(null, null, _type_decorators, { kind: "field", name: "type", static: false, private: false, access: { has: function (obj) { return "type" in obj; }, get: function (obj) { return obj.type; }, set: function (obj, value) { obj.type = value; } }, metadata: _metadata }, _type_initializers, _type_extraInitializers);
            __esDecorate(null, null, _visibility_decorators, { kind: "field", name: "visibility", static: false, private: false, access: { has: function (obj) { return "visibility" in obj; }, get: function (obj) { return obj.visibility; }, set: function (obj, value) { obj.visibility = value; } }, metadata: _metadata }, _visibility_initializers, _visibility_extraInitializers);
            __esDecorate(null, null, _targetRoles_decorators, { kind: "field", name: "targetRoles", static: false, private: false, access: { has: function (obj) { return "targetRoles" in obj; }, get: function (obj) { return obj.targetRoles; }, set: function (obj, value) { obj.targetRoles = value; } }, metadata: _metadata }, _targetRoles_initializers, _targetRoles_extraInitializers);
            __esDecorate(null, null, _maxAttendees_decorators, { kind: "field", name: "maxAttendees", static: false, private: false, access: { has: function (obj) { return "maxAttendees" in obj; }, get: function (obj) { return obj.maxAttendees; }, set: function (obj, value) { obj.maxAttendees = value; } }, metadata: _metadata }, _maxAttendees_initializers, _maxAttendees_extraInitializers);
            __esDecorate(null, null, _attachments_decorators, { kind: "field", name: "attachments", static: false, private: false, access: { has: function (obj) { return "attachments" in obj; }, get: function (obj) { return obj.attachments; }, set: function (obj, value) { obj.attachments = value; } }, metadata: _metadata }, _attachments_initializers, _attachments_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.EventDataDto = EventDataDto;
