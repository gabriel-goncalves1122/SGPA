import api from "./api";
import type { Professor } from "../types/professor";

export const professorService = {
  getAll: async (): Promise<Professor[]> => {
    const response = await api.get("/professores");
    return response.data;
  },

  getById: async (id: string): Promise<Professor> => {
    const response = await api.get(`/professores/${id}`);
    return response.data;
  },

  create: async (professor: Omit<Professor, "id">): Promise<Professor> => {
    const response = await api.post("/professores", professor);
    return response.data;
  },

  update: async (
    id: string,
    professor: Partial<Professor>
  ): Promise<Professor> => {
    const response = await api.put(`/professores/${id}`, professor);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/professores/${id}`);
  },

  getByName: async (nome: string): Promise<Professor[]> => {
    const response = await api.get(
      `/professores/nome/${encodeURIComponent(nome)}`
    );
    return response.data;
  },
};
