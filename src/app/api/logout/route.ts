import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: 'Sesión cerrada exitosamente' }, { status: 200 });
    response.cookies.delete('token'); // Elimina la cookie del token
    return response;
  } catch (error) {
    console.error('[API Logout] Error:', error);
    return NextResponse.json({ message: 'Error al cerrar sesión' }, { status: 500 });
  }
}