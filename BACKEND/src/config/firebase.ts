import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

// 1. Carrega as variáveis do arquivo .env
dotenv.config();

// 2. Verifica se a variável existe
const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountRaw) {
  throw new Error("❌ A variável FIREBASE_SERVICE_ACCOUNT não está definida no .env");
}

let serviceAccount;

try {
  // 3. Transforma a string do .env em um Objeto JSON real
  serviceAccount = JSON.parse(serviceAccountRaw);
} catch (error) {
  throw new Error("❌ Falha ao fazer o parse do JSON das credenciais do Firebase. Verifique se o .env está formatado corretamente.");
}

// 4. Inicializa o Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

console.log("🔥 Firebase Admin inicializado com sucesso!");

export default admin;