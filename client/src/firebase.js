import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-655b6.firebaseapp.com",
  projectId: "mern-655b6",
  storageBucket: "mern-655b6.firebasestorage.app",
  messagingSenderId: "886554725812",
  appId: "1:886554725812:web:40b645c2017a94da4fb6e1",
};

const app = initializeApp(firebaseConfig);
export default app;
