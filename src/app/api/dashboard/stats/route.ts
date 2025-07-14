import { NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { ActivityLogger } from "@/lib/logging/activity-logger";
import { startOfMonth, subMonths, format } from "date-fns";

const logger = new ActivityLogger();

export async function GET(req: Request) {
  try {
    const schemaName = req.headers.get("X-Tenant-Schema");

    if (!schemaName) {
      return NextResponse.json(
        { message: "Tenant schema not found in request headers." },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(schemaName);

    const now = new Date();
    const twelveMonthsAgo = startOfMonth(subMonths(now, 11));

    const now = new Date();
    const startOfCurrentMonth = startOfMonth(now);
    const startOfLastMonth = startOfMonth(subMonths(now, 1));
    const twelveMonthsAgo = startOfMonth(subMonths(now, 11));
    const thirtyDaysFromNow = addDays(now, 30); // For upcoming assemblies

    const [kpis, revenueTrendData, pqrTrendData] =
      await tenantPrisma.$transaction([
        tenantPrisma.$queryRaw`
        SELECT
          (SELECT COUNT(*) FROM "Property")::int AS "totalProperties",
          (SELECT COUNT(*) FROM "Resident")::int AS "totalResidents",
          (SELECT COUNT(*) FROM "Vehicle")::int AS "totalVehicles",
          (SELECT COUNT(*) FROM "Pet")::int AS "totalPets",
          (SELECT COUNT(*) FROM "PQR" WHERE status IN ('OPEN', 'IN_PROGRESS'))::int AS "pendingPQRs",
          (SELECT COUNT(*) FROM "PQR" WHERE status IN ('RESOLVED', 'CLOSED'))::int AS "resolvedPQRs", -- Added resolvedPQRs
          (SELECT SUM(amount) FROM "Payment" WHERE status = 'COMPLETED' AND "createdAt" >= ${startOfCurrentMonth})::float AS "totalRevenue",
          (SELECT SUM(amount) FROM "Payment" WHERE status = 'COMPLETED' AND "createdAt" >= ${startOfLastMonth} AND "createdAt" < ${startOfCurrentMonth})::float AS "totalRevenueLastMonth", -- Added totalRevenueLastMonth
          (SELECT COUNT(*) FROM "Assembly" WHERE date >= ${now} AND date <= ${thirtyDaysFromNow})::int AS "upcomingAssemblies", -- Adjusted upcomingAssemblies
          (SELECT COUNT(*) FROM "Project" WHERE status IN ('IN_PROGRESS', 'PENDING'))::int AS "activeProjects" -- Added activeProjects
      `,
        tenantPrisma.payment.groupBy({
          by: ["createdAt"],
          _sum: { amount: true },
          where: { createdAt: { gte: twelveMonthsAgo }, status: "COMPLETED" },
          orderBy: { createdAt: "asc" },
        }),
        tenantPrisma.pQR.groupBy({
          by: ["createdAt"],
          _count: { _all: true },
          where: { createdAt: { gte: twelveMonthsAgo } },
          orderBy: { createdAt: "asc" },
        }),
      ]);

    const formattedKpis = kpis[0] || {};

    // Calculate revenue change percentage
    const revenueChangePercentage =
      formattedKpis.totalRevenueLastMonth > 0
        ? ((formattedKpis.totalRevenue - formattedKpis.totalRevenueLastMonth) /
            formattedKpis.totalRevenueLastMonth) *
          100
        : formattedKpis.totalRevenue > 0
          ? 100
          : 0;

    const processTrendData = (data: unknown[], valueField: string) => {
      const monthlyData = new Map<string, number>();
      for (let i = 0; i < 12; i++) {
        const month = format(subMonths(now, i), "MMM yyyy");
        monthlyData.set(month, 0);
      }
      data.forEach(
        (item: {
          createdAt: string;
          _sum?: { amount: number };
          _count?: { _all: number };
        }) => {
          const month = format(new Date(item.createdAt), "MMM yyyy");
          monthlyData.set(
            month,
            (monthlyData.get(month) || 0) +
              (item._sum?.[valueField] || item._count?._all || 0),
          );
        },
      );
      return Array.from(monthlyData.entries())
        .map(([month, value]) => ({ month, value }))
        .reverse();
    };

    const revenueTrend = processTrendData(revenueTrendData, "amount");
    const pqrTrend = processTrendData(pqrTrendData, "_all");

    // Placeholder for commonAreaUsage and budgetExecution
    const commonAreaUsage = 0; // To be implemented
    const budgetExecution = 0; // To be implemented

    logger.logActivity({
      module: "dashboard",
      action: "fetch_dashboard_data",
      details: { message: "Dashboard data successfully fetched" },
    });

    return NextResponse.json(
      {
        stats: {
          ...formattedKpis,
          commonAreaUsage,
          budgetExecution,
          revenueChangePercentage: revenueChangePercentage.toFixed(2),
        },
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
