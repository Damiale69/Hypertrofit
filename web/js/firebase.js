import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";
import { store } from "./store.js";



const firebaseConfig = {
  apiKey: "AIzaSyDEKpbSJQL5wX8EuOxOwKdr4iobJRPWiY4",
  authDomain: "hypertrofit-9f4e1.firebaseapp.com",
  projectId: "hypertrofit-9f4e1",
  storageBucket: "hypertrofit-9f4e1.firebasestorage.app",
  messagingSenderId: "900770335580",
  appId: "1:900770335580:web:bbfe2d1a5143fff9330f99",
  measurementId: "G-DNZVBNWE70"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

setPersistence(auth, browserLocalPersistence)
.then(()=>{
 console.log("🔥 Persistencia activada");
});


export async function verificarPro(user){

 const ref = doc(db,"usuarios",user.uid);
 const snap = await getDoc(ref);

 if(snap.exists()){
  store.setPro(snap.data().pro === true);
 }else{
  store.setPro(false);
 }

}