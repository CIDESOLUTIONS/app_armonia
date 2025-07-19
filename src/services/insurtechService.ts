import { fetchApi } from "@/lib/api";

export interface InsuranceQuote {
  quoteId: string;
  premium: number;
  currency: string;
  coverage: string;
  provider: string;
}

export interface Policy {
  policyId: string;
  status: string;
  startDate: string;
  endDate: string;
}

export async function getInsuranceQuote(data: any): Promise<InsuranceQuote> {
  try {
    const response = await fetchApi("/insurtech/quote", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error getting insurance quote:", error);
    throw error;
  }
}

export async function registerPolicy(data: any): Promise<Policy> {
  try {
    const response = await fetchApi("/insurtech/policy", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error registering policy:", error);
    throw error;
  }
}
