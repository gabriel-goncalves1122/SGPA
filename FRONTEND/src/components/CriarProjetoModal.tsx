// components/CriarProjetoModal.tsx
import React, { useState } from "react";
import ProjetoForm from "./ProjetoForm";
import type { Professor } from "../types/professor";
import { projetoService } from "../services/projetoService";
import { formToProjeto } from "../types/ProjetoForm";
import type { ProjetoForm as ProjetoFormType } from "../types/ProjetoForm";

interface CriarProjetoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjetoCriado: () => void;
  professores: Professor[];
}

export default function CriarProjetoModal({
  isOpen,
  onClose,
  onProjetoCriado,
  professores,
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
            isEditing={false}
          />
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
