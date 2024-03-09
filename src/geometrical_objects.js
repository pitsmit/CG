import { Layer, Stage, Rect, Line } from './konva.min.js';

window.width = window.innerWidth;
window.height = window.innerHeight;

export var layer = new Konva.Layer();

export var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true,
});


export function create_obj_rect(x, y, width, height, fill, opacity=1){
    var rect = new Konva.Rect({
        x: x,
        y: y,
        width: width,
        height: height,
        fill: fill,
        opacity: opacity
    });

    return rect
}


export function create_obj_line(points, stroke, strokeWidth, opacity=1){
    var line = new Konva.Line({
        points: points,
        stroke: stroke,
        strokeWidth: strokeWidth,
        opacity: opacity
    });

    return line;
}


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


export function refresh_graph(layer, xAxis, yAxis) {
    layer.add(xAxis);
    layer.add(yAxis);
    setka(layer);
}


export var xAxis = create_obj_line([-stage.width() / stage.scale().x, stage.height() / 2, stage.width() / stage.scale().x, stage.height() / 2], 'black', 3);
export var yAxis = create_obj_line([stage.width() / 2, -stage.height() / stage.scale().y, stage.width() / 2, stage.height() / stage.scale().y], 'black', 3);