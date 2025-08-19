import 'reflect-metadata';

// Global setup for database connection for all test suites
import { PrismaClient } from '@prisma/client';

// Mocks for external services
jest.mock('firebase-admin', () => ({
  credential: {
    cert: jest.fn(),
  },
  initializeApp: jest.fn(),
}));

jest.mock('twilio', () => {
  return jest.fn().mockImplementation(() => {
    return {
      messages: {
        create: jest.fn().mockResolvedValue({ sid: 'mock_sid' }),
      },
    };
  });
});

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/lib-storage');


/*
// Database connection setup
const prisma = new PrismaClient();

beforeAll(async () => {
  try {
    await prisma.$connect();
    console.log('Database connection successful for test suite.');
  } catch (error) {
    console.error('Database connection failed for test suite.', error);
    throw error;
  }
}, 30000); // 30-second timeout for the connection

afterAll(async () => {
  await prisma.$disconnect();
  console.log('Database connection closed for test suite.');
});
*/

// Mock PrismaService for all unit tests
import { createPrismaClientMock } from '../../src/__mocks__/prisma-mock-helper';
import { PrismaService } from '../src/prisma/prisma.service';

// Create a reusable mock instance
const mockPrismaClient = createPrismaClientMock();

// Mock the PrismaService implementation
jest.mock('../src/prisma/prisma.service.ts', () => ({
  __esModule: true,
  PrismaService: jest.fn().mockImplementation(() => ({
    getTenantDB: jest.fn().mockReturnValue(mockPrismaClient),
  })),
}));
