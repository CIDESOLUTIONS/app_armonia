import "@testing-library/jest-dom";

// Importar el helper de mock de Prisma
import { createPrismaClientMock } from "./src/services/__mocks__/prisma-mock-helper";

// Crear un mock avanzado para PrismaClient
const mockPrismaClient = createPrismaClientMock({
  pQR: {
    findUnique: {
      id: 1,
      ticketNumber: "PQR-001",
      title: "Solicitud de prueba",
      description: "Descripción de prueba",
      status: "IN_PROGRESS",
      priority: "MEDIUM",
      category: "MAINTENANCE",
      userId: 1,
      assignedToId: 2,
      dueDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      closedAt: null,
      reopenedAt: null,
      reopenReason: null,
      tags: ["MAINTENANCE", "URGENT"],
    },
    findMany: [],
    groupBy: [],
    count: 0,
  },
  user: {
    findUnique: {
      id: 1,
      name: "Usuario de Prueba",
      email: "usuario@ejemplo.com",
      role: "RESIDENT",
      active: true,
    },
    findMany: [],
    count: 0,
  },
  pQRNotification: {},
  assembly: {
    findUnique: { id: 1, title: "Asamblea de Prueba", date: new Date() },
    findMany: [],
    create: { id: 1, title: "Nueva Asamblea", date: new Date() },
  },
});

// Configurar mock para Prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  prisma: mockPrismaClient,
  getPrisma: () => mockPrismaClient,
  getSchemaFromRequest: jest.fn(() => mockPrismaClient),
}));

// Configuración global para pruebas
global.mockPrismaClient = mockPrismaClient;

// Mock para constantes PQR
jest.mock("./src/lib/constants/pqr-constants", () => ({
  PQRCategory: {
    MAINTENANCE: "MAINTENANCE",
    SECURITY: "SECURITY",
    NOISE: "NOISE",
    PAYMENTS: "PAYMENTS",
    SERVICES: "SERVICES",
    COMMON_AREAS: "COMMON_AREAS",
    ADMINISTRATION: "ADMINISTRATION",
    NEIGHBORS: "NEIGHBORS",
    PETS: "PETS",
    PARKING: "PARKING",
    OTHER: "OTHER",
  },
  PQRStatus: {
    DRAFT: "DRAFT",
    SUBMITTED: "SUBMITTED",
    OPEN: "OPEN",
    IN_REVIEW: "IN_REVIEW",
    ASSIGNED: "ASSIGNED",
    IN_PROGRESS: "IN_PROGRESS",
    WAITING_INFO: "WAITING_INFO",
    RESOLVED: "RESOLVED",
    CLOSED: "CLOSED",
    CANCELLED: "CANCELLED",
    REOPENED: "REOPENED",
    REJECTED: "REJECTED",
  },
  PQRPriority: {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CRITICAL: "CRITICAL",
    URGENT: "URGENT",
  },
  PQRType: {
    PETITION: "PETITION",
    COMPLAINT: "COMPLAINT",
    CLAIM: "CLAIM",
    SUGGESTION: "SUGGESTION",
    REQUEST: "REQUEST",
    INQUIRY: "INQUIRY",
  },
  PQRChannel: {
    WEB: "WEB",
    MOBILE: "MOBILE",
    EMAIL: "EMAIL",
    PHONE: "PHONE",
    IN_PERSON: "IN_PERSON",
  },
  PQRNotificationTemplate: {
    CREATED: "PQR_CREATED",
    ASSIGNED: "PQR_ASSIGNED",
    STATUS_CHANGED: "PQR_STATUS_CHANGED",
    COMMENT_ADDED: "PQR_COMMENT_ADDED",
    RESOLVED: "PQR_RESOLVED",
    CLOSED: "PQR_CLOSED",
    REOPENED: "PQR_REOPENED",
    REMINDER: "PQR_REMINDER",
    ESCALATED: "PQR_ESCALATED",
  },
  PQRUserRole: {
    RESIDENT: "RESIDENT",
    ADMIN: "ADMIN",
    STAFF: "STAFF",
    MANAGER: "MANAGER",
    GUEST: "GUEST",
  },
}));

// Mocks para servicios de comunicación
jest.mock("./src/lib/communications/email-service", () => ({
  sendEmail: jest.fn().mockResolvedValue(true),
}));

jest.mock("./src/lib/communications/push-notification-service", () => ({
  sendPushNotification: jest.fn().mockResolvedValue(true),
}));

jest.mock("./src/lib/communications/sms-service", () => ({
  sendSMS: jest.fn().mockResolvedValue(true),
}));

jest.mock("./src/lib/communications/whatsapp-service", () => ({
  sendWhatsAppMessage: jest.fn().mockResolvedValue({ success: true }),
}));

console.log("Mocks avanzados cargados correctamente para pruebas");
