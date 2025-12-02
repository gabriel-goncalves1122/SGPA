import type { Request, Response } from "express";
import * as admin from "firebase-admin";
import type { Projeto } from "../models/Projeto";
import { ProjetoValidator } from "../models/Projeto";

const db = admin.firestore();
const projetosCollection = db.collection("projetos");
const professoresCollection = db.collection("professores");

const safeToDate = (val: any): Date | undefined => {
  if (!val) return undefined;
  if (val.toDate && typeof val.toDate === "function") {
    return val.toDate(); // Firestore Timestamp
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? undefined : d;
};

// Listar projetos com filtros (titulo, orientador, status) ordenado por dataInicio desc
export const getProjetos = async (req: Request, res: Response) => {
  try {
    const { titulo, orientador, status } = req.query;

    const snapshot = await projetosCollection.get();
    const projetos = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        titulo: data.titulo || "",
        descricao: data.descricao || undefined,
        orientador: data.orientador || "",
        dataInicio: safeToDate(data.dataInicio),
        dataFim: safeToDate(data.dataFim),
        status: (data.status as string) || "planejado",
        alunos: Array.isArray(data.alunos) ? data.alunos : [],
      };
    });

    // Filtros
    let resultado = projetos;

    if (titulo && typeof titulo === "string") {
      const t = titulo.toLowerCase();
      resultado = resultado.filter((p) => p.titulo.toLowerCase().includes(t));
    }
    if (orientador && typeof orientador === "string") {
      resultado = resultado.filter((p) => p.orientador === orientador);
    }
    if (status && typeof status === "string") {
      resultado = resultado.filter(
        (p) => p.status?.toLowerCase() === status.toLowerCase()
      );
    }

    // Ordenar por dataInicio (desc)
    resultado.sort((a, b) => {
      const da = a.dataInicio ? a.dataInicio.getTime() : 0;
      const dbt = b.dataInicio ? b.dataInicio.getTime() : 0;
      return dbt - da;
    });

    // Retorno final
    const result = resultado.map((p) => ({
      id: p.id,
      titulo: p.titulo,
      orientador: p.orientador,
      numeroAlunos: p.alunos.length,
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

// Obter projeto por ID
export const getProjetoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doc = await projetosCollection.doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    const data = doc.data()!; // ✅ Agora seguro

    const projeto: Projeto = {
      id: doc.id,
      titulo: data.titulo || "",
      descricao: data.descricao || undefined,
      orientador: data.orientador || "",
      dataInicio: safeToDate(data.dataInicio)!,
      dataFim: safeToDate(data.dataFim),
      status: (data.status as string) || "planejado",
      alunos: Array.isArray(data.alunos) ? data.alunos : [],
      createdAt: safeToDate(data.createdAt),
      updatedAt: safeToDate(data.updatedAt),
    };

    res.status(200).json(projeto);
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);
    res.status(500).json({ error: "Erro ao buscar projeto" });
  }
};

// Incluir projeto (RF06)
export const addProjeto = async (req: Request, res: Response) => {
  try {
    const payload = req.body as Partial<Projeto>;

    // ✅ Converter datas com segurança
    const dataInicio = safeToDate(payload.dataInicio);
    const dataFim = safeToDate(payload.dataFim);

    // Forçar uso das datas convertidas no objeto validado
    const payloadValidacao = {
      ...payload,
      dataInicio,
      dataFim,
    };

    const errors = ProjetoValidator.validate(payloadValidacao);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Verificar orientador
    const orientadorDoc = await professoresCollection
      .doc(payload.orientador as string)
      .get();
    if (!orientadorDoc.exists) {
      return res
        .status(400)
        .json({ error: "Orientador (professor) não encontrado" });
    }

    const projeto: Partial<Projeto> = {
      titulo: payload.titulo as string,
      descricao: payload.descricao,
      orientador: payload.orientador as string,
      dataInicio: dataInicio!, // já validado como não nulo
      dataFim: dataFim,
      status: payload.status || "planejado",
      alunos: payload.alunos || [],
      createdAt: new Date(),
    };

    const docRef = await projetosCollection.add(projeto);
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
    if (!doc.exists) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    const existing = doc.data() as Projeto;

    // Proteger campos imutáveis
    if (novosDados.titulo && novosDados.titulo !== existing.titulo) {
      return res.status(400).json({ error: "Título não pode ser alterado" });
    }
    if (
      novosDados.orientador &&
      novosDados.orientador !== existing.orientador
    ) {
      return res
        .status(400)
        .json({ error: "Orientador não pode ser alterado" });
    }

    // ✅ Converter datas com segurança
    const dataInicio = safeToDate(novosDados.dataInicio);
    const dataFim = safeToDate(novosDados.dataFim);

    const merged = {
      ...existing,
      ...novosDados,
      dataInicio,
      dataFim,
    };

    const errors = ProjetoValidator.validate(merged);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    await docRef.update({
      ...novosDados,
      dataInicio,
      dataFim,
      updatedAt: new Date(),
    });

    res.status(200).json({ id, ...merged });
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error);
    res.status(500).json({ error: "Erro ao atualizar projeto" });
  }
};

// Excluir projeto
export const deleteProjeto = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const docRef = projetosCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "Projeto não encontrado" });
    }

    // Remover vínculos associados
    const vinculosSnapshot = await db
      .collection("vinculos")
      .where("idProjeto", "==", id)
      .get();
    const batch = db.batch();
    vinculosSnapshot.docs.forEach((d) => batch.delete(d.ref));
    if (!vinculosSnapshot.empty) await batch.commit();

    await docRef.delete();
    res.status(200).json({ message: `Projeto ${id} excluído com sucesso` });
  } catch (error) {
    console.error("Erro ao excluir projeto:", error);
    res.status(500).json({ error: "Erro ao excluir projeto" });
  }
};
