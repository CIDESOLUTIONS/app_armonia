"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { getFinancialSummary } from "@/services/financeService"; // Asumiendo que existe
import { getPQRSnapshots } from "@/services/pqrService"; // Asumiendo que existe

export const useDashboardData = () => {
  const { user, loading: authLoading } = useAuthStore();
  const [financialSummary, setFinancialSummary] = useState<any>(null);
  const [pqrSnapshots, setPqrSnapshots] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [financialData, pqrData] = await Promise.all([
        getFinancialSummary(),
        getPQRSnapshots(),
      ]);

      setFinancialSummary(financialData);
      setPqrSnapshots(pqrData);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Error al cargar datos del dashboard.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      fetchData();
    }
  }, [authLoading, fetchData]);

  return { financialSummary, pqrSnapshots, loading, error };
};