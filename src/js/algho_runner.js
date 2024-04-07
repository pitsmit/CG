import { GeometricalPad } from "./geometrical_objects.js";
import { TablePad } from "./tables.js";

var DOTS = []
var FLAG = 0


function pushdot(obj){
    DOTS.push([obj.x, obj.y]);
}


function makeedge(obj){
    if (DOTS.length < 2)
        return;

    obj.x1plot = DOTS[DOTS.length - 1][0] + width / 2;
    obj.y1plot = height / 2 - DOTS[DOTS.length - 1][1];
    obj.x2plot = DOTS[DOTS.length - 2][0] + width / 2;
    obj.y2plot = height / 2 - DOTS[DOTS.length - 2][1];
    GeometricalPad(obj, 1);
}


function cleardots(){
    DOTS = [];
}


function CheckDotsLength(){
    if (DOTS.length < 3){
        alert("Ошибка! Нужно ввести хотя бы 3 точки!");
        return -1;
    }
    return 0;
}


function PlotLastEdge(obj){
    if (FLAG == 0){
        obj.x1plot = DOTS[DOTS.length - 1][0] + width / 2;
        obj.y1plot = height / 2 - DOTS[DOTS.length - 1][1];
        obj.x2plot = DOTS[0][0] + width / 2;
        obj.y2plot = height / 2 - DOTS[0][1];
        GeometricalPad(obj, 1); // дорисовка последнего ребра
    }
}


function FILL(obj){
    var rc = CheckDotsLength();
    if (rc != 0)
        return;
    PlotLastEdge(obj);

    figure_fill_by_edge(obj);
    /// здесь должен быть алгоритм...

    FLAG = 1
}


function ClearIfEmpty(obj){
    if (FLAG == 1){
        GeometricalPad(obj, 2);
        TablePad(obj, 1);
        cleardots(); 
        FLAG = 0;
    }
}


function FindMinX(f){
    var max = f[0].startX;

    for (var i = 0; i < f.length; i++){
        if (f[i].startX < max)
            max = f[i].startX;

        if (f[i].endX < max)
            max = f[i].endX;
    }

    return Math.floor(max);
}


function figure_fill_by_edge(obj)
{
    var f = []
    for (var i = 0; i < DOTS.length - 1; i++){
        var vec = {startX: DOTS[i][0], startY: DOTS[i][1], endX: DOTS[i + 1][0], endY: DOTS[i + 1][1]};
        f.push(vec)
    }
    var vec = {startX: DOTS[0][0], startY: DOTS[0][1], endX: DOTS[DOTS.length - 1][0], endY: DOTS[DOTS.length - 1][1]};
    f.push(vec);

    console.log(f);

    var colorrr;
    var col_fill = obj.color;

    var size = f.length;

    var min_x = FindMinX(f);

    var stop;

    for (var i = 0; i < size; i++)
    {
        var startX = f[i].startX;
        var startY = f[i].startY;
        var endX = f[i].endX;
        var endY = f[i].endY;

        if (startY == endY)
            continue;

        if (startY > endY)
        {
            var tmp = endX;
            endX = startX;
            startX = tmp;

            tmp = endY;
            endY = startY;
            startY = tmp;
        }

        console.log(startX, startY);

        obj.y = startY;
        while (obj.y < endY)
        {
            stop = (obj.y - startY + ((endY - startY) / (endX - startX)) * startX) / ((endY - startY) / (endX - startX));

            for (obj.x = min_x; obj.x < stop - 1; obj.x++){
                colorrr = GeometricalPad(obj, 6);
                console.log(colorrr);
                if (colorrr == undefined)
                    obj.color = col_fill;
                else if (colorrr == "white" || colorrr == "#FFFFFF")
                    obj.color = col_fill;
                else
                    obj.color = "white";
                GeometricalPad(obj, 5);
            }
            obj.y++;
        }
    }
}


export function MainPad(obj, FuncNumber){
    var arrfunc = [pushdot, makeedge, cleardots, FILL, ClearIfEmpty];

    arrfunc[FuncNumber - 1](obj);
}