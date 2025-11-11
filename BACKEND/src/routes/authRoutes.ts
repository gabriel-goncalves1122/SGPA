import { Router } from "express";
import AuthController from "../controllers/authController";

const router = Router();

// Verificação de token (rota protegida)
router.get("/verify", AuthController.verifyUser);

export default router;
