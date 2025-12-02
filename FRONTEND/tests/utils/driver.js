import { Builder } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import { config } from "../config.js";

let driver;

export async function createDriver() {
  const options = new chrome.Options();

  if (config.browserOptions.headless) {
    options.addArguments("--headless");
  }

  options.addArguments("--disable-gpu");
  options.addArguments("--no-sandbox");
  options.addArguments("--disable-dev-shm-usage");
  options.addArguments(
    `--window-size=${config.browserOptions.windowSize.width},${config.browserOptions.windowSize.height}`
  );

  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  await driver.manage().setTimeouts({ implicit: config.timeout });

  return driver;
}

export async function quitDriver() {
  if (driver) {
    await driver.quit();
  }
}

export function getDriver() {
  return driver;
}
