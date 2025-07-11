// src/hooks/useFreemiumPlan.ts
'use client';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '@/lib/api-client';
export function useFreemiumPlan() {
    const [planStatus, setPlanStatus] = useState(null);
    const [availablePlans, setAvailablePlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const loadPlanStatus = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.get('/plans/status');
            setPlanStatus(response);
        }
        catch (err) {
            console.error('Error cargando estado del plan:', err);
            setError(err instanceof Error ? err.message : 'Error cargando información del plan');
        }
        finally {
            setLoading(false);
        }
    }), []);
    const loadAvailablePlans = useCallback(() => __awaiter(this, void 0, void 0, function* () {
        try {
            setError(null);
            const response = yield apiClient.get('/plans/upgrade');
            setAvailablePlans(response.availablePlans || []);
        }
        catch (err) {
            console.error('Error cargando planes disponibles:', err);
            setError(err instanceof Error ? err.message : 'Error cargando planes disponibles');
        }
    }), []);
    const upgradePlan = useCallback((targetPlan, billingData) => __awaiter(this, void 0, void 0, function* () {
        try {
            setLoading(true);
            setError(null);
            const response = yield apiClient.post('/plans/upgrade', Object.assign({ targetPlan }, billingData));
            if (response.success) {
                // Recargar estado del plan después del upgrade
                yield loadPlanStatus();
                return response;
            }
            throw new Error(response.message || 'Error en el upgrade');
        }
        catch (err) {
            console.error('Error en upgrade de plan:', err);
            setError(err instanceof Error ? err.message : 'Error actualizando plan');
            throw err;
        }
        finally {
            setLoading(false);
        }
    }), [loadPlanStatus]);
    const hasFeatureAccess = useCallback((feature) => {
        if (!planStatus)
            return false;
        // Durante trial, permitir acceso a funcionalidades estándar
        if (planStatus.trial.isActive) {
            return true; // O verificar contra lista de features estándar
        }
        return planStatus.currentPlan.features.includes(feature);
    }, [planStatus]);
    const isUpgradeRequired = useCallback((feature) => {
        return !hasFeatureAccess(feature);
    }, [hasFeatureAccess]);
    const getUpgradeMessage = useCallback((feature) => {
        if (!planStatus)
            return 'Plan no disponible';
        if (planStatus.upgrade.missingFeaturesStandard.includes(feature)) {
            return 'Esta funcionalidad está disponible en el Plan Estándar';
        }
        if (planStatus.upgrade.missingFeaturesPremium.includes(feature)) {
            return 'Esta funcionalidad está disponible en el Plan Premium';
        }
        return 'Funcionalidad disponible en su plan actual';
    }, [planStatus]);
    // Cargar datos al montar el componente
    useEffect(() => {
        loadPlanStatus();
        loadAvailablePlans();
    }, [loadPlanStatus, loadAvailablePlans]);
    return {
        planStatus,
        availablePlans,
        loading,
        error,
        loadPlanStatus,
        loadAvailablePlans,
        upgradePlan,
        hasFeatureAccess,
        isUpgradeRequired,
        getUpgradeMessage,
        isTrialActive: (planStatus === null || planStatus === void 0 ? void 0 : planStatus.trial.isActive) || false,
        currentPlan: (planStatus === null || planStatus === void 0 ? void 0 : planStatus.currentPlan.type) || 'BASIC',
        unitsWithinLimit: (planStatus === null || planStatus === void 0 ? void 0 : planStatus.validation.unitsWithinLimit) || true
    };
}
export default useFreemiumPlan;
