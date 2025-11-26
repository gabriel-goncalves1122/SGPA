import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Alunos from "./pages/Alunos";
import AlunosGrid from "./pages/AlunosGrid";
import Professores from "./pages/Professores";
import Projetos from "./pages/Projetos";
import Tarefas from "./pages/Tarefas";
import Entregas from "./pages/Entregas";
import Relatorios from "./pages/Relatorios";
import Layout from "./components/Layout";
import { useAuth, AuthProvider } from "./contexts/AuthContext";

const PrivateRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, loading } = useAuth();
  if (loading) return <p>Carregando...</p>;
  return user ? <Layout>{children}</Layout> : <Navigate to="/" />;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/alunos"
            element={
              <PrivateRoute>
                <Alunos />
              </PrivateRoute>
            }
          />
          <Route
            path="/alunos/cards"
            element={
              <PrivateRoute>
                <AlunosGrid />
              </PrivateRoute>
            }
          />
          <Route
            path="/professores"
            element={
              <PrivateRoute>
                <Professores />
              </PrivateRoute>
            }
          />
          <Route
            path="/projetos"
            element={
              <PrivateRoute>
                <Projetos />
              </PrivateRoute>
            }
          />
          <Route
            path="/tarefas"
            element={
              <PrivateRoute>
                <Tarefas />
              </PrivateRoute>
            }
          />
          <Route
            path="/entregas"
            element={
              <PrivateRoute>
                <Entregas />
              </PrivateRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <PrivateRoute>
                <Relatorios />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
