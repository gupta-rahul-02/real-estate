// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBAE_API_KEY,
  authDomain: "real-estate-90c47.firebaseapp.com",
  projectId: "real-estate-90c47",
  storageBucket: "real-estate-90c47.appspot.com",
  messagingSenderId: "887174171961",
  appId: "1:887174171961:web:267387b93a1f09a5af6ce8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);