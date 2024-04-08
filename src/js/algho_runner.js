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
    return new Promise((resolve, reject) => {
        if (FLAG == 0){
            obj.x1plot = DOTS[DOTS.length - 1][0] + width / 2;
            obj.y1plot = height / 2 - DOTS[DOTS.length - 1][1];
            obj.x2plot = DOTS[0][0] + width / 2;
            obj.y2plot = height / 2 - DOTS[0][1];
            GeometricalPad(obj, 1); // дорисовка последнего ребра
        }
    });
}


function reverseLoader(state){
    return new Promise((resolve, reject) => {
        document.getElementById("loader").style.display = state;
        setTimeout(() => {
            resolve();
        }, 1);
    });
}


function FILL(obj){
    var rc = CheckDotsLength();
    if (rc != 0)
        return;

    reverseLoader("block").then(PlotLastEdge(obj)).then(() => {
        figure_fill_by_edge(obj);
    }).then(() => {
        reverseLoader("none");
    });

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


function PlotAllEdges(f, obj){
    for (var i = 0; i < f.length; i++){
        obj.x1plot = f[i].startX + width / 2;
        obj.y1plot = height / 2 - f[i].startY;
        obj.x2plot = f[i].endX + width / 2;
        obj.y2plot = height / 2 - f[i].endY;
        GeometricalPad(obj, 1);
    }
}


function GetDataForPixels(obj, min_x, stop, col_fill){
    var res = [];
    for (obj.x = min_x; obj.x <= stop + 1; obj.x++){
        var colorrr = GeometricalPad(obj, 6);
        if (colorrr == undefined)
            obj.color = col_fill;
        else if (colorrr == "white" || colorrr == "#FFFFFF")
            obj.color = col_fill;
        else
            obj.color = "white";
        var dd = {x: obj.x, y: obj.y, color: obj.color};
        res.push(dd);
    }

    return res;
}


async function pltpixls(res){
    var obj = GeometricalPad(NaN, 8);
    for (var j = 0; j < res.length; j++){
        obj.x = res[j].x;
        obj.y = res[j].y;
        obj.color = res[j].color;
        GeometricalPad(obj, 5);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

    var colorrr;
    var col_fill = obj.color;

    var size = f.length;

    var min_x = FindMinX(f);

    var stop;
    var startX;
    var startY;
    var endX;
    var endY;
    var tmp;
    var s1;
    var s2;
    var s3;

    for (var i = 0; i < size; i++)
    {
        startX = Math.floor(f[i].startX);
        startY = Math.floor(f[i].startY);
        endX = Math.floor(f[i].endX);
        endY = Math.floor(f[i].endY);

        if (startY == endY)
            continue;

        if (startY > endY){
            tmp = endX;
            endX = startX;
            startX = tmp;

            tmp = endY;
            endY = startY;
            startY = tmp;
        }

        obj.y = startY;

        s1 = (endX - startX);
        s2 = startY * endX - endY * startX;
        s3 = endY - startY;

        while (obj.y < endY)
        {
            stop = (obj.y * s1 - s2) / s3;

            var res = GetDataForPixels(obj, min_x, stop, col_fill);
            //console.log(res);
           // setInterval(() => {  pltpixls(res); }, 10);
            pltpixls(res).then(obj.y++);

            //var res = GetDataForPixels(obj, min_x, stop, col_fill);
           // GetDataForPixels(obj, min_x, stop, col_fill).then(pltpixls);

           /* let promise = new Promise((resolve, reject) => {

                setTimeout(() => {
                  // переведёт промис в состояние fulfilled с результатом "result"
                  resolve(GetDataForPixels(obj, min_x, stop, col_fill));
                }, 1000);
              
              });
              
              // promise.then навешивает обработчики на успешный результат или ошибку
              promise
                .then(
                  result => {
                    // первая функция-обработчик - запустится при вызове resolve
                    pltpixls(result); // result - аргумент resolve
                  }
                );*/
           // sleep(10).then(() => { pltpixls(res); obj.y++;});
            //sleep(2000).then(() => { obj.y++; });

            //console.log(res);

            //(async () => {
            //    var res = GetDataForPixels(obj, min_x, stop, col_fill);
           //     pltpixls(res);
           //   })();

            //obj.y++;
        }
    }

    GeometricalPad(obj, 7); // destroy white pixel
    PlotAllEdges(f, obj);
}


export function MainPad(obj, FuncNumber){
    var arrfunc = [pushdot, makeedge, cleardots, FILL, ClearIfEmpty];

    arrfunc[FuncNumber - 1](obj);
}