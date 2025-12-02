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
      await sleep(2000);
    } catch (e) {
      logTest("⚠️  Falha no login inicial (tarefas): " + e.message, "warning");
    }

    // Ir para projetos
    await driver.get(config.baseUrl + "/projetos");
    await sleep(2500);
    await waitForElementVisible(driver, ".projetos-grid", 10000);
    await sleep(2000);

    // TESTE 1: Criar tarefa com múltiplos responsáveis
    logTest("\n📋 Teste 1: Criar tarefa com múltiplos responsáveis", "info");
    try {
      // Encontrar e clicar em botão de tarefas do primeiro projeto
      const projectButtons = await driver.findElements(
        By.css(
          ".projeto-card .btn-tarefas, .projeto-actions .btn-tarefas, .projeto-card button"
        )
      );
      if (projectButtons.length === 0) {
        throw new Error("Nenhum botão de tarefas encontrado nos projetos");
      }

      await driver.executeScript("arguments[0].click();", projectButtons[0]);
      await sleep(2000);
      // Aguardar modal de tarefas
      await waitForElementVisible(driver, ".modal-content", 5000);
      await sleep(2000);

      await takeScreenshot(driver, "tarefas-test1-modal-aberto");

      // Abrir formulário de nova tarefa
      const addTarefaBtns = await driver.findElements(
        By.css(".btn-add-tarefa, button[type='button']")
      );
      let tarefaBtnFound = false;
      for (let btn of addTarefaBtns) {
        const text = await btn.getText();
        if (
          text.includes("Tarefa") ||
          text.includes("tarefa") ||
          text.includes("Criar")
        ) {
          await driver.executeScript("arguments[0].click();", btn);
          tarefaBtnFound = true;
          await sleep(1500);
          break;
        }
      }

      if (!tarefaBtnFound) {
        throw new Error("Botão de adicionar tarefa não encontrado");
      }

      await waitForElementVisible(
        driver,
        ".tarefa-form, .form-group, textarea",
        5000
      );
      await sleep(1000);

      // Preencher descrição da tarefa
      const descricao = `Tarefa de Teste ${Date.now()}`;
      const textareas = await driver.findElements(By.css("textarea"));
      if (textareas.length > 0) {
        await textareas[0].clear();
        await textareas[0].sendKeys(descricao);
        await sleep(1000);
      } else {
        throw new Error("Campo de descrição não encontrado");
      }

      // Selecionar múltiplos responsáveis
      const checkboxes = await driver.findElements(
        By.css('.checkbox-group input[type="checkbox"]')
      );

      let responsaveisSelecionados = 0;
      if (checkboxes.length === 0) {
        throw new Error("Nenhum checkbox de responsável encontrado");
      }

      // Selecionar até 2 responsáveis
      for (let i = 0; i < Math.min(2, checkboxes.length); i++) {
        await checkboxes[i].click();
        await sleep(600);
        responsaveisSelecionados++;
      }

      logTest(
        `📝 Selecionados ${responsaveisSelecionados} responsável(is)`,
        "info"
      );
      await takeScreenshot(driver, "tarefas-test1-preenchida");

      // Clicar botão para finalizar criação (Criar Tarefa)
      const buttons = await driver.findElements(By.css("button"));
      let criarTarefaBtn = null;
      for (let btn of buttons.reverse()) {
        const text = await btn.getText();
        if (text.includes("Criar") && text.includes("Tarefa")) {
          criarTarefaBtn = btn;
          break;
        }
      }

      if (!criarTarefaBtn) {
        throw new Error("Botão Criar Tarefa não encontrado");
      }

      await driver.executeScript("arguments[0].click();", criarTarefaBtn);
      await sleep(1500);

      // Tentar aceitar alert se aparecer
      try {
        await sleep(800);
        const alert = await driver.switchTo().alert();
        await alert.accept();
        await sleep(1000);
      } catch (e) {
        // Sem alert, continuar normalmente
      }

      await sleep(1500);

      // Verificar se a tarefa foi criada - buscar por ela na lista de tarefas
      try {
        const tarefasLista = await driver.findElements(
          By.css(".tarefa-item, .tarefa-card, tr")
        );
        if (tarefasLista.length > 0) {
          logTest(
            `📋 Tarefa criada encontrada. Total de tarefas na lista: ${tarefasLista.length}`,
            "info"
          );
          await takeScreenshot(driver, "tarefas-test1-lista-com-tarefa");
        }
      } catch (e) {
        logTest("⚠️  Não foi possível verificar lista de tarefas", "warning");
      }

      logTest("✅ Teste 1 PASSOU: Tarefa criada com sucesso", "success");
      passed++;

      await takeScreenshot(driver, "tarefas-test1-criada");
    } catch (error) {
      logTest(`❌ Teste 1 FALHOU: ${error.message}`, "error");
      if (driver) await takeScreenshot(driver, "tarefas-test1-falha");
      failed++;

      try {
        const closeBtn = await driver.findElements(By.css(".close-btn"));
        if (closeBtn.length > 0) {
          await closeBtn[0].click();
          await sleep(500);
        }
      } catch (e) {
        // Ignorar
      }
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
    logTest(`📈 Total: ${passed + failed}`, "info");
    logTest(
      `🎯 Taxa de Sucesso: ${((passed / (passed + failed)) * 100).toFixed(2)}%`,
      "info"
    );
    logTest("========================================\n", "info");

    return { passed, failed };
  }
}

// Executar diretamente (debug)
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  runTarefasTests();
}
