import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { getFinancialSummary } from "@/services/financeService"; // Asumiendo que existe
import { getPQRSnapshots } from "@/services/pqrService"; // Asumiendo que existe
import { getTodayReservations } from "@/services/reservationService"; // Asumiendo que existe
import { getLatestAnnouncements } from "@/services/communicationService"; // Asumiendo que existe

interface DashboardData {
  portfolioStatus: string;
  pendingPQRs: number;
  todayReservations: number;
  latestAnnouncements: string[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData(): DashboardData {
  const { user } = useAuthStore();
  const [portfolioStatus, setPortfolioStatus] = useState("Cargando...");
  const [pendingPQRs, setPendingPQRs] = useState(0);
  const [todayReservations, setTodayReservations] = useState(0);
  const [latestAnnouncements, setLatestAnnouncements] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!user?.complexId) {
      setError("No se pudo cargar el dashboard: ID de complejo no disponible.");
      setLoading(false);
      return;
    }

    try {
      // Obtener estado de cartera
      const financialSummary = await getFinancialSummary(user.complexId);
      setPortfolioStatus(
        financialSummary.totalIncome.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        }),
      );

      // Obtener PQR pendientes
      const pqrSnapshots = await getPQRSnapshots(user.complexId, {
        status: "PENDING",
      });
      setPendingPQRs(pqrSnapshots.totalCount);

      // Obtener reservas del día
      const reservations = await getTodayReservations(user.complexId);
      setTodayReservations(reservations.length);

      // Obtener últimos comunicados
      const announcements = await getLatestAnnouncements(user.complexId, 3); // Obtener los 3 más recientes
      setLatestAnnouncements(announcements.map((ann: any) => ann.title));
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError("Error al cargar los datos del dashboard: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    portfolioStatus,
    pendingPQRs,
    todayReservations,
    latestAnnouncements,
    loading,
    error,
  };
}
