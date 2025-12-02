import { createDriver, quitDriver } from '../utils/driver.js';
import {
  waitForElement,
  waitForElementVisible,
  fillInput,
  clickElement,
  waitForUrl,
  logTest,
  takeScreenshot,
  sleep,
} from '../utils/helpers.js';
import { config } from '../config.js';
import { By } from 'selenium-webdriver';

export async function runProjetosTests() {
  let driver;
  let passed = 0;
  let failed = 0;

  try {
    logTest('\n========================================', 'info');
    logTest('🧪 INICIANDO TESTES DE PROJETOS', 'info');
    logTest('========================================\n', 'info');

    driver = await createDriver();
    await driver.get(config.baseUrl);

    // Login rápido (reutiliza o fluxo conhecido)
    try {
      await fillInput(driver, 'input[type="email"]', config.testUser.email);
      await fillInput(driver, 'input[type="password"]', config.testUser.password);
      await clickElement(driver, 'button[type="submit"]');
      await waitForUrl(driver, '/dashboard', 15000);
      await sleep(1000);
    } catch (e) {
      logTest('⚠️  Falha no login inicial (projetos): ' + e.message, 'warning');
    }

    // Ir diretamente para a rota de projetos
    await driver.get(config.baseUrl + '/projetos');
    await waitForElementVisible(driver, '.projetos-header', 10000);

    // Abrir modal de criar projeto
    try {
      await clickElement(driver, '.projetos-header button.btn-primary');
      await waitForElementVisible(driver, '.modal-content', 5000);

      // Preencher título único
      const titulo = `Projeto E2E ${Date.now()}`;
      await fillInput(driver, 'input[type="text"]', titulo);

      // descrição
      await fillInput(driver, 'textarea', 'Descrição de teste automatizado');

      // selecionar orientador se houver opções
      try {
        const select = await driver.findElement(By.css('select'));
        const options = await select.findElements(By.css('option'));
        // escolher primeira opção válida (não vazia)
        for (const opt of options) {
          const val = await opt.getAttribute('value');
          if (val && val.trim() !== '') {
            await select.sendKeys(val);
            break;
          }
        }
      } catch (e) {
        logTest('⚠️  Nenhum orientador disponível para selecionar', 'warning');
      }

      // dataInicio
      const hoje = new Date().toISOString().split('T')[0];
      const inputsDate = await driver.findElements(By.css('input[type="date"]'));
      if (inputsDate.length > 0) {
        await inputsDate[0].sendKeys(hoje);
      }

      // marcar primeiro aluno se existir
      try {
        const checkbox = await driver.findElement(By.css('.checkbox-group input[type="checkbox"]'));
        if (checkbox) await checkbox.click();
      } catch (e) {
        logTest('⚠️  Nenhum aluno disponível para selecionar (pode ser ok)', 'info');
      }

      // Enviar formulário
      const submit = await driver.findElement(By.css('button[type="submit"]'));
      await submit.click();

      // Aceitar alert de sucesso se aparecer
      try {
        await sleep(500);
        const alert = await driver.switchTo().alert();
        await alert.accept();
      } catch (e) {
        // não existe alert, seguir
      }

      // Aguardar atualização da lista
      await sleep(1500);

      logTest('✅ Teste: criar projeto (fluxo UI) executado', 'success');
      passed++;
    } catch (error) {
      logTest(`❌ Falha ao criar projeto: ${error.message}`, 'error');
      if (driver) await takeScreenshot(driver, 'projetos-criar-falha');
      failed++;
    }
  } catch (error) {
    logTest(`❌ ERRO GERAL (projetos): ${error.message}`, 'error');
    if (driver) await takeScreenshot(driver, 'projetos-erro-geral');
    failed++;
  } finally {
    if (driver) await quitDriver();

    logTest('\n========================================', 'info');
    logTest('📊 RELATÓRIO DE TESTES DE PROJETOS', 'info');
    logTest('========================================', 'info');
    logTest(`✅ Passaram: ${passed}`, 'success');
    logTest(`❌ Falharam: ${failed}`, failed > 0 ? 'error' : 'success');
    logTest('========================================\n', 'info');

    return { passed, failed };
  }
}

// Executar diretamente (debug)
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runProjetosTests();
}
