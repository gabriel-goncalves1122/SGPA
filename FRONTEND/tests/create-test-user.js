// Script para criar usuário de teste via Firebase Admin
import admin from 'firebase-admin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccount = path.resolve(__dirname, '../../BACKEND/src/config/sgpa-63419-firebase-adminsdk-fbsvc-ed34d9d0d5.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function createTestUser() {
  try {
    console.log('🔥 Criando usuário de teste...');
    
    const userRecord = await admin.auth().createUser({
      email: 'teste@selenium.com',
      password: 'teste123456',
      emailVerified: true,
      disabled: false,
    });

    console.log('✅ Usuário criado com sucesso!');
    console.log('📧 Email:', userRecord.email);
    console.log('🆔 UID:', userRecord.uid);
    console.log('');
    console.log('Agora você pode executar os testes!');
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log('✅ Usuário já existe! Você pode executar os testes.');
      process.exit(0);
    } else {
      console.error('❌ Erro ao criar usuário:', error.message);
      process.exit(1);
    }
  }
}

createTestUser();
