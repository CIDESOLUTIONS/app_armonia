import { prisma } from "@/lib/prisma";

export async function getReportedListings() {
  try {
    const reportedListings = await prisma.report.findMany({
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
            images: true,
          },
        },
        reporter: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return reportedListings;
  } catch (error) {
    console.error("Error fetching reported listings:", error);
    throw new Error("No se pudieron obtener los anuncios reportados.");
  }
}

export async function resolveReport(
  reportId: number,
  action: "APPROVE" | "REJECT",
) {
  try {
    if (action === "REJECT") {
      // Si se rechaza el reporte, se elimina el reporte y el anuncio permanece
      await prisma.report.delete({
        where: { id: reportId },
      });
    } else if (action === "APPROVE") {
      // Si se aprueba el reporte, se elimina el anuncio y el reporte
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
    return { success: true };
  } catch (error) {
    console.error("Error resolving report:", error);
    throw new Error("No se pudo resolver el reporte.");
  }
}
