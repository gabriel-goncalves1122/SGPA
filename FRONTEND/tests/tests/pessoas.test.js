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

export async function runPessoasTests() {
  let driver;
  let passed = 0;
  let failed = 0;

  try {
    logTest("\n========================================", "info");
    logTest("🧪 INICIANDO TESTES DE PESSOAS (ALUNOS E PROFESSORES)", "info");
    logTest("========================================\n", "info");

    driver = await createDriver();
    await driver.get(config.baseUrl);

    // Login
    await fillInput(driver, 'input[type="email"]', config.testUser.email);
    await fillInput(driver, 'input[type="password"]', config.testUser.password);
    await clickElement(driver, 'button[type="submit"]');
    await waitForUrl(driver, "/dashboard", 15000);
    await sleep(2000);

    // Navegar para Pessoas
    await driver.get(config.baseUrl + "/pessoas");
    await sleep(3000);

    // Teste 1: Verificar página de pessoas carregou (abas Alunos/Professores)
    logTest("📋 Teste 1: Verificar página de pessoas com abas", "info");
    try {
      await waitForElementVisible(driver, ".pessoas-container", 10000);
      // Verificar se existem as abas
      const alunosBtn = await waitForElement(
        driver,
        ".tipo-toggle button",
        5000
      );
      await takeScreenshot(driver, "pessoas-test1-loaded");
      logTest(
        "✅ Teste 1 PASSOU: Página de pessoas com abas carregada",
        "success"
      );
      passed++;
    } catch (error) {
      logTest(`❌ Teste 1 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "pessoas-test1-falha");
      failed++;
    }

    // Teste 2: Alternar para aba Professores
    logTest("\n📋 Teste 2: Alternar para aba de Professores", "info");
    try {
      await sleep(1500);
      // Buscar botões de toggle
      const buttons = await driver.findElements(By.css(".tipo-toggle button"));
      if (buttons.length < 2) {
        throw new Error("Botões de alternância não encontrados");
      }
      // Segundo botão é Professores
      await buttons[1].click();
      await sleep(2500);
      await takeScreenshot(driver, "pessoas-test2-professores");
      logTest(
        "✅ Teste 2 PASSOU: Alternação para Professores funciona",
        "success"
      );
      passed++;
    } catch (error) {
      logTest(`❌ Teste 2 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "pessoas-test2-falha");
      failed++;
    }

    // Teste 3: Voltar para aba Alunos
    logTest("\n📋 Teste 3: Voltar para aba de Alunos", "info");
    try {
      await sleep(1500);
      // Buscar botões de toggle
      const buttons = await driver.findElements(By.css(".tipo-toggle button"));
      if (buttons.length < 2) {
        throw new Error("Botões de alternância não encontrados");
      }
      // Primeiro botão é Alunos
      await buttons[0].click();
      await sleep(2500);
      await takeScreenshot(driver, "pessoas-test3-alunos");
      logTest("✅ Teste 3 PASSOU: Volta para aba Alunos funciona", "success");
      passed++;
    } catch (error) {
      logTest(`❌ Teste 3 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "pessoas-test3-falha");
      failed++;
    }

    // Teste 4: Abrir modal de criar aluno
    logTest("\n📋 Teste 4: Abrir modal de criar aluno", "info");
    try {
      await sleep(1500);
      const btnPrimary = await waitForElement(driver, ".btn-primary");
      await driver.executeScript("arguments[0].click();", btnPrimary);
      await sleep(2000);

      await waitForElementVisible(driver, ".modal-overlay", 5000);
      await waitForElement(driver, '.modal-form input[type="text"]', 5000);

      await takeScreenshot(driver, "pessoas-test4-modal");
      logTest("✅ Teste 4 PASSOU: Modal de criar aluno aberto", "success");
      passed++;
    } catch (error) {
      logTest(`❌ Teste 4 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "pessoas-test4-falha");
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

    // Teste 5: Preencher e criar aluno
    logTest("\n📋 Teste 5: Preencher e criar aluno", "info");
    try {
      // Verificar se modal está aberto
      let modal = await driver.findElements(By.css(".modal-overlay"));
      if (modal.length === 0) {
        const btnPrimary = await waitForElement(driver, ".btn-primary");
        await driver.executeScript("arguments[0].click();", btnPrimary);
        await sleep(2000);
        await waitForElementVisible(driver, ".modal-overlay", 5000);
      }

      logTest("📝 Preenchendo formulário...", "info");

      let inputs = await driver.findElements(
        By.css('.modal-form input[type="text"]')
      );
      if (inputs.length > 0) {
        await inputs[0].clear();
        await inputs[0].sendKeys(config.testAluno.nome);
        await sleep(400);
      }

      if (inputs.length > 1) {
        await inputs[1].clear();
        await inputs[1].sendKeys(config.testAluno.matricula);
        await sleep(400);
      }

      const emailInputs = await driver.findElements(
        By.css('.modal-form input[type="email"]')
      );
      if (emailInputs.length > 0) {
        await emailInputs[0].clear();
        await emailInputs[0].sendKeys(config.testAluno.email);
        await sleep(400);
      }

      inputs = await driver.findElements(
        By.css('.modal-form input[type="text"]')
      );
      if (inputs.length > 2) {
        await inputs[2].clear();
        await inputs[2].sendKeys(config.testAluno.curso);
        await sleep(400);
      }

      const telInputs = await driver.findElements(
        By.css('.modal-form input[type="tel"]')
      );
      if (telInputs.length > 0) {
        await telInputs[0].clear();
        await telInputs[0].sendKeys(config.testAluno.telefone);
        await sleep(600);
      }

      await takeScreenshot(driver, "pessoas-test5-preenchido");

      const buttons = await driver.findElements(
        By.css(".modal-content button")
      );
      let submitBtn = null;
      for (let btn of buttons.reverse()) {
        const text = await btn.getText();
        if (text.includes("Cadastrar")) {
          submitBtn = btn;
          break;
        }
      }

      if (!submitBtn) {
        throw new Error("Botão de cadastro não encontrado");
      }

      await driver.executeScript("arguments[0].click();", submitBtn);
      await sleep(3000);

      const modalsApos = await driver.findElements(By.css(".modal-overlay"));
      if (modalsApos.length === 0) {
        logTest("✅ Teste 5 PASSOU: Aluno criado com sucesso", "success");
        passed++;
        await takeScreenshot(driver, "pessoas-test5-criado");
      } else {
        throw new Error("Modal não fechou após criar aluno");
      }
    } catch (error) {
      logTest(`❌ Teste 5 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "pessoas-test5-falha");
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

    // Teste 6: Buscar aluno criado
    logTest("\n📋 Teste 6: Buscar aluno criado", "info");
    try {
      await sleep(2000);

      const searchInput = await waitForElement(driver, ".search-input", 5000);
      await searchInput.clear();
      await searchInput.sendKeys(config.testAluno.nome);
      await sleep(2500);

      const rows = await driver.findElements(By.css(".pessoas-table tbody tr"));
      let alunoEncontrado = false;

      for (let row of rows) {
        const text = await row.getText();
        if (
          text.includes(config.testAluno.nome) ||
          text.includes(config.testAluno.matricula)
        ) {
          alunoEncontrado = true;
          break;
        }
      }

      if (alunoEncontrado) {
        logTest("✅ Teste 6 PASSOU: Aluno encontrado na busca", "success");
        passed++;
      } else {
        throw new Error("Aluno não encontrado na busca");
      }

      await takeScreenshot(driver, "pessoas-test6-encontrado");
      await searchInput.clear();
      await sleep(1500);
    } catch (error) {
      logTest(`❌ Teste 6 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "pessoas-test6-falha");
      failed++;
    }

    // Teste 7: Editar aluno
    logTest("\n📋 Teste 7: Editar aluno", "info");
    try {
      await sleep(1500);

      const searchInput = await waitForElement(driver, ".search-input", 5000);
      await searchInput.clear();
      await searchInput.sendKeys(config.testAluno.matricula);
      await sleep(2500);

      const rows = await driver.findElements(By.css(".pessoas-table tbody tr"));
      if (rows.length === 0) {
        throw new Error("Aluno não encontrado para editar");
      }

      const editBtns = await driver.findElements(By.css(".action-btn.edit"));
      if (editBtns.length === 0) {
        throw new Error("Botão de edição não encontrado");
      }

      await driver.executeScript("arguments[0].click();", editBtns[0]);
      await sleep(2000);

      await waitForElementVisible(driver, ".modal-overlay", 5000);
      await sleep(1000);

      const inputs = await driver.findElements(
        By.css('.modal-form input[type="text"]')
      );
      if (inputs.length > 0) {
        await inputs[0].clear();
        await inputs[0].sendKeys(config.testAlunoEdit.nome);
        await sleep(400);
      }

      const emailInputs = await driver.findElements(
        By.css('.modal-form input[type="email"]')
      );
      if (emailInputs.length > 0) {
        await emailInputs[0].clear();
        await emailInputs[0].sendKeys(config.testAlunoEdit.email);
        await sleep(400);
      }

      await takeScreenshot(driver, "pessoas-test7-editado");

      const buttons = await driver.findElements(
        By.css(".modal-content button")
      );
      let updateBtn = null;
      for (let btn of buttons.reverse()) {
        const text = await btn.getText();
        if (text.includes("Atualizar")) {
          updateBtn = btn;
          break;
        }
      }

      if (updateBtn) {
        await driver.executeScript("arguments[0].click();", updateBtn);
        await sleep(3000);
      }

      logTest("✅ Teste 7 PASSOU: Aluno editado com sucesso", "success");
      passed++;

      const search = await driver.findElements(By.css(".search-input"));
      if (search.length > 0) {
        await search[0].clear();
        await sleep(1500);
      }
    } catch (error) {
      logTest(`❌ Teste 7 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "pessoas-test7-falha");
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

    // Teste 8: Visualizar tabela de pessoas
    logTest("\n📋 Teste 8: Visualizar tabela de pessoas", "info");
    try {
      await waitForElementVisible(driver, ".pessoas-table", 5000);
      await takeScreenshot(driver, "pessoas-test8-tabela");
      logTest("✅ Teste 8 PASSOU: Tabela de pessoas visível", "success");
      passed++;
    } catch (error) {
      logTest(`❌ Teste 8 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "pessoas-test8-falha");
      failed++;
    }
  } catch (error) {
    logTest(`❌ ERRO GERAL: ${error.message}`, "error");
    if (driver) {
      await takeScreenshot(driver, "pessoas-erro-geral");
    }
  } finally {
    if (driver) {
      await quitDriver();
    }

    logTest("\n========================================", "info");
    logTest("📊 RELATÓRIO DE TESTES DE PESSOAS", "info");
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

// Executar diretamente
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  runPessoasTests();
}
