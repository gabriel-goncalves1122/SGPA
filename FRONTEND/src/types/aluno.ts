export interface Aluno {
  id?: string;
  nome: string;
  matricula: string;
  email: string;
  curso: string;
  telefone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AlunoFormData {
  nome: string;
  matricula: string;
  email: string;
  curso: string;
  telefone: string;
}
