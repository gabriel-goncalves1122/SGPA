import express from "express";
import {
  getProjetos,
  getProjetoById,
  addProjeto,
  updateProjeto,
  deleteProjeto,
} from "../controllers/projetoController";

const router = express.Router();

router.get("/", getProjetos);
router.get("/:id", getProjetoById);
router.post("/", addProjeto);
router.put("/:id", updateProjeto);
router.delete("/:id", deleteProjeto);

export default router;
