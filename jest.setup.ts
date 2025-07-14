import "reflect-metadata";
import "@testing-library/jest-dom";
import { Request, Response } from "node-fetch";
import { PrismaClient } from "@prisma/client";

// Polyfill for TextEncoder and TextDecoder
import { TextEncoder, TextDecoder } from "util";

if (typeof global !== "undefined") {
  if (typeof global.TextEncoder === "undefined") {
    global.TextEncoder = TextEncoder;
  }
  if (typeof global.TextDecoder === "undefined") {
    global.TextDecoder = TextDecoder;
  }
}

// Polyfill for Request and Response in JSDOM environment
if (typeof global !== "undefined" && !global.Request) {
  global.Request = Request;
}
if (typeof global !== "undefined" && !global.Response) {
  global.Response = Response;
}

// Mock global para PrismaClient
const mockPrismaClient = {
  // Añade aquí todos los modelos y sus métodos que uses en tus tests
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  residentialComplex: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  pQR: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
    groupBy: jest.fn(),
  },
  pQRSettings: {
    findFirst: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  pQRAssignmentRule: {
    findMany: jest.fn(),
  },
  pQRTeam: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  pQRSLA: {
    findFirst: jest.fn(),
  },
  pQRStatusHistory: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  pQRNotification: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
  camera: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  property: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  fee: {
    findMany: jest.fn(),
  },
  bill: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  payment: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  paymentSettings: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
  paymentGateway: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
  },
  paymentMethod: {
    findFirst: jest.fn(),
  },
  transaction: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
  reservation: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  // Añade otros modelos y métodos que necesites mockear
  $queryRaw: jest.fn(),
  $transaction: jest.fn((cb) => cb(mockPrismaClient)),
} as unknown as PrismaClient; // Cast to PrismaClient

// Mock the @/lib/prisma module
jest.mock("@/lib/prisma", () => ({
  getPrisma: jest.fn(() => mockPrismaClient),
  getPublicPrismaClient: jest.fn(() => mockPrismaClient),
  getTenantPrismaClient: jest.fn(() => mockPrismaClient),
}));

// Mock global para PrismaClient (para tests que lo importen directamente)
jest.mock("@prisma/client", () => ({
  __esModule: true,
  ...jest.requireActual("@prisma/client"),
  PrismaClient: jest.fn(() => mockPrismaClient),
  // Exporta los enums de Prisma si son usados directamente en los tests
  // Por ejemplo, si usas PQRStatus.OPEN directamente en un test
  PQRStatus: {
    OPEN: "OPEN",
    CATEGORIZED: "CATEGORIZED",
    ASSIGNED: "ASSIGNED",
    IN_PROGRESS: "IN_PROGRESS",
    WAITING: "WAITING",
    RESOLVED: "RESOLVED",
    CLOSED: "CLOSED",
    REOPENED: "REOPENED",
    CANCELLED: "CANCELLED",
  },
  PQRCategory: {
    MAINTENANCE: "MAINTENANCE",
    SECURITY: "SECURITY",
    ADMINISTRATION: "ADMINISTRATION",
    PAYMENTS: "PAYMENTS",
    NEIGHBORS: "NEIGHBORS",
    SERVICES: "SERVICES",
    OTHER: "OTHER",
  },
  PQRPriority: {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH",
    CRITICAL: "CRITICAL",
  },
  // Añade otros enums si son necesarios
}));
