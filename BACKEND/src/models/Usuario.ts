export type TipoUsuario = "Administrador" | "Professor" | "Aluno";

export interface Usuario {
  uid?: string; // Firebase uid
  nome: string;
  email: string;
  tipo: TipoUsuario;
  createdAt?: Date;
}

export class UsuarioValidator {
  static validate(payload: Partial<Usuario> & { senha?: string }) {
    const errors: string[] = [];
    if (!payload.nome || typeof payload.nome !== "string" || payload.nome.trim() === "") {
      errors.push("Nome é obrigatório");
    } else if (payload.nome.length > 24) {
      errors.push("Nome deve ter no máximo 24 caracteres");
    }

    if (!payload.email || typeof payload.email !== "string") {
      errors.push("E-mail é obrigatório");
    } else {
      const re = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!re.test(payload.email)) errors.push("E-mail inválido");
    }

    if (!payload.senha || typeof payload.senha !== "string" || payload.senha.length < 8) {
      errors.push("Senha deve ter no mínimo 8 caracteres");
    }

    if (!payload.tipo || !["Administrador", "Professor", "Aluno"].includes(payload.tipo)) {
      errors.push("Tipo inválido (use Administrador, Professor ou Aluno)");
    }

    return errors;
  }
}
