import { fetchApi } from "@/lib/api";

export async function createTransaction(data: any): Promise<any> {
  try {
    const response = await fetchApi("/finances/payments/initiate", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

export async function processTransaction(transactionId: string): Promise<any> {
  try {
    const response = await fetchApi(
      `/finances/payments/verify/${transactionId}`,
      {
        method: "POST",
      },
    );
    return response;
  } catch (error) {
    console.error("Error processing transaction:", error);
    throw error;
  }
}
