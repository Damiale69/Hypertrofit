import { initAuth,loginGoogle } from "./auth.js";
import { escucharDatos } from "./entrenamientos.js";
import { renderGrafico } from "./grafico.js";
import { actualizarUI } from "./ui.js";

console.log("🔥 HypertroFit iniciado");

initAuth((user)=>{

 if(user){

  document.getElementById("landing").classList.add("hidden");
  document.getElementById("app").style.display="block";

  escucharDatos(()=>{

   actualizarUI();
   renderGrafico();

  });

 }

});

document
.getElementById("btnLoginLanding")
.addEventListener("click",loginGoogle);
