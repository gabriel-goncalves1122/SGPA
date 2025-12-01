/**
 * Script de seed com dados mockados para testes locais
 * Use este script quando o Firebase não está disponível
 */

const dados = {
  alunos: [
    { id: "aluno1", nome: "Ana Silva", matricula: "20240001", email: "ana.silva@unifei.edu.br", curso: "Engenharia de Computação", telefone: "(35) 99911-2233" },
    { id: "aluno2", nome: "Carlos Oliveira", matricula: "20240002", email: "carlos.oliveira@unifei.edu.br", curso: "Engenharia Elétrica", telefone: "(35) 98822-3344" },
    { id: "aluno3", nome: "Mariana Costa", matricula: "20240003", email: "mariana.costa@unifei.edu.br", curso: "Engenharia Mecânica", telefone: "(35) 97733-4455" },
    { id: "aluno4", nome: "João Santos", matricula: "20240004", email: "joao.santos@unifei.edu.br", curso: "Engenharia de Produção", telefone: "(35) 96644-5566" },
    { id: "aluno5", nome: "Juliana Pereira", matricula: "20240005", email: "juliana.pereira@unifei.edu.br", curso: "Ciência da Computação", telefone: "(35) 95555-6677" },
    { id: "aluno6", nome: "Ricardo Almeida", matricula: "20240006", email: "ricardo.almeida@unifei.edu.br", curso: "Engenharia Civil", telefone: "(35) 94466-7788" },
    { id: "aluno7", nome: "Fernanda Lima", matricula: "20240007", email: "fernanda.lima@unifei.edu.br", curso: "Engenharia de Software", telefone: "(35) 93377-8899" },
    { id: "aluno8", nome: "Pedro Henrique", matricula: "20240008", email: "pedro.henrique@unifei.edu.br", curso: "Engenharia Química", telefone: "(35) 92288-9900" },
    { id: "aluno9", nome: "Amanda Rodrigues", matricula: "20240009", email: "amanda.rodrigues@unifei.edu.br", curso: "Engenharia de Controle e Automação", telefone: "(35) 91199-0011" },
    { id: "aluno10", nome: "Lucas Martins", matricula: "20240010", email: "lucas.martins@unifei.edu.br", curso: "Engenharia de Materiais", telefone: "(35) 90011-1122" },
  ],
  
  professores: [
    { id: "prof1", nome: "Dr. Roberto Alves", siape: "123456", email: "roberto.alves@unifei.edu.br", departamento: "Departamento de Computação" },
    { id: "prof2", nome: "Dra. Maria Fernandes", siape: "234567", email: "maria.fernandes@unifei.edu.br", departamento: "Departamento de Elétrica" },
    { id: "prof3", nome: "Dr. Paulo Mendes", siape: "345678", email: "paulo.mendes@unifei.edu.br", departamento: "Departamento de Mecânica" },
    { id: "prof4", nome: "Dra. Claudia Santos", siape: "456789", email: "claudia.santos@unifei.edu.br", departamento: "Departamento de Produção" },
    { id: "prof5", nome: "Dr. Antonio Costa", siape: "567890", email: "antonio.costa@unifei.edu.br", departamento: "Departamento de Química" },
  ],
  
  projetos: [
    {
      id: "proj1",
      titulo: "App de Gestão Acadêmica",
      descricao: "Aplicação para gerenciar projetos acadêmicos",
      orientador: "prof1",
      status: "Ativo",
      alunos: ["aluno1", "aluno2", "aluno3"],
      dataInicio: "2024-01-01",
      dataFim: "2024-06-30",
    },
    {
      id: "proj2",
      titulo: "Sistema de Monitoramento Elétrico",
      descricao: "Sistema IoT para monitorar consumo de energia",
      orientador: "prof2",
      status: "Ativo",
      alunos: ["aluno4", "aluno5"],
      dataInicio: "2024-02-01",
      dataFim: "2024-08-31",
    },
    {
      id: "proj3",
      titulo: "Análise Estrutural Automatizada",
      descricao: "Software para análise estrutural usando ML",
      orientador: "prof3",
      status: "Concluído",
      alunos: ["aluno6", "aluno7"],
      dataInicio: "2023-09-01",
      dataFim: "2024-05-31",
    },
    {
      id: "proj4",
      titulo: "Otimização de Processos Produtivos",
      descricao: "Aplicação para otimizar processos em fábricas",
      orientador: "prof4",
      status: "Ativo",
      alunos: ["aluno8", "aluno9", "aluno10"],
      dataInicio: "2024-03-15",
      dataFim: "2024-10-15",
    },
    {
      id: "proj5",
      titulo: "Tratamento de Efluentes com IA",
      descricao: "Sistema inteligente para tratamento de efluentes",
      orientador: "prof5",
      status: "Pausado",
      alunos: ["aluno2", "aluno4"],
      dataInicio: "2024-01-10",
      dataFim: "2024-09-10",
    },
  ],
  
  tarefas: [
    // Tarefas do Projeto 1
    { id: "tar1", titulo: "Planejamento do projeto", status: "Concluída", idProjeto: "proj1" },
    { id: "tar2", titulo: "Design do banco de dados", status: "Concluída", idProjeto: "proj1" },
    { id: "tar3", titulo: "Desenvolvimento do backend", status: "Em Progresso", idProjeto: "proj1" },
    { id: "tar4", titulo: "Desenvolvimento do frontend", status: "Em Progresso", idProjeto: "proj1" },
    { id: "tar5", titulo: "Testes unitários", status: "Não Iniciada", idProjeto: "proj1" },
    
    // Tarefas do Projeto 2
    { id: "tar6", titulo: "Especificação de hardware", status: "Concluída", idProjeto: "proj2" },
    { id: "tar7", titulo: "Desenvolvimento de firmware", status: "Em Progresso", idProjeto: "proj2" },
    { id: "tar8", titulo: "Integração com plataforma IoT", status: "Não Iniciada", idProjeto: "proj2" },
    { id: "tar9", titulo: "Testes de campo", status: "Não Iniciada", idProjeto: "proj2" },
    
    // Tarefas do Projeto 3
    { id: "tar10", titulo: "Pesquisa de algoritmos", status: "Concluída", idProjeto: "proj3" },
    { id: "tar11", titulo: "Implementação do modelo ML", status: "Concluída", idProjeto: "proj3" },
    { id: "tar12", titulo: "Validação dos resultados", status: "Concluída", idProjeto: "proj3" },
    { id: "tar13", titulo: "Documentação final", status: "Concluída", idProjeto: "proj3" },
    
    // Tarefas do Projeto 4
    { id: "tar14", titulo: "Análise de processos", status: "Concluída", idProjeto: "proj4" },
    { id: "tar15", titulo: "Modelagem de sistemas", status: "Em Progresso", idProjeto: "proj4" },
    { id: "tar16", titulo: "Implementação de algoritmos", status: "Em Progresso", idProjeto: "proj4" },
    { id: "tar17", titulo: "Testes de otimização", status: "Não Iniciada", idProjeto: "proj4" },
    { id: "tar18", titulo: "Deploy em produção", status: "Não Iniciada", idProjeto: "proj4" },
    
    // Tarefas do Projeto 5
    { id: "tar19", titulo: "Levantamento de requisitos", status: "Concluída", idProjeto: "proj5" },
    { id: "tar20", titulo: "Desenvolvimento do sistema", status: "Em Progresso", idProjeto: "proj5" },
    { id: "tar21", titulo: "Testes de eficiência", status: "Não Iniciada", idProjeto: "proj5" },
  ],
};

console.log("\n📊 Dados Mockados para Teste do RF13\n");
console.log("✅ Alunos:", dados.alunos.length);
console.log("✅ Professores:", dados.professores.length);
console.log("✅ Projetos:", dados.projetos.length);
console.log("✅ Tarefas:", dados.tarefas.length);

console.log("\n📋 Projetos com Relatório de Andamento:\n");

// Simular o RF13
dados.projetos.forEach((projeto) => {
  const professor = dados.professores.find((p) => p.id === projeto.orientador);
  const numAlunos = projeto.alunos.length;
  const tarefas = dados.tarefas.filter((t) => t.idProjeto === projeto.id);
  const tarefasConcluidas = tarefas.filter((t) => t.status === "Concluída").length;
  const percentConcluidas = tarefas.length > 0 ? Math.round((tarefasConcluidas / tarefas.length) * 100) : 0;

  console.log(`${projeto.titulo}`);
  console.log(`  Orientador: ${professor?.nome || "Desconhecido"}`);
  console.log(`  % Tarefas Concluídas: ${percentConcluidas}%`);
  console.log(`  Número de Alunos: ${numAlunos}`);
  console.log("");
});

console.log("🎉 Dados mockados prontos! Use este arquivo como referência.\n");
