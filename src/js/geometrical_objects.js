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
 * создание объекта пиксель
 * @param {number} x координата х
 * @param {number} y координата y
 * @param {string} fill заливка
 * @returns пиксель
 */
function create_obj_pixel(x, y, fill) {
    var rect = new Konva.Rect({ //* @typedef konva-object
        x: x,
        y: y,
        width: 1,
        height: 1,
        fill: fill,
    });

    return rect
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


function refresh_graph(obj) {
    obj.layer.destroyChildren();
}


export function create_obj(){
    var obj = {x: 0, y: 0, x1plot: 0, x2plot: 0, y1plot: 0, y2plot: 0, layer: layer, stage: stage, someObj: [], color: ""};

    return obj;
}


function PlotLine(obj){
    var line = create_obj_line([obj.x1plot, obj.y1plot, obj.x2plot, obj.y2plot], "black", 1);
    obj.someObj.push(line);

    obj.layer.add(line);

    obj.layer.draw();

}


function PlotCircle(obj){
    var circle = create_obj_circle(obj.x, obj.y);
    obj.someObj.push(circle);

    obj.layer.add(circle);
}


function addlayertostage(obj){
    obj.stage.add(obj.layer);
}




function PlotPixel(obj){
    var pixels = layer.getChildren(function(node){
        return node.getClassName() === 'Rect';
    });

    var x = Math.floor(obj.x + width / 2);
    var y = Math.floor(height / 2 - obj.y);

    for (var i = 0; i < pixels.length; i++)
        if (pixels[i].x() == x && pixels[i].y() == y){
            pixels[i].setAttr("fill", obj.color);
            return;
        }

    var pixel = create_obj_pixel(x, y, obj.color);
    obj.someObj.push(pixel);

    obj.layer.add(pixel);
}


function GetColorPixel(obj){
    var pixels = layer.getChildren(function(node){
        return node.getClassName() === 'Rect';
    });

    var x = Math.floor(obj.x + width / 2);
    var y = Math.floor(height / 2 - obj.y);

    for (var i = 0; i < pixels.length; i++)
        if (pixels[i].x() == x && pixels[i].y() == y)
            return pixels[i].fill();
}


function DestroyWhitePixels(){
    var pixels = layer.getChildren(function(node){
        return node.getClassName() === 'Rect';
    });

    for (var i = 0; i < pixels.length; i++)
        if (pixels[i].fill() == "white")
            pixels[i].destroy();
}


export function GeometricalPad(obj, FuncNumber){
    var arrfunc = [PlotLine, refresh_graph, addlayertostage, PlotCircle, PlotPixel, GetColorPixel, DestroyWhitePixels];

    return arrfunc[FuncNumber - 1](obj);
}