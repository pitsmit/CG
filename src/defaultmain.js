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
    LibraryFunctionCircle,
    LibraryFunctionEllipse,
    BrezCircle,
    BrezEllipse,
    CanonCircle,
    CanonEllipse,
    ParamCircle,
    ParamEllipse
} from './algho_runner.js';

stage.add(layer);
refresh_graph(layer, xAxis, yAxis);
addWheel(stage, layer, xAxis, yAxis);
addButton(Info, Task, Instruction, "collect-data-for-figure");


/**
 * получение данных от пользователя
 * @param {string} form id формочки 
 * @returns x, y центра фигуры, цвет фигуры и заднего фона, алгоритм, радиус для окружности, A, B для эллипса, название выбранной фигуры
 */
function GetUserData(form) {
    var el = document.getElementById(form); //* @typedef html-object

    var x = parseFloat(el.x.value); //* @typedef number
    var y = parseFloat(el.y.value); //* @typedef number

    var color = el.favcolor.value; //* @typedef string
    var backcolor = el.back.value; //* @typedef string
    var options = document.getElementsByName('state'); //* @typedef html-object
    var alg_option; //* @typedef string
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            alg_option = options[i].value;
            break;
        }
    }

    options = document.getElementsByName('fig');
    var fig_option; //* @typedef string
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            fig_option = options[i].value;
            break;
        }
    }

    var r, a, b; //* @typedef number, number, number
    if (fig_option == "circle") {
        el = document.getElementById('r');
        r = parseFloat(el.value);
        a = NaN;
        b = NaN;
    } else if (fig_option == "ellipse") {
        el = document.getElementById('collect-data-for-ellipse');
        a = parseFloat(el.a.value);
        b = parseFloat(el.b.value);
        r = NaN;
    }

    //* @typedef number, number, string, string, string, number, number, number, string
    return [x, y, color, backcolor, alg_option, r, a, b, fig_option];
}


/**
 * запускает алгоритм построения отрезка в зависимости от того что в формочке
 * @param {string} form id формочки
 */
function SwitchAlghorithm(form) {
    //* @typedef number, number, string, string, string, number, number, number, string
    var [x, y, color, backcolor, alg_option, r, a, b, fig_option] = GetUserData(form);
    if (r <= 0 || a <= 0 || b <= 0) {
        alert("Ошибка! Параметры длины и радиусов должны быть строго положительными! Проверьте ввод");
        return;
    }
    layer.destroyChildren();
    refresh_graph(layer, xAxis, yAxis);
    stage.getContainer().style.backgroundColor = backcolor;

    switch (alg_option) {
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
}


document.getElementById('submit').addEventListener("click", function() {
    SwitchAlghorithm('collect-data-for-figure');
});