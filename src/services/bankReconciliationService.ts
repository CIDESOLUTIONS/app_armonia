import { apiClient } from "@/lib/apiClient";

export const reconcileTransactions = async (
  schemaName: string,
  transactions: any[],
) => {
  const response = await apiClient.post(
    `/bank-reconciliation/reconcile`,
    { transactions, schemaName },
  );
  return response.data;
};
