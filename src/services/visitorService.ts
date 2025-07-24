import apiClient from '@/lib/apiClient';
import { Visitor, PreRegisteredVisitor, Package } from '@/types/visitor';

export const createPreRegisteredVisitor = async (visitorData: Omit<PreRegisteredVisitor, 'id' | 'qrCode'>): Promise<PreRegisteredVisitor> => {
  const response = await apiClient.post('/visitors/pre-register', visitorData);
  return response.data;
};

export const getPreRegisteredVisitors = async (): Promise<PreRegisteredVisitor[]> => {
  const response = await apiClient.get('/visitors/pre-registered');
  return response.data;
};

export const scanQrCode = async (qrCode: string): Promise<Visitor> => {
  const response = await apiClient.post('/visitors/scan-qr', { qrCode });
  return response.data;
};

export const registerPackage = async (packageData: Omit<Package, 'id' | 'status' | 'createdAt' | 'deliveredAt'>): Promise<Package> => {
  const response = await apiClient.post('/packages', packageData);
  return response.data;
};

export const deliverPackage = async (packageId: number): Promise<Package> => {
  const response = await apiClient.put(`/packages/${packageId}/deliver`);
  return response.data;
};

export const uploadVisitorImage = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/visitors/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const uploadPackageImage = async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/packages/upload-image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getPackages = async (): Promise<Package[]> => {
    const response = await apiClient.get('/packages?');
    return response.data;
};

export const getPackageById = async (packageId: number): Promise<Package> => {
    const response = await apiClient.get(`/packages/${packageId}`);
    return response.data;
};
