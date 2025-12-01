import type { Request, Response } from "express";
import * as admin from "firebase-admin";

const db = admin.firestore();
const projetosCollection = db.collection("projetos");
const tarefasCollection = db.collection("tarefas");
const alunosCollection = db.collection("alunos");
const professoresCollection = db.collection("professores");

// RF13: GET /relatorios/projetos?orientador=ID&status=...&curso=...
// Atores: Administrador, Professor
// Filtros: orientador, status, curso
// Campos retornados: projeto, orientador, % tarefas concluídas, número de alunos
// Ordenação: título do projeto
export const relatorioAndamentoProjetos = async (req: Request, res: Response) => {
  try {
    const { orientador, status, curso } = req.query;

    const snapshot = await projetosCollection.get();
    let projetos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as any));

    // Aplicar filtros
    if (orientador && typeof orientador === "string") {
      projetos = projetos.filter((p) => p.orientador === orientador);
    }
    if (status && typeof status === "string") {
      projetos = projetos.filter((p) => ((p.status || "") as string).toLowerCase() === status.toLowerCase());
    }

    const results = [] as any[];

    for (const p of projetos) {
      const alunosIds: string[] = Array.isArray(p.alunos) ? p.alunos : [];
      let numeroAlunos = alunosIds.length;

      // Filtro por curso: verifica se algum aluno do projeto é do curso especificado
      if (curso && typeof curso === "string") {
        if (alunosIds.length === 0) continue;
        const alunoDocs = await Promise.all(alunosIds.map((id) => alunosCollection.doc(id).get()));
        const alunosData = alunoDocs.map((d) => (d.exists ? d.data() : null));
        const hasCurso = alunosData.some((a) => a && a.curso && String(a.curso).toLowerCase() === (curso as string).toLowerCase());
        if (!hasCurso) continue;
        numeroAlunos = alunosData.filter((a) => a).length;
      }

      // Calcular percentual de tarefas concluídas
      const tarefasSnap = await tarefasCollection.where("idProjeto", "==", p.id).get();
      const totalTarefas = tarefasSnap.size;
      let concluidas = 0;
      tarefasSnap.docs.forEach((d) => {
        const data = d.data();
        if (data.status === "Concluída") concluidas += 1;
      });
      const percentConcluidas = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;

      // Obter nome do orientador
      let orientadorNome = p.orientador || null;
      try {
        const profDoc = await professoresCollection.doc(p.orientador).get();
        if (profDoc.exists) {
          const pd = profDoc.data();
          orientadorNome = pd?.nome || p.orientador;
        }
      } catch (e) {
        // ignore
      }

      results.push({
        id: p.id,
        projeto: p.titulo,
        orientador: orientadorNome,
        "% tarefas concluídas": percentConcluidas,
        "número de alunos": numeroAlunos,
      });
    }

    // Ordenar por título do projeto
    results.sort((a, b) => (a.projeto || "").localeCompare(b.projeto || ""));

    res.status(200).json(results);
  } catch (error) {
    console.error("❌ Erro ao gerar relatório:", error);
    res.status(500).json({ error: "Erro ao gerar relatório" });
  }
};
