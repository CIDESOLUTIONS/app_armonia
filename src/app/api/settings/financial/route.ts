import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";

const FinancialSettingsSchema = z.object({
  bankName: z.string().min(1, "El nombre del banco es requerido."),
  accountNumber: z.string().min(1, "El número de cuenta es requerido."),
  accountType: z.string().min(1, "El tipo de cuenta es requerido."),
  nit: z.string().min(1, "El NIT es requerido."),
  paymentMethods: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!["ADMIN", "COMPLEX_ADMIN"].includes(payload.role)) {
      return NextResponse.json(
        { message: "Permisos insuficientes" },
        { status: 403 },
      );
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    // Asumiendo que la configuración financiera se guarda en una tabla como FinancialSettings
    const financialSettings = await tenantPrisma.financialSettings.findUnique({
      where: { complexId: payload.complexId }, // Asumiendo que hay un complexId en la tabla
    });

    if (!financialSettings) {
      return NextResponse.json(
        { message: "Configuración financiera no encontrada" },
        { status: 404 },
      );
    }

    ServerLogger.info(
      `Configuración financiera obtenida para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(financialSettings, { status: 200 });
  } catch (error) {
    ServerLogger.error("Error al obtener configuración financiera:", error);
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

    if (!["ADMIN", "COMPLEX_ADMIN"].includes(payload.role)) {
      return NextResponse.json(
        { message: "Permisos insuficientes" },
        { status: 403 },
      );
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = FinancialSettingsSchema.parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    const updatedSettings = await tenantPrisma.financialSettings.upsert({
      where: { complexId: payload.complexId },
      update: validatedData,
      create: { ...validatedData, complexId: payload.complexId },
    });

    ServerLogger.info(
      `Configuración financiera actualizada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedSettings, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al actualizar configuración financiera:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
