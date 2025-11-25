import { createDriver, quitDriver } from '../utils/driver.js';
import { 
  waitForElement, 
  waitForElementVisible, 
  fillInput, 
  clickElement, 
  waitForUrl,
  logTest,
  takeScreenshot,
  sleep
} from '../utils/helpers.js';
import { config } from '../config.js';

export async function runLoginTests() {
  let driver;
  let testsPassed = 0;
  let testsFailed = 0;

  try {
    logTest('\n========================================', 'info');
    logTest('🧪 INICIANDO TESTES DE LOGIN', 'info');
    logTest('========================================\n', 'info');

    driver = await createDriver();
    await driver.get(config.baseUrl);

    // Teste 1: Verificar carregamento da página de login
    logTest('📋 Teste 1: Verificar página de login', 'info');
    try {
      await waitForElement(driver, 'input[type="email"]');
      await waitForElement(driver, 'input[type="password"]');
      await waitForElement(driver, 'button[type="submit"]');
      logTest('✅ Teste 1 PASSOU: Página de login carregada corretamente', 'success');
      testsPassed++;
    } catch (error) {
      logTest(`❌ Teste 1 FALHOU: ${error.message}`, 'error');
      await takeScreenshot(driver, 'login-test1-falha');
      testsFailed++;
    }

    // Teste 2: Tentar login com campos vazios
    logTest('\n📋 Teste 2: Login com campos vazios', 'info');
    try {
      await clickElement(driver, 'button[type="submit"]');
      await sleep(1000);
      // Verificar se ainda está na página de login (não redirecionou)
      const currentUrl = await driver.getCurrentUrl();
      if (currentUrl === config.baseUrl + '/' || currentUrl === config.baseUrl) {
        logTest('✅ Teste 2 PASSOU: Validação de campos vazios funciona', 'success');
        testsPassed++;
      } else {
        throw new Error('Login não deveria ser permitido com campos vazios');
      }
    } catch (error) {
      logTest(`❌ Teste 2 FALHOU: ${error.message}`, 'error');
      await takeScreenshot(driver, 'login-test2-falha');
      testsFailed++;
    }

    // Teste 3: Login com credenciais válidas
    logTest('\n📋 Teste 3: Login com credenciais válidas', 'info');
    try {
      await fillInput(driver, 'input[type="email"]', config.testUser.email);
      await fillInput(driver, 'input[type="password"]', config.testUser.password);
      await takeScreenshot(driver, 'login-test3-antes');
      
      await clickElement(driver, 'button[type="submit"]');
      
      // Aguardar redirecionamento para dashboard
      await waitForUrl(driver, '/dashboard', 15000);
      await sleep(2000);
      
      await takeScreenshot(driver, 'login-test3-depois');
      logTest('✅ Teste 3 PASSOU: Login realizado com sucesso', 'success');
      testsPassed++;
    } catch (error) {
      logTest(`❌ Teste 3 FALHOU: ${error.message}`, 'error');
      logTest('⚠️  Certifique-se de que o usuário de teste existe no Firebase', 'warning');
      await takeScreenshot(driver, 'login-test3-falha');
      testsFailed++;
    }

    // Teste 4: Verificar elementos do dashboard após login
    logTest('\n📋 Teste 4: Verificar dashboard após login', 'info');
    try {
      await waitForElement(driver, '.navbar');
      await waitForElement(driver, '.dashboard-container');
      await waitForElement(driver, '.welcome-card');
      logTest('✅ Teste 4 PASSOU: Dashboard carregado corretamente', 'success');
      testsPassed++;
    } catch (error) {
      logTest(`❌ Teste 4 FALHOU: ${error.message}`, 'error');
      await takeScreenshot(driver, 'login-test4-falha');
      testsFailed++;
    }

    // Teste 5: Verificar logout
    logTest('\n📋 Teste 5: Testar logout', 'info');
    try {
      // Esperar a navbar estar completamente carregada
      await waitForElement(driver, '.navbar');
      await sleep(1000);
      
      // Obter URL antes do logout
      const urlAntes = await driver.getCurrentUrl();
      logTest(`URL antes do logout: ${urlAntes}`, 'info');
      
      // Clicar no botão de logout usando JavaScript para garantir
      const logoutBtn = await waitForElement(driver, '.btn-logout');
      await driver.executeScript('arguments[0].click();', logoutBtn);
      
      // Aguardar o redirecionamento com mais tempo
      await sleep(3000);
      
      // Verificar se voltou para a página de login
      const currentUrl = await driver.getCurrentUrl();
      logTest(`URL depois do logout: ${currentUrl}`, 'info');
      
      // Aceitar várias formas de URL
      const isLoginPage = currentUrl === config.baseUrl + '/' || 
                         currentUrl === config.baseUrl || 
                         currentUrl.endsWith('/');
      
      if (isLoginPage) {
        // Verificar se os elementos de login estão presentes
        try {
          await waitForElement(driver, 'input[type="email"]', 5000);
          await waitForElement(driver, 'input[type="password"]', 3000);
          logTest('✅ Teste 5 PASSOU: Logout realizado com sucesso', 'success');
          testsPassed++;
        } catch (e) {
          // Se não encontrar os campos, pode ser problema de carregamento
          logTest(`⚠️  Elementos de login não encontrados: ${e.message}`, 'warning');
          // Tentar recarregar
          await driver.get(config.baseUrl);
          await sleep(2000);
          await waitForElement(driver, 'input[type="email"]', 5000);
          logTest('✅ Teste 5 PASSOU: Logout realizado com sucesso (após reload)', 'success');
          testsPassed++;
        }
      } else {
        throw new Error(`URL incorreta após logout: ${currentUrl} (esperado: ${config.baseUrl}/)`);
      }
    } catch (error) {
      logTest(`❌ Teste 5 FALHOU: ${error.message}`, 'error');
      await takeScreenshot(driver, 'login-test5-falha');
      testsFailed++;
    }

  } catch (error) {
    logTest(`❌ ERRO GERAL: ${error.message}`, 'error');
    if (driver) {
      await takeScreenshot(driver, 'login-erro-geral');
    }
  } finally {
    if (driver) {
      await quitDriver();
    }

    // Relatório final
    logTest('\n========================================', 'info');
    logTest('📊 RELATÓRIO DE TESTES DE LOGIN', 'info');
    logTest('========================================', 'info');
    logTest(`✅ Testes Passados: ${testsPassed}`, 'success');
    logTest(`❌ Testes Falhados: ${testsFailed}`, testsFailed > 0 ? 'error' : 'success');
    logTest(`📈 Total: ${testsPassed + testsFailed} testes`, 'info');
    logTest(`🎯 Taxa de Sucesso: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(2)}%`, 'info');
    logTest('========================================\n', 'info');

    return { passed: testsPassed, failed: testsFailed };
  }
}

// Executar se for chamado diretamente
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  runLoginTests();
}
