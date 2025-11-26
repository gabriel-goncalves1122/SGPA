import { useState, useEffect } from "react";
import { entregaService } from "../services/entregaService";
import { tarefaService } from "../services/tarefaService";
import { alunoService } from "../services/alunoService";
import type { Entrega } from "../types/entrega";
import type { Tarefa } from "../types/tarefa";
import type { Aluno } from "../types/aluno";
import Layout from "../components/Layout";
import "./Entregas.css";

export default function Entregas() {
  const [entregas, setEntregas] = useState<Entrega[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Omit<Entrega, "id">>({
    idTarefa: "",
    arquivo: "",
    alunoId: "",
    dataEnvio: new Date(),
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [entregasData, tarefasData, alunosData] = await Promise.all([
        entregaService.getAll(),
        tarefaService.getAll(),
        alunoService.getAll(),
      ]);
      setEntregas(entregasData);
      setTarefas(tarefasData);
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
      await entregaService.create(formData);
      alert("Entrega registrada com sucesso!");
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Erro ao registrar entrega:", error);
      alert("Erro ao registrar entrega");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir esta entrega?")) return;
    try {
      await entregaService.delete(id);
      alert("Entrega excluída com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao excluir entrega:", error);
      alert("Erro ao excluir entrega");
    }
  };

  const resetForm = () => {
    setFormData({
      idTarefa: "",
      arquivo: "",
      alunoId: "",
      dataEnvio: new Date(),
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const getTarefaDescricao = (id: string) => {
    const tarefa = tarefas.find((t) => t.id === id);
    return tarefa ? tarefa.descricao : "Desconhecida";
  };

  const getAlunoNome = (id?: string) => {
    if (!id) return "Desconhecido";
    const aluno = alunos.find((a) => a.id === id);
    return aluno ? aluno.nome : "Desconhecido";
  };

  const formatDate = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("pt-BR");
  };

  const formatDateInput = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  return (
    <Layout>
      <div className="entregas-container">
        <div className="entregas-header">
          <h1>Entregas</h1>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            + Registrar Entrega
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : (
          <div className="entregas-table-container">
            <table className="entregas-table">
              <thead>
                <tr>
                  <th>Tarefa</th>
                  <th>Aluno</th>
                  <th>Arquivo</th>
                  <th>Data de Envio</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {entregas.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="no-data">
                      Nenhuma entrega registrada
                    </td>
                  </tr>
                ) : (
                  entregas.map((entrega) => (
                    <tr key={entrega.id}>
                      <td>{getTarefaDescricao(entrega.idTarefa)}</td>
                      <td>{getAlunoNome(entrega.alunoId)}</td>
                      <td className="arquivo-cell">
                        <a
                          href={entrega.arquivo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="arquivo-link"
                        >
                          📎 {entrega.arquivo.split("/").pop() || entrega.arquivo}
                        </a>
                      </td>
                      <td>{formatDate(entrega.dataEnvio)}</td>
                      <td className="actions">
                        <button
                          className="btn-delete"
                          onClick={() => handleDelete(entrega.id!)}
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
              <h2>Registrar Entrega</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Tarefa *</label>
                  <select
                    value={formData.idTarefa}
                    onChange={(e) => setFormData({ ...formData, idTarefa: e.target.value })}
                    required
                  >
                    <option value="">Selecione uma tarefa</option>
                    {tarefas.map((tarefa) => (
                      <option key={tarefa.id} value={tarefa.id}>
                        {tarefa.descricao}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Aluno *</label>
                  <select
                    value={formData.alunoId}
                    onChange={(e) => setFormData({ ...formData, alunoId: e.target.value })}
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
                  <label>Arquivo/Link *</label>
                  <input
                    type="text"
                    value={formData.arquivo}
                    onChange={(e) => setFormData({ ...formData, arquivo: e.target.value })}
                    required
                    placeholder="URL do arquivo ou link do Drive"
                  />
                  <small className="field-hint">
                    Cole o link do arquivo (Google Drive, Dropbox, etc.)
                  </small>
                </div>

                <div className="form-group">
                  <label>Data de Envio</label>
                  <input
                    type="date"
                    value={formatDateInput(formData.dataEnvio)}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dataEnvio: e.target.value ? new Date(e.target.value) : new Date(),
                      })
                    }
                  />
                </div>

                <div className="modal-actions">
                  <button type="button" onClick={handleCloseModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    Registrar
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
