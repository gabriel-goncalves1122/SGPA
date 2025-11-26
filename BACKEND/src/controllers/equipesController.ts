import type { Request, Response } from "express";
import * as admin from "firebase-admin";
import type { Vinculo } from "../models/Vinculo";
import { VinculoValidator } from "../models/Vinculo";

const db = admin.firestore();
const vinculosCollection = db.collection("vinculos");
const projetosCollection = db.collection("projetos");
const alunosCollection = db.collection("alunos");

// Incluir aluno em projeto (RF09)
export const addVinculo = async (req: Request, res: Response) => {
  try {
    const payload = req.body as Partial<Vinculo>;
    const errors = VinculoValidator.validate(payload);
    if (errors.length > 0) return res.status(400).json({ errors });

    const { idAluno, idProjeto, papel } = payload as Vinculo;

    // verificar existencia de aluno e projeto
    const alunoDoc = await alunosCollection.doc(idAluno).get();
    if (!alunoDoc.exists) return res.status(400).json({ error: "Aluno não encontrado" });

    const projetoDoc = await projetosCollection.doc(idProjeto).get();
    if (!projetoDoc.exists) return res.status(400).json({ error: "Projeto não encontrado" });

    // regra: aluno pode ser líder em apenas um projeto
    if (papel === "Líder") {
      const leaderQuery = await vinculosCollection.where("idAluno", "==", idAluno).where("papel", "==", "Líder").get();
      if (!leaderQuery.empty) {
        return res.status(409).json({ error: "Aluno já é líder em outro projeto" });
      }
    }

    // evitar duplicata (mesmo aluno no mesmo projeto)
    const existQuery = await vinculosCollection.where("idAluno", "==", idAluno).where("idProjeto", "==", idProjeto).get();
    if (!existQuery.empty) return res.status(409).json({ error: "Vínculo já existe" });

    // criar vinculo
    const docRef = await vinculosCollection.add({ idAluno, idProjeto, papel, createdAt: new Date() });

    // adicionar aluno ao array de alunos do projeto (arrayUnion)
    await projetosCollection.doc(idProjeto).update({ alunos: admin.firestore.FieldValue.arrayUnion(idAluno) } as any);

    res.status(201).json({ id: docRef.id, idAluno, idProjeto, papel });
  } catch (error) {
    console.error("Erro ao adicionar vínculo:", error);
    res.status(500).json({ error: "Erro ao adicionar vínculo" });
  }
};

// Listar vínculos
export const getVinculos = async (_req: Request, res: Response) => {
  try {
    const snapshot = await vinculosCollection.get();
    const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    res.status(200).json(items);
  } catch (error) {
    console.error("Erro ao listar vínculos:", error);
    res.status(500).json({ error: "Erro ao listar vínculos" });
  }
};

// Remover vínculo
export const deleteVinculo = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const docRef = vinculosCollection.doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: "Vínculo não encontrado" });

    const data = doc.data() as Vinculo;

    // remover aluno da lista do projeto
    await projetosCollection.doc(data.idProjeto).update({ alunos: admin.firestore.FieldValue.arrayRemove(data.idAluno) } as any);

    await docRef.delete();
    res.status(200).json({ message: `Vínculo ${id} removido` });
  } catch (error) {
    console.error("Erro ao remover vínculo:", error);
    res.status(500).json({ error: "Erro ao remover vínculo" });
  }
};
