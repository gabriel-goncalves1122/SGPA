// Projetos.tsx
import { useState, useEffect } from "react";
import { projetoService } from "../services/projetoService";
import { professorService } from "../services/professorService";
import { alunoService } from "../services/alunoService";
import { tarefaService } from "../services/tarefaService";
import type { Projeto } from "../types/projeto";
import type { Professor } from "../types/professor";
import type { Aluno } from "../types/aluno";
import type { Tarefa } from "../types/tarefa";
import TarefasProjetoModal from "../components/TarefasProjetoModal";
import CriarProjetoModal from "../components/CriarProjetoModal";
import EditarProjetoModal from "../components/EditarProjetoModal";

import "./Projetos.css";

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [alunosDoProjeto, setAlunosDoProjeto] = useState<Aluno[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  // Modais
  const [showCriarModal, setShowCriarModal] = useState(false);
  const [projetoParaEditar, setProjetoParaEditar] = useState<Projeto | null>(
    null
  );
  const [showTarefasModal, setShowTarefasModal] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto | null>(
    null
  );
  const [tarefasDoProjeto, setTarefasDoProjeto] = useState<Tarefa[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [projetosData, professoresData, alunosData, tarefasData] =
        await Promise.all([
          projetoService.getAll(),
          professorService.getAll(),
          alunoService.getAll(),
          tarefaService.getAll(),
        ]);
      setProjetos(projetosData);
      setProfessores(professoresData);
      setAlunos(alunosData);
      setTarefas(tarefasData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: any): string => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  const handleVerTarefas = (projeto: Projeto) => {
    const tarefasFiltradas = tarefas.filter((t) => t.idProjeto === projeto.id);
    const alunosDoProjeto = alunos.filter((a) =>
      projeto.alunos?.includes(a.id!)
    );
    setTarefasDoProjeto(tarefasFiltradas);
    setProjetoSelecionado(projeto);
    setAlunosDoProjeto(alunosDoProjeto); // 👈 novo estado
    setShowTarefasModal(true);
  };

  const onTarefaCriada = async () => {
    const todasTarefas = await tarefaService.getAll();
    setTarefas(todasTarefas);
    if (projetoSelecionado) {
      const atualizadas = todasTarefas.filter(
        (t) => t.idProjeto === projetoSelecionado.id
      );
      setTarefasDoProjeto(atualizadas);
    }
  };

  const getProfessorNome = (id: string) => {
    const prof = professores.find((p) => p.id === id);
    return prof ? prof.nome : "Desconhecido";
  };

  const getResumoTarefas = (projetoId: string) => {
    const tarefasProjeto = tarefas.filter((t) => t.idProjeto === projetoId);
    return {
      pendentes: tarefasProjeto.filter((t) => t.status === "Pendente").length,
      emAndamento: tarefasProjeto.filter((t) => t.status === "Em andamento")
        .length,
      concluidas: tarefasProjeto.filter((t) => t.status === "Concluída").length,
    };
  };

  return (
    <div className="projetos-container">
      <div className="projetos-header">
        <h1>Projetos</h1>
        <button className="btn-primary" onClick={() => setShowCriarModal(true)}>
          + Novo Projeto
        </button>
      </div>
      {loading ? (
        <div className="loading">Carregando...</div>
      ) : (
        <div className="projetos-grid">
          {projetos.length === 0 ? (
            <div className="no-data">Nenhum projeto cadastrado</div>
          ) : (
            projetos.map((projeto) => {
              const resumo = getResumoTarefas(projeto.id!);
              return (
                <div key={projeto.id} className="projeto-card">
                  <div className="projeto-header">
                    <h3>{projeto.titulo}</h3>
                    <span
                      className={`status-badge ${projeto.status
                        ?.toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {projeto.status}
                    </span>
                  </div>
                  <p className="projeto-descricao">
                    {projeto.descricao || "Sem descrição"}
                  </p>
                  <div className="projeto-info">
                    <div className="info-item">
                      <strong>Orientador:</strong>{" "}
                      {getProfessorNome(projeto.orientador)}
                    </div>
                    <div className="info-item">
                      <strong>Início:</strong> {formatDate(projeto.dataInicio)}
                    </div>
                    {projeto.dataFim && (
                      <div className="info-item">
                        <strong>Fim:</strong> {formatDate(projeto.dataFim)}
                      </div>
                    )}
                    <div className="info-item">
                      <strong>Alunos:</strong> {projeto.alunos?.length || 0}
                    </div>
                    <div className="info-item tarefas-resumo">
                      <strong>Tarefas:</strong>
                      <span className="tarefa-status pendente">
                        Pend: {resumo.pendentes}
                      </span>
                      <span className="tarefa-status andamento">
                        And: {resumo.emAndamento}
                      </span>
                      <span className="tarefa-status concluida">
                        Conc: {resumo.concluidas}
                      </span>
                    </div>
                  </div>
                  <div className="projeto-actions">
                    <button
                      className="btn-tarefas"
                      onClick={() => handleVerTarefas(projeto)}
                    >
                      📋 Tarefas (
                      {tarefas.filter((t) => t.idProjeto === projeto.id).length}
                      )
                    </button>
                    <button
                      className="btn-edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProjetoParaEditar(projeto);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Deseja realmente excluir este projeto?"
                          )
                        ) {
                          projetoService
                            .delete(projeto.id!)
                            .then(() => {
                              alert("Projeto excluído com sucesso!");
                              loadData();
                            })
                            .catch((err) => {
                              console.error(err);
                              alert("Erro ao excluir projeto");
                            });
                        }
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
      {/* Modais */}
      <CriarProjetoModal
        isOpen={showCriarModal}
        onClose={() => setShowCriarModal(false)}
        onProjetoCriado={loadData}
        professores={professores}
        alunos={alunos} // 👈 passe a lista completa de alunos
      />
      {projetoParaEditar && (
        <EditarProjetoModal
          isOpen={true}
          onClose={() => setProjetoParaEditar(null)}
          onProjetoEditado={loadData}
          projeto={projetoParaEditar}
          professores={professores}
        />
      )}
      {projetoSelecionado && (
        <TarefasProjetoModal
          projeto={projetoSelecionado}
          tarefas={tarefasDoProjeto}
          isVisible={showTarefasModal}
          onClose={() => setShowTarefasModal(false)}
          onTarefaCriada={onTarefaCriada}
          alunosDoProjeto={alunosDoProjeto}
        />
      )}
    </div>
  );
}
