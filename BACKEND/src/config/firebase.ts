// src/config/firebase.ts
import * as admin from "firebase-admin";

// Carrega o arquivo JSON diretamente
import serviceAccount from "./serviceAccountKey.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

console.log("🔥 Firebase Admin inicializado com sucesso!");
export default admin;
