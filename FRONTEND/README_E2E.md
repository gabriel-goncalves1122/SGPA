# 🧪 Bateria de Testes E2E com Selenium — SGPA Frontend

Guia completo para executar e manter a suíte de testes end-to-end (E2E) do SGPA frontend.

## 📋 Pré-requisitos

- **Node.js** `v18.19.1+` (recomendado v20+)
- **npm** v9+
- **Google Chrome** instalado (versão 131+ recomendada)
- **Backend SGPA** rodando em `http://localhost:3000`
- **Frontend SGPA** rodando em `http://localhost:5173`

### Verificar versões

```bash
node --version
npm --version
google-chrome --version
```

## 🚀 Setup Inicial

### 1. Instalar dependências de teste

Dentro de `FRONTEND/`:

```bash
cd FRONTEND
npm install --save-dev selenium-webdriver chromedriver mocha chai mochawesome dotenv
```

### 2. Verificar ChromeDriver

O ChromeDriver deve ser compatível com a versão do Chrome instalado:

```bash
google-chrome --version  # ex: 131.0.6778.204
npm list chromedriver    # verificar versão instalada
```

Se houver incompatibilidade, atualize:

```bash
npm install --save-dev chromedriver@131  # ajuste o número para sua versão
```

### 3. Configurar credenciais de teste

Edite `FRONTEND/tests/config.js` com usuário real (ou crie via backend):

```javascript
export const config = {
  baseUrl: "http://localhost:5173",
  backendUrl: "http://localhost:3000",
  timeout: 10000,

  testUser: {
    email: "seu-email@test.com", // ← user que existe no Firebase
    password: "sua-senha", // ← senha correspondente
  },

  browserOptions: {
    headless: false, // false = abre navegador; true = headless
    windowSize: { width: 1920, height: 1080 },
  },
};
```

## 🔧 Executar Testes

### Pré-requisito: Backend e Frontend Rodando

**Terminal 1 — Backend:**

```bash
cd BACKEND
npm run dev
# Aguarde até ver "✓ Server listening on port 3000"
```

**Terminal 2 — Frontend:**

```bash
cd FRONTEND
npm run dev
# Aguarde até ver "➜  Local: http://localhost:5173"
```

### Executar Suíte E2E Completa

**Terminal 3 — Testes:**

```bash
cd FRONTEND
npm run test:e2e
```

**Saída esperada:**

```
╔════════════════════════════════════════════════════════╗
║       🧪 SUITE COMPLETA DE TESTES - SGPA 🧪          ║
╚════════════════════════════════════════════════════════╝

========================================
🧪 INICIANDO TESTES DE LOGIN
========================================
✅ Teste 1 PASSOU: Página de login carregada corretamente
✅ Teste 3 PASSOU: Login realizado com sucesso
...

📊 RELATÓRIO FINAL CONSOLIDADO
...
🎯 Taxa de Sucesso: 100%
```

### Executar Teste Individual

```bash
cd FRONTEND
# Rodar apenas testes de login
node tests/tests/login.test.js

# Rodar apenas testes de projetos
node tests/tests/projetos.test.js

# Rodar apenas testes de tarefas
node tests/tests/tarefas.test.js
```

## 🗂️ Estrutura de Testes

```
FRONTEND/tests/
├── test-runner.js              # Orquestrador (executa todas as suites)
├── config.js                   # Configurações globais (URL, credentials, timeout)
├── utils/
│   ├── driver.js               # Gerenciador do Selenium WebDriver
│   └── helpers.js              # Funções auxiliares (esperas, cliques, screenshots)
├── tests/
│   ├── login.test.js           # Testes de autenticação
│   ├── dashboard.test.js       # Testes da página dashboard
│   ├── alunos.test.js          # Testes CRUD de alunos
│   ├── projetos.test.js        # Testes de criação/edição de projetos
│   └── tarefas.test.js         # Testes de criação de tarefas
└── screenshots/                # Capturas de tela (falhas/debug)
```

## 📝 Suites de Testes Disponíveis

| Suite         | Arquivo             | O que testa                           |
| ------------- | ------------------- | ------------------------------------- |
| **Login**     | `login.test.js`     | Autenticação, validação, logout       |
| **Dashboard** | `dashboard.test.js` | Carregamento e navegação da dashboard |
| **Alunos**    | `alunos.test.js`    | CRUD completo de alunos               |
| **Projetos**  | `projetos.test.js`  | Criar projeto com orientador e alunos |
| **Tarefas**   | `tarefas.test.js`   | Criar tarefa dentro de um projeto     |

## 🐛 Adicionar Novo Teste

### 1. Criar arquivo de teste

Crie `FRONTEND/tests/tests/novo-feature.test.js`:

```javascript
import { createDriver, quitDriver } from "../utils/driver.js";
import {
  waitForElement,
  waitForElementVisible,
  fillInput,
  clickElement,
  logTest,
  takeScreenshot,
  sleep,
} from "../utils/helpers.js";
import { config } from "../config.js";

export async function runNovoFeatureTests() {
  let driver;
  let passed = 0;
  let failed = 0;

  try {
    logTest("\n========================================", "info");
    logTest("🧪 INICIANDO TESTES DE NOVO FEATURE", "info");
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
      await sleep(2000);
    } catch (e) {
      logTest(`⚠️  Falha no login: ${e.message}`, "warning");
    }

    // Seu teste aqui
    try {
      await clickElement(driver, ".seu-seletor");
      logTest("✅ Teste passou", "success");
      passed++;
    } catch (error) {
      logTest(`❌ Teste falhou: ${error.message}`, "error");
      await takeScreenshot(driver, "seu-teste-falha");
      failed++;
    }
  } finally {
    if (driver) await quitDriver();
    return { passed, failed };
  }
}
```

### 2. Registrar no test-runner

Edite `FRONTEND/tests/test-runner.js`:

```javascript
import { runNovoFeatureTests } from './tests/novo-feature.test.js';

async function runAllTests() {
  // ...
  const novoFeatureResults = await runNovoFeatureTests();
  totalPassed += novoFeatureResults.passed;
  totalFailed += novoFeatureResults.failed;

  // Adicionar à tabela de resultados:
  logTest(`│  Novo Feature                 ...
}
```

## 🎨 Funções de Ajuda Disponíveis

```javascript
import {
  createDriver, // Cria instância do driver Selenium
  quitDriver, // Fecha o driver
  getDriver, // Obtém o driver atual
} from "../utils/driver.js";

import {
  waitForElement, // Aguarda elemento estar presente
  waitForElementVisible, // Aguarda elemento ficar visível
  fillInput, // Preenche campo de input (com robustez)
  clickElement, // Clica em elemento
  getText, // Extrai texto
  waitForUrl, // Aguarda mudança de URL
  sleep, // Pausa
  logTest, // Logging colorido
  takeScreenshot, // Captura tela
} from "../utils/helpers.js";
```

## 🖼️ Screenshots

Screenshots de falhas são salvos em `FRONTEND/tests/screenshots/` com timestamp:

- `login-test1-falha-1764698596623.png`
- `projetos-criar-falha-1764698600123.png`

Use-os para debug de testes flaky.

## ⚙️ Modos de Execução

### Modo Interativo (headless = false)

Visualize o navegador executando os testes:

```javascript
// FRONTEND/tests/config.js
browserOptions: {
  headless: false,  // ← Ativa visualização
  windowSize: { width: 1920, height: 1080 }
}
```

Útil para:

- Debug
- Entender o fluxo do teste
- Validação manual rápida

### Modo Headless (headless = true)

Para CI/CD e execução sem GUI:

```javascript
browserOptions: {
  headless: true,  // ← Sem GUI
}
```

Útil para:

- Automação em CI
- Testes noturnos
- Reduzir overhead

## 🔍 Troubleshooting

### ❌ "ChromeDriver only supports Chrome version X"

**Solução:** Atualize o ChromeDriver para corresponder à versão do Chrome:

```bash
google-chrome --version  # ex: 131.0.6778.204
npm install --save-dev chromedriver@131
```

### ❌ "Elemento não encontrado"

**Causas possíveis:**

- Frontend não está rodando (`http://localhost:5173`)
- Seletor CSS está incorreto
- Elemento demora para carregar (timeout insuficiente)

**Solução:**

1. Verifique se frontend está rodando: `npm run dev` em Terminal 2
2. Valide seletor abrindo DevTools do navegador
3. Aumente `timeout` em `config.js` (padrão: 10000ms)

### ❌ "Credenciais inválidas"

**Solução:** Crie usuário de teste via backend:

```bash
cd BACKEND
npm run create:test-user  # ou script equivalente
```

Ou via Firebase Console: https://console.firebase.google.com

### ❌ Testes rodam mas falham aleatoriamente (flakiness)

**Causas:**

- Timeouts muito curtos
- Seletores ambíguos
- Estado do banco inconsistente

**Solução:**

1. Aumente timeouts: `timeout: 15000` em `config.js`
2. Use Page Objects para centralizar seletores
3. Implemente seed/teardown para estado limpo

## 📊 Interpretar Relatório

```
┌────────────────────────────────────────────────────────┐
│  SUITE DE TESTES              PASSOU    FALHOU   TOTAL │
├────────────────────────────────────────────────────────┤
│  Login                           5         0        5  │  ✅ Todos passaram
│  Dashboard                       3         0        3  │  ✅ Todos passaram
│  Alunos (CRUD)                   4         1        5  │  ⚠️  1 falhou
│  Projetos                        1         0        1  │  ✅ Passou
│  Tarefas                         1         0        1  │  ✅ Passou
├────────────────────────────────────────────────────────┤
│  TOTAL                          14         1       15  │  93.33% sucesso
└────────────────────────────────────────────────────────┘

🎯 Taxa de Sucesso: 93.33%
⚠️  1 teste(s) falharam. Verifique os screenshots para detalhes.
📸 Screenshots salvos em: tests/screenshots/
```

## 🚀 Próximos Passos

- [ ] Integrar com CI/CD (GitHub Actions)
- [ ] Implementar Page Object Model (POM) para refatoração
- [ ] Adicionar testes de Entregas e Relatórios
- [ ] Configurar relatórios HTML (Mochawesome/Allure)
- [ ] Implementar retry automático em testes flaky
- [ ] Documentar convenções de seletores CSS

## 📚 Referências

- [Selenium WebDriver (Node.js)](https://www.selenium.dev/documentation/webdriver/getting_started/)
- [Selenium By Locators](https://www.selenium.dev/documentation/webdriver/elements/locators/)
- [Wait Strategies](https://www.selenium.dev/documentation/webdriver/waits/)

---

**Dúvidas?** Consulte os testes existentes em `FRONTEND/tests/tests/` como referência.
