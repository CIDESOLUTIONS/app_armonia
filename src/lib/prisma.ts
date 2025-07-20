import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;

export const getPrisma = (tenantId?: string) => {
  if (!tenantId) return prisma;

  const databaseUrl = process.env.DATABASE_URL.replace("public", tenantId);
  return new PrismaClient({ datasources: { db: { url: databaseUrl } } });
};
