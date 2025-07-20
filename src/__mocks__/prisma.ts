import { PrismaClient } from "@prisma/client";
import { vi } from "vitest";

export const mockPrisma: Partial<PrismaClient> = {
  $queryRaw: vi.fn(),
  pQR: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  residentialComplex: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  assembly: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  assemblyAttendance: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  unit: {
    findUnique: vi.fn(),
    findMany: vi.fn(),
  },
  assemblyVote: {
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  assemblyVoteRecord: {
    findFirst: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
  },
  panicAlert: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
  },
  package: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    findMany: vi.fn(),
  },
  preRegisteredVisitor: {
    findFirst: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    create: vi.fn(),
  },
  accessPass: {
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  fee: {
    aggregate: vi.fn(),
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    createMany: vi.fn(),
  },
  payment: {
    aggregate: vi.fn(),
    findMany: vi.fn(),
    create: vi.fn(),
  },
  budget: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    aggregate: vi.fn(),
  },
  expense: {
    aggregate: vi.fn(),
  },
  commonArea: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  reservation: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  listing: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  reportedListing: {
    create: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
  },
  category: {
    findMany: vi.fn(),
  },
  incident: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  incidentUpdate: {
    create: vi.fn(),
  },
  incidentAttachment: {
    create: vi.fn(),
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
