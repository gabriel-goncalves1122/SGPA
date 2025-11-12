import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { auth } from "../firebase/config";
import "./Dashboard.css";

const Dashboard = () => {
  const [mensagem, setMensagem] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const verificarAuth = async () => {
      try {
        const res = await api.get("/auth/verify");
        setMensagem(res.data.message);
      } catch (error) {
        setMensagem("Token inválido ou sessão expirada");
      }
    };

    verificarAuth();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Bem-vindo! 🚀</h2>
          <p>{mensagem}</p>
          <p className="user-email">{auth.currentUser?.email}</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card" onClick={() => navigate("/alunos")}>
            <div className="card-icon">📋</div>
            <h3>Gerenciar Alunos</h3>
            <p>Visualizar e gerenciar alunos em formato de tabela</p>
            <button className="card-button">Acessar →</button>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/alunos/cards")}
          >
            <div className="card-icon">🎴</div>
            <h3>Alunos em Cards</h3>
            <p>Visualizar alunos em formato de cards interativos</p>
            <button className="card-button">Acessar →</button>
          </div>

          <div className="dashboard-card disabled">
            <div className="card-icon">📊</div>
            <h3>Relatórios</h3>
            <p>Em breve - Visualizar estatísticas e relatórios</p>
            <button className="card-button">Em breve</button>
          </div>

          <div className="dashboard-card disabled">
            <div className="card-icon">⚙️</div>
            <h3>Configurações</h3>
            <p>Em breve - Gerenciar configurações do sistema</p>
            <button className="card-button">Em breve</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
