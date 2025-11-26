export interface Entrega {
  id?: string;
  idTarefa: string;
  arquivo: string;
  dataEnvio?: any;
  alunoId?: string; // id do aluno que entregou
  createdAt?: Date;
}
