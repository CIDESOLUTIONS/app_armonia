import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaClientManager {
  private clients: Map<string, PrismaClient> = new Map();

  getClient(schemaName: string): PrismaClient {
    if (!this.clients.has(schemaName)) {
      const prisma = new PrismaClient({
        datasources: {
          db: { url: process.env.DATABASE_URL + `?schema=${schemaName}` },
        },
      });
      this.clients.set(schemaName, prisma);
    }
    return this.clients.get(schemaName);
  }

  async disconnectAll() {
    for (const client of this.clients.values()) {
      await client.$disconnect();
    }
    this.clients.clear();
  }
}
