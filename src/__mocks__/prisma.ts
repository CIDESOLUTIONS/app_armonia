import { PrismaClient } from "@prisma/client";

export const mockPrisma: Partial<PrismaClient> = {
  $queryRaw: jest.fn(),
  pQR: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
  pQRNotification: {
    create: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
    findMany: jest.fn(),
  },
  userNotificationPreference: {
    findUnique: jest.fn(),
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

export enum PQRStatus {
  OPEN = "OPEN",
  CATEGORIZED = "CATEGORIZED",
  ASSIGNED = "ASSIGNED",
  IN_PROGRESS = "IN_PROGRESS",
  WAITING = "WAITING",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  REOPENED = "REOPENED",
  CANCELLED = "CANCELLED",
}

export enum NotificationChannel {
  WHATSAPP = "WHATSAPP",
  TELEGRAM = "TELEGRAM",
  SMS = "SMS",
  EMAIL = "EMAIL",
  APP = "APP",
}
