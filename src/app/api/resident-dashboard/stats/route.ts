import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { ServerLogger } from "@/lib/logging/server-logger";
import { startOfMonth, endOfMonth, subMonths, format, addDays } from "date-fns";

export async function GET(_req: NextRequest) {
  try {
    const schemaName = _req.headers.get("X-Tenant-Schema");

    if (!schemaName) {
      return NextResponse.json(
        { message: "Tenant schema not found in request headers." },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(schemaName);

    const userId = _req.headers.get("X-User-Id"); // Asumiendo que el userId también viene en un header
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found in request headers." },
        { status: 400 },
      );
    }

    // Get user's property ID
    const userProperty = await tenantPrisma.resident.findFirst({
      where: { userId: parseInt(userId as string) },
      select: { propertyId: true },
    });

    const propertyId = userProperty?.propertyId;

    if (!propertyId) {
      return NextResponse.json(
        { message: "Propiedad del usuario no encontrada" },
        { status: 404 },
      );
    }

    // KPIs
    const [
      totalResidentsInProperty,
      currentAccountBalance,
      annualPaymentsSummary,
      pendingFees,
      upcomingReservations,
      reportedPQRs,
      resolvedPQRs,
      commonAreaUsage,
    ] = await Promise.all([
      tenantPrisma.resident.count({ where: { propertyId } }),
      tenantPrisma.bill
        .aggregate({
          _sum: {
            totalAmount: true,
          },
          where: {
            propertyId,
            status: { not: "PAID" },
          },
        })
        .then((result) => result._sum.totalAmount?.toNumber() || 0),
      tenantPrisma.payment
        .aggregate({
          _sum: {
            amount: true,
          },
          where: {
            propertyId,
            status: "PAID",
            paidAt: {
              gte: new Date(new Date().getFullYear(), 0, 1), // Start of current year
              lte: new Date(new Date().getFullYear(), 11, 31), // End of current year
            },
          },
        })
        .then((result) => result._sum.amount?.toNumber() || 0),
      tenantPrisma.bill.findMany({
        where: {
          propertyId,
          status: { not: "PAID" },
        },
        select: {
          id: true,
          billNumber: true,
          totalAmount: true,
          dueDate: true,
          billingPeriod: true,
        },
        orderBy: { dueDate: "asc" },
      }),
      tenantPrisma.reservation.findMany({
        where: {
          userId: parseInt(userId as string),
          startDateTime: { gte: new Date() },
        },
        orderBy: { startDateTime: "asc" },
        take: 3,
      }),
      tenantPrisma.pQR.count({
        where: {
          reportedById: parseInt(userId as string),
          status: { in: ["OPEN", "IN_PROGRESS"] },
        },
      }),
      tenantPrisma.pQR.count({
        where: { reportedById: parseInt(userId as string), status: "CLOSED" },
      }),
      // Common Area Usage for resident (simplified: count their completed reservations last month)
      tenantPrisma.reservation.count({
        where: {
          userId: parseInt(userId as string),
          status: "COMPLETED",
          createdAt: {
            gte: subMonths(new Date(), 1),
          },
        },
      }),
    ]);

    const stats = {
      totalResidentsInProperty,
      currentAccountBalance,
      annualPaymentsSummary,
      pendingFees,
      upcomingReservations,
      reportedPQRs,
      resolvedPQRs,
      commonAreaUsage: commonAreaUsage > 0 ? 1 : 0, // Simple indicator if they used common areas
    };

    // Monthly expenses trend (placeholder for now)
    const monthlyExpensesData = await tenantPrisma.expense.groupBy({
      by: ["createdAt"],
      _sum: { amount: true },
      where: {
        userId: parseInt(userId as string),
        createdAt: { gte: subMonths(new Date(), 5) }, // Last 6 months
      },
      orderBy: { createdAt: "asc" },
    });

    const monthlyExpensesTrend = monthlyExpensesData.map((item: any) => ({
      month: format(new Date(item.createdAt), "MMM yyyy"),
      value: item._sum.amount || 0,
    }));

    ServerLogger.info(
      `Dashboard de residente para usuario ${userId} en complejo ${complexId} obtenido.`,
    );
    return NextResponse.json({ stats, monthlyExpensesTrend }, { status: 200 });
  } catch (error) {
    ServerLogger.error(
      "Error al obtener datos del dashboard de residente:",
      error,
    );
    return NextResponse.json(
      {
        message: "Error al obtener datos del dashboard de residente",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
