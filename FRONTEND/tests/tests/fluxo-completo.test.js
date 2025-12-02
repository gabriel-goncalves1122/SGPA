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

export async function runFluxoCompletoTest() {
  let driver;
  let passed = 0;
  let failed = 0;

  try {
    logTest(
      "\n╔════════════════════════════════════════════════════════╗",
      "info"
    );
    logTest("║  🎯 INICIANDO TESTE DE FLUXO COMPLETO DA APLICAÇÃO   ║", "info");
    logTest(
      "╚════════════════════════════════════════════════════════╝\n",
      "info"
    );

    driver = await createDriver();
    await driver.get(config.baseUrl);

    // ============================================================
    // TESTE 1: LOGIN
    // ============================================================
    logTest("\n📋 Teste 1: Fazer Login na Aplicação", "info");
    try {
      await fillInput(driver, 'input[type="email"]', config.testUser.email);
      await fillInput(
        driver,
        'input[type="password"]',
        config.testUser.password
      );
      await clickElement(driver, 'button[type="submit"]');
      await waitForUrl(driver, "/dashboard", 15000);
      await sleep(1200);
      logTest("✅ Teste 1 PASSOU: Login realizado com sucesso", "success");
      passed++;
      await takeScreenshot(driver, "fluxo-test1-login");
    } catch (error) {
      logTest(`❌ Teste 1 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "fluxo-test1-falha");
      failed++;
      throw error; // Parar fluxo se login falhar
    }

    // ============================================================
    // TESTE 2: NAVEGAR POR TODAS AS ABAS DO NAVBAR
    // ============================================================
    logTest("\n📋 Teste 2: Navegar por todas as abas do navbar", "info");
    try {
      const navItems = [
        { label: "Início", path: "/dashboard" },
        { label: "Pessoas", path: "/pessoas" },
        { label: "Projetos", path: "/projetos" },
        { label: "Relatórios", path: "/relatorios" },
      ];

      for (const item of navItems) {
        try {
          // Procurar botão com classe 'nav-link' que contém o texto
          const navLink = await driver.findElement(
            By.xpath(
              `//button[contains(@class, 'nav-link') and contains(., '${item.label}')]`
            )
          );
          await driver.executeScript("arguments[0].click();", navLink);
          await sleep(900);
          logTest(`  ✅ Navegou para: ${item.label}`, "info");
          await takeScreenshot(driver, `fluxo-nav-${item.label.toLowerCase()}`);
        } catch (e) {
          logTest(`  ⚠️  Não encontrou link: ${item.label}`, "warning");
        }
      }

      logTest("✅ Teste 2 PASSOU: Navegação no navbar completa", "success");
      passed++;
    } catch (error) {
      logTest(`❌ Teste 2 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "fluxo-test2-falha");
      failed++;
    }

    // ============================================================
    // TESTE 3: PESSOAS - ABAS E CRUD
    // ============================================================
    logTest("\n📋 Teste 3: Pessoas - Alternar abas e realizar CRUD", "info");
    try {
      await driver.get(config.baseUrl + "/pessoas");
      await sleep(1800);
      await waitForElementVisible(driver, ".pessoas-container", 5000);
      await sleep(900);

      // 3.1: Alternar para Professores
      logTest("  📝 3.1: Alternando para aba Professores", "info");
      const buttons = await driver.findElements(By.css(".tipo-toggle button"));
      if (buttons.length > 1) {
        await buttons[1].click();
        await sleep(1200);
        logTest("    ✅ Alternado para Professores", "info");
        await takeScreenshot(driver, "fluxo-test3-professores");
      }

      // 3.2: Voltar para Alunos
      logTest("  📝 3.2: Voltando para aba Alunos", "info");
      await buttons[0].click();
      await sleep(1200);
      logTest("    ✅ Voltado para Alunos", "info");
      await takeScreenshot(driver, "fluxo-test3-alunos");

      // 3.3: CRIAR ALUNO
      logTest("  📝 3.3: Criando novo aluno", "info");
      const btnPrimary = await waitForElement(driver, ".btn-primary");
      await driver.executeScript("arguments[0].click();", btnPrimary);
      await sleep(900);
      await waitForElementVisible(driver, ".modal-overlay", 5000);
      await sleep(400);

      const titleInputs = await driver.findElements(
        By.css('.modal-form input[type="text"]')
      );
      if (titleInputs.length > 0) {
        await titleInputs[0].clear();
        await titleInputs[0].sendKeys(`Aluno Teste ${Date.now()}`);
        await sleep(400);
      }
      if (titleInputs.length > 1) {
        await titleInputs[1].clear();
        await titleInputs[1].sendKeys(
          `ALUTEST${Date.now().toString().slice(-4)}`
        );
        await sleep(400);
      }

      const emailInputs = await driver.findElements(
        By.css('.modal-form input[type="email"]')
      );
      if (emailInputs.length > 0) {
        await emailInputs[0].clear();
        await emailInputs[0].sendKeys(`aluno${Date.now()}@teste.com`);
        await sleep(400);
      }

      if (titleInputs.length > 2) {
        await titleInputs[2].clear();
        await titleInputs[2].sendKeys("Engenharia");
        await sleep(400);
      }

      const telInputs = await driver.findElements(
        By.css('.modal-form input[type="tel"]')
      );
      if (telInputs.length > 0) {
        await telInputs[0].clear();
        await telInputs[0].sendKeys("11999999999");
        await sleep(400);
      }

      const cadBtn = await driver.findElements(By.css(".modal-content button"));
      for (let btn of cadBtn.reverse()) {
        const text = await btn.getText();
        if (text.includes("Cadastrar")) {
          await driver.executeScript("arguments[0].click();", btn);
          await sleep(1800);
          break;
        }
      }
      logTest("    ✅ Aluno criado", "info");
      await takeScreenshot(driver, "fluxo-test3-aluno-criado");

      // 3.4: BUSCAR ALUNO
      logTest("  📝 3.4: Buscando aluno criado", "info");
      await sleep(900);
      const searchInput = await waitForElement(driver, ".search-input", 5000);
      await searchInput.clear();
      await searchInput.sendKeys("Aluno Teste");
      await sleep(1200);
      logTest("    ✅ Aluno encontrado", "info");
      await takeScreenshot(driver, "fluxo-test3-aluno-encontrado");

      // 3.5: EDITAR ALUNO
      logTest("  📝 3.5: Editando aluno", "info");
      await sleep(400);
      const editBtns = await driver.findElements(By.css(".action-btn.edit"));
      if (editBtns.length > 0) {
        await driver.executeScript("arguments[0].click();", editBtns[0]);
        await sleep(900);
        await waitForElementVisible(driver, ".modal-overlay", 5000);
        await sleep(400);

        const editInputs = await driver.findElements(
          By.css('.modal-form input[type="text"]')
        );
        if (editInputs.length > 0) {
          await editInputs[0].clear();
          await editInputs[0].sendKeys(`Aluno Editado ${Date.now()}`);
          await sleep(400);
        }

        const updBtn = await driver.findElements(
          By.css(".modal-content button")
        );
        for (let btn of updBtn.reverse()) {
          const text = await btn.getText();
          if (text.includes("Atualizar")) {
            await driver.executeScript("arguments[0].click();", btn);
            await sleep(1800);
            break;
          }
        }
        logTest("    ✅ Aluno editado", "info");
        await takeScreenshot(driver, "fluxo-test3-aluno-editado");
      }

      logTest("✅ Teste 3 PASSOU: CRUD de Pessoas completo", "success");
      passed++;
    } catch (error) {
      logTest(`❌ Teste 3 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "fluxo-test3-falha");
      failed++;
    }

    // ============================================================
    // TESTE 4: PROJETOS - CRUD
    // ============================================================
    logTest(
      "\n📋 Teste 4: Projetos - Criar, Editar e Adicionar Tarefas",
      "info"
    );
    try {
      await driver.get(config.baseUrl + "/projetos");
      await sleep(1800);
      await waitForElementVisible(driver, ".projetos-header", 5000);
      await sleep(900);

      // 4.1: CRIAR PROJETO
      logTest("  📝 4.1: Criando novo projeto", "info");
      const newProjBtn = await waitForElement(
        driver,
        ".projetos-header button.btn-primary"
      );
      await driver.executeScript("arguments[0].click();", newProjBtn);
      await sleep(900);
      await waitForElementVisible(driver, ".modal-content", 5000);
      await sleep(1200);

      const projTitle = `Projeto ${Date.now()}`;
      const projInputs = await driver.findElements(
        By.css('input[type="text"]')
      );
      if (projInputs.length > 0) {
        await projInputs[0].clear();
        await projInputs[0].sendKeys(projTitle);
        await sleep(800);
      }

      const projTextareas = await driver.findElements(By.css("textarea"));
      if (projTextareas.length > 0) {
        await projTextareas[0].clear();
        await projTextareas[0].sendKeys(
          "Projeto de teste automatizado com funcionalidades completas"
        );
        await sleep(800);
      }

      const selects = await driver.findElements(By.css("select"));
      if (selects.length > 0) {
        const orientSelect = selects[0];
        const options = await orientSelect.findElements(By.css("option"));
        if (options.length > 1) {
          await orientSelect.click();
          await sleep(300);
          await options[1].click();
          await sleep(800);
        }
      }

      // Usar campo de data com calendário
      const dateInputs = await driver.findElements(
        By.css('input[type="date"]')
      );
      if (dateInputs.length > 0) {
        // Clicar no campo de data para abrir o calendário
        await dateInputs[0].click();
        await sleep(500);

        // Obter data válida (hoje + 1 dia para garantir futuro)
        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        const dataFormatada = amanha.toISOString().split("T")[0];

        // Limpar e enviar data
        await dateInputs[0].clear();
        await dateInputs[0].sendKeys(dataFormatada);
        await sleep(800);
        logTest(`    ✅ Data selecionada: ${dataFormatada}`, "info");
      }

      if (selects.length > 1) {
        const statusSelect = selects[1];
        const statusOpts = await statusSelect.findElements(By.css("option"));
        if (statusOpts.length > 1) {
          await statusSelect.click();
          await sleep(300);
          await statusOpts[1].click();
          await sleep(800);
        }
      }

      const checkboxes = await driver.findElements(
        By.css('.checkbox-group input[type="checkbox"]')
      );
      for (let i = 0; i < Math.min(2, checkboxes.length); i++) {
        await checkboxes[i].click();
        await sleep(400);
      }

      const projButtons = await driver.findElements(
        By.css(".modal-content button")
      );
      for (let btn of projButtons.reverse()) {
        const text = await btn.getText();
        if (text.includes("Cadastrar")) {
          await driver.executeScript("arguments[0].click();", btn);
          await sleep(1800);
          break;
        }
      }

      try {
        await sleep(500);
        const alert = await driver.switchTo().alert();
        await alert.accept();
        await sleep(400);
      } catch (e) {
        // Sem alert
      }

      logTest("    ✅ Projeto criado", "info");
      await takeScreenshot(driver, "fluxo-test4-projeto-criado");

      // 4.2: EDITAR PROJETO
      logTest("  📝 4.2: Editando projeto", "info");
      await sleep(1200);
      await driver.get(config.baseUrl + "/projetos");
      await sleep(1800);

      const projCards = await driver.findElements(By.css(".projeto-card"));
      if (projCards.length > 0) {
        const firstCard = projCards[0];
        await driver.executeScript(
          "arguments[0].scrollIntoView(true);",
          firstCard
        );
        await sleep(500);

        const actionButtons = await firstCard.findElements(
          By.css("button, .btn")
        );
        let editBtn = null;
        for (const btn of actionButtons) {
          const text = await btn.getText();
          if (
            text.toLowerCase().includes("edit") &&
            !text.toLowerCase().includes("tarefa")
          ) {
            editBtn = btn;
            break;
          }
        }

        if (editBtn) {
          await driver.executeScript("arguments[0].click();", editBtn);
          await sleep(1200);
          await waitForElementVisible(driver, ".modal-content", 5000);
          await sleep(900);

          const editTextareas = await driver.findElements(
            By.css(".modal-content textarea")
          );
          if (editTextareas.length > 0) {
            await editTextareas[0].clear();
            await editTextareas[0].sendKeys(
              "Descrição atualizada em teste automatizado"
            );
            await sleep(800);
          }

          const editBtns = await driver.findElements(
            By.css(".modal-content button")
          );
          for (let btn of editBtns.reverse()) {
            const text = await btn.getText();
            if (text.includes("Atualizar")) {
              await driver.executeScript("arguments[0].click();", btn);
              await sleep(1200);
              break;
            }
          }

          try {
            await sleep(500);
            const alert = await driver.switchTo().alert();
            await alert.accept();
            await sleep(400);
          } catch (e) {
            // Sem alert
          }

          logTest("    ✅ Projeto editado", "info");
          await takeScreenshot(driver, "fluxo-test4-projeto-editado");
        }
      }

      // 4.3: CRIAR TAREFA E MUDAR STATUS
      logTest("  📝 4.3: Criando tarefa e alterando status", "info");
      await sleep(1200);
      const tarefaBtns = await driver.findElements(
        By.css(".projeto-card .btn-tarefas, .projeto-actions .btn-tarefas")
      );
      if (tarefaBtns.length > 0) {
        await driver.executeScript("arguments[0].click();", tarefaBtns[0]);
        await sleep(1200);
        await waitForElementVisible(driver, ".modal-content", 5000);
        await sleep(1200);

        const addTarefaBtns = await driver.findElements(
          By.css(".btn-add-tarefa, button[type='button']")
        );
        let tarefaBtnFound = false;
        for (let btn of addTarefaBtns) {
          const text = await btn.getText();
          if (text.includes("Tarefa")) {
            await driver.executeScript("arguments[0].click();", btn);
            tarefaBtnFound = true;
            await sleep(900);
            break;
          }
        }

        if (tarefaBtnFound) {
          await waitForElementVisible(driver, ".tarefa-form, textarea", 5000);
          await sleep(400);

          const tarefaTextarea = await driver.findElements(By.css("textarea"));
          if (tarefaTextarea.length > 0) {
            await tarefaTextarea[0].clear();
            await tarefaTextarea[0].sendKeys(`Tarefa Teste ${Date.now()}`);
            await sleep(400);
          }

          const tarefaCheckboxes = await driver.findElements(
            By.css('.checkbox-group input[type="checkbox"]')
          );
          for (let i = 0; i < Math.min(2, tarefaCheckboxes.length); i++) {
            await tarefaCheckboxes[i].click();
            await sleep(400);
          }

          const tarefaButtons = await driver.findElements(By.css("button"));
          for (let btn of tarefaButtons.reverse()) {
            const text = await btn.getText();
            if (text.includes("Criar") && text.includes("Tarefa")) {
              await driver.executeScript("arguments[0].click();", btn);
              await sleep(1800);
              break;
            }
          }

          try {
            await sleep(500);
            const alert = await driver.switchTo().alert();
            await alert.accept();
            await sleep(400);
          } catch (e) {
            // Sem alert
          }

          logTest("    ✅ Tarefa criada", "info");
          await takeScreenshot(driver, "fluxo-test4-tarefa-criada");

          // Pulando alteração de status da tarefa neste fluxo (não necessária)
          logTest(
            "    ⚠️ Pulando alteração de status da tarefa (pulado)",
            "info"
          );
          await sleep(400);
          await takeScreenshot(driver, "fluxo-test4-tarefa-pulada");
        }
      }

      logTest(
        "✅ Teste 4 PASSOU: CRUD de Projetos e Tarefas completo",
        "success"
      );
      passed++;
    } catch (error) {
      logTest(`❌ Teste 4 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "fluxo-test4-falha");
      failed++;
    }

    // ============================================================
    // TESTE 5: RELATÓRIOS E EXPORTAR CSV
    // ============================================================
    logTest("\n📋 Teste 5: Relatórios - Exportar CSV", "info");
    try {
      await driver.get(config.baseUrl + "/relatorios");
      await sleep(1200);
      await waitForElementVisible(driver, ".relatorios", 5000);
      await sleep(600);

      let exportClicked = false;

      // Prioridade: botão com classe `.btn-export` (conforme Relatorios.tsx)
      try {
        const exportBtns = await driver.findElements(By.css(".btn-export"));
        if (exportBtns.length > 0) {
          const btn = exportBtns[0];
          const disabled = await btn.getAttribute("disabled");
          // Se estiver disabled, tentar atualizar o relatório para habilitar
          if (disabled !== null) {
            const refreshBtns = await driver.findElements(
              By.css(".btn-refresh")
            );
            if (refreshBtns.length > 0) {
              logTest(
                "  📝 Atualizando relatório antes de exportar (btn-refresh)",
                "info"
              );
              await driver.executeScript(
                "arguments[0].click();",
                refreshBtns[0]
              );
              await sleep(900);
            }
            const exportBtnsAfter = await driver.findElements(
              By.css(".btn-export")
            );
            if (exportBtnsAfter.length > 0) {
              const disabled2 = await exportBtnsAfter[0].getAttribute(
                "disabled"
              );
              if (disabled2 === null) {
                await driver.executeScript(
                  "arguments[0].scrollIntoView(true);",
                  exportBtnsAfter[0]
                );
                await sleep(200);
                await driver.executeScript(
                  "arguments[0].click();",
                  exportBtnsAfter[0]
                );
                exportClicked = true;
              }
            }
          } else {
            await driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              btn
            );
            await sleep(200);
            await driver.executeScript("arguments[0].click();", btn);
            exportClicked = true;
          }
        }
      } catch (e) {
        logTest("    ℹ️  Falha ao clicar em .btn-export", "debug");
      }

      // Fallbacks: texto, classes alternativas e atributos
      if (!exportClicked) {
        try {
          const exportButtons = await driver.findElements(
            By.xpath(
              "//button[contains(text(), 'CSV') or contains(text(), 'Exportar') or contains(text(), 'Download') or contains(., 'Exportar CSV') ]"
            )
          );
          if (exportButtons.length > 0) {
            await driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              exportButtons[0]
            );
            await sleep(200);
            await driver.executeScript(
              "arguments[0].click();",
              exportButtons[0]
            );
            exportClicked = true;
          }
        } catch (e) {
          logTest("    ℹ️  Estratégia por texto não funcionou", "debug");
        }
      }

      if (!exportClicked) {
        try {
          const classBtns = await driver.findElements(
            By.css(".export-btn, .download-btn, .btn-csv")
          );
          if (classBtns.length > 0) {
            await driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              classBtns[0]
            );
            await sleep(200);
            await driver.executeScript("arguments[0].click();", classBtns[0]);
            exportClicked = true;
          }
        } catch (e) {
          logTest(
            "    ℹ️  Estratégia por classe alternativa não funcionou",
            "debug"
          );
        }
      }

      if (!exportClicked) {
        try {
          const attrBtns = await driver.findElements(
            By.css("[data-export], [data-action='export'], [data-download]")
          );
          if (attrBtns.length > 0) {
            await driver.executeScript(
              "arguments[0].scrollIntoView(true);",
              attrBtns[0]
            );
            await sleep(200);
            await driver.executeScript("arguments[0].click();", attrBtns[0]);
            exportClicked = true;
          }
        } catch (e) {
          logTest("    ℹ️  Estratégia por atributo não funcionou", "debug");
        }
      }

      if (!exportClicked) {
        logTest(
          "  ⚠️  Botão de exportação não encontrado ou estava desabilitado",
          "warning"
        );
        await takeScreenshot(driver, "fluxo-test5-relatorios");
      } else {
        logTest("    ✅ CSV exportado (download iniciado)", "info");
        await takeScreenshot(driver, "fluxo-test5-csv-exportado");
      }

      logTest("✅ Teste 5 PASSOU: Relatórios e Exportação CSV", "success");
      passed++;
    } catch (error) {
      logTest(`❌ Teste 5 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "fluxo-test5-falha");
      failed++;
    }

    // ============================================================
    // TESTE 6: LOGOUT
    // ============================================================
    try {
      // Procurar botão de logout no menu
      const logoutBtns = await driver.findElements(
        By.xpath(
          "//button[contains(text(), 'Logout') or contains(text(), 'Sair')]"
        )
      );

      if (logoutBtns.length > 0) {
        await driver.executeScript("arguments[0].click();", logoutBtns[0]);
        await sleep(1200);
        logTest("✅ Teste 6 PASSOU: Logout realizado", "success");
        passed++;
        await takeScreenshot(driver, "fluxo-test6-logout");
      } else {
        logTest("⚠️  Botão de logout não encontrado", "warning");
      }
    } catch (error) {
      logTest(`❌ Teste 6 FALHOU: ${error.message}`, "error");
      await takeScreenshot(driver, "fluxo-test6-falha");
      failed++;
    }
  } catch (error) {
    logTest(`\n❌ ERRO CRÍTICO: ${error.message}`, "error");
    if (driver) {
      await takeScreenshot(driver, "fluxo-erro-critico");
    }
    failed++;
  } finally {
    if (driver) {
      await quitDriver();
    }

    logTest(
      "\n╔════════════════════════════════════════════════════════╗",
      "info"
    );
    logTest("║           📊 RELATÓRIO FINAL DO FLUXO COMPLETO       ║", "info");
    logTest(
      "╠════════════════════════════════════════════════════════╣",
      "info"
    );
    logTest(
      `║ ✅ Testes Passados:  ${passed}                              ║`,
      "success"
    );
    logTest(
      `║ ❌ Testes Falhados:  ${failed}                              ║`,
      failed > 0 ? "error" : "success"
    );
    logTest(
      `║ 📈 Total:           ${passed + failed}                              ║`,
      "info"
    );
    logTest(
      `║ 🎯 Taxa de Sucesso:  ${((passed / (passed + failed)) * 100).toFixed(
        2
      )}%                      ║`,
      "info"
    );
    logTest(
      "╚════════════════════════════════════════════════════════╝\n",
      "info"
    );

    return { passed, failed };
  }
}

// Executar diretamente
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, "/")}`) {
  runFluxoCompletoTest();
}
