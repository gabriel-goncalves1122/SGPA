import "dotenv/config";
import * as admin from "firebase-admin";
import serviceAccount from "../config/firebase";

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

async function testRF13() {
  try {
    console.log("\n🧪 Testando RF13 - Relatório de Andamento de Projetos\n");

    // Obter todos os projetos
    const projetosSnap = await db.collection("projetos").get();
    console.log(`✅ Total de projetos encontrados: ${projetosSnap.size}`);

    const tarefasSnap = await db.collection("tarefas").get();
    console.log(`✅ Total de tarefas encontradas: ${tarefasSnap.size}`);

    // Simular o relatório
    const projetos = projetosSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any));
    const results: any[] = [];

    for (const projeto of projetos) {
      const alunosIds: string[] = Array.isArray(projeto.alunos) ? projeto.alunos : [];
      const numeroAlunos = alunosIds.length;

      // Contar tarefas
      const projetoTarefas = await db
        .collection("tarefas")
        .where("idProjeto", "==", projeto.id)
        .get();

      const totalTarefas = projetoTarefas.size;
      let concluidas = 0;
      projetoTarefas.docs.forEach((d) => {
        const data = d.data();
        if (data.status === "Concluída") concluidas += 1;
      });

      const percentConcluidas =
        totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;

      // Obter nome do orientador
      let orientadorNome = projeto.orientador || "Desconhecido";
      try {
        const profDoc = await db.collection("professores").doc(projeto.orientador).get();
        if (profDoc.exists) {
          const pd = profDoc.data();
          orientadorNome = pd?.nome || projeto.orientador;
        }
      } catch (e) {
        // ignore
      }

      results.push({
        projeto: projeto.titulo,
        orientador: orientadorNome,
        "% tarefas concluídas": percentConcluidas,
        "número de alunos": numeroAlunos,
      });
    }

    // Ordenar por título do projeto
    results.sort((a, b) => a.projeto.localeCompare(b.projeto));

    console.log("\n📊 Resultados do Relatório (RF13):\n");
    console.table(results);

    console.log("\n✅ RF13 testado com sucesso!\n");
  } catch (error) {
    console.error("❌ Erro ao testar RF13:", error);
  } finally {
    process.exit(0);
  }
}

testRF13();
