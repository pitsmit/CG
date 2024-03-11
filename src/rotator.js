import { Module } from './c-func/info.js';
import { StackPush } from './stack.js';

/**
 * поворот объекта
 * @param {konva-object} Group объект
 * @param {konva-object} layer канвас
 * @param {array of konva-objects} stack стэк  
 */
export function MakeRotate(Group, layer, stack){
    var el = document.getElementById('rotator');
    var x = Number(el.x.value);
    var y = Number(el.y.value);
    var q = Number(el.q.value);

    var now_x = Group.getAttr('x') - width / 2;
    var now_y = height / 2 - Group.getAttr('y');

    var want_x = Module._find_x(x, now_x, q, y, now_y);
    var want_y = Module._find_y(x, now_x, q, y, now_y);

    Group.setAttr('x', want_x + width / 2);
    Group.setAttr('y', height / 2 - want_y);
    Group.setAttr('rotation', q + Group.getAttr('rotation'));

    layer.draw();
    StackPush(stack, Group);
}