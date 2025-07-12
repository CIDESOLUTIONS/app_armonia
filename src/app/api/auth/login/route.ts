import { NextResponse } from "next/server";
import { serialize } from "cookie";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma"; // Asume que tienes una instancia de Prisma

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

// Esquema de validación con Zod
const loginSchema = z.object({
  email: z.string().email("Formato de email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  schemaName: z.string().optional(), // Opcional para usuarios globales
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, schemaName } = loginSchema.parse(body);

    let complexId: number | null = null;
    let resolvedSchemaName: string | null = null;

    if (schemaName) {
      const residentialComplex = await prisma.residentialComplex.findUnique({
        where: { schemaName: schemaName },
      });

      if (!residentialComplex) {
        return NextResponse.json(
          { message: "Conjunto residencial no encontrado" },
          { status: 404 },
        );
      }
      complexId = residentialComplex.id;
      resolvedSchemaName = residentialComplex.schemaName;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
        ...(complexId !== null && { complexId: complexId }), // Filtrar por complexId si se proporciona
      },
    });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    // Si el usuario tiene un complexId pero no se proporcionó schemaName, o no coincide
    if (user.complexId && !schemaName) {
      // Esto podría indicar un intento de login global para un usuario de complejo
      return NextResponse.json(
        { message: "Por favor, especifique el conjunto residencial" },
        { status: 400 },
      );
    }
    if (user.complexId && complexId !== user.complexId) {
      return NextResponse.json(
        { message: "El usuario no pertenece a este conjunto residencial" },
        { status: 403 },
      );
    }

    // Generar token JWT
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      ...(resolvedSchemaName && { schemaName: resolvedSchemaName }), // Incluir schemaName si aplica
    };

    const token = sign(tokenPayload, JWT_SECRET, { expiresIn: "1h" });

    const serialized = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1, // 1 hour
      path: "/",
    });

    return NextResponse.json(
      {
        message: "Login exitoso",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          schemaName: resolvedSchemaName,
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
