import {addWheel,addButton} from './events.js';
import {layer,stage,xAxis,yAxis,refresh_graph} from './geometrical_objects.js';
import { SwitchAlg } from './switcher.js';
import { GetUserDataDefault } from './getdata.js';

stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
addWheel(stage, layer, xAxis, yAxis);
addButton("collect-data-for-figure");


/**
 * запуск алгоритма построения единичной фигуры после получения данных от пользователя
 * @param {number} x 
 * @param {number} y 
 * @param {string} color 
 * @param {string} backcolor 
 * @param {string} alg_option название алгоритма
 * @param {number} r 
 * @param {number} a 
 * @param {number} b 
 * @param {string} fig_option название фигуры
 * @returns 
 */
function PlotFigure(x, y, color, backcolor, alg_option, r, a, b, fig_option) {
    if (r <= 0 || a <= 0 || b <= 0) {
        alert("Ошибка! Параметры длины и радиусов должны быть строго положительными! Проверьте ввод");
        return;
    }
    layer.destroyChildren();
    refresh_graph(layer, xAxis, yAxis);
    stage.getContainer().style.backgroundColor = backcolor;

    SwitchAlg(alg_option, fig_option, x, y, color, layer, r, a, b);
}


document.getElementById('submit').addEventListener("click", function() {
    //* @typedef number, number, string, string, string, number, number, number, string
    var [x, y, color, backcolor, alg_option, r, a, b, fig_option] = GetUserDataDefault('collect-data-for-figure');
    PlotFigure(x, y, color, backcolor, alg_option, r, a, b, fig_option);
});