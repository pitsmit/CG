/**
 * получение данных от пользователя
 * @param {string} form id формочки 
 * @returns x, y начала и конца отрезка, цвет отрезка и заднего фона, алгоритм
 */
export function GetUserDataDefault(form) {
    var el = document.getElementById(form);
    var xn = parseFloat(el.xn.value);
    var yn = parseFloat(el.yn.value);
    var xk = parseFloat(el.xk.value);
    var yk = parseFloat(el.yk.value);
    var color = el.favcolor.value;
    var backcolor = el.back.value;
    var options = document.getElementsByName('state');
    var option_value;
    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            option_value = options[i].value;
            break;
        }
    }

    return [xn, yn, xk, yk, color, option_value, backcolor];
}


/**
 * чтение данных от пользователя
 * @param {string} form id формочки 
 * @returns длина отрезка, шаг угла, цвет отрезка, алгоритм, цвет фона
 */
export function GetUserDataDegree(form) {
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
