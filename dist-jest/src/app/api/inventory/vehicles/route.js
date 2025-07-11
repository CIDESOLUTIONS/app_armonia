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
import { authMiddleware } from '@/lib/auth';
import { z } from 'zod';
import { ServerLogger } from '@/lib/logging/server-logger';
const VehicleSchema = z.object({
    licensePlate: z.string().min(1, "La placa es requerida."),
    brand: z.string().min(1, "La marca es requerida."),
    model: z.string().min(1, "El modelo es requerido."),
    color: z.string().min(1, "El color es requerido."),
    ownerName: z.string().min(1, "El nombre del propietario es requerido."),
    propertyId: z.number().int().positive("ID de propiedad inválido."),
    parkingSpace: z.string().optional(),
    isActive: z.boolean().default(true),
});
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authResult = yield authMiddleware(request, ['ADMIN', 'COMPLEX_ADMIN']);
            if (!authResult.proceed) {
                return authResult.response;
            }
            const { payload } = authResult;
            const tenantPrisma = getPrisma(payload.schemaName);
            const vehicles = yield tenantPrisma.vehicle.findMany({
                include: {
                    property: { select: { unitNumber: true } },
                },
            });
            const vehiclesWithUnitNumber = vehicles.map(vehicle => {
                var _a;
                return (Object.assign(Object.assign({}, vehicle), { unitNumber: ((_a = vehicle.property) === null || _a === void 0 ? void 0 : _a.unitNumber) || 'N/A' }));
            });
            ServerLogger.info(`Vehículos listados para el complejo ${payload.complexId}`);
            return NextResponse.json(vehiclesWithUnitNumber, { status: 200 });
        }
        catch (error) {
            ServerLogger.error('Error al obtener vehículos:', error);
            return NextResponse.json({ message: 'Error al obtener vehículos' }, { status: 500 });
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
            const validatedData = VehicleSchema.parse(body);
            const tenantPrisma = getPrisma(payload.schemaName);
            const newVehicle = yield tenantPrisma.vehicle.create({ data: validatedData });
            ServerLogger.info(`Vehículo creado: ${newVehicle.licensePlate} en complejo ${payload.complexId}`);
            return NextResponse.json(newVehicle, { status: 201 });
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return NextResponse.json({ message: 'Error de validación', errors: error.errors }, { status: 400 });
            }
            ServerLogger.error('Error al crear vehículo:', error);
            return NextResponse.json({ message: 'Error al crear vehículo' }, { status: 500 });
        }
    });
}
