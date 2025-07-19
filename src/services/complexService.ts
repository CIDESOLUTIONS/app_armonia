import { fetchApi } from "@/lib/api";

export interface ComplexInfo {
  id: number;
  name: string;
  schemaName: string;
  totalUnits: number;
  adminEmail: string;
  adminName: string;
  adminPhone?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  legalName?: string;
  nit?: string;
  registrationDate?: string;
}

export async function getComplexInfo(): Promise<ComplexInfo> {
  return Promise.resolve({
    id: 1,
    name: "Conjunto Residencial Armonía",
    schemaName: "armonia_schema",
    totalUnits: 100,
    adminEmail: "admin@armonia.com",
    adminName: "Admin Armonía",
    address: "Calle Falsa 123",
    city: "Ciudad Ficticia",
    state: "Estado Ficticio",
    country: "País Ficticio",
  });
}

export async function updateComplexInfo(
  id: number,
  data: Partial<ComplexInfo>,
): Promise<ComplexInfo> {
  console.log(`Simulating update for complex ${id} with data:`, data);
  return Promise.resolve({ ...data, id } as ComplexInfo);
}

export async function getAllComplexes(): Promise<ComplexInfo[]> {
  try {
    const response = await fetchApi("/complexes"); // Assuming a backend endpoint /complexes
    return response.data; // Assuming the API returns { data: ComplexInfo[] }
  } catch (error) {
    console.error("Error fetching all complexes:", error);
    throw error;
  }
}