
import { apiClient } from "@/lib/apiClient";

export const inventoryService = {
  getProperties: async () => {
    const response = await apiClient.get('/inventory/properties');
    return response.data;
  },
  createProperty: async (data) => {
    const response = await apiClient.post('/inventory/properties', data);
    return response.data;
  },
  updateProperty: async (id, data) => {
    const response = await apiClient.put(`/inventory/properties/${id}`, data);
    return response.data;
  },
  deleteProperty: async (id) => {
    const response = await apiClient.delete(`/inventory/properties/${id}`);
    return response.data;
  },

  getResidents: async () => {
    const response = await apiClient.get('/inventory/residents');
    return response.data;
  },
  createResident: async (data) => {
    const response = await apiClient.post('/inventory/residents', data);
    return response.data;
  },
  updateResident: async (id, data) => {
    const response = await apiClient.put(`/inventory/residents/${id}`, data);
    return response.data;
  },
  deleteResident: async (id) => {
    const response = await apiClient.delete(`/inventory/residents/${id}`);
    return response.data;
  },

  getVehicles: async () => {
    const response = await apiClient.get('/inventory/vehicles');
    return response.data;
  },
  createVehicle: async (data) => {
    const response = await apiClient.post('/inventory/vehicles', data);
    return response.data;
  },
  updateVehicle: async (id, data) => {
    const response = await apiClient.put(`/inventory/vehicles/${id}`, data);
    return response.data;
  },
  deleteVehicle: async (id) => {
    const response = await apiClient.delete(`/inventory/vehicles/${id}`);
    return response.data;
  },

  getPets: async () => {
    const response = await apiClient.get('/inventory/pets');
    return response.data;
  },
  createPet: async (data) => {
    const response = await apiClient.post('/inventory/pets', data);
    return response.data;
  },
  updatePet: async (id, data) => {
    const response = await apiClient.put(`/inventory/pets/${id}`, data);
    return response.data;
  },
  deletePet: async (id) => {
    const response = await apiClient.delete(`/inventory/pets/${id}`);
    return response.data;
  },

  getCommonAreas: async () => {
    const response = await apiClient.get('/inventory/common-areas');
    return response.data;
  },
  createCommonArea: async (data) => {
    const response = await apiClient.post('/inventory/common-areas', data);
    return response.data;
  },
  updateCommonArea: async (id, data) => {
    const response = await apiClient.put(`/inventory/common-areas/${id}`, data);
    return response.data;
  },
  deleteCommonArea: async (id) => {
    const response = await apiClient.delete(`/inventory/common-areas/${id}`);
    return response.data;
  },
};
