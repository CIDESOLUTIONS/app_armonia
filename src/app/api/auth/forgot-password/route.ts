import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // No revelar si el usuario existe o no por seguridad
      return NextResponse.json(
        { message: "Si el email está registrado, recibirás un enlace." },
        { status: 200 },
      );
    }

    const resetToken = randomBytes(32).toString("hex");
    const passwordResetToken = Buffer.from(resetToken).toString("base64");
    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hora de expiración

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json(
      { message: "Si el email está registrado, recibirás un enlace." },
      { status: 200 },
    );
  } catch (error) {
    console.error("[FORGOT_PASSWORD_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
