import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { reportId: string } },
) {
  try {
    const reportId = parseInt(params.reportId);
    const { action } = await req.json(); // 'APPROVE' o 'REJECT'

    if (isNaN(reportId) || !action) {
      return new NextResponse("ID de reporte o acción inválida", {
        status: 400,
      });
    }

    if (action === "REJECT") {
      await prisma.report.delete({
        where: { id: reportId },
      });
    } else if (action === "APPROVE") {
      const report = await prisma.report.findUnique({
        where: { id: reportId },
        select: { listingId: true },
      });

      if (report?.listingId) {
        await prisma.listing.delete({
          where: { id: report.listingId },
        });
      }
      await prisma.report.delete({
        where: { id: reportId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[RESOLVE_REPORT_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
