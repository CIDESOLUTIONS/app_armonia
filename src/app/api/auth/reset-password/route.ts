
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new NextResponse("Token y contraseña son requeridos", { status: 400 });
    }

    const hashedToken = Buffer.from(token).toString("base64");

    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return new NextResponse("Token no válido o expirado", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({ message: "Contraseña actualizada con éxito" }, { status: 200 });
  } catch (error) {
    console.error("[RESET_PASSWORD_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
