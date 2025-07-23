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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
var common_1 = require("@nestjs/common");
var PDFDocument = require("pdfkit");
var XLSX = require("xlsx");
var date_fns_1 = require("date-fns");
var client_1 = require("@prisma/client"); // Import necessary enums
var ReportsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ReportsService = _classThis = /** @class */ (function () {
        function ReportsService_1(prismaClientManager, prisma) {
            this.prismaClientManager = prismaClientManager;
            this.prisma = prisma;
        }
        ReportsService_1.prototype.getTenantPrismaClient = function (schemaName) {
            return this.prismaClientManager.getClient(schemaName);
        };
        ReportsService_1.prototype.generateVisitorsReportPdf = function (schemaName, startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, visitors, doc, buffers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.visitor.findMany({
                                    where: {
                                        entryTime: { gte: startDate, lte: endDate },
                                    },
                                    orderBy: { entryTime: 'asc' },
                                })];
                        case 1:
                            visitors = _a.sent();
                            doc = new PDFDocument();
                            buffers = [];
                            doc.on('data', buffers.push.bind(buffers));
                            doc.on('end', function () { });
                            doc.fontSize(18).text('Reporte de Visitantes', { align: 'center' });
                            doc
                                .fontSize(10)
                                .text("Per\u00EDodo: ".concat((0, date_fns_1.format)(startDate, 'dd/MM/yyyy'), " - ").concat((0, date_fns_1.format)(endDate, 'dd/MM/yyyy')), { align: 'center' });
                            doc.moveDown();
                            // Table Header
                            doc.font('Helvetica-Bold').fontSize(10);
                            doc.text('Nombre', 50, doc.y, { width: 100, align: 'left' });
                            doc.text('Identificación', 150, doc.y, { width: 100, align: 'left' });
                            doc.text('Visitado', 250, doc.y, { width: 100, align: 'left' });
                            doc.text('Entrada', 350, doc.y, { width: 100, align: 'left' });
                            doc.text('Salida', 450, doc.y, { width: 100, align: 'left' });
                            doc.moveDown();
                            // Table Rows
                            doc.font('Helvetica').fontSize(9);
                            visitors.forEach(function (visitor) {
                                doc.text(visitor.name, 50, doc.y, { width: 100, align: 'left' });
                                doc.text(visitor.identification, 150, doc.y, {
                                    width: 100,
                                    align: 'left',
                                });
                                doc.text(visitor.visitedUnit, 250, doc.y, { width: 100, align: 'left' });
                                doc.text((0, date_fns_1.format)(visitor.entryTime, 'dd/MM/yyyy HH:mm'), 350, doc.y, {
                                    width: 100,
                                    align: 'left',
                                });
                                doc.text(visitor.exitTime ? (0, date_fns_1.format)(visitor.exitTime, 'dd/MM/yyyy HH:mm') : 'N/A', 450, doc.y, { width: 100, align: 'left' });
                                doc.moveDown();
                            });
                            doc.end();
                            return [2 /*return*/, new Promise(function (resolve) {
                                    doc.on('end', function () { return resolve(Buffer.concat(buffers)); });
                                })];
                    }
                });
            });
        };
        ReportsService_1.prototype.generateVisitorsReportExcel = function (schemaName, startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, visitors, data, ws, wb, buf;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.visitor.findMany({
                                    where: {
                                        entryTime: { gte: startDate, lte: endDate },
                                    },
                                    orderBy: { entryTime: 'asc' },
                                })];
                        case 1:
                            visitors = _a.sent();
                            data = __spreadArray([
                                ['Nombre', 'Identificación', 'Visitado', 'Entrada', 'Salida']
                            ], visitors.map(function (visitor) { return [
                                visitor.name,
                                visitor.identification,
                                visitor.visitedUnit,
                                (0, date_fns_1.format)(visitor.entryTime, 'dd/MM/yyyy HH:mm'),
                                visitor.exitTime ? (0, date_fns_1.format)(visitor.exitTime, 'dd/MM/yyyy HH:mm') : 'N/A',
                            ]; }), true);
                            ws = XLSX.utils.aoa_to_sheet(data);
                            wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, 'Visitantes');
                            buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
                            return [2 /*return*/, buf];
                    }
                });
            });
        };
        ReportsService_1.prototype.generatePackagesReportPdf = function (schemaName, startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, packages, doc, buffers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.package.findMany({
                                    where: {
                                        registrationDate: { gte: startDate, lte: endDate },
                                    },
                                    orderBy: { registrationDate: 'asc' },
                                })];
                        case 1:
                            packages = _a.sent();
                            doc = new PDFDocument();
                            buffers = [];
                            doc.on('data', buffers.push.bind(buffers));
                            doc.on('end', function () { });
                            doc.fontSize(18).text('Reporte de Paquetes', { align: 'center' });
                            doc
                                .fontSize(10)
                                .text("Per\u00EDodo: ".concat((0, date_fns_1.format)(startDate, 'dd/MM/yyyy'), " - ").concat((0, date_fns_1.format)(endDate, 'dd/MM/yyyy')), { align: 'center' });
                            doc.moveDown();
                            // Table Header
                            doc.font('Helvetica-Bold').fontSize(10);
                            doc.text('Tipo', 50, doc.y, { width: 80, align: 'left' });
                            doc.text('Seguimiento', 130, doc.y, { width: 80, align: 'left' });
                            doc.text('Destino', 210, doc.y, { width: 80, align: 'left' });
                            doc.text('Remitente', 290, doc.y, { width: 80, align: 'left' });
                            doc.text('Registro', 370, doc.y, { width: 80, align: 'left' });
                            doc.text('Entrega', 450, doc.y, { width: 80, align: 'left' });
                            doc.text('Estado', 530, doc.y, { width: 80, align: 'left' });
                            doc.moveDown();
                            // Table Rows
                            doc.font('Helvetica').fontSize(9);
                            packages.forEach(function (pkg) {
                                doc.text(pkg.type, 50, doc.y, { width: 80, align: 'left' });
                                doc.text(pkg.trackingNumber || 'N/A', 130, doc.y, {
                                    width: 80,
                                    align: 'left',
                                });
                                doc.text(pkg.recipientUnit, 210, doc.y, { width: 80, align: 'left' });
                                doc.text(pkg.sender || 'N/A', 290, doc.y, { width: 80, align: 'left' });
                                doc.text((0, date_fns_1.format)(pkg.registrationDate, 'dd/MM/yyyy HH:mm'), 370, doc.y, {
                                    width: 80,
                                    align: 'left',
                                });
                                doc.text(pkg.deliveryDate ? (0, date_fns_1.format)(pkg.deliveryDate, 'dd/MM/yyyy HH:mm') : 'N/A', 450, doc.y, { width: 80, align: 'left' });
                                doc.text(pkg.status, 530, doc.y, { width: 80, align: 'left' });
                                doc.moveDown();
                            });
                            doc.end();
                            return [2 /*return*/, new Promise(function (resolve) {
                                    doc.on('end', function () { return resolve(Buffer.concat(buffers)); });
                                })];
                    }
                });
            });
        };
        ReportsService_1.prototype.generatePackagesReportExcel = function (schemaName, startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, packages, data, ws, wb, buf;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.package.findMany({
                                    where: {
                                        registrationDate: { gte: startDate, lte: endDate },
                                    },
                                    orderBy: { registrationDate: 'asc' },
                                })];
                        case 1:
                            packages = _a.sent();
                            data = __spreadArray([
                                [
                                    'Tipo',
                                    'Seguimiento',
                                    'Destino',
                                    'Remitente',
                                    'Registro',
                                    'Entrega',
                                    'Estado',
                                ]
                            ], packages.map(function (pkg) { return [
                                pkg.type,
                                pkg.trackingNumber || 'N/A',
                                pkg.recipientUnit,
                                pkg.sender || 'N/A',
                                (0, date_fns_1.format)(pkg.registrationDate, 'dd/MM/yyyy HH:mm'),
                                pkg.deliveryDate ? (0, date_fns_1.format)(pkg.deliveryDate, 'dd/MM/yyyy HH:mm') : 'N/A',
                                pkg.status,
                            ]; }), true);
                            ws = XLSX.utils.aoa_to_sheet(data);
                            wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, 'Paquetes');
                            buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
                            return [2 /*return*/, buf];
                    }
                });
            });
        };
        ReportsService_1.prototype.generateIncidentsReportPdf = function (schemaName, startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, incidents, doc, buffers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.pQR.findMany({
                                    where: {
                                        createdAt: { gte: startDate, lte: endDate },
                                    },
                                    orderBy: { createdAt: 'asc' },
                                })];
                        case 1:
                            incidents = _a.sent();
                            doc = new PDFDocument();
                            buffers = [];
                            doc.on('data', buffers.push.bind(buffers));
                            doc.on('end', function () { });
                            doc.fontSize(18).text('Reporte de Incidentes', { align: 'center' });
                            doc
                                .fontSize(10)
                                .text("Per\u00EDodo: ".concat((0, date_fns_1.format)(startDate, 'dd/MM/yyyy'), " - ").concat((0, date_fns_1.format)(endDate, 'dd/MM/yyyy')), { align: 'center' });
                            doc.moveDown();
                            // Table Header
                            doc.font('Helvetica-Bold').fontSize(10);
                            doc.text('Título', 50, doc.y, { width: 100, align: 'left' });
                            doc.text('Categoría', 150, doc.y, { width: 80, align: 'left' });
                            doc.text('Prioridad', 230, doc.y, { width: 80, align: 'left' });
                            doc.text('Ubicación', 310, doc.y, { width: 100, align: 'left' });
                            doc.text('Reportado Por', 410, doc.y, { width: 100, align: 'left' });
                            doc.text('Estado', 510, doc.y, { width: 80, align: 'left' });
                            doc.moveDown();
                            // Table Rows
                            doc.font('Helvetica').fontSize(9);
                            incidents.forEach(function (incident) {
                                doc.text(incident.subject, 50, doc.y, { width: 100, align: 'left' });
                                doc.text(incident.category, 150, doc.y, { width: 80, align: 'left' });
                                doc.text(incident.priority, 230, doc.y, { width: 80, align: 'left' });
                                doc.text(incident.location, 310, doc.y, { width: 100, align: 'left' });
                                doc.text(incident.reportedBy, 410, doc.y, { width: 100, align: 'left' });
                                doc.text(incident.status, 510, doc.y, { width: 80, align: 'left' });
                                doc.moveDown();
                            });
                            doc.end();
                            return [2 /*return*/, new Promise(function (resolve) {
                                    doc.on('end', function () { return resolve(Buffer.concat(buffers)); });
                                })];
                    }
                });
            });
        };
        ReportsService_1.prototype.generateIncidentsReportExcel = function (schemaName, startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var prisma, incidents, data, ws, wb, buf;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.pQR.findMany({
                                    where: {
                                        createdAt: { gte: startDate, lte: endDate },
                                    },
                                    orderBy: { createdAt: 'asc' },
                                })];
                        case 1:
                            incidents = _a.sent();
                            data = __spreadArray([
                                [
                                    'Título',
                                    'Categoría',
                                    'Prioridad',
                                    'Ubicación',
                                    'Reportado Por',
                                    'Estado',
                                ]
                            ], incidents.map(function (incident) { return [
                                incident.subject,
                                incident.category,
                                incident.priority,
                                incident.location,
                                incident.reportedBy,
                                incident.status,
                            ]; }), true);
                            ws = XLSX.utils.aoa_to_sheet(data);
                            wb = XLSX.utils.book_new();
                            XLSX.utils.book_append_sheet(wb, ws, 'Incidentes');
                            buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
                            return [2 /*return*/, buf];
                    }
                });
            });
        };
        ReportsService_1.prototype.generateConsolidatedFinancialReportPdf = function (schemaNames, startDate, endDate) {
            return __awaiter(this, void 0, void 0, function () {
                var doc, buffers, totalIncome, totalExpenses, totalPendingFees, _i, schemaNames_1, schemaName, prisma, incomeResult, expenseResult, pendingFeesResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            doc = new PDFDocument();
                            buffers = [];
                            doc.on('data', buffers.push.bind(buffers));
                            doc.on('end', function () { });
                            doc.fontSize(18).text('Reporte Financiero Consolidado', { align: 'center' });
                            doc
                                .fontSize(10)
                                .text("Per\u00EDodo: ".concat((0, date_fns_1.format)(startDate, 'dd/MM/yyyy'), " - ").concat((0, date_fns_1.format)(endDate, 'dd/MM/yyyy')), { align: 'center' });
                            doc.moveDown();
                            totalIncome = 0;
                            totalExpenses = 0;
                            totalPendingFees = 0;
                            _i = 0, schemaNames_1 = schemaNames;
                            _a.label = 1;
                        case 1:
                            if (!(_i < schemaNames_1.length)) return [3 /*break*/, 6];
                            schemaName = schemaNames_1[_i];
                            prisma = this.getTenantPrismaClient(schemaName);
                            return [4 /*yield*/, prisma.payment.aggregate({
                                    _sum: { amount: true },
                                    where: {
                                        status: client_1.PaymentStatus.COMPLETED,
                                        paymentDate: { gte: startDate, lte: endDate },
                                    },
                                })];
                        case 2:
                            incomeResult = _a.sent();
                            totalIncome += incomeResult._sum.amount || 0;
                            return [4 /*yield*/, prisma.expense.aggregate({
                                    _sum: { amount: true },
                                    where: {
                                        status: client_1.ExpenseStatus.PAID,
                                        date: { gte: startDate, lte: endDate },
                                    },
                                })];
                        case 3:
                            expenseResult = _a.sent();
                            totalExpenses += expenseResult._sum.amount || 0;
                            return [4 /*yield*/, prisma.fee.aggregate({
                                    _sum: { amount: true },
                                    where: {
                                        status: client_1.FeeStatus.PENDING,
                                        dueDate: { gte: startDate, lte: endDate },
                                    },
                                })];
                        case 4:
                            pendingFeesResult = _a.sent();
                            totalPendingFees += pendingFeesResult._sum.amount || 0;
                            _a.label = 5;
                        case 5:
                            _i++;
                            return [3 /*break*/, 1];
                        case 6:
                            doc.fontSize(12).text("Ingresos Totales: $".concat(totalIncome.toFixed(2)));
                            doc.fontSize(12).text("Gastos Totales: $".concat(totalExpenses.toFixed(2)));
                            doc.fontSize(12).text("Saldo Neto: $".concat((totalIncome - totalExpenses).toFixed(2)));
                            doc.fontSize(12).text("Cuotas Pendientes: $".concat(totalPendingFees.toFixed(2)));
                            doc.moveDown();
                            doc.end();
                            return [2 /*return*/, new Promise(function (resolve) {
                                    doc.on('end', function () { return resolve(Buffer.concat(buffers)); });
                                })];
                    }
                });
            });
        };
        return ReportsService_1;
    }());
    __setFunctionName(_classThis, "ReportsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ReportsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ReportsService = _classThis;
}();
exports.ReportsService = ReportsService;
