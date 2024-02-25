import { stage, create_obj_line, refresh_graph, create_obj_circle, create_obj_ellipse, CatGroup } from './geometrical_objects.js';
import { MakeMove } from './mover.js';
import { MakeScale } from './scaler.js';
import { MakeRotate } from './rotator.js';

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
var left_eye = create_obj_circle(head.x() - 50, head.y() - 50, 10, "black", "black", 4);
var right_eye = create_obj_circle(head.x() + 50, head.y() - 50, 10, "black", "black", 4);
var mustache_1 = create_obj_line([head.x() - 10, head.y() - 20, head.x() + 10, head.y() + 20], 'black', 4);
var mustache_2 = create_obj_line([head.x() - 20, head.y(), head.x() + 20, head.y()], 'black', 4);
var mustache_3 = create_obj_line([head.x() - 10, head.y() + 20, head.x() + 10, head.y() - 20], 'black', 4);
var body = create_obj_ellipse(head.radius() * 2, head.radius() + 10, head.x() + head.radius() * 3, head.y(), NaN, 'black', 4);
var left_leg_high = create_obj_line([body.x() - 40, body.y() + 200, body.x() - 40, body.y() + 110], 'black', 4);
var left_leg_low = create_obj_line([left_leg_high.points()[0], left_leg_high.points()[1], left_leg_high.points()[0] - 30, left_leg_high.points()[1]], 'black', 4);
var right_leg_high = create_obj_line([left_leg_high.points()[0] + 80, left_leg_high.points()[1], left_leg_high.points()[0] + 80, left_leg_high.points()[3]], 'black', 4);
var right_leg_low = create_obj_line([right_leg_high.points()[2] + 30, left_leg_high.points()[1], right_leg_high.points()[2], left_leg_high.points()[1]], 'black', 4);

CatGroup.add(head);
CatGroup.add(body);
CatGroup.add(left_leg_high);
CatGroup.add(right_leg_high);
CatGroup.add(left_leg_low);
CatGroup.add(right_leg_low);
CatGroup.add(left_eye);
CatGroup.add(right_eye);
CatGroup.add(mustache_1);
CatGroup.add(mustache_2);
CatGroup.add(mustache_3);
layer.add(CatGroup);

var stack = [];

stack.push([
    CatGroup.getAttr('x'),
    CatGroup.getAttr('y'),
    CatGroup.getAttr('scaleX'),
    CatGroup.getAttr('scaleY'),
    CatGroup.getAttr('rotation'),
]);


function del_from_stack(Group, st){
    console.log(st);
    if (st.length == 1){
        Group.setAttr('x', st[0][0]);
        Group.setAttr('y', st[0][1]);
        Group.setAttr('scaleX', st[0][2]);
        Group.setAttr('scaleY', st[0][3]);
        Group.setAttr('rotation', st[0][4]);
        return;
    }
    var res = st.pop();
    console.log(res);
    Group.setAttr('x', res[0]);
    Group.setAttr('y', res[1]);
    Group.setAttr('scaleX', res[2]);
    Group.setAttr('scaleY', res[3]);
    Group.setAttr('rotation', res[4]);
}

document.getElementById('mover').addEventListener("submit", function(){
    MakeMove(CatGroup, layer, stack);
});
document.getElementById('scaling').addEventListener("submit", function(){
    MakeScale(CatGroup, layer, stack);
});
document.getElementById('rotator').addEventListener("submit", function(){
    MakeRotate(CatGroup, layer, stack);
});
document.getElementById('back-button').addEventListener("click", function(){
    del_from_stack(CatGroup, stack);
});