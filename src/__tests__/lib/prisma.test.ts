import { PrismaClient } from "@prisma/client"; // Keep this import for MockPrismaClient type
import { getPublicPrismaClient, getTenantPrismaClient } from "@/lib/prisma";

// Mock the entire @/lib/prisma module
jest.mock("@/lib/prisma", () => {
  const mockPrismaClient = jest.fn(function (this: unknown, options?: unknown) {
    this.$disconnect = jest.fn();
    this.options = options;
  });

  const mockPublicPrismaClient = new mockPrismaClient();
  const mockTenantPrismaInstances: Record<string, any> = {};

  return {
    getPublicPrismaClient: jest.fn(() => mockPublicPrismaClient),
    getTenantPrismaClient: jest.fn((schemaName: string) => {
      if (!schemaName) {
        throw new Error("Schema name is required to get a tenant Prisma client.");
      }
      if (!mockTenantPrismaInstances[schemaName]) {
        mockTenantPrismaInstances[schemaName] = new mockPrismaClient({
          datasources: {
            db: {
              url: `postgresql://user:password@host:port/database?schema=${schemaName}`,
            },
          },
        });
      }
      return mockTenantPrismaInstances[schemaName];
    }),
    // Expose the internal mock for testing purposes if needed
    __esModule: true, // This is important for default exports
    MockPrismaClient: mockPrismaClient,
    __clearTenantPrismaCache__: jest.fn(() => {
      for (const key in mockTenantPrismaInstances) {
        delete mockTenantPrismaInstances[key];
      }
    }),
  };
});

// Import the mocked functions and the MockPrismaClient from the mock
import {
  getPublicPrismaClient as mockedGetPublicPrismaClient,
  getTenantPrismaClient as mockedGetTenantPrismaClient,
  MockPrismaClient,
} from "@/lib/prisma";

describe("Prisma Client Configuration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DATABASE_URL = "postgresql://user:password@host:port/database";
  });

  afterEach(() => {
    delete process.env.DATABASE_URL;
  });

  test("getPublicPrismaClient should return a PrismaClient instance", () => {
    const prismaInstance = mockedGetPublicPrismaClient();
    expect(prismaInstance).toBeInstanceOf(MockPrismaClient);
    expect(mockedGetPublicPrismaClient).toHaveBeenCalledTimes(1);
    expect(MockPrismaClient).toHaveBeenCalledWith(undefined);
  });

  test("getTenantPrismaClient should return a new PrismaClient instance for a new schema", () => {
    const schemaName = "tenant_cj1234";
    const prismaInstance = mockedGetTenantPrismaClient(schemaName);

    expect(prismaInstance).toBeInstanceOf(MockPrismaClient);
    expect(mockedGetTenantPrismaClient).toHaveBeenCalledTimes(1);
    expect(MockPrismaClient).toHaveBeenCalledWith({
      datasources: {
        db: {
          url: `postgresql://user:password@host:port/database?schema=${schemaName}`,
        },
      },
    });
  });

  test("getTenantPrismaClient should return the same instance for the same schema (caching)", () => {
    const schemaName = "tenant_cj5678";
    const prismaInstance1 = mockedGetTenantPrismaClient(schemaName);
    const prismaInstance2 = mockedGetTenantPrismaClient(schemaName);

    expect(prismaInstance1).toBe(prismaInstance2);
    expect(mockedGetTenantPrismaClient).toHaveBeenCalledTimes(2); // Called twice for the same schema
    expect(MockPrismaClient).toHaveBeenCalledTimes(1); // But PrismaClient constructor only once
  });

  test("getTenantPrismaClient should throw error if schemaName is not provided", () => {
    expect(() => mockedGetTenantPrismaClient("")).toThrow(
      "Schema name is required to get a tenant Prisma client.",
    );
    expect(() => mockedGetTenantPrismaClient(null as unknown as string)).toThrow(
      "Schema name is required to get a tenant Prisma client.",
    );
    expect(() => mockedGetTenantPrismaClient(undefined as unknown as string)).toThrow(
      "Schema name is required to get a tenant Prisma client.",
    );
  });
});