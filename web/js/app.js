import { initAuth,loginGoogle } from "./auth.js";
import { escucharDatos } from "./entrenamientos.js";
import { renderGrafico } from "./grafico.js";
import { actualizarUI, initSplash,initTheme } from "./ui.js";
import { store } from "./store.js";
import { verificarPro } from "./firebase.js";

console.log("🔥 HypertroFit iniciado");

initSplash();
initTheme();

initAuth(async (user)=>{

 if(user){

  await verificarPro(user);

  document.getElementById("landing").classList.add("hidden");
  document.getElementById("app").style.display="block";

  escucharDatos((data)=>{

   store.setEntrenamientos(data);

   actualizarUI();
   renderGrafico();

  });

 }

});

document
.getElementById("btnLoginLanding")
.addEventListener("click",loginGoogle);
