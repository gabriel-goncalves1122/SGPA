// pages/Pessoas.tsx
import { useState, useEffect } from "react";
import { alunoService } from "../services/alunoService";
import { professorService } from "../services/professorService";
import type { Aluno } from "../types/aluno";
import type { Professor } from "../types/professor";
import Layout from "../components/Layout";
import "./Pessoas.css";

type Pessoa = Aluno | Professor;
type TipoPessoa = "aluno" | "professor";

export default function Pessoas() {
  const [tipo, setTipo] = useState<TipoPessoa>("aluno");
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState<Pessoa | null>(null);
  const [formData, setFormData] = useState<Partial<Aluno & Professor>>({});

  // Carrega dados conforme o tipo selecionado
  useEffect(() => {
    loadPessoas();
  }, [tipo]);

  const loadPessoas = async () => {
    try {
      setLoading(true);
      if (tipo === "aluno") {
        const data = await alunoService.getAll();
        setPessoas(data);
      } else {
        const data = await professorService.getAll();
        setPessoas(data);
      }
      setError(null);
    } catch (err) {
      setError(
        `Erro ao carregar ${tipo === "aluno" ? "alunos" : "professores"}`
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (pessoa?: Pessoa) => {
    if (pessoa) {
      setEditingPessoa(pessoa);
      setFormData({
        nome: pessoa.nome,
        ...(tipo === "aluno"
          ? {
              matricula: (pessoa as Aluno).matricula,
              curso: (pessoa as Aluno).curso,
              telefone: (pessoa as Aluno).telefone,
            }
          : {
              siape: (pessoa as Professor).siape,
              departamento: (pessoa as Professor).departamento,
            }),
        email: pessoa.email,
      });
    } else {
      setEditingPessoa(null);
      setFormData({});
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPessoa(null);
    setFormData({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPessoa) {
        if (tipo === "aluno") {
          await alunoService.update(editingPessoa.id!, formData as Aluno);
        } else {
          await professorService.update(
            editingPessoa.id!,
            formData as Professor
          );
        }
      } else {
        if (tipo === "aluno") {
          await alunoService.create(formData as Omit<Aluno, "id">);
        } else {
          await professorService.create(formData as Omit<Professor, "id">);
        }
      }
      await loadPessoas();
      handleCloseModal();
    } catch (err) {
      setError(`Erro ao salvar ${tipo === "aluno" ? "aluno" : "professor"}`);
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        `Tem certeza que deseja excluir este ${
          tipo === "aluno" ? "aluno" : "professor"
        }?`
      )
    )
      return;
    try {
      if (tipo === "aluno") {
        await alunoService.delete(id);
      } else {
        await professorService.delete(id);
      }
      await loadPessoas();
    } catch (err) {
      setError(`Erro ao excluir ${tipo === "aluno" ? "aluno" : "professor"}`);
      console.error(err);
    }
  };

  const isAluno = tipo === "aluno";

  const filteredPessoas = pessoas.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (isAluno
        ? (p as Aluno).matricula
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (p as Aluno).curso.toLowerCase().includes(searchTerm.toLowerCase())
        : (p as Professor).siape
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (p as Professor).departamento
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
  );

  const total = pessoas.length;
  const resultados = filteredPessoas.length;

  if (loading) {
    return (
      <Layout>
        <div className="pessoas-container">
          <div className="loading-card">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="pessoas-container">
        {/* Cabeçalho */}
        <div className="pessoas-header">
          <div>
            <h1>👥 Gerenciamento de Pessoas</h1>
            <p className="subtitle">Alunos e professores do sistema SGPA</p>
          </div>
          <div className="header-actions">
            <div className="tipo-toggle">
              <button
                className={tipo === "aluno" ? "active" : ""}
                onClick={() => setTipo("aluno")}
              >
                Alunos
              </button>
              <button
                className={tipo === "professor" ? "active" : ""}
                onClick={() => setTipo("professor")}
              >
                Professores
              </button>
            </div>
            <button className="btn-primary" onClick={() => handleOpenModal()}>
              + Novo {isAluno ? "Aluno" : "Professor"}
            </button>
          </div>
        </div>

        {/* Erro */}
        {error && <div className="error-banner">{error}</div>}

        {/* Busca + Métricas */}
        <div className="controls-row">
          <div className="search-wrapper">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder={`Buscar por nome, email, ${
                  isAluno ? "matrícula/curso" : "SIAPE/departamento"
                }...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>

          <div className="stats-wrapper">
            <div className="stat-card total">
              <div className="stat-value">{total}</div>
              <div className="stat-label">Total</div>
            </div>
            <div className="stat-card filtered">
              <div className="stat-value">{resultados}</div>
              <div className="stat-label">Resultados</div>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="table-wrapper">
          {resultados === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>Nenhuma pessoa encontrada</h3>
              <p>Tente ajustar sua busca ou cadastre uma nova.</p>
            </div>
          ) : (
            <table className="pessoas-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>{isAluno ? "Matrícula" : "SIAPE"}</th>
                  <th>Email</th>
                  <th>{isAluno ? "Curso" : "Departamento"}</th>
                  {isAluno && <th>Telefone</th>}
                  <th className="actions-header">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredPessoas.map((pessoa) => (
                  <tr key={pessoa.id}>
                    <td>{pessoa.nome}</td>
                    <td>
                      {isAluno
                        ? (pessoa as Aluno).matricula
                        : (pessoa as Professor).siape}
                    </td>
                    <td>{pessoa.email}</td>
                    <td>
                      {isAluno
                        ? (pessoa as Aluno).curso
                        : (pessoa as Professor).departamento}
                    </td>
                    {isAluno && <td>{(pessoa as Aluno).telefone}</td>}
                    <td className="actions-cell">
                      <button
                        className="action-btn edit"
                        onClick={() => handleOpenModal(pessoa)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(pessoa.id!)}
                        title="Excluir"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  {editingPessoa
                    ? `Editar ${isAluno ? "Aluno" : "Professor"}`
                    : `Cadastrar Novo ${isAluno ? "Aluno" : "Professor"}`}
                </h2>
                <button className="close-btn" onClick={handleCloseModal}>
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <label>Nome Completo *</label>
                  <input
                    type="text"
                    value={formData.nome || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                    maxLength={50}
                    placeholder="Ex: João Silva"
                  />
                </div>

                <div className="form-row">
                  <label>{isAluno ? "Matrícula *" : "SIAPE *"}</label>
                  <input
                    type="text"
                    value={
                      (isAluno ? formData.matricula : formData.siape) || ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ...(isAluno
                          ? { matricula: e.target.value }
                          : { siape: e.target.value }),
                      })
                    }
                    required
                    maxLength={10}
                    placeholder={isAluno ? "Ex: 2021001" : "Ex: 1234567"}
                  />
                </div>

                <div className="form-row">
                  <label>Email Institucional *</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    maxLength={50}
                    placeholder={
                      isAluno ? "aluno@unifei.edu.br" : "prof@unifei.edu.br"
                    }
                  />
                </div>

                <div className="form-row">
                  <label>{isAluno ? "Curso *" : "Departamento *"}</label>
                  <input
                    type="text"
                    value={
                      (isAluno ? formData.curso : formData.departamento) || ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        ...(isAluno
                          ? { curso: e.target.value }
                          : { departamento: e.target.value }),
                      })
                    }
                    required
                    maxLength={50}
                    placeholder={
                      isAluno ? "Engenharia de Software" : "Computação"
                    }
                  />
                </div>

                {isAluno && (
                  <div className="form-row">
                    <label>Telefone *</label>
                    <input
                      type="tel"
                      value={formData.telefone || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                      }
                      required
                      maxLength={15}
                      placeholder="(35) 99999-9999"
                    />
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingPessoa ? "Atualizar" : "Cadastrar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
