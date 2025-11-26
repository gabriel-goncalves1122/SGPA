import { useState, useEffect } from "react";
import { projetoService } from "../services/projetoService";
import { professorService } from "../services/professorService";
import { alunoService } from "../services/alunoService";
import { equipesService } from "../services/equipesService";
import type { Projeto } from "../types/projeto";
import type { Professor } from "../types/professor";
import type { Aluno } from "../types/aluno";
import Layout from "../components/Layout";
import "./Projetos.css";

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEquipeModal, setShowEquipeModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedProjetoId, setSelectedProjetoId] = useState<string | null>(null);
  const [selectedAlunos, setSelectedAlunos] = useState<string[]>([]);
  const [formData, setFormData] = useState<Omit<Projeto, "id">>({
    titulo: "",
    descricao: "",
    orientador: "",
    dataInicio: new Date(),
    dataFim: undefined,
    status: "Em andamento",
    alunos: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projetosData, professoresData, alunosData] = await Promise.all([
        projetoService.getAll(),
        professorService.getAll(),
        alunoService.getAll(),
      ]);
      setProjetos(projetosData);
      setProfessores(professoresData);
      setAlunos(alunosData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await projetoService.update(editingId, formData);
        alert("Projeto atualizado com sucesso!");
      } else {
        await projetoService.create(formData);
        alert("Projeto cadastrado com sucesso!");
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      alert("Erro ao salvar projeto");
    }
  };

  const handleEdit = (projeto: Projeto) => {
    setEditingId(projeto.id || null);
    setFormData({
      titulo: projeto.titulo,
      descricao: projeto.descricao,
      orientador: projeto.orientador,
      dataInicio: projeto.dataInicio,
      dataFim: projeto.dataFim,
      status: projeto.status,
      alunos: projeto.alunos || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este projeto?")) return;
    try {
      await projetoService.delete(id);
      alert("Projeto excluído com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      alert("Erro ao excluir projeto");
    }
  };

  const handleManageEquipe = (projeto: Projeto) => {
    setSelectedProjetoId(projeto.id || null);
    setSelectedAlunos(projeto.alunos || []);
    setShowEquipeModal(true);
  };

  const handleAddAlunoToEquipe = async (alunoId: string, papel: "Participante" | "Líder") => {
    if (!selectedProjetoId) return;
    try {
      await equipesService.create({
        idAluno: alunoId,
        idProjeto: selectedProjetoId,
        papel,
      });
      alert("Aluno adicionado à equipe!");
      setSelectedAlunos([...selectedAlunos, alunoId]);
      loadData();
    } catch (error) {
      console.error("Erro ao adicionar aluno à equipe:", error);
      alert("Erro ao adicionar aluno à equipe");
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      orientador: "",
      dataInicio: new Date(),
      dataFim: undefined,
      status: "Em andamento",
      alunos: [],
    });
    setEditingId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleCloseEquipeModal = () => {
    setShowEquipeModal(false);
    setSelectedProjetoId(null);
    setSelectedAlunos([]);
  };

  const getProfessorNome = (id: string) => {
    const prof = professores.find((p) => p.id === id);
    return prof ? prof.nome : "Desconhecido";
  };

  const getAlunoNome = (id: string) => {
    const aluno = alunos.find((a) => a.id === id);
    return aluno ? aluno.nome : "Desconhecido";
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <Layout>
      <div className="projetos-container">
        <div className="projetos-header">
          <h1>Projetos</h1>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Novo Projeto
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="projetos-grid">
            {projetos.length === 0 ? (
              <div className="no-data">Nenhum projeto cadastrado</div>
            ) : (
              projetos.map((projeto) => (
                <div key={projeto.id} className="projeto-card">
                  <div className="projeto-header">
                    <h3>{projeto.titulo}</h3>
                    <span className={`status-badge ${projeto.status?.toLowerCase().replace(" ", "-")}`}>
                      {projeto.status}
                    </span>
                  </div>
                  <p className="projeto-descricao">{projeto.descricao || "Sem descrição"}</p>
                  <div className="projeto-info">
                    <div className="info-item">
                      <strong>Orientador:</strong> {getProfessorNome(projeto.orientador)}
                    </div>
                    <div className="info-item">
                      <strong>Início:</strong> {formatDate(projeto.dataInicio)}
                    </div>
                    {projeto.dataFim && (
                      <div className="info-item">
                        <strong>Fim:</strong> {formatDate(projeto.dataFim)}
                      </div>
                    )}
                    <div className="info-item">
                      <strong>Alunos:</strong> {projeto.alunos?.length || 0}
                    </div>
                  </div>
                  <div className="projeto-actions">
                    <button className="btn-equipe" onClick={() => handleManageEquipe(projeto)}>
                      Gerenciar Equipe
                    </button>
                    <button className="btn-edit" onClick={() => handleEdit(projeto)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(projeto.id!)}>
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {showModal && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingId ? "Editar Projeto" : "Novo Projeto"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Título *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    required
                    maxLength={80}
                  />
                </div>

                <div className="form-group">
                  <label>Descrição</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    maxLength={500}
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Orientador *</label>
                  <select
                    value={formData.orientador}
                    onChange={(e) => setFormData({ ...formData, orientador: e.target.value })}
                    required
                  >
                    <option value="">Selecione um professor</option>
                    {professores.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Data de Início *</label>
                  <input
                    type="date"
                    value={formatDate(formData.dataInicio)}
                    onChange={(e) => setFormData({ ...formData, dataInicio: new Date(e.target.value) })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Data de Fim</label>
                  <input
                    type="date"
                    value={formData.dataFim ? formatDate(formData.dataFim) : ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataFim: e.target.value ? new Date(e.target.value) : undefined,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluído">Concluído</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
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

        {showEquipeModal && (
          <div className="modal-overlay" onClick={handleCloseEquipeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Gerenciar Equipe</h2>
              <div className="equipe-list">
                <h3>Alunos no Projeto</h3>
                {selectedAlunos.length === 0 ? (
                  <p>Nenhum aluno na equipe</p>
                ) : (
                  <ul>
                    {selectedAlunos.map((alunoId) => (
                      <li key={alunoId}>{getAlunoNome(alunoId)}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="add-aluno-section">
                <h3>Adicionar Aluno</h3>
                {alunos
                  .filter((a) => !selectedAlunos.includes(a.id!))
                  .map((aluno) => (
                    <div key={aluno.id} className="aluno-item">
                      <span>{aluno.nome}</span>
                      <div>
                        <button
                          className="btn-small"
                          onClick={() => handleAddAlunoToEquipe(aluno.id!, "Participante")}
                        >
                          + Participante
                        </button>
                        <button
                          className="btn-small btn-leader"
                          onClick={() => handleAddAlunoToEquipe(aluno.id!, "Líder")}
                        >
                          + Líder
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="modal-actions">
                <button onClick={handleCloseEquipeModal}>Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
