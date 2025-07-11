var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';
const CameraSchema = z.object({
    name: z.string().min(1, "El nombre es requerido."),
    ipAddress: z.string().ip({ version: 'v4', message: "Dirección IP inválida." }),
    port: z.number().int().min(1).max(65535, "Puerto inválido.").default(80),
    username: z.string().optional(),
    password: z.string().optional(),
    location: z.string().min(1, "La ubicación es requerida."),
    isActive: z.boolean().default(true),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN', 'STAFF']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const tenantPrisma = getPrisma(payload.schemaName);
            const cameras = yield tenantPrisma.camera.findMany({
                where: { complexId: payload.complexId },
            });
            ServerLogger.info(`Cámaras listadas para el complejo ${payload.complexId}`);
            return NextResponse.json(cameras, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener cámaras:', error);
            return NextResponse.json({ message: 'Error al obtener cámaras' }, { status: 500 });
        }
    });
}
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const body = yield request.json();
            const validatedData = CameraSchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const newCamera = yield tenantPrisma.camera.create({
                data: Object.assign(Object.assign({}, validatedData), { complexId: payload.complexId }),
            });
            ServerLogger.info(`Cámara creada: ${newCamera.name} en complejo ${payload.complexId}`);
            return NextResponse.json(newCamera, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear cámara:', error);
            return NextResponse.json({ message: 'Error al crear cámara' }, { status: 500 });
        }
    });
}
export function PUT(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const _a = yield request.json(), { id } = _a, updateData = __rest(_a, ["id"]);
            const validatedData = CameraSchema.partial().parse(updateData); // Partial para actualizaciones
            if (!id) {
                return NextResponse.json({ message: 'ID de cámara requerido para actualizar' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(payload.schemaName);
            const updatedCamera = yield tenantPrisma.camera.update({
                where: { id: parseInt(id) },
                data: validatedData,
            });
            ServerLogger.info(`Cámara actualizada: ${updatedCamera.name} en complejo ${payload.complexId}`);
            return NextResponse.json(updatedCamera, { status: 200 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al actualizar cámara:', error);
            return NextResponse.json({ message: 'Error al actualizar cámara' }, { status: 500 });
        }
    });
}
export function DELETE(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const { id } = yield request.json();
            if (!id) {
                return NextResponse.json({ message: 'ID de cámara requerido para eliminar' }, { status: 400 });
            }
            const tenantPrisma = getPrisma(payload.schemaName);
            yield tenantPrisma.camera.delete({ where: { id: parseInt(id) } });
            ServerLogger.info(`Cámara eliminada: ID ${id} en complejo ${payload.complexId}`);
            return NextResponse.json({ message: 'Cámara eliminada exitosamente' }, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al eliminar cámara:', error);
            return NextResponse.json({ message: 'Error al eliminar cámara' }, { status: 500 });
        }
    });
}
