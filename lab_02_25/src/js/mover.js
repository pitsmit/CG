/**
 * получение данных от пользователя
 * @param {string} ID id html элемента для забора данных 
 * @returns dx, dy
 */
function GetMoverData(ID){
    var el = document.getElementById(ID);
    var dx = Number(el.dx.value);
    var dy = Number(el.dy.value);

    return [dx, dy];
}

/**
 * перемещение объекта
 * @param {konva-object} Group объект
 */
export function MakeMove(Group) {
    var [dx, dy] = GetMoverData('mover');

    for (var key in Group) {
        Group[key].x += dx;
        Group[key].y += dy;

        Group[key].xn += dx;
        Group[key].yn += dy;

        Group[key].xk += dx;
        Group[key].yk += dy;
    }
}