// frontend/src/app/api/financial/fees/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/financial/fees
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = `
      SELECT 
        f.id,
        f.type,
        f.amount,
        f.due_date,
        f.status,
        f.payment_date,
        u.unit_number,
        COALESCE(json_build_object(
          'id', p.id,
          'amount', p.amount,
          'payment_date', p.payment_date,
          'payment_method', p.payment_method,
          'reference', p.reference
        ), null) as payment
      FROM fees f
      JOIN units u ON f.unit_id = u.id
      LEFT JOIN payments p ON f.id = p.fee_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (type) {
      params.push(type);
      query += ` AND f.type = $${params.length}`;
    }
    if (status) {
      params.push(status);
      query += ` AND f.status = $${params.length}`;
    }
    if (startDate) {
      params.push(startDate);
      query += ` AND f.due_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND f.due_date <= $${params.length}`;
    }

    query += ` ORDER BY f.due_date DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching fees:', error);
    return NextResponse.json(
      { error: 'Error al obtener cuotas' },
      { status: 500 }
    );
  }
}

// POST /api/financial/fees/bulk
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { feeType, baseAmount, startDate, endDate, unitIds } = body;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Generar fechas de vencimiento
      const dates = [];
      const currentDate = new Date(startDate);
      const endDateTime = new Date(endDate);
      
      while (currentDate <= endDateTime) {
        dates.push(new Date(currentDate));
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      // Insertar cuotas para cada unidad
      for (const unitId of unitIds) {
        for (const dueDate of dates) {
          await client.query(`
            INSERT INTO fees (
              unit_id,
              type,
              amount,
              due_date,
              status,
              created_at,
              updated_at
            ) VALUES ($1, $2, $3, $4, 'PENDING', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `, [unitId, feeType, baseAmount, dueDate]);
        }
      }

      await client.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating fees:', error);
    return NextResponse.json(
      { error: 'Error al crear cuotas' },
      { status: 500 }
    );
  }
}

// frontend/src/app/api/financial/fees/[id]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/financial/fees/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(`
      SELECT 
        f.*,
        u.unit_number,
        COALESCE(json_build_object(
          'id', p.id,
          'amount', p.amount,
          'payment_date', p.payment_date,
          'payment_method', p.payment_method,
          'reference', p.reference
        ), null) as payment
      FROM fees f
      JOIN units u ON f.unit_id = u.id
      LEFT JOIN payments p ON f.id = p.fee_id
      WHERE f.id = $1
    `, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Cuota no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching fee:', error);
    return NextResponse.json(
      { error: 'Error al obtener cuota' },
      { status: 500 }
    );
  }
}

// PUT /api/financial/fees/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { amount, dueDate, status } = body;

    const result = await pool.query(`
      UPDATE fees 
      SET amount = $1,
          due_date = $2,
          status = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *
    `, [amount, dueDate, status, params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Cuota no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating fee:', error);
    return NextResponse.json(
      { error: 'Error al actualizar cuota' },
      { status: 500 }
    );
  }
}

// POST /api/financial/fees/[id]/payment
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { amount, paymentMethod, reference } = body;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Registrar el pago
      const paymentResult = await client.query(`
        INSERT INTO payments (
          fee_id,
          amount,
          payment_date,
          payment_method,
          reference,
          status,
          created_at,
          updated_at
        ) VALUES ($1, $2, CURRENT_TIMESTAMP, $3, $4, 'COMPLETED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING id
      `, [params.id, amount, paymentMethod, reference]);

      // Actualizar estado de la cuota
      await client.query(`
        UPDATE fees 
        SET status = 'PAID',
            payment_date = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [params.id]);

      await client.query('COMMIT');
      return NextResponse.json({ id: paymentResult.rows[0].id });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error registering payment:', error);
    return NextResponse.json(
      { error: 'Error al registrar pago' },
      { status: 500 }
    );
  }
}