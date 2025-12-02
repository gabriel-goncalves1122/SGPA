import { runLoginTests } from "./tests/login.test.js";
import { runDashboardTests } from "./tests/dashboard.test.js";
import { runPessoasTests } from "./tests/pessoas.test.js";
import { runProjetosTests } from "./tests/projetos.test.js";
import { runTarefasTests } from "./tests/tarefas.test.js";
import { logTest } from "./utils/helpers.js";

async function runAllTests() {
  console.clear();

  logTest("╔════════════════════════════════════════════════════════╗", "info");
  logTest("║                                                        ║", "info");
  logTest("║       🧪 SUITE COMPLETA DE TESTES - SGPA 🧪          ║", "info");
  logTest("║                                                        ║", "info");
  logTest(
    "╚════════════════════════════════════════════════════════╝\n",
    "info"
  );

  const startTime = Date.now();
  let totalPassed = 0;
  let totalFailed = 0;

  // Executar testes de login
  const loginResults = await runLoginTests();
  totalPassed += loginResults.passed;
  totalFailed += loginResults.failed;

  // Aguardar um pouco entre suites
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Executar testes do dashboard
  const dashboardResults = await runDashboardTests();
  totalPassed += dashboardResults.passed;
  totalFailed += dashboardResults.failed;

  // Aguardar um pouco entre suites
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Executar testes de pessoas
  const pessoasResults = await runPessoasTests();
  totalPassed += pessoasResults.passed;
  totalFailed += pessoasResults.failed;

  // Aguardar e executar testes de projetos
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const projetosResults = await runProjetosTests();
  totalPassed += projetosResults.passed;
  totalFailed += projetosResults.failed;

  // Aguardar e executar testes de tarefas
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const tarefasResults = await runTarefasTests();
  totalPassed += tarefasResults.passed;
  totalFailed += tarefasResults.failed;

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  // Relatório final consolidado
  logTest(
    "\n\n╔════════════════════════════════════════════════════════╗",
    "info"
  );
  logTest("║                                                        ║", "info");
  logTest("║           📊 RELATÓRIO FINAL CONSOLIDADO 📊           ║", "info");
  logTest("║                                                        ║", "info");
  logTest(
    "╚════════════════════════════════════════════════════════╝\n",
    "info"
  );

  logTest("┌────────────────────────────────────────────────────────┐", "info");
  logTest("│  SUITE DE TESTES              PASSOU    FALHOU   TOTAL │", "info");
  logTest("├────────────────────────────────────────────────────────┤", "info");
  logTest(
    `│  Login                          ${String(loginResults.passed).padStart(
      2
    )}        ${String(loginResults.failed).padStart(2)}       ${String(
      loginResults.passed + loginResults.failed
    ).padStart(2)}  │`,
    "info"
  );
  logTest(
    `│  Dashboard                      ${String(
      dashboardResults.passed
    ).padStart(2)}        ${String(dashboardResults.failed).padStart(
      2
    )}       ${String(
      dashboardResults.passed + dashboardResults.failed
    ).padStart(2)}  │`,
    "info"
  );
  logTest(
    `│  Pessoas (CRUD)                 ${String(pessoasResults.passed).padStart(
      2
    )}        ${String(pessoasResults.failed).padStart(2)}       ${String(
      pessoasResults.passed + pessoasResults.failed
    ).padStart(2)}  │`,
    "info"
  );
  logTest(
    `│  Projetos                       ${String(
      projetosResults.passed
    ).padStart(2)}        ${String(projetosResults.failed).padStart(
      2
    )}       ${String(projetosResults.passed + projetosResults.failed).padStart(
      2
    )}  │`,
    "info"
  );
  logTest(
    `│  Tarefas                        ${String(tarefasResults.passed).padStart(
      2
    )}        ${String(tarefasResults.failed).padStart(2)}       ${String(
      tarefasResults.passed + tarefasResults.failed
    ).padStart(2)}  │`,
    "info"
  );
  logTest("├────────────────────────────────────────────────────────┤", "info");
  logTest(
    `│  TOTAL                          ${String(totalPassed).padStart(
      2
    )}        ${String(totalFailed).padStart(2)}       ${String(
      totalPassed + totalFailed
    ).padStart(2)}  │`,
    "info"
  );
  logTest(
    "└────────────────────────────────────────────────────────┘\n",
    "info"
  );

  const successRate = (
    (totalPassed / (totalPassed + totalFailed)) *
    100
  ).toFixed(2);
  const statusColor =
    totalFailed === 0 ? "success" : successRate >= 80 ? "warning" : "error";

  logTest(`⏱️  Tempo de Execução: ${duration}s`, "info");
  logTest(`🎯 Taxa de Sucesso: ${successRate}%`, statusColor);

  if (totalFailed === 0) {
    logTest("\n🎉 PARABÉNS! Todos os testes passaram! 🎉\n", "success");
  } else {
    logTest(
      `\n⚠️  ${totalFailed} teste(s) falharam. Verifique os screenshots para detalhes.\n`,
      "warning"
    );
  }

  logTest("📸 Screenshots salvos em: tests/screenshots/", "info");
  logTest("════════════════════════════════════════════════════════\n", "info");

  // Retornar código de saída apropriado
  process.exit(totalFailed > 0 ? 1 : 0);
}

runAllTests().catch((error) => {
  logTest(`\n❌ ERRO FATAL: ${error.message}`, "error");
  console.error(error);
  process.exit(1);
});
