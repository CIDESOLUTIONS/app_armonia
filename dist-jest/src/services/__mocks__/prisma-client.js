/**
 * Mock de Prisma Client para pruebas unitarias y de integración
 * Proporciona enums y constantes compatibles con los servicios
 */
// Importar enums y constantes desde nuestros mocks centralizados
import { PQRCategory, PQRStatus, PQRPriority, PQRType } from './pqr-constants';
// Exportar enums para que sean accesibles como si vinieran de @prisma/client
export { PQRCategory, PQRStatus, PQRPriority, PQRType };
// Mock básico de PrismaClient
export class PrismaClient {
    constructor(options = {}) {
        // Mock de modelos comunes
        this.pQR = {
            findUnique: jest.fn().mockResolvedValue(null),
            findMany: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            delete: jest.fn().mockResolvedValue({})
        };
        this.user = {
            findUnique: jest.fn().mockResolvedValue(null),
            findMany: jest.fn().mockResolvedValue([])
        };
        this.pQRNotification = {
            create: jest.fn().mockResolvedValue({})
        };
        // No hacer nada en el constructor para pruebas
    }
    // Mock de métodos comunes
    $connect() {
        return Promise.resolve();
    }
    $disconnect() {
        return Promise.resolve();
    }
    $queryRaw() {
        return Promise.resolve([]);
    }
}
// Exportar la clase como default
export default PrismaClient;
