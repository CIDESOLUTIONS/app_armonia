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
const logger = new ServerLogger('BiometricService');
const rpName = 'Armonía';
const rpID = process.env.NODE_ENV === 'production'
    ? process.env.WEBAUTHN_RP_ID
    : 'localhost';
const origin = process.env.NODE_ENV === 'production'
    ? `https://${rpID}`
    : `http://localhost:3000`;
export class BiometricService {
    constructor({ db, logger: customLogger, notificationService }) {
        this.db = db;
        this.logger = customLogger || logger;
        this.notificationService = notificationService;
    }
    generateRegistrationOptions(user, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementación con tipos...
        });
    }
    verifyAndSaveRegistration(user, credential, deviceName) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementación con tipos...
            return { success: true };
        });
    }
    generateAuthenticationOptions(user) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementación con tipos...
        });
    }
    verifyAuthentication(user, credential) {
        return __awaiter(this, void 0, void 0, function* () {
            // Implementación con tipos...
            return { success: true };
        });
    }
}
