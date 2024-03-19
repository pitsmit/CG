/**
 * Получение имени для алгоритма и фигуры от пользователя
 * @param {string} algform имя формы с алгоритмом
 * @param {string} figureform имя формы с фигурой
 * @returns {string, string} имя алгоритма и фигуры
 */
function GetAlgAndFigure(algform, figureform){
    var alg_option; //* @typedef string
    var fig_option; //* @typedef string

    var options = document.getElementsByName(algform); //* @typedef html-object
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            alg_option = options[i].value;
            break;
        }
    }

    options = document.getElementsByName(figureform);
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            fig_option = options[i].value;
            break;
        }
    }

    return [alg_option, fig_option];
}


/**
 * получение данных от пользователя для построения единичной окружности/эллипса
 * @param {string} form id формочки 
 * @returns x, y центра фигуры, цвет фигуры и заднего фона, алгоритм, радиус для окружности, A, B для эллипса, название выбранной фигуры
 */
export function GetUserDataDefault(form) {
    var el = document.getElementById(form); //* @typedef html-object

    var x = parseFloat(el.x.value); //* @typedef number
    var y = parseFloat(el.y.value); //* @typedef number
    var color = el.favcolor.value; //* @typedef string
    var backcolor = el.back.value; //* @typedef string

    var [alg_option, fig_option] = GetAlgAndFigure('state', 'fig');

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
 * получение данных от пользователя для построения нескольких окружности/эллипса
 * @param {string} form id формочки 
 * @returns длина отрезка, шаг угла, цвет отрезка, алгоритм, цвет фона
 */
export function GetUserDataDegree(form) {
    var el = document.getElementById(form); //* @typedef html-object

    var x = parseFloat(el.x.value); //* @typedef number
    var y = parseFloat(el.y.value); //* @typedef number
    var color = el.favcolor.value; //* @typedef string
    var backcolor = el.back.value; //* @typedef string

    var shag_radius = parseFloat(el.rdelta.value); //* @typedef number
    var countfig = parseFloat(el.countfig.value); //* @typedef number

    var [alg_option, fig_option] = GetAlgAndFigure('state', 'fig');

    var r, a, b; //* @typedef number, number, number
    if (fig_option == "circle") {
        el = document.getElementById('r');
        r = parseFloat(el.value);
        a = NaN;
        b = NaN;
    } else if (fig_option == "ellipse") {
        a = parseFloat(document.getElementById('a').value);
        b = parseFloat(document.getElementById('b').value);
        r = NaN;
    }

    //* @typedef number, number, string, string, string, number, number, number, string, number, number
    return [x, y, color, backcolor, alg_option, r, a, b, fig_option, shag_radius, countfig];
}


/**
 * получение данных от пользователя для замерного эксперимента
 * @param {string} form id формочки 
 * @returns радиус начальной окружности, начальные радиусы для эллипса, шаг увеличения радиуса, количество фигур
 */
export function GetUserDataTimer(form){
    var el = document.getElementById(form); //* @typedef html-object
    var startcircle = parseFloat(el.startcircle.value); //* @typedef number
    var starta = parseFloat(el.starta.value); //* @typedef number
    var startb = parseFloat(el.startb.value); //* @typedef number
    var shagrad = parseFloat(el.shagrad.value); //* @typedef number
    var countfig = parseFloat(el.countfig.value); //* @typedef number

    return [startcircle, starta, startb, shagrad, countfig];
}