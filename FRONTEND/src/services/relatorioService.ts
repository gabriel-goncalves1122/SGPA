import api from "./api";

export interface ProjetoRelatorio {
  id: string;
  projeto: string; // título do projeto
  orientador: string; // nome do orientador
  "% tarefas concluídas": number;
  "número de alunos": number;
}

export interface FiltrosRelatorio {
  orientador?: string;
  status?: string;
  curso?: string;
}

export const relatorioService = {
  getAndamentoProjetos: async (filtros?: FiltrosRelatorio): Promise<ProjetoRelatorio[]> => {
    const params = new URLSearchParams();
    
    if (filtros?.orientador) params.append("orientador", filtros.orientador);
    if (filtros?.status) params.append("status", filtros.status);
    if (filtros?.curso) params.append("curso", filtros.curso);
    
    const queryString = params.toString();
    const url = queryString ? `/relatorios/projetos?${queryString}` : "/relatorios/projetos";
    
    const response = await api.get(url);
    return response.data;
  },
};
