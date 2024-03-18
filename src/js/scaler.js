import { StackPush } from './stack.js';


/**
 * масштабирование объекта
 * @param {konva-object} Group объект
 * @param {konva-object} layer канвас
 * @param {array of konva-objects} stack стэк 
 */
export function MakeScale(Group, layer, stack){
    var el = document.getElementById('scaling');
    var x = Number(el.x.value);
    var y = Number(el.y.value);
    var kx = Number(el.kx.value);
    var ky = Number(el.ky.value);

    var now_x = Group.getAttr('x');
    var now_y = Group.getAttr('y');

    var new_x = kx * (now_x - width / 2) + x * (1 - kx); /// координаты нового центра в адекватных величинах
    var new_y = ky * (height / 2 - now_y) + y * (1 - ky);

    Group.setAttr('x', x + width / 2); //// ставим новый центр туда относительно которой точки масштабируем
    Group.setAttr('y', height / 2 - y);

    Group.setAttr('scaleX', kx * Group.getAttr('scaleX'));
    Group.setAttr('scaleY', ky * Group.getAttr('scaleY'));

    Group.setAttr('x', new_x + width / 2);
    Group.setAttr('y', height / 2 - new_y);

    layer.draw();
    StackPush(stack, Group);
}