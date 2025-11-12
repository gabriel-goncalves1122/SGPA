import type { Request, Response } from "express";
import * as admin from "firebase-admin";

const db = admin.firestore();
const alunosCollection = db.collection("alunos");

// 🔹 Listar todos os alunos
export const getAlunos = async (req: Request, res: Response) => {
  try {
    const snapshot = await alunosCollection.get();
    const alunos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(alunos);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar alunos" });
  }
};

// 🔹 Adicionar aluno
export const addAluno = async (req: Request, res: Response) => {
  try {
    const novoAluno = req.body;
    const docRef = await alunosCollection.add({
      ...novoAluno,
      createdAt: new Date(),
    });
    res.status(201).json({ id: docRef.id, ...novoAluno });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar aluno" });
  }
};

// 🔹 Atualizar aluno
export const updateAluno = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const novosDados = req.body;

    await alunosCollection.doc(id).update(novosDados);
    res.status(200).json({ id, ...novosDados });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar aluno" });
  }
};

// 🔹 Excluir aluno
export const deleteAluno = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await alunosCollection.doc(id).delete();
    res.status(200).json({ message: `Aluno ${id} excluído com sucesso` });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir aluno" });
  }
};
