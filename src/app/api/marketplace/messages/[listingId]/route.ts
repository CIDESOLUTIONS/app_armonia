import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { listingId: string } },
) {
  try {
    const listingId = parseInt(params.listingId);
    const userId = parseInt(req.nextUrl.searchParams.get("userId") || "");

    if (isNaN(listingId) || isNaN(userId)) {
      return new NextResponse("ID de anuncio o usuario inválido", {
        status: 400,
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        listingId: listingId,
        OR: [{ senderId: userId }, { receiverId: userId }],
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("[GET_MESSAGES_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
