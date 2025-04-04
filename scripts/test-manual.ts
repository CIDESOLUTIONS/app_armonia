import { prisma } from '../src/lib/manual-prisma-client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

async function testTenant() {
  try {
    const newTenant = await prisma.manualTenant.create({
      data: {
        name: `Conjunto Manual ${Date.now()}`, // Nombre único con timestamp
        schemaName: `tenant_manual_${Date.now()}`,
      },
    });
    console.log('Tenant creado:', newTenant);

    const tenants = await prisma.manualTenant.findMany();
    console.log('Todos los tenants:', tenants);
  } catch (error: PrismaClientKnownRequestError | unknown) {
    console.error('Error:', error);
    // Verificar si es un error de Prisma con código P2010 y violación de unicidad (23505)
    if (
      error instanceof PrismaClientKnownRequestError &&
      error.code === 'P2010' &&
      (error.meta as { code?: string })?.code === '23505'
    ) {
      console.log('El Tenant ya existe, buscando registros existentes...');
      const tenants = await prisma.manualTenant.findMany();
      console.log('Tenants existentes:', tenants);
    }
  } finally {
    await prisma.$disconnect();
  }
}

testTenant();