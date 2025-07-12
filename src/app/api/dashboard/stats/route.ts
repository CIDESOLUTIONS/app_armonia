// C:\Users\meciz\Documents\armonia\frontend\src\app\api\dashboard\stats\route.ts
import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { ActivityLogger } from "@/lib/logging/activity-logger";
import { startOfMonth, subMonths, format } from "date-fns";

const logger = new ActivityLogger();

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.complexId || !session?.user?.schemaName) {
      return NextResponse.json(
        { message: "Unauthorized or session is invalid" },
        { status: 401 },
      );
    }

    const { complexId, schemaName } = session.user;
    const tenantPrisma = getPrisma(schemaName);

    const now = new Date();
    const twelveMonthsAgo = startOfMonth(subMonths(now, 11));

    const [kpis, revenueTrendData, pqrTrendData] =
      await tenantPrisma.$transaction([
        // 1. Consulta agregada para KPIs principales
        tenantPrisma.$queryRaw`
        SELECT
          (SELECT COUNT(*) FROM "Property")::int AS "totalProperties",
          (SELECT COUNT(*) FROM "Resident")::int AS "totalResidents",
          (SELECT COUNT(*) FROM "PQR" WHERE status IN ('OPEN', 'IN_PROGRESS'))::int AS "pendingPQRs",
          (SELECT SUM(amount) FROM "Payment" WHERE status = 'COMPLETED' AND "createdAt" >= ${startOfMonth(now)})::float AS "totalRevenue",
          (SELECT COUNT(*) FROM "Assembly" WHERE date >= NOW())::int AS "upcomingAssemblies"
      `,
        // 2. Consulta para tendencia de ingresos (últimos 12 meses)
        tenantPrisma.payment.groupBy({
          by: ["createdAt"],
          _sum: { amount: true },
          where: { createdAt: { gte: twelveMonthsAgo }, status: "COMPLETED" },
          orderBy: { createdAt: "asc" },
        }),
        // 3. Consulta para tendencia de PQRs (últimos 12 meses)
        tenantPrisma.pQR.groupBy({
          by: ["createdAt"],
          _count: { _all: true },
          where: { createdAt: { gte: twelveMonthsAgo } },
          orderBy: { createdAt: "asc" },
        }),
      ]);

    const formattedKpis = kpis[0] || {};

    // Procesamiento de datos de tendencias
    const processTrendData = (data, valueField) => {
      const monthlyData = new Map<string, number>();
      for (let i = 0; i < 12; i++) {
        const month = format(subMonths(now, i), "MMM yyyy");
        monthlyData.set(month, 0);
      }
      data.forEach((item) => {
        const month = format(new Date(item.createdAt), "MMM yyyy");
        monthlyData.set(
          month,
          (monthlyData.get(month) || 0) +
            (item._sum?.[valueField] || item._count?._all || 0),
        );
      });
      return Array.from(monthlyData.entries())
        .map(([month, value]) => ({ month, value }))
        .reverse();
    };

    const revenueTrend = processTrendData(revenueTrendData, "amount");
    const pqrTrend = processTrendData(pqrTrendData, "_all");

    logger.logActivity({
      module: "dashboard",
      action: "fetch_dashboard_data",
      entityId: complexId,
      details: { message: "Dashboard data successfully fetched" },
    });

    return NextResponse.json(
      {
        stats: formattedKpis,
        revenueTrend,
        pqrTrend,
      },
      { status: 200 },
    );
  } catch (error) {
    logger.error("[API Dashboard] Error:", error);
    return NextResponse.json(
      {
        message: "Error al obtener datos del dashboard",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
