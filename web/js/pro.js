import { auth } from "./firebase.js";

export async function irASuscripcion(){

 const user = auth.currentUser;

 const res = await fetch(
  "https://hypertrofit.onrender.com/crear-suscripcion",
  {
   method:"POST",
   headers:{ "Content-Type":"application/json" },
   body:JSON.stringify({
    uid:user.uid,
    email:user.email
   })
  }
 );

 const data = await res.json();

 window.location.href = data.init_point;

}
