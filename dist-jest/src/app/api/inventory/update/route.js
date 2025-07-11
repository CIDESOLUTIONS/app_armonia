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
// src/app/api/inventory/update/route.ts
import { NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
export function GET(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Validación de autenticación
            const _token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            if (!token) {
                return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
            }
            // Variable decoded eliminada por lint
            // Obtener y validar parámetros
            const { searchParams } = new URL(req.url);
            const _complexId = searchParams.get('complexId');
            const _schemaName = searchParams.get('schemaName');
            console.log('[API Inventory/Update GET] Params:', { complexId, schemaName });
            if (!complexId || !schemaName) {
                return NextResponse.json({ message: 'Faltan parámetros requeridos' }, { status: 400 });
            }
            // Obtener datos del conjunto desde ambos schemas
            const mainPrisma = getPrisma('armonia');
            const tenantPrisma = getPrisma(schemaName);
            // Ejecutar consultas en paralelo
            const [mainComplex, tenantComplexData] = yield Promise.all([
                mainPrisma.residentialComplex.findUnique({
                    where: { id: parseInt(complexId) },
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        city: true,
                        state: true,
                        country: true,
                        adminName: true,
                        adminEmail: true,
                        adminPhone: true,
                        adminDNI: true,
                        adminAddress: true,
                        totalUnits: true,
                        createdAt: true,
                    }
                }),
                tenantPrisma.$queryRaw `
        SELECT 
          total_properties,
          total_residents,
          property_types,
          created_at,
          updated_at
        FROM "${schemaName}"."ResidentialComplex"
        WHERE id = ${parseInt(complexId)}
      `
            ]);
            if (!mainComplex) {
                return NextResponse.json({ message: 'Conjunto no encontrado' }, { status: 404 });
            }
            // Combinar datos de ambos schemas
            const complexData = Object.assign(Object.assign({}, mainComplex), (Array.isArray(tenantComplexData) && tenantComplexData[0]
                ? tenantComplexData[0]
                : {}));
            console.log('[API Inventory/Update GET] Sending data:', complexData);
            return NextResponse.json({
                complex: complexData,
                message: 'Datos obtenidos exitosamente'
            });
        }
        catch (error) {
            console.error('[API Inventory/Update GET] Error:', error);
            return NextResponse.json({
                message: 'Error al obtener datos del conjunto',
                error: error instanceof Error ? error.message : 'Error desconocido'
            }, { status: 500 });
        }
    });
}
export function POST(_req) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            // Validación de autenticación
            const _token = (_a = req.headers.get('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
            if (!token) {
                return NextResponse.json({ message: 'No autorizado' }, { status: 401 });
            }
            // Variable decoded eliminada por lint
            // Obtener y validar body
            const body = yield req.json();
            console.log('[API Inventory/Update POST] Received data:', body);
            const { complexId, schemaName } = body, updateData = __rest(body, ["complexId", "schemaName"]);
            if (!complexId || !schemaName) {
                return NextResponse.json({ message: 'Faltan datos requeridos (complexId o schemaName)' }, { status: 400 });
            }
            // Actualizar en ambos schemas
            const mainPrisma = getPrisma('armonia');
            const tenantPrisma = getPrisma(schemaName);
            // Actualizar en schema principal
            const mainUpdate = yield mainPrisma.residentialComplex.update({
                where: { id: parseInt(complexId) },
                data: {
                    name: updateData.name,
                    address: updateData.address,
                    city: updateData.city,
                    state: updateData.state,
                    country: updateData.country,
                    adminName: updateData.adminName,
                    adminEmail: updateData.adminEmail,
                    adminPhone: updateData.adminPhone,
                    adminDNI: updateData.adminDNI,
                    adminAddress: updateData.adminAddress,
                    updatedAt: new Date()
                }
            });
            // Actualizar en schema del tenant
            const tenantUpdate = yield tenantPrisma.$executeRaw `
      UPDATE "${schemaName}"."ResidentialComplex"
      SET
        name = ${updateData.name},
        address = ${updateData.address},
        city = ${updateData.city},
        state = ${updateData.state},
        country = ${updateData.country},
        "adminName" = ${updateData.adminName},
        "adminEmail" = ${updateData.adminEmail},
        "adminPhone" = ${updateData.adminPhone},
        "adminDNI" = ${updateData.adminDNI},
        "adminAddress" = ${updateData.adminAddress},
        updated_at = ${new Date()}
      WHERE id = ${parseInt(complexId)}
    `;
            console.log('[API Inventory/Update POST] Updated data:', {
                main: mainUpdate,
                tenant: tenantUpdate
            });
            return NextResponse.json({
                message: 'Conjunto actualizado exitosamente',
                complex: mainUpdate
            });
        }
        catch (error) {
            console.error('[API Inventory/Update POST] Error:', error);
            return NextResponse.json({
                message: 'Error al actualizar el conjunto',
                error: error instanceof Error ? error.message : 'Error desconocido'
            }, { status: 500 });
        }
    });
}
