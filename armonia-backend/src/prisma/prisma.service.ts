import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  private readonly clients: Map<string, PrismaClient> = new Map();

  public getTenantDB(schemaName: string): PrismaClient {
    if (!schemaName) {
      throw new Error('Schema name must be provided');
    }

    let client = this.clients.get(schemaName);

    if (!client) {
      const databaseUrl = `${process.env.DATABASE_URL}?schema=${schemaName}`;
      client = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });
      this.clients.set(schemaName, client);
    }

    return client;
  }

  async onModuleDestroy() {
    for (const client of this.clients.values()) {
      await client.$disconnect();
    }
  }
}
