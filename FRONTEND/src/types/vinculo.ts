export type Papel = "Participante" | "Líder";

export interface Vinculo {
  id?: string;
  idAluno: string;
  idProjeto: string;
  papel: Papel;
  createdAt?: Date;
}
