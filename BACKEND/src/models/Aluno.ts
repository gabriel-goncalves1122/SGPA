export interface Aluno {
  id?: string; // ID do Firebase
  nome: string;
  matricula: string;
  email: string;
  curso: string;
  telefone: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class AlunoValidator {
  static validate(aluno: Aluno): string[] {
    const errors: string[] = [];

    if (!aluno.nome || aluno.nome.length > 50) {
      errors.push("Nome é obrigatório e deve ter no máximo 50 caracteres");
    }

    if (!aluno.matricula || aluno.matricula.length > 10) {
      errors.push("Matrícula é obrigatória e deve ter no máximo 10 caracteres");
    }

    if (
      !aluno.email ||
      aluno.email.length > 50 ||
      !this.isValidEmail(aluno.email)
    ) {
      errors.push(
        "Email institucional válido é obrigatório (máx. 50 caracteres)"
      );
    }

    if (!aluno.curso || aluno.curso.length > 30) {
      errors.push("Curso é obrigatório e deve ter no máximo 30 caracteres");
    }

    if (!aluno.telefone || aluno.telefone.length > 15) {
      errors.push("Telefone é obrigatório e deve ter no máximo 15 caracteres");
    }

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
