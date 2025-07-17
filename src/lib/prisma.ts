import { PrismaClient } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// 1. Instancia de Prisma para el esquema público (armonia)
// Inicialización perezosa para evitar problemas en Edge Runtime
let publicPrisma: PrismaClient;

function getOrCreatePublicPrisma(): PrismaClient {
  if (!publicPrisma) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL environment variable is not set.");
    }
    publicPrisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }
  return publicPrisma;
}

// 2. Caché para las instancias de Prisma de los tenants
const tenantPrismaInstances: Record<string, PrismaClient> = {};

/**
 * Obtiene una instancia de PrismaClient conectada al esquema de un tenant específico.
 * Crea y cachea una nueva instancia si no existe para el tenant solicitado.
 *
 * @param schemaName El nombre del esquema del tenant (ej. "tenant_cj0001").
 * @returns Una instancia de PrismaClient configurada para el tenant.
 */
export function getTenantPrismaClient(schemaName: string): PrismaClient {
  if (!schemaName) {
    throw new Error("Schema name is required to get a tenant Prisma client.");
  }

  if (tenantPrismaInstances[schemaName]) {
    return tenantPrismaInstances[schemaName];
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }

  const newTenantPrisma = new PrismaClient({
    datasources: {
      db: {
        url: `${databaseUrl}?schema=${schemaName}`,
      },
    },
  });

  tenantPrismaInstances[schemaName] = newTenantPrisma;
  return newTenantPrisma;
}

/**
 * Devuelve la instancia de Prisma para el esquema público.
 *
 * @returns La instancia de PrismaClient para el esquema 'armonia'.
 */
export function getPublicPrismaClient(): PrismaClient {
  return getOrCreatePublicPrisma();
}

/**
 * Extrae el schemaName del token JWT de una solicitud.
 * @param req Objeto de la solicitud (Request).
 * @returns El schemaName o null si no se encuentra o el token es inválido.
 */
export function getTenantSchemaFromToken(req: Request): string | null {
  const tokenCookie = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c) => c.startsWith("token="));
  if (!tokenCookie) {
    return null;
  }

  const token = tokenCookie.split("=")[1];
  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, JWT_SECRET) as { schemaName?: string };
    return decoded.schemaName || null;
  } catch (error) {
    console.error("Invalid JWT:", error);
    return null;
  }
}
