// components/ProjetoForm.tsx
import type { ProjetoForm } from "../types/ProjetoForm";
import type { Professor } from "../types/professor";

interface ProjetoFormProps {
  formData: ProjetoForm;
  professores: Professor[];
  onChange: (field: keyof ProjetoForm, value: any) => void;
  isEditing: boolean; // 👈 indica se é edição
}

export default function ProjetoForm({
  formData,
  professores,
  onChange,
  isEditing,
}: ProjetoFormProps) {
  return (
    <>
      {/* Título — bloqueado em edição */}
      <div className="form-group">
        <label>Título *</label>
        <input
          type="text"
          value={formData.titulo}
          onChange={(e) => onChange("titulo", e.target.value)}
          required
          maxLength={80}
          disabled={isEditing} // 👈 bloqueia se for edição
          style={
            isEditing
              ? { backgroundColor: "#f1f1f1", cursor: "not-allowed" }
              : {}
          }
        />
        {isEditing && (
          <small className="form-hint">
            O título não pode ser alterado após a criação.
          </small>
        )}
      </div>

      <div className="form-group">
        <label>Descrição</label>
        <textarea
          value={formData.descricao || ""}
          onChange={(e) => onChange("descricao", e.target.value)}
          maxLength={500}
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Orientador *</label>
        <select
          value={formData.orientador}
          onChange={(e) => onChange("orientador", e.target.value)}
          required
          disabled={isEditing} // 👈 também bloqueia orientador (se for regra)
          style={
            isEditing
              ? { backgroundColor: "#f1f1f1", cursor: "not-allowed" }
              : {}
          }
        >
          <option value="">Selecione um professor</option>
          {professores.map((prof) => (
            <option key={prof.id} value={prof.id}>
              {prof.nome}
            </option>
          ))}
        </select>
        {isEditing && (
          <small className="form-hint">
            O orientador não pode ser alterado após a criação.
          </small>
        )}
      </div>

      <div className="form-group">
        <label>Data de Início *</label>
        <input
          type="date"
          value={formData.dataInicio}
          onChange={(e) => onChange("dataInicio", e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Data de Fim</label>
        <input
          type="date"
          value={formData.dataFim}
          onChange={(e) => onChange("dataFim", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Status *</label>
        <select
          value={formData.status}
          onChange={(e) => onChange("status", e.target.value)}
          required
        >
          <option value="Em andamento">Em andamento</option>
          <option value="Concluído">Concluído</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
    </>
  );
}
