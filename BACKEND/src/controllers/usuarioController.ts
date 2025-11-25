import type { Request, Response } from "express";
import admin from "../config/firebase";
import { UsuarioValidator } from "../models/Usuario";

const db = admin.firestore();
const usuariosCollection = db.collection("usuarios");

export const addUsuario = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, tipo } = req.body as { nome: string; email: string; senha: string; tipo: string };

    const errors = UsuarioValidator.validate({ nome, email, tipo, senha });
    if (errors.length > 0) return res.status(400).json({ errors });

    // verificar email único (Firebase garante, mas podemos checar previamente)
    try {
      const existing = await admin.auth().getUserByEmail(email);
      if (existing) return res.status(409).json({ error: "E-mail já cadastrado" });
    } catch (e: any) {
      // getUserByEmail lança se não encontrado — ignorar
    }

    // criar usuário no Firebase Auth
    const userRecord = await admin.auth().createUser({ email, password: senha, displayName: nome });

    // armazenar metadados em Firestore
    const usuarioDoc = { uid: userRecord.uid, nome, email, tipo, createdAt: new Date() };
    await usuariosCollection.doc(userRecord.uid).set(usuarioDoc as any);

    res.status(201).json({ uid: userRecord.uid, nome, email, tipo });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: error.message || "Erro ao criar usuário" });
  }
};

// listar usuários (opcional)
export const getUsuarios = async (_req: Request, res: Response) => {
  try {
    const snapshot = await usuariosCollection.get();
    const users = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: "Erro ao listar usuários" });
  }
};

export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await usuariosCollection.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
};

export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // apagar do Firebase Auth
    try {
      await admin.auth().deleteUser(id);
    } catch (e) {
      // ignore if not present
    }
    await usuariosCollection.doc(id).delete();
    res.status(200).json({ message: `Usuário ${id} excluído` });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
};
