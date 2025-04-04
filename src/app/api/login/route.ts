// src/app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    console.log("[API Login] Esquema establecido: armonia");

    const prisma = getPrisma();  // Sin schema para el login inicial
    
    // Buscar usuario en la tabla principal
    const users = await prisma.$queryRawUnsafe(`
      SELECT * FROM "armonia"."User" WHERE email = $1
    `, email);
    
    console.log("[API Login] Todos los usuarios en armonia.User:", users);

    if (!users || users.length === 0) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = users[0];
    console.log("[API Login] Usuario encontrado:", user);

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return NextResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Obtener el schema del conjunto
    const complex = await prisma.$queryRawUnsafe(`
      SELECT "schemaName" FROM "armonia"."ResidentialComplex" WHERE id = $1
    `, user.complexId);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      complexId: user.complexId,
      name: user.name,
      schemaName: complex[0].schemaName
    };

    const token = generateToken(payload);
    console.log("[API Login] Login exitoso para " + email + ", token generado");

    return NextResponse.json({ token, user: payload });
  } catch (error) {
    console.error("[API Login] Error detallado:", error);
    return NextResponse.json(
      { message: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}