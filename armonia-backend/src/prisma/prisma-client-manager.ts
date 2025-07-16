import { PrismaClient } from '@prisma/client';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class PrismaClientManager {
  private clients: Map<string, PrismaClient> = new Map();

  getClient(schemaName: string): PrismaClient {
    if (!this.clients.has(schemaName)) {
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        throw new InternalServerErrorException(
          'DATABASE_URL environment variable is not set.',
        );
      }
      const prisma = new PrismaClient({
        datasources: {
          db: { url: `${databaseUrl}?schema=${schemaName}` },
        },
      });
      this.clients.set(schemaName, prisma);
    }
    const client = this.clients.get(schemaName);
    if (!client) {
      // Esto no debería ocurrir si el has(schemaName) es verdadero, pero es una salvaguarda
      throw new InternalServerErrorException(
        `PrismaClient for schema ${schemaName} could not be retrieved.`,
      );
    }
    return client;
  }

  async disconnectAll() {
    for (const client of this.clients.values()) {
      await client.$disconnect();
    }
    this.clients.clear();
  }
}
