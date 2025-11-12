// src/routes/alunoRoutes.ts
import express from "express";
import {
  incluirAluno,
  alterarAluno,
  consultarAlunos,
  consultarAlunoPorId,
  excluirAluno,
} from "../controllers/alunoController";

const router = express.Router();

// Cria /alunos
router.post("/", incluirAluno);        // Incluir (RF01)
router.get("/", consultarAlunos);      // Consultar todos (RF03)
router.get("/:id", consultarAlunoPorId); // Consultar por id (RF03 - individual)
router.put("/:id", alterarAluno);      // Alterar (RF02)
router.delete("/:id", excluirAluno);   // Excluir (RF04)

export default router;
