import { Chart } from './Chart.min.js';
import { Layer } from './konva.min.js';
import { CDA, BrezReal, BrezInt, BrezNoSteps, BY } from './algho_runner.js';
import { addButton } from './events.js';
import { Info, Task, Instruction } from './info-functions.js';

addButton(Info, Task, Instruction)
const ctx = document.getElementById('container').getContext('2d');

/**
 * подсчёт кол-ва ступенек для алгоритмов
 * @param {number} len длина отрезка
 * @returns массив с кол-вом ступенек под каждый алгоритм
 */
function plot_lines(len){
    var layer = new Konva.Layer();
    var color = "black";
    var shag = 10;

    var width = window.innerWidth;
    var height = window.innerHeight;

    layer.destroyChildren();

    var CDA_step = [];
    var BrezReal_step = [];
    var BrezInt_step = [];
    var BrezNoSteps_step = [];
    var BY_step = [];

    var shag0 = shag;
    shag = 0;
    while (shag <= 90){
        var xk = 0 + len * Math.cos(shag * Math.PI / 180);
        var yk = 0 + len * Math.sin(shag * Math.PI / 180);

        CDA_step.push(CDA(0, 0, xk, yk, color, layer, width, height));
        BrezReal_step.push(BrezReal(0, 0, xk, yk, color, layer, width, height));
        BrezInt_step.push(BrezInt(0, 0, xk, yk, color, layer, width, height));
        BrezNoSteps_step.push(BrezNoSteps(0, 0, xk, yk, color, layer, width, height));
        BY_step.push(BY(0, 0, xk, yk, color, layer, width, height));
        layer.destroyChildren();

        shag += shag0;
    }

    layer.destroy();

    return [CDA_step, BrezReal_step, BrezInt_step, BrezNoSteps_step, BY_step];
}


/**
 * создание графика
 * @param {array of arrays of number} data массив кол-ва ступенек под каждый алгоритм
 */
function run(data){
    var CDA = {
        label: "ЦДА",
        data: data[0],
        borderColor: 'red'
    };

    var BrezReal = {
        label: "Брезенхем с действительными данными",
        data: data[1],
        borderColor: 'blue'
    };
        
    var BrezInt = {
        label: "Брезенхем с целочисленными данными",
        data: data[2],
        borderColor: 'black'
    };

    var BrezNoSteps = {
        label: "Брезенхем с устранением ступенчатости",
        data: data[3],
        borderColor: 'yellow'
    };
        
    var BY = {
        label: "Ву",
        data: data[4],
        borderColor: 'orange'
    };
        
    var speedData = {
        labels: ["0`", "10`", "20`", "30`", "40`", "50`", "60`", "70`", "80`", "90`"],
        datasets: [CDA, BrezReal, BrezInt, BrezNoSteps, BY]
    };
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: speedData,
        options :{
            scales: {
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Количество ступенек'
                }
              }],
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Угол наклона'
                }
              }]
            }     
          }
    });
}


run([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]);


if (document.getElementById('collect-data-for-step-line')){
    document.getElementById('collect-data-for-step-line').addEventListener("submit", function(){
        var el = document.getElementById("collect-data-for-step-line");
        var len = parseFloat(el.len.value);
        var data = plot_lines(len);
        run(data);
    });
}