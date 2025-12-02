import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { auth } from "../firebase/config";
import "./Dashboard.css";

interface Metricas {
  totalAlunos: number;
  totalProjetos: number;
  tarefasPendentes: number;
  projetosConcluidos: number;
}

interface UltimaEntrega {
  id: string;
  alunoNome: string;
  projetoTitulo: string;
  dataEntrega: string;
}

interface TarefaStatus {
  Pendente: number;
  "Em andamento": number;
  Concluída: number;
}

const Dashboard = () => {
  const [mensagem, setMensagem] = useState("");
  const [metricas, setMetricas] = useState<Metricas | null>(null);
  const [ultimaEntrega, setUltimaEntrega] = useState<UltimaEntrega | null>(
    null
  );
  const [tarefaStatus, setTarefaStatus] = useState<TarefaStatus | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const authRes = await api.get("/auth/verify");
        setMensagem(authRes.data.message || "Sessão ativa");

        // Carregar todos os dados em paralelo
        const [
          alunosRes,
          projetosRes,
          tarefasRes,
          entregasRes,
          alunosListRes,
          projetosListRes,
        ] = await Promise.all([
          api.get("/alunos"),
          api.get("/projetos"),
          api.get("/tarefas"),
          api.get("/entregas"),
          api.get("/alunos"), // reutilizado para lookup
          api.get("/projetos"), // reutilizado para lookup
        ]);

        const alunos = alunosListRes.data;
        const projetos = projetosListRes.data;

        // Métricas
        const totalAlunos = alunosRes.data.length;
        const totalProjetos = projetosRes.data.length;
        const tarefasPendentes = tarefasRes.data.filter(
          (t: any) => t.status === "Pendente" || t.status === "Em andamento"
        ).length;
        const projetosConcluidos = projetosRes.data.filter(
          (p: any) => p.status === "Concluído"
        ).length;

        setMetricas({
          totalAlunos,
          totalProjetos,
          tarefasPendentes,
          projetosConcluidos,
        });

        // Última entrega
        const entregas = entregasRes.data;
        if (entregas.length > 0) {
          // Ordenar por data (assumindo que dataEntrega é string ISO ou timestamp)
          const ultima = entregas.reduce((maisRecente: any, atual: any) => {
            const dataRecente = new Date(maisRecente.dataEntrega || 0);
            const dataAtual = new Date(atual.dataEntrega || 0);
            return dataAtual > dataRecente ? atual : maisRecente;
          });

          const aluno = alunos.find((a: any) => a.id === ultima.idAluno);
          const projeto = projetos.find((p: any) => p.id === ultima.idProjeto);

          setUltimaEntrega({
            id: ultima.id,
            alunoNome: aluno?.nome || "Desconhecido",
            projetoTitulo: projeto?.titulo || "Sem projeto",
            dataEntrega: new Date(ultima.dataEntrega).toLocaleDateString(
              "pt-BR"
            ),
          });
        }

        // Gráfico: contagem de tarefas por status
        const statusCount: TarefaStatus = {
          Pendente: 0,
          "Em andamento": 0,
          Concluída: 0,
        };
        tarefasRes.data.forEach((t: any) => {
          if (statusCount.hasOwnProperty(t.status)) {
            statusCount[t.status as keyof TarefaStatus]++;
          }
        });
        setTarefaStatus(statusCount);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        setMensagem("Erro ao carregar dados do dashboard");
      }
    };

    carregarDados();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        {/* Boas-vindas */}
        <div className="welcome-card">
          <h2>🎓 Bem-vindo ao SGPA!</h2>
          <p className="welcome-message">{mensagem}</p>
          {auth.currentUser?.email && (
            <p className="user-email">👤 {auth.currentUser.email}</p>
          )}
        </div>

        {/* Métricas */}
        {metricas && (
          <div className="metrics-grid">
            <MetricCard
              title="Total de Alunos"
              value={metricas.totalAlunos}
              icon="👨‍🎓"
              color="#4361ee"
            />
            <MetricCard
              title="Projetos Ativos"
              value={metricas.totalProjetos - metricas.projetosConcluidos}
              icon="📁"
              color="#06d6a0"
            />
            <MetricCard
              title="Tarefas Pendentes"
              value={metricas.tarefasPendentes}
              icon="✅"
              color="#118ab2"
            />
            <MetricCard
              title="Projetos Concluídos"
              value={metricas.projetosConcluidos}
              icon="🎯"
              color="#073b4c"
            />
          </div>
        )}

        {/* Última entrega */}
        {ultimaEntrega && (
          <div className="last-delivery-card">
            <h3>📤 Última Entrega</h3>
            <p>
              <strong>Aluno:</strong> {ultimaEntrega.alunoNome}
            </p>
            <p>
              <strong>Projeto:</strong> {ultimaEntrega.projetoTitulo}
            </p>
            <p>
              <strong>Data:</strong> {ultimaEntrega.dataEntrega}
            </p>
          </div>
        )}

        {/* Gráfico de tarefas por status */}
        {tarefaStatus && (
          <div className="chart-section">
            <h3>📊 Distribuição de Tarefas por Status</h3>
            <div className="status-chart">
              {Object.entries(tarefaStatus).map(([status, count]) => {
                const total = Object.values(tarefaStatus).reduce(
                  (a, b) => a + b,
                  0
                );
                const percent =
                  total > 0 ? Math.round((count / total) * 100) : 0;
                const colorMap: Record<string, string> = {
                  Pendente: "#dc3545",
                  "Em andamento": "#ffc107",
                  Concluída: "#28a745",
                };
                return (
                  <div key={status} className="chart-bar">
                    <div className="bar-label">
                      <span>{status}</span>
                      <span>
                        {count} ({percent}%)
                      </span>
                    </div>
                    <div className="bar-container">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${percent}%`,
                          backgroundColor: colorMap[status] || "#6c757d",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Acesso rápido */}
        <div className="quick-access-grid">
          <QuickAccessCard
            title="Gerenciar Alunos"
            description="Visualizar e editar alunos em tabela"
            icon="📋"
            onClick={() => navigate("/alunos")}
          />
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: string;
  color: string;
}) => (
  <div className="metric-card">
    <div className="metric-icon" style={{ backgroundColor: color }}>
      {icon}
    </div>
    <div className="metric-content">
      <h3>{title}</h3>
      <p className="metric-value">{value}</p>
    </div>
  </div>
);

const QuickAccessCard = ({
  title,
  description,
  icon,
  onClick,
}: {
  title: string;
  description: string;
  icon: string;
  onClick: () => void;
}) => (
  <div
    className="quick-access-card"
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => e.key === "Enter" && onClick()}
  >
    <div className="quick-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
    <span className="quick-arrow">→</span>
  </div>
);

export default Dashboard;
