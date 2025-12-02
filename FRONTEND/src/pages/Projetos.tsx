// Projetos.tsx (com tarefas agregadas)
import { useState, useEffect } from "react";
import { projetoService } from "../services/projetoService";
import { professorService } from "../services/professorService";
import { alunoService } from "../services/alunoService";
import { tarefaService } from "../services/tarefaService"; // ⬅️ nova importação
import type { Projeto } from "../types/projeto";
import type { Professor } from "../types/professor";
import type { Aluno } from "../types/aluno";
import type { Tarefa } from "../types/tarefa"; // ⬅️ nova importação
import Layout from "../components/Layout";
import "./Projetos.css";
import TarefasProjetoModal from "../components/TarefasProjetoModal";

export default function Projetos() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [showTarefasModal, setShowTarefasModal] = useState(false);
  const [projetoSelecionado, setProjetoSelecionado] = useState<Projeto | null>(
    null
  );
  const [tarefasDoProjeto, setTarefasDoProjeto] = useState<Tarefa[]>([]);
  const [professores, setProfessores] = useState<Professor[]>([]);
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]); // ⬅️ estado para tarefas
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Projeto, "id">>({
    titulo: "",
    descricao: "",
    orientador: "",
    dataInicio: new Date(),
    dataFim: undefined,
    status: "Em andamento",
    alunos: [],
  });

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
          tarefaService.getAll(), // ⬅️ carrega tarefas
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

  // Função para obter tarefas de um projeto
  const getTarefasDoProjeto = (projetoId: string) => {
    return tarefas.filter((t) => t.idProjeto === projetoId);
  };

  // Contagem de tarefas por status
  const getResumoTarefas = (projetoId: string) => {
    const tarefasProjeto = getTarefasDoProjeto(projetoId);
    const total = tarefasProjeto.length;
    const pendentes = tarefasProjeto.filter(
      (t) => t.status === "Pendente"
    ).length;
    const emAndamento = tarefasProjeto.filter(
      (t) => t.status === "Em andamento"
    ).length;
    const concluidas = tarefasProjeto.filter(
      (t) => t.status === "Concluída"
    ).length;
    return { total, pendentes, emAndamento, concluidas };
  };

  // Restante do código permanece igual até o JSX...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await projetoService.update(editingId, formData);
        alert("Projeto atualizado com sucesso!");
      } else {
        await projetoService.create(formData);
        alert("Projeto cadastrado com sucesso!");
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error("Erro ao salvar projeto:", error);
      alert("Erro ao salvar projeto");
    }
  };

  const handleVerTarefas = (projeto: Projeto) => {
    const tarefasFiltradas = tarefas.filter((t) => t.idProjeto === projeto.id);
    setTarefasDoProjeto(tarefasFiltradas);
    setProjetoSelecionado(projeto);
    setShowTarefasModal(true);
  };

  const handleEdit = (projeto: Projeto) => {
    setEditingId(projeto.id || null);
    setFormData({
      titulo: projeto.titulo,
      descricao: projeto.descricao,
      orientador: projeto.orientador,
      dataInicio: projeto.dataInicio,
      dataFim: projeto.dataFim,
      status: projeto.status,
      alunos: projeto.alunos || [],
    });
    setShowModal(true);
  };
  const handleCriarTarefa = async () => {
    if (!projetoSelecionado) return;

    const novaTarefa: Omit<Tarefa, "id"> = {
      descricao: `Nova tarefa - ${projetoSelecionado.titulo}`,
      responsaveis: [], // será preenchido no modal de criação (opcional, ou deixe vazio)
      orientador: projetoSelecionado.orientador,
      idProjeto: projetoSelecionado.id,
      dataInicio: new Date(),
      status: "Pendente",
    };

    try {
      await tarefaService.create(novaTarefa);
      alert("Tarefa criada com sucesso!");
      // Recarrega as tarefas
      const todasTarefas = await tarefaService.getAll();
      setTarefas(todasTarefas);
      const atualizadas = todasTarefas.filter(
        (t) => t.idProjeto === projetoSelecionado.id
      );
      setTarefasDoProjeto(atualizadas);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Erro ao criar tarefa");
    }
  };
  const handleDelete = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este projeto?")) return;
    try {
      await projetoService.delete(id);
      alert("Projeto excluído com sucesso!");
      loadData();
    } catch (error) {
      console.error("Erro ao excluir projeto:", error);
      alert("Erro ao excluir projeto");
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descricao: "",
      orientador: "",
      dataInicio: new Date(),
      dataFim: undefined,
      status: "Em andamento",
      alunos: [],
    });
    setEditingId(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const getProfessorNome = (id: string) => {
    const prof = professores.find((p) => p.id === id);
    return prof ? prof.nome : "Desconhecido";
  };

  const getAlunoNome = (id: string) => {
    const aluno = alunos.find((a) => a.id === id);
    return aluno ? aluno.nome : "Desconhecido";
  };

  const formatDate = (date: any): string => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
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
  return (
    <Layout>
      <div className="projetos-container">
        <div className="projetos-header">
          <h1>Projetos</h1>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
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
                        <strong>Início:</strong>{" "}
                        {formatDate(projeto.dataInicio)}
                      </div>
                      {projeto.dataFim && (
                        <div className="info-item">
                          <strong>Fim:</strong> {formatDate(projeto.dataFim)}
                        </div>
                      )}
                      <div className="info-item">
                        <strong>Alunos:</strong> {projeto.alunos?.length || 0}
                      </div>

                      {/* ✅ NOVO: Resumo de tarefas */}
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
                        {
                          tarefas.filter((t) => t.idProjeto === projeto.id)
                            .length
                        }
                        )
                      </button>
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(projeto)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(projeto.id!)}
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

        {/* Modal de criação/edição de projeto (mantido igual) */}
        {/* Modal de Tarefas do Projeto */}
        {projetoSelecionado && (
          <TarefasProjetoModal
            projeto={projetoSelecionado}
            tarefas={tarefasDoProjeto}
            isVisible={showTarefasModal}
            onClose={() => setShowTarefasModal(false)}
            onTarefaCriada={onTarefaCriada}
          />
        )}
      </div>
    </Layout>
  );
}
