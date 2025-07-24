import { apiClient } from "@/lib/apiClient";

export interface Visitor {
  id: number;
  name: string;
  documentType: string;
  documentNumber: string;
  purpose?: string;
  entryTime: string;
  exitTime?: string;
  status: string;
  residentId?: number;
  complexId?: number;
  propertyId?: number;
}

export interface CreateVisitorData {
  name: string;
  documentType: string;
  documentNumber: string;
  purpose?: string;
  expectedDate?: string;
  expectedTime?: string;
  residentId?: number;
  complexId?: number;
  propertyId?: number;
  entryTime?: string;
  status?: string;
}

export const createVisitor = async (data: CreateVisitorData): Promise<Visitor> => {
  const response = await apiClient.post('/visitors', data);
  return response.data;
};

export const scanQrCode = async (qrCode: string): Promise<Visitor> => {
  const response = await apiClient.post('/visitors/scan-qr', { qrCode });
  return response.data;
};