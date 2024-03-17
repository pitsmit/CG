import { addWheel, addButton } from './events.js';
import { layer, stage, xAxis, yAxis, refresh_graph } from './geometrical_objects.js';
import { Info, Task, Instruction } from './info-functions.js';
import { LibraryFunctionCircle, LibraryFunctionEllipse, BrezCircle, BrezEllipse, CanonCircle, CanonEllipse, ParamCircle, ParamEllipse } from './algho_runner.js';

stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
addWheel(stage, layer, xAxis, yAxis);
addButton(Info, Task, Instruction, "collect-data-for-degree-figure");


/**
 * чтение данных от пользователя
 * @param {string} form id формочки 
 * @returns длина отрезка, шаг угла, цвет отрезка, алгоритм, цвет фона
 */
function GetUserDataDegree(form){
    var el = document.getElementById(form);

    var x = parseFloat(el.x.value);
    var y = parseFloat(el.y.value);
    var color = el.favcolor.value;
    var backcolor = el.back.value;
    var shag_radius = parseFloat(el.rdelta.value);
    var countfig = parseFloat(el.countfig.value);

    var options = document.getElementsByName('state');
    var alg_option;
    for(var i = 0; i < options.length; i++){
        if(options[i].checked){
            alg_option = options[i].value;
            break;
        }
    }

    options = document.getElementsByName('fig');
    var fig_option;
    for(var i = 0; i < options.length; i++){
        if(options[i].checked){
            fig_option = options[i].value;
            break;
        }
    }

    var r, a, b;
    if (fig_option == "circle"){
        el = document.getElementById('r');
        r = parseFloat(el.value);
        a = NaN;
        b = NaN;
    }
    else if (fig_option == "ellipse"){
        a = parseFloat(document.getElementById('a').value);
        b = parseFloat(document.getElementById('b').value);
        r = NaN;
    }

    return [x, y, color, backcolor, alg_option, r, a, b, fig_option, shag_radius, countfig];
}


/**
 * пострение кругов(как на воде когда капля падает)
 */
function plot_figures(){
    var [x, y, color, backcolor, alg_option, r, a, b, fig_option, shag_radius, countfig] = GetUserDataDegree('collect-data-for-degree-figure');

    layer.destroyChildren();
    refresh_graph(layer, xAxis, yAxis);
    stage.getContainer().style.backgroundColor = backcolor;

    for (var i = 0; i < countfig; i++){
        switch(alg_option){
            case "library-function":
                if (fig_option == "circle")
                    LibraryFunctionCircle(x, y, color, layer, r);
                else
                    LibraryFunctionEllipse(x, y, color, layer, a, b);
                break;
            case "Brez":
                if (fig_option == "circle")
                    BrezCircle(x, y, color, layer, r);
                else
                    BrezEllipse(x, y, color, layer, a, b);
                break;
            case "Canon":
                if (fig_option == "circle")
                    CanonCircle(x, y, color, layer, r);
                else
                    CanonEllipse(x, y, color, layer, a, b);
                break;
            case "Param":
                if (fig_option == "circle")
                    ParamCircle(x, y, color, layer, r);
                else
                    ParamEllipse(x, y, color, layer, a, b);
                break;
        }

        r += shag_radius;
        a += shag_radius;
        b += shag_radius;
    }
}


document.getElementById('collect-data-for-degree-figure').addEventListener("submit", function() {
    plot_figures();
});