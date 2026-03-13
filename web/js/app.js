import { initAuth,loginGoogle } from "./auth.js";
import { escucharDatos } from "./entrenamientos.js";
import { renderGrafico } from "./grafico.js";
import { actualizarUI, initSplash,initTheme } from "./ui.js";
import { store } from "./store.js";
import { verificarPro } from "./firebase.js";
import { initAITrainer } from "./aiTrainer.js";
import { guardarEntrenamiento } from "./entrenamientos.js";
import { showToast } from "./utils.js";
import { cargarRankingGlobal } from "./ui.js";

window.store = store


console.log("🔥 HypertroFit iniciado");

initSplash();
initTheme();
initAITrainer();
cargarRankingGlobal();



initAuth(async (user)=>{

 if(user){

 store.setUser(user); 

  await verificarPro(user);

  if(store.esPro){

 const paywall = document.getElementById("paywall");

 if(paywall){
  paywall.remove();
 }

}

if(store.esPro){

 const btn = document.getElementById("btnPro");

 if(btn){
  btn.remove();
 }

}

  document.getElementById("landing").classList.add("hidden");
  document.getElementById("app").style.display="block";

  escucharDatos((data)=>{

   store.setEntrenamientos(data);

   actualizarUI();
   renderGrafico();

  });



  // GUARDAR ENTRENAMIENTO
document
.getElementById("btnGuardar")
.addEventListener("click", async ()=>{


 const ejercicio = document.getElementById("ejercicio").value;
 const series = Number(document.getElementById("series").value);
 const reps = Number(document.getElementById("reps").value);
 const peso = Number(document.getElementById("peso").value);

 if(!series || !reps || !peso) return;

 await guardarEntrenamiento({
  ejercicio,
  series,
  reps,
  peso
 });

 showToast("⚡ +2.5kg aplicado");



document
.getElementById("quickWorkout")
.addEventListener("click", async ()=>{

 const entrenamientos = store.entrenamientos;

 if(!entrenamientos || !entrenamientos.length){
  alert("Registrá un entrenamiento primero");
  return;
 }

 const ultimo = entrenamientos[entrenamientos.length-1];

 const nuevoPeso = Number(ultimo.peso) + 2.5;

 await guardarEntrenamiento({

  ejercicio: ultimo.ejercicio,
  series: ultimo.series,
  reps: ultimo.reps,
  peso: nuevoPeso

 });

});

 // limpiar inputs
 document.getElementById("series").value="";
 document.getElementById("reps").value="";
 document.getElementById("peso").value="";

});


 }

});

document
.getElementById("btnLoginLanding")
.addEventListener("click",loginGoogle);

document
.getElementById("sharePR")
.addEventListener("click", compartirPR);

function compartirPR(){

 const record =
 Math.max(...store.entrenamientos.map(e=>e.peso));

 const texto =
 `🏆 Nuevo PR en HypertroFit!\n${record} kg 💪`;

 if(navigator.share){

  navigator.share({
   title:"HypertroFit",
   text:texto,
   url:window.location.href
  });

 }else{

  alert(texto);

 }

}
