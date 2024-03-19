import Konva from "konva";

window.width = window.innerWidth;
window.height = window.innerHeight;

export var layer = new Konva.Layer(); //* @typedef konva-object
export var groupCircles = new Konva.Group({ //* @typedef konva-object
});

export var ResGroup = new Konva.Group({ //* @typedef konva-object
});

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
    for (var i = stage.height() / 2; i > -14312; i-=50){
        var line = create_obj_line([-999999999, i, 999999999, i], 'grey', 1)
        layer.add(line);
    }

    for (var i = stage.height() / 2; i < 14312; i+=50){
        var line = create_obj_line([-999999999, i, 999999999, i], 'grey', 1)
        layer.add(line);
    }

    for (var i = stage.width() / 2; i > -14324; i-=50){
        var line = create_obj_line([i, -999999999, i, 9999999999], 'grey', 1)
        layer.add(line);
    }

    for (var i = stage.width() / 2; i < 14324; i+=50){
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


export var xAxis = create_obj_line([-stage.width() / stage.scale().x, stage.height() / 2, stage.width() / stage.scale().x, stage.height() / 2], 'black', 3);
export var yAxis = create_obj_line([stage.width() / 2, -stage.height() / stage.scale().y, stage.width() / 2, stage.height() / stage.scale().y], 'black', 3);


export function plot_results(min_angle_arr_data){
    var ResCircle1 = create_obj_circle(min_angle_arr_data[0][0] + width / 2, height / 2 - min_angle_arr_data[0][1], min_angle_arr_data[0][2], NaN, 'red', 2);
    var ResCircle2 = create_obj_circle(min_angle_arr_data[1][0] + width / 2, height / 2 - min_angle_arr_data[1][1], min_angle_arr_data[1][2], NaN, 'green', 2);
    var LineBetweenCentres = create_obj_line([min_angle_arr_data[0][0] + width / 2, height / 2 - min_angle_arr_data[0][1], 
    min_angle_arr_data[1][0] + width / 2, height / 2 - min_angle_arr_data[1][1]], 'black', 3);
    var Centre1 = create_obj_circle(min_angle_arr_data[0][0] + width / 2, height / 2 - min_angle_arr_data[0][1], 7, 'blue', NaN, NaN);
    var Centre2 = create_obj_circle(min_angle_arr_data[1][0] + width / 2, height / 2 - min_angle_arr_data[1][1], 7, 'blue', NaN, NaN);

    ResGroup.add(ResCircle1);
    ResGroup.add(ResCircle2);
    ResGroup.add(LineBetweenCentres);
    ResGroup.add(Centre1);
    ResGroup.add(Centre2);
    layer.add(ResGroup);
}


export function update_graph(layer, arr, color, groupCircles){
    for (var i = 0; i < arr.length; i++){
        var circle = create_obj_circle(arr[i][0] + width / 2, height / 2 - arr[i][1], 5, color);
        layer.add(circle);
        groupCircles.add(circle);
        layer.add(groupCircles);
    }
}