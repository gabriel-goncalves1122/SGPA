import { Router } from "express";
import { DataController } from "../controllers/dataController";

const router = Router();
const controller = new DataController();

router.get("/:tipo", (req, res) => controller.getData(req, res));

export default router;
