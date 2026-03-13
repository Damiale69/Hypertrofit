import { store } from "./store.js";

export function calcularPrediccion(ejercicio){

 const ejerciciosFiltrados = store.entrenamientos
  .filter(e=>e.ejercicio===ejercicio)
  .slice(-3);

 if(ejerciciosFiltrados.length<3) return null;

 const inc1 = ejerciciosFiltrados[1].oneRM - ejerciciosFiltrados[0].oneRM;
 const inc2 = ejerciciosFiltrados[2].oneRM - ejerciciosFiltrados[1].oneRM;

 const promedio = (inc1+inc2)/2;

 if(promedio<=0) return null;

 return Math.round(ejerciciosFiltrados[2].oneRM + promedio);

}


export function playSuccessSound(){

 const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
 const oscillator = audioCtx.createOscillator();
 const gainNode = audioCtx.createGain();

 oscillator.type="sine";
 oscillator.frequency.setValueAtTime(440,audioCtx.currentTime);
 oscillator.frequency.exponentialRampToValueAtTime(880,audioCtx.currentTime+0.2);

 gainNode.gain.setValueAtTime(0.1,audioCtx.currentTime);
 gainNode.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+0.25);

 oscillator.connect(gainNode);
 gainNode.connect(audioCtx.destination);

 oscillator.start();
 oscillator.stop(audioCtx.currentTime+0.25);

}

export function showToast(text){

 const toast=document.getElementById("toast");

 toast.innerText=text;

 toast.classList.remove("hidden");
 toast.classList.add("show");

 setTimeout(()=>{

  toast.classList.remove("show");

 },2000);

}


export function calcularRankingEjercicios(entrenamientos){

 const ranking = {};

 entrenamientos.forEach(e=>{

  const actual = ranking[e.ejercicio] || 0;

  if((e.oneRM || 0) > actual){
   ranking[e.ejercicio] = e.oneRM;
  }

 });

 return ranking;

}