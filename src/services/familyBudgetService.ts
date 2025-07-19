import { fetchApi } from "@/lib/api";

interface FamilyBudgetEntry {
  id: number;
  userId: number;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
  createdAt: string;
}

interface CreateFamilyBudgetEntryData {
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: string;
  date: string;
}

export async function getFamilyBudgetEntries(userId: number): Promise<FamilyBudgetEntry[]> {
  try {
    const response = await fetchApi(`/personal-finances/budget/${userId}`);
    return response.data; // Assuming the API returns { data: FamilyBudgetEntry[] }
  } catch (error) {
    console.error("Error fetching family budget entries:", error);
    throw error;
  }
}

export async function createFamilyBudgetEntry(data: CreateFamilyBudgetEntryData): Promise<FamilyBudgetEntry> {
  try {
    const response = await fetchApi("/personal-finances/budget", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: FamilyBudgetEntry }
  } catch (error) {
    console.error("Error creating family budget entry:", error);
    throw error;
  }
}

export async function deleteFamilyBudgetEntry(id: number): Promise<void> {
  try {
    await fetchApi(`/personal-finances/budget/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting family budget entry:", error);
    throw error;
  }
}
