import express from "express";
import {
  getProfessores,
  getProfessorById,
  addProfessor,
  updateProfessor,
  deleteProfessor,
  getByName,
} from "../controllers/professorController";

const router = express.Router();

router.get("/", getProfessores);
router.get("/:id", getProfessorById);
router.get("/:nome", getByName); // ← nova rota
router.post("/", addProfessor);
router.put("/:id", updateProfessor);
router.delete("/:id", deleteProfessor);

export default router;
