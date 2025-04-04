// src/app/api/register-complex/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      complexName, 
      totalUnits, 
      adminName, 
      adminEmail, 
      adminPassword, 
      adminPhone, 
      address, 
      city, 
      state, 
      country, 
      propertyTypes 
    } = body;

    // Validación de campos requeridos
    if (!complexName || !totalUnits || !adminName || !adminEmail || !adminPassword) {
      return NextResponse.json({ message: 'Faltan campos requeridos' }, { status: 400 });
    }

    const prisma = getPrisma(); // Usando el cliente para el esquema principal

    // Contar complejos existentes para generar schemaName
    const complexCountResult = await prisma.$queryRawUnsafe(
      `SELECT COUNT(*) as count FROM "armonia"."ResidentialComplex"`
    );
    const complexCount = Number(complexCountResult[0].count);
    const schemaName = `tenant_cj${String(complexCount + 1).padStart(4, '0')}`;
    console.log('[API Register-Complex] Conteo de complejos:', complexCountResult);

    // Crear el complejo residencial en el esquema 'armonia'
    const complex = await prisma.$queryRawUnsafe(
      `INSERT INTO "armonia"."ResidentialComplex" (
        name, "schemaName", "totalUnits", "adminEmail", "adminName", "adminPhone", 
        address, city, state, country, "propertyTypes", "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW()) RETURNING *`,
      complexName,
      schemaName,
      totalUnits,
      adminEmail,
      adminName,
      adminPhone || null,
      address || null,
      city || null,
      state || null,
      country || 'Colombia',
      propertyTypes ? JSON.stringify(propertyTypes) : JSON.stringify([])
    );
    console.log('[API Register-Complex] Resultado de complex:', complex[0]);

    // Crear el usuario administrador en el esquema 'armonia'
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const user = await prisma.$queryRawUnsafe(
      `INSERT INTO "armonia"."User" (
        email, name, password, "complexId", role, "createdAt", "updatedAt"
      ) VALUES ($1, $2, $3, $4, 'COMPLEX_ADMIN', NOW(), NOW()) RETURNING *`,
      adminEmail,
      adminName,
      hashedPassword,
      complex[0].id
    );
    console.log('[API Register-Complex] Resultado de user:', user[0]);

    // Crear el esquema del tenant
    await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);

    const tables = [
      {
        name: 'ResidentialComplex',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          name TEXT NOT NULL,
          address TEXT,
          "totalUnits" INTEGER NOT NULL,
          "adminEmail" TEXT NOT NULL,
          "adminName" TEXT NOT NULL,
          "adminPhone" TEXT,
          city TEXT,
          state TEXT,
          country TEXT,
          "propertyTypes" JSONB
        )`
      },
      {
        name: 'Property',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "complexId" INTEGER NOT NULL,          
          "unitNumber" TEXT NOT NULL,
          type TEXT NOT NULL,
          area FLOAT,
          status TEXT DEFAULT 'AVAILABLE',
          "ownerId" INTEGER,
          block TEXT,
          zone TEXT,
          UNIQUE("unitNumber", "complexId")
        )`
      },
      {
        name: 'User',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          email TEXT NOT NULL UNIQUE,
          name TEXT NOT NULL,
          password TEXT NOT NULL,
          "complexId" INTEGER NOT NULL,
          role TEXT NOT NULL
        )`
      },
      {
        name: 'Resident',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "userId" INTEGER UNIQUE NOT NULL,
          "propertyId" INTEGER NOT NULL,
          "complexId" INTEGER NOT NULL,
          "isPrimary" BOOLEAN DEFAULT FALSE,
          status TEXT DEFAULT 'ENABLED',
          whatsapp TEXT,
          dni TEXT UNIQUE
        )`
      },
      {
        name: 'Service',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          name TEXT NOT NULL,
          description TEXT,
          capacity INTEGER,
          "startTime" TEXT,
          "endTime" TEXT,
          rules TEXT,
          status TEXT DEFAULT 'active',
          "complexId" INTEGER NOT NULL,
          cost FLOAT DEFAULT 0
        )`
      },
      {
        name: 'Assembly',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          title TEXT NOT NULL,
          date TIMESTAMP NOT NULL,
          status TEXT DEFAULT 'PENDING',
          quorum FLOAT DEFAULT 0,
          votes JSONB,
          "organizerId" INTEGER NOT NULL,
          "complexId" INTEGER NOT NULL,
          type TEXT NOT NULL,
          description TEXT,
          agenda JSONB
        )`
      },
      {
        name: 'Attendance',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "assemblyId" INTEGER NOT NULL,
          "residentId" INTEGER NOT NULL,
          confirmed BOOLEAN DEFAULT FALSE,
          verified BOOLEAN DEFAULT FALSE,
          attendance TEXT DEFAULT 'No',
          "delegateName" TEXT,
          UNIQUE("assemblyId", "residentId")
        )`
      },
      {
        name: 'VotingQuestion',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "assemblyId" INTEGER NOT NULL,
          text TEXT NOT NULL,
          "yesVotes" INTEGER DEFAULT 0,
          "noVotes" INTEGER DEFAULT 0,
          "nrVotes" INTEGER DEFAULT 0,
          "isOpen" BOOLEAN DEFAULT FALSE,
          "votingEndTime" TIMESTAMP
        )`
      },
      {
        name: 'Vote',
        definition: `(
          id SERIAL PRIMARY KEY,
          "votingQuestionId" INTEGER NOT NULL,
          "residentId" INTEGER NOT NULL,
          vote TEXT,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          UNIQUE("votingQuestionId", "residentId")
        )`
      },
      {
        name: 'Document',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "assemblyId" INTEGER NOT NULL,
          "fileName" TEXT NOT NULL,
          "fileData" BYTEA NOT NULL,
          "isFinal" BOOLEAN DEFAULT FALSE
        )`
      },
      {
        name: 'Budget',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          year INTEGER NOT NULL,
          amount FLOAT NOT NULL,
          description TEXT NOT NULL,
          "authorId" INTEGER NOT NULL,
          "complexId" INTEGER NOT NULL
        )`
      },
      {
        name: 'Fee',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          amount FLOAT NOT NULL,
          "dueDate" TIMESTAMP NOT NULL,
          status TEXT DEFAULT 'PENDING',
          type TEXT NOT NULL,
          concept TEXT NOT NULL,
          "propertyId" INTEGER NOT NULL,
          "authorId" INTEGER NOT NULL,
          "complexId" INTEGER NOT NULL,
          unit TEXT NOT NULL
        )`
      },
      {
        name: 'Payment',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          amount FLOAT NOT NULL,
          method TEXT NOT NULL,
          "transactionId" TEXT,
          notes TEXT,
          "feeId" INTEGER NOT NULL,
          "ownerId" INTEGER
        )`
      },
      {
        name: 'PQR',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          type TEXT NOT NULL,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          priority TEXT NOT NULL,
          status TEXT DEFAULT 'OPEN',
          "userId" INTEGER NOT NULL,
          "complexId" INTEGER NOT NULL
        )`
      },
      {
        name: 'Staff',
        definition: `(
          id SERIAL PRIMARY KEY,
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          name TEXT NOT NULL,
          role TEXT NOT NULL,
          "complexId" INTEGER NOT NULL
        )`
      }
    ];

    // Crear las tablas en el nuevo esquema
    const schemaPrisma = getPrisma(schemaName);
    for (const table of tables) {
      console.log('[API Register-Complex] Creando tabla:', `${schemaName}.${table.name}`);
      await schemaPrisma.$executeRawUnsafe(
        `CREATE TABLE IF NOT EXISTS "${schemaName}"."${table.name}" ${table.definition}`
      );
    }

    // Crear las relaciones entre tablas
    await schemaPrisma.$executeRawUnsafe(`
      ALTER TABLE "${schemaName}"."Property" 
      ADD CONSTRAINT "Property_complexId_fkey" 
      FOREIGN KEY ("complexId") 
      REFERENCES "${schemaName}"."ResidentialComplex"(id) 
      ON DELETE CASCADE
    `);

    await schemaPrisma.$executeRawUnsafe(`
      ALTER TABLE "${schemaName}"."Resident" 
      ADD CONSTRAINT "Resident_propertyId_fkey" 
      FOREIGN KEY ("propertyId") 
      REFERENCES "${schemaName}"."Property"(id) 
      ON DELETE CASCADE
    `);
      
      // Copiar el complejo al nuevo esquema
    await schemaPrisma.$executeRawUnsafe(`
      INSERT INTO "${schemaName}"."ResidentialComplex" (
        id,
        name,
        "totalUnits",
        "adminEmail",
        "adminName",
        "adminPhone",
        address,
        city,
        state,
        country,
        "propertyTypes",
        "createdAt",
        "updatedAt"
      ) SELECT 
        id,
        name,
        "totalUnits",
        "adminEmail",
        "adminName",
        "adminPhone",
        address,
        city,
        state,
        country,
        "propertyTypes",
        "createdAt",
        "updatedAt"
      FROM "armonia"."ResidentialComplex"
      WHERE id = $1
    `, complex[0].id);

    // Copiar el usuario administrador al nuevo esquema
    await schemaPrisma.$executeRawUnsafe(`
      INSERT INTO "${schemaName}"."User" (
        id,
        email,
        name,
        password,
        "complexId",
        role,
        "createdAt",
        "updatedAt"
      ) SELECT 
        id,
        email,
        name,
        password,
        "complexId",
        role,
        "createdAt",
        "updatedAt"
      FROM "armonia"."User"
      WHERE id = $1
    `, user[0].id);

    return NextResponse.json(
      { 
        message: 'Conjunto registrado con éxito', 
        complex: complex[0],
        schemaName 
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('[API Register-Complex] Error:', error);
    return NextResponse.json(
      { 
        message: 'Error al registrar el conjunto', 
        error: String(error) 
      }, 
      { status: 500 }
    );
  }
}