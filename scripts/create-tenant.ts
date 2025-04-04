import { prisma } from '../src/lib/manual-prisma-client';
import { execSync } from 'child_process';

async function createTenant(name: string, schemaName: string) {
  try {
    prisma.setTenantSchema('public');

    // Verificar si el tenant ya existe usando $queryRawUnsafe
    const existingTenant = await prisma.$queryRawUnsafe(
      `SELECT * FROM "public"."Tenant" WHERE name = $1 LIMIT 1`,
      name
    );
    if (Array.isArray(existingTenant) && existingTenant.length > 0) {
      console.log(`Tenant ${name} ya existe en public:`, existingTenant);
      return;
    }

    // Crear el tenant en el schema public
    const newTenant = await prisma.$executeRawUnsafe(
      `INSERT INTO "public"."Tenant" (name, "schemaName", "createdAt") VALUES ($1, $2, NOW()) RETURNING *`,
      name,
      schemaName
    );
    console.log('Tenant creado en public:', newTenant);

    // Crear el schema y copiar tablas
    execSync(`psql -U postgres -d armonia -c "CREATE SCHEMA IF NOT EXISTS ${schemaName}"`, { stdio: 'inherit' });

    const tables = [
      'Tenant', 'ResidentialComplex', 'Property', 'User', 'Assembly', 'Attendance', 'Budget',
      'Document', 'Fee', 'PQR', 'Payment', 'Post', 'Resident', 'Service', 'Staff', 'Vote', 'VotingQuestion'
    ];
    for (const table of tables) {
      execSync(
        `psql -U postgres -d armonia -c "CREATE TABLE ${schemaName}.\\\"${table}\\\" (LIKE public.\\\"${table}\\\" INCLUDING ALL);"`,
        { stdio: 'inherit' }
      );
    }

    console.log(`Schema ${schemaName} creado y tablas copiadas`);
  } catch (error) {
    console.error(`Error al crear el tenant ${name}:`, error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function setupTenants() {
  const tenants = [
    { name: 'Conjunto Uno', schemaName: 'tenant_conjunto1' },
    { name: 'Conjunto Dos', schemaName: 'tenant_conjunto2' },
    { name: 'Conjunto Tres', schemaName: 'tenant_conjunto3' },
    { name: 'Conjunto Cuatro', schemaName: 'tenant_conjunto4' },
  ];

  for (const { name, schemaName } of tenants) {
    await createTenant(name, schemaName);
  }
  console.log('Todos los tenants procesados exitosamente');
}

setupTenants().catch((err) => console.error('Error en la creación de tenants:', err));