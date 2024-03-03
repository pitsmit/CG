import { Module } from './c-func/info.js';
import { StackPush } from './stack.js';

const width = window.innerWidth;
const height = window.innerHeight;

export function MakeScale(Group, layer, stack){
    var el = document.getElementById('scaling');
    var x = Number(el.x.value);
    var y = Number(el.y.value);
    var kx = Number(el.kx.value);
    var ky = Number(el.ky.value);

    var now_x = Group.getAttr('x');
    var now_y = Group.getAttr('y');

    var new_x = Module._find_new_x(kx, now_x, x, width); /// координаты нового центра в адекватных величинах
    var new_y = Module._find_new_y(ky, now_y, y, height);

    Group.setAttr('x', x + width / 2); //// ставим новый центр туда относительно которой точки масштабируем
    Group.setAttr('y', height / 2 - y);

    Group.setAttr('scaleX', kx * Group.getAttr('scaleX'));
    Group.setAttr('scaleY', ky * Group.getAttr('scaleY'));

    Group.setAttr('x', new_x + width / 2);
    Group.setAttr('y', height / 2 - new_y);

    layer.draw();
    StackPush(stack, Group);
}
