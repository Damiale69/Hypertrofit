import { store } from "./store.js";

let chart;

export function renderGrafico(){

 if(chart) chart.destroy();

 const ctx=document.getElementById("grafico");

 const filtrados=store.entrenamientos;

 const labels=filtrados.map(e=>
  new Date(e.fecha).toLocaleDateString()
 );

 const dataValues=store.esPro
  ? filtrados.map(e=>e.oneRM||0)
  : filtrados.map(e=>e.volumen);

 chart=new Chart(ctx,{
  type:"line",
  data:{
   labels,
   datasets:[{
    label:"Volumen",
    data:dataValues,
    borderColor:"#22c55e",
    backgroundColor:"rgba(34,197,94,0.2)",
    fill:true,
    tension:0.4
   }]
  }
 });

}
