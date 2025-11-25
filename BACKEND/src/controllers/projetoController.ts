import type { Request, Response } from "express";
import * as admin from "firebase-admin";
import type { Projeto } from "../models/Projeto";
import { ProjetoValidator } from "../models/Projeto";

const db = admin.firestore();
const projetosCollection = db.collection("projetos");
const professoresCollection = db.collection("professores");

// Listar projetos com filtros (titulo, orientador, status) ordenado por dataInicio desc
export const getProjetos = async (req: Request, res: Response) => {
  try {
    const { titulo, orientador, status } = req.query;

    const snapshot = await projetosCollection.get();
    let projetos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Projeto[];

    // filtros simples (titulo parcial, orientador exact, status exact)
    if (titulo && typeof titulo === "string") {
      const t = titulo.toLowerCase();
      projetos = projetos.filter((p) => (p.titulo || "").toLowerCase().includes(t));
    }
    if (orientador && typeof orientador === "string") {
      projetos = projetos.filter((p) => p.orientador === orientador);
    }
    if (status && typeof status === "string") {
      projetos = projetos.filter((p) => (p.status || "").toLowerCase() === status.toLowerCase());
    }

    // ordenar por dataInicio desc
    projetos.sort((a, b) => {
      const da = a.dataInicio ? new Date(a.dataInicio as any).getTime() : 0;
      const dbt = b.dataInicio ? new Date(b.dataInicio as any).getTime() : 0;
      return dbt - da;
    });

    // montar retorno com campos solicitados: titulo, orientador, numero de alunos, status, prazo (dataFim)
    const result = projetos.map((p) => ({
      id: p.id,
      titulo: p.titulo,
      orientador: p.orientador,
      numeroAlunos: Array.isArray(p.alunos) ? p.alunos.length : 0,
      status: p.status || null,
      dataInicio: p.dataInicio || null,
      dataFim: p.dataFim || null,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("Erro ao listar projetos:", error);
    res.status(500).json({ error: "Erro ao listar projetos" });
  }
};

// Obter projeto por id
export const getProjetoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await projetosCollection.doc(id).get();
    if (!doc.exists) return res.status(404).json({ error: "Projeto não encontrado" });
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);
    res.status(500).json({ error: "Erro ao buscar projeto" });
  }
};

// Incluir projeto (RF06)
export const addProjeto = async (req: Request, res: Response) => {
  try {
    const payload = req.body as Partial<Projeto>;

    // converter datas se vierem como string
    if (payload.dataInicio) payload.dataInicio = new Date(payload.dataInicio as any) as any;
    if (payload.dataFim) payload.dataFim = new Date(payload.dataFim as any) as any;

    const errors = ProjetoValidator.validate(payload);
    if (errors.length > 0) return res.status(400).json({ errors });

    // verificar orientador existe
    const orientadorDoc = await professoresCollection.doc(payload.orientador as string).get();
    if (!orientadorDoc.exists) return res.status(400).json({ error: "Orientador (professor) não encontrado" });

    const projeto: Partial<Projeto> = {
      titulo: payload.titulo as string,
      descricao: payload.descricao || undefined,
      orientador: payload.orientador as string,
      dataInicio: payload.dataInicio as any,
      dataFim: payload.dataFim as any || undefined,
      status: payload.status || "planejado",
      alunos: payload.alunos || [],
      createdAt: new Date(),
    };

    const docRef = await projetosCollection.add(projeto as any);
    res.status(201).json({ id: docRef.id, ...projeto });
  } catch (error) {
    console.error("Erro ao adicionar projeto:", error);
    res.status(500).json({ error: "Erro ao adicionar projeto" });
  }
};

// Alterar projeto (RF08) - título e orientador NÃO alteráveis
export const updateProjeto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const novosDados = req.body as Partial<Projeto>;

    const docRef = projetosCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Projeto não encontrado" });

    const existing = doc.data() as Projeto;

    // proteger campos não alteráveis
    if (novosDados.titulo && novosDados.titulo !== existing.titulo) {
      return res.status(400).json({ error: "Título não pode ser alterado" });
    }
    if (novosDados.orientador && novosDados.orientador !== existing.orientador) {
      return res.status(400).json({ error: "Orientador não pode ser alterado" });
    }

    // converter datas
    if (novosDados.dataInicio) novosDados.dataInicio = new Date(novosDados.dataInicio as any) as any;
    if (novosDados.dataFim) novosDados.dataFim = new Date(novosDados.dataFim as any) as any;

    // validar (mesmas regras de RF06)
    const merged = { ...existing, ...novosDados } as Partial<Projeto>;
    const errors = ProjetoValidator.validate(merged);
    if (errors.length > 0) return res.status(400).json({ errors });

    await docRef.update({ ...novosDados, updatedAt: new Date() } as any);
    res.status(200).json({ id, ...existing, ...novosDados });
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error);
    res.status(500).json({ error: "Erro ao atualizar projeto" });
  }
};

// Excluir projeto (opcional)
export const deleteProjeto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const docRef = projetosCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Projeto não encontrado" });

    // remover vínculos relacionados ao projeto
    const vinculosSnapshot = await db.collection("vinculos").where("idProjeto", "==", id).get();
    const batch = db.batch();
    vinculosSnapshot.docs.forEach((d) => {
      // remover aluno do array do projeto (defensivo)
      // também registramos exclusão do vinculo
      batch.delete(d.ref);
    });

    // aplicar batch de remoção de vínculos
    if (vinculosSnapshot.size > 0) await batch.commit();

    // finalmente, excluir o projeto
    await docRef.delete();
    res.status(200).json({ message: `Projeto ${id} excluído com sucesso` });
  } catch (error) {
    console.error("Erro ao excluir projeto:", error);
    res.status(500).json({ error: "Erro ao excluir projeto" });
  }
};
