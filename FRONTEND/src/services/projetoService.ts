import api from "./api";
import type { Projeto } from "../types/projeto";

export const projetoService = {
  getAll: async (): Promise<Projeto[]> => {
    const response = await api.get("/projetos");
    return response.data;
  },

  getById: async (id: string): Promise<Projeto> => {
    const response = await api.get(`/projetos/${id}`);
    return response.data;
  },

  create: async (projeto: Omit<Projeto, "id">): Promise<Projeto> => {
    const response = await api.post("/projetos", projeto);
    return response.data;
  },

  update: async (id: string, projeto: Partial<Projeto>): Promise<Projeto> => {
    const payload = {
      titulo: projeto.titulo,
      descricao: projeto.descricao,
      orientador: projeto.orientador,
      dataInicio: projeto.dataInicio,
      dataFim: projeto.dataFim,
      status: projeto.status,
      alunos: projeto.alunos,
    };
    const response = await api.put(`/projetos/${id}`, payload);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/projetos/${id}`);
  },
};
