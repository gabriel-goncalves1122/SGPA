import api from "./api";
import type { Aluno, AlunoFormData } from "../types/aluno";

export const alunoService = {
  // Listar todos os alunos
  async getAll(): Promise<Aluno[]> {
    const response = await api.get("/alunos");
    return response.data;
  },

  // Buscar aluno por ID
  async getById(id: string): Promise<Aluno> {
    const response = await api.get(`/alunos/${id}`);
    return response.data;
  },

  // Criar novo aluno
  async create(aluno: AlunoFormData): Promise<Aluno> {
    const response = await api.post("/alunos", aluno);
    return response.data;
  },

  // Atualizar aluno
  async update(id: string, aluno: AlunoFormData): Promise<Aluno> {
    const response = await api.put(`/alunos/${id}`, aluno);
    return response.data;
  },

  // Deletar aluno
  async delete(id: string): Promise<void> {
    await api.delete(`/alunos/${id}`);
  },
};
