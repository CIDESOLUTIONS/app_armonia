// Mock de NotificationService para pruebas
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class NotificationService {
    constructor(schema) {
        this.schema = schema || 'public';
    }
    sendNotification(options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Sending notification to ${options.userId} in schema ${this.schema}`);
            return {
                success: true,
                id: `mock_notification_${Date.now()}`,
                sentAt: new Date().toISOString()
            };
        });
    }
    sendBulkNotification(userIds, options) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Sending bulk notification to ${userIds.length} users in schema ${this.schema}`);
            return {
                success: true,
                total: userIds.length,
                sent: userIds.length,
                failed: 0
            };
        });
    }
    sendMonitoringAlert(alert) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Sending monitoring alert: ${alert.message}`);
            return {
                success: true,
                id: `mock_alert_${Date.now()}`,
                sentAt: new Date().toISOString()
            };
        });
    }
    logNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign(Object.assign({ id: Math.floor(Math.random() * 1000) }, data), { createdAt: new Date().toISOString() });
        });
    }
}
