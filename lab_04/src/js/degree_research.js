import {addWheel,addButton} from './events.js';
import {layer,stage,xAxis, yAxis,refresh_graph} from './geometrical_objects.js';
import { SwitchAlg } from './switcher.js';
import {GetUserDataDegree} from './getdata.js';

stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
addWheel(stage, layer, xAxis, yAxis);
addButton("collect-data-for-degree-figure");


/**
 * запуск алгоритма построения серии фигур после получения данных от пользователя
 * @param {number} x 
 * @param {number} y 
 * @param {string} color 
 * @param {string} backcolor 
 * @param {string} alg_option название алгоритма
 * @param {number} r 
 * @param {number} a 
 * @param {number} b 
 * @param {string} fig_option название фигуры
 * @param {number} shag_radius шаг для радиуса
 * @param {number} countfig количество фигур
 */
function PlotFigures(x, y, color, backcolor, alg_option, r, a, b, fig_option, shag_radius, countfig) {
    
    layer.destroyChildren();
    refresh_graph(layer, xAxis, yAxis);
    stage.getContainer().style.backgroundColor = backcolor;

    for (var i = 0; i < countfig; i++) {
        SwitchAlg(alg_option, fig_option, x, y, color, layer, r, a, b);
        r += shag_radius;
        a += shag_radius;
        b += shag_radius;
    }
}


document.getElementById('collect-data-for-degree-figure').addEventListener("submit", function() {
    //* @typedef number, number, string, string, string, number, number, number, string, number, number
    var [x, y, color, backcolor, alg_option, r, a, b, fig_option, shag_radius, countfig] = GetUserDataDegree('collect-data-for-degree-figure');
    PlotFigures(x, y, color, backcolor, alg_option, r, a, b, fig_option, shag_radius, countfig);
});