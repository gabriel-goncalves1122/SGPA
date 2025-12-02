// controllers/projetoController.ts
import type { Request, Response } from "express";
import * as admin from "firebase-admin";
import type { Projeto } from "../models/Projeto";
import { ProjetoValidator } from "../models/Projeto";

const db = admin.firestore();
const projetosCollection = db.collection("projetos");
const professoresCollection = db.collection("professores");
const vinculosCollection = db.collection("vinculos");

// Função segura para datas
const parseDate = (value: any): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date && !isNaN(value.getTime())) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const d = new Date(value);
    return isNaN(d.getTime()) ? undefined : d;
  }
  return undefined;
};

// Listar projetos
export const getProjetos = async (req: Request, res: Response) => {
  try {
    const { titulo, orientador, status } = req.query;
    const snapshot = await projetosCollection.get();

    const projetos = snapshot.docs.map((doc) => {
      const data = doc.data();

      // Normalização segura
      const entrega = data.entrega
        ? {
            id: data.entrega.id || "",
            dataEntrega:
              data.entrega.dataEntrega?.toDate?.() ||
              data.entrega.dataEntrega ||
              undefined,
            arquivoUrl:
              typeof data.entrega.arquivoUrl === "string"
                ? data.entrega.arquivoUrl
                : "",
            observacoes:
              typeof data.entrega.observacoes === "string"
                ? data.entrega.observacoes
                : undefined,
            avaliacao:
              typeof data.entrega.avaliacao === "number"
                ? data.entrega.avaliacao
                : undefined,
          }
        : undefined;

      return {
        id: doc.id,
        titulo: data.titulo || "",
        descricao:
          typeof data.descricao === "string" ? data.descricao : undefined,
        orientador: data.orientador || "", // será validado como obrigatório no create/update
        dataInicio: data.dataInicio?.toDate?.() || data.dataInicio || undefined,
        dataFim: data.dataFim?.toDate?.() || data.dataFim || undefined,
        status: typeof data.status === "string" ? data.status : "Em andamento",
        alunos: Array.isArray(data.alunos) ? data.alunos : [],
        entrega,
        createdAt: data.createdAt?.toDate?.() || data.createdAt || undefined,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || undefined,
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

    // Ordenar por dataInicio desc
    resultado.sort((a, b) => {
      const da = a.dataInicio ? a.dataInicio.getTime() : 0;
      const dbt = b.dataInicio ? b.dataInicio.getTime() : 0;
      return dbt - da;
    });

    res.status(200).json(resultado);
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

    const data = doc.data()!;
    const entrega = data.entrega
      ? {
          id: data.entrega.id || "",
          dataEntrega:
            data.entrega.dataEntrega?.toDate?.() ||
            data.entrega.dataEntrega ||
            undefined,
          arquivoUrl:
            typeof data.entrega.arquivoUrl === "string"
              ? data.entrega.arquivoUrl
              : "",
          observacoes:
            typeof data.entrega.observacoes === "string"
              ? data.entrega.observacoes
              : undefined,
          avaliacao:
            typeof data.entrega.avaliacao === "number"
              ? data.entrega.avaliacao
              : undefined,
        }
      : undefined;

    const projeto = {
      id: doc.id,
      titulo: data.titulo || "",
      descricao:
        typeof data.descricao === "string" ? data.descricao : undefined,
      orientador: data.orientador || "",
      dataInicio: data.dataInicio?.toDate?.() || data.dataInicio || undefined,
      dataFim: data.dataFim?.toDate?.() || data.dataFim || undefined,
      status: typeof data.status === "string" ? data.status : "Em andamento",
      alunos: Array.isArray(data.alunos) ? data.alunos : [],
      entrega,
      createdAt: data.createdAt?.toDate?.() || data.createdAt || undefined,
      updatedAt: data.updatedAt?.toDate?.() || data.updatedAt || undefined,
    };

    res.status(200).json(projeto);
  } catch (error) {
    console.error("Erro ao buscar projeto:", error);
    res.status(500).json({ error: "Erro ao buscar projeto" });
  }
};

// Incluir projeto
export const addProjeto = async (req: Request, res: Response) => {
  try {
    const payload = req.body as Partial<Projeto>;

    // Validar datas
    const dataInicio = parseDate(payload.dataInicio);
    const dataFim = parseDate(payload.dataFim);

    // Forçar uso das datas convertidas na validação
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
      orientador: payload.orientador as string, // obrigatório
      dataInicio: dataInicio!,
      dataFim: dataFim,
      status: payload.status || "Em andamento",
      alunos: payload.alunos || [],
      createdAt: new Date(),
      // entrega não é definida na criação
    };

    const docRef = await projetosCollection.add(projeto);
    res.status(201).json({ id: docRef.id, ...projeto });
  } catch (error) {
    console.error("Erro ao adicionar projeto:", error);
    res.status(500).json({ error: "Erro ao adicionar projeto" });
  }
};

// Atualizar projeto
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

    // Campos imutáveis
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

    // Validar datas
    const dataInicio = parseDate(novosDados.dataInicio);
    const dataFim = parseDate(novosDados.dataFim);

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

    // Remover vínculos
    const vinculosSnapshot = await vinculosCollection
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
