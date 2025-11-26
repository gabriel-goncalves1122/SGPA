import { useState, useEffect } from "react";
import { professorService } from "../services/professorService";
import type { Professor } from "../types/professor";
import Layout from "../components/Layout";
import "./Professores.css";

export default function Professores() {
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Professor, "id">>({
    nome: "",
    siape: "",
    email: "",
    departamento: "",
  });

  useEffect(() => {
    loadProfessores();
  }, []);

  const loadProfessores = async () => {
    try {
      setLoading(true);
      const data = await professorService.getAll();
      setProfessores(data);
    } catch (error) {
      console.error("Erro ao carregar professores:", error);
      alert("Erro ao carregar professores");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await professorService.update(editingId, formData);
        alert("Professor atualizado com sucesso!");
      } else {
        await professorService.create(formData);
        alert("Professor cadastrado com sucesso!");
      }
      setShowModal(false);
      resetForm();
      loadProfessores();
    } catch (error) {
      console.error("Erro ao salvar professor:", error);
      alert("Erro ao salvar professor");
    }
  };

  const handleEdit = (professor: Professor) => {
    setEditingId(professor.id || null);
    setFormData({
      nome: professor.nome,
      siape: professor.siape,
      email: professor.email,
      departamento: professor.departamento,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este professor?")) return;
    try {
      await professorService.delete(id);
      alert("Professor excluído com sucesso!");
      loadProfessores();
    } catch (error) {
      console.error("Erro ao excluir professor:", error);
      alert("Erro ao excluir professor");
    }
  };

  const resetForm = () => {
    setFormData({
      nome: "",
      siape: "",
      email: "",
      departamento: "",
    });
    setEditingId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <Layout>
      <div className="professores-container">
        <div className="professores-header">
          <h1>Professores</h1>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Novo Professor
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="professores-table-container">
            <table className="professores-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>SIAPE</th>
                  <th>Email</th>
                  <th>Departamento</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {professores.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="no-data">
                      Nenhum professor cadastrado
                    </td>
                  </tr>
                ) : (
                  professores.map((professor) => (
                    <tr key={professor.id}>
                      <td>{professor.nome}</td>
                      <td>{professor.siape}</td>
                      <td>{professor.email}</td>
                      <td>{professor.departamento}</td>
                      <td className="actions">
                        <button
                          className="btn-edit"
                          onClick={() => handleEdit(professor)}
                        >
                          Editar
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(professor.id!)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingId ? "Editar Professor" : "Novo Professor"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nome *</label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label>SIAPE *</label>
                  <input
                    type="text"
                    value={formData.siape}
                    onChange={(e) =>
                      setFormData({ ...formData, siape: e.target.value })
                    }
                    required
                    maxLength={10}
                  />
                </div>

                <div className="form-group">
                  <label>Email Institucional *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    maxLength={50}
                  />
                </div>

                <div className="form-group">
                  <label>Departamento *</label>
                  <input
                    type="text"
                    value={formData.departamento}
                    onChange={(e) =>
                      setFormData({ ...formData, departamento: e.target.value })
                    }
                    required
                    maxLength={50}
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingId ? "Atualizar" : "Cadastrar"}
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
