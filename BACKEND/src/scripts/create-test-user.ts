import admin from "../config/firebase";

async function createTestUser() {
  console.log("👤 Criando usuário de teste para Selenium...\n");

  const testUser = {
    email: "teste@selenium.com",
    password: "teste123456",
    displayName: "Usuário Teste Selenium",
    emailVerified: true,
  };

  try {
    // Verificar se o usuário já existe
    try {
      const existingUser = await admin.auth().getUserByEmail(testUser.email);
      console.log(`⚠️  Usuário já existe!`);
      console.log(`   UID: ${existingUser.uid}`);
      console.log(`   Email: ${existingUser.email}`);
      console.log(`   Nome: ${existingUser.displayName}`);
      
      // Atualizar a senha para garantir que está correta
      await admin.auth().updateUser(existingUser.uid, {
        password: testUser.password,
        emailVerified: true,
      });
      console.log(`\n✅ Senha do usuário atualizada para: ${testUser.password}`);
      
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        // Usuário não existe, criar novo
        console.log("📝 Criando novo usuário...");
        const userRecord = await admin.auth().createUser({
          email: testUser.email,
          password: testUser.password,
          displayName: testUser.displayName,
          emailVerified: testUser.emailVerified,
        });

        console.log("\n✅ Usuário criado com sucesso!");
        console.log(`   UID: ${userRecord.uid}`);
        console.log(`   Email: ${userRecord.email}`);
        console.log(`   Nome: ${userRecord.displayName}`);
      } else {
        throw error;
      }
    }

    console.log("\n📋 Credenciais para os testes Selenium:");
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Senha: ${testUser.password}`);
    console.log("\n🎉 Usuário de teste está pronto para uso!");

  } catch (error) {
    console.error("\n❌ Erro ao criar usuário de teste:");
    if (error instanceof Error) {
      console.error(`   Mensagem: ${error.message}`);
      console.error(`   Stack: ${error.stack}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }

  process.exit(0);
}

// Executar
createTestUser();
