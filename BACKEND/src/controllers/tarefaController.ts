import type { Request, Response } from "express";
import * as admin from "firebase-admin";
import type { Tarefa } from "../models/Tarefa";
import { TarefaValidator } from "../models/Tarefa";

const db = admin.firestore();
const tarefasCollection = db.collection("tarefas");
const alunosCollection = db.collection("alunos");
const vinculosCollection = db.collection("vinculos");
const progressoCollection = db.collection("progresso");

export const getTarefas = async (req: Request, res: Response) => {
  try {
    const { responsavel, status } = req.query;
    const snapshot = await tarefasCollection.get();
    let tarefas = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Tarefa[];

    if (responsavel && typeof responsavel === "string") {
      tarefas = tarefas.filter((t) => t.responsavel === responsavel);
    }
    if (status && typeof status === "string") {
      tarefas = tarefas.filter((t) => (t.status || "").toLowerCase() === status.toLowerCase());
    }

    res.status(200).json(tarefas);
  } catch (error) {
    console.error("Erro ao listar tarefas:", error);
    res.status(500).json({ error: "Erro ao listar tarefas" });
  }
};

export const getTarefaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await tarefasCollection.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Tarefa não encontrada" });
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
    if (payload.dataInicio) payload.dataInicio = new Date(payload.dataInicio as any) as any;
    if (payload.dataFim) payload.dataFim = new Date(payload.dataFim as any) as any;

    const errors = TarefaValidator.validate(payload);
    if (errors.length > 0) return res.status(400).json({ errors });

    // verificar aluno existe
    const alunoDoc = await alunosCollection.doc(payload.responsavel as string).get();
    if (!alunoDoc.exists) return res.status(400).json({ error: "Responsável (aluno) não encontrado" });

    // verificar que aluno é participante (possui vínculo)
    const vinculosSnap = await vinculosCollection.where("idAluno", "==", payload.responsavel as string).get();
    if (vinculosSnap.empty) return res.status(400).json({ error: "Responsável deve ser aluno participante" });

    const tarefa: Partial<Tarefa> = {
      descricao: payload.descricao as string,
      responsavel: payload.responsavel as string,
      dataInicio: payload.dataInicio as any || undefined,
      dataFim: payload.dataFim as any || undefined,
      status: (payload.status as any) || "Pendente",
      createdAt: new Date(),
    };

    const docRef = await tarefasCollection.add(tarefa as any);

    // se já estiver concluída, gerar log de progresso
    if (tarefa.status === "Concluída") {
      await progressoCollection.add({ tarefaId: docRef.id, data: new Date(), mensagem: "Tarefa marcada como Concluída", responsavel: tarefa.responsavel });
    }

    res.status(201).json({ id: docRef.id, ...tarefa });
  } catch (error) {
    console.error("Erro ao adicionar tarefa:", error);
    res.status(500).json({ error: "Erro ao adicionar tarefa" });
  }
};

export const updateTarefa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const novosDados = req.body as Partial<Tarefa>;

    const docRef = tarefasCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Tarefa não encontrada" });

    const existing = doc.data() as Tarefa;

    // converter datas
    if (novosDados.dataInicio) novosDados.dataInicio = new Date(novosDados.dataInicio as any) as any;
    if (novosDados.dataFim) novosDados.dataFim = new Date(novosDados.dataFim as any) as any;

    const merged = { ...existing, ...novosDados } as Partial<Tarefa>;
    const errors = TarefaValidator.validate(merged);
    if (errors.length > 0) return res.status(400).json({ errors });

    await docRef.update({ ...novosDados, updatedAt: new Date() } as any);

    // se status foi alterado para Concluída, gerar log
    if (novosDados.status === "Concluída" && existing.status !== "Concluída") {
      await progressoCollection.add({ tarefaId: id, data: new Date(), mensagem: "Tarefa marcada como Concluída", responsavel: merged.responsavel });
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
    if (!doc.exists) return res.status(404).json({ error: "Tarefa não encontrada" });

    await docRef.delete();
    res.status(200).json({ message: `Tarefa ${id} excluída com sucesso` });
  } catch (error) {
    console.error("Erro ao excluir tarefa:", error);
    res.status(500).json({ error: "Erro ao excluir tarefa" });
  }
};
