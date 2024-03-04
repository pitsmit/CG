import { create_obj_line, create_obj_rect, refresh_graph } from "./geometrical_objects.js";

function GetUserData(form){
    var el = document.getElementById(form);
    var xn = parseFloat(el.xn.value);
    var yn = parseFloat(el.yn.value);
    var xk = parseFloat(el.xk.value);
    var yk = parseFloat(el.yk.value);
    var color = el.favcolor.value;
    var options = document.getElementsByName('state');
    var option_value;
    for(var i = 0; i < options.length; i++){
        if(options[i].checked){
            option_value = options[i].value;
            break;
        }
    }

    return [xn, yn, xk, yk, color, option_value];
}

function CDA(xn, yn, xk, yk, color, layer){
    var x = xn;
    var y = yn;

    var delta_x = xk - xn;
    var delta_y = yk - yn;

    var l;

    if (delta_x > delta_y)
        l = Math.abs(delta_x);
    else
        l = Math.abs(delta_y);

    delta_x /= l;
    delta_y /= l;

    for (var i = 0; i < l + 1; i++){
        var rect = create_obj_rect(Math.round(x + width / 2), Math.round(height / 2 - y), 1, 1, color);
        layer.add(rect);
        x += delta_x;
        y += delta_y;
    }
}


function LibraryFunction(xn, yn, xk, yk, color, layer){
    var line = create_obj_line([xn + width / 2, height / 2 - yn, xk + width / 2, height / 2 - yk], color, 1);
    layer.add(line);
}

function BrezReal(xn, yn, xk, yk, color, layer){
    var x = xn;
    var y = yn;

    var dx = xk - xn;
    var dy = yk - yn;

    console.log(dx, dy);

    var sx;
    var sy;

    if (dx == 0)
        sx = 0;
    else if (dx > 0)
        sx = 1;
    else
        sx = -1;
    
    if (dy == 0)
        sy = 0;
    else if (dy > 0)
        sy = 1;
    else
        sy = -1;
    
    dx = Math.abs(dx);
    dy = Math.abs(dy);

    var obmen;

    if (dx > dy)
        obmen = 0;
    else{
        var t = dx;
        dx = dy;
        dy = t;
        obmen = 1;
    }

    var m = dy / dx;
    var e = m - 0.5;

    for (var i = 1; i <= dx + 1; i++){
        var rect = create_obj_rect(x + width / 2, height / 2 - y, 1, 1, color);
        layer.add(rect);
        if (e >= 0){
            if (obmen == 0){
                y += sy;
            }
            else{
                x += sx;
            }
            e -= 1;
        }
        else {
            if (obmen == 0)
                x += sx;
            else
                y += sy;
            e += m;
        }
    }
}

function BrezInt(xn, yn, xk, yk, color, layer){
    var x = xn;
    var y = yn;

    var dx = xk - xn;
    var dy = yk - yn;

    var sx;
    var sy;

    if (dx == 0)
        sx = 0;
    else if (dx > 0)
        sx = 1;
    else
        sx = -1;
    
    if (dy == 0)
        sy = 0;
    else if (dy > 0)
        sy = 1;
    else
        sy = -1;
    
    dx = Math.abs(dx);
    dy = Math.abs(dy);

    var obmen;

    if (dx > dy)
        obmen = 0;
    else{
        var t = dx;
        dx = dy;
        dy = t;
        obmen = 1;
    }

    var e = 2 * dy - dx;

    for (var i = 1; i <= dx + 1; i++){
        var rect = create_obj_rect(x + width / 2, height / 2 - y, 1, 1, color);
        layer.add(rect);
        if (e >= 0){
            if (obmen == 0){
                y += sy;
            }
            else{
                x += sx;
            }
            e -= 2 * dx;
        }
        else {
            if (obmen == 0)
                x += sx;
            else
                y += sy;
            e += 2 * dy;
        }
    }
}



export function SwitchAlghorithm(){
    var [xn, yn, xk, yk, color, option_value] = GetUserData('collect-data-for-line')
    layer.destroyChildren();
    refresh_graph(layer, xAxis, yAxis);

    switch(option_value){
        case "library-function":
            LibraryFunction(xn, yn, xk, yk, color, layer);
            break;
        case "CDA":
            CDA(xn, yn, xk, yk, color, layer);
            break;
        case "BrezReal":
            BrezReal(xn, yn, xk, yk, color, layer);
            break;
        case "BrezInt":
            BrezInt(xn, yn, xk, yk, color, layer);
            break;
        case "BrezNoSteps":
            break;
        case "BY":
            break;
    }
}

document.getElementById('collect-data-for-line').addEventListener("submit", SwitchAlghorithm);