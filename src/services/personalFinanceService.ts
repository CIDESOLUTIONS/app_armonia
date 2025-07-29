import { fetchApi } from "@/lib/apiClient";

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
  return fetchApi('/personal-finances');
};

export const createPersonalTransaction = async (data: CreatePersonalTransactionData): Promise<PersonalTransaction> => {
  return fetchApi('/personal-finances', { method: 'POST', data });
};

export const updatePersonalTransaction = async (id: number, data: UpdatePersonalTransactionData): Promise<PersonalTransaction> => {
  return fetchApi(`/personal-finances/${id}`, { method: 'PUT', data });
};

export const deletePersonalTransaction = async (id: number): Promise<void> => {
  await fetchApi(`/personal-finances/${id}`, { method: 'DELETE' });
};