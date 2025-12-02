// components/TarefasProjetoModal.tsx
import React, { useState } from "react";
import { tarefaService } from "../services/tarefaService";
import type { Tarefa } from "../types/tarefa";
import type { Aluno } from "../types/aluno";
import type { Projeto } from "../types/projeto";
import "./TarefasProjetoModal.css";

interface TarefasProjetoModalProps {
  projeto: Projeto;
  tarefas: Tarefa[];
  isVisible: boolean;
  onClose: () => void;
  onTarefaCriada: () => void;
  alunosDoProjeto: Aluno[]; // 👈 novos alunos filtrados
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
  const [status, setStatus] = useState<
    "Pendente" | "Em andamento" | "Concluída"
  >("Pendente");

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
        orientador: projeto.orientador, // ✅ do projeto pai
        idProjeto: projeto.id!, // ✅ do projeto pai
        dataInicio: new Date(),
        status,
      };

      await tarefaService.create(novaTarefa);
      alert("✅ Tarefa criada com sucesso!");
      onTarefaCriada(); // recarrega as tarefas
      // Resetar formulário
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
          {/* Botão para abrir formulário */}
          {!showForm && (
            <button
              className="btn-primary btn-add-tarefa"
              onClick={() => setShowForm(true)}
            >
              + Nova Tarefa
            </button>
          )}

          {/* Formulário de criação */}
          {showForm && (
            <div className="tarefa-form">
              <h3>Nova Tarefa</h3>
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
                  onChange={(e) => setStatus(e.target.value as any)}
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

          {/* Lista de tarefas */}
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
                      <span
                        className={`status-badge ${
                          tarefa.status?.toLowerCase() || "pendente"
                        }`}
                      >
                        {tarefa.status || "Pendente"}
                      </span>
                    </td>
                    <td>{formatDate(tarefa.dataInicio)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
