import admin from "../config/firebase";

class AuthService {
  async verifyToken(idToken: string) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      throw new Error("Token inválido ou expirado");
    }
  }
}

export default new AuthService();
