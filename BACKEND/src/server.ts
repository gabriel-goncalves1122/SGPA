import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import admin from "./config/firebase";
import authRoutes from "./routes/authRoutes";
import dataRoutes from "./routes/dataRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// rotas
app.use("/auth", authRoutes);
app.use("/data", dataRoutes);

// teste de conexão
app.get("/", (_, res) => {
  const projectId = admin.app().options.projectId;
  res.json({
    message: "🔥 SGPA Backend rodando com Firebase!",
    firebaseProject: projectId,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
