import admin from "firebase-admin";
import path from "path";

const serviceAccount = path.resolve(__dirname, "sgpa-63419-firebase-adminsdk-fbsvc-ed34d9d0d5.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
