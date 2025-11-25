import { Router } from "express";
import { addUsuario, getUsuarios, getUsuarioById, deleteUsuario } from "../controllers/usuarioController";

const router = Router();

router.post("/", addUsuario);
router.get("/", getUsuarios);
router.get("/:id", getUsuarioById);
router.delete("/:id", deleteUsuario);

export default router;
