import "dotenv/config";
import admin from "../config/firebase";

const db = admin.firestore();
const usuariosCollection = db.collection("usuarios");

async function createAdmin() {
  const adminData = {
    email: "admin@sgpa.unifei.edu.br",
    password: "admin@123456", // Mudar em produção!
    nome: "Administrador SGPA",
    tipo: "Administrador",
  };

  try {
    console.log("\n👤 Criando usuário administrador...\n");

    // Verificar se o usuário já existe
    try {
      const existingUser = await admin.auth().getUserByEmail(adminData.email);
      console.log(`⚠️  Admin já existe!`);
      console.log(`   UID: ${existingUser.uid}`);
      console.log(`   Email: ${existingUser.email}`);

      // Atualizar a senha
      await admin.auth().updateUser(existingUser.uid, {
        password: adminData.password,
        displayName: adminData.nome,
      });
      console.log(`\n✅ Credenciais do admin atualizadas`);
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        // Criar novo usuário admin
        console.log("📝 Criando novo usuário admin no Firebase Auth...");
        const userRecord = await admin.auth().createUser({
          email: adminData.email,
          password: adminData.password,
          displayName: adminData.nome,
          emailVerified: true,
        });

        console.log("✅ Usuário criado no Firebase Auth");

        // Registrar em Firestore
        console.log("📝 Registrando admin em Firestore...");
        await usuariosCollection.doc(userRecord.uid).set({
          uid: userRecord.uid,
          nome: adminData.nome,
          email: adminData.email,
          tipo: adminData.tipo,
          createdAt: new Date(),
        });

        console.log("✅ Admin registrado em Firestore");
      } else {
        throw error;
      }
    }

    console.log("\n📋 Credenciais do Administrador:");
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Senha: ${adminData.password}`);
    console.log("\n🎉 Administrador está pronto para usar!\n");

  } catch (error) {
    console.error("\n❌ Erro ao criar admin:");
    if (error instanceof Error) {
      console.error(`   ${error.message}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }

  process.exit(0);
}

createAdmin();
