// components/EditarProjetoModal.tsx
import React, { useState, useEffect } from "react";
import ProjetoForm from "./ProjetoForm";
import type { Professor } from "../types/professor";
import type { Projeto } from "../types/projeto";
import type { ProjetoForm as ProjetoFormData } from "../types/ProjetoForm";
import { projetoService } from "../services/projetoService";
import { projetoToForm, formToProjeto } from "../types/ProjetoForm";

interface EditarProjetoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjetoEditado: () => void;
  projeto: Projeto;
  professores: Professor[];
}

export default function EditarProjetoModal({
  isOpen,
  onClose,
  onProjetoEditado,
  projeto,
  professores,
}: EditarProjetoModalProps) {
  const [formData, setFormData] = useState<ProjetoFormData>({
    titulo: "",
    descricao: "",
    orientador: "",
    dataInicio: "",
    dataFim: "",
    status: "Em andamento",
    alunos: [],
  });

  useEffect(() => {
    if (isOpen && projeto) {
      setFormData(projetoToForm(projeto));
    }
  }, [isOpen, projeto]);

  const handleChange = (field: keyof ProjetoFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ Correto: construa um payload limpo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Converte formData → objeto com Date
      const projetoAtualizado = formToProjeto(formData);

      // ✅ Remove campos de sistema (createdAt, updatedAt, id)
      const { createdAt, updatedAt, ...payload } = projetoAtualizado;

      await projetoService.update(projeto.id!, payload);
      alert("✅ Projeto atualizado com sucesso!");
      onProjetoEditado();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar projeto:", error);
      alert("❌ Erro ao atualizar projeto");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Editar Projeto</h2>
        <form onSubmit={handleSubmit}>
          <ProjetoForm
            formData={formData}
            professores={professores}
            onChange={handleChange}
            isEditing={true}
          />
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Atualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
