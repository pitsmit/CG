//import Konva from "konva";
import * as konva from '../libs/konva.min.js';

window.width = window.innerWidth;
window.height = window.innerHeight;

function create_obj_rect(x, y, width, height, fill, opacity = 1) {
    var rect = new Konva.Rect({ //* @typedef konva-object
        x: x,
        y: y,
        width: width,
        height: height,
        fill: fill,
        opacity: opacity
    });

    return rect
}

var layer = new Konva.Layer();

var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true,
});


/**
 * создание объекта линия
 * @param {array of number} points массив точек по которым строим
 * @param {string} stroke цвет линии
 * @param {number} strokeWidth жирность
 * @returns 
 */
function create_obj_line(points, stroke, strokeWidth){
    var line = new Konva.Line({
        points: points,
        stroke: stroke,
        strokeWidth: strokeWidth
    });

    return line;
}


var xAxis = create_obj_line([-stage.width() / stage.scale().x, stage.height() / 2, stage.width() / stage.scale().x, stage.height() / 2], 'black', 3);
var yAxis = create_obj_line([stage.width() / 2, -stage.height() / stage.scale().y, stage.width() / 2, stage.height() / stage.scale().y], 'black', 3);

export var obj = {layer: layer, stage: stage, xAxis: xAxis, yAxis: yAxis};


/**
 * перерисовка канваса
 */
export function refresh_graph() {
    obj.layer.destroyChildren();
    obj.layer.add(obj.xAxis);
    obj.layer.add(obj.yAxis);
}


export var CatGroup = {head: NaN, left_eye: NaN, right_eye: NaN, 
    body: NaN, mustache_1: NaN, mustache_2: NaN, mustache_3: NaN, 
    left_leg_high: NaN, left_leg_low: NaN, right_leg_high: NaN, right_leg_low: NaN
};


export function CatPlot(){
    ParamEllipse(CatGroup.head.x, CatGroup.head.y, CatGroup.head.radiusa, CatGroup.head.radiusb, CatGroup.head.angle, CatGroup.head.rotX, CatGroup.head.rotY);
    ParamEllipse(CatGroup.left_eye.x, CatGroup.left_eye.y, CatGroup.left_eye.radiusa, CatGroup.left_eye.radiusb, CatGroup.left_eye.angle, CatGroup.left_eye.rotX, CatGroup.left_eye.rotY);
    ParamEllipse(CatGroup.right_eye.x, CatGroup.right_eye.y, CatGroup.right_eye.radiusa, CatGroup.right_eye.radiusb, CatGroup.right_eye.angle, CatGroup.right_eye.rotX, CatGroup.right_eye.rotY);
    ParamEllipse(CatGroup.body.x, CatGroup.body.y, CatGroup.body.radiusa, CatGroup.body.radiusb, CatGroup.body.angle, CatGroup.body.rotX, CatGroup.body.rotY);

    CDA(CatGroup.mustache_1.xn, CatGroup.mustache_1.yn, CatGroup.mustache_1.xk, CatGroup.mustache_1.yk);
    CDA(CatGroup.mustache_2.xn, CatGroup.mustache_2.yn, CatGroup.mustache_2.xk, CatGroup.mustache_2.yk);
    CDA(CatGroup.mustache_3.xn, CatGroup.mustache_3.yn, CatGroup.mustache_3.xk, CatGroup.mustache_3.yk);

    CDA(CatGroup.left_leg_high.xn, CatGroup.left_leg_high.yn, CatGroup.left_leg_high.xk, CatGroup.left_leg_high.yk);
    CDA(CatGroup.left_leg_low.xn, CatGroup.left_leg_low.yn, CatGroup.left_leg_low.xk, CatGroup.left_leg_low.yk);

    CDA(CatGroup.right_leg_high.xn, CatGroup.right_leg_high.yn, CatGroup.right_leg_high.xk, CatGroup.right_leg_high.yk);
    CDA(CatGroup.right_leg_low.xn, CatGroup.right_leg_low.yn, CatGroup.right_leg_low.xk, CatGroup.right_leg_low.yk);
}


/**
 * инициализация кота
 */
export function CatInit(){
    var head = {x: -200, y: 0, radiusa: 100, radiusb: 100, angle: 0, rotX: 0, rotY: 0};
    var left_eye = {x: head.x - 50, y: head.y + 50, radiusa: 10, radiusb: 10, angle: 0, rotX: 0, rotY: 0};
    var right_eye = {x: head.x + 50, y: head.y + 50, radiusa: 10, radiusb: 10, angle: 0, rotX: 0, rotY: 0};
    var body = {x: head.x + head.radiusa * 3, y: head.y, radiusa: head.radiusa * 2, radiusb: head.radiusa * 2, scaleX: 1, scaleY: 1, angle: 0, rotX: 0, rotY: 0};
    var mustache_1 = {xn: head.x - 10, yn: head.y - 20, xk: head.x + 10, yk: head.y + 20};
    var mustache_2 = {xn: head.x - 20, yn: head.y, xk: head.x + 20, yk: head.y};
    var mustache_3 = {xn: head.x - 10, yn: head.y + 20, xk: head.x + 10, yk: head.y - 20};
    var left_leg_high = {xn: body.x - 40, yn: body.y - 200, xk: body.x - 40, yk: body.y - 300};
    var left_leg_low = {xn: body.x - 80, yn: body.y - 300, xk: body.x - 40, yk: body.y - 300};
    var right_leg_high = {xn: body.x + 40, yn: body.y - 200, xk: body.x + 40, yk: body.y - 300};
    var right_leg_low = {xn: body.x + 80, yn: body.y - 300, xk: body.x + 40, yk: body.y - 300};

    CatGroup.head = head;
    CatGroup.left_eye = left_eye;
    CatGroup.right_eye = right_eye;
    CatGroup.body = body;
    CatGroup.mustache_1 = mustache_1;
    CatGroup.mustache_2 = mustache_2;
    CatGroup.mustache_3 = mustache_3;
    CatGroup.left_leg_high = left_leg_high;
    CatGroup.left_leg_low = left_leg_low;
    CatGroup.right_leg_high = right_leg_high;
    CatGroup.right_leg_low = right_leg_low;

    CatPlot();
}


function DrawSymPoints(xn, x, yn, y) {
    var rect = create_obj_rect((xn + x) + width / 2, height / 2 - (yn + y), 1, 1, "black");
    layer.add(rect);

    rect = create_obj_rect((-xn + x) + width / 2, height / 2 - (yn + y), 1, 1, "black");
    layer.add(rect);

    rect = create_obj_rect((xn + x) + width / 2, height / 2 + (yn - y), 1, 1, "black");
    layer.add(rect);

    rect = create_obj_rect((-xn + x) + width / 2, height / 2 + (yn - y), 1, 1, "black");
    layer.add(rect);
}


function ParamEllipse(x, y, a, b, q, X, Y) {
    //var pa = {x: x + a / 2, y: y};
    /*var pb = {x: x - a, y: y};
    var pc = {x: x, y: y + b};
    var want_x = X + (pb.x - X) * Math.cos(q * Math.PI / 180) + (pb.y - Y) * Math.sin(q * Math.PI / 180);
    var want_y = Y - (pb.x - X) * Math.sin(q * Math.PI / 180) + (pb.y - Y) * Math.cos(q * Math.PI / 180);
    pb.x = want_x;
    pb.y = want_y;
    want_x = X + (pc.x - X) * Math.cos(q * Math.PI / 180) + (pc.y - Y) * Math.sin(q * Math.PI / 180);
    want_y = Y - (pc.x - X) * Math.sin(q * Math.PI / 180) + (pc.y - Y) * Math.cos(q * Math.PI / 180);
    pc.x = want_x;
    pc.y = want_y;
    console.log(pb, pc);
    console.log(a, b, x, y);*/

    if (a <= 0 || b <= 0)
        return;
    var step = a > b ? 1 / a : 1 / b; //* @typedef number
    var xn; //* @typedef number
    var yn; //* @typedef number

    var n = Math.PI / 2 + step
    for (var i = 0; i <= n; i += step) {
        xn = x + Math.round(a * Math.cos(i));
        yn = y + Math.round(b * Math.sin(i));

       // xn = Math.round(x + (pc.x - x) * Math.cos(i * 2 * Math.PI / n) + (pb.x - x) * Math.sin(i * 2 * Math.PI / n));
        //yn = Math.round(y + (pc.y - y) * Math.cos(i * 2 * Math.PI / n) + (pb.y - y) * Math.sin(i * 2 * Math.PI / n));
        DrawSymPoints(xn - x, x, yn - y, y);
    }
}


function CDA(xn, yn, xk, yk) {
    var x = xn;
    var y = yn;

    var delta_x = xk - xn;
    var delta_y = yk - yn;

    var l = Math.abs(delta_x) > Math.abs(delta_y) ? Math.abs(delta_x) : Math.abs(delta_y);

    delta_x /= l;
    delta_y /= l;

    for (var i = 0; i <= l + 1; i++) {
        var rect = create_obj_rect(Math.round(x + width / 2), Math.round(height / 2 - y), 1, 1, "black");
        layer.add(rect);
        x += delta_x;
        y += delta_y;
    }
}


function addlayertostage(obj){
    obj.stage.add(obj.layer);
}


/**
 * возврат к исходному состоянию объекта
 */
export function Reset(){
    refresh_graph();
    CatInit();
}


export function GeometricalPad(FuncNumber){
    var arrfunc = [refresh_graph, addlayertostage, Reset];

    return arrfunc[FuncNumber - 1](obj);
}