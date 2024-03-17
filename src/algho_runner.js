import {
    create_obj_line,
    create_obj_rect
} from "./geometrical_objects.js";

/**
 * алгоритм ЦДА
 * @param {number} xn x начала
 * @param {number} yn у начала
 * @param {number} xk х конца
 * @param {number} yk у конца
 * @param {string} color цвет отрезка
 * @param {konva-object} layer канвас где строим
 * @param {number} width ширина экрана
 * @param {number} height высота экрана
 * @returns количество ступенек
 */
export function CDA(xn, yn, xk, yk, color, layer, width, height) {
    var x = xn;
    var y = yn;

    var delta_x = xk - xn;
    var delta_y = yk - yn;

    var l;

    if (Math.abs(delta_x) > Math.abs(delta_y))
        l = Math.abs(delta_x);
    else
        l = Math.abs(delta_y);

    delta_x /= l;
    delta_y /= l;

    var count_stypenka = 0;
    var prev_x = x;
    var prev_y = y;

    for (var i = 0; i <= l + 1; i++) {
        var rect = create_obj_rect(Math.round(x + width / 2), Math.round(height / 2 - y), 1, 1, color);
        layer.add(rect);
        x += delta_x;
        y += delta_y;

        if (prev_x != Math.round(x) && prev_y != Math.round(y))
            count_stypenka++;
        prev_x = Math.round(x);
        prev_y = Math.round(y);
    }

    return count_stypenka;
}

/**
 * алгоритм библиотечный
 * @param {number} xn x начала
 * @param {number} yn у начала
 * @param {number} xk х конца
 * @param {number} yk у конца
 * @param {string} color цвет отрезка
 * @param {konva-object} layer канвас где строим
 * @param {number} width ширина экрана
 * @param {number} height высота экрана
 * @returns количество ступенек
 */
export function LibraryFunction(xn, yn, xk, yk, color, layer, width, height) {
    var line = create_obj_line([xn + width / 2, height / 2 - yn, xk + width / 2, height / 2 - yk], color, 1);
    layer.add(line);
}

/**
 * алгоритм Брезенхема с действительными числами
 * @param {number} xn x начала
 * @param {number} yn у начала
 * @param {number} xk х конца
 * @param {number} yk у конца
 * @param {string} color цвет отрезка
 * @param {konva-object} layer канвас где строим
 * @param {number} width ширина экрана
 * @param {number} height высота экрана
 * @returns количество ступенек
 */
export function BrezReal(xn, yn, xk, yk, color, layer, width, height) {
    var x = xn;
    var y = yn;

    var dx = xk - xn;
    var dy = yk - yn;

    var sx;
    var sy;

    if (dx == 0)
        sx = 0;
    else if (dx > 0)
        sx = 1;
    else
        sx = -1;

    if (dy == 0)
        sy = 0;
    else if (dy > 0)
        sy = 1;
    else
        sy = -1;

    dx = Math.abs(dx);
    dy = Math.abs(dy);

    var obmen;

    if (dx > dy)
        obmen = 0;
    else {
        var t = dx;
        dx = dy;
        dy = t;
        obmen = 1;
    }

    var m = dy / dx;
    var e = m - 0.5;

    var count_stypenka = 0;
    var prev_y = y;
    var prev_x = x;

    for (var i = 1; i <= dx + 1; i++) {
        var rect = create_obj_rect(x + width / 2, height / 2 - y, 1, 1, color);
        layer.add(rect);
        if (e >= 0) {
            if (obmen == 0) {
                y += sy;
            } else {
                x += sx;
            }
            e -= 1;
        }
        if (e <= 0) {
            if (obmen == 0) {
                x += sx;
            } else {
                y += sy;
            }
            e += m;
        }

        if (prev_x != x && prev_y != y)
            count_stypenka++;
        prev_x = x;
        prev_y = y;

    }

    return count_stypenka;
}

/**
 * алгоритм Брезенхема с целыми числами
 * @param {number} xn x начала
 * @param {number} yn у начала
 * @param {number} xk х конца
 * @param {number} yk у конца
 * @param {string} color цвет отрезка
 * @param {konva-object} layer канвас где строим
 * @param {number} width ширина экрана
 * @param {number} height высота экрана
 * @returns количество ступенек
 */
export function BrezInt(xn, yn, xk, yk, color, layer, width, height) {
    var x = xn;
    var y = yn;

    var dx = xk - xn;
    var dy = yk - yn;

    var sx;
    var sy;

    if (dx == 0)
        sx = 0;
    else if (dx > 0)
        sx = 1;
    else
        sx = -1;

    if (dy == 0)
        sy = 0;
    else if (dy > 0)
        sy = 1;
    else
        sy = -1;

    dx = Math.abs(dx);
    dy = Math.abs(dy);

    var obmen;

    if (dx > dy)
        obmen = 0;
    else {
        var t = dx;
        dx = dy;
        dy = t;
        obmen = 1;
    }

    var e = 2 * dy - dx;

    var count_stypenka = 0;
    var prev_x = x;
    var prev_y = y;

    for (var i = 1; i <= dx + 1; i++) {
        var rect = create_obj_rect(x + width / 2, height / 2 - y, 1, 1, color);
        layer.add(rect);
        if (e >= 0) {
            if (obmen == 0) {
                y += sy;
            } else {
                x += sx;
            }
            e -= 2 * dx;
        }
        if (e <= 0) {
            if (obmen == 0)
                x += sx;
            else {
                y += sy;
            }
            e += 2 * dy;
        }

        if (prev_x != x && prev_y != y)
            count_stypenka++;
        prev_x = x;
        prev_y = y;
    }

    return count_stypenka;
}

/**
 * алгоритм Брезенхема с устранением ступенчатости
 * @param {number} xn x начала
 * @param {number} yn у начала
 * @param {number} xk х конца
 * @param {number} yk у конца
 * @param {string} color цвет отрезка
 * @param {konva-object} layer канвас где строим
 * @param {number} width ширина экрана
 * @param {number} height высота экрана
 * @returns количество ступенек
 */
export function BrezNoSteps(xn, yn, xk, yk, color, layer, width, height) {
    var x = xn;
    var y = yn;

    var dx = xk - xn;
    var dy = yk - yn;

    var sx;
    var sy;

    if (dx == 0)
        sx = 0;
    else if (dx > 0)
        sx = 1;
    else
        sx = -1;

    if (dy == 0)
        sy = 0;
    else if (dy > 0)
        sy = 1;
    else
        sy = -1;

    dx = Math.abs(dx);
    dy = Math.abs(dy);

    var m = dy / dx;
    var obmen;

    if (m > 1) {
        var t = dx;
        dx = dy;
        dy = t;
        obmen = 1;
        m = 1 / m;
    } else
        obmen = 0;

    var e = 1;
    var w = 1 - m;

    var count_stypenka = 0;
    var prev_x = x;
    var prev_y = y;

    var rect = create_obj_rect(x + width / 2, height / 2 - y, 1, 1, color, e);
    layer.add(rect);

    for (var i = 1; i <= dx + 1; i++) {
        if (e < w) {
            if (obmen == 0)
                x += sx;
            else {
                y += sy;
            }
            e += m;
        } else {
            x += sx;
            y += sy;
            e -= w;
        }

        if (prev_x != x && prev_y != y)
            count_stypenka++;
        prev_x = x;
        prev_y = y;

        rect = create_obj_rect(x + width / 2, height / 2 - y, 1, 1, color, e);
        layer.add(rect);
    }

    return count_stypenka;
}

/**
 * алгоритм Ву
 * @param {number} xn x начала
 * @param {number} yn у начала
 * @param {number} xk х конца
 * @param {number} yk у конца
 * @param {string} color цвет отрезка
 * @param {konva-object} layer канвас где строим
 * @param {number} width ширина экрана
 * @param {number} height высота экрана
 * @returns количество ступенек
 */
export function BY(xn, yn, xk, yk, color, layer, width, height) {

    var x = xn;
    var y = yn;

    var dx = xk - xn;
    var dy = yk - yn;

    var sx;
    var sy;

    if (dx == 0)
        sx = 0;
    else if (dx > 0)
        sx = 1;
    else
        sx = -1;

    if (dy == 0)
        sy = 0;
    else if (dy > 0)
        sy = 1;
    else
        sy = -1;

    dx = Math.abs(dx);
    dy = Math.abs(dy);

    var obmen;

    if (dx > dy)
        obmen = 0;
    else {
        var t = dx;
        dx = dy;
        dy = t;
        obmen = 1;
    }

    var m = dy / dx;
    var e = 0.5;
    var w = 1;

    var count_stypenka = 0;
    var prev_x = x;
    var prev_y = y;

    for (var i = 0; i < dx + 1; i++) {
        if (obmen == 0) {
            var rect = create_obj_rect(x + width / 2, height / 2 - y, 1, 1, color, -e);
            layer.add(rect);
            rect = create_obj_rect(x + width / 2, height / 2 - (y + sy), 1, 1, color, e - 1);
            layer.add(rect);
        } else {
            var rect = create_obj_rect(x + width / 2, height / 2 - y, 1, 1, color, e);
            layer.add(rect);
            rect = create_obj_rect(x + sx + width / 2, height / 2 - y, 1, 1, color, e - 1);
            layer.add(rect);
        }

        if (e >= w - m) {
            if (obmen == 0) {
                y += sy;
            } else
                x += sx;
            e -= 1;
        }
        if (obmen == 0)
            x += sx;
        else {
            y += sy;
        }
        e += m;

        if (prev_x != x && prev_y != y)
            count_stypenka++;
        prev_x = x;
        prev_y = y;
    }

    return count_stypenka;
}