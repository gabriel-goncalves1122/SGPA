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

export class ProjetoValidator {
  static validate(projeto: Partial<Projeto>): string[] {
    const errors: string[] = [];

    if (!projeto.titulo || projeto.titulo.length > 80) {
      errors.push("Título é obrigatório e deve ter no máximo 80 caracteres");
    }

    if (projeto.descricao && projeto.descricao.length > 500) {
      errors.push("Descrição deve ter no máximo 500 caracteres");
    }

    if (!projeto.orientador) {
      errors.push("Orientador (id do professor) é obrigatório");
    }

    if (!projeto.dataInicio) {
      errors.push("Data de início é obrigatória");
    }

    if (projeto.dataInicio && projeto.dataFim) {
      const inicio = new Date(projeto.dataInicio as any);
      const fim = new Date(projeto.dataFim as any);
      if (fim < inicio) {
        errors.push("Data de fim deve ser maior ou igual à data de início");
      }
    }

    return errors;
  }
}
