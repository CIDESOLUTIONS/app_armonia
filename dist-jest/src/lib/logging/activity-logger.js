/**
 * Mock para el módulo de logging
 *
 * Este archivo proporciona mocks para las funciones del módulo de logging
 * que son utilizadas por los servicios de PQR durante las pruebas.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Clase para registrar actividades en el sistema
 */
export class ActivityLogger {
    /**
     * Registra una actividad en el sistema
     * @param data Datos de la actividad a registrar
     * @returns Promesa que se resuelve cuando se ha registrado la actividad
     */
    static log(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // En pruebas, simplemente simulamos el registro
            console.log('Mock ActivityLogger.log called with:', data);
            return Promise.resolve();
        });
    }
}
