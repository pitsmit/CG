import * as chartt from './Chart.min.js';
import * as konva from './konva.min.js';
import {addButton} from './events.js';
import {Info,Task,Instruction} from './info-functions.js';
import { LibraryFunctionCircle, LibraryFunctionEllipse, BrezCircle, BrezEllipse, CanonCircle, CanonEllipse, ParamCircle, ParamEllipse } from './algho_runner.js';

addButton(Info, Task, Instruction);
const ctx = document.getElementById('container').getContext('2d');

function GetTimeToCircle(func, rad, color, layer, x, y){
    const count_zam = 10;
    var t0 = performance.now();
    for (var i = 0; i < count_zam; i++){
        func(x, y, color, layer, rad);
    }
    var t1 = performance.now();
    const res = (t1 - t0) / count_zam;
    layer.destroyChildren();

    return res;
}


function GetTimeToEllipse(func, a, b, color, layer, x, y){
    const count_zam = 10;
    var t0 = performance.now();
    for (var i = 0; i < count_zam; i++) 
        func(x, y, color, layer, a, b);
    var t1 = performance.now();
    const res = (t1 - t0) / count_zam;
    layer.destroyChildren();

    return res;
}


function TimerExperiment(radmin, radmax, shagrad) {
    var layer = new Konva.Layer();
    var color = "black";
    var x = 0;
    var y = 0;

    var LibCir = [];
    var LibEl = [];
    var BrezCir = [];
    var BrezEl = [];
    var CanCir = [];
    var CanEl = [];
    var ParCir = [];
    var ParEl = [];

    var labels = [];


    for (var rad = radmin; rad <= radmax; rad += shagrad){
        LibCir.push(GetTimeToCircle(LibraryFunctionCircle, rad, color, layer, x, y));
        BrezCir.push(GetTimeToCircle(BrezCircle, rad, color, layer, x, y));
        CanCir.push(GetTimeToCircle(CanonCircle, rad, color, layer, x, y));
        ParCir.push(GetTimeToCircle(ParamCircle, rad, color, layer, x, y));

        LibEl.push(GetTimeToEllipse(LibraryFunctionEllipse, rad, rad, color, layer, x, y));
        BrezEl.push(GetTimeToEllipse(BrezEllipse, rad, rad, color, layer, x, y));
        CanEl.push(GetTimeToEllipse(CanonEllipse, rad, rad, color, layer, x, y));
        ParEl.push(GetTimeToEllipse(ParamEllipse, rad, rad, color, layer, x, y));

        labels.push(String(rad));
    }

    layer.destroy();

    return [LibCir, BrezCir, CanCir, ParCir, LibEl, BrezEl, CanEl, ParEl, labels];
}


/**
 * создание графика
 * @param {array of arrays of number} data массив кол-ва ступенек под каждый алгоритм
 */
function run(data) {
    var LibCir = {
        label: "Библиотечный для окружности",
        data: data[0],
        borderColor: 'red'
    };

    var BrezCir = {
        label: "Брезенхем для окружности",
        data: data[1],
        borderColor: 'blue'
    };

    var CanCir = {
        label: "Каноническое уравнение для окружности",
        data: data[2],
        borderColor: 'black'
    };

    var ParCir = {
        label: "Параметрическое уравнение для окружности",
        data: data[3],
        borderColor: 'yellow'
    };

    var LibEl = {
        label: "Библиотечный для эллипса",
        data: data[4],
        borderColor: 'green'
    };

    var BrezEl = {
        label: "Брезенхем для эллипса",
        data: data[5],
        borderColor: 'orange'
    };

    var CanEl = {
        label: "Каноническое уравнение для эллипса",
        data: data[6],
        borderColor: 'violet'
    };

    var ParEl = {
        label: "Параметрическое уравнение для эллипса",
        data: data[7],
        borderColor: 'brown'
    };

    var speedData = {
        labels: data[8],
        datasets: [LibCir, BrezCir, CanCir, ParCir, LibEl, BrezEl, CanEl, ParEl]
    };
    var lineChart = new Chart(ctx, {
        type: 'line',
        data: speedData,
        options: {
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Затраченное время'
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Радиус'
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
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
]);


if (document.getElementById('collect-data-for-timer-figure')) {
    document.getElementById('collect-data-for-timer-figure').addEventListener("submit", function() {
        var el = document.getElementById("collect-data-for-timer-figure");
        var radmin = parseFloat(el.radmin.value);
        var radmax = parseFloat(el.radmax.value);
        var shagrad = parseFloat(el.shagrad.value);
        var data = TimerExperiment(radmin, radmax, shagrad);
        run(data);
    });
}