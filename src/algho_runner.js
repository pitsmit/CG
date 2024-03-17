import { create_obj_ellipse, create_obj_circle, create_obj_rect } from "./geometrical_objects.js";

function DrawSymPoints(xn, x, yn, y, layer, color){
    var rect = create_obj_rect(xn + x + width / 2, height / 2 - (yn + y), 1, 1, color);
    layer.add(rect);

    rect = create_obj_rect(-xn + x + width / 2, height / 2 - (yn + y), 1, 1, color);
    layer.add(rect);

    rect = create_obj_rect(xn + x + width / 2, height / 2 + yn - y, 1, 1, color);
    layer.add(rect);

    rect = create_obj_rect(-xn + x + width / 2, height / 2 + yn - y, 1, 1, color);
    layer.add(rect);
}


export function LibraryFunctionCircle(x, y, color, layer, r){
    var circle = create_obj_circle(x + width / 2, height / 2 - y, r, NaN, color, 1);
    layer.add(circle);
}


export function LibraryFunctionEllipse(x, y, color, layer, a, b){
    var ellipse = create_obj_ellipse(a, b, x + width / 2, height / 2 - y, NaN, color, 1);
    layer.add(ellipse);
}


export function BrezCircle(x, y, color, layer, r){
    var xn = 0;
    var yn = r;
    var delta = 2 * (1 - yn);
    var d1;
    var d2;

    DrawSymPoints(xn, x, yn, y, layer, color);

    while (yn > 0){
        if (delta < 0){
            d1 = 2 * delta + 2 * yn - 1;
            xn += 1;
            if (d1 <= 0)
                delta += 2 * xn + 1;
            else if (d1 > 0){
                yn -= 1;
                delta += 2 * (xn - yn + 1);
            }
        }
        else if (delta > 0){
            d2 = 2 * delta - 2 * xn - 1;
            yn -= 1;
            if (d2 <= 0){
                xn += 1;
                delta += 2 * (xn - yn + 1);
            }
            else if (d2 > 0)
                delta -= 2 * yn + 1;
        }
        else{
            xn += 1;
            yn -= 1;
            delta += 2 * (xn - yn + 1);
        }

        DrawSymPoints(xn, x, yn, y, layer, color);
    }
}


export function BrezEllipse(x, y, color, layer, a, b){
    var xn = 0;
    var yn = b;
    var delta = b ** 2 - a ** 2 * (2 * b + 1);
    var d1;
    var d2;
    
    DrawSymPoints(xn, x, yn, y, layer, color);

    while (yn > 0){
        if (delta < 0){
            d1 = 2 * delta + a ** 2 * (2 * yn + 2);
            xn += 1;
            if (d1 < 0)
                delta += b ** 2 * (2 * xn + 1);
            else{
                yn -= 1;
                delta += b ** 2 * (2 * xn + 1) + a ** 2 * (1 - 2 * yn);
            }
        }
        else if (delta > 0){
            d2 = 2 * delta + b ** 2 * (2 - 2 * xn);
            yn -= 1;
            if (d2 > 0)
                delta += a ** 2 * (1 - 2 * yn);
            else{
                xn += 1;
                delta += b ** 2 * (2 * xn + 1) + a ** 2 * (1 - 2 * yn);
            }
        }
        else{
            yn -= 1;
            xn += 1;
            delta += b ** 2 * (2 * xn + 1) + a ** 2 * (1 - 2 * yn);
        }

        DrawSymPoints(xn, x, yn, y, layer, color);
    }
}


export function CanonCircle(x, y, color, layer, r){
    var yn;
    var border = Math.round(x + r);

    for (var xn = x; xn < border + 1; xn++){
        yn = y + Math.sqrt(r ** 2 - (xn - x) ** 2);
        DrawSymPoints(xn - x, x, yn - y, y, layer, color);
    }
}


export function CanonEllipse(x, y, color, layer, a, b){
    var Xbord = Math.round(x + a / Math.sqrt(1 + b ** 2 / a ** 2));
    var Ybord = Math.round(y + b / Math.sqrt(1 + a ** 2 / b ** 2));

    for (var xn = Math.round(x); xn < Xbord + 1; xn++){
        var yn = y + Math.sqrt(a ** 2 * b ** 2 - (xn - x) ** 2 * b ** 2) / a;
        DrawSymPoints(xn - x, x, yn - y, y, layer, color);
    }

    for (var yn = Ybord; yn > Math.round(y) - 1; yn--){
        var xn = x + Math.sqrt(a ** 2 * b ** 2 - (yn - y) ** 2 * a ** 2) / b;
        DrawSymPoints(xn - x, x, yn - y, y, layer, color);
    }
}



export function ParamCircle(x, y, color, layer, r){
    var step = 1 / r;
    var xn;
    var yn;

    for (var i = 0; i <= Math.PI / 2 + step; i += step){
        xn = x + r * Math.cos(i);
        yn = y + r * Math.sin(i);

        DrawSymPoints(xn - x, x, yn - y, y, layer, color);
    }
}


export function ParamEllipse(x, y, color, layer, a, b){
    var step = a > b ? 1 / a : 1 / b;
    var xn;
    var yn;

    for (var i = 0; i <= Math.PI / 2 + step; i += step){
        xn = x + Math.round(a * Math.cos(i));
        yn = y + Math.round(b * Math.sin(i));

        DrawSymPoints(xn - x, x, yn - y, y, layer, color);
    }
}