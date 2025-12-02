// components/TarefasProjetoModal.tsx
import React, { useState } from "react";
import { tarefaService } from "../services/tarefaService";
import type { Tarefa, StatusTarefa } from "../types/tarefa";
import type { Aluno } from "../types/aluno";
import type { Projeto } from "../types/projeto";
import "./TarefasProjetoModal.css";

interface TarefasProjetoModalProps {
  projeto: Projeto;
  tarefas: Tarefa[];
  isVisible: boolean;
  onClose: () => void;
  onTarefaCriada: () => void;
  alunosDoProjeto: Aluno[];
}

export default function TarefasProjetoModal({
  projeto,
  tarefas,
  isVisible,
  onClose,
  onTarefaCriada,
  alunosDoProjeto,
}: TarefasProjetoModalProps) {
  const [showForm, setShowForm] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [responsaveis, setResponsaveis] = useState<string[]>([]);
  const [status, setStatus] = useState<StatusTarefa>("Pendente");

  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<Tarefa | null>(null);
  const [novoStatus, setNovoStatus] = useState<StatusTarefa>("Pendente");

  // ✅ Função MOVIDA para o nível do componente
  const handleSalvarStatus = async () => {
    if (!tarefaEmEdicao) return;

    try {
      await tarefaService.update(tarefaEmEdicao.id!, { status: novoStatus });
      alert("✅ Status atualizado!");
      onTarefaCriada(); // recarrega as tarefas
      setTarefaEmEdicao(null);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("❌ Erro ao atualizar status");
    }
  };

  const handleCriarTarefa = async () => {
    if (!descricao.trim()) {
      alert("Descrição é obrigatória");
      return;
    }
    if (responsaveis.length === 0) {
      alert("Selecione pelo menos um responsável");
      return;
    }

    try {
      const novaTarefa = {
        descricao: descricao.trim(),
        responsaveis,
        orientador: projeto.orientador,
        idProjeto: projeto.id!,
        dataInicio: new Date(),
        status,
      };

      await tarefaService.create(novaTarefa);
      alert("✅ Tarefa criada com sucesso!");
      onTarefaCriada();
      setDescricao("");
      setResponsaveis([]);
      setStatus("Pendente");
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("❌ Erro ao criar tarefa");
    }
  };

  const formatDate = (date: any): string => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Tarefas do Projeto: {projeto.titulo}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {!showForm && (
            <button
              className="btn-primary btn-add-tarefa"
              onClick={() => setShowForm(true)}
            >
              + Nova Tarefa
            </button>
          )}

          {showForm && (
            <div className="tarefa-form">
              <h3>Nova Tarefa</h3>
              {/* ... campos do formulário ... */}
              <div className="form-row">
                <label>Descrição *</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  maxLength={200}
                  rows={2}
                  placeholder="Descreva a tarefa..."
                />
              </div>

              <div className="form-row">
                <label>Responsáveis *</label>
                <div className="checkbox-group">
                  {alunosDoProjeto.map((aluno) => (
                    <label key={aluno.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        value={aluno.id!}
                        checked={responsaveis.includes(aluno.id!)}
                        onChange={(e) => {
                          const { value, checked } = e.target;
                          if (checked) {
                            setResponsaveis([...responsaveis, value]);
                          } else {
                            setResponsaveis(
                              responsaveis.filter((id) => id !== value)
                            );
                          }
                        }}
                      />
                      <span>{aluno.nome}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <label>Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as StatusTarefa)}
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCriarTarefa}
                >
                  Criar Tarefa
                </button>
              </div>
            </div>
          )}

          {tarefas.length === 0 && !showForm ? (
            <p>Nenhuma tarefa cadastrada para este projeto.</p>
          ) : (
            <table className="tarefas-table">
              <thead>
                <tr>
                  <th>Descrição</th>
                  <th>Responsáveis</th>
                  <th>Status</th>
                  <th>Início</th>
                </tr>
              </thead>
              <tbody>
                {tarefas.map((tarefa) => (
                  <tr key={tarefa.id}>
                    <td>{tarefa.descricao || "Sem descrição"}</td>
                    <td>{tarefa.responsaveis?.length || 0}</td>
                    <td>
                      <div className="status-inline">
                        <span
                          className={`status-badge ${
                            tarefa.status?.toLowerCase() || "pendente"
                          }`}
                        >
                          {tarefa.status || "Pendente"}
                        </span>
                        <button
                          className="btn-edit-status"
                          onClick={() => {
                            setTarefaEmEdicao(tarefa);
                            setNovoStatus(tarefa.status || "Pendente");
                          }}
                          title="Editar status"
                        >
                          ✏️
                        </button>
                      </div>
                    </td>
                    <td>{formatDate(tarefa.dataInicio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ✅ Modal de edição de status FORA da tabela */}
        {tarefaEmEdicao && (
          <div
            className="modal-overlay"
            onClick={() => setTarefaEmEdicao(null)}
          >
            <div
              className="modal-content pequeno"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Editar Status da Tarefa</h3>
              <div className="form-row">
                <label>
                  Status atual: {tarefaEmEdicao.status || "Pendente"}
                </label>
                <select
                  value={novoStatus}
                  onChange={(e) =>
                    setNovoStatus(e.target.value as StatusTarefa)
                  }
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em andamento">Em andamento</option>
                  <option value="Concluída">Concluída</option>
                </select>
              </div>
              <div className="form-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setTarefaEmEdicao(null)}
                >
                  Cancelar
                </button>
                <button className="btn-primary" onClick={handleSalvarStatus}>
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
