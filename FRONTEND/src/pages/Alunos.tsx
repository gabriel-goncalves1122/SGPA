import { useState, useEffect } from "react";
import { alunoService } from "../services/alunoService";
import type { Aluno } from "../types/aluno";
import "./Alunos.css";

const Alunos = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState<Aluno | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    matricula: "",
    email: "",
    curso: "",
    telefone: "",
  });

  useEffect(() => {
    loadAlunos();
  }, []);

  const loadAlunos = async () => {
    try {
      setLoading(true);
      const data = await alunoService.getAll();
      setAlunos(data);
      setError(null);
    } catch (err) {
      setError("Erro ao carregar alunos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (aluno?: Aluno) => {
    if (aluno) {
      setEditingAluno(aluno);
      setFormData({
        nome: aluno.nome,
        matricula: aluno.matricula,
        email: aluno.email,
        curso: aluno.curso,
        telefone: aluno.telefone,
      });
    } else {
      setEditingAluno(null);
      setFormData({
        nome: "",
        matricula: "",
        email: "",
        curso: "",
        telefone: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAluno(null);
    setFormData({
      nome: "",
      matricula: "",
      email: "",
      curso: "",
      telefone: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAluno) {
        await alunoService.update(editingAluno.id!, formData);
      } else {
        await alunoService.create(formData);
      }
      await loadAlunos();
      handleCloseModal();
    } catch (err) {
      setError("Erro ao salvar aluno");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este aluno?")) {
      try {
        await alunoService.delete(id);
        await loadAlunos();
      } catch (err) {
        setError("Erro ao excluir aluno");
        console.error(err);
      }
    }
  };

  const filteredAlunos = alunos.filter(
    (aluno) =>
      aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.matricula.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.curso.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="alunos-container">
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="alunos-container">
      <div className="alunos-header">
        <h1>Gerenciamento de Alunos</h1>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          + Novo Aluno
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="search-bar">
        <input
          type="text"
          placeholder="Buscar por nome, matrícula, email ou curso..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="alunos-stats">
        <div className="stat-card">
          <h3>{alunos.length}</h3>
          <p>Total de Alunos</p>
        </div>
        <div className="stat-card">
          <h3>{filteredAlunos.length}</h3>
          <p>Resultados da Busca</p>
        </div>
      </div>

      <div className="table-container">
        <table className="alunos-table">
          <thead>
            <tr>
              <th>Matrícula</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Curso</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlunos.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  Nenhum aluno encontrado
                </td>
              </tr>
            ) : (
              filteredAlunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.matricula}</td>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>{aluno.curso}</td>
                  <td>{aluno.telefone}</td>
                  <td className="actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleOpenModal(aluno)}
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(aluno.id!)}
                      title="Excluir"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingAluno ? "Editar Aluno" : "Novo Aluno"}</h2>
              <button className="close-button" onClick={handleCloseModal}>
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nome">Nome Completo *</label>
                <input
                  type="text"
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                  maxLength={50}
                  placeholder="Digite o nome completo"
                />
              </div>

              <div className="form-group">
                <label htmlFor="matricula">Matrícula *</label>
                <input
                  type="text"
                  id="matricula"
                  value={formData.matricula}
                  onChange={(e) =>
                    setFormData({ ...formData, matricula: e.target.value })
                  }
                  required
                  maxLength={10}
                  placeholder="Digite a matrícula"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Institucional *</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  maxLength={50}
                  placeholder="aluno@instituicao.edu.br"
                />
              </div>

              <div className="form-group">
                <label htmlFor="curso">Curso *</label>
                <input
                  type="text"
                  id="curso"
                  value={formData.curso}
                  onChange={(e) =>
                    setFormData({ ...formData, curso: e.target.value })
                  }
                  required
                  maxLength={30}
                  placeholder="Digite o curso"
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefone">Telefone *</label>
                <input
                  type="tel"
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) =>
                    setFormData({ ...formData, telefone: e.target.value })
                  }
                  required
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCloseModal}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn-save">
                  {editingAluno ? "Salvar Alterações" : "Cadastrar Aluno"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alunos;
