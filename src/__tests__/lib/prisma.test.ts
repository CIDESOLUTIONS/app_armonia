import { PrismaClient } from "@prisma/client";
import { getPublicPrismaClient, getTenantPrismaClient } from "@/lib/prisma";

describe("Prisma Client Configuration", () => {
  let MockPrismaClient: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();

    // Mock the PrismaClient constructor
    MockPrismaClient = jest.fn(function (this: any, options?: any) {
      this.$disconnect = jest.fn();
      // Store options to assert against them later
      this.options = options;
    });

    // Mock the @prisma/client module to export our mock class
    jest.doMock("@prisma/client", () => ({
      PrismaClient: MockPrismaClient,
    }));

    // Clear the cache for tenantPrismaInstances to ensure fresh instances
    // This is a bit of a hack, but necessary for testing the caching logic
    // In a real scenario, you might not test the internal cache directly
    (getTenantPrismaClient as any).__clearCache__ && (getTenantPrismaClient as any).__clearCache__();

    // Set a dummy DATABASE_URL for testing
    process.env.DATABASE_URL = "postgresql://user:password@host:port/database";
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.DATABASE_URL;
  });

  test("getPublicPrismaClient should return a PrismaClient instance", () => {
    const prismaInstance = getPublicPrismaClient();
    expect(prismaInstance).toBeInstanceOf(MockPrismaClient);
    expect(MockPrismaClient).toHaveBeenCalledTimes(1);
    expect(MockPrismaClient).toHaveBeenCalledWith(undefined); // No specific options for public
  });

  test("getTenantPrismaClient should return a new PrismaClient instance for a new schema", () => {
    const schemaName = "tenant_cj1234";
    const prismaInstance = getTenantPrismaClient(schemaName);

    expect(prismaInstance).toBeInstanceOf(MockPrismaClient);
    expect(MockPrismaClient).toHaveBeenCalledTimes(1);
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
    const prismaInstance1 = getTenantPrismaClient(schemaName);
    const prismaInstance2 = getTenantPrismaClient(schemaName);

    expect(prismaInstance1).toBe(prismaInstance2);
    expect(MockPrismaClient).toHaveBeenCalledTimes(1); // Should only be called once for this schema
  });

  test("getTenantPrismaClient should throw error if schemaName is not provided", () => {
    expect(() => getTenantPrismaClient("")).toThrow("Schema name is required to get a tenant Prisma client.");
    expect(() => getTenantPrismaClient(null as any)).toThrow("Schema name is required to get a tenant Prisma client.");
    expect(() => getTenantPrismaClient(undefined as any)).toThrow("Schema name is required to get a tenant Prisma client.");
  });
});