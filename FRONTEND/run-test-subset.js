import { runProjetosTests } from "./tests/tests/projetos.test.js";
import { runTarefasTests } from "./tests/tests/tarefas.test.js";

async function main() {
  console.log("\n🚀 RODANDO TESTES DE PROJETOS E TAREFAS\n");

  try {
    const projetosResult = await runProjetosTests();
    console.log("\n📊 RESULTADO PROJETOS:", projetosResult);

    const tarefasResult = await runTarefasTests();
    console.log("\n📊 RESULTADO TAREFAS:", tarefasResult);

    const total = {
      passed: projetosResult.passed + tarefasResult.passed,
      failed: projetosResult.failed + tarefasResult.failed,
    };

    console.log("\n╔════════════════════════════════════════════════════════╗");
    console.log("║              RESUMO FINAL                              ║");
    console.log("╠════════════════════════════════════════════════════════╣");
    console.log(
      `║ Projetos:  ${projetosResult.passed}/${
        projetosResult.passed + projetosResult.failed
      } PASSOU                                    ║`
    );
    console.log(
      `║ Tarefas:   ${tarefasResult.passed}/${
        tarefasResult.passed + tarefasResult.failed
      } PASSOU                                    ║`
    );
    console.log(
      `║ TOTAL:     ${total.passed}/${
        total.passed + total.failed
      }                                      ║`
    );
    console.log("╚════════════════════════════════════════════════════════╝\n");
  } catch (e) {
    console.error("❌ Erro:", e);
  }
}

main();
