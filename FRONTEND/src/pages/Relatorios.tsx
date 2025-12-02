import { useState, useEffect } from "react";
import {
  relatorioService,
  type ProjetoRelatorio,
  type FiltrosRelatorio,
} from "../services/relatorioService";
import { professorService } from "../services/professorService";
import type { Professor } from "../types/professor";
import Layout from "../components/Layout";
import "./Relatorios.css";

export default function Relatorios() {
  const [projetos, setProjetos] = useState<ProjetoRelatorio[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState<FiltrosRelatorio>({});
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadRelatorio();
  }, [filtros]);

  const loadData = async () => {
    try {
      const professoresData = await professorService.getAll();
      setProfessores(professoresData);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
    }
  };

  const loadRelatorio = async () => {
    try {
      setLoading(true);
      setErro(null);
      const data = await relatorioService.getAndamentoProjetos(filtros);
      setProjetos(data);
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
      const mensagem =
        error instanceof Error ? error.message : "Erro ao carregar relatório";
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (chave: keyof FiltrosRelatorio, valor: string) => {
    setFiltros((prev) => ({
      ...prev,
      [chave]: valor || undefined,
    }));
  };

  const handleLimparFiltros = () => {
    setFiltros({});
  };

  // ✅ 2. Exportação CSV
  const exportToCSV = () => {
    if (projetos.length === 0) return;

    const header = [
      "Projeto",
      "Orientador",
      "% Tarefas Concluídas",
      "Nº Alunos",
    ];
    const rows = projetos.map((p) => [
      `"${p.projeto}"`,
      `"${p.orientador}"`,
      p["% tarefas concluídas"],
      p["número de alunos"],
    ]);

    const csvContent = [header, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `relatorio_projetos_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="relatorios-container">
        <div className="relatorios-header">
          <h1>Relatório de Andamento de Projetos</h1>
          <div className="header-actions">
            <button className="btn-refresh" onClick={loadRelatorio}>
              🔄 Atualizar
            </button>
            <button
              className="btn-export"
              onClick={exportToCSV}
              disabled={projetos.length === 0}
            >
              📥 Exportar CSV
            </button>
          </div>
        </div>

        <div className="filtros-section">
          <h3>Filtros</h3>
          <div className="filtros-grid">
            {/* ✅ 1. Select de orientadores reais */}
            <div className="filtro-item">
              <label htmlFor="orientador">Orientador:</label>
              <select
                id="orientador"
                value={filtros.orientador || ""}
                onChange={(e) =>
                  handleFiltroChange("orientador", e.target.value)
                }
              >
                <option value="">Todos</option>
                {professores.map((prof) => (
                  <option key={prof.id} value={prof.id}>
                    {prof.nome}
                  </option>
                ))}
              </select>
            </div>

            <div className="filtro-item">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                value={filtros.status || ""}
                onChange={(e) => handleFiltroChange("status", e.target.value)}
              >
                <option value="">Todos</option>
                <option value="Ativo">Ativo</option>
                <option value="Concluído">Concluído</option>
                <option value="Pausado">Pausado</option>
              </select>
            </div>

            <div className="filtro-item">
              <label htmlFor="curso">Curso:</label>
              <input
                id="curso"
                type="text"
                placeholder="Nome do Curso"
                value={filtros.curso || ""}
                onChange={(e) => handleFiltroChange("curso", e.target.value)}
              />
            </div>

            <button
              className="btn-limpar-filtros"
              onClick={handleLimparFiltros}
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Carregando relatório...</div>
        ) : erro ? (
          <div className="error-message">
            <span>❌ {erro}</span>
            <p
              style={{ fontSize: "0.9rem", marginTop: "0.5rem", color: "#666" }}
            >
              Abra o console (F12) para mais detalhes
            </p>
          </div>
        ) : projetos.length > 0 ? (
          <>
            <div className="resumo-cards">
              <div className="resumo-card">
                <div className="card-icon">📊</div>
                <div className="card-content">
                  <h3>{projetos.length}</h3>
                  <p>Total de Projetos</p>
                </div>
              </div>
              <div className="resumo-card">
                <div className="card-icon">👥</div>
                <div className="card-content">
                  <h3>
                    {projetos.reduce(
                      (acc, p) => acc + p["número de alunos"],
                      0
                    )}
                  </h3>
                  <p>Total de Alunos</p>
                </div>
              </div>
              <div className="resumo-card">
                <div className="card-icon">📈</div>
                <div className="card-content">
                  <h3>
                    {projetos.length > 0
                      ? Math.round(
                          projetos.reduce(
                            (acc, p) => acc + p["% tarefas concluídas"],
                            0
                          ) / projetos.length
                        )
                      : 0}
                    %
                  </h3>
                  <p>Percentual Médio</p>
                </div>
              </div>
            </div>

            <div className="tabela-relatorio">
              <h2>Detalhes dos Projetos</h2>
              <div className="tabela-wrapper">
                <table className="projetos-tabela">
                  <thead>
                    <tr>
                      <th>Projeto</th>
                      <th>Orientador</th>
                      <th>% Tarefas Concluídas</th>
                      <th>Número de Alunos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projetos.map((projeto) => (
                      <tr key={projeto.id} className="projeto-linha">
                        <td className="col-projeto">{projeto.projeto}</td>
                        <td className="col-orientador">{projeto.orientador}</td>
                        <td className="col-percentual">
                          {/* ✅ 4. Barra de progresso com rótulo e transição */}
                          <div className="progress-bar-inline">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${projeto["% tarefas concluídas"]}%`,
                                backgroundColor: getProgressBarColor(
                                  projeto["% tarefas concluídas"]
                                ),
                              }}
                            />
                            <span className="progress-label">
                              {projeto["% tarefas concluídas"]}%
                            </span>
                          </div>
                        </td>
                        <td className="col-alunos">
                          {projeto["número de alunos"]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="no-data">
            Nenhum projeto encontrado com os filtros aplicados
          </div>
        )}
      </div>
    </Layout>
  );
}

function getProgressBarColor(percentual: number) {
  if (percentual >= 80) return "#28a745"; // verde
  if (percentual >= 50) return "#ffc107"; // amarelo
  if (percentual >= 25) return "#fd7e14"; // laranja
  return "#dc3545"; // vermelho
}
