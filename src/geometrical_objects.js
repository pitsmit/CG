import * as konva from './konva.min.js';

window.width = window.innerWidth; //* @typedef number
window.height = window.innerHeight; //* @typedef number

export var layer = new Konva.Layer(); //* @typedef konva-object

export var stage = new Konva.Stage({ //* @typedef konva-object
    container: 'container',
    width: width,
    height: height,
    draggable: true,
});


/**
 * создание объекта прямоугольник
 * @param {number} x координата х
 * @param {number} y координата y
 * @param {number} width ширина
 * @param {number} height высота
 * @param {string} fill заливка
 * @param {number} opacity яркость
 * @returns прямоугольник
 */
export function create_obj_rect(x, y, width, height, fill, opacity = 1) {
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


/**
 * создание объекта круга
 * @param {number} x 
 * @param {number} y 
 * @param {number} radius 
 * @param {string} fill цвет круга
 * @param {string} stroke цвет обводки
 * @param {number} strokeWidth ширина обводки
 * @returns объект круг
 */
export function create_obj_circle(x, y, radius, fill, stroke = "", strokeWidth = 1) {
    var circle = new Konva.Circle({ //* @typedef konva-object
        x: x,
        y: y,
        radius: radius,
        fill: fill,
        stroke: stroke,
        strokeWidth: strokeWidth,
    });

    return circle
}


/**
 * создание объекта эллипса
 * @param {*} x_rad размер по х
 * @param {*} y_rad размер по у
 * @param {*} x 
 * @param {*} y 
 * @param {string} fill цвет круга
 * @param {string} stroke цвет обводки
 * @param {number} strokeWidth ширина обводки
 * @returns объект эллипса
 */
export function create_obj_ellipse(x_rad, y_rad, x, y, fill, stroke, strokeWidth) {
    var ellipse = new Konva.Ellipse({ //* @typedef konva-object
        radius: {
            x: x_rad,
            y: y_rad
        },
        fill: fill,
        x: x,
        y: y,
        stroke: stroke,
        strokeWidth: strokeWidth,
    });

    return ellipse;
}


/**
 * создание объекта линия
 * @param {array of number} points массив точек по которым строим
 * @param {string} stroke цвет линии
 * @param {number} strokeWidth жирность
 * @returns объект линии
 */
export function create_obj_line(points, stroke, strokeWidth) {
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
export function setka(layer) {
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


/**
 * перерисовка канваса
 * @param {konva-object} layer канвас
 * @param {konva-object} xAxis ось х
 * @param {konva-object} yAxis ось у
 */
export function refresh_graph(layer, xAxis, yAxis) {
    layer.add(xAxis);
    layer.add(yAxis);
    setka(layer);
}


export var xAxis = create_obj_line([-stage.width() / stage.scale().x, stage.height() / 2, stage.width() / stage.scale().x, stage.height() / 2], 'black', 3); //* @typedef konva-object
export var yAxis = create_obj_line([stage.width() / 2, -stage.height() / stage.scale().y, stage.width() / 2, stage.height() / stage.scale().y], 'black', 3); //* @typedef konva-object