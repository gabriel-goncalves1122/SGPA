import { useState, useEffect } from "react";
import { tarefaService } from "../services/tarefaService";
import { projetoService } from "../services/projetoService";
import { alunoService } from "../services/alunoService";
import type { Tarefa, StatusTarefa } from "../types/tarefa";
import type { Projeto } from "../types/projeto";
import type { Aluno } from "../types/aluno";
import { professorService } from "../services/professorService";
import type { Professor } from "../types/professor";
import Layout from "../components/Layout";
import "./Tarefas.css";

export default function Tarefas() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("Todos");
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [formData, setFormData] = useState<Omit<Tarefa, "id">>({
    descricao: "",
    responsaveis: [], // agora é array
    orientador: "", // novo campo (pode ser string vazia ou null)
    idProjeto: "",
    dataInicio: new Date(),
    dataFim: undefined,
    status: "Pendente",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tarefasData, projetosData, alunosData, professorData] =
        await Promise.all([
          tarefaService.getAll(),
          projetoService.getAll(),
          alunoService.getAll(),
          professorService.getAll(),
        ]);
      setTarefas(tarefasData);
      setProjetos(projetosData);
      setAlunos(alunosData);
      setProfessores(professorData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const getProfessorNome = (id: string): string => {
    const prof = professores.find((p) => p.id === id);
    return prof ? prof.nome : "Desconhecido";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await tarefaService.update(editingId, formData);
        alert("Tarefa atualizada com sucesso!");
      } else {
        await tarefaService.create(formData);
        alert("Tarefa cadastrada com sucesso!");
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      alert("Erro ao salvar tarefa");
    }
  };

  const handleEdit = (tarefa: Tarefa) => {
    setEditingId(tarefa.id || null);
    setFormData({
      descricao: tarefa.descricao || "",
      responsaveis: Array.isArray(tarefa.responsaveis)
        ? tarefa.responsaveis
        : [],
      orientador: tarefa.orientador || "",
      idProjeto: tarefa.idProjeto || "",
      dataInicio: tarefa.dataInicio,
      dataFim: tarefa.dataFim,
      status: tarefa.status || "Pendente",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta tarefa?")) return;
    try {
      await tarefaService.delete(id);
      alert("Tarefa excluída com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao excluir tarefa:", error);
      alert("Erro ao excluir tarefa");
    }
  };

  const resetForm = () => {
    setFormData({
      descricao: "",
      responsaveis: [], // ← array vazio de strings
      orientador: "", // ou undefined, mas string vazia é mais fácil no select
      idProjeto: "",
      dataInicio: new Date(),
      dataFim: undefined,
      status: "Pendente",
    });
    setEditingId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const getProjetoNome = (id?: string) => {
    if (!id) return "Sem projeto";
    const proj = projetos.find((p) => p.id === id);
    return proj ? proj.titulo : "Desconhecido";
  };

  const getAlunoNome = (id: string) => {
    const aluno = alunos.find((a) => a.id === id);
    return aluno ? aluno.nome : "Desconhecido";
  };
  const formatDate = (date: any): string => {
    if (!date) return "";

    // Se já for string no formato YYYY-MM-DD, retorna direto
    if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)) {
      return date;
    }

    const d = new Date(date);
    // Verifica se a data é válida
    if (isNaN(d.getTime())) {
      console.warn("Data inválida recebida:", date);
      return "";
    }

    return d.toISOString().split("T")[0];
  };

  const filteredTarefas = tarefas.filter((tarefa) => {
    if (filterStatus === "Todos") return true;
    return tarefa.status === filterStatus;
  });

  return (
    <Layout>
      <div className="tarefas-container">
        <div className="tarefas-header">
          <h1>Tarefas</h1>
          <div className="header-actions">
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="Todos">Todos os Status</option>
              <option value="Pendente">Pendente</option>
              <option value="Em andamento">Em andamento</option>
              <option value="Concluída">Concluída</option>
            </select>
            <button
              className="btn-primary"
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
            >
              + Nova Tarefa
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="tarefas-grid">
            {filteredTarefas.length === 0 ? (
              <div className="no-data">Nenhuma tarefa encontrada</div>
            ) : (
              filteredTarefas.map((tarefa) => (
                <div key={tarefa.id} className="tarefa-card">
                  <div className="tarefa-header">
                    <span
                      className={`status-badge ${tarefa.status
                        ?.toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {tarefa.status}
                    </span>
                  </div>
                  <p className="tarefa-descricao">{tarefa.descricao}</p>
                  <div className="tarefa-info">
                    <div className="info-item">
                      <strong>Responsáveis:</strong>
                      {tarefa.responsaveis && tarefa.responsaveis.length > 0
                        ? tarefa.responsaveis
                            .map((id) => getAlunoNome(id))
                            .join(", ")
                        : "Nenhum"}
                    </div>

                    {tarefa.orientador && (
                      <div className="info-item">
                        <strong>Orientador:</strong>{" "}
                        {getProfessorNome(tarefa.orientador)}
                      </div>
                    )}

                    <div className="info-item">
                      <strong>Projeto:</strong>{" "}
                      {getProjetoNome(tarefa.idProjeto)}
                    </div>
                    {tarefa.dataInicio && (
                      <div className="info-item">
                        <strong>Início:</strong> {formatDate(tarefa.dataInicio)}
                      </div>
                    )}
                    {tarefa.dataFim && (
                      <div className="info-item">
                        <strong>Prazo:</strong> {formatDate(tarefa.dataFim)}
                      </div>
                    )}
                  </div>
                  <div className="tarefa-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEdit(tarefa)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(tarefa.id!)}
                    >
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
              <div className="modal-header">
                <h2>{editingId ? "Editar Tarefa" : "Nova Tarefa"}</h2>
                <button className="close-btn" onClick={handleCloseModal}>
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                {/* Descrição */}
                <div className="form-row">
                  <label htmlFor="descricao">Descrição *</label>
                  <textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) =>
                      setFormData({ ...formData, descricao: e.target.value })
                    }
                    required
                    maxLength={200}
                    rows={3}
                    placeholder="Descreva a tarefa brevemente..."
                  />
                  <small className="char-count">
                    {formData.descricao?.length || 0}/200
                  </small>
                </div>

                {/* Responsáveis */}
                <div className="form-row">
                  <label>Responsáveis *</label>
                  <div className="checkbox-group">
                    {alunos.map((aluno) => (
                      <label key={aluno.id} className="checkbox-item">
                        <input
                          type="checkbox"
                          value={aluno.id ?? ""}
                          checked={
                            aluno.id
                              ? formData.responsaveis.includes(aluno.id)
                              : false
                          }
                          onChange={(e) => {
                            const { value, checked } = e.target;
                            setFormData((prev) => {
                              if (checked) {
                                return {
                                  ...prev,
                                  responsaveis: [...prev.responsaveis, value],
                                };
                              } else {
                                return {
                                  ...prev,
                                  responsaveis: prev.responsaveis.filter(
                                    (id) => id !== value
                                  ),
                                };
                              }
                            });
                          }}
                        />
                        <span>{aluno.nome}</span>
                      </label>
                    ))}
                  </div>
                  {formData.responsaveis.length === 0 && (
                    <small className="error-text">
                      Selecione pelo menos um responsável
                    </small>
                  )}
                </div>

                {/* Orientador */}
                <div className="form-row">
                  <label htmlFor="orientador">Orientador</label>
                  <select
                    id="orientador"
                    value={formData.orientador ?? ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        orientador: e.target.value || undefined,
                      })
                    }
                  >
                    <option value="">Nenhum</option>
                    {professores.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Projeto */}
                <div className="form-row">
                  <label htmlFor="projeto">Projeto</label>
                  <select
                    id="projeto"
                    value={formData.idProjeto || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        idProjeto: e.target.value || undefined,
                      })
                    }
                  >
                    <option value="">Nenhum</option>
                    {projetos.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Datas */}
                <div className="form-row date-group">
                  <div className="date-field">
                    <label htmlFor="dataInicio">Data de Início</label>
                    <input
                      id="dataInicio"
                      type="date"
                      value={
                        formData.dataInicio
                          ? formatDate(formData.dataInicio)
                          : ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataInicio: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                  <div className="date-field">
                    <label htmlFor="dataFim">Data de Fim</label>
                    <input
                      id="dataFim"
                      type="date"
                      value={
                        formData.dataFim ? formatDate(formData.dataFim) : ""
                      }
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          dataFim: e.target.value
                            ? new Date(e.target.value)
                            : undefined,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="form-row">
                  <label htmlFor="status">Status *</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as StatusTarefa,
                      })
                    }
                    required
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluída">Concluída</option>
                  </select>
                </div>

                {/* Ações */}
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={handleCloseModal}
                  >
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
