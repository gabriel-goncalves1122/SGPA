#!/bin/bash

# Script de verificação de pré-requisitos para E2E tests
# Uso: bash FRONTEND/tests/check-env.sh

echo "╔════════════════════════════════════════════════════════╗"
echo "║          🔍 VERIFICAÇÃO DE PRÉ-REQUISITOS 🔍         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Função para verificar
check() {
  if eval "$1" &> /dev/null; then
    echo -e "${GREEN}✅${NC} $2"
    return 0
  else
    echo -e "${RED}❌${NC} $2"
    return 1
  fi
}

# Variáveis de controle
ERRORS=0

echo "📋 Dependências do Sistema:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Node.js
if check "command -v node" "Node.js instalado"; then
  NODE_VERSION=$(node --version)
  echo "   └─ Versão: $NODE_VERSION"
else
  echo "   └─ ⚠️  Instale Node.js 18.19.1+: https://nodejs.org"
  ((ERRORS++))
fi

# npm
if check "command -v npm" "npm instalado"; then
  NPM_VERSION=$(npm --version)
  echo "   └─ Versão: $NPM_VERSION"
else
  echo "   └─ npm deveria estar disponível com Node.js"
  ((ERRORS++))
fi

# Chrome
if check "command -v google-chrome" "Google Chrome instalado"; then
  CHROME_VERSION=$(google-chrome --version | awk '{print $3}')
  echo "   └─ Versão: $CHROME_VERSION"
  MAJOR_VERSION=$(echo $CHROME_VERSION | cut -d. -f1)
  echo "   └─ ChromeDriver esperado: versão $MAJOR_VERSION"
else
  echo "   └─ ⚠️  Instale Google Chrome: https://www.google.com/chrome"
  ((ERRORS++))
fi

echo ""
echo "📦 Dependências de Teste:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar se estamos em FRONTEND
if [ ! -f "package.json" ]; then
  echo -e "${YELLOW}⚠️  Execute este script a partir de FRONTEND/${NC}"
  exit 1
fi

# selenium-webdriver
if check "npm list selenium-webdriver 2>/dev/null | grep -q selenium-webdriver" "selenium-webdriver instalado"; then
  SELENIUM_VERSION=$(npm list selenium-webdriver 2>/dev/null | grep selenium-webdriver | head -1 | awk '{print $2}')
  echo "   └─ Versão: $SELENIUM_VERSION"
else
  echo "   └─ Execute: npm install --save-dev selenium-webdriver"
  ((ERRORS++))
fi

# chromedriver
if check "npm list chromedriver 2>/dev/null | grep -q chromedriver" "chromedriver instalado"; then
  CHROMEDRIVER_VERSION=$(npm list chromedriver 2>/dev/null | grep chromedriver | head -1 | awk '{print $2}')
  echo "   └─ Versão: $CHROMEDRIVER_VERSION"
else
  echo "   └─ Execute: npm install --save-dev chromedriver"
  ((ERRORS++))
fi

# mocha
if check "npm list mocha 2>/dev/null | grep -q mocha" "mocha instalado"; then
  MOCHA_VERSION=$(npm list mocha 2>/dev/null | grep mocha | head -1 | awk '{print $2}')
  echo "   └─ Versão: $MOCHA_VERSION"
else
  echo "   └─ Execute: npm install --save-dev mocha"
  ((ERRORS++))
fi

echo ""
echo "🌐 Serviços Esperados:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backend
if timeout 2 curl -s http://localhost:3000 &>/dev/null; then
  echo -e "${GREEN}✅${NC} Backend (http://localhost:3000) está rodando"
else
  echo -e "${YELLOW}⚠️${NC} Backend NÃO detectado em http://localhost:3000"
  echo "   Execute em outro terminal: cd BACKEND && npm run dev"
fi

# Frontend
if timeout 2 curl -s http://localhost:5173 &>/dev/null; then
  echo -e "${GREEN}✅${NC} Frontend (http://localhost:5173) está rodando"
else
  echo -e "${YELLOW}⚠️${NC} Frontend NÃO detectado em http://localhost:5173"
  echo "   Execute em outro terminal: cd FRONTEND && npm run dev"
fi

echo ""
echo "📁 Arquivos de Teste:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

check "[ -f tests/config.js ]" "tests/config.js existente"
check "[ -f tests/test-runner.js ]" "tests/test-runner.js existente"
check "[ -f tests/utils/driver.js ]" "tests/utils/driver.js existente"
check "[ -f tests/utils/helpers.js ]" "tests/utils/helpers.js existente"
check "[ -f tests/tests/login.test.js ]" "tests/tests/login.test.js existente"
check "[ -f tests/tests/projetos.test.js ]" "tests/tests/projetos.test.js existente"
check "[ -f tests/tests/tarefas.test.js ]" "tests/tests/tarefas.test.js existente"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ Tudo ok! Você pode rodar: npm run test:e2e${NC}"
  exit 0
else
  echo -e "${RED}❌ $ERRORS problema(s) encontrado(s)${NC}"
  echo ""
  echo "Próximos passos:"
  echo "1. Instale Node.js/npm se necessário"
  echo "2. Instale Chrome/Chromium"
  echo "3. Execute em FRONTEND: npm install --save-dev selenium-webdriver chromedriver mocha"
  echo "4. Inicie BACKEND: cd BACKEND && npm run dev"
  echo "5. Inicie FRONTEND: cd FRONTEND && npm run dev"
  echo "6. Em novo terminal, execute: npm --prefix FRONTEND run test:e2e"
  exit 1
fi
