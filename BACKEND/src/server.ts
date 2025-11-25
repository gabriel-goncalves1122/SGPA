import "dotenv/config";
import express from "express";
import cors from "cors";
import admin from "./config/firebase";
import authRoutes from "./routes/authRoutes";
import alunoRoutes from "./routes/alunoRoutes"; // 👈 adicionamos aqui
import professorRoutes from "./routes/professorRoutes";
import projetoRoutes from "./routes/projetoRoutes";
import equipesRoutes from "./routes/equipesRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Rotas
app.use("/auth", authRoutes);
app.use("/alunos", alunoRoutes); // 👈 adicionamos aqui
app.use("/professores", professorRoutes);
app.use("/projetos", projetoRoutes);
app.use("/equipes", equipesRoutes);

// Rota principal de teste
app.get("/", async (_, res) => {
  try {
    const projectId = admin.app().options.projectId;
    res.status(200).json({
      message: "🔥 SGPA Backend rodando com Firebase Admin!",
      firebaseProject: projectId,
    });
  } catch (error) {
    console.error("Erro ao conectar com Firebase:", error);
    res.status(500).json({ error: "Erro ao conectar com Firebase" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🚀`));
