import admin from "../config/firebase";

async function testFirebaseConnection() {
  console.log("🔥 Testando conexão com Firebase...\n");

  try {
    // Teste 1: Verificar inicialização
    console.log("✅ Firebase Admin SDK inicializado");
    console.log(`   Project ID: ${admin.app().options.projectId || "N/A"}`);
    
    // Teste 2: Testar Auth
    console.log("\n📝 Testando Firebase Auth...");
    const listUsersResult = await admin.auth().listUsers(1);
    console.log(`✅ Firebase Auth OK - Usuários encontrados: ${listUsersResult.users.length}`);
    
    // Teste 3: Testar Firestore
    console.log("\n📦 Testando Firestore...");
    const db = admin.firestore();
    const testCollection = db.collection("_connection_test");
    const timestamp = new Date().toISOString();
    
    // Escrever documento de teste
    await testCollection.doc("test").set({
      timestamp,
      message: "Teste de conexão"
    });
    console.log("✅ Firestore Write OK");
    
    // Ler documento de teste
    const doc = await testCollection.doc("test").get();
    if (doc.exists) {
      console.log("✅ Firestore Read OK");
      console.log(`   Dados: ${JSON.stringify(doc.data())}`);
    }
    
    // Limpar documento de teste
    await testCollection.doc("test").delete();
    console.log("✅ Firestore Delete OK");
    
    console.log("\n🎉 Todos os testes passaram! Firebase está configurado corretamente.");
    
  } catch (error) {
    console.error("\n❌ Erro ao testar conexão com Firebase:");
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

// Executar teste
testFirebaseConnection();
