import express from "express";
import {
  getProfessores,
  getProfessorById,
  addProfessor,
  updateProfessor,
  deleteProfessor,
} from "../controllers/professorController";

const router = express.Router();

router.get("/", getProfessores);
router.get("/:id", getProfessorById);
router.post("/", addProfessor);
router.put("/:id", updateProfessor);
router.delete("/:id", deleteProfessor);

export default router;
