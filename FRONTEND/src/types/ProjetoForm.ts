// types/ProjetoForm.ts
import type { Projeto } from "./projeto";
export type ProjetoForm = {
  titulo: string;
  descricao?: string;
  orientador: string;
  dataInicio: string; // formato "YYYY-MM-DD"
  dataFim: string; // formato "YYYY-MM-DD" ou ""
  status: string;
  alunos: string[];
};

// Função utilitária para converter Projeto → ProjetoForm
export const projetoToForm = (projeto: Projeto): ProjetoForm => ({
  titulo: projeto.titulo || "",
  descricao: projeto.descricao || undefined,
  orientador: projeto.orientador || "",
  dataInicio: projeto.dataInicio ? formatDateForInput(projeto.dataInicio) : "",
  dataFim: projeto.dataFim ? formatDateForInput(projeto.dataFim) : "",
  status: projeto.status || "Em andamento",
  alunos: projeto.alunos || [],
});

// Função utilitária para converter ProjetoForm → Projeto (para envio ao backend)
// types/ProjetoForm.ts
export const formToProjeto = (form: ProjetoForm): Omit<Projeto, "id"> => {
  const safeDate = (str: string): Date | undefined => {
    if (!str || str.trim() === "") return undefined;
    const d = new Date(str);
    return isNaN(d.getTime()) ? undefined : d;
  };

  return {
    titulo: form.titulo,
    descricao: form.descricao?.trim() || undefined,
    orientador: form.orientador,
    dataInicio: safeDate(form.dataInicio) || new Date(), // fallback obrigatório
    dataFim: safeDate(form.dataFim) || undefined,
    status: form.status,
    alunos: form.alunos,
  };
};
export const formatDateForInput = (date: any): string => {
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date); // ✅ "Date" com "D" maiúsculo
  return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
};
