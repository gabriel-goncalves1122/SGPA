import type { Request, Response } from "express";
import * as admin from "firebase-admin";
import type { Entrega } from "../models/Entrega";
import { EntregaValidator } from "../models/Entrega";

const db = admin.firestore();
const entregasCollection = db.collection("entregas");
const tarefasCollection = db.collection("tarefas");
const alunosCollection = db.collection("alunos");

export const getEntregas = async (req: Request, res: Response) => {
  try {
    const { idTarefa, alunoId } = req.query;
    const snapshot = await entregasCollection.get();
    let entregas = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Entrega[];

    if (idTarefa && typeof idTarefa === "string") {
      entregas = entregas.filter((e) => e.idTarefa === idTarefa);
    }
    if (alunoId && typeof alunoId === "string") {
      entregas = entregas.filter((e) => e.alunoId === alunoId);
    }

    res.status(200).json(entregas);
  } catch (error) {
    console.error("Erro ao listar entregas:", error);
    res.status(500).json({ error: "Erro ao listar entregas" });
  }
};

export const getEntregaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await entregasCollection.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Entrega não encontrada" });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Erro ao buscar entrega:", error);
    res.status(500).json({ error: "Erro ao buscar entrega" });
  }
};

// Incluir entrega (RF11)
export const addEntrega = async (req: Request, res: Response) => {
  try {
    const payload = req.body as Partial<Entrega> & { alunoId?: string };

    // converter dataEnvio se enviado
    if (payload.dataEnvio) payload.dataEnvio = new Date(payload.dataEnvio as any) as any;

    const errors = EntregaValidator.validate(payload);
    if (errors.length > 0) return res.status(400).json({ errors });

    // verificar tarefa existe e está 'Em andamento'
    const tarefaDoc = await tarefasCollection.doc(payload.idTarefa as string).get();
    if (!tarefaDoc.exists) return res.status(400).json({ error: "Tarefa não encontrada" });
    const tarefa = tarefaDoc.data();
    if (!tarefa || (tarefa.status || "").toLowerCase() !== "em andamento") {
      return res.status(400).json({ error: "Entrega permitida somente se a tarefa estiver 'Em andamento'" });
    }

    // verificar aluno existe (opcional: o actor é aluno)
    if (payload.alunoId) {
      const alunoDoc = await alunosCollection.doc(payload.alunoId).get();
      if (!alunoDoc.exists) return res.status(400).json({ error: "Aluno não encontrado" });
    }

    const entrega: Partial<Entrega> = {
      idTarefa: payload.idTarefa as string,
      arquivo: payload.arquivo as string,
      dataEnvio: payload.dataEnvio || new Date(),
      alunoId: payload.alunoId || undefined,
      createdAt: new Date(),
    };

    const docRef = await entregasCollection.add(entrega as any);
    res.status(201).json({ id: docRef.id, ...entrega });
  } catch (error) {
    console.error("Erro ao adicionar entrega:", error);
    res.status(500).json({ error: "Erro ao adicionar entrega" });
  }
};

export const deleteEntrega = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const docRef = entregasCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Entrega não encontrada" });
    await docRef.delete();
    res.status(200).json({ message: `Entrega ${id} excluída com sucesso` });
  } catch (error) {
    console.error("Erro ao excluir entrega:", error);
    res.status(500).json({ error: "Erro ao excluir entrega" });
  }
};
