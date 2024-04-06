import { GeometricalPad } from "./geometrical_objects.js";
import { TablePad } from "./tables.js";

var DOTS = []


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


function FILL(obj){
    if (DOTS.length < 3){
        alert("Ошибка! Нужно ввести хотя бы 3 точки!");
        return;
    }

    obj.x1plot = DOTS[DOTS.length - 1][0] + width / 2;
    obj.y1plot = height / 2 - DOTS[DOTS.length - 1][1];
    obj.x2plot = DOTS[0][0] + width / 2;
    obj.y2plot = height / 2 - DOTS[0][1];
    GeometricalPad(obj, 1); // дорисовка последнего ребра

    /// здесь должен быть алгоритм...

    cleardots(); // вот в этой строчке некоторые проблемы есть....
}


function ClearIfEmpty(obj){
    if (DOTS.length == 0){
        GeometricalPad(obj, 2);
        TablePad(obj, 1);
    }
}


export function MainPad(obj, FuncNumber){
    var arrfunc = [pushdot, makeedge, cleardots, FILL, ClearIfEmpty];

    arrfunc[FuncNumber - 1](obj);
}