import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { firebaseConfig } from "../services/firebaseConfig";

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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
    console.log("🚀 Iniciando população do banco de dados...");

    // Adicionar alunos
    console.log("📚 Adicionando alunos...");
    for (const aluno of alunos) {
      await addDoc(collection(db, "alunos"), aluno);
      console.log(`✅ Aluno ${aluno.nome} adicionado`);
    }

    // Adicionar professores
    console.log("👨‍🏫 Adicionando professores...");
    for (const professor of professores) {
      await addDoc(collection(db, "professores"), professor);
      console.log(`✅ Professor ${professor.nome} adicionado`);
    }

    console.log("🎉 População do banco concluída com sucesso!");
    console.log(`📊 ${alunos.length} alunos adicionados`);
    console.log(`📊 ${professores.length} professores adicionados`);
  } catch (error) {
    console.error("❌ Erro ao popular o banco:", error);
  }
}

// Executar a população
popularBanco();
