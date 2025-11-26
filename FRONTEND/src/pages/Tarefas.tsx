import { useState, useEffect } from "react";
import { tarefaService } from "../services/tarefaService";
import { projetoService } from "../services/projetoService";
import { alunoService } from "../services/alunoService";
import type { Tarefa, StatusTarefa } from "../types/tarefa";
import type { Projeto } from "../types/projeto";
import type { Aluno } from "../types/aluno";
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
  const [formData, setFormData] = useState<Omit<Tarefa, "id">>({
    descricao: "",
    responsavel: "",
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
      const [tarefasData, projetosData, alunosData] = await Promise.all([
        tarefaService.getAll(),
        projetoService.getAll(),
        alunoService.getAll(),
      ]);
      setTarefas(tarefasData);
      setProjetos(projetosData);
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
      descricao: tarefa.descricao,
      responsavel: tarefa.responsavel,
      idProjeto: tarefa.idProjeto,
      dataInicio: tarefa.dataInicio,
      dataFim: tarefa.dataFim,
      status: tarefa.status,
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
      responsavel: "",
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

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
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
                    <span className={`status-badge ${tarefa.status?.toLowerCase().replace(" ", "-")}`}>
                      {tarefa.status}
                    </span>
                  </div>
                  <p className="tarefa-descricao">{tarefa.descricao}</p>
                  <div className="tarefa-info">
                    <div className="info-item">
                      <strong>Responsável:</strong> {getAlunoNome(tarefa.responsavel)}
                    </div>
                    <div className="info-item">
                      <strong>Projeto:</strong> {getProjetoNome(tarefa.idProjeto)}
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
                    <button className="btn-edit" onClick={() => handleEdit(tarefa)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(tarefa.id!)}>
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
              <h2>{editingId ? "Editar Tarefa" : "Nova Tarefa"}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Descrição *</label>
                  <textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    required
                    maxLength={200}
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Responsável *</label>
                  <select
                    value={formData.responsavel}
                    onChange={(e) => setFormData({ ...formData, responsavel: e.target.value })}
                    required
                  >
                    <option value="">Selecione um aluno</option>
                    {alunos.map((aluno) => (
                      <option key={aluno.id} value={aluno.id}>
                        {aluno.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Projeto</label>
                  <select
                    value={formData.idProjeto}
                    onChange={(e) => setFormData({ ...formData, idProjeto: e.target.value })}
                  >
                    <option value="">Sem projeto</option>
                    {projetos.map((proj) => (
                      <option key={proj.id} value={proj.id}>
                        {proj.titulo}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Data de Início</label>
                  <input
                    type="date"
                    value={formData.dataInicio ? formatDate(formData.dataInicio) : ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataInicio: e.target.value ? new Date(e.target.value) : undefined,
                      })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as StatusTarefa })
                    }
                    required
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Em andamento">Em andamento</option>
                    <option value="Concluída">Concluída</option>
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
      </div>
    </Layout>
  );
}
