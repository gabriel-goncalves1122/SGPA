import { useEffect, useState } from "react";
import api from "../services/api";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

interface Pessoa {
  id: string;
  [key: string]: any; // permite campos variáveis vindos do Firestore
}

const Dashboard = () => {
  const [mensagem, setMensagem] = useState("");
  const [tipo, setTipo] = useState<"alunos" | "professores">("alunos");
  const [dados, setDados] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(false);

  // Verifica autenticação
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

  // Busca dados conforme tipo selecionado
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/data/${tipo}`);
        setDados(res.data);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tipo]);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard 🚀</h2>
      <p>{mensagem}</p>

      <div style={{ margin: "20px 0" }}>
        <label htmlFor="tipo">Ver dados de: </label>
        <select
          id="tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value as "alunos" | "professores")}
        >
          <option value="alunos">Alunos</option>
          <option value="professores">Professores</option>
        </select>
      </div>

      {loading ? (
        <p>Carregando {tipo}...</p>
      ) : (
        <table
          border={1}
          cellPadding={8}
          style={{ borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Dados</th>
            </tr>
          </thead>
          <tbody>
            {dados.length > 0 ? (
              dados.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <pre>{JSON.stringify(item, null, 2)}</pre>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>Nenhum dado encontrado</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <button
        onClick={logout}
        style={{
          marginTop: 20,
          backgroundColor: "#c0392b",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Sair
      </button>
    </div>
  );
};

export default Dashboard;
