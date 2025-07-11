var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';
import { ServerLogger } from '@/lib/logging/server-logger';
import { z } from 'zod';
// Esquema de validación para creación de cámara
const cameraCreateSchema = z.object({
    name: z.string().min(1, "El nombre es requerido"),
    location: z.string().min(1, "La ubicación es requerida"),
    ipAddress: z.string().ip("Dirección IP inválida"),
    port: z.number().int().positive().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    model: z.string().optional(),
    brand: z.string().optional(),
    isActive: z.boolean().default(true),
    streamUrl: z.string().url("URL de stream inválida").optional(),
    type: z.enum(["PTZ", "FIXED", "DOME"]).optional(),
});
/**
 * Endpoint para obtener todas las cámaras
 * GET /api/cameras
 */
export function GET(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar autenticación
            const { auth, payload } = yield verifyAuth(req);
            if (!auth || !payload) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            if (!payload.complexId) {
                return NextResponse.json({ error: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            // Obtener parámetros
            const searchParams = req.nextUrl.searchParams;
            const includeInactive = searchParams.get('includeInactive') === 'true';
            // Inicializar Prisma
            const prisma = getPrisma();
            // Obtener cámaras con filtro multi-tenant
            const cameras = yield prisma.camera.findMany({
                where: Object.assign({ complexId: payload.complexId }, (includeInactive ? {} : { isActive: true })),
                orderBy: {
                    name: 'asc'
                }
            });
            // Devolver respuesta
            return NextResponse.json(cameras);
        }
        catch (error) {
            ServerLogger.error('Error en GET /api/cameras:', error);
            return NextResponse.json({ error: 'Error al obtener cámaras' }, { status: 500 });
        }
    });
}
/**
 * Endpoint para crear una nueva cámara
 * POST /api/cameras
 */
export function POST(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar autenticación
            const { auth, payload } = yield verifyAuth(req);
            if (!auth || !payload) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            // Verificar rol de administrador
            if (payload.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Se requiere rol de administrador' }, { status: 403 });
            }
            if (!payload.complexId) {
                return NextResponse.json({ error: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            // Obtener datos de la solicitud
            const data = yield req.json();
            // Validar datos
            const validationResult = cameraCreateSchema.safeParse(data);
            if (!validationResult.success) {
                return NextResponse.json({ error: 'Datos inválidos', details: validationResult.error.format() }, { status: 400 });
            }
            // Inicializar Prisma
            const prisma = getPrisma();
            // Crear cámara con filtro multi-tenant
            const camera = yield prisma.camera.create({
                data: Object.assign(Object.assign({}, validationResult.data), { complexId: payload.complexId, createdById: payload.id })
            });
            // Registrar acción
            yield prisma.activityLog.create({
                data: {
                    action: 'CREATE',
                    entityType: 'CAMERA',
                    entityId: camera.id.toString(),
                    userId: payload.id,
                    complexId: payload.complexId,
                    details: `Cámara ${camera.name} creada`
                }
            });
            // Devolver respuesta
            return NextResponse.json(camera, { status: 201 });
        }
        catch (error) {
            ServerLogger.error('Error en POST /api/cameras:', error);
            return NextResponse.json({ error: error instanceof Error ? error.message : 'Error al crear cámara' }, { status: 500 });
        }
    });
}
/**
 * Endpoint para descubrir cámaras en la red
 * POST /api/cameras/discover
 */
export function POST_discover(req) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Verificar autenticación
            const { auth, payload } = yield verifyAuth(req);
            if (!auth || !payload) {
                return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
            }
            // Verificar rol de administrador
            if (payload.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Se requiere rol de administrador' }, { status: 403 });
            }
            if (!payload.complexId) {
                return NextResponse.json({ error: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            // Inicializar Prisma
            const prisma = getPrisma();
            // Aquí iría la lógica de descubrimiento de cámaras
            // Por ahora devolvemos un mock
            const discoveredCameras = [
                {
                    ipAddress: '192.168.1.100',
                    port: 554,
                    brand: 'Hikvision',
                    model: 'DS-2CD2032-I'
                },
                {
                    ipAddress: '192.168.1.101',
                    port: 554,
                    brand: 'Dahua',
                    model: 'IPC-HDW4631C-A'
                }
            ];
            // Devolver respuesta
            return NextResponse.json({
                success: true,
                cameras: discoveredCameras
            });
        }
        catch (error) {
            ServerLogger.error('Error en POST /api/cameras/discover:', error);
            return NextResponse.json({ error: 'Error al descubrir cámaras' }, { status: 500 });
        }
    });
}
