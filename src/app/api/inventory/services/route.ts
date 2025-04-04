// src/app/api/inventory/services/route.ts

import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const ServiceSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  description: z.string().optional(),
  capacity: z.number().min(0, "Capacidad debe ser mayor o igual a 0"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Formato de hora inválido"),
  cost: z.number().min(0, "Costo debe ser mayor o igual a 0"),
  status: z.enum(["active", "inactive"]).default("active"),
});

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      complexId: number;
      schemaName: string;
    };

    const { searchParams } = new URL(req.url);
    const complexId = parseInt(searchParams.get("complexId") || "0");
    const schemaName = searchParams.get("schemaName");

    if (!complexId || !schemaName) {
      return NextResponse.json(
        { message: "Faltan parámetros requeridos" },
        { status: 400 }
      );
    }

    const prisma = getPrisma(schemaName);
    const services = await prisma.$queryRawUnsafe(
      `SELECT * FROM "${schemaName}"."Service"
       WHERE "complexId" = $1
       ORDER BY name`,
      complexId
    );

    return NextResponse.json({ services }, { status: 200 });
  } catch (error) {
    console.error("[API Services GET] Error:", error);
    return NextResponse.json(
      { message: "Error al obtener servicios" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      complexId: number;
      schemaName: string;
      role: string;
    };

    const body = await req.json();
    const { services, complexId, schemaName } = body;

    if (!["COMPLEX_ADMIN", "SUPERUSER"].includes(decoded.role)) {
      return NextResponse.json(
        { message: "No tiene permisos para esta operación" },
        { status: 403 }
      );
    }

    // Validar cada servicio
    for (const service of services) {
      try {
        ServiceSchema.parse(service);
      } catch (validationError) {
        return NextResponse.json(
          {
            message: "Error de validación",
            errors: (validationError as z.ZodError).errors,
          },
          { status: 400 }
        );
      }
    }

    const prisma = getPrisma(schemaName);
    
    // Procesar servicios en una transacción
    await prisma.$transaction(async (tx) => {
      for (const service of services) {
        if (service.id) {
          // Actualizar servicio existente
          await tx.$executeRawUnsafe(
            `UPDATE "${schemaName}"."Service"
             SET name = $1, description = $2, capacity = $3,
                 "startTime" = $4, "endTime" = $5, cost = $6,
                 status = $7, "updatedAt" = NOW()
             WHERE id = $8 AND "complexId" = $9`,
            service.name,
            service.description,
            service.capacity,
            service.startTime,
            service.endTime,
            service.cost,
            service.status,
            service.id,
            complexId
          );
        } else {
          // Crear nuevo servicio
          await tx.$executeRawUnsafe(
            `INSERT INTO "${schemaName}"."Service"
             (name, description, capacity, "startTime", "endTime",
              cost, status, "complexId", "createdAt", "updatedAt")
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
            service.name,
            service.description,
            service.capacity,
            service.startTime,
            service.endTime,
            service.cost,
            service.status,
            complexId
          );
        }
      }
    });

    return NextResponse.json(
      { message: "Servicios actualizados exitosamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[API Services POST] Error:", error);
    return NextResponse.json(
      { message: "Error al actualizar servicios" },
      { status: 500 }
    );
  }
}