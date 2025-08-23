import { fetchApi } from "@/lib/api";

// Define interfaces based on the backend DTOs
export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  billingCycle: string;
  features: string[];
  isActive: boolean;
  subscriberCount?: number;
}

export async function getPlans(includeInactive = false): Promise<Plan[]> {
  const response = await fetchApi(`/plans?includeInactive=${includeInactive}`);
  return response.data || response;
}

export async function getPlanById(id: string): Promise<Plan> {
  const response = await fetchApi(`/plans/${id}`);
  return response.data || response;
}

export async function createPlan(planData: Partial<Plan>): Promise<Plan> {
  const response = await fetchApi("/plans", {
    method: "POST",
    body: JSON.stringify(planData),
  });
  return response.data || response;
}

export async function updatePlan(id: string, planData: Partial<Plan>): Promise<Plan> {
  const response = await fetchApi(`/plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(planData),
  });
  return response.data || response;
}
