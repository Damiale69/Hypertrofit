import { auth } from "./firebase.js";

import {GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

const provider = new GoogleAuthProvider();

export function initAuth(callback){

 onAuthStateChanged(auth,callback);

}

export async function loginGoogle(){

 return await signInWithPopup(auth,provider);

}

export async function logout(){

 await signOut(auth);

}
