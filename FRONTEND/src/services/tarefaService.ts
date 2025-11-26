import api from "./api";
import type { Tarefa } from "../types/tarefa";

export const tarefaService = {
  getAll: async (): Promise<Tarefa[]> => {
    const response = await api.get("/tarefas");
    return response.data;
  },

  getById: async (id: string): Promise<Tarefa> => {
    const response = await api.get(`/tarefas/${id}`);
    return response.data;
  },

  create: async (tarefa: Omit<Tarefa, "id">): Promise<Tarefa> => {
    const response = await api.post("/tarefas", tarefa);
    return response.data;
  },

  update: async (id: string, tarefa: Partial<Tarefa>): Promise<Tarefa> => {
    const response = await api.put(`/tarefas/${id}`, tarefa);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tarefas/${id}`);
  },
};
