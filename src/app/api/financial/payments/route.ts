// frontend/src/app/api/financial/payments/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/financial/payments
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const paymentMethod = searchParams.get('paymentMethod');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortField = searchParams.get('sortField') || 'payment_date';
    const sortDirection = searchParams.get('sortDirection') || 'DESC';

    let query = `
      SELECT 
        p.id,
        p.amount,
        p.payment_date,
        p.payment_method,
        p.reference,
        p.status,
        f.type as fee_type,
        f.due_date as fee_due_date,
        u.unit_number
      FROM payments p
      JOIN fees f ON p.fee_id = f.id
      JOIN units u ON f.unit_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      params.push(status);
      query += ` AND p.status = $${params.length}`;
    }
    if (paymentMethod) {
      params.push(paymentMethod);
      query += ` AND p.payment_method = $${params.length}`;
    }
    if (startDate) {
      params.push(startDate);
      query += ` AND p.payment_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND p.payment_date <= $${params.length}`;
    }

    // Validar campo de ordenamiento para prevenir SQL injection
    const validSortFields = ['payment_date', 'amount', 'unit_number', 'status'];
    const validSortDirections = ['ASC', 'DESC'];
    
    const finalSortField = validSortFields.includes(sortField) ? sortField : 'payment_date';
    const finalSortDirection = validSortDirections.includes(sortDirection) ? sortDirection : 'DESC';

    query += ` ORDER BY ${finalSortField} ${finalSortDirection}`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { error: 'Error al obtener pagos' },
      { status: 500 }
    );
  }
}

// frontend/src/app/api/financial/payments/[id]/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/financial/payments/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await pool.query(`
      SELECT 
        p.*,
        f.type as fee_type,
        f.due_date as fee_due_date,
        f.amount as fee_amount,
        u.unit_number,
        rc.name as complex_name
      FROM payments p
      JOIN fees f ON p.fee_id = f.id
      JOIN units u ON f.unit_id = u.id
      JOIN residential_complexes rc ON u.complex_id = rc.id
      WHERE p.id = $1
    `, [params.id]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Pago no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json(
      { error: 'Error al obtener pago' },
      { status: 500 }
    );
  }
}

// PUT /api/financial/payments/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status, reference } = body;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Actualizar el pago
      const paymentResult = await client.query(`
        UPDATE payments 
        SET status = $1,
            reference = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING fee_id, status
      `, [status, reference, params.id]);

      if (paymentResult.rows.length === 0) {
        throw new Error('Pago no encontrado');
      }

      // Actualizar estado de la cuota según el estado del pago
      const feeStatus = status === 'COMPLETED' ? 'PAID' : 'PENDING';
      await client.query(`
        UPDATE fees 
        SET status = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
      `, [feeStatus, paymentResult.rows[0].fee_id]);

      await client.query('COMMIT');
      return NextResponse.json({ success: true });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating payment:', error);
    return NextResponse.json(
      { error: 'Error al actualizar pago' },
      { status: 500 }
    );
  }
}

// GET /api/financial/payments/summary
export async function GET(req: NextRequest) {
  try {
    const client = await pool.connect();
    try {
      const summary = {
        totalCollected: 0,
        monthlyPayments: 0,
        pendingPayments: 0
      };

      // Total recaudado
      const totalResult = await client.query(`
        SELECT COALESCE(SUM(amount), 0) as total
        FROM payments
        WHERE status = 'COMPLETED'
      `);
      summary.totalCollected = totalResult.rows[0].total;

      // Pagos del mes actual
      const monthlyResult = await client.query(`
        SELECT COUNT(*) as count
        FROM payments
        WHERE 
          status = 'COMPLETED' AND
          DATE_TRUNC('month', payment_date) = DATE_TRUNC('month', CURRENT_DATE)
      `);
      summary.monthlyPayments = monthlyResult.rows[0].count;

      // Pagos pendientes
      const pendingResult = await client.query(`
        SELECT COUNT(*) as count
        FROM payments
        WHERE status = 'PENDING'
      `);
      summary.pendingPayments = pendingResult.rows[0].count;

      return NextResponse.json(summary);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    return NextResponse.json(
      { error: 'Error al obtener resumen de pagos' },
      { status: 500 }
    );
  }
}

// GET /api/financial/payments/export
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = `
      SELECT 
        u.unit_number as "Unidad",
        f.type as "Tipo de Cuota",
        p.amount as "Monto",
        TO_CHAR(p.payment_date, 'YYYY-MM-DD') as "Fecha de Pago",
        p.payment_method as "Método de Pago",
        p.reference as "Referencia",
        p.status as "Estado"
      FROM payments p
      JOIN fees f ON p.fee_id = f.id
      JOIN units u ON f.unit_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (startDate) {
      params.push(startDate);
      query += ` AND p.payment_date >= $${params.length}`;
    }
    if (endDate) {
      params.push(endDate);
      query += ` AND p.payment_date <= $${params.length}`;
    }

    query += ` ORDER BY p.payment_date DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error exporting payments:', error);
    return NextResponse.json(
      { error: 'Error al exportar pagos' },
      { status: 500 }
    );
  }
}