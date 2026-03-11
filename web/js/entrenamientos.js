import { db,auth } from "./firebase.js";
import { store } from "./store.js";

import {
collection,
addDoc,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

export function escucharDatos(callback){

 const user = auth.currentUser;

 const ref = collection(db,"usuarios",user.uid,"entrenamientos");

 onSnapshot(ref,(snapshot)=>{

  const data=[];

  snapshot.forEach(doc=>{
   data.push(doc.data());
  });

  store.setEntrenamientos(data);

  callback(data);

 });

}

import { playSuccessSound } from "./utils.js";
import { store } from "./store.js";

export async function guardarEntrenamiento(data){

 const user = auth.currentUser;

 const oneRM = data.peso*(1+data.reps/30);
 const oneRMRounded = Math.round(oneRM);

 const previousBest = Math.max(
  ...store.entrenamientos
   .filter(e=>e.ejercicio===data.ejercicio)
   .map(e=>e.oneRM||0),
 0
 );

 const isNewPR = oneRMRounded > previousBest;

 await addDoc(
  collection(db,"usuarios",user.uid,"entrenamientos"),
  {
   ...data,
   volumen:data.series*data.reps*data.peso,
   oneRM:oneRMRounded,
   fecha:new Date().toISOString(),
   creado:serverTimestamp()
  }
 );

 if(isNewPR){
  playSuccessSound();
 }

}

