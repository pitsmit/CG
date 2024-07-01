import {create_obj_ellipse,create_obj_circle,create_obj_rect} from "./geometrical_objects.js";


/**
 * закраска пикселей симметрично относительно центра окружности
 * @param {number} xn текущего пикселя
 * @param {number} x центра окружности
 * @param {number} yn текущего пикселя
 * @param {number} y центра окружности
 * @param {konva-object} layer полотно для рисования
 * @param {string} color цвет рисования
 */
function DrawSymPoints(xn, x, yn, y, layer, color) {
    //* @typedef rect - konva-object
    var rect = create_obj_rect(xn + x + width / 2, height / 2 - (yn + y), 1, 1, color);
    layer.add(rect);

    rect = create_obj_rect(-xn + x + width / 2, height / 2 - (yn + y), 1, 1, color);
    layer.add(rect);

    rect = create_obj_rect(xn + x + width / 2, height / 2 + yn - y, 1, 1, color);
    layer.add(rect);

    rect = create_obj_rect(-xn + x + width / 2, height / 2 + yn - y, 1, 1, color);
    layer.add(rect);
}


/**
 * библиотечное построение окружности
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} r радиус
 */
export function LibraryFunctionCircle(x, y, color, layer, r) {
    if (r <= 0)
        return;

    //* @typedef circle - konva-object
    var circle = create_obj_circle(x + width / 2, height / 2 - y, r, NaN, color, 1);
    layer.add(circle);
}


/**
 * библиотечное построение эллипса
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} a радиус по горизонтали
 * @param {number} b радиус по вертикали
 */
export function LibraryFunctionEllipse(x, y, color, layer, a, b) {
    if (a <= 0 || b <= 0)
        return;

    //* @typedef ellipse - konva-object
    var ellipse = create_obj_ellipse(a, b, x + width / 2, height / 2 - y, NaN, color, 1);
    layer.add(ellipse);
}


/**
 * построение окружности по брезенхему
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} r радиус
 */
export function BrezCircle(x, y, color, layer, r) {
    if (r <= 0)
        return;
    var xn = 0; //* @typedef number
    var yn = r; //* @typedef number
    var delta = 2 * (1 - yn); //* @typedef number
    var d1; //* @typedef number
    var d2; //* @typedef number

    DrawSymPoints(xn, x, yn, y, layer, color);

    while (yn > 0) {
        if (delta < 0) {
            d1 = 2 * delta + 2 * yn - 1;
            xn += 1;
            if (d1 <= 0)
                delta += 2 * xn + 1;
            else if (d1 > 0) {
                yn -= 1;
                delta += 2 * (xn - yn + 1);
            }
        } else if (delta > 0) {
            d2 = 2 * delta - 2 * xn - 1;
            yn -= 1;
            if (d2 <= 0) {
                xn += 1;
                delta += 2 * (xn - yn + 1);
            } else if (d2 > 0)
                delta -= 2 * yn + 1;
        } else {
            xn += 1;
            yn -= 1;
            delta += 2 * (xn - yn + 1);
        }

        DrawSymPoints(xn, x, yn, y, layer, color);
    }
}


/**
 * построение эллипса по брезенхему
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} a радиус по горизонтали
 * @param {number} b радиус по вертикали
 */
export function BrezEllipse(x, y, color, layer, a, b) {
    if (a <= 0 || b <= 0)
        return;
    var xn = 0; //* @typedef number
    var yn = b; //* @typedef number
    var delta = b ** 2 - a ** 2 * (2 * b + 1); //* @typedef number
    var d1; //* @typedef number
    var d2; //* @typedef number

    DrawSymPoints(xn, x, yn, y, layer, color);

    while (yn > 0) {
        if (delta < 0) {
            d1 = 2 * delta + a ** 2 * (2 * yn + 2);
            xn += 1;
            if (d1 < 0)
                delta += b ** 2 * (2 * xn + 1);
            else {
                yn -= 1;
                delta += b ** 2 * (2 * xn + 1) + a ** 2 * (1 - 2 * yn);
            }
        } else if (delta > 0) {
            d2 = 2 * delta + b ** 2 * (2 - 2 * xn);
            yn -= 1;
            if (d2 > 0)
                delta += a ** 2 * (1 - 2 * yn);
            else {
                xn += 1;
                delta += b ** 2 * (2 * xn + 1) + a ** 2 * (1 - 2 * yn);
            }
        } else {
            yn -= 1;
            xn += 1;
            delta += b ** 2 * (2 * xn + 1) + a ** 2 * (1 - 2 * yn);
        }

        DrawSymPoints(xn, x, yn, y, layer, color);
    }
}


/**
 * построение окружности по каноническому уравнению
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} r радиус
 */
export function CanonCircle(x, y, color, layer, r) {
    if (r <= 0)
        return;
    var yn; //* @typedef number
    var border = Math.round(x + r); //* @typedef number

    for (var xn = x; xn < border + 1; xn++) {
        yn = y + Math.sqrt(r ** 2 - (xn - x) ** 2);
        DrawSymPoints(xn - x, x, yn - y, y, layer, color);
    }
}


/**
 * построение эллипса по каноническому уравнению
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} a радиус по горизонтали
 * @param {number} b радиус по вертикали
 */
export function CanonEllipse(x, y, color, layer, a, b) {
    if (a <= 0 || b <= 0)
        return;
    var Xbord = Math.round(x + a / Math.sqrt(1 + b ** 2 / a ** 2)); //* @typedef number
    var Ybord = Math.round(y + b / Math.sqrt(1 + a ** 2 / b ** 2)); //* @typedef number
    var yn; //* @typedef number
    var xn; //* @typedef number

    for (var xn = Math.round(x); xn < Xbord + 1; xn++) {
        yn = y + Math.sqrt(a ** 2 * b ** 2 - (xn - x) ** 2 * b ** 2) / a;
        DrawSymPoints(xn - x, x, yn - y, y, layer, color);
    }

    for (var yn = Ybord; yn > Math.round(y) - 1; yn--) {
        xn = x + Math.sqrt(a ** 2 * b ** 2 - (yn - y) ** 2 * a ** 2) / b;
        DrawSymPoints(xn - x, x, yn - y, y, layer, color);
    }
}


/**
 * построение окружности по параметрическому уравнению
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} r радиус
 */
export function ParamCircle(x, y, color, layer, r) {
    if (r <= 0)
        return;
    var step = 1 / r; //* @typedef number
    var xn; //* @typedef number
    var yn; //* @typedef number

    for (var i = 0; i <= Math.PI / 2 + step; i += step) {
        xn = x + r * Math.cos(i);
        yn = y + r * Math.sin(i);

        DrawSymPoints(xn - x, x, yn - y, y, layer, color);
    }
}


/**
 * построение эллипса по параметрическому уравнению
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 * @param {konva-object} layer полотно для рисования
 * @param {number} a радиус по горизонтали
 * @param {number} b радиус по вертикали
 */
export function ParamEllipse(x, y, color, layer, a, b) {
    if (a <= 0 || b <= 0)
        return;
    var step = a > b ? 1 / a : 1 / b; //* @typedef number
    var xn; //* @typedef number
    var yn; //* @typedef number

    for (var i = 0; i <= Math.PI / 2 + step; i += step) {
        xn = x + Math.round(a * Math.cos(i));
        yn = y + Math.round(b * Math.sin(i));

        DrawSymPoints(xn - x, x, yn - y, y, layer, color);
    }
}