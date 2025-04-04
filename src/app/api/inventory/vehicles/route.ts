// src/app/api/inventory/vehicles/route.ts
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
        v.*,
        p."unitNumber",
        r.name as "residentName"
      FROM "${schemaName}"."Vehicle" v
      INNER JOIN "${schemaName}"."Property" p ON v."propertyId" = p.id
      INNER JOIN "${schemaName}"."Resident" r ON v."residentId" = r.id
      WHERE p."complexId" = $1
    `;

    const params = [complexId];

    if (propertyId) {
      query += ` AND v."propertyId" = $2`;
      params.push(propertyId);
    }

    const vehicles = await prisma.$queryRawUnsafe(query, ...params);

    return NextResponse.json({ vehicles });
  } catch (error) {
    console.error("[API Vehicles GET] Error:", error);
    return NextResponse.json(
      { message: "Error al obtener vehículos" },
      { status: 500 }
    );
  }
}