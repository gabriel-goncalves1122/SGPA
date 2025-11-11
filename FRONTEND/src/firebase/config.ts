import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCIFR4mEqSFylBqHxlMS0N1346XJMlRHAM",

  authDomain: "sgpa-63419.firebaseapp.com",

  projectId: "sgpa-63419",

  storageBucket: "sgpa-63419.firebasestorage.app",

  messagingSenderId: "670997273498",

  appId: "1:670997273498:web:598c9d2b9026f7a9b2f823",

  measurementId: "G-V92GN66TJ5",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
