import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export const getPortfolioMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/portfolio/metrics`);
    return response.data;
  } catch (error) {
    console.error("Error fetching portfolio metrics:", error);
    throw error;
  }
};

export const getComplexMetrics = async () => {
  try {
    const response = await axios.get(`${API_URL}/portfolio/complexes`);
    return response.data;
  } catch (error) {
    console.error("Error fetching complex metrics:", error);
    throw error;
  }
};
