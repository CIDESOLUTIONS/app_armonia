// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';
import { ServerLogger } from './logging/server-logger';

// Definir tipo para PrismaClient global
declare global {
  var prisma: PrismaClient | undefined;
  var prismaClientsMap: Map<string, PrismaClient> | undefined;
}

// Evitar instancias múltiples de Prisma Client en desarrollo por HMR
if (!global.prisma) {
  global.prisma = new PrismaClient();
  ServerLogger.info('Prisma Client global inicializado');
}

if (!global.prismaClientsMap) {
  global.prismaClientsMap = new Map<string, PrismaClient>();
  ServerLogger.info('Mapa de clientes Prisma inicializado');
}

// Cliente global de Prisma
export const prisma = global.prisma;

/**
 * Obtiene una instancia de PrismaClient para un schema específico
 * 
 * @param schema Nombre del schema de la base de datos
 * @returns Instancia de PrismaClient configurada para el schema
 */
export function getPrisma(schema?: string): PrismaClient {
  // Si no se especifica schema, usar cliente global
  if (!schema) {
    return prisma!;
  }
  
  try {
    // Si ya existe un cliente para este schema, devolverlo
    if (global.prismaClientsMap.has(schema)) {
      return global.prismaClientsMap.get(schema)!;
    }
    
    // Crear una nueva instancia para este schema
    const clientForSchema = new PrismaClient({
      datasources: {
        db: {
          url: `${process.env.DATABASE_URL}?schema=${schema}`
        }
      }
    });
    
    // Almacenar en el mapa para su reutilización
    global.prismaClientsMap.set(schema, clientForSchema);
    ServerLogger.info(`Nuevo cliente Prisma creado para schema: ${schema}`);
    
    return clientForSchema;
  } catch (error) {
    ServerLogger.error(`Error al crear cliente Prisma para schema ${schema}:`, error);
    // En caso de error, devolver el cliente global como fallback
    return prisma!;
  }
}

/**
 * Limpia los clientes Prisma cuando ya no son necesarios
 * Útil para liberar recursos después de una operación
 */
export async function cleanupPrismaClients(): Promise<void> {
  try {
    // Desconectar los clientes por schema
    for (const [schema, client] of global.prismaClientsMap.entries()) {
      await client.$disconnect();
      ServerLogger.info(`Cliente Prisma desconectado para schema: ${schema}`);
    }
    
    // Limpiar el mapa
    global.prismaClientsMap.clear();
    ServerLogger.info('Mapa de clientes Prisma limpiado');
  } catch (error) {
    ServerLogger.error('Error al limpiar clientes Prisma:', error);
  }
}