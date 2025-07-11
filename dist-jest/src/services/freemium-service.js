var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ServerLogger } from '../logging/server-logger';
const logger = new ServerLogger('FreemiumService');
const PLANS = {
    BASIC: {
        maxUnits: 25,
        historyYears: 1,
        features: ['Gestión de propiedades y residentes', 'Funcionalidad básica de comunicaciones']
    },
    STANDARD: {
        maxUnits: 40,
        historyYears: 3,
        features: ['Todas las funcionalidades básicas', 'Gestión completa de asambleas y votaciones', 'Sistema de PQR avanzado']
    },
    PREMIUM: {
        maxUnits: 90,
        historyYears: 5,
        features: ['Todas las funcionalidades estándar', 'Módulo financiero avanzado', 'Personalización de la plataforma', 'API para integración', 'Soporte prioritario']
    }
};
export class FreemiumService {
    constructor(db) {
        this.db = db;
        logger.info('FreemiumService initialized');
    }
    getComplexPlan(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const complex = yield this.db.complex.findUnique({
                    where: { id: complexId },
                    select: { planType: true }
                });
                return (complex === null || complex === void 0 ? void 0 : complex.planType) || 'BASIC';
            }
            catch (error) {
                logger.error(`Error getting complex plan for ${complexId}: ${error.message}`);
                return 'BASIC'; // Default to basic on error
            }
        });
    }
    getPlanDetails(planType) {
        return PLANS[planType.toUpperCase()];
    }
    checkUnitLimit(complexId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const complex = yield this.db.complex.findUnique({
                    where: { id: complexId },
                    select: { planType: true, unitsCount: true }
                });
                if (!complex) {
                    throw new Error(`Complex with ID ${complexId} not found.`);
                }
                const planDetails = this.getPlanDetails(complex.planType);
                if (!planDetails) {
                    throw new Error(`Plan details not found for plan type: ${complex.planType}`);
                }
                const currentUnits = complex.unitsCount || 0; // Assuming unitsCount field exists
                const maxUnits = planDetails.maxUnits;
                return { withinLimit: currentUnits <= maxUnits, currentUnits, maxUnits };
            }
            catch (error) {
                logger.error(`Error checking unit limit for complex ${complexId}: ${error.message}`);
                return { withinLimit: false, currentUnits: 0, maxUnits: 0 }; // Assume not within limit on error
            }
        });
    }
}
