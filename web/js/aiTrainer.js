import { store } from "./store.js";

export function initAITrainer(){

 const btn = document.getElementById("btnRutina");

 if(!btn) return;

 btn.addEventListener("click", generarSesion);

}

function generarSesion(){

 // 🔒 BLOQUEO PRO
 if(!store.esPro){

  const paywall = document.getElementById("paywall");

  if(paywall){
   paywall.classList.remove("hidden");
  }

  return;

 }

 const cont = document.getElementById("rutina");

 if(!cont) return;

 cont.innerHTML="";

 const entrenamientos = store.entrenamientos || [];

 if(entrenamientos.length === 0){

  cont.innerHTML="<p>Registrá entrenamientos primero</p>";

  return;

 }

 function detectarProgreso(ejercicio, entrenamientos){

 const historial = entrenamientos
  .filter(e=>e.ejercicio===ejercicio)
  .slice(-3);

 if(historial.length < 2) return 0;

 const primero = historial[0].oneRM || 0;
 const ultimo = historial[historial.length-1].oneRM || 0;

 return ultimo - primero;

}

function detectarFatiga(ejercicio, entrenamientos){

 const historial = entrenamientos
  .filter(e=>e.ejercicio===ejercicio)
  .slice(-3);

 if(historial.length < 3) return false;

 const r1 = historial[0].oneRM || 0;
 const r2 = historial[1].oneRM || 0;
 const r3 = historial[2].oneRM || 0;

 return r3 < r2 && r2 <= r1;

}


 const ultimo = entrenamientos[entrenamientos.length-1];

 const ejercicios = {

  pecho:["Press Banca","Press Inclinado"],
  espalda:["Peso Muerto","Remo"],
  piernas:["Sentadilla","Prensa"],
  hombros:["Press Militar","Elevaciones Laterales"]

 };

 const grupos = Object.keys(ejercicios);

 let grupoElegido = grupos[Math.floor(Math.random()*grupos.length)];

 // 🧠 lógica inteligente según último entrenamiento
 if(ultimo){

  if(ultimo.ejercicio.includes("Press")){
   grupoElegido="espalda";
  }

  if(
   ultimo.ejercicio.includes("Peso") ||
   ultimo.ejercicio.includes("Remo")
  ){
   grupoElegido="piernas";
  }

 }

 const titulo = document.createElement("h3");

 titulo.innerText="🔥 Sesión recomendada";

 cont.appendChild(titulo);

 ejercicios[grupoElegido].forEach(nombre=>{

  const historial = entrenamientos
   .filter(e=>e.ejercicio===nombre);

  let oneRM = 40;

  if(historial.length){

   oneRM = Math.max(...historial.map(e=>e.oneRM || 0));

  }

  const progreso = detectarProgreso(nombre, entrenamientos);
const fatiga = detectarFatiga(nombre, entrenamientos);

let intensidad = 1;

if(progreso > 2){
 intensidad = 1.03;
}

if(fatiga){
 intensidad = 0.9;
}

const fuerza = Math.round(oneRM*0.85*intensidad);
const hipertrofia = Math.round(oneRM*0.70*intensidad);
const tecnica = Math.round(oneRM*0.60*intensidad);

let fuerzaSeries = 5;
let hipertrofiaSeries = 4;

if(fatiga){
 fuerzaSeries = 3;
 hipertrofiaSeries = 3;
}

const card = document.createElement("div");
card.innerHTML = `

🧠 <b>${nombre}</b><br>

💪 Fuerza → ${fuerzaSeries}x5 ${fuerza}kg<br>
🔥 Hipertrofia → ${hipertrofiaSeries}x10 ${hipertrofia}kg<br>
⚡ Técnica → 3x12 ${tecnica}kg

`;

cont.appendChild(card);

 });

}

