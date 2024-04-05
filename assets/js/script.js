const apiURL = "https://mindicador.cl/api/"
const convMonedas = document.querySelector("#moneda")
const resultados = document.getElementById('resultados')
const btn = document.querySelector("#buscar")
var dolar = 0
var euro = 0
var resultado = 0
var apiGrafico= '';
let myChart;

async function getMonedas() {
    try{
       const res = await fetch(apiURL);
       const monedas = await res.json();
       dolar = monedas.dolar['valor'];
       euro = monedas.euro['valor'];
       return monedas;
    } catch(e){
        alert(e.message);
    }
}
getMonedas();    
    
function conversor(tipo){if(tipo == 'dolar'){
    const datoPesos = document.getElementById('pesos').value
    resultado = datoPesos/dolar;
    apiGrafico = "https://mindicador.cl/api/dolar";
} else if (tipo == 'euro') {
    const datoPesos = document.getElementById('pesos').value
    resultado = datoPesos/euro;
    apiGrafico = "https://mindicador.cl/api/euro";
}
}

async function getData() {
    try{
    const response = await fetch(apiGrafico);
    const data = await response.json();
    return data.serie;
  } catch(e){
    alert(e.message);
  }
}

async function createDataChart() {
    const serie = await getData();

    const labels = [];
    const values = [];

    const primeros10dias = serie.slice(0, 10);

    primeros10dias.forEach(day => {
      labels.push(day.fecha.split("T")[0]);
      values.push(day.valor);
    });

    const datasets =[{
        label: 'Valor de los últimos 10 días',
        borderColor: 'red',
        backgroundColor: 'transparent',
        borderWidth: 1,
        data: values
    }
    ];
    return { labels, datasets };
}

async function renderGrafica(){
    const data = await createDataChart();
    const config = {
        type :'line',
        data
    };
    const chart = document.getElementById('grafico');
    chart.style.backgroundColor = "white";
    if (myChart) {
        myChart.destroy();
    }
    myChart = new Chart(chart, config
    );
  }

                
btn.addEventListener("click", () =>{
    var tipo = document.getElementById('conversion').value
    conversor(tipo);
    renderGrafica();
    resultados.textContent ='Resultado: $'+ resultado;
   })