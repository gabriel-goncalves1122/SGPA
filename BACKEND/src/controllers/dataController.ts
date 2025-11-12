import type { Request, Response } from "express";
import { DataRepository } from "../repositories/dataRepository";

const repository = new DataRepository();

export class DataController {
  async getData(req: Request, res: Response) {
    try {
      const { tipo } = req.params;

      if (tipo !== "alunos" && tipo !== "professores") {
        return res.status(400).json({ error: "Tipo inválido" });
      }

      const data = await repository.getCollection(tipo);
      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao obter dados do Firestore" });
    }
  }
}
