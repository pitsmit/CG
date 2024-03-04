import * as konva from './konva.min.js';
const width = window.innerWidth;
const height = window.innerHeight;

export var CatGroup = new Konva.Group({
    stroke: 'black',
    strokeWidth: 4,
    fill: NaN,
    x: width / 2,
    y: height / 2,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
});


export var layer = new Konva.Layer();


export var stage = new Konva.Stage({
    container: 'container',
    width: width,
    height: height,
    draggable: true,
});


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


export function CatInit(Group, layer){
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

    Group.add(head);
    Group.add(body);
    Group.add(left_leg_high);
    Group.add(right_leg_high);
    Group.add(left_leg_low);
    Group.add(right_leg_low);
    Group.add(left_eye);
    Group.add(right_eye);
    Group.add(mustache_1);
    Group.add(mustache_2);
    Group.add(mustache_3);
    layer.add(Group);
}


export function XY(stage){
    var xAxis = create_obj_line([-stage.width() / stage.scale().x, stage.height() / 2, stage.width() / stage.scale().x, stage.height() / 2], 'black', 3);
    var yAxis = create_obj_line([stage.width() / 2, -stage.height() / stage.scale().y, stage.width() / 2, stage.height() / stage.scale().y], 'black', 3);

    return [xAxis, yAxis];
}