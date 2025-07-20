import { fetchApi } from "@/lib/api";

export interface SmartMeterReading {
  meterId: string;
  propertyId: number;
  reading: number;
  unit: string; // e.g., kWh, m3
  timestamp?: string;
}

export interface AutomatedBillingTrigger {
  billingPeriodStart: string;
  billingPeriodEnd: string;
  complexId: number; // Assuming complexId is needed for billing
}

export async function recordSmartMeterReading(
  data: SmartMeterReading,
): Promise<SmartMeterReading> {
  try {
    const response = await fetchApi("/iot/smart-meters/readings", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error recording smart meter reading:", error);
    throw error;
  }
}

export async function triggerAutomatedBilling(
  data: AutomatedBillingTrigger,
): Promise<any> {
  try {
    const response = await fetchApi("/iot/automated-billing/trigger", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error triggering automated billing:", error);
    throw error;
  }
}
