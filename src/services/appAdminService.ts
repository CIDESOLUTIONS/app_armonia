import { fetchApi } from '@/lib/api';

/**
 * Fetches the main operational metrics for the entire application.
 * This includes MRR, ARR, total complexes, user counts, and breakdown by plan.
 */
export const getOperationalMetrics = async () => {
  // This endpoint needs to be created in the backend.
  const response = await fetchApi('/app-admin/metrics');
  return response.data;
};
