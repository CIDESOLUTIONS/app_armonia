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
exports.AssemblyModule = void 0;
var common_1 = require("@nestjs/common");
var assembly_controller_1 = require("./assembly.controller");
var assembly_advanced_service_impl_1 = require("../services/assembly-advanced-service-impl");
var assembly_gateway_1 = require("./assembly.gateway");
var prisma_client_manager_1 = require("../prisma/prisma-client-manager");
var prisma_service_1 = require("../prisma/prisma.service");
var activity_logger_1 = require("../lib/logging/activity-logger");
var websocket_service_1 = require("../communications/websocket.service");
var digital_signature_service_1 = require("../common/services/digital-signature.service");
var AssemblyModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            controllers: [assembly_controller_1.AssemblyController],
            providers: [
                assembly_advanced_service_impl_1.AssemblyAdvancedService,
                assembly_gateway_1.AssemblyGateway,
                prisma_client_manager_1.PrismaClientManager,
                prisma_service_1.PrismaService,
                activity_logger_1.ActivityLogger,
                websocket_service_1.WebSocketService,
                digital_signature_service_1.DigitalSignatureService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AssemblyModule = _classThis = /** @class */ (function () {
        function AssemblyModule_1() {
        }
        return AssemblyModule_1;
    }());
    __setFunctionName(_classThis, "AssemblyModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AssemblyModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AssemblyModule = _classThis;
}();
exports.AssemblyModule = AssemblyModule;
