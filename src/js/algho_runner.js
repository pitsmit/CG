import { GeometricalPad } from "./geometrical_objects.js";
import { TablePad } from "./tables.js";

var DOTS = []
var FLAG = 0


function pushdot(obj){DOTS.push([obj.x, obj.y]);}


/**
 * отрисовка ребра
 */
function makeedge(){
    if (DOTS.length < 2)
        return;

    var obj = GeometricalPad(NaN, 8);
    obj.x1plot = DOTS[DOTS.length - 1][0] + width / 2;
    obj.y1plot = height / 2 - DOTS[DOTS.length - 1][1];
    obj.x2plot = DOTS[DOTS.length - 2][0] + width / 2;
    obj.y2plot = height / 2 - DOTS[DOTS.length - 2][1];
    GeometricalPad(obj, 1);
}


function cleardots(){DOTS = [];}


/**
 * проверка количества вершин фигуры перед построением
 * @returns number код завершения функции
 */
function CheckDotsLength(){
    if (DOTS.length < 3){
        alert("Ошибка! Нужно ввести хотя бы 3 точки!");
        return -1;
    }
    return 0;
}


/**
 * отрисовка последнего ребра перед закраской
 * @returns объект промиса(борьба с асинхроностью)
 */
function PlotLastEdge(){
    return new Promise(() => {
        if (FLAG == 0){
            var obj = GeometricalPad(NaN, 8);
            obj.x1plot = DOTS[DOTS.length - 1][0] + width / 2;
            obj.y1plot = height / 2 - DOTS[DOTS.length - 1][1];
            obj.x2plot = DOTS[0][0] + width / 2;
            obj.y2plot = height / 2 - DOTS[0][1];
            GeometricalPad(obj, 1); // дорисовка последнего ребра
        }
    });
}


/**
 * изменение статуса отображения колёсика прогрузки
 * @param {string} state состояние для колёсика прогрузки
 * @returns объект Promise(в данном случае это необходимо для внедрения асинхроности процессов)
 */
function reverseLoader(state){
    return new Promise((resolve) => {
        document.getElementById("loader").style.display = state;
        resolve();
        setTimeout(() => {
            resolve();
        }, 1);
    });
}


/**
 * весь цикл зарисовки после нажатия на кнопку закрасить
 * @param {user-js object} obj данные для рисования 
 */
function FILL(obj){
    var rc = CheckDotsLength(); //* @typedef number
    if (rc != 0)
        return;

    var summm = 0; //* @typedef number
    reverseLoader("block").then(PlotLastEdge()).then(() => {
        summm = FillFigure(obj);
    }).then(() => {
        setTimeout(function() {
            reverseLoader("none");
       }, summm);
    })

    FLAG = 1
}


/**
 * очистка таблиц и канваса в случае если пользователю уже закрасилось что-то
 */
function ClearIfEmpty(){
    if (FLAG == 1){
        GeometricalPad(NaN, 2);
        TablePad(NaN, 1);
        cleardots(); 
        FLAG = 0;
    }
}


/**
 * поиск минимального х
 * @param {array with edge-objects} f массив с данными о рёбрах
 * @returns number минимальный x
 */
function FindMinX(f){
    var min = f[0].startX; //* @typedef number

    for (var i = 0; i < f.length; i++){
        if (f[i].startX < min)
            min = f[i].startX;

        if (f[i].endX < min)
            min = f[i].endX;
    }

    return Math.floor(min);
}


/**
 * отрисовка всех рёбер
 * @param {array with edge-objects} f массив с данными о рёбрах
 */
function PlotAllEdges(f){
    var obj = GeometricalPad(NaN, 8); //* @typedef user-js object
    for (var i = 0; i < f.length; i++){
        obj.x1plot = f[i].startX + width / 2;
        obj.y1plot = height / 2 - f[i].startY;
        obj.x2plot = f[i].endX + width / 2;
        obj.y2plot = height / 2 - f[i].endY;
        GeometricalPad(obj, 1);
    }
}


/**
 * закраска пикселей
 * @param {user-js object} obj структура с данными для пикселей
 * @param {number} min_x минимальная координата х для пикселей
 * @param {number} stop максимальная координата х
 * @param {string} col_fill цвет заливки
 * @param {number} dfdf текущий y
 * @param {number} rrr параметр для задержки
 */
function GetDataForPixels(obj, min_x, stop, col_fill, dfdf, rrr){
    setTimeout(function() {
        var tmpx = min_x; //* @typedef number
        for (tmpx = min_x; tmpx < stop + 1; tmpx++){
            obj.y = dfdf;
            obj.x = tmpx;
            var colorrr = GeometricalPad(obj, 6);
            if (colorrr == undefined)
                obj.color = col_fill;
            else if (colorrr == "white" || colorrr == "#FFFFFF")
                obj.color = col_fill;
            else
                obj.color = "white";
            GeometricalPad(obj, 5);
        }

    }, obj.delay * rrr);
}


/**
 * создание массива с объектами с координатами начала и конца рёбер
 * @returns array of vectors
 */
function PrepareVectors(){
    var f = [] //* @typedef array
    for (var i = 0; i < DOTS.length - 1; i++){
        var vec = {startX: DOTS[i][0], startY: DOTS[i][1], endX: DOTS[i + 1][0], endY: DOTS[i + 1][1]};
        f.push(vec)
    }
    var vec = {startX: DOTS[0][0], startY: DOTS[0][1], endX: DOTS[DOTS.length - 1][0], endY: DOTS[DOTS.length - 1][1]};
    f.push(vec);

    return f;
}


/**
 * перестановка местами
 * @param {number} startX 
 * @param {number} endX 
 * @param {number} startY 
 * @param {number} endY 
 * @returns {number, number, number, number}
 */
function Swap(startX, endX, startY, endY){
    var tmp = endX; //* @typedef number
    endX = startX;
    startX = tmp;

    tmp = endY;
    endY = startY;
    startY = tmp;

    return [startX, endX, startY, endY]
}


/**
 * округление координат
 * @param {object with coords of start-end of vector} vec 
 * @param {number} startX 
 * @param {number} endX 
 * @param {number} startY 
 * @param {number} endY 
 * @returns {number, number, number, number}
 */
function MakeFLoor(vec, startX, endX, startY, endY){
    startX = Math.floor(vec.startX);
    startY = Math.floor(vec.startY);
    endX = Math.floor(vec.endX);
    endY = Math.floor(vec.endY);

    return [startX, endX, startY, endY];
}


/**
 * уничтожение белых пикселей и повторная отрисовка рёбер
 * @param {array of objects with coords of start-end of vector} f массив рёбер
 * @param {number} delay задержка
 * @param {number} max_r коэффициент для задержки
 * @returns number общее время задержки
 */
function AfterFilling(f, delay, max_r){
    var sum_sadershka = delay * max_r; //* @typedef number
    setTimeout(function() {
         GeometricalPad(NaN, 7); // destroy white pixel
         PlotAllEdges(f);
    }, sum_sadershka);

    return sum_sadershka;
}


/**
 * заливка фигуры
 * @param {user-js object} obj структура с нужными для заливки данными 
 * @returns number длина задержки
 */
function FillFigure(obj){
    var f = PrepareVectors(); //* @typedef array of objects with coords of start-end of vector

    var col_fill = obj.color; //* @typedef string
    var min_x = FindMinX(f); //* @typedef number

    var stop;   //* @typedef number
    var startX; //* @typedef number
    var startY; //* @typedef number
    var endX;   //* @typedef number
    var endY;   //* @typedef number
    var s1;     //* @typedef number
    var s2;     //* @typedef number
    var s3;     //* @typedef number

    var max_r = 0;
    for (var i = 0; i < f.length; i++){
        [startX, endX, startY, endY] = MakeFLoor(f[i], startX, endX, startY, endY);
        if (startY == endY)
            continue;
        if (startY > endY)
            [startX, endX, startY, endY] = Swap(startX, endX, startY, endY);

        s1 = (endX - startX);
        s2 = startY * endX - endY * startX;
        s3 = endY - startY;

        var rrr = 1;       //* @typedef number

        var dfdf = startY; //* @typedef number
        for (dfdf = startY; dfdf < endY; dfdf++, rrr++){
            stop = (dfdf * s1 - s2) / s3;
            GetDataForPixels(obj, min_x, stop, col_fill, dfdf, rrr);
        }

        if (rrr > max_r)
            max_r = rrr;
    }

    return AfterFilling(f, obj.delay, max_r);
}


/**
 * прокладка/точка входа в модуль
 * @param {user-js object} obj структура с аргументами для функций
 * @param {number} FuncNumber номер функции
 */
export function MainPad(obj, FuncNumber){
    var arrfunc = [pushdot, makeedge, cleardots, FILL, ClearIfEmpty];

    arrfunc[FuncNumber - 1](obj);
}