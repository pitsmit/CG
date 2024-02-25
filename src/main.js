import { stage, create_obj_line, refresh_graph, create_obj_circle, create_obj_ellipse, CatGroup } from './geometrical_objects.js';
import { MakeMove } from './mover.js';

const SUCCESS = 0;
const SAME_DOTS = -1;
const LOW_OR_EMPTY_TABLE = -2;
const BAD_SYMBOLS = -3;
const INVALID_DATA = -4;
const BAD_CIRCLES = -5;

const width = window.innerWidth;
const height = window.innerHeight;

export var layer = new Konva.Layer();
export var xAxis = create_obj_line([-stage.width() / stage.scale().x, stage.height() / 2, stage.width() / stage.scale().x, stage.height() / 2], 'black', 3);
export var yAxis = create_obj_line([stage.width() / 2, -stage.height() / stage.scale().y, stage.width() / 2, stage.height() / stage.scale().y], 'black', 3);
stage.add(layer);
refresh_graph(layer, xAxis, yAxis);


var head = create_obj_circle(-200, 0, 100, NaN, "black", 4);
var body = create_obj_ellipse(head.radius() * 2, head.radius() + 10, head.x() + head.radius() * 3, head.y(), NaN, 'black', 4);
var left_leg_high = create_obj_line([body.x() - 40, body.y() + 200, body.x() - 40, body.y() + 110], 'black', 4);
var left_leg_low = create_obj_line([left_leg_high.points()[0], left_leg_high.points()[1], left_leg_high.points()[0] - 30, left_leg_high.points()[1]], 'black', 4);


var right_leg_high = create_obj_line([left_leg_high.points()[0] + 80, left_leg_high.points()[1], left_leg_high.points()[0] + 80, left_leg_high.points()[3]], 'black', 4);
var right_leg_low = create_obj_line([right_leg_high.points()[2] - 30, left_leg_high.points()[1], right_leg_high.points()[2], left_leg_high.points()[1]], 'black', 4);


CatGroup.add(head);
CatGroup.add(body);
CatGroup.add(left_leg_high);
CatGroup.add(right_leg_high);
CatGroup.add(left_leg_low);
CatGroup.add(right_leg_low);

//var line = create_obj_line([300 - 650, -300 + 600, 900 - 650, -900 + 600], 'black', 4);
//var line = create_obj_line([300, 300, 1000, 900], 'black', 4);
//var head = create_obj_circle(0, 0, 100, NaN, "black", 4);
//CatGroup.add(line);
//CatGroup.add(head);
layer.add(CatGroup);
//CatGroup.setAttr('x', width / 2);
//CatGroup.setAttr('y', height / 2);


function MakeScale(Group, layer){
    var el = document.getElementById('scaling');
    var x = Number(el.x.value);
    var y = Number(el.y.value);
    var kx = Number(el.kx.value);
    var ky = Number(el.ky.value);

    var now_x = Group.getAttr('x');
    var now_y = Group.getAttr('y');
    console.log(now_x - width / 2, now_y - height / 2);
    var new_x = kx * (now_x - width / 2) + x * (1 - kx); /// координаты нового центра в адекватных величинах
    var new_y = ky * (Math.abs(now_y - height / 2)) + y * (1 - ky);
    console.log(new_x, new_y);

    Group.setAttr('x', x + width / 2); //// ставим новый центр туда относительно которой точки масштабируем
    Group.setAttr('y', height / 2 - y);

    Group.setAttr('scaleX', kx * Group.getAttr('scaleX'));
    Group.setAttr('scaleY', ky * Group.getAttr('scaleY'));

    Group.setAttr('x', new_x + width / 2);
    Group.setAttr('y', height / 2 - new_y);

    layer.draw();
}





document.getElementById('mover').addEventListener("submit", function(){
    MakeMove(CatGroup, layer);
});
document.getElementById('scaling').addEventListener("submit", function(){
    MakeScale(CatGroup, layer);
});