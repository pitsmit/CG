import {
    addWheel,
    addButton
} from './events.js';
import {
    layer,
    stage,
    xAxis,
    yAxis,
    refresh_graph
} from './geometrical_objects.js';
import {
    Info,
    Task,
    Instruction
} from './info-functions.js';
import {
    LibraryFunction,
    CDA,
    BrezReal,
    BrezInt,
    BrezNoSteps,
    BY
} from './algho_runner.js';

stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
addWheel(stage, layer, xAxis, yAxis);
addButton(Info, Task, Instruction)


/**
 * чтение данных от пользователя
 * @param {string} form id формочки 
 * @returns длина отрезка, шаг угла, цвет отрезка, алгоритм, цвет фона
 */
function GetUserDataDegree(form) {
    var el = document.getElementById(form);
    var len = parseFloat(el.len.value);
    var shag = parseFloat(el.shag.value);

    var color = el.favcolor.value;
    var back = el.back.value;
    var options = document.getElementsByName('state');
    var option_value;
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            option_value = options[i].value;
            break;
        }
    }

    return [len, shag, color, option_value, back];
}


/**
 * пострение ёжика
 */
function plot_lines() {
    var [len, shag, color, option_value, black] = GetUserDataDegree('collect-data-for-degree-line')
    layer.destroyChildren();
    refresh_graph(layer, xAxis, yAxis);
    stage.getContainer().style.backgroundColor = black;

    var shag0 = shag;
    shag = 0;
    while (shag < 360) {
        var xk = 0 + len * Math.cos(shag * Math.PI / 180);
        var yk = 0 + len * Math.sin(shag * Math.PI / 180);

        switch (option_value) {
            case "library-function":
                LibraryFunction(0, 0, xk, yk, color, layer, width, height);
                break;
            case "CDA":
                CDA(0, 0, xk, yk, color, layer, width, height);
                break;
            case "BrezReal":
                BrezReal(0, 0, xk, yk, color, layer, width, height);
                break;
            case "BrezInt":
                BrezInt(0, 0, xk, yk, color, layer, width, height);
                break;
            case "BrezNoSteps":
                BrezNoSteps(0, 0, xk, yk, color, layer, width, height);
                break;
            case "BY":
                BY(0, 0, xk, yk, color, layer, width, height);
                break;
        }

        shag += shag0;
    }
}


document.getElementById('collect-data-for-degree-line').addEventListener("submit", function() {
    plot_lines();
});