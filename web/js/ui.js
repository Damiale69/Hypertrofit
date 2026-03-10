export function actualizarUI(entrenamientos){

 const volumen = entrenamientos.reduce((a,e)=>a+(e.volumen||0),0);
 const record = Math.max(...entrenamientos.map(e=>e.peso||0),0);
 const max1RM = Math.max(...entrenamientos.map(e=>e.oneRM||0),0);

 document.getElementById("volumen").innerText = volumen+" kg";
 document.getElementById("entrenos").innerText = entrenamientos.length;
 document.getElementById("record").innerText = record+" kg";
 document.getElementById("max1RM").innerText = max1RM+" kg";

}
