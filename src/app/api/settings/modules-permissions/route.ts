import { NextRequest, NextResponse } from "next/server";
import { getTenantPrismaClient } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";
import { ServerLogger } from "@/lib/logging/server-logger";
import { z } from "zod";

const PermissionSchema = z.object({
  role: z.string(),
  canView: z.boolean(),
  canEdit: z.boolean(),
});

const ModuleConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  enabled: z.boolean(),
  permissions: z.array(PermissionSchema),
});

export async function GET(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!["ADMIN", "COMPLEX_ADMIN"].includes(payload.role)) {
      return NextResponse.json(
        { message: "Permisos insuficientes" },
        { status: 403 },
      );
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    // Asumiendo que la configuración de módulos y permisos se guarda en una tabla como ModuleSettings
    // O se puede tener una configuración por defecto y permitir sobrescribirla
    const moduleSettings = await tenantPrisma.moduleSettings.findMany({
      where: { complexId: payload.complexId },
      include: { permissions: true },
    });

    if (moduleSettings.length === 0) {
      // Si no hay configuración, devolver una configuración por defecto
      return NextResponse.json([
        {
          id: "inventory",
          name: "Gestión de Inventario",
          description:
            "Permite administrar propiedades, residentes, vehículos y mascotas.",
          enabled: true,
          permissions: [
            { role: "ADMIN", canView: true, canEdit: true },
            { role: "COMPLEX_ADMIN", canView: true, canEdit: true },
            { role: "STAFF", canView: true, canEdit: false },
            { role: "RESIDENT", canView: false, canEdit: false },
          ],
        },
        {
          id: "finances",
          name: "Gestión Financiera",
          description:
            "Control de ingresos, egresos, presupuestos y cuotas.",
          enabled: true,
          permissions: [
            { role: "ADMIN", canView: true, canEdit: true },
            { role: "COMPLEX_ADMIN", canView: true, canEdit: true },
            { role: "STAFF", canView: false, canEdit: false },
            { role: "RESIDENT", canView: true, canEdit: false },
          ],
        },
        {
          id: "assemblies",
          name: "Gestión de Asambleas",
          description:
            "Programación, votaciones y actas de asambleas.",
          enabled: true,
          permissions: [
            { role: "ADMIN", canView: true, canEdit: true },
            { role: "COMPLEX_ADMIN", canView: true, canEdit: true },
            { role: "STAFF", canView: true, canEdit: false },
            { role: "RESIDENT", canView: true, canEdit: false },
          ],
        },
      ], { status: 200 });
    }

    ServerLogger.info(
      `Configuración de módulos y permisos obtenida para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(moduleSettings, { status: 200 });
  } catch (error) {
    ServerLogger.error("Error al obtener configuración de módulos y permisos:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { auth, payload } = await verifyAuth(request);
    if (!auth || !payload) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 });
    }

    if (!["ADMIN", "COMPLEX_ADMIN"].includes(payload.role)) {
      return NextResponse.json(
        { message: "Permisos insuficientes" },
        { status: 403 },
      );
    }

    if (!payload.complexId || !payload.schemaName) {
      return NextResponse.json(
        { message: "Usuario sin complejo o esquema asociado" },
        { status: 400 },
      );
    }

    const body = await request.json();
    const validatedData = z.array(ModuleConfigSchema).parse(body);

    const tenantPrisma = getTenantPrismaClient(payload.schemaName);

    // Eliminar la configuración existente para este complejo
    await tenantPrisma.moduleSettings.deleteMany({
      where: { complexId: payload.complexId },
    });

    // Crear la nueva configuración
    const createdSettings = [];
    for (const moduleConfig of validatedData) {
      const newModuleSetting = await tenantPrisma.moduleSettings.create({
        data: {
          complexId: payload.complexId,
          id: moduleConfig.id,
          name: moduleConfig.name,
          description: moduleConfig.description,
          enabled: moduleConfig.enabled,
          permissions: {
            create: moduleConfig.permissions.map((p) => ({
              role: p.role,
              canView: p.canView,
              canEdit: p.canEdit,
            })),
          },
        },
      });
      createdSettings.push(newModuleSetting);
    }

    ServerLogger.info(
      `Configuración de módulos y permisos actualizada para el complejo ${payload.complexId}`,
    );
    return NextResponse.json(createdSettings, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Error de validación", errors: error.errors },
        { status: 400 },
      );
    }
    ServerLogger.error("Error al actualizar configuración de módulos y permisos:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
