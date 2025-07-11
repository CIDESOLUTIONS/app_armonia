import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { FeeService } from "@/services/feeService";
import { z } from "zod";

const FeeUpdateSchema = z.object({
  amount: z.number().min(0, "El monto debe ser un número positivo.").optional(),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD).")
    .optional(),
  status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]).optional(),
});

const PaymentRegisterSchema = z.object({
  amount: z.number().min(0, "El monto del pago debe ser un número positivo."),
  paymentMethod: z.string().min(1, "El método de pago es requerido."),
  reference: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
      "RESIDENT",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const feeId = parseInt(params.id);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado" },
        { status: 400 },
      );
    }

    const feeService = new FeeService(payload.schemaName);
    const fee = await feeService.getFees({ id: feeId }); // Asumiendo que getFees puede filtrar por ID

    if (!fee || fee.length === 0) {
      return NextResponse.json(
        { message: "Cuota no encontrada" },
        { status: 404 },
      );
    }

    ServerLogger.info(
      `Cuota ${feeId} obtenida para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(fee[0], { status: 200 });
  } catch (error) {
    ServerLogger.error(`Error al obtener cuota ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error al obtener cuota" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const feeId = parseInt(params.id);
    const body = await request.json();
    const validatedData = FeeUpdateSchema.parse(body);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado" },
        { status: 400 },
      );
    }

    const feeService = new FeeService(payload.schemaName);
    const updatedFee = await feeService.updateFee(feeId, validatedData);

    ServerLogger.info(
      `Cuota ${feeId} actualizada en complejo ${payload.complexId}`,
    );
    return NextResponse.json(updatedFee, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(`Error al actualizar cuota ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error al actualizar cuota" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const feeId = parseInt(params.id);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado" },
        { status: 400 },
      );
    }

    const feeService = new FeeService(payload.schemaName);
    await feeService.deleteFee(feeId);

    ServerLogger.info(
      `Cuota ${feeId} eliminada del complejo ${payload.complexId}`,
    );
    return NextResponse.json(
      { message: "Cuota eliminada exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    ServerLogger.error(`Error al eliminar cuota ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error al eliminar cuota" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
      "RESIDENT",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const feeId = parseInt(params.id);
    const body = await request.json();
    const validatedData = PaymentRegisterSchema.parse(body);

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo asociado" },
        { status: 400 },
      );
    }

    const feeService = new FeeService(payload.schemaName);
    // Asumiendo que FeeService tiene un método para registrar pagos
    // Esto podría ser un método en FeeService o un nuevo PaymentService
    // Por ahora, lo simulo aquí o lo añadiré a FeeService si es simple.
    // Idealmente, un PaymentService manejaría esto.
    const newPayment = await feeService.registerPayment(feeId, validatedData);

    ServerLogger.info(
      `Pago registrado para cuota ${feeId} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error(
      `Error al registrar pago para cuota ${params.id}:`,
      error,
    );
    return NextResponse.json(
      { message: "Error al registrar pago" },
      { status: 500 },
    );
  }
}
