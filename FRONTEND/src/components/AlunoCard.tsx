import type { Aluno } from "../types/aluno";
import "./AlunoCard.css";

interface AlunoCardProps {
  aluno: Aluno;
  onEdit: (aluno: Aluno) => void;
  onDelete: (id: string) => void;
}

const AlunoCard = ({ aluno, onEdit, onDelete }: AlunoCardProps) => {
  return (
    <div className="aluno-card">
      <div className="aluno-card-header">
        <div className="aluno-avatar">
          {aluno.nome.charAt(0).toUpperCase()}
        </div>
        <div className="aluno-info">
          <h3>{aluno.nome}</h3>
          <p className="matricula">{aluno.matricula}</p>
        </div>
      </div>

      <div className="aluno-card-body">
        <div className="info-row">
          <span className="info-label">📧 Email:</span>
          <span className="info-value">{aluno.email}</span>
        </div>
        <div className="info-row">
          <span className="info-label">📚 Curso:</span>
          <span className="info-value">{aluno.curso}</span>
        </div>
        <div className="info-row">
          <span className="info-label">📱 Telefone:</span>
          <span className="info-value">{aluno.telefone}</span>
        </div>
      </div>

      <div className="aluno-card-actions">
        <button className="btn-card-edit" onClick={() => onEdit(aluno)}>
          Editar
        </button>
        <button
          className="btn-card-delete"
          onClick={() => onDelete(aluno.id!)}
        >
          Excluir
        </button>
      </div>
    </div>
  );
};

export default AlunoCard;
