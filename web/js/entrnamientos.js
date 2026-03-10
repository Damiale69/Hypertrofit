import { db, auth } from "./firebase.js";
import {
collection,
addDoc,
onSnapshot,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

export let entrenamientos = [];

export function escucharDatos(callback){

 const user = auth.currentUser;

 const ref = collection(db,"usuarios",user.uid,"entrenamientos");

 onSnapshot(ref,(snapshot)=>{

  entrenamientos=[];

  snapshot.forEach(doc=>entrenamientos.push(doc.data()));

  callback(entrenamientos);

 });

}

export async function guardarEntrenamiento(data){

 const user = auth.currentUser;

 await addDoc(collection(db,"usuarios",user.uid,"entrenamientos"),{
  ...data,
  creado:serverTimestamp()
 });

}
