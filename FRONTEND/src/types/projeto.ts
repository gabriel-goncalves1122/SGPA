// types/projeto.ts (frontend)
export interface Projeto {
  id?: string;
  titulo: string;
  descricao?: string;
  orientador: string;
  dataInicio?: Date; // ← opcional aqui
  dataFim?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  alunos?: string[];
}
