import { useState, useEffect } from "react";
import { relatorioService } from "../services/relatorioService";
import type { RelatorioAndamento } from "../services/relatorioService";
import Layout from "../components/Layout";
import "./Relatorios.css";

export default function Relatorios() {
  const [relatorio, setRelatorio] = useState<RelatorioAndamento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRelatorio();
  }, []);

  const loadRelatorio = async () => {
    try {
      setLoading(true);
      const data = await relatorioService.getAndamentoProjetos();
      setRelatorio(data);
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
      alert("Erro ao carregar relatório");
    } finally {
      setLoading(false);
    }
  };

  const getProgressBarColor = (percentual: number) => {
    if (percentual >= 80) return "#28a745";
    if (percentual >= 50) return "#ffc107";
    if (percentual >= 25) return "#fd7e14";
    return "#dc3545";
  };

  return (
    <Layout>
      <div className="relatorios-container">
        <div className="relatorios-header">
          <h1>Relatório de Andamento dos Projetos</h1>
          <button className="btn-refresh" onClick={loadRelatorio}>
            🔄 Atualizar
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando relatório...</div>
        ) : relatorio ? (
          <>
            <div className="resumo-cards">
              <div className="resumo-card">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <h3>{relatorio.totalProjetos}</h3>
                  <p>Total de Projetos</p>
                </div>
              </div>
              <div className="resumo-card active">
                <div className="card-icon">🚀</div>
                <div className="card-content">
                  <h3>{relatorio.projetosAtivos}</h3>
                  <p>Projetos Ativos</p>
                </div>
              </div>
              <div className="resumo-card completed">
                <div className="card-icon">✅</div>
                <div className="card-content">
                  <h3>{relatorio.projetosConcluidos}</h3>
                  <p>Projetos Concluídos</p>
                </div>
              </div>
            </div>

            <div className="projetos-detalhes">
              <h2>Detalhes dos Projetos</h2>
              {relatorio.projetos.length === 0 ? (
                <div className="no-data">Nenhum projeto encontrado</div>
              ) : (
                <div className="projetos-lista">
                  {relatorio.projetos.map((projeto) => (
                    <div key={projeto.id} className="projeto-detalhe-card">
                      <div className="projeto-detalhe-header">
                        <h3>{projeto.titulo}</h3>
                        <span className={`status-badge ${projeto.status.toLowerCase().replace(" ", "-")}`}>
                          {projeto.status}
                        </span>
                      </div>
                      <div className="projeto-detalhe-info">
                        <div className="info-row">
                          <span className="label">Orientador:</span>
                          <span className="value">{projeto.orientador}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Total de Tarefas:</span>
                          <span className="value">{projeto.totalTarefas}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Tarefas Concluídas:</span>
                          <span className="value">{projeto.tarefasConcluidas}</span>
                        </div>
                      </div>
                      <div className="progress-section">
                        <div className="progress-header">
                          <span>Progresso</span>
                          <span className="percentual">{projeto.percentualConclusao}%</span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${projeto.percentualConclusao}%`,
                              backgroundColor: getProgressBarColor(projeto.percentualConclusao),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="no-data">Erro ao carregar relatório</div>
        )}
      </div>
    </Layout>
  );
}
