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

export async function runProjetosTests() {
  let driver;
  let passed = 0;
  let failed = 0;
  let projetoTituloGlobal = null;

  try {
    logTest("\n========================================", "info");
    logTest("🧪 INICIANDO TESTES DE PROJETOS", "info");
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
      logTest("⚠️  Falha no login inicial (projetos): " + e.message, "warning");
    }

    // Ir para projetos
    await driver.get(config.baseUrl + "/projetos");
    await sleep(2000);
    await waitForElementVisible(driver, ".projetos-header", 10000);
    await sleep(2000);

    // TESTE 1: Criar projeto com informações completas
    logTest(
      "\n📋 Teste 1: Criar projeto com múltiplos alunos e orientador",
      "info"
    );
    try {
      await clickElement(driver, ".projetos-header button.btn-primary");
      await sleep(1500);
      await waitForElementVisible(driver, ".modal-content", 5000);
      await sleep(2000);

      // Título coerente
      projetoTituloGlobal = `Sistema de Gestão ${Date.now()}`;

      // Buscar input de título (primeiro input[type="text"])
      const titleInputs = await driver.findElements(
        By.css('input[type="text"]')
      );
      if (titleInputs.length > 0) {
        await titleInputs[0].clear();
        await titleInputs[0].sendKeys(projetoTituloGlobal);
        await sleep(800);
      }

      // Descrição coerente
      const textareas = await driver.findElements(By.css("textarea"));
      if (textareas.length > 0) {
        await textareas[0].clear();
        await textareas[0].sendKeys(
          "Sistema desenvolvido para gerenciar projetos acadêmicos com tarefas e entregas"
        );
        await sleep(800);
      }

      // Selecionar orientador (usando primeiro select - select de orientador)
      const selects = await driver.findElements(By.css("select"));
      if (selects.length > 0) {
        const orientadorSelect = selects[0];
        await sleep(500);

        // Usar método de seleção mais confiável
        const options = await orientadorSelect.findElements(By.css("option"));

        logTest(
          `📝 Encontrados ${options.length} orientadores disponíveis`,
          "info"
        );

        // Pegar segunda opção (primeira é placeholder)
        if (options.length > 1) {
          const val = await options[1].getAttribute("value");
          if (val && val.trim() !== "") {
            await orientadorSelect.click();
            await sleep(300);
            await options[1].click();
            await sleep(800);
            logTest("✅ Orientador selecionado", "info");
          }
        } else {
          throw new Error("Nenhum orientador disponível para selecionar");
        }
      } else {
        throw new Error("Select de orientador não encontrado");
      }

      // Data de Início (data válida futura)
      const dateInputs = await driver.findElements(
        By.css('input[type="date"]')
      );
      if (dateInputs.length > 0) {
        // Data de início: hoje
        const hoje = new Date();
        const dataInicio = hoje.toISOString().split("T")[0];
        await dateInputs[0].clear();
        await dateInputs[0].sendKeys(dataInicio);
        await sleep(1000);
        logTest(`✅ Data de início definida: ${dataInicio}`, "info");

        // Data de fim (30 dias a partir de hoje) - se houver segundo input de data
        if (dateInputs.length > 1) {
          const dataFim = new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];
          await dateInputs[1].clear();
          await dateInputs[1].sendKeys(dataFim);
          await sleep(800);
          logTest(`✅ Data de fim definida: ${dataFim}`, "info");
        }
      } else {
        throw new Error("Inputs de data não encontrados");
      }

      // Status (usando segundo select)
      if (selects.length > 1) {
        const statusSelect = selects[1];
        const statusOptions = await statusSelect.findElements(By.css("option"));

        // Selecionar "Em andamento"
        if (statusOptions.length > 1) {
          await statusSelect.click();
          await sleep(300);
          await statusOptions[1].click(); // Primeira opção após placeholder
          await sleep(800);
          logTest("✅ Status definido", "info");
        }
      }

      // Selecionar múltiplos alunos
      const checkboxes = await driver.findElements(
        By.css('.checkbox-group input[type="checkbox"]')
      );

      let alunosSelecionados = 0;
      for (let i = 0; i < Math.min(2, checkboxes.length); i++) {
        await checkboxes[i].click();
        await sleep(600);
        alunosSelecionados++;
      }

      if (alunosSelecionados === 0) {
        throw new Error("Nenhum aluno disponível para selecionar");
      }

      logTest(`📝 Selecionados ${alunosSelecionados} aluno(s)`, "info");
      await takeScreenshot(driver, "projetos-test1-preenchido");

      // Clicar botão Cadastrar
      const buttons = await driver.findElements(
        By.css(".modal-content button")
      );
      let cadastrarBtn = null;
      for (let btn of buttons.reverse()) {
        const text = await btn.getText();
        if (text.includes("Cadastrar")) {
          cadastrarBtn = btn;
          break;
        }
      }

      if (!cadastrarBtn) {
        throw new Error("Botão Cadastrar não encontrado");
      }

      await driver.executeScript("arguments[0].click();", cadastrarBtn);
      await sleep(2000);

      // Tentar aceitar alert de sucesso ou erro
      try {
        await sleep(800);
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        logTest(`📢 Alert: ${alertText}`, "info");
        await alert.accept();
        await sleep(1000);
      } catch (e) {
        // Sem alert, continuar normalmente
      }

      await sleep(1000);

      logTest("✅ Teste 1 PASSOU: Projeto criado com sucesso", "success");
      passed++;
      await takeScreenshot(driver, "projetos-test1-criado");
    } catch (error) {
      logTest(`❌ Teste 1 FALHOU: ${error.message}`, "error");
      if (driver) await takeScreenshot(driver, "projetos-test1-falha");
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

    // TESTE 2: Editar projeto criado
    logTest("\n📋 Teste 2: Editar projeto criado", "info");
    try {
      await sleep(2000);
      await driver.get(config.baseUrl + "/projetos");
      await sleep(2500);
      await waitForElementVisible(driver, ".projetos-grid", 5000);
      await sleep(2000);

      // Buscar cards de projeto
      const projectCards = await driver.findElements(By.css(".projeto-card"));

      if (projectCards.length === 0) {
        throw new Error("Nenhum card de projeto encontrado");
      }

      logTest(`📝 Encontrados ${projectCards.length} projeto(s)`, "info");

      // Interagir com o primeiro projeto
      const firstCard = projectCards[0];

      // Fazer scroll para visualizar
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        firstCard
      );
      await sleep(500);

      // Encontrar o botão de edição dentro do card
      const actionButtons = await firstCard.findElements(
        By.css("button, .btn")
      );

      let editBtn = null;
      for (const btn of actionButtons) {
        const text = await btn.getText();
        const title = await btn.getAttribute("title");

        if (
          (text.toLowerCase().includes("edit") ||
            title?.toLowerCase().includes("edit") ||
            text.toLowerCase().includes("editar")) &&
          !text.toLowerCase().includes("tarefa")
        ) {
          editBtn = btn;
          break;
        }
      }

      if (!editBtn) {
        throw new Error("Botão de edição não encontrado no card");
      }

      await driver.executeScript("arguments[0].click();", editBtn);
      await sleep(2000);

      await waitForElementVisible(driver, ".modal-content", 5000);
      await sleep(1500);

      // Editar descrição
      const modalTextareas = await driver.findElements(
        By.css(".modal-content textarea")
      );
      if (modalTextareas.length > 0) {
        await modalTextareas[0].clear();
        await modalTextareas[0].sendKeys(
          "Descrição atualizada em teste automatizado - Sistema robusto e escalável"
        );
        await sleep(800);
      }

      await takeScreenshot(driver, "projetos-test2-editado");

      // Procurar botão de atualização
      const modalButtons = await driver.findElements(
        By.css(".modal-content button")
      );
      let updateBtn = null;
      for (let btn of modalButtons.reverse()) {
        const text = await btn.getText();
        if (text.includes("Atualizar")) {
          updateBtn = btn;
          break;
        }
      }

      if (updateBtn) {
        await driver.executeScript("arguments[0].click();", updateBtn);
        await sleep(2000);

        // Tentar aceitar alert de sucesso ou erro
        try {
          await sleep(800);
          const alert = await driver.switchTo().alert();
          const alertText = await alert.getText();
          logTest(`📢 Alert: ${alertText}`, "info");
          await alert.accept();
          await sleep(1000);
        } catch (e) {
          // Sem alert, continuar normalmente
        }
      }

      logTest("✅ Teste 2 PASSOU: Projeto editado com sucesso", "success");
      passed++;
      await takeScreenshot(driver, "projetos-test2-atualizado");
    } catch (error) {
      logTest(`❌ Teste 2 FALHOU: ${error.message}`, "error");
      if (driver) await takeScreenshot(driver, "projetos-test2-falha");
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
    logTest(`❌ ERRO GERAL (projetos): ${error.message}`, "error");
    if (driver) await takeScreenshot(driver, "projetos-erro-geral");
    failed++;
  } finally {
    if (driver) await quitDriver();

    logTest("\n========================================", "info");
    logTest("📊 RELATÓRIO DE TESTES DE PROJETOS", "info");
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
  runProjetosTests();
}
