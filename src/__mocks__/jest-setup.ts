/**
 * Configuración global para pruebas Jest
 * Establece mocks y utilidades comunes para todas las pruebas
 */

// Importar mocks de enums y constantes
import { PQRCategory, PQRStatus, PQRPriority, PQRType } from "./pqr-constants";
import { vi } from "vitest"; // Import vi

// Configurar mocks globales para módulos externos
vi.mock("@prisma/client", () => {
  return {
    PrismaClient: vi.fn().mockImplementation(() => ({
      $connect: vi.fn().mockResolvedValue({}),
      $disconnect: vi.fn().mockResolvedValue({}),
      $queryRaw: vi.fn().mockResolvedValue([]),
      pQR: {
        findUnique: vi.fn().mockResolvedValue(null),
        findMany: vi.fn().mockResolvedValue([]),
        create: vi.fn().mockResolvedValue({}),
        update: vi.fn().mockResolvedValue({}),
        delete: vi.fn().mockResolvedValue({}),
      },
      user: {
        findUnique: vi.fn().mockResolvedValue(null),
        findMany: vi.fn().mockResolvedValue([]),
      },
      pQRNotification: {
        create: vi.fn().mockResolvedValue({}),
      },
    })),
    // Exportar enums para que sean accesibles como si vinieran de @prisma/client
    PQRCategory,
    PQRStatus,
    PQRPriority,
    PQRType,
  };
});

// Mock de módulos de comunicación
vi.mock("../../lib/communications/email-service", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("../../lib/communications/push-notification-service", () => ({
  sendPushNotification: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("../../lib/communications/sms-service", () => ({
  sendSMS: vi.fn().mockResolvedValue({ success: true }),
}));

// Mock de utilidades
vi.mock("../../lib/prisma", () => ({
  getSchemaFromRequest: vi.fn().mockReturnValue({
    $connect: vi.fn().mockResolvedValue({}),
    $disconnect: vi.fn().mockResolvedValue({}),
    $queryRaw: vi.fn().mockResolvedValue([]),
    pQR: {
      findUnique: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
      update: vi.fn().mockResolvedValue({}),
      delete: vi.fn().mockResolvedValue({}),
    },
    user: {
      findUnique: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
    },
    pQRNotification: {
      create: vi.fn().mockResolvedValue({}),
    },
  }),
}));

// Configuración global para pruebas
global.beforeEach(() => {
  vi.clearAllMocks();
});

// Exportar enums y constantes para uso en pruebas
export { PQRCategory, PQRStatus, PQRPriority, PQRType };
