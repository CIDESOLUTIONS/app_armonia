// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

let prismaClientSingleton: PrismaClient | null = null;
let poolSingleton: { [key: string]: Pool } = {};

export function getPrismaClient() {
  if (!prismaClientSingleton) {
    prismaClientSingleton = new PrismaClient();
  }
  return prismaClientSingleton;
}

export function getPrisma(schema?: string) {
  if (!schema) {
    return getPrismaClient();
  }

  if (!poolSingleton[schema]) {
    poolSingleton[schema] = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return {
    $queryRawUnsafe: async (query: string, ...values: any[]) => {
      const client = await poolSingleton[schema].connect();
      try {
        await client.query(`SET search_path TO "${schema}"`);
        const result = await client.query(query, values);
        return result.rows;
      } finally {
        client.release();
      }
    },
    $executeRawUnsafe: async (query: string, ...values: any[]) => {
      const client = await poolSingleton[schema].connect();
      try {
        await client.query(`SET search_path TO "${schema}"`);
        const result = await client.query(query, values);
        return result;
      } finally {
        client.release();
      }
    },
  };
}

export function clearPrismaClient() {
  prismaClientSingleton = null;
}

export async function disconnectPrisma() {
  if (prismaClientSingleton) {
    await prismaClientSingleton.$disconnect();
  }
  
  for (const schema in poolSingleton) {
    await poolSingleton[schema].end();
  }
  poolSingleton = {};
}

// Opcional: Manejo de limpieza en desarrollo
if (process.env.NODE_ENV !== 'production') {
  if (typeof window === 'undefined') {
    if ((global as any).prisma) {
      (global as any).prisma.$disconnect();
    }
    (global as any).prisma = getPrismaClient();
  }
}