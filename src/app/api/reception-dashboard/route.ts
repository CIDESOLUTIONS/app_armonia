import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { startOfDay, endOfDay } from "date-fns";

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
    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);

    const [
      activeVisitors,
      pendingPackages,
      recentIncidents,
      todayEvents,
      visitorsTodayCount,
      pendingPackagesCount,
      activeIncidentsCount,
      securityAlertsCount,
    ] = await Promise.all([
      tenantPrisma.visitor.findMany({
        where: { complexId: payload.complexId, checkOutTime: null },
        orderBy: { checkInTime: "desc" },
      }),
      tenantPrisma.package.findMany({
        where: { complexId: payload.complexId, deliveredAt: null },
        orderBy: { receivedAt: "desc" },
        take: 3,
      }),
      tenantPrisma.incident.findMany({
        where: { complexId: payload.complexId, status: { not: "resolved" } },
        orderBy: { reportedAt: "desc" },
        take: 3,
      }),
      tenantPrisma.scheduledEvent.findMany({
        where: {
          complexId: payload.complexId,
          date: { gte: startOfToday, lte: endOfToday },
        },
        orderBy: { startTime: "asc" },
      }),
      tenantPrisma.visitor.count({
        where: {
          complexId: payload.complexId,
          checkInTime: { gte: startOfToday, lte: endOfToday },
        },
      }),
      tenantPrisma.package.count({
        where: { complexId: payload.complexId, deliveredAt: null },
      }),
      tenantPrisma.incident.count({
        where: { complexId: payload.complexId, status: { not: "resolved" } },
      }),
      // Placeholder for security alerts count
      Promise.resolve(0), // Replace with actual query for security alerts
    ]);

    ServerLogger.info(
      `Dashboard de recepción para complejo ${payload.complexId} obtenido.`,
    );

    return NextResponse.json(
      {
        activeVisitors,
        pendingPackages,
        recentIncidents,
        todayEvents,
        stats: {
          visitorsToday: visitorsTodayCount,
          pendingPackages: pendingPackagesCount,
          activeIncidents: activeIncidentsCount,
          securityAlerts: securityAlertsCount,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    ServerLogger.error(
      "Error al obtener datos del dashboard de recepción:",
      error,
    );
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
