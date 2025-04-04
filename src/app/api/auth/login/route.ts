// C:\Users\meciz\Documents\armonia\frontend\src\app\api\login\route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getPrismaClient } from '@/lib/prisma';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const prismaGlobal = new PrismaClient();
    const user = await prismaGlobal.user.findUnique({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const prisma = await getPrismaClient(user.complexId);
    const token = jwt.sign({ email: user.email, complexId: user.complexId }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    const response = NextResponse.json({ message: 'Login exitoso' });
    response.cookies.set('token', token, { httpOnly: true, path: '/' });
    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 });
  }
}