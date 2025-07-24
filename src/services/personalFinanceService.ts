import { apiClient } from "@/lib/apiClient";

export interface PersonalTransaction {
  id: number;
  userId: number;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonalTransactionData {
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  date: string;
}

export interface UpdatePersonalTransactionData extends Partial<CreatePersonalTransactionData> {}

export const getPersonalTransactions = async (): Promise<PersonalTransaction[]> => {
  const response = await apiClient.get('/personal-finances');
  return response.data;
};

export const createPersonalTransaction = async (data: CreatePersonalTransactionData): Promise<PersonalTransaction> => {
  const response = await apiClient.post('/personal-finances', data);
  return response.data;
};

export const updatePersonalTransaction = async (id: number, data: UpdatePersonalTransactionData): Promise<PersonalTransaction> => {
  const response = await apiClient.put(`/personal-finances/${id}`, data);
  return response.data;
};

export const deletePersonalTransaction = async (id: number): Promise<void> => {
  await apiClient.delete(`/personal-finances/${id}`);
};