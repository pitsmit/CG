import Konva from "konva";

window.width = window.innerWidth;   //* @typedef number
window.height = window.innerHeight; //* @typedef number

var layer = new Konva.Layer();      //* @typedef konva-object

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
 * @returns konva-object круг
 */
function create_obj_circle(x, y) {
    var circle = new Konva.Circle({ //* @typedef konva-object
        x: x,
        y: y,
        radius: 1,
        fill: "black",
    });

    return circle
}


/**
 * создание объекта пиксель
 * @param {number} x координата х
 * @param {number} y координата y
 * @param {string} fill заливка
 * @returns konva-object пиксель
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
 * @returns konva-object линии
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
 * очистка канваса
 */
function refresh_graph() {layer.destroyChildren();}


/**
 * создание универсальной структуры для передачи нужных данных туда сюда
 * @returns структура(объект js)
 */
export function create_obj(){
    var obj = {x: 0, y: 0, x1plot: 0, x2plot: 0, y1plot: 0, y2plot: 0, color: "", delay: 0};

    return obj;
}


/**
 * построение линии
 * @param {user-js object} obj данные для построения линии 
 */
function PlotLine(obj){
    var line = create_obj_line([obj.x1plot, obj.y1plot, obj.x2plot, obj.y2plot], "black", 3); //* @typedef konva-object

    layer.add(line);
}


/**
 * построение круга
 * @param {user-js object} obj данные для построения круга 
 */
function PlotCircle(obj){
    var circle = create_obj_circle(obj.x, obj.y); //* @typedef konva-object

    layer.add(circle);
}


/**
 * связывание сцены и канваса
 */
function addlayertostage(){
    stage.add(layer);
}


/**
 * построение пикслеля
 * @param {user-js object} obj данные для построения пикселя
 */
function PlotPixel(obj){
    //* @typedef konva-object
    var pixels = layer.getChildren(function(node){return node.getClassName() === 'Rect';});

    var x = Math.floor(obj.x + width / 2);  //* @typedef number
    var y = Math.floor(height / 2 - obj.y); //* @typedef number

    for (var i = 0; i < pixels.length; i++)
        if (pixels[i].x() == x && pixels[i].y() == y){
            pixels[i].setAttr("fill", obj.color);
            return;
        }
    
    layer.add(create_obj_pixel(x, y, obj.color));
}


/**
 * получение текущего цвета пикселя
 * @param {user-js object} obj координаты пикселя
 * @returns string цвет пикселя
 */
function GetColorPixel(obj){
    //* @typedef konva-object
    var pixels = layer.getChildren(function(node){return node.getClassName() === 'Rect';});

    var x = Math.floor(obj.x + width / 2);  //* @typedef number
    var y = Math.floor(height / 2 - obj.y); //* @typedef number

    for (var i = 0; i < pixels.length; i++)
        if (pixels[i].x() == x && pixels[i].y() == y)
            return pixels[i].fill();
}


/**
 * уничтожение белых пикселей
 */
function DestroyWhitePixels(){
    //* @typedef konva-object
    var pixels = layer.getChildren(function(node){return node.getClassName() === 'Rect';});

    for (var i = 0; i < pixels.length; i++)
        if (pixels[i].fill() == "white")
            pixels[i].destroy();
}


/**
 * прокладка/точка входа в модуль
 * @param {user-js object} obj структура с аргументами для функций
 * @param {number} FuncNumber номер вызванной функции
 * @returns значение вызванной функции
 */
export function GeometricalPad(obj, FuncNumber){
    var arrfunc = [PlotLine, refresh_graph, addlayertostage, PlotCircle, PlotPixel, GetColorPixel, DestroyWhitePixels, create_obj];

    return arrfunc[FuncNumber - 1](obj);
}