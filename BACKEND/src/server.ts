import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./config/firebase";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/auth", authRoutes);

app.get("/", async (_, res) => {
  try {
    const projectId = admin.app().options.projectId;
    res.status(200).json({
      message: "🔥 SGPA Backend rodando com Firebase Admin!",
      firebaseProject: projectId,
    });
  } catch {
    res.status(500).json({ error: "Erro ao conectar com Firebase" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT} 🚀`));
