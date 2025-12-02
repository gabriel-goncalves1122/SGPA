// components/TarefasProjetoModal.tsx
import React from "react";
import { tarefaService } from "../services/tarefaService";
import type { Tarefa } from "../types/tarefa";
import type { Projeto } from "../types/projeto";
import "./TarefasProjetoModal.css";

interface TarefasProjetoModalProps {
  projeto: Projeto;
  tarefas: Tarefa[];
  isVisible: boolean;
  onClose: () => void;
  onTarefaCriada: () => void; // para recarregar as tarefas
}

export default function TarefasProjetoModal({
  projeto,
  tarefas,
  isVisible,
  onClose,
  onTarefaCriada,
}: TarefasProjetoModalProps) {
  if (!isVisible) return null;

  const handleCriarTarefa = async () => {
    if (!projeto.id) return;

    const novaTarefa = {
      descricao: `Nova tarefa - ${projeto.titulo}`,
      responsaveis: [],
      orientador: projeto.orientador,
      idProjeto: projeto.id,
      dataInicio: new Date(),
      status: "Pendente" as const,
    };

    try {
      await tarefaService.create(novaTarefa);
      alert("✅ Tarefa criada com sucesso!");
      onTarefaCriada(); // notifica o pai para atualizar a lista
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
          {tarefas.length === 0 ? (
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
                    <td>
                      {tarefa.responsaveis?.length > 0
                        ? tarefa.responsaveis.length
                        : "Nenhum"}
                    </td>
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

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>
            Fechar
          </button>
          <button className="btn-primary" onClick={handleCriarTarefa}>
            + Nova Tarefa
          </button>
        </div>
      </div>
    </div>
  );
}
