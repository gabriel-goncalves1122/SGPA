import admin from "../config/firebase";

const db = admin.firestore();

export class DataRepository {
  async getCollection(collectionName: string) {
    try {
      const snapshot = await db.collection(collectionName).get();
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return data;
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      throw new Error("Erro ao acessar o Firestore");
    }
  }
}
