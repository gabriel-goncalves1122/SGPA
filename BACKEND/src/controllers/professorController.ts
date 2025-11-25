import type { Request, Response } from "express";
import * as admin from "firebase-admin";
import type { Professor } from "../models/Professor";
import { ProfessorValidator } from "../models/Professor";

const db = admin.firestore();
const professoresCollection = db.collection("professores");

// Listar todos os professores
export const getProfessores = async (_req: Request, res: Response) => {
  try {
    const snapshot = await professoresCollection.get();
    const professores = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(professores);
  } catch (error) {
    console.error("Erro ao buscar professores:", error);
    res.status(500).json({ error: "Erro ao buscar professores" });
  }
};

// Obter professor por id
export const getProfessorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await professoresCollection.doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Erro ao buscar professor:", error);
    res.status(500).json({ error: "Erro ao buscar professor" });
  }
};

// Adicionar professor (verifica siape único)
export const addProfessor = async (req: Request, res: Response) => {
  try {
    const novoProfessor: Professor = req.body;

    // Validação de dados
    const errors = ProfessorValidator.validate(novoProfessor);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Verificar siape único
    const siapeQuery = await professoresCollection.where("siape", "==", novoProfessor.siape).get();
    if (!siapeQuery.empty) {
      return res.status(409).json({ error: "SIAPE já cadastrado" });
    }

    const docRef = await professoresCollection.add({
      ...novoProfessor,
      createdAt: new Date(),
    });

    res.status(201).json({ id: docRef.id, ...novoProfessor });
  } catch (error) {
    console.error("Erro ao adicionar professor:", error);
    res.status(500).json({ error: "Erro ao adicionar professor" });
  }
};

// Atualizar professor (verifica siape único quando alterado)
export const updateProfessor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const novosDados: Partial<Professor> = req.body;

    const docRef = professoresCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    const existing = doc.data() as Professor;

    // Se siape for alterado, checar unicidade
    if (novosDados.siape && novosDados.siape !== existing.siape) {
      const siapeQuery = await professoresCollection.where("siape", "==", novosDados.siape).get();
      // se encontrou algum e não é o próprio documento
      if (!siapeQuery.empty) {
        const conflict = siapeQuery.docs.some((d) => d.id !== id);
        if (conflict) {
          return res.status(409).json({ error: "SIAPE já cadastrado por outro professor" });
        }
      }
    }

    await docRef.update({
      ...novosDados,
      updatedAt: new Date(),
    });

    res.status(200).json({ id, ...existing, ...novosDados });
  } catch (error) {
    console.error("Erro ao atualizar professor:", error);
    res.status(500).json({ error: "Erro ao atualizar professor" });
  }
};

// Excluir professor
export const deleteProfessor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const docRef = professoresCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Professor não encontrado" });
    }

    await docRef.delete();
    res.status(200).json({ message: `Professor ${id} excluído com sucesso` });
  } catch (error) {
    console.error("Erro ao excluir professor:", error);
    res.status(500).json({ error: "Erro ao excluir professor" });
  }
};
