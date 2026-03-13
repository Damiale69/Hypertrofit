import { store } from "./store.js";
import { calcularPrediccion } from "./utils.js";
import { calcularRankingEjercicios } from "./utils.js";

export function actualizarUI(){

 const entrenamientos = store.entrenamientos;

 const volumen = entrenamientos.reduce((a,e)=>a+e.volumen,0);
 const record = Math.max(...entrenamientos.map(e=>e.peso),0);
 const max1RM = Math.max(...entrenamientos.map(e=>e.oneRM||0),0);

 document.getElementById("volumen").innerText = volumen + " kg";
 document.getElementById("entrenos").innerText = entrenamientos.length;
 document.getElementById("record").innerText = record + " kg";
 document.getElementById("max1RM").innerText = max1RM + " kg";

 const ultimoEjercicio = entrenamientos[entrenamientos.length-1]?.ejercicio;

 if(ultimoEjercicio){

  const prediccion = calcularPrediccion(ultimoEjercicio);

  if(prediccion){
   document.getElementById("progreso").innerText =
   `🧠 Próximo PR estimado: ${prediccion} kg`;
  }

 }

const ranking = calcularRankingEjercicios(entrenamientos);

const contRanking = document.getElementById("rankingEjercicios");

if(contRanking){

 contRanking.innerHTML = "";

 Object.entries(ranking)
 .sort((a,b)=>b[1]-a[1])
 .forEach(([ejercicio,peso])=>{

  contRanking.innerHTML += `
   <div>
    🏆 ${ejercicio} — ${peso} kg
   </div>
  `;

 });

}


 const cont = document.getElementById("historial");
 cont.innerHTML = "";

 entrenamientos.slice().reverse().forEach(e=>{

  cont.innerHTML += `
  <div class="card">
   🔥 ${e.ejercicio}<br>
   ${e.series}x${e.reps} → ${e.peso}kg
  </div>
  `;

 });

 calcularRacha();
 calcularNivel();
 renderRanking();


 // 💎 ocultar botón PRO si ya es PRO
 if(store.esPro){

  const btn = document.getElementById("btnPro");

  if(btn){
   btn.style.display = "none";
  }

 }

}

if(store.esPro){

 const paywall = document.getElementById("paywall");

 if(paywall){
  paywall.classList.add("hidden");
 }

}


export function renderPR(){

 const cont = document.getElementById("pr-list");
 cont.innerHTML="";

 const records={};

 store.entrenamientos.forEach(e=>{

  if(!records[e.ejercicio] || e.oneRM > records[e.ejercicio]){

   records[e.ejercicio] = e.oneRM ? Math.round(e.oneRM) : null;

  }

 });

 for(let ej in records){

  cont.innerHTML += `
  <div>
   <b>${ej}</b><br>
   🏆 PR estimado:
   <span style="color:#22c55e">
   ${records[ej] ? records[ej]+" kg" : "-"}
   </span>
  </div>
  `;

 }

}


export function renderRanking(){

 const cont = document.getElementById("rankingEjercicios");
 if(!cont) return;

 cont.innerHTML="";

 const records={};

 store.entrenamientos.forEach(e=>{

  const peso = e.oneRM || 0;

  if(!records[e.ejercicio] || peso > records[e.ejercicio]){
   records[e.ejercicio]=peso;
  }

 });

 const ranking = Object.entries(records)
  .sort((a,b)=>b[1]-a[1]);

 ranking.forEach((item,index)=>{

  cont.innerHTML += `
  <div>
  ${index+1}️⃣ ${item[0]} —
  <span style="color:#22c55e">
  ${Math.round(item[1])} kg
  </span>
  </div>
  `;

 });

}


export function mostrarProgreso(){

 const entrenamientos = store.entrenamientos;

 if(entrenamientos.length<2) return;

 const ult = entrenamientos[entrenamientos.length-1];
 const ant = entrenamientos[entrenamientos.length-2];

 let msg="👌 Mantener";
 let progreso=50;

 if(ult.peso > ant.peso){

  msg="🔥 Subiste peso";
  progreso=80;

 }

 if(ult.reps < ant.reps){

  msg="⚠️ Fatiga";
  progreso=30;

 }

 document.getElementById("progreso").innerText=msg;
 document.getElementById("progressFill").style.width=progreso+"%";

}


export function mostrarNuevoPR(valor){

 const progresoEl=document.getElementById("progreso");

 progresoEl.innerText=`🔥 Nuevo PR estimado: ${valor} kg`;
 progresoEl.style.color="#22c55e";
 progresoEl.style.fontWeight="bold";
 progresoEl.style.transform="scale(1.1)";

 document.getElementById("pr-list").classList.add("pr-highlight");

 setTimeout(()=>{
  progresoEl.style.transform="scale(1)";
 },600);

}


export function calcularRacha(){

 const entrenamientos = store.entrenamientos;

 if(entrenamientos.length===0) return;

 const dias = new Set(
  entrenamientos.map(e =>
   new Date(e.fecha).toDateString()
  )
 );

 document.getElementById("racha").innerText =
 dias.size + " días";

}

export function calcularNivel(){

 const xp = store.entrenamientos.length * 100;
 const nivel = Math.floor(xp/500)+1;

 document.getElementById("nivelAtleta").innerText =
 "Nivel " + nivel;

 document.getElementById("xpAtleta").innerText =
 xp + " XP";

}


export function initTheme(){

 const toggle = document.getElementById("themeToggle");

 toggle.addEventListener("click",()=>{

  const isLight = document.body.classList.toggle("light-mode");

  if(isLight){
   toggle.innerText="☀️";
   localStorage.setItem("theme","light");
  }else{
   toggle.innerText="🌙";
   localStorage.setItem("theme","dark");
  }

 });

 if(localStorage.getItem("theme")==="light"){

  document.body.classList.add("light-mode");
  toggle.innerText="☀️";

 }

}


export function initUserMenu(){

 const avatar = document.getElementById("userPhoto");
 const dropdown = document.getElementById("dropdownMenu");

 avatar.addEventListener("click",()=>{

  dropdown.classList.toggle("hidden");

 });

 document.addEventListener("click",(e)=>{

  if(!e.target.closest(".user-menu")){
   dropdown.classList.add("hidden");
  }

 });

}


export function initSplash(){

 window.addEventListener("load",()=>{

  setTimeout(()=>{

   document.getElementById("splash").classList.add("hidden");

  },1200);

 });

}

// cerrar paywall
window.cerrarPaywall = function(){

 document
  .getElementById("paywall")
  .classList.add("hidden");

}


window.irASuscripcion = async function(){

 const user = store.user;

 try{

  const res = await fetch(
   "https://hypertrofit.onrender.com/crear-suscripcion",
   {
    method:"POST",
    headers:{
     "Content-Type":"application/json"
    },
    body:JSON.stringify({
     uid:user.uid,
     email:user.email
    })
   }
  );

  const data = await res.json();

  if(!data.init_point){
   alert("Error creando suscripción");
   return;
  }

  window.location.href = data.init_point;

 }catch(err){

  console.error("ERROR SUSCRIPCIÓN:",err);

 }

}
