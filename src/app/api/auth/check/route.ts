// C:\Users\meciz\Documents\armonia\frontend\src\app\api\auth\check\route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '@/lib/prisma';

export async function GET(request) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { email: string; complexId: number };
    const prismaGlobal = new PrismaClient();
    const user = await prismaGlobal.user.findUnique({ where: { email: decoded.email } });
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    }
    return NextResponse.json({ email: user.email, role: user.role, complexId: user.complexId });
  } catch (err) {
    console.error('Error en /api/auth/check:', err);
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}