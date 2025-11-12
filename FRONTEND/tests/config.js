// Configurações dos testes
export const config = {
  baseUrl: 'http://localhost:5173',
  backendUrl: 'http://localhost:3000',
  timeout: 10000,
  
  // Credenciais de teste (criar usuário manualmente antes)
  testUser: {
    email: 'teste@selenium.com',
    password: 'teste123456'
  },
  
  // Dados de teste para alunos
  testAluno: {
    nome: 'João Selenium Silva',
    matricula: 'SEL2025001',
    email: 'joao.selenium@universidade.edu.br',
    curso: 'Engenharia de Software',
    telefone: '(11) 98765-4321'
  },
  
  testAlunoEdit: {
    nome: 'João Selenium Silva Editado',
    matricula: 'SEL2025001',
    email: 'joao.editado@universidade.edu.br',
    curso: 'Ciência da Computação',
    telefone: '(11) 99999-9999'
  },
  
  // Configurações do WebDriver
  browserOptions: {
    headless: false, // Mude para true para rodar sem abrir navegador
    windowSize: { width: 1920, height: 1080 }
  }
};
