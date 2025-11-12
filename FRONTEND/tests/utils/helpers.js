import { By, until } from 'selenium-webdriver';
import { config } from '../config.js';

export async function waitForElement(driver, selector, timeout = config.timeout) {
  return await driver.wait(
    until.elementLocated(By.css(selector)),
    timeout,
    `Elemento não encontrado: ${selector}`
  );
}

export async function waitForElementVisible(driver, selector, timeout = config.timeout) {
  const element = await waitForElement(driver, selector, timeout);
  await driver.wait(
    until.elementIsVisible(element),
    timeout,
    `Elemento não está visível: ${selector}`
  );
  return element;
}

export async function fillInput(driver, selector, value) {
  const element = await waitForElementVisible(driver, selector);
  
  // Limpar o campo de várias formas para garantir
  await element.clear();
  await driver.executeScript('arguments[0].value = ""', element);
  
  // Preencher usando sendKeys
  await element.sendKeys(value);
  
  // Verificar se o valor foi preenchido
  const currentValue = await element.getAttribute('value');
  if (currentValue !== value) {
    // Tentar novamente usando JavaScript
    await driver.executeScript(`arguments[0].value = "${value}"`, element);
    // Disparar evento de input para React detectar
    await driver.executeScript(`
      arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
      arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
    `, element);
  }
}

export async function clickElement(driver, selector) {
  const element = await waitForElementVisible(driver, selector);
  await element.click();
}

export async function getText(driver, selector) {
  const element = await waitForElement(driver, selector);
  return await element.getText();
}

export async function waitForUrl(driver, url, timeout = config.timeout) {
  await driver.wait(
    until.urlContains(url),
    timeout,
    `URL não contém: ${url}`
  );
}

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function logTest(message, status = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m'
  };
  const reset = '\x1b[0m';
  console.log(`${colors[status]}${message}${reset}`);
}

export async function takeScreenshot(driver, name) {
  const screenshot = await driver.takeScreenshot();
  const fs = await import('fs');
  const path = await import('path');
  
  const screenshotDir = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir);
  }
  
  const filename = path.join(screenshotDir, `${name}-${Date.now()}.png`);
  fs.writeFileSync(filename, screenshot, 'base64');
  logTest(`Screenshot salvo: ${filename}`, 'info');
}
