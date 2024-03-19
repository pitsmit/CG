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
import { SwitchAlgorithm } from './algswitcher.js';
import { GetUserDataDegree } from './getdata.js';

stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
addWheel(stage, layer, xAxis, yAxis);
addButton();


/**
 * построение серии отрезков по кругу после получения данных от пользователя
 * @param {number} len 
 * @param {number} shag 
 * @param {string} color 
 * @param {string} option_value 
 * @param {string} black 
 */
function PlotLines(len, shag, color, option_value, black) {
    layer.destroyChildren();
    refresh_graph(layer, xAxis, yAxis);
    stage.getContainer().style.backgroundColor = black;

    var shag0 = shag;
    shag = 0;
    while (shag < 360) {
        var xk = 0 + len * Math.cos(shag * Math.PI / 180);
        var yk = 0 + len * Math.sin(shag * Math.PI / 180);

        SwitchAlgorithm(option_value, 0, 0, xk, yk, color, layer, width, height);

        shag += shag0;
    }
}


document.getElementById('collect-data-for-degree-line').addEventListener("submit", function() {
    var [len, shag, color, option_value, black] = GetUserDataDegree('collect-data-for-degree-line');
    PlotLines(len, shag, color, option_value, black);
});