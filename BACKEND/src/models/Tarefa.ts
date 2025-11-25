export type StatusTarefa = "Pendente" | "Em andamento" | "Concluída";

export interface Tarefa {
  descricao?: string;
  responsavel: string; // id do aluno
  idProjeto?: string; // opcional: vinculação ao projeto
  dataInicio?: any;
  dataFim?: any;
  status?: StatusTarefa;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TarefaValidator {
  static validate(payload: Partial<Tarefa>) {
    const errors: string[] = [];

    if (!payload.descricao || typeof payload.descricao !== "string" || payload.descricao.trim() === "") {
      errors.push("Descrição é obrigatória");
    } else if (payload.descricao.length > 200) {
      errors.push("Descrição deve ter no máximo 200 caracteres");
    }

    if (!payload.responsavel || typeof payload.responsavel !== "string") {
      errors.push("Responsável (id do aluno) é obrigatório");
    }

    if (payload.idProjeto && typeof payload.idProjeto !== "string") {
      errors.push("idProjeto inválido");
    }

    // datas
    if (payload.dataInicio) {
      const d = new Date(payload.dataInicio as any);
      if (isNaN(d.getTime())) errors.push("dataInicio inválida");
    }
    if (payload.dataFim) {
      const d = new Date(payload.dataFim as any);
      if (isNaN(d.getTime())) errors.push("dataFim inválida");
    }

    if (payload.dataInicio && payload.dataFim) {
      const di = new Date(payload.dataInicio as any).getTime();
      const df = new Date(payload.dataFim as any).getTime();
      if (df < di) errors.push("dataFim deve ser maior ou igual a dataInicio");
    }

    if (payload.status && !["Pendente", "Em andamento", "Concluída"].includes(payload.status)) {
      errors.push("Status inválido");
    }

    return errors;
  }
}
