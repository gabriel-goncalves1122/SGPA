import api from "./api";
import type { Vinculo } from "../types/vinculo";

export const equipesService = {
  getAll: async (): Promise<Vinculo[]> => {
    const response = await api.get("/equipes");
    return response.data;
  },

  create: async (vinculo: Omit<Vinculo, "id">): Promise<Vinculo> => {
    const response = await api.post("/equipes", vinculo);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/equipes/${id}`);
  },
};
