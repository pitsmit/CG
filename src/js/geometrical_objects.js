//import Konva from "konva";
import * as konva from "../libs/konva.min.js"

window.width = window.innerWidth; //* @typedef number
window.height = window.innerHeight; //* @typedef number

var layer = new Konva.Layer(); //* @typedef konva-object

export var stage = new Konva.Stage({ //* @typedef konva-object
    container: 'container',
    width: width,
    height: height,
    draggable: true,
});


/**
 * создание объекта круга
 * @param {number} x 
 * @param {number} y 
 * @param {number} radius 
 * @param {string} fill цвет круга
 * @returns объект круг
 */
function create_obj_circle(x, y, radius=1, fill="red") {
    var circle = new Konva.Circle({ //* @typedef konva-object
        x: x,
        y: y,
        radius: radius,
        fill: fill,
    });

    return circle
}


/**
 * создание объекта линия
 * @param {array of number} points массив точек по которым строим
 * @param {string} stroke цвет линии
 * @param {number} strokeWidth жирность
 * @returns объект линии
 */
function create_obj_line(points, stroke, strokeWidth) {
    var line = new Konva.Line({ //* @typedef konva-object
        points: points,
        stroke: stroke,
        strokeWidth: strokeWidth
    });

    return line;
}


/**
 * рисование сетки
 * @param {konva-object} layer канвас
 */
function setka(layer) {
    for (var i = stage.height() / 2; i > -14312; i -= 50) {
        var line = create_obj_line([-999999999, i, 999999999, i], 'grey', 1)
        layer.add(line);
    }

    for (var i = stage.height() / 2; i < 14312; i += 50) {
        var line = create_obj_line([-999999999, i, 999999999, i], 'grey', 1)
        layer.add(line);
    }

    for (var i = stage.width() / 2; i > -14324; i -= 50) {
        var line = create_obj_line([i, -999999999, i, 9999999999], 'grey', 1)
        layer.add(line);
    }

    for (var i = stage.width() / 2; i < 14324; i += 50) {
        var line = create_obj_line([i, -999999999, i, 9999999999], 'grey', 1)
        layer.add(line);
    }
}


function refresh_graph(obj) {
    obj.layer.destroyChildren();
    obj.layer.add(obj.xAxis);
    obj.layer.add(obj.yAxis);
    setka(obj.layer);
}


export var xAxis = create_obj_line([-stage.width() / stage.scale().x, stage.height() / 2, stage.width() / stage.scale().x, stage.height() / 2], 'black', 3); //* @typedef konva-object
export var yAxis = create_obj_line([stage.width() / 2, -stage.height() / stage.scale().y, stage.width() / 2, stage.height() / stage.scale().y], 'black', 3); //* @typedef konva-object


export function create_obj(){
    var obj = {x: 0, y: 0, x1plot: 0, x2plot: 0, y1plot: 0, y2plot: 0, layer: layer, xAxis: xAxis, yAxis: yAxis, stage: stage, someObj: []};

    return obj;
}


function PlotLine(obj){
    var line = create_obj_line([obj.x1plot, obj.y1plot, obj.x2plot, obj.y2plot], "black", 1);
    obj.someObj.push(line);

    obj.layer.add(line);
}


function PlotCircle(obj){
    var circle = create_obj_circle(obj.x, obj.y);
    obj.someObj.push(circle);

    obj.layer.add(circle);
}


function addlayertostage(obj){
    obj.stage.add(obj.layer);
}


export function GeometricalPad(obj, FuncNumber){
    var arrfunc = [PlotLine, refresh_graph, addlayertostage, PlotCircle];

    arrfunc[FuncNumber - 1](obj);
}