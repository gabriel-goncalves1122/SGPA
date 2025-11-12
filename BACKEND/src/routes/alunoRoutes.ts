import express from "express";
import {
  getAlunos,
  addAluno,
  updateAluno,
  deleteAluno,
} from "../controllers/alunoController";

const router = express.Router();

router.get("/", getAlunos);       // Listar
router.post("/", addAluno);       // Adicionar
router.put("/:id", updateAluno);  // Alterar
router.delete("/:id", deleteAluno); // Excluir

export default router;
