import type { Request, Response } from "express";
import * as admin from "firebase-admin";
import type { Tarefa } from "../models/Tarefa";
import { TarefaValidator } from "../models/Tarefa";

const db = admin.firestore();
const tarefasCollection = db.collection("tarefas");
const alunosCollection = db.collection("alunos");
const vinculosCollection = db.collection("vinculos");
const progressoCollection = db.collection("progresso");

const parseDate = (value: any): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
};

export const getTarefas = async (req: Request, res: Response) => {
  try {
    const { responsaveis, status } = req.query;
    const snapshot = await tarefasCollection.get();

    // Mapeamento seguro com normalização
    const tarefas = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Garante que 'responsaveis' seja sempre um array de strings
      const responsaveisNormalizado = Array.isArray(data.responsaveis)
        ? data.responsaveis.filter((r: any) => typeof r === "string")
        : [];

      return {
        id: doc.id,
        descricao:
          typeof data.descricao === "string" ? data.descricao : undefined,
        responsaveis: responsaveisNormalizado,
        orientador:
          typeof data.orientador === "string" ? data.orientador : undefined,
        idProjeto:
          typeof data.idProjeto === "string" ? data.idProjeto : undefined,
        status: ["Pendente", "Em andamento", "Concluída"].includes(data.status)
          ? (data.status as "Pendente" | "Em andamento" | "Concluída")
          : "Pendente",
        dataInicio: data.dataInicio?.toDate?.() || data.dataInicio || undefined,
        dataFim: data.dataFim?.toDate?.() || data.dataFim || undefined,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || undefined,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || undefined,
      };
    });

    // Aplica filtros
    let resultado = tarefas;

    if (responsaveis && typeof responsaveis === "string") {
      resultado = resultado.filter((t) =>
        t.responsaveis.includes(responsaveis)
      );
    }

    if (status && typeof status === "string") {
      resultado = resultado.filter(
        (t) => t.status?.toLowerCase() === status.toLowerCase()
      );
    }

    res.status(200).json(resultado);
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({ error: "Erro ao listar tarefas" });
  }
};

export const getTarefaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await tarefasCollection.doc(id).get();
    if (!doc.exists)
      return res.status(404).json({ error: "Tarefa não encontrada" });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Erro ao buscar tarefa:", error);
    res.status(500).json({ error: "Erro ao buscar tarefa" });
  }
};

// Incluir tarefa (RF10)
export const addTarefa = async (req: Request, res: Response) => {
  try {
    const payload = req.body as Partial<Tarefa>;

    // converter datas se vierem como string
    if (payload.dataInicio)
      payload.dataInicio = new Date(payload.dataInicio as any) as any;
    if (payload.dataFim)
      payload.dataFim = new Date(payload.dataFim as any) as any;

    const errors = TarefaValidator.validate(payload);
    if (errors.length > 0) return res.status(400).json({ errors });

    const responsaveis = payload.responsaveis as string[];
    if (!Array.isArray(responsaveis) || responsaveis.length === 0) {
      return res
        .status(400)
        .json({ error: "Pelo menos um responsável é necessário" });
    }

    const tarefa: Partial<Tarefa> = {
      descricao: payload.descricao as string,
      responsaveis: payload.responsaveis as string[],
      dataInicio: parseDate(payload.dataInicio),
      dataFim: parseDate(payload.dataFim),
      status: (payload.status as any) || "Pendente",
      createdAt: new Date(),
    };

    const docRef = await tarefasCollection.add(tarefa as any);

    // se já estiver concluída, gerar log de progresso
    if (tarefa.status === "Concluída") {
      await progressoCollection.add({
        tarefaId: docRef.id,
        data: new Date(),
        mensagem: "Tarefa marcada como Concluída",
        responsaveis: tarefa.responsaveis,
      });
    }

    res.status(201).json({ id: docRef.id, ...tarefa });
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    res.status(500).json({ error: "Erro ao adicionar tarefa" });
  }
};

export const updateTarefa = async (req: Request, res: Response) => {
  try {
    const payload = req.body as Partial<Tarefa>;

    const tarefa: Partial<Tarefa> = {
      descricao: payload.descricao as string,
      responsaveis: payload.responsaveis as string[],
      dataInicio: parseDate(payload.dataInicio),
      dataFim: parseDate(payload.dataFim),
      status: (payload.status as any) || "Pendente",
      createdAt: new Date(),
    };
    const { id } = req.params;
    const novosDados = req.body as Partial<Tarefa>;

    const docRef = tarefasCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists)
      return res.status(404).json({ error: "Tarefa não encontrada" });

    const existing = doc.data() as Tarefa;

    // converter datas
    if (novosDados.dataInicio)
      novosDados.dataInicio = new Date(novosDados.dataInicio as any) as any;
    if (novosDados.dataFim)
      novosDados.dataFim = new Date(novosDados.dataFim as any) as any;

    const merged = { ...existing, ...novosDados } as Partial<Tarefa>;
    const errors = TarefaValidator.validate(merged);
    if (errors.length > 0) return res.status(400).json({ errors });

    await docRef.update({ ...novosDados, updatedAt: new Date() } as any);

    // se status foi alterado para Concluída, gerar log
    if (novosDados.status === "Concluída" && existing.status !== "Concluída") {
      await progressoCollection.add({
        tarefaId: id,
        data: new Date(),
        mensagem: "Tarefa marcada como Concluída",
        responsaveis: merged.responsaveis,
      });
    }

    res.status(200).json({ id, ...existing, ...novosDados });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
    res.status(500).json({ error: "Erro ao atualizar tarefa" });
  }
};

export const deleteTarefa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const docRef = tarefasCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists)
      return res.status(404).json({ error: "Tarefa não encontrada" });

    await docRef.delete();
    res.status(200).json({ message: `Tarefa ${id} excluída com sucesso` });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ error: "Erro ao excluir tarefa" });
  }
};
