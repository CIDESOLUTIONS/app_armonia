import '@testing-library/jest-dom';
import 'whatwg-fetch';
import 'text-encoding';

// Mock PrismaClient
jest.mock("@prisma/client", () => {
  const mockPrisma = {
    // Add your Prisma client mock methods here
    // Example: user: { findMany: jest.fn() },
  };
  return {
    __esModule: true,
    PrismaClient: jest.fn(() => mockPrisma),
    // Mock any enums you use, e.g.:
    // PQRStatus: { OPEN: 'OPEN', CLOSED: 'CLOSED' },
    // NotificationChannel: { EMAIL: 'EMAIL', SMS: 'SMS' },
  };
});

// Mock Prisma client functions from @/lib/prisma
jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  getTenantPrismaClient: jest.fn(() => require('./src/__mocks__/prisma').mockPrisma),
  getPublicPrismaClient: jest.fn(() => require('./src/__mocks__/prisma').mockPrisma),
}));

// Mock Date.now() if needed for consistent test results
// For example, if you use Date.now() in your code and need it to return a fixed value
// jest.spyOn(Date, 'now').mockReturnValue(new Date('2025-01-01T00:00:00Z').getTime());
