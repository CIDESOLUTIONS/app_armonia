import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";

const UserProfileSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  email: z.string().email("Email inválido.").optional(), // Email might not be updatable directly
  phone: z.string().optional(),
  address: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const userProfile = await tenantPrisma.user.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, phone: true, address: true },
    });

    if (!userProfile) {
      return NextResponse.json(
        { message: "Perfil de usuario no encontrado" },
        { status: 404 },
      );
    }

    ServerLogger.info(
      `Perfil de usuario ${payload.id} obtenido para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(userProfile, { status: 200 });
  } catch (error) {
    ServerLogger.error("Error al obtener perfil de usuario:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = UserProfileSchema.partial().parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const updatedProfile = await tenantPrisma.user.update({
      where: { id: payload.id },
      data: validatedData,
    });

    ServerLogger.info(
      `Perfil de usuario ${payload.id} actualizado para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al actualizar perfil de usuario:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
