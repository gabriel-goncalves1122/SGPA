import type { Request, Response } from "express";
import AuthService from "../services/authServices";

class AuthController {
  async verifyUser(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = await AuthService.verifyToken(token);

      res
        .status(200)
        .json({ message: "Usuário autenticado com sucesso!", user: decoded });
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }
}

export default new AuthController();
