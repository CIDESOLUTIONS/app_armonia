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

export async function uploadDocument(name: string, file: File): Promise<Document> {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    const response = await fetchApi("/api/documents/upload", {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}

export async function deleteDocument(id: number): Promise<void> {
  try {
    await fetchApi(`/api/documents/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Error deleting document ${id}:`, error);
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
