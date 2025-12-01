export type StatusTarefa = "Pendente" | "Em andamento" | "Concluída";

export interface Tarefa {
  id?: string;
  descricao?: string;
  responsaveis: string[]; // id do aluno
  orientador?: string;
  idProjeto?: string; // opcional: vinculação ao projeto
  dataInicio?: any;
  dataFim?: any;
  status?: StatusTarefa;
  createdAt?: Date;
  updatedAt?: Date;
}
