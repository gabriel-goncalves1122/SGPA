import { useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");
    
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, senha);
      } else {
        await signInWithEmailAndPassword(auth, email, senha);
      }
      window.location.href = "/dashboard";
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setErro("Usuário não encontrado. Crie uma conta primeiro.");
      } else if (err.code === "auth/wrong-password") {
        setErro("Senha incorreta.");
      } else if (err.code === "auth/email-already-in-use") {
        setErro("Este email já está em uso.");
      } else if (err.code === "auth/weak-password") {
        setErro("Senha muito fraca. Use no mínimo 6 caracteres.");
      } else {
        setErro("Erro: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">🎓</div>
          <h1>SGPA</h1>
          <p>Sistema de Gerenciamento de Processos Acadêmicos</p>
        </div>

        <div className="login-tabs">
          <button
            className={`tab ${!isRegistering ? "active" : ""}`}
            onClick={() => setIsRegistering(false)}
            type="button"
          >
            Login
          </button>
          <button
            className={`tab ${isRegistering ? "active" : ""}`}
            onClick={() => setIsRegistering(true)}
            type="button"
          >
            Criar Conta
          </button>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">
              <span className="icon">📧</span>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">
              <span className="icon">🔒</span>
              Senha
            </label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          {erro && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {erro}
            </div>
          )}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                {isRegistering ? "Criando..." : "Entrando..."}
              </>
            ) : (
              <>
                {isRegistering ? "Criar Conta" : "Entrar"}
                <span className="arrow">→</span>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {isRegistering
              ? "Ao criar uma conta, você concorda com nossos Termos de Uso"
              : "Esqueceu a senha? Entre em contato com o administrador"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
