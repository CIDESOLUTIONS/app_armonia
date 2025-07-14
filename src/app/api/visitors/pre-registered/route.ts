
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const preRegisteredVisitors = await prisma.preRegisteredVisitor.findMany({
      where: {
        status: "PENDING",
        validUntil: { gte: new Date() }, // Solo visitantes válidos
      },
      include: {
        resident: {
          select: {
            name: true,
            unit: true,
          },
        },
      },
      orderBy: {
        expectedDate: "asc",
      },
    });

    return NextResponse.json(preRegisteredVisitors);
  } catch (error) {
    console.error("[GET_PRE_REGISTERED_VISITORS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
