import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { z } from "zod";
import { ServerLogger } from "@/lib/logging/server-logger";

const PQRSchema = z.object({
  subject: z.string().min(1, "El asunto es requerido."),
  description: z.string().min(1, "La descripción es requerida."),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED", "REJECTED"]).default("OPEN"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
  category: z.string().min(1, "La categoría es requerida."),
  reportedById: z.number().int().positive("ID de reportante inválido."),
  assignedToId: z
    .number()
    .int()
    .positive("ID de asignado inválido.")
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    const authResult = await authMiddleware(request, [
      "ADMIN",
      "COMPLEX_ADMIN",
      "STAFF",
      "RESIDENT",
    ]);
    if (!authResult.proceed) {
      return authResult.response;
    }
    const { payload } = authResult;

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const where: {
      complexId: number;
      status?: string;
      priority?: string;
      OR?: (
        | { subject: { contains: string; mode: "insensitive" } }
        | { description: { contains: string; mode: "insensitive" } }
      )[];
      reportedById?: number;
    } = { complexId: payload.complexId };

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    if (status) where.status = status;
    if (priority) where.priority = priority;

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Si es residente, solo mostrar sus PQRs
    if (payload.role === "RESIDENT") {
      where.reportedById = payload.id;
    }

    const pqrs = await tenantPrisma.pQR.findMany({
      where,
      include: {
        reportedBy: { select: { name: true } },
        assignedTo: { select: { name: true } },
        comments: { include: { author: { select: { name: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedPQRs = pqrs.map((pqr) => ({
      ...pqr,
      reportedByName: pqr.reportedBy?.name || "N/A",
      assignedToName: pqr.assignedTo?.name || "N/A",
      comments: pqr.comments.map((comment) => ({
        ...comment,
        authorName: comment.author?.name || "N/A",
      })),
    }));

    ServerLogger.info(`PQRs listadas para el complejo ${payload.complexId}`);
    return NextResponse.json(formattedPQRs, { status: 200 });
  } catch (error) {
    ServerLogger.error("Error al obtener PQRs:", error);
    return NextResponse.json(
      { message: "Error al obtener PQRs" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const validatedData = PQRSchema.parse({
      ...body,
      reportedById: payload.id,
    });

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);
    const newPQR = await tenantPrisma.pQR.create({ data: validatedData });

    ServerLogger.info(
      `PQR creada: ${newPQR.subject} por ${payload.email} en complejo ${payload.complexId}`,
    );
    return NextResponse.json(newPQR, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al crear PQR:", error);
    return NextResponse.json(
      { message: "Error al crear PQR" },
      { status: 500 },
    );
  }
}
