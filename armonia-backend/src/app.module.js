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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var survey_module_1 = require("./surveys/survey.module");
var packages_module_1 = require("./packages/packages.module");
var visitors_module_1 = require("./visitors/visitors.module");
var pqr_module_1 = require("./pqr/pqr.module");
var personal_finances_module_1 = require("./personal-finances/personal-finances.module");
var reservations_module_1 = require("./reservations/reservations.module");
var common_1 = require("@nestjs/common");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var auth_module_1 = require("./auth/auth.module");
var user_module_1 = require("./user/user.module");
var prisma_module_1 = require("./prisma/prisma.module");
var config_1 = require("@nestjs/config");
var tenant_module_1 = require("./tenant/tenant.module");
var inventory_module_1 = require("./inventory/inventory.module");
var communications_module_1 = require("./communications/communications.module");
var finances_module_1 = require("./finances/finances.module");
var projects_module_1 = require("./projects/projects.module");
var security_module_1 = require("./security/security.module");
var plans_module_1 = require("./plans/plans.module");
var bank_reconciliation_module_1 = require("./bank-reconciliation/bank-reconciliation.module");
var documents_module_1 = require("./documents/documents.module");
var payment_gateways_module_1 = require("./payment-gateways/payment-gateways.module");
var residential_complex_module_1 = require("./residential-complex/residential-complex.module");
var insurtech_module_1 = require("./insurtech/insurtech.module");
var reports_module_1 = require("./reports/reports.module");
var staff_module_1 = require("./staff/staff.module"); // Importar el nuevo módulo
var service_providers_module_1 = require("./service-providers/service-providers.module");
var fintech_module_1 = require("./fintech/fintech.module");
var iot_module_1 = require("./iot/iot.module");
var portfolio_module_1 = require("./portfolio/portfolio.module");
var marketplace_module_1 = require("./marketplace/marketplace.module");
var assembly_module_1 = require("./assembly/assembly.module");
var panic_module_1 = require("./panic/panic.module");
var AppModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                config_1.ConfigModule.forRoot({ isGlobal: true }),
                auth_module_1.AuthModule,
                user_module_1.UserModule,
                prisma_module_1.PrismaModule,
                tenant_module_1.TenantModule,
                inventory_module_1.InventoryModule,
                communications_module_1.CommunicationsModule,
                finances_module_1.FinancesModule,
                pqr_module_1.PqrModule,
                projects_module_1.ProjectsModule,
                security_module_1.SecurityModule,
                plans_module_1.PlansModule,
                bank_reconciliation_module_1.BankReconciliationModule,
                documents_module_1.DocumentsModule,
                visitors_module_1.VisitorsModule,
                packages_module_1.PackagesModule,
                survey_module_1.SurveyModule,
                service_providers_module_1.ServiceProvidersModule,
                fintech_module_1.FintechModule,
                iot_module_1.IotModule,
                portfolio_module_1.PortfolioModule,
                marketplace_module_1.MarketplaceModule,
                assembly_module_1.AssemblyModule,
                panic_module_1.PanicModule,
                reservations_module_1.ReservationsModule,
                personal_finances_module_1.PersonalFinancesModule,
                payment_gateways_module_1.PaymentGatewaysModule,
                residential_complex_module_1.ResidentialComplexModule,
                insurtech_module_1.InsurtechModule,
                reports_module_1.ReportsModule,
                staff_module_1.StaffModule, // Añadir el nuevo módulo aquí
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AppModule = _classThis = /** @class */ (function () {
        function AppModule_1() {
        }
        return AppModule_1;
    }());
    __setFunctionName(_classThis, "AppModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AppModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AppModule = _classThis;
}();
exports.AppModule = AppModule;
