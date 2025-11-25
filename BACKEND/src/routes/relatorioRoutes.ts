import { Router } from "express";
import { relatorioAndamentoProjetos } from "../controllers/relatorioController";

const router = Router();

router.get("/projetos", relatorioAndamentoProjetos);

export default router;
