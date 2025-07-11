var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchApi } from '@/lib/api';
export function getResidentFinancialSummary() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/resident-financial');
            return response.summary;
        }
        catch (error) {
            console.error('Error fetching resident financial summary:', error);
            throw error;
        }
    });
}
export function getResidentPayments() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/resident-financial');
            return response.payments;
        }
        catch (error) {
            console.error('Error fetching resident payments:', error);
            throw error;
        }
    });
}
export function getResidentPendingFees() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/resident-financial');
            return response.pendingFees;
        }
        catch (error) {
            console.error('Error fetching resident pending fees:', error);
            throw error;
        }
    });
}
