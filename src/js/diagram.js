import Chart from 'chart.js/auto';
import {
    LibraryFunction,
    CDA,
    BrezReal,
    BrezInt,
    BrezNoSteps,
    BY
} from './algho_runner.js';
import {
    layer
} from './geometrical_objects.js';
import {
    addButton
} from './events.js';
import {
    Info,
    Task,
    Instruction
} from './info-functions.js';

addButton(Info, Task, Instruction)
const ctx = document.getElementById('container').getContext('2d');

/**
 * построение гистограммы
 * @param {array of number} values значения времени для гистограммы 
 * @returns объект гистограммы
 */
function add_diagramm(values) {
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
        options: {
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Исследование временых характеристик алгоритмов",
                    position: 'top',
                    fontSize: 16,
                    padding: 20
                },
                data: {
                    datasets: [{
                        barPercentage: 0.3,
                        barThickness: 3,
                        maxBarThickness: 6,
                        minBarLength: 2
                    }]
                }
            }
        }
    });

    return chart;
}

var chart = add_diagramm([0, 0, 0, 0, 0, 0]);


function GetTime(func, xn, yn, xk, yk, color, layer, width, height) {
    const count_zam = 100;

    var t0 = performance.now();
    for (var i = 0; i < count_zam; i++) {
        func(xn, yn, xk, yk, color, layer, width, height);
    }
    var t1 = performance.now();
    const res = (t1 - t0) / count_zam;
    layer.destroyChildren();

    return res;
}


/**
 * временной эксперимент
 * @returns объект гистограммы
 */
function TimerExperiment() {
    chart.destroy();
    var xn = 0;
    var yn = 0;
    var xk = 200;
    var yk = 500;
    var color = "black";

    const res1 = GetTime(LibraryFunction, xn, yn, xk, yk, color, layer, width, height);
    const res2 = GetTime(CDA, xn, yn, xk, yk, color, layer, width, height);
    const res3 = GetTime(BrezInt, xn, yn, xk, yk, color, layer, width, height);
    const res4 = GetTime(BrezReal, xn, yn, xk, yk, color, layer, width, height);
    const res5 = GetTime(BrezNoSteps, xn, yn, xk, yk, color, layer, width, height);
    const res6 = GetTime(BY, xn, yn, xk, yk, color, layer, width, height);

    chart = add_diagramm([res1, res2, res3, res4, res5, res6]);

    return chart;
}


document.getElementById("GetTimeExperiment").addEventListener("click", function() {
    chart = TimerExperiment();
});



