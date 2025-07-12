import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import prisma from '@/lib/prisma'; // Asume que tienes una instancia de Prisma

// Esquema de validación con Zod
const registerSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Formato de email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  schemaName: z.string().optional(), // Opcional para asociar a un complejo existente
  role: z.enum(['ADMIN', 'COMPLEX_ADMIN', 'RESIDENT', 'STAFF']).default('RESIDENT'), // Rol por defecto
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, schemaName, role } = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: 'El usuario ya existe' }, { status: 409 });
    }

    let complexId: number | null = null;
    if (schemaName) {
      const residentialComplex = await prisma.residentialComplex.findUnique({
        where: { schemaName: schemaName },
      });

      if (!residentialComplex) {
        return NextResponse.json({ message: 'Conjunto residencial no encontrado' }, { status: 404 });
      }
      complexId = residentialComplex.id;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        complexId,
      },
    });

    return NextResponse.json({ message: 'Registro exitoso', user: { id: newUser.id, email: newUser.email, role: newUser.role, complexId: newUser.complexId } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
    }
    console.error('Error en registro:', error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}