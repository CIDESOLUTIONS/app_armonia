import { fetchApi } from "@/lib/api";

export const getPortfolioMetrics = async () => {
  try {
    const response = await fetchApi("/portfolio/metrics");
    return response;
  } catch (error) {
    console.error("Error fetching portfolio metrics:", error);
    throw error;
  }
};

export const getComplexMetrics = async () => {
  try {
    const response = await fetchApi("/portfolio/complexes");
    return response;
  } catch (error) {
    console.error("Error fetching complex metrics:", error);
    throw error;
  }
};
