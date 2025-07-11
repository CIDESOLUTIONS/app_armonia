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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
// src/services/service/common-service.service.ts
import { injectable } from 'tsyringe';
import { CommonServiceModel } from '../../models/service/common-service.model';
import { NotFoundError, ValidationError } from '../../utils/errors';
let CommonServiceService = (() => {
    let _classDecorators = [injectable()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var CommonServiceService = _classThis = class {
        createService(data, userId, complexId) {
            return __awaiter(this, void 0, void 0, function* () {
                const existingService = yield CommonServiceModel.findOne({
                    name: data.name,
                    residentialComplex: complexId
                });
                if (existingService) {
                    throw new ValidationError('Ya existe un servicio con este nombre');
                }
                const service = new CommonServiceModel(Object.assign(Object.assign({}, data), { residentialComplex: complexId, createdBy: userId }));
                yield service.save();
                return service;
            });
        }
        getService(id, complexId) {
            return __awaiter(this, void 0, void 0, function* () {
                const service = yield CommonServiceModel.findOne({
                    _id: id,
                    residentialComplex: complexId
                });
                if (!service) {
                    throw new NotFoundError('Servicio no encontrado');
                }
                return service;
            });
        }
        updateService(id, data, complexId) {
            return __awaiter(this, void 0, void 0, function* () {
                if (data.name) {
                    const existingService = yield CommonServiceModel.findOne({
                        name: data.name,
                        residentialComplex: complexId,
                        _id: { $ne: id }
                    });
                    if (existingService) {
                        throw new ValidationError('Ya existe un servicio con este nombre');
                    }
                }
                const service = yield CommonServiceModel.findOneAndUpdate({
                    _id: id,
                    residentialComplex: complexId
                }, data, { new: true });
                if (!service) {
                    throw new NotFoundError('Servicio no encontrado');
                }
                return service;
            });
        }
        deleteService(id, complexId) {
            return __awaiter(this, void 0, void 0, function* () {
                const _result = yield CommonServiceModel.deleteOne({
                    _id: id,
                    residentialComplex: complexId
                });
                if (result.deletedCount === 0) {
                    throw new NotFoundError('Servicio no encontrado');
                }
            });
        }
        getServices(complexId_1) {
            return __awaiter(this, arguments, void 0, function* (complexId, onlyEnabled = false) {
                const query = Object.assign({ residentialComplex: complexId }, (onlyEnabled ? { isEnabled: true } : {}));
                return CommonServiceModel.find(query).sort({ name: 1 });
            });
        }
        toggleServiceStatus(id, complexId) {
            return __awaiter(this, void 0, void 0, function* () {
                const service = yield this.getService(id, complexId);
                service.isEnabled = !service.isEnabled;
                yield service.save();
                return service;
            });
        }
    };
    __setFunctionName(_classThis, "CommonServiceService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CommonServiceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CommonServiceService = _classThis;
})();
export { CommonServiceService };
