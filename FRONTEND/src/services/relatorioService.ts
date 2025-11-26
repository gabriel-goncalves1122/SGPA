import api from "./api";

export interface RelatorioAndamento {
  totalProjetos: number;
  projetosAtivos: number;
  projetosConcluidos: number;
  projetos: {
    id: string;
    titulo: string;
    status: string;
    orientador: string;
    totalTarefas: number;
    tarefasConcluidas: number;
    percentualConclusao: number;
  }[];
}

export const relatorioService = {
  getAndamentoProjetos: async (): Promise<RelatorioAndamento> => {
    const response = await api.get("/relatorios/projetos");
    return response.data;
  },
};
