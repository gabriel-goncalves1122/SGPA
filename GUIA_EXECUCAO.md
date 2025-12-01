# 🚀 Guia de Execução - SGPA

Este guia te mostra como rodar o projeto SGPA (Sistema de Gerenciamento de Projetos Acadêmicos) localmente para testes.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior): [Download](https://nodejs.org/)
- **npm** (geralmente vem com Node.js)
- **Git** (para clonar o projeto)

Verifique as versões instaladas:
```bash
node --version
npm --version
```

## 📁 Estrutura do Projeto

O projeto tem duas partes principais:

```
SGPA/
├── BACKEND/    # API Express com TypeScript
└── FRONTEND/   # Interface React com TypeScript
```

---

## 🔧 1. Configurar o Backend

### Passo 1: Navegar para a pasta do backend

```bash
cd BACKEND
```

### Passo 2: Instalar as dependências

```bash
npm install
```

### Passo 3: Configurar variáveis de ambiente (se necessário)

Se precisar de um arquivo `.env`, você pode criar na raiz da pasta `BACKEND`:

```bash
# Exemplo de .env (opcional)
PORT=3000
```

### Passo 4: Rodar o backend em desenvolvimento

```bash
npm run dev
```

**Esperado:** O servidor vai iniciar na porta `3000` e você verá uma mensagem como:
```
Servidor rodando na porta 3000 🚀
```

**Endpoints disponíveis:**
- `GET http://localhost:3000/` - Teste de conexão com Firebase
- `GET http://localhost:3000/relatorios/projetos` - RF13 (Relatório de Andamento) ⭐

---

## 🎨 2. Configurar o Frontend

Em outro terminal:

### Passo 1: Navegar para a pasta do frontend

```bash
cd FRONTEND
```

### Passo 2: Instalar as dependências

```bash
npm install
```

### Passo 3: Rodar o frontend em desenvolvimento

```bash
npm run dev
```

**Esperado:** O servidor vai iniciar na porta `5173` e você verá uma mensagem como:
```
  VITE v5.4.21  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

## 🌐 3. Acessar a Aplicação

Abra seu navegador e acesse:

```
http://localhost:5173/
```

Você verá a interface do SGPA!

---

## 🧪 4. Testar o RF13 (Relatório de Andamento de Projetos)

### Opção A: Testar via Frontend

1. Acesse `http://localhost:5173/relatorios`
2. Use os filtros disponíveis (Orientador, Status, Curso)
3. Veja a tabela com o relatório de projetos

### Opção B: Testar via Backend (Script)

No terminal do backend, execute:

```bash
npm run test:rf13
```

Este comando vai:
- Conectar ao Firebase
- Buscar todos os projetos e tarefas
- Calcular o percentual de conclusão
- Exibir um relatório em tabela

### Opção C: Testar via API diretamente

Use curl ou Postman:

```bash
# Sem filtros
curl http://localhost:3000/relatorios/projetos

# Com filtros
curl "http://localhost:3000/relatorios/projetos?status=Ativo"
```

---

## 📦 Outros Comandos Úteis

### Backend

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Iniciar servidor compilado
npm start

# Rodar linter
npm run lint

# Testar Firebase
npm run test:firebase

# Criar usuário de teste
npm run create:test-user

# Testar RF13
npm run test:rf13
```

### Frontend

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Rodar linter
npm run lint
```

---

## 🔗 Portas Utilizadas

- **Backend**: `http://localhost:3000`
- **Frontend**: `http://localhost:5173`

> ⚠️ Se essas portas estiverem ocupadas, você pode mudar no arquivo `vite.config.ts` (frontend) ou nas variáveis de ambiente.

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'firebase-admin'"

**Solução:** Execute `npm install` na pasta `BACKEND`

### Erro: "Port 3000 is already in use"

**Solução:** Mude a porta no arquivo `.env` ou feche o processo que está usando a porta:

```bash
# No Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# No bash (Linux/Mac)
lsof -ti:3000 | xargs kill -9
```

### Erro: "CORS error"

**Verificar:** Certifique-se de que o backend está rodando em `http://localhost:3000` e que a origem no CORS permite `http://localhost:5173`

### Erro: "Firebase credentials not found"

**Solução:** Verifique se o arquivo de credenciais do Firebase está no caminho correto em `BACKEND/src/config/firebase.ts`

---

## 📊 Testando o RF13 em Detalhes

O RF13 (Consultar Relatório de Andamento de Projetos) retorna:

```json
[
  {
    "id": "proj_001",
    "projeto": "App Mobile",
    "orientador": "Prof. João Silva",
    "% tarefas concluídas": 75,
    "número de alunos": 4
  }
]
```

**Filtros disponíveis:**
- `orientador` - ID do professor orientador
- `status` - Status do projeto (Ativo, Concluído, Pausado)
- `curso` - Nome do curso dos alunos

---

## ✅ Checklist de Testes

- [ ] Backend rodando em `localhost:3000`
- [ ] Frontend rodando em `localhost:5173`
- [ ] Página de relatórios carregando
- [ ] Filtros funcionando
- [ ] Tabela exibindo dados
- [ ] Barras de progresso visíveis

---

## 💡 Próximos Passos

1. **Explorar a Interface:** Navegue pelos diferentes módulos (Alunos, Projetos, Tarefas, etc.)
2. **Testar Autenticação:** Faça login com suas credenciais Firebase
3. **Testar RF13:** Use o relatório de andamento com diferentes filtros
4. **Desenvolvimento:** Faça suas próprias alterações e veja o hot reload

---

## 📞 Suporte

Se encontrar problemas, verifique:
- Se Node.js está instalado corretamente
- Se as dependências estão instaladas (`npm install`)
- Se o Firebase está configurado corretamente
- Os logs do console (F12 no navegador)
- Os logs do terminal do backend

---

**Bom desenvolvimento! 🎉**
