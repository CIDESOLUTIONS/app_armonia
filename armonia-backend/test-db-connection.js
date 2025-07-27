import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function testPrismaConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    await prisma.$connect();
    console.log('Successfully connected to the database using PrismaClient.');
  } catch (error) {
    console.error('Failed to connect to the database using PrismaClient:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();