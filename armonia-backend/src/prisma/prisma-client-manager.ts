import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaClientManager {
  private clients: Map<string, PrismaClient> = new Map();

  constructor() {
    // Conectar el cliente de Prisma para el esquema por defecto (si aplica)
    // Esto es para asegurar que el cliente global se inicialice
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('DATABASE_URL is not defined in environment variables. PrismaClientManager might fail.');
    }
    const defaultClient = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
    this.clients.set('default', defaultClient);
    defaultClient.$connect().then(() => {
      console.log('PrismaClientManager: Connected to default DB.');
    }).catch((error) => {
      console.error('PrismaClientManager: Failed to connect to default DB:', error);
    });
  }

  getClient(schemaName: string): PrismaClient {
    if (schemaName === 'default') {
      return this.clients.get('default')!;
    }
    if (!this.clients.has(schemaName)) {
      const databaseUrl = process.env.DATABASE_URL; // Obtener la URL de la base de datos
      if (!databaseUrl) {
        throw new InternalServerErrorException('DATABASE_URL is not defined in environment variables.');
      }
      const client = new PrismaClient({
        datasources: {
          db: {
            url: databaseUrl,
          },
        },
      });
      this.clients.set(schemaName, client);
      // Conectar el cliente de Prisma inmediatamente
      client.$connect().then(() => {
        console.log(`PrismaClientManager: Connected to DB for schema ${schemaName}.`);
      }).catch((error) => {
        console.error(`PrismaClientManager: Failed to connect to DB for schema ${schemaName}:`, error);
        // No relanzar el error aquí, ya que esto es un manager
      });
    }
    return this.clients.get(schemaName)!;
  }

  async disconnectAll() {
    for (const client of this.clients.values()) {
      await client.$disconnect();
    }
    this.clients.clear();
    console.log('PrismaClientManager: All Prisma clients disconnected.');
  }
}