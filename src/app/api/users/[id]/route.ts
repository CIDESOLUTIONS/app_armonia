
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const userId = parseInt(params.id);

    if (isNaN(userId)) {
      return new NextResponse("ID de usuario inválido", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      return new NextResponse("Usuario no encontrado", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[GET_USER_BY_ID_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
