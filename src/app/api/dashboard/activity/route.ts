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

    if (!["ADMIN", "COMPLEX_ADMIN", "STAFF"].includes(payload.role)) {
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

    // Fetch recent payments
    const recentPayments = await tenantPrisma.payment.findMany({
      where: { complexId: payload.complexId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        amount: true,
        createdAt: true,
        concept: true, // Assuming a 'concept' field in Payment model
        user: { select: { name: true } },
      },
    });

    // Fetch recent PQRs
    const recentPQRs = await tenantPrisma.pQR.findMany({
      where: { complexId: payload.complexId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        subject: true,
        createdAt: true,
        status: true,
        reportedBy: { select: { name: true } },
      },
    });

    // Fetch recent Assemblies (e.g., created or updated)
    const recentAssemblies = await tenantPrisma.assembly.findMany({
      where: { complexId: payload.complexId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        status: true,
        createdBy: { select: { name: true } },
      },
    });

    // Combine and format activities
    const activities = [
      ...recentPayments.map((p) => ({
        id: `payment-${p.id}`,
        type: "payment",
        title: `Pago de ${p.user?.name || "Usuario"}`,
        description: `Monto: $${p.amount.toLocaleString()} - Concepto: ${p.concept || "N/A"}`,
        timestamp: p.createdAt.toISOString(),
        status: "success",
      })),
      ...recentPQRs.map((p) => ({
        id: `pqr-${p.id}`,
        type: "pqr",
        title: `PQR: ${p.subject}`,
        description: `Reportado por: ${p.reportedBy?.name || "N/A"} - Estado: ${p.status}`,
        timestamp: p.createdAt.toISOString(),
        status:
          p.status === "OPEN"
            ? "error"
            : p.status === "IN_PROGRESS"
              ? "warning"
              : "info",
      })),
      ...recentAssemblies.map((a) => ({
        id: `assembly-${a.id}`,
        type: "assembly",
        title: `Asamblea: ${a.title}`,
        description: `Estado: ${a.status} - Creada por: ${a.createdBy?.name || "N/A"}`,
        timestamp: a.createdAt.toISOString(),
        status: "info",
      })),
    ];

    // Sort by timestamp (most recent first)
    activities.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    ServerLogger.info(
      `Actividad del dashboard obtenida para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(activities, { status: 200 });
  } catch (error) {
    ServerLogger.error("Error al obtener actividad del dashboard:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
