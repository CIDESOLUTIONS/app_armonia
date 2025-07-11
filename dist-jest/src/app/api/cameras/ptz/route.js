var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/cameras/ptz/route.ts
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { cameraService } from '@/lib/services/camera-service-onvif';
import { z } from 'zod';
// Schema para control PTZ
const PTZControlSchema = z.object({
    cameraId: z.number(),
    action: z.enum(['move', 'stop', 'preset', 'home']),
    params: z.object({
        // Para movimiento absoluto
        x: z.number().min(-1).max(1).optional(),
        y: z.number().min(-1).max(1).optional(),
        z: z.number().min(0).max(1).optional(),
        // Para movimiento relativo
        panSpeed: z.number().min(-1).max(1).optional(),
        tiltSpeed: z.number().min(-1).max(1).optional(),
        zoomSpeed: z.number().min(-1).max(1).optional(),
        // Para presets
        presetToken: z.string().optional(),
        presetName: z.string().optional(),
        // Duración para movimiento continuo
        duration: z.number().min(100).max(10000).optional()
    }).optional()
});
// POST: Controlar PTZ
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            // Solo admins y personal de seguridad pueden controlar PTZ
            if (!['ADMIN', 'COMPLEX_ADMIN', 'RECEPTION'].includes(payload.role)) {
                return NextResponse.json({
                    message: 'Sin permisos para controlar cámaras PTZ'
                }, { status: 403 });
            }
            const body = yield request.json();
            const validation = PTZControlSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({
                    message: 'Datos inválidos',
                    errors: validation.error.format()
                }, { status: 400 });
            }
            const { cameraId, action, params } = validation.data;
            // Verificar que la cámara esté conectada
            const connected = yield cameraService.connectCamera(cameraId);
            if (!connected) {
                return NextResponse.json({
                    message: 'No se pudo conectar a la cámara'
                }, { status: 503 });
            }
            // Ejecutar comando PTZ
            const success = yield cameraService.controlPTZ(cameraId, action, params);
            if (!success) {
                return NextResponse.json({
                    message: 'Error ejecutando comando PTZ'
                }, { status: 500 });
            }
            console.log(`[PTZ CONTROL] ${action} ejecutado en cámara ${cameraId} por ${payload.email}`, params);
            return NextResponse.json({
                success: true,
                message: `Comando PTZ '${action}' ejecutado exitosamente`,
                cameraId,
                action,
                params,
                executedAt: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('[PTZ CONTROL] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error en control PTZ'
            }, { status: 500 });
        }
    });
}
// GET: Obtener capacidades PTZ de una cámara
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            if (!['ADMIN', 'COMPLEX_ADMIN', 'RECEPTION'].includes(payload.role)) {
                return NextResponse.json({
                    message: 'Sin permisos para ver capacidades PTZ'
                }, { status: 403 });
            }
            const { searchParams } = new URL(request.url);
            const cameraId = searchParams.get('cameraId');
            if (!cameraId || isNaN(Number(cameraId))) {
                return NextResponse.json({
                    message: 'ID de cámara requerido'
                }, { status: 400 });
            }
            // En modo desarrollo, retornar capacidades simuladas
            const mockPTZCapabilities = {
                absolute: true,
                relative: true,
                continuous: true,
                home: true,
                zoom: true,
                focus: false,
                iris: false,
                panRange: { min: -180, max: 180 },
                tiltRange: { min: -90, max: 90 },
                zoomRange: { min: 0, max: 100 },
                presets: [
                    { token: 'preset_1', name: 'Entrada Principal' },
                    { token: 'preset_2', name: 'Parking' },
                    { token: 'preset_3', name: 'Zona Común' }
                ]
            };
            return NextResponse.json({
                success: true,
                cameraId: Number(cameraId),
                ptzCapabilities: mockPTZCapabilities,
                supportedCommands: [
                    'absoluteMove',
                    'relativeMove',
                    'continuousMove',
                    'stop',
                    'gotoPreset',
                    'setPreset',
                    'removePreset',
                    'gotoHome',
                    'setHome'
                ]
            });
        }
        catch (error) {
            console.error('[PTZ CAPABILITIES] Error:', error);
            return NextResponse.json({
                message: 'Error obteniendo capacidades PTZ'
            }, { status: 500 });
        }
    });
}
