import express from "express";
import { addVinculo, getVinculos, deleteVinculo } from "../controllers/equipesController";

const router = express.Router();

router.get("/", getVinculos);
router.post("/", addVinculo);
router.delete("/:id", deleteVinculo);

export default router;
