const width = window.innerWidth;
const height = window.innerHeight;

export var groupCircles = new Konva.Group({
});

export var ResGroup = new Konva.Group({
});

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