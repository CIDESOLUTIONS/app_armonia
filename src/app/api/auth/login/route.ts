import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getPublicPrismaClient } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export async function POST(request: Request) {
  const publicPrisma = getPublicPrismaClient();

  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await publicPrisma.user.findUnique({
      where: { email },
      include: { complex: true }, // Incluir la relación con ResidentialComplex
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    // El schemaName se obtiene de la relación
    const schemaName = user.complex?.schemaName;

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      // Solo incluir schemaName si existe
      ...(schemaName && { schemaName }),
    };

    const token = sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

    const serialized = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1, // 1 hora
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          schemaName: schemaName,
          complexId: user.complexId,
        },
      },
      {
        status: 200,
        headers: { "Set-Cookie": serialized },
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    console.error("Error en login:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
