import { fetchApi } from "@/lib/api";

interface Document {
  id: number;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  url: string;
}

export async function getDocuments(): Promise<Document[]> {
  try {
    const response = await fetchApi("/api/documents");
    return response;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}

export async function downloadDocument(id: number): Promise<Blob> {
  try {
    const response = await fetchApi(`/api/documents/${id}`, { method: "GET" });
    // Assuming the API returns a blob or a URL to download
    return response; // This might need adjustment based on actual API response
  } catch (error) {
    console.error(`Error downloading document ${id}:`, error);
    throw error;
  }
}
