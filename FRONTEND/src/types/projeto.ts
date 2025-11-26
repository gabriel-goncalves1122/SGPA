export interface Projeto {
  id?: string;
  titulo: string;
  descricao?: string;
  orientador: string; // professor document id
  dataInicio: Date;
  dataFim?: Date;
  status?: string;
  alunos?: string[]; // array de aluno document ids
  createdAt?: Date;
  updatedAt?: Date;
}
