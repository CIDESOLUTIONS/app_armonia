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