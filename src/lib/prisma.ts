import { PrismaClient } from "../../../armonia-backend/node_modules/.prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
  prisma = global.prisma;
}

export default prisma;

export const getPrisma = (tenantId?: string) => {
  if (!tenantId) return prisma;

  const databaseUrl = process.env.DATABASE_URL?.replace("public", tenantId);
  return new PrismaClient({ 
    datasources: { 
      db: { 
        url: databaseUrl 
      } 
    } 
  });
};

export const getPublicPrismaClient = () => {
  return prisma;
};

