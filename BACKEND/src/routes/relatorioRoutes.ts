import { Router } from "express";
import { relatorioAndamentoProjetos } from "../controllers/relatorioController";
import { authenticateUser } from "../middlewares/authMiddleware";

const router = Router();

// RF13: Consultar Relatório de Andamento de Projetos
// Atores: Administrador, Professor
router.get("/projetos", authenticateUser, relatorioAndamentoProjetos);

export default router;
