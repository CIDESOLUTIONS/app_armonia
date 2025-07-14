import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";

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

    // Lógica para obtener el resumen financiero
    const totalIngresos = await tenantPrisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "COMPLETED" },
    });

    const totalEgresos = await tenantPrisma.expense.aggregate({
      _sum: { amount: true },
      where: { status: "PAID" }, // Asumiendo un estado para egresos pagados
    });

    const cuotasPendientes = await tenantPrisma.fee.count({
      where: { status: "PENDING" }, // Asumiendo un estado para cuotas pendientes
    });

    const saldoActual =
      (totalIngresos._sum.amount || 0) - (totalEgresos._sum.amount || 0);

    ServerLogger.info(
      `Resumen financiero obtenido para el complejo ${payload.complexId}`,
    );

    return NextResponse.json(
      {
        totalIngresos: totalIngresos._sum.amount || 0,
        totalEgresos: totalEgresos._sum.amount || 0,
        saldoActual,
        cuotasPendientes,
      },
      { status: 200 },
    );
  } catch (error) {
    ServerLogger.error("Error al obtener resumen financiero:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
