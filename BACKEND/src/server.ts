import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./config/firebase";
import authRoutes from "./routes/authRoutes";
import alunoRoutes from "./routes/alunoRoutes"; 

dotenv.config();

const app = express();

//  Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // frontend local
    credentials: true,
  })
);

app.use(express.json());

//  Rotas
app.use("/auth", authRoutes);
app.use("/alunos", alunoRoutes); 

//  Rota de teste para verificar conexão com Firebase
app.get("/", async (_, res) => {
  try {
    const projectId = admin.app().options.projectId;
    res.status(200).json({
      message: "🔥 SGPA Backend rodando com Firebase Admin!",
      firebaseProject: projectId,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao conectar com Firebase" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🚀`));
