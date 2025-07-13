
import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";
import { getTenantPrismaClient } from "@/lib/prisma";
import { ServerLogger } from "@/lib/logging/server-logger";
import { PaymentService } from "@/services/payment-service";

export async function POST(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const { feeId } = await request.json();

    if (!feeId) {
      return NextResponse.json(
        { message: "ID de cuota es requerido" },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const paymentService = new PaymentService(tenantPrisma);

    const paymentUrl = await paymentService.initiatePaymentForFee(
      feeId,
      payload.userId,
      payload.complexId,
    );

    return NextResponse.json({ paymentUrl }, { status: 200 });
  } catch (error: any) {
    ServerLogger.error("Error al iniciar el pago:", error);
    return NextResponse.json(
      { message: "Error interno del servidor", details: error.message },
      { status: 500 },
    );
  }
}
