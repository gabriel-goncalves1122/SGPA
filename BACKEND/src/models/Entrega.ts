export interface Entrega {
  idTarefa: string;
  arquivo: string;
  dataEnvio?: any;
  alunoId?: string; // id do aluno que entregou
  createdAt?: Date;
}

export class EntregaValidator {
  static validate(payload: Partial<Entrega>) {
    const errors: string[] = [];
    if (!payload.idTarefa || typeof payload.idTarefa !== "string") {
      errors.push("idTarefa é obrigatório");
    }
    if (!payload.arquivo || typeof payload.arquivo !== "string" || payload.arquivo.trim() === "") {
      errors.push("arquivo é obrigatório");
    }
    if (payload.dataEnvio) {
      const d = new Date(payload.dataEnvio as any);
      if (isNaN(d.getTime())) errors.push("dataEnvio inválida");
    }
    return errors;
  }
}
