/**
 * закраска пикслея
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 */
export function SetRect(x, y, color, r=1){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), r, r);
}


/**
 * закраска пикселей симметрично относительно центра окружности
 * @param {number} xn текущего пикселя
 * @param {number} x центра окружности
 * @param {number} yn текущего пикселя
 * @param {number} y центра окружности
 * @param {string} color цвет рисования
 */
function DrawSymPoints(xn, x, yn, y, color) {
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(xn + x, (yn + y), 2, 2);
    ctx.fillRect(-xn + x, (yn + y), 2, 2);
    ctx.fillRect(xn + x, (-yn + y), 2, 2);
    ctx.fillRect(-xn + x, (-yn + y), 2, 2);
}


/**
 * алгоритм ЦДА
 * @param {number} xn x начала
 * @param {number} yn у начала
 * @param {number} xk х конца
 * @param {number} yk у конца
 * @param {string} color цвет отрезка
 */
export function CDA(xn, yn, xk, yk, color) {
    var x = xn;
    var y = yn;

    var delta_x = xk - xn;
    var delta_y = yk - yn;

    var l = Math.abs(delta_x) > Math.abs(delta_y) ? Math.abs(delta_x) : Math.abs(delta_y);

    delta_x /= l;
    delta_y /= l;

    for (var i = 0; i <= l + 1; i++) {
        SetRect(x, y, color, 2);
        x += delta_x;
        y += delta_y;
    }
}


/**
 * построение окружности по брезенхему
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 * @param {number} r радиус
 */
export function BrezCircle(x, y, color, r) {
    if (r <= 0)
        return;
    var xn = 0; //* @typedef number
    var yn = r; //* @typedef number
    var delta = 2 * (1 - yn); //* @typedef number
    var d1; //* @typedef number
    var d2; //* @typedef number

    DrawSymPoints(xn, x, yn, y, color);
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

        DrawSymPoints(xn, x, yn, y, color);
    }
}