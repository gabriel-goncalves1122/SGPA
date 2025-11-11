import { useEffect, useState } from "react";
import api from "../services/api";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";

const Dashboard = () => {
  const [mensagem, setMensagem] = useState("");

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

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Dashboard 🚀</h2>
      <p>{mensagem}</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default Dashboard;
