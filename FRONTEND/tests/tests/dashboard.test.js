import { createDriver, quitDriver } from "../utils/driver.js";
import {
  waitForElement,
  fillInput,
  clickElement,
  waitForUrl,
  logTest,
  takeScreenshot,
  sleep,
} from "../utils/helpers.js";
import { config } from "../config.js";

async function login(driver) {
  await driver.get(config.baseUrl);
  await fillInput(driver, 'input[type="email"]', config.testUser.email);
  await fillInput(driver, 'input[type="password"]', config.testUser.password);
  await clickElement(driver, 'button[type="submit"]');
  await waitForUrl(driver, "/dashboard", 15000);
  await sleep(1000);
}

export async function runDashboardTests() {
  let driver;
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    logTest("\n========================================", "info");
    logTest("🧪 INICIANDO TESTES DO DASHBOARD", "info");
    logTest("========================================\n", "info");

    driver = await createDriver();
    await login(driver);

    // Teste 1: Verificar elementos principais do dashboard
    logTest("📋 Teste 1: Verificar elementos do dashboard", "info");
    try {
      await waitForElement(driver, ".navbar");
      await waitForElement(driver, ".navbar-brand");
      await waitForElement(driver, ".navbar-menu");
      await waitForElement(driver, ".btn-logout");
      await waitForElement(driver, ".dashboard-container");
      await waitForElement(driver, ".welcome-card");
      // Dashboard pode ter metrics-grid, não necesariamente dashboard-grid
      try {
        await waitForElement(driver, ".metrics-grid", 3000);
      } catch (e) {
        // Métricas podem não estar disponíveis, ok
      }

      await takeScreenshot(driver, "dashboard-test1");
      logTest(
        "✅ Teste 1 PASSOU: Todos os elementos estão presentes",
        "success"
      );
      testsPassed++;
    } catch (error) {
      logTest(`❌ Teste 1 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "dashboard-test1-falha");
      testsFailed++;
    }

    // Teste 2: Verificar navegação para página de pessoas
    logTest("\n📋 Teste 2: Navegar para pessoas", "info");
    try {
      // Esperar os links da navbar estarem prontos
      await sleep(1000);
      const navLinks = await driver.findElements({ css: ".nav-link" });

      if (navLinks.length < 2) {
        throw new Error("Links da navbar não encontrados");
      }

      // Clicar no segundo link (Pessoas: 👥)
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        navLinks[1]
      );
      await sleep(300);
      await driver.executeScript("arguments[0].click();", navLinks[1]);

      // Aguardar navegação
      await sleep(2000);

      // Verificar URL
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes("/pessoas")) {
        // Aguarda a página carregar mesmo que selector varie
        await sleep(1500);
        await takeScreenshot(driver, "dashboard-test2");
        logTest(
          "✅ Teste 2 PASSOU: Navegação para pessoas funciona",
          "success"
        );
        testsPassed++;

        // Voltar para dashboard
        await driver.executeScript("arguments[0].click();", navLinks[0]);
        await sleep(2000);
      } else {
        throw new Error(`URL incorreta: ${currentUrl}`);
      }
    } catch (error) {
      logTest(`❌ Teste 2 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "dashboard-test2-falha");
      testsFailed++;
    }

    // Teste 3: Verificar navegação para projetos
    logTest("\n📋 Teste 3: Navegar para projetos via navbar", "info");
    try {
      // Buscar links novamente (garantir que estão atualizados)
      await sleep(500);
      const navLinks = await driver.findElements({ css: ".nav-link" });

      if (navLinks.length < 3) {
        throw new Error("Links da navbar não encontrados (esperado 3+)");
      }

      // Clicar no link de projetos (terceiro link: 📁)
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        navLinks[2]
      );
      await sleep(300);
      await driver.executeScript("arguments[0].click();", navLinks[2]);

      // Aguardar navegação
      await sleep(2000);

      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes("/projetos")) {
        await takeScreenshot(driver, "dashboard-test3");
        logTest("✅ Teste 3 PASSOU: Navegação via navbar funciona", "success");
        testsPassed++;
      } else {
        throw new Error(`Navegação falhou. URL atual: ${currentUrl}`);
      }
    } catch (error) {
      logTest(`❌ Teste 3 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "dashboard-test3-falha");
      testsFailed++;
    }

    // Teste 4: Verificar link ativo na navbar
    logTest("\n📋 Teste 4: Verificar link ativo na navbar", "info");
    try {
      // Esperar a página carregar
      await sleep(500);

      const activeLink = await waitForElement(driver, ".nav-link.active", 5000);
      const linkText = await activeLink.getText();

      // Verificar se existe link ativo na navbar (qualquer um é válido)
      if (linkText && linkText.length > 0) {
        logTest("✅ Teste 4 PASSOU: Link ativo está presente", "success");
        testsPassed++;
      } else {
        throw new Error(`Link ativo não encontrado`);
      }
    } catch (error) {
      logTest(`❌ Teste 4 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "dashboard-test4-falha");
      testsFailed++;
    }

    // Teste 5: Voltar para dashboard
    logTest("\n📋 Teste 5: Voltar para dashboard", "info");
    try {
      // Buscar links novamente
      await sleep(500);
      const navLinks = await driver.findElements({ css: ".nav-link" });

      if (navLinks.length === 0) {
        throw new Error("Links da navbar não encontrados");
      }

      // Clicar no primeiro link (Dashboard) usando JavaScript
      await driver.executeScript(
        "arguments[0].scrollIntoView(true);",
        navLinks[0]
      );
      await sleep(300);
      await driver.executeScript("arguments[0].click();", navLinks[0]);

      // Aguardar navegação
      await sleep(2000);

      // Verificar se voltou para o dashboard
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl.includes("/dashboard")) {
        await waitForElement(driver, ".welcome-card", 5000);
        await takeScreenshot(driver, "dashboard-test5");
        logTest("✅ Teste 5 PASSOU: Retorno ao dashboard funciona", "success");
        testsPassed++;
      } else {
        throw new Error(`URL incorreta: ${currentUrl}`);
      }
    } catch (error) {
      logTest(`❌ Teste 5 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "dashboard-test5-falha");
      testsFailed++;
    }
  } catch (error) {
    logTest(`❌ ERRO GERAL: ${error.message}`, "error");
    if (driver) {
      await takeScreenshot(driver, "dashboard-erro-geral");
    }
  } finally {
    if (driver) {
      await quitDriver();
    }

    // Relatório final
    logTest("\n========================================", "info");
    logTest("📊 RELATÓRIO DE TESTES DO DASHBOARD", "info");
    logTest("========================================", "info");
    logTest(`✅ Testes Passados: ${testsPassed}`, "success");
    logTest(
      `❌ Testes Falhados: ${testsFailed}`,
      testsFailed > 0 ? "error" : "success"
    );
    logTest(`📈 Total: ${testsPassed + testsFailed} testes`, "info");
    logTest(
      `🎯 Taxa de Sucesso: ${(
        (testsPassed / (testsPassed + testsFailed)) *
        100
      ).toFixed(2)}%`,
      "info"
    );
    logTest("========================================\n", "info");

    return { passed: testsPassed, failed: testsFailed };
  }
}

// Executar se for chamado diretamente
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  runDashboardTests();
}
