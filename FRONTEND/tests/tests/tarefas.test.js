import { createDriver, quitDriver } from "../utils/driver.js";
import {
  waitForElement,
  waitForElementVisible,
  fillInput,
  clickElement,
  waitForUrl,
  logTest,
  takeScreenshot,
  sleep,
} from "../utils/helpers.js";
import { config } from "../config.js";
import { By } from "selenium-webdriver";

export async function runTarefasTests() {
  let driver;
  let passed = 0;
  let failed = 0;

  try {
    logTest("\n========================================", "info");
    logTest("🧪 INICIANDO TESTES DE TAREFAS", "info");
    logTest("========================================\n", "info");

    driver = await createDriver();
    await driver.get(config.baseUrl);

    // Login
    try {
      await fillInput(driver, 'input[type="email"]', config.testUser.email);
      await fillInput(
        driver,
        'input[type="password"]',
        config.testUser.password
      );
      await clickElement(driver, 'button[type="submit"]');
      await waitForUrl(driver, "/dashboard", 15000);
      await sleep(1000);
    } catch (e) {
      logTest("⚠️  Falha no login inicial (tarefas): " + e.message, "warning");
    }

    // Ir para projetos
    await driver.get(config.baseUrl + "/projetos");
    await waitForElementVisible(driver, ".projetos-grid", 10000);

    // Selecionar primeiro projeto disponível
    try {
      const btns = await driver.findElements(
        By.css(".projeto-actions .btn-tarefas")
      );
      if (btns.length === 0) {
        throw new Error("Nenhum projeto encontrado para abrir tarefas");
      }

      await btns[0].click();
      // Aguardar modal de tarefas
      await waitForElementVisible(driver, ".modal-content", 5000);

      // Abrir formulário de nova tarefa
      await clickElement(driver, ".btn-add-tarefa");
      await waitForElementVisible(driver, ".tarefa-form", 3000);

      // Preencher descrição
      const descricao = `Tarefa E2E ${Date.now()}`;
      await fillInput(driver, "textarea", descricao);

      // selecionar primeiro responsável se existir
      try {
        const check = await driver.findElement(
          By.css('.checkbox-group input[type="checkbox"]')
        );
        await check.click();
      } catch (e) {
        logTest("⚠️  Nenhum responsável disponível (tarefas)", "warning");
      }

      // Clicar em criar
      const criarBtn = await driver.findElement(
        By.xpath(
          '//button[contains(., "Criar Tarefa") or contains(., "Criar")]'
        )
      );
      await criarBtn.click();

      // Esperar atualização
      await sleep(1200);

      logTest("✅ Teste: criar tarefa executado", "success");
      passed++;
    } catch (error) {
      logTest(`❌ Falha ao criar tarefa: ${error.message}`, "error");
      if (driver) await takeScreenshot(driver, "tarefas-criar-falha");
      failed++;
    }
  } catch (error) {
    logTest(`❌ ERRO GERAL (tarefas): ${error.message}`, "error");
    if (driver) await takeScreenshot(driver, "tarefas-erro-geral");
    failed++;
  } finally {
    if (driver) await quitDriver();

    logTest("\n========================================", "info");
    logTest("📊 RELATÓRIO DE TESTES DE TAREFAS", "info");
    logTest("========================================", "info");
    logTest(`✅ Passaram: ${passed}`, "success");
    logTest(`❌ Falharam: ${failed}`, failed > 0 ? "error" : "success");
    logTest("========================================\n", "info");

    return { passed, failed };
  }
}

// Executar diretamente (debug)
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  runTarefasTests();
}
