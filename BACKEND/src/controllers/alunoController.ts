// src/controllers/alunoController.ts
// src/controllers/alunoController.ts
import type { Request, Response } from "express";
import admin from "../config/firebase";
import { type Aluno, AlunoValidator } from "../models/Aluno";

const db = admin.firestore();
const alunosRef = db.collection("alunos");

export const incluirAluno = async (req: Request, res: Response) => {
  try {
    const aluno = req.body as Aluno;

    // validação
    const errors = AlunoValidator.validate(aluno);
    if (errors.length > 0) return res.status(400).json({ errors });

    // preparar documento (usar Timestamp do Firestore)
    const novoAluno = {
      nome: aluno.nome,
      matricula: aluno.matricula,
      email: aluno.email,
      curso: aluno.curso,
      telefone: aluno.telefone,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    const docRef = await alunosRef.add(novoAluno);
    const docSnapshot = await docRef.get();

    return res.status(201).json({ id: docRef.id, ...(docSnapshot.data() as object) });
  } catch (error) {
    console.error("Erro incluirAluno:", error);
    return res.status(500).json({ error: "Erro ao incluir aluno" });
  }
};

export const alterarAluno = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const dados = req.body as Partial<Aluno>;

    const docRef = alunosRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Aluno não encontrado" });

    // opcional: validar campos que vieram (se quiser validar tudo, chame AlunoValidator com união)
    if (dados.email || dados.nome || dados.matricula || dados.curso || dados.telefone) {
      // se quiser validar obrigatoriedade, monte um objeto de validação parcial ou apenas permita atualização parcial
      // aqui assumimos validação simples: se vierem campos, ok. Se precisar, aplicar regras mais rígidas.
    }

    const atualizado = {
      ...dados,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    await docRef.update(atualizado);
    const updatedSnapshot = await docRef.get();
    return res.json({ id: docRef.id, ...(updatedSnapshot.data() as object) });
  } catch (error) {
    console.error("Erro alterarAluno:", error);
    return res.status(500).json({ error: "Erro ao alterar aluno" });
  }
};

export const consultarAlunos = async (_req: Request, res: Response) => {
  try {
    const snapshot = await alunosRef.get();
    const alunos = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as object) }));
    return res.json(alunos);
  } catch (error) {
    console.error("Erro consultarAlunos:", error);
    return res.status(500).json({ error: "Erro ao consultar alunos" });
  }
};

export const consultarAlunoPorId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const doc = await alunosRef.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Aluno não encontrado" });
    return res.json({ id: doc.id, ...(doc.data() as object) });
  } catch (error) {
    console.error("Erro consultarAlunoPorId:", error);
    return res.status(500).json({ error: "Erro ao consultar aluno" });
  }
};

export const excluirAluno = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const docRef = alunosRef.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Aluno não encontrado" });

    await docRef.delete();
    return res.json({ message: "Aluno excluído com sucesso" });
  } catch (error) {
    console.error("Erro excluirAluno:", error);
    return res.status(500).json({ error: "Erro ao excluir aluno" });
  }
};
