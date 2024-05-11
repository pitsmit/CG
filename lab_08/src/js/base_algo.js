/**
 * закраска пикслея
 * @param {number} x 
 * @param {number} y 
 * @param {string} color цвет
 */
function SetRect(x, y, color, r=1){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), r, r);
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