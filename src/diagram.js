import * as chartt from './Chart.min.js';
import { LibraryFunction, CDA, BrezReal, BrezInt, BrezNoSteps, BY } from './algho_runner.js';
import { layer } from './geometrical_objects.js';
import { addButton } from './events.js';
import { Info, Task, Instruction } from './info-functions.js';

addButton(Info, Task, Instruction, "")

const ctx = document.getElementById('histogram').getContext('2d');

function add_diagramm(values){
  var chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ["Библиотечный алгоритм", "ЦДА", "Брезенхем с действительными данными", "Брезенхем с целочисленными данными", "Брезенхем с устранением ступенчатости", "Ву"],
      datasets: [{
        data: values,
        backgroundColor: [
          'rgba(216, 27, 96, 0.6)',
          'rgba(3, 169, 244, 0.6)',
          'rgba(255, 152, 0, 0.6)',
          'rgba(29, 233, 182, 0.6)',
          'rgba(156, 39, 176, 0.6)'
        ]
      }]
    },
    options: 
    {
      legend: {
          display: false
          },
  
      title: {
          display: true,
          text: 'Исследование временных характеристик алгоритмов ',
          position: 'top',
          fontSize: 16,
          padding: 20
      },
      scales: 
      {
        xAxes: [{
          display: false,
          barPercentage: 1.3,
          ticks: {
            max: 6,
          }
        }, {
          display: true,
          ticks: {
            autoSkip: false,
            max: 5,
          }
        }],
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });

  return chart;
}

var chart = add_diagramm([0, 0, 0, 0, 0, 0]);

function TimerExperiment(){
    const count_zam = 100;
    layer.destroyChildren();
    chart.destroy();
    var xn = 0;
    var yn = 0;
    var xk = 200;
    var yk = 500;

    var color = "black";

    var width = window.innerWidth;
    var height = window.innerHeight;

    var t0 = performance.now();
    for (var i = 0; i < count_zam; i++){
      LibraryFunction(xn, yn, xk, yk, color, layer, width, height);
    }
    var t1 = performance.now();
    const res1 = (t1 - t0) / count_zam;
    layer.destroyChildren();
    t0 = performance.now();
    for (var i = 0; i < count_zam; i++){
      CDA(xn, yn, xk, yk, color, layer, width, height);
    }
    t1 = performance.now();
    const res2 = (t1 - t0) / count_zam;
    layer.destroyChildren();
    t0 = performance.now();
    for (var i = 0; i < count_zam; i++){
      BrezInt(xn, yn, xk, yk, color, layer, width, height);
    }
    t1 = performance.now();
    const res3 = (t1 - t0) / count_zam;
    layer.destroyChildren();
    t0 = performance.now();
    for (var i = 0; i < count_zam; i++){
      BrezReal(xn, yn, xk, yk, color, layer, width, height);
    }
    layer.destroyChildren();
    t1 = performance.now();
    const res4 = (t1 - t0) / count_zam;
    layer.destroyChildren();
    t0 = performance.now();
    for (var i = 0; i < count_zam; i++){
      BrezNoSteps(xn, yn, xk, yk, color, layer, width, height);
    }
    layer.destroyChildren();
    t1 = performance.now();
    const res5 = (t1 - t0) / count_zam;

    layer.destroyChildren();
    t0 = performance.now();
    for (var i = 0; i < count_zam; i++){
      BY(xn, yn, xk, yk, color, layer, width, height);
    }
    layer.destroyChildren();
    t1 = performance.now();
    const res6 = (t1 - t0) / count_zam;
    layer.destroyChildren();

    chart = add_diagramm([res1, res2, res3, res4, res5, res6]);

    return chart;
}


document.getElementById("GetTimeExperiment").addEventListener("click", function(){
  chart = TimerExperiment();
});