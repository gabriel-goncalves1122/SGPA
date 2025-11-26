export interface Professor {
  id?: string; // ID do Firebase
  nome: string;
  siape: string;
  email: string;
  departamento: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ProfessorValidator {
  static validate(professor: Professor): string[] {
    const errors: string[] = [];

    if (!professor.nome || professor.nome.length > 50) {
      errors.push("Nome é obrigatório e deve ter no máximo 50 caracteres");
    }

    if (!professor.siape || professor.siape.length > 10) {
      errors.push("SIAPE é obrigatório e deve ter no máximo 10 caracteres");
    }

    if (
      !professor.email ||
      professor.email.length > 50 ||
      !this.isValidEmail(professor.email)
    ) {
      errors.push("Email institucional válido é obrigatório (máx. 50 caracteres)");
    }

    if (!professor.departamento || professor.departamento.length > 40) {
      errors.push("Departamento é obrigatório e deve ter no máximo 40 caracteres");
    }

    return errors;
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
