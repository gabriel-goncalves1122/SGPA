// components/Navbar.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", label: "Início", icon: "🏠" },
    { path: "/pessoas", label: "Pessoas", icon: "👥" }, // ⬅️ substitui Alunos/Professores
    { path: "/projetos", label: "Projetos", icon: "📁" },
    { path: "/tarefas", label: "Tarefas", icon: "✅" },
    { path: "/entregas", label: "Entregas", icon: "📤" },
    { path: "/relatorios", label: "Relatórios", icon: "📊" },
  ];
  return (
    <nav className="navbar">
      <div
        className="navbar-brand"
        onClick={() => navigate("/dashboard")}
        role="button"
      >
        <span className="logo">🎓</span>
        <span className="brand-name">SGPA</span>
      </div>

      <div className="navbar-menu">
        {navItems.map((item) => (
          <button
            key={item.path}
            className={`nav-link ${isActive(item.path) ? "active" : ""}`}
            onClick={() => navigate(item.path)}
            aria-current={isActive(item.path) ? "page" : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="navbar-user">
        {user && <span className="user-email">{user.email}</span>}
        <button
          className="btn-logout"
          onClick={logout}
          aria-label="Sair da conta"
        >
          Sair 🚪
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
