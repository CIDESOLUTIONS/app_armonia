// C:\Users\meciz\Documents\armonia\frontend\src\app\api\financial\budgets\route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const budgets = await prisma.budget.findMany({
      where: { complexId: 1 },
    });
    return NextResponse.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    return NextResponse.json({ error: 'Error al cargar presupuestos' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    // Verificar que complexId y authorId existan
    const complex = await prisma.residentialComplex.findUnique({ where: { id: data.complexId } });
    const author = await prisma.user.findUnique({ where: { id: data.authorId } });
    if (!complex || !author) {
      throw new Error('Conjunto residencial o autor no encontrado');
    }
    const budget = await prisma.budget.create({
      data: {
        year: data.year,
        amount: data.amount,
        description: data.description,
        complexId: data.complexId,
        authorId: data.authorId,
      },
    });
    return NextResponse.json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    return NextResponse.json({ error: error.message || 'Error al crear presupuesto' }, { status: 500 });
  }
}