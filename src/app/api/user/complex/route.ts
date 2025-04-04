// src/app/api/user/complex/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verify } from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) throw new Error('No autorizado');

    const token = authHeader.replace('Bearer ', '');
    const decoded = verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;

    prisma.setTenantSchema('public');
    const user = await prisma.$queryRawUnsafe(
      `SELECT name FROM "public"."User" WHERE id = $1 LIMIT 1`,
      decoded.id
    );
    const complex = await prisma.$queryRawUnsafe(
      `SELECT name FROM "public"."ResidentialComplex" WHERE id = $1 LIMIT 1`,
      decoded.complexId
    );

    if (!Array.isArray(user) || !Array.isArray(complex) || user.length === 0 || complex.length === 0) {
      throw new Error('Usuario o conjunto no encontrado');
    }

    return NextResponse.json({ userName: user[0].name, complexName: complex[0].name });
  } catch (error) {
    console.error('[API User/Complex] Error:', error);
    return NextResponse.json({ message: 'Error al obtener datos' }, { status: 401 });
  }
}