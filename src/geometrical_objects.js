import * as konva from './konva.min.js';
const width = window.innerWidth;
const height = window.innerHeight;


export var layer = new Konva.Layer();
window.layer = layer;


export var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true,
});
window.stage = stage;

stage.add(layer);


export function create_obj_circle(x, y, radius, fill, stroke="", strokeWidth=1){
    var circle = new Konva.Circle({
        x: x,
        y: y,
        radius: radius,
        fill: fill,
        stroke: stroke,
        strokeWidth: strokeWidth,
    });

    return circle
}


export function create_obj_rect(x, y, width, height, fill){
    var rect = new Konva.Rect({
        x: x,
        y: y,
        width: width,
        height: height,
        fill: fill
    });

    return rect
}


export function create_obj_ellipse(x_rad, y_rad, x, y, fill, stroke, strokeWidth){
    var ellipse = new Konva.Ellipse({
        radius : {
          x : x_rad,
          y : y_rad
        },
        fill: fill,
        x: x,
        y: y,
        stroke: stroke,
        strokeWidth: strokeWidth,
      });
    
    return ellipse;
}


export function create_obj_line(points, stroke, strokeWidth){
    var line = new Konva.Line({
        points: points,
        stroke: stroke,
        strokeWidth: strokeWidth
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

window.refresh_graph = refresh_graph;


var xAxis = create_obj_line([-stage.width() / stage.scale().x, stage.height() / 2, stage.width() / stage.scale().x, stage.height() / 2], 'black', 3);
var yAxis = create_obj_line([stage.width() / 2, -stage.height() / stage.scale().y, stage.width() / 2, stage.height() / stage.scale().y], 'black', 3);
window.xAxis = xAxis;
window.yAxis = yAxis;

refresh_graph(layer, xAxis, yAxis);