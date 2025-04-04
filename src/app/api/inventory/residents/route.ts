// src/app/api/inventory/residents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const { searchParams } = new URL(req.url);
    const complexId = parseInt(searchParams.get("complexId") || "0");
    const schemaName = searchParams.get("schemaName");
    const propertyId = searchParams.get("propertyId");

    const prisma = getPrisma(schemaName);

    let query = `
      SELECT 
        r.*,
        u.name,
        u.email,
        u.role,
        p."unitNumber"
      FROM "${schemaName}"."Resident" r
      INNER JOIN "${schemaName}"."User" u ON r."userId" = u.id
      INNER JOIN "${schemaName}"."Property" p ON r."propertyId" = p.id
      WHERE r."complexId" = $1
    `;

    const params = [complexId];

    if (propertyId) {
      query += ` AND r."propertyId" = $2`;
      params.push(propertyId);
    }

    query += ` ORDER BY p."unitNumber"`;

    const residents = await prisma.$queryRawUnsafe(query, ...params);

    return NextResponse.json({ residents });
  } catch (error) {
    console.error("[API Residents GET] Error:", error);
    return NextResponse.json(
      { message: "Error al obtener residentes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    const body = await req.json();
    const { complexId, schemaName, resident } = body;

    const prisma = getPrisma(schemaName);

    // Crear usuario primero
    const user = await prisma.$queryRawUnsafe(`
      INSERT INTO "${schemaName}"."User" (
        email,
        name,
        password,
        "complexId",
        role
      ) VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
      resident.email,
      resident.name,
      resident.password,
      complexId,
      'RESIDENT'
    );

    // Luego crear el residente
    const result = await prisma.$queryRawUnsafe(`
      INSERT INTO "${schemaName}"."Resident" (
        "userId",
        "propertyId",
        "complexId",
        "isPrimary",
        status,
        whatsapp,
        dni
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `,
      user[0].id,
      resident.propertyId,
      complexId,
      resident.isPrimary || false,
      resident.status || 'ENABLED',
      resident.whatsapp || null,
      resident.dni
    );

    return NextResponse.json({ resident: result[0] });
  } catch (error) {
    console.error("[API Residents POST] Error:", error);
    return NextResponse.json(
      { message: "Error al crear residente" },
      { status: 500 }
    );
  }
}