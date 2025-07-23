import 'reflect-metadata';
import "@testing-library/jest-dom";
import "whatwg-fetch";
import "text-encoding";
import { vi } from "vitest";
import {
  mockPrisma,
  PQRStatus,
  NotificationChannel,
} from "./src/__mocks__/prisma";

// Mock PrismaClient
vi.mock("@prisma/client", () => {
  return {
    __esModule: true,
    PrismaClient: vi.fn(() => mockPrisma),
    PQRStatus: PQRStatus,
    NotificationChannel: NotificationChannel,
  };
});

// Mock Prisma client functions from @/lib/prisma
vi.mock("@/lib/prisma", () => ({
  __esModule: true,
  getTenantPrismaClient: vi.fn(() => mockPrisma),
  getPublicPrismaClient: vi.fn(() => mockPrisma),
}));

// Mock @/lib/api
vi.mock("@/lib/api", () => ({
  __esModule: true,
  fetchApi: vi.fn(),
}));

// Mock Date.now() if needed for consistent test results
// For example, if you use Date.now() in your code and need it to return a fixed value
// vi.spyOn(Date, 'now').mockReturnValue(new Date('2025-01-01T00:00:00Z').getTime());