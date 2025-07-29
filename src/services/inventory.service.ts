import { fetchApi } from "@/lib/apiClient";

export const inventoryService = {
  getProperties: async () => {
    return fetchApi("/inventory/properties");
  },
  createProperty: async (data) => {
    return fetchApi("/inventory/properties", { method: "POST", data });
  },
  updateProperty: async (id, data) => {
    return fetchApi(`/inventory/properties/${id}`, { method: "PUT", data });
  },
  deleteProperty: async (id) => {
    return fetchApi(`/inventory/properties/${id}`, { method: "DELETE" });
  },

  getResidents: async () => {
    return fetchApi("/inventory/residents");
  },
  createResident: async (data) => {
    return fetchApi("/inventory/residents", { method: "POST", data });
  },
  updateResident: async (id, data) => {
    return fetchApi(`/inventory/residents/${id}`, { method: "PUT", data });
  },
  deleteResident: async (id) => {
    return fetchApi(`/inventory/residents/${id}`, { method: "DELETE" });
  },

  getVehicles: async () => {
    return fetchApi("/inventory/vehicles");
  },
  createVehicle: async (data) => {
    return fetchApi("/inventory/vehicles", { method: "POST", data });
  },
  updateVehicle: async (id, data) => {
    return fetchApi(`/inventory/vehicles/${id}`, { method: "PUT", data });
  },
  deleteVehicle: async (id) => {
    return fetchApi(`/inventory/vehicles/${id}`, { method: "DELETE" });
  },

  getPets: async () => {
    return fetchApi("/inventory/pets");
  },
  createPet: async (data) => {
    return fetchApi("/inventory/pets", { method: "POST", data });
  },
  updatePet: async (id, data) => {
    return fetchApi(`/inventory/pets/${id}`, { method: "PUT", data });
  },
  deletePet: async (id) => {
    return fetchApi(`/inventory/pets/${id}`, { method: "DELETE" });
  },

  getCommonAreas: async () => {
    return fetchApi("/inventory/common-areas");
  },
  createCommonArea: async (data) => {
    return fetchApi("/inventory/common-areas", { method: "POST", data });
  },
  updateCommonArea: async (id, data) => {
    return fetchApi(`/inventory/common-areas/${id}`, { method: "PUT", data });
  },
  deleteCommonArea: async (id) => {
    return fetchApi(`/inventory/common-areas/${id}`, { method: "DELETE" });
  },
};
