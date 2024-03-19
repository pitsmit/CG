import Chart from 'chart.js/auto';
import Konva from 'konva';

import {addButton} from './events.js';
import {
    LibraryFunctionCircle,
    LibraryFunctionEllipse,
    BrezCircle,
    BrezEllipse,
    CanonCircle,
    CanonEllipse,
    ParamCircle,
    ParamEllipse
} from './algho_runner.js';
import { GetUserDataTimer } from './getdata.js';

addButton(NaN);
const ctx = document.getElementById('container').getContext('2d'); //* @typedef html-object(canvas)
var lineChart; //* @typedef chart-object


/**
 * замер времени работы функции построения круга
 * @param {function} func замеряемая функция
 * @param {number} rad радиус
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} x координата
 * @param {number} y координата
 * @returns {number} res время
 */
function GetTimeToCircle(func, rad, color, layer, x, y) {
    const count_zam = 50; //* @typedef number
    var t0 = performance.now(); //* @typedef number
    for (var i = 0; i < count_zam; i++)
        func(x, y, color, layer, rad);
    var t1 = performance.now(); //* @typedef number
    const res = (t1 - t0) / count_zam; //* @typedef number
    layer.destroyChildren();

    return res;
}


/**
 * замер времени работы функции построения эллипса
 * @param {function} func замеряемая функция
 * @param {number} a радиус по горизонтали
 * @param {number} и радиус по вертикали
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} x координата
 * @param {number} y координата
 * @returns {number} res время
 */
function GetTimeToEllipse(func, a, b, color, layer, x, y) {
    const count_zam = 50; //* @typedef number
    var t0 = performance.now(); //* @typedef number
    for (var i = 0; i < count_zam; i++)
        func(x, y, color, layer, a, b);
    var t1 = performance.now(); //* @typedef number
    const res = (t1 - t0) / count_zam; //* @typedef number
    layer.destroyChildren();

    return res;
}


/**
 * 
 * @param {number} startcircle начальный радиус круга
 * @param {number} starta начальный радиус по горизонтали для эллипса
 * @param {number} startb начальный радиус по вертикали для эллипса
 * @param {number} shagrad шаг изменения радиуса
 * @param {number} countfig кол-во фигур для построения
 */
function TimerExperiment(startcircle, starta, startb, shagrad, countfig) {
    var layer = new Konva.Layer(); //* @typedef konva-object
    lineChart.destroy();
    var color = "black"; //* @typedef string
    var x = 0;        //* @typedef number
    var y = 0;        //* @typedef number

    var LibCir =  []; //* @typedef array of numbers
    var LibEl =   []; //* @typedef array of numbers
    var BrezCir = []; //* @typedef array of numbers
    var BrezEl =  []; //* @typedef array of numbers
    var CanCir =  []; //* @typedef array of numbers
    var CanEl =   []; //* @typedef array of numbers
    var ParCir =  []; //* @typedef array of numbers
    var ParEl =   []; //* @typedef array of numbers

    var labels =  []; //* @typedef array of strings


    for (var i = 0; i < countfig; i++, starta += shagrad, startb += shagrad, startcircle += shagrad) {
        LibCir.push(GetTimeToCircle(LibraryFunctionCircle, startcircle, color, layer, x, y));
        BrezCir.push(GetTimeToCircle(BrezCircle, startcircle, color, layer, x, y));
        CanCir.push(GetTimeToCircle(CanonCircle, startcircle, color, layer, x, y));
        ParCir.push(GetTimeToCircle(ParamCircle, startcircle, color, layer, x, y));

        LibEl.push(GetTimeToEllipse(LibraryFunctionEllipse, starta, startb, color, layer, x, y));
        BrezEl.push(GetTimeToEllipse(BrezEllipse, starta, startb, color, layer, x, y));
        CanEl.push(GetTimeToEllipse(CanonEllipse, starta, startb, color, layer, x, y));
        ParEl.push(GetTimeToEllipse(ParamEllipse, starta, startb, color, layer, x, y));

        labels.push("+" + String(shagrad * i));
    }

    layer.destroy();

    PlotGraph([LibCir, BrezCir, CanCir, ParCir, LibEl, BrezEl, CanEl, ParEl, labels]);
}


/**
 * создание графика
 * @param {array of arrays of number} data массив времени под каждый алгоритм
 */
function PlotGraph(data) {
    var LibCir = { //* @typedef chart-object
        label: "Библиотечный для окружности",
        data: data[0],
        borderColor: 'red'
    };

    var BrezCir = { //* @typedef chart-object
        label: "Брезенхем для окружности",
        data: data[1],
        borderColor: 'blue'
    };

    var CanCir = { //* @typedef chart-object
        label: "Каноническое уравнение для окружности",
        data: data[2],
        borderColor: 'black'
    };

    var ParCir = { //* @typedef chart-object
        label: "Параметрическое уравнение для окружности",
        data: data[3],
        borderColor: 'yellow'
    };

    var LibEl = { //* @typedef chart-object
        label: "Библиотечный для эллипса",
        data: data[4],
        borderColor: 'green'
    };

    var BrezEl = { //* @typedef chart-object
        label: "Брезенхем для эллипса",
        data: data[5],
        borderColor: 'orange'
    };

    var CanEl = { //* @typedef chart-object
        label: "Каноническое уравнение для эллипса",
        data: data[6],
        borderColor: 'violet'
    };

    var ParEl = { //* @typedef chart-object
        label: "Параметрическое уравнение для эллипса",
        data: data[7],
        borderColor: 'brown'
    };

    var speedData = { //* @typedef chart-object
        labels: data[8],
        datasets: [LibCir, BrezCir, CanCir, ParCir, LibEl, BrezEl, CanEl, ParEl]
    };
    lineChart = new Chart(ctx, {
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


PlotGraph([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] * 8
]);


document.getElementById('collect-data-for-timer-figure').addEventListener("submit", function() {
        var [startcircle, starta, startb, shagrad, countfig] = GetUserDataTimer("collect-data-for-timer-figure");
        TimerExperiment(startcircle, starta, startb, shagrad, countfig);
});