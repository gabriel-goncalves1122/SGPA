import api from "./api";
import type { Entrega } from "../types/entrega";

export const entregaService = {
  getAll: async (): Promise<Entrega[]> => {
    const response = await api.get("/entregas");
    return response.data;
  },

  getById: async (id: string): Promise<Entrega> => {
    const response = await api.get(`/entregas/${id}`);
    return response.data;
  },

  create: async (entrega: Omit<Entrega, "id">): Promise<Entrega> => {
    const response = await api.post("/entregas", entrega);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/entregas/${id}`);
  },
};
