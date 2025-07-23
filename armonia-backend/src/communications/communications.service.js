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
exports.CommunicationsService = void 0;
var common_1 = require("@nestjs/common");
var communications_dto_1 = require("../common/dto/communications.dto");
var twilio_1 = require("twilio");
var admin = require("firebase-admin");
var CommunicationsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CommunicationsService = _classThis = /** @class */ (function () {
        function CommunicationsService_1(prismaClientManager, prisma, configService) {
            this.prismaClientManager = prismaClientManager;
            this.prisma = prisma;
            this.configService = configService;
            var accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
            var authToken = this.configService.get('TWILIO_AUTH_TOKEN');
            this.twilioPhoneNumber = this.configService.get('TWILIO_PHONE_NUMBER');
            if (accountSid && authToken) {
                this.twilioClient = (0, twilio_1.default)(accountSid, authToken);
            }
            else {
                console.warn('Twilio credentials not found. SMS functionality will be disabled.');
            }
            // Initialize Firebase Admin SDK
            if (!admin.apps.length) {
                var firebaseConfig = this.configService.get('FIREBASE_SERVICE_ACCOUNT_KEY');
                if (firebaseConfig) {
                    admin.initializeApp({
                        credential: admin.credential.cert(JSON.parse(firebaseConfig)),
                    });
                }
                else {
                    console.warn('Firebase service account key not found. Push notification functionality will be disabled.');
                }
            }
        }
        CommunicationsService_1.prototype.getTenantPrismaClient = function (schemaName) {
            return this.prismaClientManager.getClient(schemaName);
        };
        CommunicationsService_1.prototype.sendSms = function (to, message) {
            return __awaiter(this, void 0, void 0, function () {
                var error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.twilioClient || !this.twilioPhoneNumber) {
                                console.warn('Twilio is not configured. SMS not sent.');
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, this.twilioClient.messages.create({
                                    body: message,
                                    from: this.twilioPhoneNumber,
                                    to: to,
                                })];
                        case 2:
                            _a.sent();
                            console.log("SMS sent to ".concat(to, ": ").concat(message));
                            return [3 /*break*/, 4];
                        case 3:
                            error_1 = _a.sent();
                            console.error("Error sending SMS to ".concat(to, ":"), error_1);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.sendPushNotification = function (token, title, body, data) {
            return __awaiter(this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!admin.apps.length) {
                                console.warn('Firebase Admin SDK is not initialized. Push notification not sent.');
                                return [2 /*return*/];
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, admin.messaging().send({
                                    token: token,
                                    notification: {
                                        title: title,
                                        body: body,
                                    },
                                    data: data,
                                })];
                        case 2:
                            _a.sent();
                            console.log("Push notification sent to token: ".concat(token));
                            return [3 /*break*/, 4];
                        case 3:
                            error_2 = _a.sent();
                            console.error("Error sending push notification to token ".concat(token, ":"), error_2);
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        // NOTIFICACIONES (Modelos de tenant)
        CommunicationsService_1.prototype.notifyUser = function (schemaName, userId, notification) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, user, dbNotification, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 8, , 9]);
                            return [4 /*yield*/, prisma.user.findUnique({ where: { id: userId } })];
                        case 2:
                            user = _a.sent();
                            if (!user) {
                                throw new Error("Usuario con ID ".concat(userId, " no encontrado"));
                            }
                            if (!(notification.type === communications_dto_1.NotificationType.SMS && user.phoneNumber)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.sendSms(user.phoneNumber, notification.message)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (!(notification.type === communications_dto_1.NotificationType.PUSH && user.deviceToken)) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.sendPushNotification(user.deviceToken, notification.title, notification.message, notification.data)];
                        case 5:
                            _a.sent();
                            _a.label = 6;
                        case 6: return [4 /*yield*/, prisma.notification.create({
                                data: {
                                    recipientId: userId,
                                    type: notification.type,
                                    title: notification.title,
                                    message: notification.message,
                                    link: notification.link,
                                    data: notification.data,
                                    sourceType: notification.sourceType,
                                    sourceId: notification.sourceId,
                                    priority: notification.priority || communications_dto_1.NotificationPriority.MEDIUM,
                                    requireConfirmation: notification.requireConfirmation || false,
                                    expiresAt: notification.expiresAt,
                                },
                            })];
                        case 7:
                            dbNotification = _a.sent();
                            return [2 /*return*/, dbNotification];
                        case 8:
                            error_3 = _a.sent();
                            console.error('Error al enviar notificación al usuario:', error_3);
                            throw new Error('No se pudo enviar la notificación');
                        case 9: return [2 /*return*/];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.notifyUsers = function (schemaName, userIds, notification) {
            return __awaiter(this, void 0, void 0, function () {
                var results, _i, userIds_1, userId, result, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            results = [];
                            _i = 0, userIds_1 = userIds;
                            _a.label = 1;
                        case 1:
                            if (!(_i < userIds_1.length)) return [3 /*break*/, 6];
                            userId = userIds_1[_i];
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            return [4 /*yield*/, this.notifyUser(schemaName, userId, notification)];
                        case 3:
                            result = _a.sent();
                            results.push(result);
                            return [3 /*break*/, 5];
                        case 4:
                            error_4 = _a.sent();
                            console.error("Error al enviar notificaci\u00F3n al usuario ".concat(userId, ":"), error_4);
                            return [3 /*break*/, 5];
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6: return [2 /*return*/, results];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.notifyByRole = function (schemaName, role, notification) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, users, userIds;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.user.findMany({
                                    where: { role: role },
                                    select: { id: true, phoneNumber: true, deviceToken: true }, // Select phoneNumber and deviceToken
                                })];
                        case 1:
                            users = _a.sent();
                            userIds = users.map(function (user) { return user.id; });
                            return [4 /*yield*/, this.notifyUsers(schemaName, userIds, notification)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.getUserNotifications = function (schemaName_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (schemaName, userId, filters) {
                var prisma, read, type, sourceType, priority, limit;
                if (filters === void 0) { filters = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            read = filters.read, type = filters.type, sourceType = filters.sourceType, priority = filters.priority, limit = filters.limit;
                            return [4 /*yield*/, prisma.notification.findMany(__assign({ where: __assign(__assign(__assign(__assign({ recipientId: userId }, (read !== undefined && { read: read })), (type !== undefined && { type: type })), (sourceType !== undefined && { sourceType: sourceType })), (priority !== undefined && { priority: priority })), orderBy: {
                                        createdAt: 'desc',
                                    } }, (limit !== undefined && { take: limit })))];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.markNotificationAsRead = function (schemaName, notificationId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, notification;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.notification.findFirst({
                                    where: {
                                        id: notificationId,
                                        recipientId: userId,
                                    },
                                })];
                        case 1:
                            notification = _a.sent();
                            if (!notification) {
                                throw new Error('Notificación no encontrada o no pertenece al usuario');
                            }
                            return [4 /*yield*/, prisma.notification.update({
                                    where: { id: notificationId },
                                    data: {
                                        read: true,
                                        readAt: new Date(),
                                    },
                                })];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.markAllNotificationsAsRead = function (schemaName, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.notification.updateMany({
                                    where: {
                                        recipientId: userId,
                                        read: false,
                                    },
                                    data: {
                                        read: true,
                                        readAt: new Date(),
                                    },
                                })];
                        case 1: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.confirmNotificationReading = function (schemaName, notificationId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, notification;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.notification.findFirst({
                                    where: {
                                        id: notificationId,
                                        recipientId: userId,
                                        requireConfirmation: true,
                                    },
                                })];
                        case 1:
                            notification = _a.sent();
                            if (!notification) {
                                throw new Error('Notificación no encontrada, no pertenece al usuario o no requiere confirmación');
                            }
                            return [4 /*yield*/, prisma.notificationConfirmation.create({
                                    data: {
                                        notificationId: notificationId,
                                        userId: userId,
                                    },
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, prisma.notification.update({
                                    where: { id: notificationId },
                                    data: {
                                        read: true,
                                        readAt: new Date(),
                                    },
                                })];
                        case 3: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // ANUNCIOS (Modelos de tenant)
        CommunicationsService_1.prototype.getAnnouncements = function (schemaName_1, userId_1, userRole_1) {
            return __awaiter(this, arguments, void 0, function (schemaName, userId, userRole, filters) {
                var prisma, type, read, limit, queryOptions, announcements;
                if (filters === void 0) { filters = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            type = filters.type, read = filters.read, limit = filters.limit;
                            queryOptions = {
                                where: {},
                                orderBy: {
                                    createdAt: 'desc',
                                },
                                include: {
                                    createdBy: { select: { id: true, name: true, image: true } },
                                    readBy: {
                                        where: {
                                            userId: userId,
                                        },
                                        select: { userId: true, readAt: true },
                                    },
                                    attachments: true,
                                },
                            };
                            if (type) {
                                queryOptions.where.type = type;
                            }
                            if (read === true) {
                                queryOptions.where.readBy = { some: { userId: userId } };
                            }
                            else if (read === false) {
                                queryOptions.where.readBy = { none: { userId: userId } };
                            }
                            if (limit && !isNaN(Number(limit))) {
                                queryOptions.take = Number(limit);
                            }
                            if (!(userRole === 'ADMIN' || userRole === 'COMPLEX_ADMIN')) return [3 /*break*/, 2];
                            return [4 /*yield*/, prisma.announcement.findMany(queryOptions)];
                        case 1:
                            announcements = _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            queryOptions.where.OR = [
                                { visibility: 'public' },
                                { targetRoles: { has: userRole } },
                            ];
                            return [4 /*yield*/, prisma.announcement.findMany(queryOptions)];
                        case 3:
                            announcements = _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, announcements.map(function (announcement) { return ({
                                id: announcement.id,
                                title: announcement.title,
                                content: announcement.content,
                                type: announcement.type,
                                createdAt: announcement.createdAt,
                                expiresAt: announcement.expiresAt,
                                createdBy: announcement.createdBy,
                                attachments: announcement.attachments.map(function (attachment) { return ({
                                    id: attachment.id,
                                    name: attachment.name,
                                    url: attachment.url,
                                    type: attachment.type,
                                    size: attachment.size,
                                }); }),
                                readBy: announcement.readBy,
                                isRead: announcement.readBy.length > 0,
                                requireConfirmation: announcement.requireConfirmation, // Corregido
                            }); })];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.createAnnouncement = function (schemaName, userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, announcement, attachmentRecords, completeAnnouncement, targetUserIds, users, _i, users_1, user, _a, users_2, user, users, _b, users_3, user, _c, users_4, user;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.announcement.create({
                                    data: {
                                        title: data.title,
                                        content: data.content,
                                        type: data.type || 'general',
                                        visibility: data.visibility || 'public',
                                        targetRoles: data.targetRoles || [],
                                        requireConfirmation: data.requireConfirmation || false, // Corregido
                                        expiresAt: data.expiresAt,
                                        createdById: userId,
                                    },
                                })];
                        case 1:
                            announcement = _d.sent();
                            if (!(data.attachments && data.attachments.length > 0)) return [3 /*break*/, 3];
                            attachmentRecords = data.attachments.map(function (attachment) { return ({
                                announcementId: announcement.id,
                                name: attachment.name,
                                url: attachment.url,
                                type: attachment.type,
                                size: attachment.size,
                            }); });
                            return [4 /*yield*/, prisma.announcementAttachment.createMany({
                                    data: attachmentRecords,
                                })];
                        case 2:
                            _d.sent();
                            _d.label = 3;
                        case 3: return [4 /*yield*/, prisma.announcement.findUnique({
                                where: { id: announcement.id },
                                include: {
                                    createdBy: { select: { id: true, name: true, image: true } },
                                    attachments: true,
                                },
                            })];
                        case 4:
                            completeAnnouncement = _d.sent();
                            targetUserIds = [];
                            if (!(completeAnnouncement.visibility === 'public')) return [3 /*break*/, 14];
                            return [4 /*yield*/, prisma.user.findMany({
                                    select: { id: true, phoneNumber: true, deviceToken: true },
                                })];
                        case 5:
                            users = _d.sent();
                            targetUserIds = users.map(function (user) { return user.id; });
                            if (!(completeAnnouncement.type === 'emergency')) return [3 /*break*/, 9];
                            _i = 0, users_1 = users;
                            _d.label = 6;
                        case 6:
                            if (!(_i < users_1.length)) return [3 /*break*/, 9];
                            user = users_1[_i];
                            if (!user.phoneNumber) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.sendSms(user.phoneNumber, "Alerta de emergencia: ".concat(completeAnnouncement.title, ". ").concat(completeAnnouncement.content.substring(0, 100), "..."))];
                        case 7:
                            _d.sent();
                            _d.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 6];
                        case 9:
                            if (!(completeAnnouncement.type === 'emergency')) return [3 /*break*/, 13];
                            _a = 0, users_2 = users;
                            _d.label = 10;
                        case 10:
                            if (!(_a < users_2.length)) return [3 /*break*/, 13];
                            user = users_2[_a];
                            if (!user.deviceToken) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.sendPushNotification(user.deviceToken, "Alerta de emergencia: ".concat(completeAnnouncement.title), completeAnnouncement.content)];
                        case 11:
                            _d.sent();
                            _d.label = 12;
                        case 12:
                            _a++;
                            return [3 /*break*/, 10];
                        case 13: return [3 /*break*/, 23];
                        case 14:
                            if (!(completeAnnouncement.visibility === 'role-based' &&
                                completeAnnouncement.targetRoles.length > 0)) return [3 /*break*/, 23];
                            return [4 /*yield*/, prisma.user.findMany({
                                    where: { role: { in: completeAnnouncement.targetRoles } },
                                    select: { id: true, phoneNumber: true, deviceToken: true },
                                })];
                        case 15:
                            users = _d.sent();
                            targetUserIds = users.map(function (user) { return user.id; });
                            if (!(completeAnnouncement.type === 'emergency')) return [3 /*break*/, 19];
                            _b = 0, users_3 = users;
                            _d.label = 16;
                        case 16:
                            if (!(_b < users_3.length)) return [3 /*break*/, 19];
                            user = users_3[_b];
                            if (!user.phoneNumber) return [3 /*break*/, 18];
                            return [4 /*yield*/, this.sendSms(user.phoneNumber, "Alerta de emergencia: ".concat(completeAnnouncement.title, ". ").concat(completeAnnouncement.content.substring(0, 100), "..."))];
                        case 17:
                            _d.sent();
                            _d.label = 18;
                        case 18:
                            _b++;
                            return [3 /*break*/, 16];
                        case 19:
                            if (!(completeAnnouncement.type === 'emergency')) return [3 /*break*/, 23];
                            _c = 0, users_4 = users;
                            _d.label = 20;
                        case 20:
                            if (!(_c < users_4.length)) return [3 /*break*/, 23];
                            user = users_4[_c];
                            if (!user.deviceToken) return [3 /*break*/, 22];
                            return [4 /*yield*/, this.sendPushNotification(user.deviceToken, "Alerta de emergencia: ".concat(completeAnnouncement.title), completeAnnouncement.content)];
                        case 21:
                            _d.sent();
                            _d.label = 22;
                        case 22:
                            _c++;
                            return [3 /*break*/, 20];
                        case 23:
                            if (!(targetUserIds.length > 0)) return [3 /*break*/, 25];
                            return [4 /*yield*/, this.notifyUsers(schemaName, targetUserIds, {
                                    type: completeAnnouncement.type === 'emergency'
                                        ? communications_dto_1.NotificationType.ERROR
                                        : completeAnnouncement.type === 'important'
                                            ? communications_dto_1.NotificationType.WARNING
                                            : communications_dto_1.NotificationType.INFO,
                                    title: completeAnnouncement.title,
                                    message: "Nuevo anuncio: ".concat(completeAnnouncement.title),
                                    link: "/announcements/".concat(completeAnnouncement.id),
                                    sourceType: communications_dto_1.NotificationSourceType.SYSTEM,
                                    sourceId: completeAnnouncement.id.toString(),
                                    priority: completeAnnouncement.type === 'emergency'
                                        ? communications_dto_1.NotificationPriority.URGENT
                                        : completeAnnouncement.type === 'important'
                                            ? communications_dto_1.NotificationPriority.HIGH
                                            : communications_dto_1.NotificationPriority.MEDIUM,
                                })];
                        case 24:
                            _d.sent();
                            _d.label = 25;
                        case 25: return [2 /*return*/, completeAnnouncement];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.updateAnnouncement = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, announcement, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.announcement.update({
                                    where: { id: id },
                                    data: {
                                        title: data.title,
                                        content: data.content,
                                        type: data.type,
                                        visibility: data.visibility,
                                        targetRoles: data.targetRoles,
                                        requireConfirmation: data.requireConfirmation,
                                        expiresAt: data.expiresAt,
                                    },
                                })];
                        case 2:
                            announcement = _a.sent();
                            return [2 /*return*/, announcement];
                        case 3:
                            error_5 = _a.sent();
                            console.error('Error al actualizar anuncio:', error_5);
                            throw new Error('No se pudo actualizar el anuncio');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.deleteAnnouncement = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.announcement.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: 'Anuncio eliminado correctamente' }];
                        case 3:
                            error_6 = _a.sent();
                            console.error('Error al eliminar anuncio:', error_6);
                            throw new Error('No se pudo eliminar el anuncio');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.markAnnouncementAsRead = function (schemaName, announcementId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, existingRead;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.announcementRead.findUnique({
                                    where: {
                                        announcementId_userId: { announcementId: announcementId, userId: userId },
                                    },
                                })];
                        case 1:
                            existingRead = _a.sent();
                            if (existingRead) {
                                return [2 /*return*/, existingRead];
                            }
                            return [4 /*yield*/, prisma.announcementRead.create({
                                    data: { announcementId: announcementId, userId: userId },
                                })];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // MENSAJES (Modelos de tenant)
        CommunicationsService_1.prototype.getOrCreateDirectConversation = function (schemaName, userId1, userId2) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, existingConversation, newConversation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.conversation.findFirst({
                                    where: {
                                        type: 'direct',
                                        participants: {
                                            every: { userId: { in: [userId1, userId2] } },
                                        },
                                        AND: [
                                            { participants: { some: { userId: userId1 } } },
                                            { participants: { some: { userId: userId2 } } },
                                        ],
                                    },
                                    include: { participants: true },
                                })];
                        case 1:
                            existingConversation = _a.sent();
                            if (existingConversation) {
                                return [2 /*return*/, existingConversation];
                            }
                            return [4 /*yield*/, prisma.conversation.create({
                                    data: {
                                        type: 'direct',
                                        participants: {
                                            create: [
                                                { userId: userId1, role: 'member' },
                                                { userId: userId2, role: 'member' },
                                            ],
                                        },
                                    },
                                    include: { participants: true },
                                })];
                        case 2:
                            newConversation = _a.sent();
                            return [2 /*return*/, newConversation];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.sendMessage = function (schemaName, conversationId, senderId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, participant, message, attachmentRecords, otherParticipants, _i, otherParticipants_1, participant_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.conversationParticipant.findFirst({
                                    where: { conversationId: conversationId, userId: senderId },
                                })];
                        case 1:
                            participant = _a.sent();
                            if (!participant) {
                                throw new Error('El usuario no pertenece a esta conversación');
                            }
                            return [4 /*yield*/, prisma.message.create({
                                    data: { conversationId: conversationId, senderId: senderId, content: data.content, status: 'sent' },
                                    include: { sender: { select: { id: true, name: true, image: true } } },
                                })];
                        case 2:
                            message = _a.sent();
                            if (!(data.attachments && data.attachments.length > 0)) return [3 /*break*/, 4];
                            attachmentRecords = data.attachments.map(function (attachment) { return ({
                                messageId: message.id,
                                name: attachment.name,
                                url: attachment.url,
                                type: attachment.type,
                                size: attachment.size,
                            }); });
                            return [4 /*yield*/, prisma.messageAttachment.createMany({ data: attachmentRecords })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [4 /*yield*/, prisma.conversation.update({
                                where: { id: conversationId },
                                data: { updatedAt: new Date() },
                            })];
                        case 5:
                            _a.sent();
                            return [4 /*yield*/, prisma.conversationParticipant.findMany({
                                    where: { conversationId: conversationId, userId: { not: senderId } },
                                })];
                        case 6:
                            otherParticipants = _a.sent();
                            _i = 0, otherParticipants_1 = otherParticipants;
                            _a.label = 7;
                        case 7:
                            if (!(_i < otherParticipants_1.length)) return [3 /*break*/, 10];
                            participant_1 = otherParticipants_1[_i];
                            return [4 /*yield*/, this.notifyUser(schemaName, participant_1.userId, {
                                    type: communications_dto_1.NotificationType.INFO,
                                    title: 'Nuevo mensaje',
                                    message: "".concat(message.sender.name, ": ").concat(data.content.substring(0, 50)).concat(data.content.length > 50 ? '...' : ''),
                                    link: "/messages/".concat(conversationId),
                                    sourceType: communications_dto_1.NotificationSourceType.MESSAGE,
                                    sourceId: message.id.toString(),
                                    priority: communications_dto_1.NotificationPriority.MEDIUM,
                                })];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 7];
                        case 10: return [2 /*return*/, message];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.getConversationMessages = function (schemaName_1, conversationId_1, userId_1) {
            return __awaiter(this, arguments, void 0, function (schemaName, conversationId, userId, options) {
                var prisma, participant, queryOptions, messages, messagesToUpdate;
                if (options === void 0) { options = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.conversationParticipant.findFirst({
                                    where: { conversationId: conversationId, userId: userId },
                                })];
                        case 1:
                            participant = _a.sent();
                            if (!participant) {
                                throw new Error('El usuario no pertenece a esta conversación');
                            }
                            queryOptions = {
                                where: { conversationId: conversationId },
                                orderBy: { createdAt: 'desc' },
                                include: {
                                    sender: { select: { id: true, name: true, image: true } },
                                    attachments: true,
                                    readBy: { where: { userId: userId } },
                                },
                            };
                            if (options.before) {
                                queryOptions.where.createdAt = { lt: options.before };
                            }
                            if (options.limit) {
                                queryOptions.take = options.limit;
                            }
                            return [4 /*yield*/, prisma.message.findMany(queryOptions)];
                        case 2:
                            messages = _a.sent();
                            messagesToUpdate = messages.filter(function (m) { return m.senderId !== userId && m.status === 'sent'; });
                            if (!(messagesToUpdate.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, prisma.message.updateMany({
                                    where: { id: { in: messagesToUpdate.map(function (m) { return m.id; }) } },
                                    data: { status: 'delivered' },
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, messages];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.markMessageAsRead = function (schemaName, messageId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, message, existingRead, messageRead, allParticipants, allReads;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.message.findUnique({
                                    where: { id: parseInt(messageId) },
                                    include: {
                                        conversation: { include: { participants: { where: { userId: userId } } } },
                                    },
                                })];
                        case 1:
                            message = _a.sent();
                            if (!message) {
                                throw new Error('Mensaje no encontrado');
                            }
                            if (message.conversation.participants.length === 0) {
                                throw new Error('El usuario no pertenece a esta conversación');
                            }
                            return [4 /*yield*/, prisma.messageRead.findUnique({
                                    where: { messageId_userId: { messageId: messageId, userId: userId } },
                                })];
                        case 2:
                            existingRead = _a.sent();
                            if (existingRead) {
                                return [2 /*return*/, existingRead];
                            }
                            return [4 /*yield*/, prisma.messageRead.create({
                                    data: { messageId: messageId, userId: userId },
                                })];
                        case 3:
                            messageRead = _a.sent();
                            return [4 /*yield*/, prisma.conversationParticipant.findMany({
                                    where: {
                                        conversationId: message.conversationId,
                                        userId: { not: message.senderId },
                                    },
                                })];
                        case 4:
                            allParticipants = _a.sent();
                            return [4 /*yield*/, prisma.messageRead.findMany({
                                    where: { messageId: messageId },
                                })];
                        case 5:
                            allReads = _a.sent();
                            if (!(allReads.length >= allParticipants.length)) return [3 /*break*/, 7];
                            return [4 /*yield*/, prisma.message.update({
                                    where: { id: +messageId },
                                    data: { status: 'read' },
                                })];
                        case 6:
                            _a.sent();
                            _a.label = 7;
                        case 7: return [2 /*return*/, messageRead];
                    }
                });
            });
        };
        // EVENTOS COMUNITARIOS (Modelos de tenant)
        CommunicationsService_1.prototype.createEvent = function (schemaName, organizerId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, event, attachmentRecords, completeEvent, targetUserIds, users, _i, users_5, user, _a, users_6, user, users, _b, users_7, user, _c, users_8, user;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.communityEvent.create({
                                    data: {
                                        title: data.title,
                                        description: data.description,
                                        location: data.location,
                                        startDateTime: data.startDateTime,
                                        endDateTime: data.endDateTime,
                                        type: data.type || 'general',
                                        visibility: data.visibility || 'public',
                                        targetRoles: data.targetRoles || [],
                                        maxAttendees: data.maxAttendees,
                                        organizerId: organizerId,
                                    },
                                })];
                        case 1:
                            event = _d.sent();
                            if (!(data.attachments && data.attachments.length > 0)) return [3 /*break*/, 3];
                            attachmentRecords = data.attachments.map(function (attachment) { return ({
                                eventId: event.id,
                                name: attachment.name,
                                url: attachment.url,
                                type: attachment.type,
                                size: attachment.size,
                            }); });
                            return [4 /*yield*/, prisma.eventAttachment.createMany({ data: attachmentRecords })];
                        case 2:
                            _d.sent();
                            _d.label = 3;
                        case 3: return [4 /*yield*/, prisma.communityEvent.findUnique({
                                where: { id: event.id },
                                include: {
                                    organizer: { select: { id: true, name: true, image: true } },
                                    attachments: true,
                                },
                            })];
                        case 4:
                            completeEvent = _d.sent();
                            targetUserIds = [];
                            if (!(completeEvent.visibility === 'public')) return [3 /*break*/, 14];
                            return [4 /*yield*/, prisma.user.findMany({
                                    select: { id: true, phoneNumber: true, deviceToken: true },
                                })];
                        case 5:
                            users = _d.sent();
                            targetUserIds = users.map(function (user) { return user.id; });
                            if (!(completeEvent.type === 'emergency')) return [3 /*break*/, 9];
                            _i = 0, users_5 = users;
                            _d.label = 6;
                        case 6:
                            if (!(_i < users_5.length)) return [3 /*break*/, 9];
                            user = users_5[_i];
                            if (!user.phoneNumber) return [3 /*break*/, 8];
                            return [4 /*yield*/, this.sendSms(user.phoneNumber, "Alerta de emergencia: ".concat(completeEvent.title, ". ").concat(completeEvent.content.substring(0, 100), "..."))];
                        case 7:
                            _d.sent();
                            _d.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 6];
                        case 9:
                            if (!(completeEvent.type === 'emergency')) return [3 /*break*/, 13];
                            _a = 0, users_6 = users;
                            _d.label = 10;
                        case 10:
                            if (!(_a < users_6.length)) return [3 /*break*/, 13];
                            user = users_6[_a];
                            if (!user.deviceToken) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.sendPushNotification(user.deviceToken, "Alerta de emergencia: ".concat(completeEvent.title), completeEvent.content)];
                        case 11:
                            _d.sent();
                            _d.label = 12;
                        case 12:
                            _a++;
                            return [3 /*break*/, 10];
                        case 13: return [3 /*break*/, 23];
                        case 14:
                            if (!(completeEvent.visibility === 'role-based' &&
                                completeEvent.targetRoles.length > 0)) return [3 /*break*/, 23];
                            return [4 /*yield*/, prisma.user.findMany({
                                    where: { role: { in: completeEvent.targetRoles } },
                                    select: { id: true, phoneNumber: true, deviceToken: true },
                                })];
                        case 15:
                            users = _d.sent();
                            targetUserIds = users.map(function (user) { return user.id; });
                            if (!(completeEvent.type === 'emergency')) return [3 /*break*/, 19];
                            _b = 0, users_7 = users;
                            _d.label = 16;
                        case 16:
                            if (!(_b < users_7.length)) return [3 /*break*/, 19];
                            user = users_7[_b];
                            if (!user.phoneNumber) return [3 /*break*/, 18];
                            return [4 /*yield*/, this.sendSms(user.phoneNumber, "Alerta de emergencia: ".concat(completeEvent.title, ". ").concat(completeEvent.content.substring(0, 100), "..."))];
                        case 17:
                            _d.sent();
                            _d.label = 18;
                        case 18:
                            _b++;
                            return [3 /*break*/, 16];
                        case 19:
                            if (!(completeEvent.type === 'emergency')) return [3 /*break*/, 23];
                            _c = 0, users_8 = users;
                            _d.label = 20;
                        case 20:
                            if (!(_c < users_8.length)) return [3 /*break*/, 23];
                            user = users_8[_c];
                            if (!user.deviceToken) return [3 /*break*/, 22];
                            return [4 /*yield*/, this.sendPushNotification(user.deviceToken, "Alerta de emergencia: ".concat(completeEvent.title), completeEvent.content)];
                        case 21:
                            _d.sent();
                            _d.label = 22;
                        case 22:
                            _c++;
                            return [3 /*break*/, 20];
                        case 23:
                            if (!(targetUserIds.length > 0)) return [3 /*break*/, 25];
                            return [4 /*yield*/, this.notifyUsers(schemaName, targetUserIds, {
                                    type: completeEvent.type === 'emergency'
                                        ? communications_dto_1.NotificationType.ERROR
                                        : completeEvent.type === 'important'
                                            ? communications_dto_1.NotificationType.WARNING
                                            : communications_dto_1.NotificationType.INFO,
                                    title: completeEvent.title,
                                    message: "Nuevo evento: ".concat(completeEvent.title),
                                    link: "/events/".concat(completeEvent.id),
                                    sourceType: communications_dto_1.NotificationSourceType.SYSTEM,
                                    sourceId: completeEvent.id.toString(),
                                    priority: completeEvent.type === 'emergency'
                                        ? communications_dto_1.NotificationPriority.URGENT
                                        : completeEvent.type === 'important'
                                            ? communications_dto_1.NotificationPriority.HIGH
                                            : communications_dto_1.NotificationPriority.MEDIUM,
                                })];
                        case 24:
                            _d.sent();
                            _d.label = 25;
                        case 25: return [2 /*return*/, completeEvent];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.updateEvent = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, event_1, error_7;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.communityEvent.update({
                                    where: { id: id },
                                    data: {
                                        title: data.title,
                                        description: data.description,
                                        location: data.location,
                                        startDateTime: data.startDateTime,
                                        endDateTime: data.endDateTime,
                                        type: data.type,
                                        visibility: data.visibility,
                                        targetRoles: data.targetRoles,
                                        maxAttendees: data.maxAttendees,
                                    },
                                })];
                        case 2:
                            event_1 = _a.sent();
                            return [2 /*return*/, event_1];
                        case 3:
                            error_7 = _a.sent();
                            console.error('Error al actualizar evento:', error_7);
                            throw new Error('No se pudo actualizar el evento');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.deleteEvent = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, error_8;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, prisma.communityEvent.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, { message: 'Evento eliminado correctamente' }];
                        case 3:
                            error_8 = _a.sent();
                            console.error('Error al eliminar evento:', error_8);
                            throw new Error('No se pudo eliminar el evento');
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.getEvents = function (schemaName_1, userId_1, userRole_1) {
            return __awaiter(this, arguments, void 0, function (schemaName, userId, userRole, filters) {
                var prisma, type, upcoming, limit, startDate, endDate, queryOptions, events;
                if (filters === void 0) { filters = {}; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            type = filters.type, upcoming = filters.upcoming, limit = filters.limit, startDate = filters.startDate, endDate = filters.endDate;
                            queryOptions = {
                                where: {},
                                orderBy: {
                                    startDateTime: upcoming ? 'asc' : 'desc',
                                },
                                include: {
                                    organizer: { select: { id: true, name: true, image: true } },
                                    attendees: { where: { userId: userId } },
                                    attachments: true,
                                },
                            };
                            if (type) {
                                queryOptions.where.type = type;
                            }
                            if (upcoming) {
                                queryOptions.where.startDateTime = { gte: new Date() };
                            }
                            if (startDate) {
                                queryOptions.where.startDateTime = __assign(__assign({}, queryOptions.where.startDateTime), { gte: startDate });
                            }
                            if (endDate) {
                                queryOptions.where.endDateTime = { lte: endDate };
                            }
                            if (!(userRole === 'ADMIN' || userRole === 'COMPLEX_ADMIN')) return [3 /*break*/, 2];
                            return [4 /*yield*/, prisma.communityEvent.findMany(queryOptions)];
                        case 1:
                            events = _a.sent();
                            return [3 /*break*/, 4];
                        case 2:
                            queryOptions.where.OR = [
                                { visibility: 'public' },
                                { targetRoles: { has: userRole } },
                            ];
                            return [4 /*yield*/, prisma.communityEvent.findMany(queryOptions)];
                        case 3:
                            events = _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, events.map(function (event) { return ({
                                id: event.id,
                                title: event.title,
                                description: event.description,
                                location: event.location,
                                startDateTime: event.startDateTime,
                                endDateTime: event.endDateTime,
                                type: event.type,
                                visibility: event.visibility,
                                maxAttendees: event.maxAttendees,
                                organizer: event.organizer,
                                attachments: event.attachments.map(function (attachment) { return ({
                                    id: attachment.id,
                                    name: attachment.name,
                                    url: attachment.url,
                                    type: attachment.type,
                                    size: attachment.size,
                                }); }),
                                userAttendance: event.attendees.length > 0 ? event.attendees[0] : null,
                            }); })];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.registerEventAttendance = function (schemaName, eventId, userId, status) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, event, confirmedCount;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.communityEvent.findUnique({
                                    where: { id: eventId },
                                    include: { attendees: { where: { userId: userId } } },
                                })];
                        case 1:
                            event = _a.sent();
                            if (!event) {
                                throw new Error('Evento no encontrado');
                            }
                            if (!(status === 'confirmed' && event.maxAttendees)) return [3 /*break*/, 3];
                            return [4 /*yield*/, prisma.eventAttendee.count({
                                    where: { eventId: eventId, status: 'confirmed' },
                                })];
                        case 2:
                            confirmedCount = _a.sent();
                            if (confirmedCount >= event.maxAttendees &&
                                event.attendees.length === 0) {
                                throw new Error('El evento ha alcanzado su capacidad máxima');
                            }
                            _a.label = 3;
                        case 3:
                            if (!(event.attendees.length > 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, prisma.eventAttendee.update({
                                    where: { id: event.attendees[0].id },
                                    data: { status: status },
                                })];
                        case 4: return [2 /*return*/, _a.sent()];
                        case 5: return [4 /*yield*/, prisma.eventAttendee.create({
                                data: { eventId: eventId, userId: userId, status: status },
                            })];
                        case 6: return [2 /*return*/, _a.sent()];
                    }
                });
            });
        };
        // UTILIDADES (Modelos globales y de tenant)
        CommunicationsService_1.prototype.cleanupExpiredItems = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var prismaTenant, now, deletedNotifications, updatedAnnouncements;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prismaTenant = this.getTenantPrismaClient(schemaName);
                            now = new Date();
                            return [4 /*yield*/, prismaTenant.notification.deleteMany({
                                    where: { expiresAt: { lt: now } },
                                })];
                        case 1:
                            deletedNotifications = _a.sent();
                            return [4 /*yield*/, prismaTenant.announcement.updateMany({
                                    where: { expiresAt: { lt: now } },
                                    data: { data: { expired: true } },
                                })];
                        case 2:
                            updatedAnnouncements = _a.sent();
                            return [2 /*return*/, {
                                    deletedNotifications: deletedNotifications.count,
                                    updatedAnnouncements: updatedAnnouncements.count,
                                }];
                    }
                });
            });
        };
        CommunicationsService_1.prototype.migrateReservationNotifications = function (schemaName) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, reservationNotifications, migratedCount, _i, reservationNotifications_1, oldNotification, type, prisma_1, error_9;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.reservationNotification.findMany({
                                    where: { migrated: false },
                                    include: { reservation: true },
                                })];
                        case 1:
                            reservationNotifications = _b.sent();
                            migratedCount = 0;
                            _i = 0, reservationNotifications_1 = reservationNotifications;
                            _b.label = 2;
                        case 2:
                            if (!(_i < reservationNotifications_1.length)) return [3 /*break*/, 8];
                            oldNotification = reservationNotifications_1[_i];
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 6, , 7]);
                            type = communications_dto_1.NotificationType.INFO;
                            if (oldNotification.type === 'rejection')
                                type = communications_dto_1.NotificationType.ERROR;
                            if (oldNotification.type === 'cancellation')
                                type = communications_dto_1.NotificationType.WARNING;
                            prisma_1 = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma_1.notification.create({
                                    data: {
                                        recipientId: oldNotification.userId,
                                        type: type,
                                        title: 'Notificación de reserva',
                                        message: oldNotification.message,
                                        sourceType: communications_dto_1.NotificationSourceType.RESERVATION,
                                        sourceId: (_a = oldNotification.reservationId) === null || _a === void 0 ? void 0 : _a.toString(),
                                        read: oldNotification.isRead || false,
                                        readAt: oldNotification.readAt,
                                        data: {
                                            reservationId: oldNotification.reservationId,
                                            notificationType: oldNotification.type,
                                        },
                                    },
                                })];
                        case 4:
                            _b.sent();
                            return [4 /*yield*/, this.prisma.reservationNotification.update({
                                    where: { id: oldNotification.id },
                                    data: { migrated: true },
                                })];
                        case 5:
                            _b.sent();
                            migratedCount++;
                            return [3 /*break*/, 7];
                        case 6:
                            error_9 = _b.sent();
                            console.error("Error al migrar notificaci\u00F3n ".concat(oldNotification.id, ":"), error_9);
                            return [3 /*break*/, 7];
                        case 7:
                            _i++;
                            return [3 /*break*/, 2];
                        case 8: return [2 /*return*/, { migratedCount: migratedCount }];
                    }
                });
            });
        };
        return CommunicationsService_1;
    }());
    __setFunctionName(_classThis, "CommunicationsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommunicationsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommunicationsService = _classThis;
}();
exports.CommunicationsService = CommunicationsService;
