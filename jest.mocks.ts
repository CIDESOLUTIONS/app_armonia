import "@testing-library/jest-dom";

// Importar el helper de mock de Prisma
// Crear un mock simple para PrismaClient
const mockPrismaClient = {
  pQR: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  pQRNotification: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  assembly: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
  commonArea: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  availabilityConfig: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  reservationRule: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  reservation: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  reservationNotification: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  bill: {
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
  payment: {
    create: jest.fn(),
  },
  residentialComplex: {
    findUnique: jest.fn(),
  },
  fee: {
    findMany: jest.fn(),
  },
  property: {
    findMany: jest.fn(),
  },
  expense: {
    findMany: jest.fn(),
  },
};

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
