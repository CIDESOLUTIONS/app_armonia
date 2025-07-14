
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const searchTerm = req.nextUrl.searchParams.get("q") || "";

    if (searchTerm.length < 2) {
      return NextResponse.json([]);
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { email: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
      take: 10, // Limitar resultados
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[SEARCH_USERS_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
