import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6cFoqRWi0oUMk8ojVuHectpifVQKhJ2o",
  authDomain: "help-me-ti.firebaseapp.com",
  projectId: "help-me-ti",
  storageBucket: "help-me-ti.firebasestorage.app",
  messagingSenderId: "1083229093787",
  appId: "1:1083229093787:web:d16b36f681ca23a9f02b3e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
