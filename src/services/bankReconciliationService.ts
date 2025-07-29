import { fetchApi } from "@/lib/apiClient";

export const reconcileTransactions = async (
  schemaName: string,
  transactions: any[],
) => {
  return fetchApi(`/bank-reconciliation/reconcile`, {
    method: "POST",
    data: { transactions, schemaName },
  });
};
