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
import { GetUserDataDefault } from './getdata.js';
import { SwitchAlgorithm } from './algswitcher.js';

stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
addWheel(stage, layer, xAxis, yAxis);
addButton();


/**
 * запуск построения одиночного отрезка после получения данных от пользователя
 * @param {number} xn 
 * @param {number} yn 
 * @param {number} xk 
 * @param {number} yk 
 * @param {string} color 
 * @param {string} option_value 
 * @param {string} backgroudcolor 
 */
function PlotLine(xn, yn, xk, yk, color, option_value, backgroudcolor) {
    layer.destroyChildren();
    refresh_graph(layer, xAxis, yAxis);
    stage.getContainer().style.backgroundColor = backgroudcolor;

    SwitchAlgorithm(option_value, xn, yn, xk, yk, color, layer, width, height);
}


document.getElementById('collect-data-for-line').addEventListener("submit", function() {
    var [xn, yn, xk, yk, color, option_value, backgroudcolor] = GetUserDataDefault('collect-data-for-line');
    PlotLine(xn, yn, xk, yk, color, option_value, backgroudcolor);
});