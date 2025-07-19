import { fetchApi } from "@/lib/api";

export enum PersonalTransactionType {
  INCOME = "income",
  EXPENSE = "expense",
}

export interface PersonalTransaction {
  id: number;
  userId: number;
  type: PersonalTransactionType;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePersonalTransactionDto {
  type: PersonalTransactionType;
  description: string;
  amount: number;
  date: string;
}

export interface UpdatePersonalTransactionDto {
  type?: PersonalTransactionType;
  description?: string;
  amount?: number;
  date?: string;
}

export interface PersonalTransactionFilterParams {
  type?: PersonalTransactionType;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export async function getPersonalTransactions(
  filters?: PersonalTransactionFilterParams,
): Promise<PersonalTransaction[]> {
  const query = new URLSearchParams();
  if (filters) {
    for (const key in filters) {
      if (filters[key as keyof PersonalTransactionFilterParams]) {
        query.append(
          key,
          filters[key as keyof PersonalTransactionFilterParams] as string,
        );
      }
    }
  }
  const response = await fetchApi(`/personal-finances?${query.toString()}`);
  return response;
}

export async function createPersonalTransaction(
  data: CreatePersonalTransactionDto,
): Promise<PersonalTransaction> {
  const response = await fetchApi("/personal-finances", {
    method: "POST",
    body: JSON.stringify(data),
  });
  return response;
}

export async function updatePersonalTransaction(
  id: number,
  data: UpdatePersonalTransactionDto,
): Promise<PersonalTransaction> {
  const response = await fetchApi(`/personal-finances/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return response;
}

export async function deletePersonalTransaction(id: number): Promise<void> {
  await fetchApi(`/personal-finances/${id}`, {
    method: "DELETE",
  });
}
