// components/CriarTarefaModal.tsx
import React, { useState } from "react";
import { tarefaService } from "../services/tarefaService";
import type { Aluno } from "../types/aluno";
import "./CriarTarefaModal.css";

interface CriarTarefaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTarefaCriada: () => void;
  idProjeto: string;
  orientador: string;
  alunosDoProjeto: Aluno[];
}

export default function CriarTarefaModal({
  isOpen,
  onClose,
  onTarefaCriada,
  idProjeto,
  orientador,
  alunosDoProjeto,
}: CriarTarefaModalProps) {
  const [descricao, setDescricao] = useState("");
  const [responsaveis, setResponsaveis] = useState<string[]>([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [status, setStatus] = useState<
    "Pendente" | "Em andamento" | "Concluída"
  >("Pendente");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
        orientador,
        idProjeto,
        dataInicio: dataInicio ? new Date(dataInicio) : new Date(),
        dataFim: dataFim ? new Date(dataFim) : undefined,
        status,
      };

      await tarefaService.create(novaTarefa);
      alert("✅ Tarefa criada com sucesso!");
      onTarefaCriada();
      onClose();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("❌ Erro ao criar tarefa");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>📋 Nova Tarefa</h2>
        <form onSubmit={handleSubmit}>
          {/* Descrição */}
          <div className="form-group">
            <label>Descrição *</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
              maxLength={200}
              rows={3}
              placeholder="Descreva a tarefa..."
            />
          </div>

          {/* Responsáveis (apenas alunos do projeto) */}
          <div className="form-group">
            <label>Responsáveis *</label>
            <div className="checkbox-group">
              {alunosDoProjeto.map((aluno) => (
                <label key={aluno.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={aluno.id}
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
            {responsaveis.length === 0 && (
              <small className="error-text">
                Selecione pelo menos um responsável
              </small>
            )}
          </div>

          {/* Projeto e orientador (somente leitura) */}
          <div className="form-group">
            <label>Projeto</label>
            <input
              type="text"
              value={`Projeto ${idProjeto}`}
              disabled
              className="readonly-input"
            />
          </div>

          <div className="form-group">
            <label>Orientador</label>
            <input
              type="text"
              value={orientador}
              disabled
              className="readonly-input"
            />
          </div>

          {/* Datas */}
          <div className="form-row date-group">
            <div className="date-field">
              <label>Data de Início</label>
              <input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
              />
            </div>
            <div className="date-field">
              <label>Data de Fim</label>
              <input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
              />
            </div>
          </div>

          {/* Status */}
          <div className="form-group">
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

          {/* Ações */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Criar Tarefa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
