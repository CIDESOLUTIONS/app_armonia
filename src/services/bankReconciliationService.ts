import axios from 'axios';

const API_URL = '/api/bank-reconciliation'; // Adjust as per your API routes

export const uploadBankStatement = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await axios.post(`${API_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getReconciliationStatus = async () => {
  const response = await axios.get(`${API_URL}/status`);
  return response.data;
};

export const reconcileTransactions = async (transactions: any[]) => {
  const response = await axios.post(`${API_URL}/reconcile`, { transactions });
  return response.data;
};
