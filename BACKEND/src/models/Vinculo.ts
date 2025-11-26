export type Papel = "Participante" | "Líder";

export interface Vinculo {
  id?: string;
  idAluno: string;
  idProjeto: string;
  papel: Papel;
  createdAt?: Date;
}

export class VinculoValidator {
  static validate(v: Partial<Vinculo>): string[] {
    const errors: string[] = [];
    if (!v.idAluno) errors.push("idAluno é obrigatório");
    if (!v.idProjeto) errors.push("idProjeto é obrigatório");
    if (!v.papel) errors.push("papel é obrigatório");
    if (v.papel && v.papel !== "Participante" && v.papel !== "Líder") errors.push("papel deve ser 'Participante' ou 'Líder'");
    return errors;
  }
}
