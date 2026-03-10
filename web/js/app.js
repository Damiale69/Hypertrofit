import { auth } from "./firebase.js";
import { escucharDatos } from "./entrenamientos.js";
import { actualizarUI } from "./ui.js";
import { renderGrafico } from "./grafico.js";

import {
GoogleAuthProvider,
signInWithPopup,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

console.log("🔥 HypertroFit iniciado");

const provider = new GoogleAuthProvider();

onAuthStateChanged(auth,(user)=>{

 if(user){

  document.getElementById("landing").classList.add("hidden");
  document.getElementById("app").style.display="block";

  escucharDatos((entrenamientos)=>{

   actualizarUI(entrenamientos);
   renderGrafico(entrenamientos);

  });

 }

});

document.getElementById("btnLoginLanding").addEventListener("click",async()=>{

 const result = await signInWithPopup(auth,provider);

 console.log(result.user);

});
