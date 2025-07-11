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
export function getDashboardStats() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stats = yield fetchApi('/api/dashboard/stats');
            return stats;
        }
        catch (error) {
            console.error('Error fetching dashboard stats:', error);
            return {
                totalProperties: 0,
                totalResidents: 0,
                pendingPayments: 0,
                totalRevenue: 0,
                upcomingAssemblies: 0,
                pendingPQRs: 0,
                resolvedPQRs: 0,
                commonAreaUsage: 0,
                budgetExecution: 0,
                activeProjects: 0,
                revenueTrend: [],
                commonAreaUsageTrend: [],
            };
        }
    });
}
export function getRecentActivity() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const activity = yield fetchApi('/api/dashboard/activity');
            return activity;
        }
        catch (error) {
            console.error('Error fetching recent activity:', error);
            return [];
        }
    });
}
export function getUpcomingEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetchApi('/api/dashboard/upcoming-events');
            return response.events;
        }
        catch (error) {
            console.error('Error fetching upcoming events:', error);
            return [];
        }
    });
}
