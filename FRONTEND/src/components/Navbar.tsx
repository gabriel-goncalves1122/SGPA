import { useNavigate, useLocation } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
        <span className="logo">🎓</span>
        <span className="brand-name">SGPA</span>
      </div>

      <div className="navbar-menu">
        <button
          className={`nav-link ${isActive("/dashboard")}`}
          onClick={() => navigate("/dashboard")}
        >
          🏠 Início
        </button>
        <button
          className={`nav-link ${isActive("/alunos")}`}
          onClick={() => navigate("/alunos")}
        >
          📋 Alunos (Tabela)
        </button>
        <button
          className={`nav-link ${isActive("/alunos/cards")}`}
          onClick={() => navigate("/alunos/cards")}
        >
          🎴 Alunos (Cards)
        </button>
      </div>

      <div className="navbar-user">
        <span className="user-email">{auth.currentUser?.email}</span>
        <button className="btn-logout" onClick={logout}>
          Sair 🚪
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
