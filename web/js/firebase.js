
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDEKpbSJQL5wX8EuOxOwKdr4iobJRPWiY4",
  authDomain: "hypertrofit-9f4e1.firebaseapp.com",
  projectId: "hypertrofit-9f4e1",
  storageBucket: "hypertrofit-9f4e1.firebasestorage.app",
  messagingSenderId: "900770335580",
  appId: "1:900770335580:web:bbfe2d1a5143fff9330f99",
  measurementId: "G-DNZVBNWE70"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
