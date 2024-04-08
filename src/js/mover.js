import { StackPush } from './stack.js';

/**
 * перемещение объекта
 * @param {konva-object} Group объект
 */
export function MakeMove(Group) {
    var el = document.getElementById('mover');
    var dx = Number(el.dx.value);
    var dy = Number(el.dy.value);

    var n_x = Group.getAttr('x');
    var n_y = Group.getAttr('y');

    Group.setAttr('x', dx + n_x);
    Group.setAttr('y', dy + n_y);

    StackPush(Group);
}