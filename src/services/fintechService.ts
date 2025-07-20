import { fetchApi } from "@/lib/api";

export interface MicroCreditRequest {
  amount: number;
  term: number;
  purpose: string;
}

export interface MicroCreditResponse {
  applicationId: string;
  status: string;
  amount: number;
  interestRate: number;
  term: number;
  provider: string;
}

export interface CreditScoreResponse {
  userId: number;
  score: number;
  provider: string;
}

export async function requestMicroCredit(
  data: MicroCreditRequest,
): Promise<MicroCreditResponse> {
  try {
    const response = await fetchApi("/fintech/micro-credit/request", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error requesting micro-credit:", error);
    throw error;
  }
}

export async function getCreditScore(
  userId: number,
): Promise<CreditScoreResponse> {
  try {
    const response = await fetchApi(`/fintech/credit-score/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting credit score:", error);
    throw error;
  }
}
