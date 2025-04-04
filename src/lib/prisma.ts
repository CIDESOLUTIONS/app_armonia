import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// Evitar instancias múltiples de Prisma Client en desarrollo por HMR
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };