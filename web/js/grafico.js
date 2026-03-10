let chart;

export function renderGrafico(entrenamientos){

 if(chart) chart.destroy();

 const ctx = document.getElementById("grafico");

 const labels = entrenamientos.map(e =>
  new Date(e.fecha).toLocaleDateString()
 );

 const data = entrenamientos.map(e => e.volumen);

 chart = new Chart(ctx,{
  type:"line",
  data:{
   labels,
   datasets:[{
    label:"Volumen",
    data,
    borderColor:"#22c55e",
    backgroundColor:"rgba(34,197,94,0.2)",
    fill:true,
    tension:0.4
   }]
  }
 });

}
