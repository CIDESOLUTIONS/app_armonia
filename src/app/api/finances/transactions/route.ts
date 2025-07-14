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

    // Obtener los últimos 10 pagos y gastos
    const recentPayments = await tenantPrisma.payment.findMany({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        amount: true,
        createdAt: true,
        concept: true, // Asumiendo que existe un campo 'concept' en el modelo Payment
      },
    });

    const recentExpenses = await tenantPrisma.expense.findMany({
      where: { status: "PAID" }, // Asumiendo un estado para egresos pagados
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        amount: true,
        createdAt: true,
        description: true, // Asumiendo un campo 'description' en el modelo Expense
      },
    });

    const transactions = [
      ...recentPayments.map((p) => ({
        id: p.id,
        concepto: p.concept || "Pago",
        monto: p.amount,
        fecha: p.createdAt.toISOString().split("T")[0],
        estado: "Pagado",
      })),
      ...recentExpenses.map((e) => ({
        id: e.id,
        concepto: e.description || "Gasto",
        monto: e.amount,
        fecha: e.createdAt.toISOString().split("T")[0],
        estado: "Registrado", // O el estado que corresponda
      })),
    ];

    // Ordenar por fecha descendente
    transactions.sort(
      (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
    );

    ServerLogger.info(
      `Transacciones recientes obtenidas para el complejo ${payload.complexId}`,
    );

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    ServerLogger.error("Error al obtener transacciones recientes:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
