/**
 * получение данных от пользователя
 * @param {string} ID id html элемента для забора данных 
 * @returns x, y, kx, ky
 */
function GetScalerData(ID){
    var el = document.getElementById(ID);
    var x = Number(el.x.value);
    var y = Number(el.y.value);
    var kx = Number(el.kx.value);
    var ky = Number(el.ky.value);

    return [x, y, kx, ky];
}

/**
 * масштабирование объекта
 * @param {konva-object} Group объект
 */
export function MakeScale(Group){
    var [x, y, kx, ky] = GetScalerData('scaling');

    for (var key in Group) {
        Group[key].radiusa *= Math.abs(kx);
        Group[key].radiusb *= Math.abs(ky);

        var now_x = Group[key].x;
        var now_y = Group[key].y;
        var new_x = kx * (now_x) + x * (1 - kx);
        var new_y = ky * (now_y) + y * (1 - ky);

        Group[key].x = new_x;
        Group[key].y = new_y;

        var now_x = Group[key].xn;
        var now_y = Group[key].yn;
        var new_x = kx * (now_x) + x * (1 - kx);
        var new_y = ky * (now_y) + y * (1 - ky);

        Group[key].xn = new_x;
        Group[key].yn = new_y;

        var now_x = Group[key].xk;
        var now_y = Group[key].yk;
        var new_x = kx * (now_x) + x * (1 - kx);
        var new_y = ky * (now_y) + y * (1 - ky);

        Group[key].xk = new_x;
        Group[key].yk = new_y;
    }
}