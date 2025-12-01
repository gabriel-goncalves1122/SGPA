import "dotenv/config";
import admin from "../config/firebase";

const db = admin.firestore();

// Dados dos Alunos
const alunos = [
  {
    nome: "Ana Silva",
    matricula: "20240001",
    email: "ana.silva@unifei.edu.br",
    curso: "Engenharia de Computação",
    telefone: "(35) 99911-2233",
    createdAt: new Date(),
  },
  {
    nome: "Carlos Oliveira",
    matricula: "20240002",
    email: "carlos.oliveira@unifei.edu.br",
    curso: "Engenharia Elétrica",
    telefone: "(35) 98822-3344",
    createdAt: new Date(),
  },
  {
    nome: "Mariana Costa",
    matricula: "20240003",
    email: "mariana.costa@unifei.edu.br",
    curso: "Engenharia Mecânica",
    telefone: "(35) 97733-4455",
    createdAt: new Date(),
  },
  {
    nome: "João Santos",
    matricula: "20240004",
    email: "joao.santos@unifei.edu.br",
    curso: "Engenharia de Produção",
    telefone: "(35) 96644-5566",
    createdAt: new Date(),
  },
  {
    nome: "Juliana Pereira",
    matricula: "20240005",
    email: "juliana.pereira@unifei.edu.br",
    curso: "Ciência da Computação",
    telefone: "(35) 95555-6677",
    createdAt: new Date(),
  },
  {
    nome: "Ricardo Almeida",
    matricula: "20240006",
    email: "ricardo.almeida@unifei.edu.br",
    curso: "Engenharia Civil",
    telefone: "(35) 94466-7788",
    createdAt: new Date(),
  },
  {
    nome: "Fernanda Lima",
    matricula: "20240007",
    email: "fernanda.lima@unifei.edu.br",
    curso: "Engenharia de Software",
    telefone: "(35) 93377-8899",
    createdAt: new Date(),
  },
  {
    nome: "Pedro Henrique",
    matricula: "20240008",
    email: "pedro.henrique@unifei.edu.br",
    curso: "Engenharia Química",
    telefone: "(35) 92288-9900",
    createdAt: new Date(),
  },
  {
    nome: "Amanda Rodrigues",
    matricula: "20240009",
    email: "amanda.rodrigues@unifei.edu.br",
    curso: "Engenharia de Controle e Automação",
    telefone: "(35) 91199-0011",
    createdAt: new Date(),
  },
  {
    nome: "Lucas Martins",
    matricula: "20240010",
    email: "lucas.martins@unifei.edu.br",
    curso: "Engenharia de Materiais",
    telefone: "(35) 90011-1122",
    createdAt: new Date(),
  },
];

// Dados dos Professores
const professores = [
  {
    nome: "Dr. Roberto Alves",
    siape: "123456",
    email: "roberto.alves@unifei.edu.br",
    departamento: "Departamento de Computação",
    createdAt: new Date(),
  },
  {
    nome: "Dra. Maria Fernandes",
    siape: "234567",
    email: "maria.fernandes@unifei.edu.br",
    departamento: "Departamento de Elétrica",
    createdAt: new Date(),
  },
  {
    nome: "Dr. Paulo Mendes",
    siape: "345678",
    email: "paulo.mendes@unifei.edu.br",
    departamento: "Departamento de Mecânica",
    createdAt: new Date(),
  },
  {
    nome: "Dra. Claudia Santos",
    siape: "456789",
    email: "claudia.santos@unifei.edu.br",
    departamento: "Departamento de Produção",
    createdAt: new Date(),
  },
  {
    nome: "Dr. Antonio Costa",
    siape: "567890",
    email: "antonio.costa@unifei.edu.br",
    departamento: "Departamento de Química",
    createdAt: new Date(),
  },
];

// Função para popular o banco
async function popularBanco() {
  try {
    console.log("\n🚀 Iniciando população do banco de dados...\n");

    // Limpar dados antigos (opcional - comentar se não quiser)
    // console.log("🗑️  Limpando dados antigos...");
    // const alunosSnap = await db.collection("alunos").get();
    // for (const doc of alunosSnap.docs) {
    //   await doc.ref.delete();
    // }
    // const professoresSnap = await db.collection("professores").get();
    // for (const doc of professoresSnap.docs) {
    //   await doc.ref.delete();
    // }

    // Adicionar alunos
    console.log("📚 Adicionando alunos...");
    const alunoRefs: string[] = [];
    for (const aluno of alunos) {
      const doc = await db.collection("alunos").add(aluno);
      alunoRefs.push(doc.id);
      console.log(`   ✅ ${aluno.nome}`);
    }

    // Adicionar professores
    console.log("\n👨‍🏫 Adicionando professores...");
    const professorRefs: string[] = [];
    for (const professor of professores) {
      const doc = await db.collection("professores").add(professor);
      professorRefs.push(doc.id);
      console.log(`   ✅ ${professor.nome}`);
    }

    // Adicionar projetos com alunos e professores
    console.log("\n📋 Adicionando projetos...");
    const projetos = [
      {
        titulo: "App de Gestão Acadêmica",
        descricao: "Aplicação para gerenciar projetos acadêmicos",
        orientador: professorRefs[0], // Dr. Roberto Alves
        dataInicio: new Date("2024-01-01"),
        dataFim: new Date("2024-06-30"),
        status: "Ativo",
        alunos: [alunoRefs[0], alunoRefs[1], alunoRefs[2]], // Ana, Carlos, Mariana
        createdAt: new Date(),
      },
      {
        titulo: "Sistema de Monitoramento Elétrico",
        descricao: "Sistema IoT para monitorar consumo de energia",
        orientador: professorRefs[1], // Dra. Maria Fernandes
        dataInicio: new Date("2024-02-01"),
        dataFim: new Date("2024-08-31"),
        status: "Ativo",
        alunos: [alunoRefs[3], alunoRefs[4]], // João, Juliana
        createdAt: new Date(),
      },
      {
        titulo: "Análise Estrutural Automatizada",
        descricao: "Software para análise estrutural usando ML",
        orientador: professorRefs[2], // Dr. Paulo Mendes
        dataInicio: new Date("2023-09-01"),
        dataFim: new Date("2024-05-31"),
        status: "Concluído",
        alunos: [alunoRefs[5], alunoRefs[6]], // Ricardo, Fernanda
        createdAt: new Date(),
      },
      {
        titulo: "Otimização de Processos Produtivos",
        descricao: "Aplicação para otimizar processos em fábricas",
        orientador: professorRefs[3], // Dra. Claudia Santos
        dataInicio: new Date("2024-03-15"),
        dataFim: new Date("2024-10-15"),
        status: "Ativo",
        alunos: [alunoRefs[7], alunoRefs[8], alunoRefs[9]], // Pedro, Amanda, Lucas
        createdAt: new Date(),
      },
      {
        titulo: "Tratamento de Efluentes com IA",
        descricao: "Sistema inteligente para tratamento de efluentes",
        orientador: professorRefs[4], // Dr. Antonio Costa
        dataInicio: new Date("2024-01-10"),
        dataFim: new Date("2024-09-10"),
        status: "Pausado",
        alunos: [alunoRefs[1], alunoRefs[3]], // Carlos, João
        createdAt: new Date(),
      },
    ];

    const projetoRefs: string[] = [];
    for (const projeto of projetos) {
      const doc = await db.collection("projetos").add(projeto);
      projetoRefs.push(doc.id);
      console.log(`   ✅ ${projeto.titulo}`);
    }

    // Adicionar tarefas para cada projeto
    console.log("\n✅ Adicionando tarefas...");
    const tarefasConfig = [
      {
        projetoIdx: 0,
        tarefas: [
          { titulo: "Planejamento do projeto", status: "Concluída" },
          { titulo: "Design do banco de dados", status: "Concluída" },
          { titulo: "Desenvolvimento do backend", status: "Em Progresso" },
          { titulo: "Desenvolvimento do frontend", status: "Em Progresso" },
          { titulo: "Testes unitários", status: "Não Iniciada" },
        ],
      },
      {
        projetoIdx: 1,
        tarefas: [
          { titulo: "Especificação de hardware", status: "Concluída" },
          { titulo: "Desenvolvimento de firmware", status: "Em Progresso" },
          { titulo: "Integração com plataforma IoT", status: "Não Iniciada" },
          { titulo: "Testes de campo", status: "Não Iniciada" },
        ],
      },
      {
        projetoIdx: 2,
        tarefas: [
          { titulo: "Pesquisa de algoritmos", status: "Concluída" },
          { titulo: "Implementação do modelo ML", status: "Concluída" },
          { titulo: "Validação dos resultados", status: "Concluída" },
          { titulo: "Documentação final", status: "Concluída" },
        ],
      },
      {
        projetoIdx: 3,
        tarefas: [
          { titulo: "Análise de processos", status: "Concluída" },
          { titulo: "Modelagem de sistemas", status: "Em Progresso" },
          { titulo: "Implementação de algoritmos", status: "Em Progresso" },
          { titulo: "Testes de otimização", status: "Não Iniciada" },
          { titulo: "Deploy em produção", status: "Não Iniciada" },
        ],
      },
      {
        projetoIdx: 4,
        tarefas: [
          { titulo: "Levantamento de requisitos", status: "Concluída" },
          { titulo: "Desenvolvimento do sistema", status: "Em Progresso" },
          { titulo: "Testes de eficiência", status: "Não Iniciada" },
        ],
      },
    ];

    for (const config of tarefasConfig) {
      for (const tarefa of config.tarefas) {
        await db.collection("tarefas").add({
          titulo: tarefa.titulo,
          descricao: `Tarefa: ${tarefa.titulo}`,
          idProjeto: projetoRefs[config.projetoIdx],
          status: tarefa.status,
          createdAt: new Date(),
        });
      }
      console.log(`   ✅ ${config.tarefas.length} tarefas adicionadas ao projeto ${config.projetoIdx + 1}`);
    }

    console.log("\n🎉 População do banco concluída com sucesso!");
    console.log(`📊 ${alunos.length} alunos adicionados`);
    console.log(`📊 ${professores.length} professores adicionados`);
    console.log(`📊 ${projetos.length} projetos adicionados`);
    console.log(`📊 ${tarefasConfig.reduce((acc, c) => acc + c.tarefas.length, 0)} tarefas adicionadas\n`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Erro ao popular o banco:", error);
    process.exit(1);
  }
}

// Executar a população
popularBanco();
