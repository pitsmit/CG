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
    var pixel = create_obj_pixel(Math.round(obj.x + width / 2), Math.round(height / 2 - obj.y), obj.color);
    obj.someObj.push(pixel);

    obj.layer.add(pixel);

    /*const canvas = stage.toCanvas();
    const context = canvas.getContext('2d');

    var roundedX = Math.floor(obj.x);
    var roundedY = Math.floor(obj.y);
    context.fillStyle = obj.color;
    context.fillRect(roundedX, roundedY, 1, 1);*/

    
}


function GetColorPixel(obj){
    /*const canvas = stage.toCanvas();
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(obj.x, obj.y, 1, 1);
    const pixel = imageData.data;
    console.log(pixel[0], pixel[1], pixel[2]);*/

    var pixels = layer.getChildren(function(node){
        return node.getClassName() === 'Rect';
    });

    for (var i = 0; i < pixels.length; i++)
        if (pixels[i].x() == Math.round(obj.x + width / 2) && pixels[i].y() == Math.round(height / 2 - obj.y))
            return pixels[i].fill();
}


export function GeometricalPad(obj, FuncNumber){
    var arrfunc = [PlotLine, refresh_graph, addlayertostage, PlotCircle, PlotPixel, GetColorPixel];

    return arrfunc[FuncNumber - 1](obj);
}