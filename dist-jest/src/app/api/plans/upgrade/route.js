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
// src/app/api/plans/upgrade/route.ts
import { NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';
import { FreemiumService, PLAN_FEATURES } from '@/lib/freemium-service';
import { z } from 'zod';
const UpgradeSchema = z.object({
    targetPlan: z.enum(['BASIC', 'STANDARD', 'PREMIUM']),
    billingEmail: z.string().email().optional(),
    billingName: z.string().min(1).optional(),
    billingAddress: z.string().optional(),
    billingCity: z.string().optional(),
    billingCountry: z.string().default('Colombia')
});
// POST: Upgrade plan
export function POST(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            if (!['ADMIN', 'COMPLEX_ADMIN'].includes(payload.role)) {
                return NextResponse.json({ message: 'Solo administradores pueden cambiar planes' }, { status: 403 });
            }
            if (!payload.complexId) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const body = yield request.json();
            const validation = UpgradeSchema.safeParse(body);
            if (!validation.success) {
                return NextResponse.json({ message: 'Datos inválidos', errors: validation.error.format() }, { status: 400 });
            }
            const _a = validation.data, { targetPlan } = _a, billingData = __rest(_a, ["targetPlan"]);
            const prisma = getPrisma();
            // Obtener complejo actual
            const complex = yield prisma.residentialComplex.findUnique({
                where: { id: payload.complexId },
                include: {
                    subscriptions: {
                        where: { isActive: true },
                        orderBy: { createdAt: 'desc' }
                    }
                }
            });
            if (!complex) {
                return NextResponse.json({ message: 'Complejo no encontrado' }, { status: 404 });
            }
            // Validar que el plan objetivo sea diferente al actual
            if (complex.planType === targetPlan) {
                return NextResponse.json({ message: 'Ya se encuentra en este plan' }, { status: 400 });
            }
            // Validar límites del nuevo plan
            const newPlanFeatures = PLAN_FEATURES[targetPlan];
            const unitsValidation = FreemiumService.validateUnitsLimit(targetPlan, complex.totalUnits, false // No es trial después del upgrade
            );
            if (!unitsValidation.isValid) {
                return NextResponse.json({
                    message: 'El nuevo plan no permite la cantidad actual de unidades',
                    validation: unitsValidation,
                    suggestion: `Considere el plan PREMIUM que permite hasta 80 unidades`
                }, { status: 400 });
            }
            // Calcular nuevo costo
            const newMonthlyCost = FreemiumService.calculateMonthlyCost(targetPlan, complex.totalUnits);
            const now = new Date();
            const endDate = targetPlan === 'BASIC' ? null : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días
            // Iniciar transacción
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // Desactivar suscripciones anteriores
                yield tx.subscription.updateMany({
                    where: {
                        complexId: payload.complexId,
                        isActive: true
                    },
                    data: { isActive: false }
                });
                // Actualizar el complejo
                const updatedComplex = yield tx.residentialComplex.update({
                    where: { id: payload.complexId },
                    data: {
                        planType: targetPlan,
                        planStartDate: now,
                        planEndDate: endDate,
                        isTrialActive: false, // Finalizar trial al hacer upgrade
                        maxUnits: newPlanFeatures.maxUnits
                    }
                });
                // Crear nueva suscripción si no es plan básico
                let newSubscription = null;
                if (targetPlan !== 'BASIC') {
                    newSubscription = yield tx.subscription.create({
                        data: {
                            complexId: payload.complexId,
                            planType: targetPlan,
                            startDate: now,
                            endDate: endDate,
                            isActive: true,
                            amount: newMonthlyCost,
                            currency: 'USD',
                            billingEmail: billingData.billingEmail || complex.adminEmail,
                            billingName: billingData.billingName || complex.adminName,
                            billingAddress: billingData.billingAddress || complex.address,
                            billingCity: billingData.billingCity || complex.city,
                            billingCountry: billingData.billingCountry
                        }
                    });
                }
                return { updatedComplex, newSubscription };
            }));
            console.log(`[PLANS UPGRADE] Complejo ${complex.name} actualizado de ${complex.planType} a ${targetPlan} por ${payload.email}`);
            const response = {
                success: true,
                message: `Plan actualizado exitosamente a ${targetPlan}`,
                previousPlan: complex.planType,
                newPlan: targetPlan,
                complex: {
                    id: result.updatedComplex.id,
                    name: result.updatedComplex.name,
                    planType: result.updatedComplex.planType,
                    maxUnits: result.updatedComplex.maxUnits
                },
                billing: {
                    monthlyCost: newMonthlyCost,
                    currency: 'USD',
                    nextBillingDate: endDate
                },
                subscription: result.newSubscription,
                features: {
                    gained: targetPlan !== 'BASIC' ?
                        FreemiumService.getMissingFeatures(complex.planType, targetPlan) : [],
                    available: newPlanFeatures.features
                }
            };
            return NextResponse.json(response, { status: 200 });
        }
        catch (error) {
            console.error('[PLANS UPGRADE] Error:', error);
            return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
        }
    });
}
// GET: Obtener información de planes disponibles
export function GET(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { auth, payload } = yield verifyAuth(request);
            if (!auth || !payload) {
                return NextResponse.json({ message: 'Token requerido' }, { status: 401 });
            }
            if (!payload.complexId) {
                return NextResponse.json({ message: 'Usuario sin complejo asociado' }, { status: 400 });
            }
            const prisma = getPrisma();
            // Obtener información del complejo
            const complex = yield prisma.residentialComplex.findUnique({
                where: { id: payload.complexId },
                select: { totalUnits: true, planType: true }
            });
            if (!complex) {
                return NextResponse.json({ message: 'Complejo no encontrado' }, { status: 404 });
            }
            // Generar información de todos los planes con costos
            const plans = Object.entries(PLAN_FEATURES).map(([planType, features]) => {
                const cost = FreemiumService.calculateMonthlyCost(planType, complex.totalUnits);
                const unitsValidation = FreemiumService.validateUnitsLimit(planType, complex.totalUnits, false);
                return {
                    type: planType,
                    name: planType.charAt(0) + planType.slice(1).toLowerCase(),
                    features: features.features,
                    maxUnits: features.maxUnits,
                    historyMonths: features.historyMonths,
                    basePrice: features.basePrice,
                    pricePerExtraUnit: features.pricePerExtraUnit,
                    monthlyCostForCurrentUnits: cost,
                    canUpgrade: unitsValidation.isValid && planType !== complex.planType,
                    isCurrent: planType === complex.planType,
                    validation: unitsValidation
                };
            });
            return NextResponse.json({
                currentUnits: complex.totalUnits,
                currentPlan: complex.planType,
                availablePlans: plans
            });
        }
        catch (error) {
            console.error('[PLANS GET] Error:', error);
            return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
        }
    });
}
