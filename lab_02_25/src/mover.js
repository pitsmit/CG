import { Module } from './c-func/info.js';
import { StackPush } from './stack.js';

/**
 * перемещение объекта
 * @param {konva-object} Group объект
 * @param {konva-object} layer канвас
 * @param {array of konva-objects} stack стэк  
 */
export function MakeMove(Group, layer, stack) {
    var el = document.getElementById('mover');
    var dx = Number(el.dx.value);
    var dy = Number(el.dy.value);

    var n_x = Group.getAttr('x');
    var n_y = Group.getAttr('y');

    var new_x = Module._add(dx, n_x);
    var new_y = Module._add(dy, n_y);
    Group.setAttr('x', new_x);
    Group.setAttr('y', new_y);

    layer.draw();
    StackPush(stack, Group);
}