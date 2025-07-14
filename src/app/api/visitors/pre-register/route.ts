import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import QRCode from "qrcode";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Generar un código de acceso único
    const accessCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    // Crear el registro del visitante pre-registrado
    const newVisitor = await prisma.preRegisteredVisitor.create({
      data: {
        name: data.name,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        residentId: data.residentId,
        unitId: data.unitId,
        expectedDate: new Date(data.expectedDate),
        validFrom: new Date(data.validFrom),
        validUntil: new Date(data.validUntil),
        purpose: data.purpose,
        accessCode: accessCode,
        status: "PENDING", // Estado inicial
      },
    });

    // Generar el QR Code
    const qrData = JSON.stringify({
      visitorId: newVisitor.id,
      accessCode: accessCode,
      complexId: data.complexId,
    });
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    // Actualizar el registro con la URL del QR
    const updatedVisitor = await prisma.preRegisteredVisitor.update({
      where: { id: newVisitor.id },
      data: { qrCodeUrl: qrCodeUrl },
    });

    return NextResponse.json(updatedVisitor);
  } catch (error) {
    console.error("[PRE_REGISTER_VISITOR_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
