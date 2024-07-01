/**
 * получение данных от пользователя
 * @param {string} ID id html элемента для забора данных 
 * @returns x, y, q
 */
function GetRotatorData(ID){
    var el = document.getElementById(ID);
    var x = Number(el.x.value);
    var y = Number(el.y.value);
    var q = Number(el.q.value);

    return [x, y, q];
}

/**
 * поворот объекта
 * @param {konva-object} Group объект
 */
export function MakeRotate(Group){
    var [x, y, q] = GetRotatorData('rotator');

    for (var key in Group) {
        Group[key].angle = q * Math.PI / 180;
        Group[key].rotX = x;
        Group[key].rotY = y;

        var now_x = Group[key].x;
        var now_y = Group[key].y;

        var want_x = x + (now_x - x) * Math.cos(q * Math.PI / 180) + (now_y - y) * Math.sin(q * Math.PI / 180);
        var want_y = y - (now_x - x) * Math.sin(q * Math.PI / 180) + (now_y - y) * Math.cos(q * Math.PI / 180);

        Group[key].x = want_x;
        Group[key].y = want_y;

        var now_x = Group[key].xn;
        var now_y = Group[key].yn;

        var want_x = x + (now_x - x) * Math.cos(q * Math.PI / 180) + (now_y - y) * Math.sin(q * Math.PI / 180);
        var want_y = y - (now_x - x) * Math.sin(q * Math.PI / 180) + (now_y - y) * Math.cos(q * Math.PI / 180);

        Group[key].xn = want_x;
        Group[key].yn = want_y;

        var now_x = Group[key].xk;
        var now_y = Group[key].yk;

        var want_x = x + (now_x - x) * Math.cos(q * Math.PI / 180) + (now_y - y) * Math.sin(q * Math.PI / 180);
        var want_y = y - (now_x - x) * Math.sin(q * Math.PI / 180) + (now_y - y) * Math.cos(q * Math.PI / 180);

        Group[key].xk = want_x;
        Group[key].yk = want_y;
    }
}