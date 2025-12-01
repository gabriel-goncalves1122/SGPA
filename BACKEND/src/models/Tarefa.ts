export type StatusTarefa = "Pendente" | "Em andamento" | "Concluída";

export interface Tarefa {
  descricao?: string;
  responsaveis: string[]; // IDs dos alunos responsáveis
  orientador?: string; // ID do professor orientador (opcional)
  idProjeto?: string;
  dataInicio?: any;
  dataFim?: any;
  status?: StatusTarefa;
  createdAt?: Date;
  updatedAt?: Date;
}

export class TarefaValidator {
  static validate(payload: Partial<Tarefa>) {
    const errors: string[] = [];

    // Descrição
    if (
      !payload.descricao ||
      typeof payload.descricao !== "string" ||
      payload.descricao.trim() === ""
    ) {
      errors.push("Descrição é obrigatória");
    } else if (payload.descricao.length > 200) {
      errors.push("Descrição deve ter no máximo 200 caracteres");
    }

    // Responsáveis (alunos)
    if (
      !payload.responsaveis ||
      !Array.isArray(payload.responsaveis) ||
      payload.responsaveis.length === 0
    ) {
      errors.push(
        "É necessário pelo menos um responsável (array de IDs de alunos)"
      );
    } else {
      for (const resp of payload.responsaveis) {
        if (typeof resp !== "string" || resp.trim() === "") {
          errors.push(
            "Cada responsável deve ser uma string não vazia (ID do aluno)"
          );
          break;
        }
      }
    }

    // Orientador (professor) – opcional
    if (payload.orientador !== undefined && payload.orientador !== null) {
      if (
        typeof payload.orientador !== "string" ||
        payload.orientador.trim() === ""
      ) {
        errors.push(
          "Orientador, se informado, deve ser um ID válido de professor (string não vazia)"
        );
      }
    }

    // idProjeto
    if (payload.idProjeto && typeof payload.idProjeto !== "string") {
      errors.push("idProjeto inválido");
    }

    // Validação de datas
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

    // Status
    if (
      payload.status &&
      !["Pendente", "Em andamento", "Concluída"].includes(payload.status)
    ) {
      errors.push("Status inválido");
    }

    return errors;
  }
}
