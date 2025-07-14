import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
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
    return NextResponse.json(reportedListings);
  } catch (error) {
    console.error("[GET_REPORTS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
