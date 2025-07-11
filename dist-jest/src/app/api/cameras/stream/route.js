var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/app/api/cameras/stream/route.ts
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { cameraService } from '@/lib/services/camera-service-onvif';
import { z } from 'zod';
// Schema para solicitud de stream
const StreamRequestSchema = z.object({
    cameraId: z.number(),
    profileToken: z.string().optional().default('Profile_1'),
    streamType: z.enum(['rtsp', 'hls', 'webrtc']).optional().default('rtsp')
});
// Schema para snapshot
const SnapshotRequestSchema = z.object({
    cameraId: z.number(),
    quality: z.enum(['high', 'medium', 'low']).optional().default('medium')
});
// POST: Obtener URL de stream
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            // Verificar permisos para ver cámaras
            if (!['ADMIN', 'COMPLEX_ADMIN', 'RECEPTION', 'RESIDENT'].includes(payload.role)) {
                return NextResponse.json({
                    message: 'Sin permisos para ver streams'
                }, { status: 403 });
            }
            const body = yield request.json();
            const validation = StreamRequestSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({
                    message: 'Datos inválidos',
                    errors: validation.error.format()
                }, { status: 400 });
            }
            const { cameraId, profileToken, streamType } = validation.data;
            // Verificar que la cámara esté conectada
            const connected = yield cameraService.connectCamera(cameraId);
            if (!connected) {
                return NextResponse.json({
                    message: 'No se pudo conectar a la cámara'
                }, { status: 503 });
            }
            // Obtener perfiles disponibles
            const profiles = yield cameraService.getStreamProfiles(cameraId);
            if (profiles.length === 0) {
                return NextResponse.json({
                    message: 'No hay perfiles de stream disponibles'
                }, { status: 404 });
            }
            // Obtener URI del stream
            const streamUri = yield cameraService.getStreamUri(cameraId, profileToken);
            console.log(`[STREAM REQUEST] Stream solicitado para cámara ${cameraId} por ${payload.email}`);
            return NextResponse.json({
                success: true,
                streamUri,
                streamType,
                profiles,
                cameraId,
                connectedAt: new Date().toISOString()
            });
        }
        catch (error) {
            console.error('[STREAM REQUEST] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error obteniendo stream'
            }, { status: 500 });
        }
    });
}
// GET: Capturar snapshot
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            if (!['ADMIN', 'COMPLEX_ADMIN', 'RECEPTION'].includes(payload.role)) {
                return NextResponse.json({
                    message: 'Sin permisos para capturar imágenes'
                }, { status: 403 });
            }
            const { searchParams } = new URL(request.url);
            const cameraId = searchParams.get('cameraId');
            const quality = searchParams.get('quality') || 'medium';
            if (!cameraId || isNaN(Number(cameraId))) {
                return NextResponse.json({
                    message: 'ID de cámara requerido'
                }, { status: 400 });
            }
            // Validar datos
            const validation = SnapshotRequestSchema.safeParse({
                cameraId: Number(cameraId),
                quality
            });
            if (!validation.success) {
                return NextResponse.json({
                    message: 'Parámetros inválidos'
                }, { status: 400 });
            }
            // Conectar y capturar snapshot
            const connected = yield cameraService.connectCamera(Number(cameraId));
            if (!connected) {
                return NextResponse.json({
                    message: 'No se pudo conectar a la cámara'
                }, { status: 503 });
            }
            const imageBuffer = yield cameraService.captureSnapshot(Number(cameraId));
            console.log(`[SNAPSHOT] Imagen capturada de cámara ${cameraId} por ${payload.email}`);
            // Retornar imagen como respuesta binaria
            return new NextResponse(imageBuffer, {
                headers: {
                    'Content-Type': 'image/jpeg',
                    'Content-Length': imageBuffer.length.toString(),
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        }
        catch (error) {
            console.error('[SNAPSHOT] Error:', error);
            return NextResponse.json({
                message: error instanceof Error ? error.message : 'Error capturando imagen'
            }, { status: 500 });
        }
    });
}
