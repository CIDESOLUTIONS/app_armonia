var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getPrisma } from '@/lib/prisma'; // Asumiendo que getPrisma devuelve una instancia de PrismaClient
import { ServerLogger } from '../logging/server-logger'; // Asumiendo que existe
const prisma = getPrisma();
const logger = new ServerLogger('ThemeService');
const PREDEFINED_THEMES = {
    light: {
        id: 'light',
        name: 'Claro',
        colors: {
            primary: '#3B82F6', secondary: '#10B981', accent: '#8B5CF6',
            background: '#FFFFFF', surface: '#F9FAFB', text: '#1F2937',
            textSecondary: '#6B7280', border: '#E5E7EB', error: '#EF4444',
            warning: '#F59E0B', success: '#10B981', info: '#3B82F6'
        },
        isDark: false
    },
    dark: {
        id: 'dark',
        name: 'Oscuro',
        colors: {
            primary: '#60A5FA', secondary: '#34D399', accent: '#A78BFA',
            background: '#111827', surface: '#1F2937', text: '#F9FAFB',
            textSecondary: '#D1D5DB', border: '#374151', error: '#F87171',
            warning: '#FBBF24', success: '#34D399', info: '#60A5FA'
        },
        isDark: true
    },
};
class ThemeService {
    constructor() {
        this.defaultTheme = 'light';
        logger.info('ThemeService initialized');
    }
    getPredefinedThemes() {
        return PREDEFINED_THEMES;
    }
    getUserTheme(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userPreference = yield prisma.userPreference.findFirst({
                    where: { userId, key: 'theme' }
                });
                if ((userPreference === null || userPreference === void 0 ? void 0 : userPreference.value) && PREDEFINED_THEMES[userPreference.value]) {
                    return PREDEFINED_THEMES[userPreference.value];
                }
            }
            catch (error) {
                logger.error(`Error getting user theme: ${error.message}`, { userId });
            }
            return PREDEFINED_THEMES[this.defaultTheme];
        });
    }
    setUserTheme(userId, themeId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!PREDEFINED_THEMES[themeId]) {
                    throw new Error(`Theme ${themeId} not found`);
                }
                yield prisma.userPreference.upsert({
                    where: { userId_key: { userId, key: 'theme' } },
                    update: { value: themeId },
                    create: { userId, key: 'theme', value: themeId }
                });
                logger.info(`User theme set: ${userId} -> ${themeId}`);
                return true;
            }
            catch (error) {
                logger.error(`Error setting user theme: ${error.message}`, { userId, themeId });
                return false;
            }
        });
    }
}
export const themeService = new ThemeService();
