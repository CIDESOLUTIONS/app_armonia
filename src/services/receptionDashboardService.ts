import { fetchApi } from "@/lib/api";

interface Visitor {
  id: string;
  name: string;
  destinationUnit: string;
  checkInTime: string;
  checkOutTime: string | null;
  type: "visitor" | "service" | "delivery";
  status: "active" | "completed";
}

interface Incident {
  id: string;
  title: string;
  description: string;
  reportedAt: string;
  type: "security" | "maintenance" | "complaint" | "other";
  severity: "low" | "medium" | "high";
  status: "reported" | "inProgress" | "resolved";
}

interface ScheduledEvent {
  id: string;
  title: string;
  location: string;
  startTime: string;
  endTime: string;
  date: string;
  type: "reservation" | "maintenance" | "meeting" | "other";
}

interface Package {
  id: string;
  description: string;
  recipient: string;
  unit: string;
  receivedAt: string;
  deliveredAt: string | null;
  status: "pending" | "delivered";
}

interface DashboardData {
  activeVisitors: Visitor[];
  pendingPackages: Package[];
  recentIncidents: Incident[];
  todayEvents: ScheduledEvent[];
  stats: {
    visitorsToday: number;
    pendingPackages: number;
    activeIncidents: number;
    securityAlerts: number;
  };
}

export async function getReceptionDashboardData(): Promise<DashboardData> {
  try {
    const response = await fetchApi("/api/reception-dashboard");
    return response;
  } catch (error) {
    console.error("Error fetching reception dashboard data:", error);
    throw error;
  }
}
