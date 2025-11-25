import { Router } from "express";
import { getTarefas, getTarefaById, addTarefa, updateTarefa, deleteTarefa } from "../controllers/tarefaController";

const router = Router();

router.get("/", getTarefas);
router.get("/:id", getTarefaById);
router.post("/", addTarefa);
router.put("/:id", updateTarefa);
router.delete("/:id", deleteTarefa);

export default router;
