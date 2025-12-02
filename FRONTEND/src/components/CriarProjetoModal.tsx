// components/CriarProjetoModal.tsx
import React, { useState } from "react";
import ProjetoForm from "./ProjetoForm";
import type { Professor } from "../types/professor"; // ajuste o caminho se necessário
import type { Aluno } from "../types/aluno"; // 👈 necessário
import { projetoService } from "../services/projetoService";
import { formToProjeto } from "../types/ProjetoForm";
import type { ProjetoForm as ProjetoFormType } from "../types/ProjetoForm";
import "./ProjetoForm.css";

interface CriarProjetoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjetoCriado: () => void;
  professores: Professor[];
  alunos: Aluno[]; // 👈 necessário
}

export default function CriarProjetoModal({
  isOpen,
  onClose,
  onProjetoCriado,
  professores,
  alunos,
}: CriarProjetoModalProps) {
  const [formData, setFormData] = useState<ProjetoFormType>({
    titulo: "",
    descricao: "",
    orientador: "",
    dataInicio: "",
    dataFim: "",
    status: "Em andamento",
    alunos: [],
  });

  const handleChange = (field: keyof ProjetoFormType, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAlunoToggle = (alunoId: string) => {
    setFormData((prev) => {
      const novosAlunos = prev.alunos.includes(alunoId)
        ? prev.alunos.filter((id) => id !== alunoId)
        : [...prev.alunos, alunoId];
      return { ...prev, alunos: novosAlunos };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = formToProjeto(formData);
      await projetoService.create(payload);
      alert("✅ Projeto cadastrado com sucesso!");
      onProjetoCriado();
      onClose();
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
      alert("❌ Erro ao criar projeto");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Novo Projeto</h2>

        <form onSubmit={handleSubmit}>
          <ProjetoForm
            formData={formData}
            professores={professores}
            onChange={handleChange}
            isEditing={false} // ← pois é "Criar", não "Editar"
          />

          {
            <div className="form-group">
              <label>Alunos já selecionados: {formData.alunos.length}</label>
              <div
                style={{
                  minHeight: "1.5rem",
                  fontSize: "0.9rem",
                  color: "#666",
                }}
              >
                {formData.alunos.length === 0 ? "Nenhum aluno selecionado" : ""}
              </div>
            </div>
          }
          {/* Seleção de alunos */}
          <div className="form-group">
            <label>Alunos do Projeto</label>
            <div className="checkbox-group">
              {alunos.map((aluno) => (
                <label key={aluno.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.alunos.includes(aluno.id!)}
                    onChange={() => handleAlunoToggle(aluno.id!)}
                  />
                  <span>{aluno.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
