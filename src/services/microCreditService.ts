import { fetchApi } from "@/lib/api";
import { CreateMicroCreditApplicationDto, MicroCreditApplicationDto } from "@/common/dto/fintech.dto";

export async function createMicroCreditApplication(data: CreateMicroCreditApplicationDto): Promise<MicroCreditApplicationDto> {
  try {
    const response = await fetchApi("/fintech/micro-credits", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error creating micro-credit application:", error);
    throw error;
  }
}

export async function getMicroCreditApplications(): Promise<MicroCreditApplicationDto[]> {
  try {
    const response = await fetchApi("/fintech/micro-credits");
    return response;
  } catch (error) {
    console.error("Error fetching micro-credit applications:", error);
    throw error;
  }
}
