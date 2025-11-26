import { Router } from "express";
import { getEntregas, getEntregaById, addEntrega, deleteEntrega } from "../controllers/entregaController";

const router = Router();

router.get("/", getEntregas);
router.get("/:id", getEntregaById);
router.post("/", addEntrega);
router.delete("/:id", deleteEntrega);

export default router;
