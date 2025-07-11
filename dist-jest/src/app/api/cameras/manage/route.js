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
// src/app/api/cameras/manage/route.ts
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { cameraService } from '@/lib/services/camera-service-onvif';
import { z } from 'zod';
// Schema para registro de cámaras
const RegisterCameraSchema = z.object({
    name: z.string().min(1).max(100),
    ipAddress: z.string().ip(),
    port: z.number().min(1).max(65535).default(554),
    username: z.string().optional(),
    password: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    zoneId: z.number().optional(),
    ptzEnabled: z.boolean().default(false),
    recordingEnabled: z.boolean().default(false)
});
// Schema para actualización de cámaras
const UpdateCameraSchema = z.object({
    id: z.number(),
    name: z.string().min(1).max(100).optional(),
    ipAddress: z.string().ip().optional(),
    port: z.number().min(1).max(65535).optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    zoneId: z.number().optional(),
    ptzEnabled: z.boolean().optional(),
    recordingEnabled: z.boolean().optional(),
    isActive: z.boolean().optional()
});
// POST: Registrar nueva cámara
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            if (!['ADMIN', 'COMPLEX_ADMIN'].includes(payload.role)) {
                return NextResponse.json({
                    message: 'Solo administradores pueden registrar cámaras'
                }, { status: 403 });
            }
            if (!payload.complexId) {
                return NextResponse.json({
                    message: 'Usuario sin complejo asociado'
                }, { status: 400 });
            }
            const body = yield request.json();
            const validation = RegisterCameraSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({
                    message: 'Datos inválidos',
                    errors: validation.error.format()
                }, { status: 400 });
            }
            const data = validation.data;
            // Crear objeto CameraDevice
            const cameraDevice = {
                name: data.name,
                ipAddress: data.ipAddress,
                port: data.port,
                username: data.username,
                password: data.password,
                manufacturer: data.manufacturer,
                model: data.model,
                capabilities: {
                    hasVideo: true,
                    hasAudio: false,
                    hasPTZ: data.ptzEnabled,
                    hasPresets: data.ptzEnabled,
                    hasEvents: false,
                    hasRecording: data.recordingEnabled,
                    supportedProfiles: ['Profile_1'],
                    supportedResolutions: ['1920x1080', '1280x720']
                },
                status: 'UNKNOWN'
            };
            // Registrar en base de datos
            const cameraId = yield cameraService.registerCamera(cameraDevice, payload.complexId, data.zoneId);
            // Intentar conectar para verificar
            const connected = yield cameraService.connectCamera(cameraId);
            console.log(`[CAMERA REGISTER] Cámara ${data.name} registrada por ${payload.email}`);
            return NextResponse.json({
                success: true,
                message: 'Cámara registrada exitosamente',
                cameraId,
                connected,
                camera: Object.assign({ id: cameraId }, cameraDevice)
            });
        }
        catch (error) {
            console.error('[CAMERA REGISTER] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error registrando cámara'
            }, { status: 500 });
        }
    });
}
// PUT: Actualizar cámara existente
export function PUT(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            if (!['ADMIN', 'COMPLEX_ADMIN'].includes(payload.role)) {
                return NextResponse.json({
                    message: 'Solo administradores pueden actualizar cámaras'
                }, { status: 403 });
            }
            const body = yield request.json();
            const validation = UpdateCameraSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({
                    message: 'Datos inválidos',
                    errors: validation.error.format()
                }, { status: 400 });
            }
            const _a = validation.data, { id } = _a, updates = __rest(_a, ["id"]);
            // Actualizar cámara
            const success = yield cameraService.updateCamera(id, updates);
            if (!success) {
                return NextResponse.json({
                    message: 'Error actualizando cámara'
                }, { status: 500 });
            }
            console.log(`[CAMERA UPDATE] Cámara ${id} actualizada por ${payload.email}`);
            return NextResponse.json({
                success: true,
                message: 'Cámara actualizada exitosamente',
                cameraId: id
            });
        }
        catch (error) {
            console.error('[CAMERA UPDATE] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error actualizando cámara'
            }, { status: 500 });
        }
    });
}
// DELETE: Eliminar cámara
export function DELETE(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            if (!['ADMIN', 'COMPLEX_ADMIN'].includes(payload.role)) {
                return NextResponse.json({
                    message: 'Solo administradores pueden eliminar cámaras'
                }, { status: 403 });
            }
            const { searchParams } = new URL(request.url);
            const cameraId = searchParams.get('id');
            if (!cameraId || isNaN(Number(cameraId))) {
                return NextResponse.json({
                    message: 'ID de cámara requerido'
                }, { status: 400 });
            }
            // Eliminar cámara
            const success = yield cameraService.deleteCamera(Number(cameraId));
            if (!success) {
                return NextResponse.json({
                    message: 'Error eliminando cámara'
                }, { status: 500 });
            }
            console.log(`[CAMERA DELETE] Cámara ${cameraId} eliminada por ${payload.email}`);
            return NextResponse.json({
                success: true,
                message: 'Cámara eliminada exitosamente'
            });
        }
        catch (error) {
            console.error('[CAMERA DELETE] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error eliminando cámara'
            }, { status: 500 });
        }
    });
}
