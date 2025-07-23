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
exports.ReservationsService = void 0;
var common_1 = require("@nestjs/common");
var reservations_dto_1 = require("../common/dto/reservations.dto");
var communications_dto_1 = require("../common/dto/communications.dto");
var ReservationsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ReservationsService = _classThis = /** @class */ (function () {
        function ReservationsService_1(prismaClientManager, prisma, communicationsService, inventoryService) {
            this.prismaClientManager = prismaClientManager;
            this.prisma = prisma;
            this.communicationsService = communicationsService;
            this.inventoryService = inventoryService;
        }
        ReservationsService_1.prototype.getTenantPrismaClient = function (schemaName) {
            return this.prismaClientManager.getClient(schemaName);
        };
        // Reservation Management
        ReservationsService_1.prototype.createReservation = function (schemaName, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, commonArea, start, end, now, dayOfWeek, _a, openHour, openMinute, _b, closeHour, closeMinute, openingTimeToday, closingTimeToday, overlappingReservations, status, reservation, user;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, this.inventoryService.getCommonAreaById(schemaName, data.commonAreaId)];
                        case 1:
                            commonArea = _c.sent();
                            if (!commonArea) {
                                throw new common_1.NotFoundException("\u00C1rea com\u00FAn con ID ".concat(data.commonAreaId, " no encontrada."));
                            }
                            start = new Date(data.startDateTime);
                            end = new Date(data.endDateTime);
                            now = new Date();
                            dayOfWeek = start
                                .toLocaleString('en-us', { weekday: 'long' })
                                .toUpperCase();
                            if (commonArea.availableDays &&
                                commonArea.availableDays.length > 0 &&
                                !commonArea.availableDays.includes(dayOfWeek)) {
                                throw new common_1.BadRequestException("El \u00E1rea com\u00FAn no est\u00E1 disponible los ".concat(dayOfWeek, "s."));
                            }
                            // 2. Validate against common area's opening and closing times
                            if (commonArea.openingTime && commonArea.closingTime) {
                                _a = commonArea.openingTime
                                    .split(':')
                                    .map(Number), openHour = _a[0], openMinute = _a[1];
                                _b = commonArea.closingTime
                                    .split(':')
                                    .map(Number), closeHour = _b[0], closeMinute = _b[1];
                                openingTimeToday = new Date(start);
                                openingTimeToday.setHours(openHour, openMinute, 0, 0);
                                closingTimeToday = new Date(start);
                                closingTimeToday.setHours(closeHour, closeMinute, 0, 0);
                                if (start < openingTimeToday || end > closingTimeToday) {
                                    throw new common_1.BadRequestException("La reserva debe estar dentro del horario de ".concat(commonArea.openingTime, " a ").concat(commonArea.closingTime, "."));
                                }
                            }
                            // 3. Validate capacity
                            if (commonArea.capacity &&
                                data.attendees &&
                                data.attendees > commonArea.capacity) {
                                throw new common_1.BadRequestException("El n\u00FAmero de asistentes excede la capacidad m\u00E1xima (".concat(commonArea.capacity, ")."));
                            }
                            return [4 /*yield*/, prisma.reservation.findMany({
                                    where: {
                                        commonAreaId: data.commonAreaId,
                                        status: { in: [reservations_dto_1.ReservationStatus.PENDING, reservations_dto_1.ReservationStatus.APPROVED] },
                                        OR: [
                                            { startDateTime: { lt: end, gte: start } },
                                            { endDateTime: { lte: end, gt: start } },
                                            {
                                                AND: [
                                                    { startDateTime: { lte: start } },
                                                    { endDateTime: { gte: end } },
                                                ],
                                            },
                                        ],
                                    },
                                })];
                        case 2:
                            overlappingReservations = _c.sent();
                            if (overlappingReservations.length > 0) {
                                throw new common_1.BadRequestException('Ya existe una reserva que se solapa con el horario solicitado.');
                            }
                            status = commonArea.requiresApproval
                                ? reservations_dto_1.ReservationStatus.PENDING
                                : reservations_dto_1.ReservationStatus.APPROVED;
                            return [4 /*yield*/, prisma.reservation.create({
                                    data: __assign(__assign({}, data), { status: status }),
                                })];
                        case 3:
                            reservation = _c.sent();
                            return [4 /*yield*/, prisma.user.findUnique({ where: { id: data.userId } })];
                        case 4:
                            user = _c.sent();
                            if (!user) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.communicationsService.notifyUser(schemaName, user.id, {
                                    type: communications_dto_1.NotificationType.INFO,
                                    title: 'Reserva Creada',
                                    message: "Tu reserva para ".concat(commonArea.name, " ha sido ").concat(status === reservations_dto_1.ReservationStatus.APPROVED ? 'aprobada automáticamente' : 'enviada para aprobación', "."),
                                    link: "/resident/reservations/".concat(reservation.id),
                                    sourceType: communications_dto_1.NotificationSourceType.RESERVATION,
                                    sourceId: reservation.id.toString(),
                                })];
                        case 5:
                            _c.sent();
                            _c.label = 6;
                        case 6: return [2 /*return*/, reservation];
                    }
                });
            });
        };
        ReservationsService_1.prototype.getReservations = function (schemaName, filters) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, where;
                return __generator(this, function (_a) {
                    prisma = this.getTenantPrismaClient(schemaName);
                    where = {};
                    if (filters.commonAreaId) {
                        where.commonAreaId = filters.commonAreaId;
                    }
                    if (filters.userId) {
                        where.userId = filters.userId;
                    }
                    if (filters.status) {
                        where.status = filters.status;
                    }
                    if (filters.startDate) {
                        where.startDateTime = { gte: new Date(filters.startDate) };
                    }
                    if (filters.endDate) {
                        where.endDateTime = { lte: new Date(filters.endDate) };
                    }
                    return [2 /*return*/, prisma.reservation.findMany({
                            where: where,
                            include: { commonArea: true, user: true },
                            orderBy: { startDateTime: 'desc' },
                        })];
                });
            });
        };
        ReservationsService_1.prototype.getReservationById = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, reservation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.reservation.findUnique({
                                    where: { id: id },
                                    include: { commonArea: true, user: true },
                                })];
                        case 1:
                            reservation = _a.sent();
                            if (!reservation) {
                                throw new common_1.NotFoundException("Reserva con ID ".concat(id, " no encontrada."));
                            }
                            return [2 /*return*/, reservation];
                    }
                });
            });
        };
        ReservationsService_1.prototype.updateReservation = function (schemaName, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, reservation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.reservation.findUnique({ where: { id: id } })];
                        case 1:
                            reservation = _a.sent();
                            if (!reservation) {
                                throw new common_1.NotFoundException("Reserva con ID ".concat(id, " no encontrada."));
                            }
                            // TODO: Re-validate rules on update if start/end times or commonAreaId change
                            return [2 /*return*/, prisma.reservation.update({ where: { id: id }, data: data })];
                    }
                });
            });
        };
        ReservationsService_1.prototype.updateReservationStatus = function (schemaName, id, status) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, reservation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.reservation.findUnique({ where: { id: id } })];
                        case 1:
                            reservation = _a.sent();
                            if (!reservation) {
                                throw new common_1.NotFoundException("Reserva con ID ".concat(id, " no encontrada."));
                            }
                            return [2 /*return*/, prisma.reservation.update({ where: { id: id }, data: { status: status } })];
                    }
                });
            });
        };
        ReservationsService_1.prototype.deleteReservation = function (schemaName, id) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, reservation;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.reservation.findUnique({ where: { id: id } })];
                        case 1:
                            reservation = _a.sent();
                            if (!reservation) {
                                throw new common_1.NotFoundException("Reserva con ID ".concat(id, " no encontrada."));
                            }
                            return [4 /*yield*/, prisma.reservation.delete({ where: { id: id } })];
                        case 2:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        ReservationsService_1.prototype.approveReservation = function (schemaName, reservationId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, reservation, updatedReservation, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.reservation.findUnique({
                                    where: { id: reservationId },
                                })];
                        case 1:
                            reservation = _a.sent();
                            if (!reservation) {
                                throw new common_1.NotFoundException("Reserva con ID ".concat(reservationId, " no encontrada."));
                            }
                            if (reservation.status !== reservations_dto_1.ReservationStatus.PENDING) {
                                throw new common_1.BadRequestException("La reserva no est\u00E1 en estado PENDIENTE y no puede ser aprobada.");
                            }
                            return [4 /*yield*/, prisma.reservation.update({
                                    where: { id: reservationId },
                                    data: {
                                        status: reservations_dto_1.ReservationStatus.APPROVED,
                                        approvedById: userId,
                                        approvedAt: new Date(),
                                    },
                                })];
                        case 2:
                            updatedReservation = _a.sent();
                            return [4 /*yield*/, prisma.user.findUnique({
                                    where: { id: updatedReservation.userId },
                                })];
                        case 3:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.communicationsService.notifyUser(schemaName, user.id, {
                                    type: communications_dto_1.NotificationType.INFO,
                                    title: 'Reserva Aprobada',
                                    message: "Tu reserva para ".concat(updatedReservation.commonArea.name, " ha sido aprobada."), // Assuming commonArea is included
                                    link: "/resident/reservations/".concat(updatedReservation.id),
                                    sourceType: communications_dto_1.NotificationSourceType.RESERVATION,
                                    sourceId: updatedReservation.id.toString(),
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/, updatedReservation];
                    }
                });
            });
        };
        ReservationsService_1.prototype.rejectReservation = function (schemaName, reservationId, userId, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, reservation, updatedReservation, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.reservation.findUnique({
                                    where: { id: reservationId },
                                })];
                        case 1:
                            reservation = _a.sent();
                            if (!reservation) {
                                throw new common_1.NotFoundException("Reserva con ID ".concat(reservationId, " no encontrada."));
                            }
                            if (reservation.status !== reservations_dto_1.ReservationStatus.PENDING) {
                                throw new common_1.BadRequestException("La reserva no est\u00E1 en estado PENDIENTE y no puede ser rechazada.");
                            }
                            return [4 /*yield*/, prisma.reservation.update({
                                    where: { id: reservationId },
                                    data: {
                                        status: reservations_dto_1.ReservationStatus.REJECTED,
                                        rejectionReason: reason,
                                        approvedById: userId, // Record who rejected it
                                        approvedAt: new Date(), // Record rejection time
                                    },
                                })];
                        case 2:
                            updatedReservation = _a.sent();
                            return [4 /*yield*/, prisma.user.findUnique({
                                    where: { id: updatedReservation.userId },
                                })];
                        case 3:
                            user = _a.sent();
                            if (!user) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.communicationsService.notifyUser(schemaName, user.id, {
                                    type: communications_dto_1.NotificationType.ERROR,
                                    title: 'Reserva Rechazada',
                                    message: "Tu reserva para ".concat(updatedReservation.commonArea.name, " ha sido rechazada. Raz\u00F3n: ").concat(reason),
                                    link: "/resident/reservations/".concat(updatedReservation.id),
                                    sourceType: communications_dto_1.NotificationSourceType.RESERVATION,
                                    sourceId: updatedReservation.id.toString(),
                                })];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5: return [2 /*return*/, updatedReservation];
                    }
                });
            });
        };
        return ReservationsService_1;
    }());
    __setFunctionName(_classThis, "ReservationsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReservationsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReservationsService = _classThis;
}();
exports.ReservationsService = ReservationsService;
