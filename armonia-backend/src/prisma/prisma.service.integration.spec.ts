import { PrismaService } from './prisma.service';
import * as fs from 'fs';
import * as path from 'path';

describe('PrismaService Integration Test', () => {
  let prismaService: PrismaService;

  beforeAll(() => {
    prismaService = new PrismaService();
  });

  it('should connect to the database and fetch plans using a direct URL', async () => {
    let prismaClient;
    try {
      // Manually read and parse the .env file
      const envPath = path.resolve(__dirname, '../../../.env');
      const envFileContent = fs.readFileSync(envPath, 'utf-8');
      const dbUrlLine = envFileContent.split('\n').find(line => line.startsWith('DATABASE_URL='));
      const rawDbUrl = dbUrlLine?.split('=')[1].replace(/"/g, '');

      if (!rawDbUrl) {
        throw new Error('DATABASE_URL not found in .env file');
      }

      const schemaName = 'public';
      const fullDbUrl = `${rawDbUrl}?schema=${schemaName}`;
      
      // Use the new test-specific method to get the client
      prismaClient = prismaService.getTenantDBForTest(fullDbUrl);

      // Attempt to connect and perform a query
      const plans = await prismaClient.plan.findMany();

      expect(Array.isArray(plans)).toBe(true);
      console.log(`Successfully connected to schema '${schemaName}' and found ${plans.length} plans.`);

    } catch (error) {
      console.error('Database integration test failed:', error);
      throw error;
    } finally {
      if (prismaClient) {
        await prismaClient.$disconnect();
      }
    }
  }, 30000);
});