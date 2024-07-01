import { CDA } from "./base_algo.js";

var FLAG = 0
var CUTTER = {points:[], color: "", amount: 0};
var BUFCUTTER = {points:[], color: "", amount: 0};
var POLYGON = {points:[], color: "", amount: 0};
var BUFPOLYGON = {points:[], color: "", amount: 0};

/**
 * добавление точки полигона в хранилище
 * @param {user-js object} obj структура с нужными данными
 */
function pushpolygondot(obj){
    if (BUFPOLYGON.amount == 0){
        BUFPOLYGON.points.push([obj.xn, obj.yn]);
        BUFPOLYGON.color = obj.linecolor;
        BUFPOLYGON.amount = 1;
    }
    else{
        BUFPOLYGON.points.push([obj.xn, obj.yn]);
        BUFPOLYGON.amount++;
        pushpolygon();
    }
}

/**
 * обновление полигона и отрисовка его рёбер
 */
function pushpolygon(){
    var [xn, yn] = [BUFPOLYGON.points[BUFPOLYGON.amount - 2][0], BUFPOLYGON.points[BUFPOLYGON.amount - 2][1]]
    var [xk, yk] = [BUFPOLYGON.points[BUFPOLYGON.amount - 1][0], BUFPOLYGON.points[BUFPOLYGON.amount - 1][1]]

    if (BUFPOLYGON.amount == 2)
        POLYGON.points.push([xn, yn]);
    POLYGON.points.push([xk, yk]);
    POLYGON.color = BUFPOLYGON.color;
    POLYGON.amount = BUFPOLYGON.amount;

    CDA(xn, yn, xk, yk, POLYGON.color);
}

/**
 * добавление точки отсекателя в хранилище
 * @param {user-js object} obj структура с нужными данными
 */
function pushcutterdot(obj){
    if (BUFCUTTER.amount == 0){
        BUFCUTTER.points.push([obj.xn, obj.yn]);
        BUFCUTTER.color = obj.cuttercolor;
        BUFCUTTER.amount = 1;
    }
    else{
        BUFCUTTER.points.push([obj.xn, obj.yn]);
        BUFCUTTER.amount++;
        pushcutter();
    }
}

/**
 * обновление отсекателя и отрисовка его рёбер
 */
function pushcutter(){
    var [xn, yn] = [BUFCUTTER.points[BUFCUTTER.amount - 2][0], BUFCUTTER.points[BUFCUTTER.amount - 2][1]]
    var [xk, yk] = [BUFCUTTER.points[BUFCUTTER.amount - 1][0], BUFCUTTER.points[BUFCUTTER.amount - 1][1]]

    if (BUFCUTTER.amount == 2)
        CUTTER.points.push([xn, yn]);
    CUTTER.points.push([xk, yk]);
    CUTTER.color = BUFCUTTER.color;
    CUTTER.amount = BUFCUTTER.amount;

    CDA(xn, yn, xk, yk, CUTTER.color);
}

/**
 * очистка данных
 */
function cleardots(){
    CUTTER = {points:[], color: "", amount: 0};
    BUFCUTTER = {points:[], color: "", amount: 0};
    POLYGON = {points:[], color: "", amount: 0};
    BUFPOLYGON = {points:[], color: "", amount: 0};
}

/**
 * очистка таблиц и канваса в случае если пользователю уже закрасилось что-то
 */
function ClearIfEmpty(){
    if (FLAG == 0)
        return;

    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white"; //* @typefunction string
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    cleardots(); 
    FLAG = 0;
}

/**
 * отрисовка последнего ребра
 */
function plotlastedge(data){
    var [xn, yn] = [data.points[0][0], data.points[0][1]]
    var [xk, yk] = [data.points[data.amount - 1][0], data.points[data.amount - 1][1]]

    CDA(xn, yn, xk, yk, data.color);
}

function Vector(start, stop){return [stop[0] - start[0], stop[1] - start[1]]}
function MulVector(a, b){return a[0] * b[1] - a[1] * b[0];}
function Scalar(vec1, vec2){return vec1[0] * vec2[0] + vec1[1] * vec2[1]}
function GetVector(line){return [line[1][0] - line[0][0], line[1][1] - line[0][1]]}

/**
 * проверка выпуклости отсекателя
 * @returns {bool}
 */
function CheckVypuklost(){
    var vect1 = Vector(CUTTER.points[0], CUTTER.points[1]);
    var vect2 = Vector(CUTTER.points[1], CUTTER.points[2]);
    var sign = (MulVector(vect1, vect2) > 0) ? 1 : -1;

    for (var i = 2; i < CUTTER.amount; i++){
        var a = Vector(CUTTER.points[i - 2], CUTTER.points[i - 1]);
        var b = Vector(CUTTER.points[i - 1], CUTTER.points[i]);

        if (sign * MulVector(a, b) < 0)
            return false;
    }

    return true;
}

/**
 * весь цикл зарисовки после нажатия на кнопку закрасить
 * @param {user-js object} obj данные для рисования 
 */
function FILL(obj){
    if (CUTTER.amount < 3){
        alert("Ошибка! Недостаточно вершин в отсекателе!");
        return;
    }
    if (!CheckVypuklost()){
        alert("Ошибка! Отсекатель не выпуклый!");
        return;
    }

    plotlastedge(CUTTER);
    plotlastedge(POLYGON);

    ZAZERHODMAN(CUTTER, POLYGON, obj.rescolor);
    
    FLAG = 1;
}


function Intersectivitely(a, b, par){
    var vis1 = Visibility(a[0], b[0], b[1], par);
    var vis2 = Visibility(a[1], b[0], b[1], par);
    if  (!(vis1 ^ vis2))
        return false;

    var D = [a[1][0] - a[0][0], a[1][1] - a[0][1]];
    var WW = [a[0][0] - b[0][0], a[0][1] - b[0][1]];
    var N = FindNormal(b[0], b[1], par);

    var DScal = Scalar(D, N);
    var WScal = Scalar(WW, N);

    var t = -WScal / DScal;

    return [Math.round(a[0][0] + (a[1][0] - a[0][0]) * t), Math.round(a[0][1] + (a[1][1] - a[0][1]) * t)];
}


function FindNormal(a, b, c){
    var res = [b[1] - a[1], a[0] - b[0]];

    if (Scalar([c[0] - b[0], c[1] - b[1]], res) < 0)
        res = [-res[0], -res[1]];

    return res;
}


function Visibility(point, a, b, c){
    var n = FindNormal(a, b, c);

    return Scalar(n, GetVector([b, point])) < 0 ? false : true;
}


function deepcopy(dst, src){
    dst.points = [];

    for (var i = 0; i < src.length; i++)
        dst.points.push(src[i]);

    dst.amount = src.length;

    return dst;
}

function ZAZERHODMAN(cutter, polygon, rescolor){
    cutter.points.push(cutter.points[0]);
    cutter.points.push(cutter.points[1]);
    cutter.amount += 2;

    for (var i = 0; i < cutter.amount - 2; i++){
        var curarr = [];
        var f = polygon.points[0];

        var bb = i < 0 ? i + cutter.amount : i;
        var gg = cutter.points[bb + 2] ? bb + 2 : bb + 2 - cutter.amount;
        var kk = cutter.points[bb + 1] ? bb + 1 : bb + 1 - cutter.amount;

        if (Visibility(f,  cutter.points[bb], cutter.points[kk], cutter.points[gg]))
            curarr.push(f);

        var s = polygon.points[0];

        [s, polygon] = innerin(polygon, s, curarr, cutter, bb, kk, gg);

        if (curarr.length <= 0)
            return;
        var t = Intersectivitely([s, f], [cutter.points[bb], cutter.points[kk]], cutter.points[gg]);
        if (t)
            curarr.push(t);
        polygon = deepcopy(polygon, curarr);
    }


    polygon.points.push(polygon.points[0]);
    polygon.amount++;
    for (var i = 0; i < polygon.amount - 1; i++)
        CDA(polygon.points[i][0], polygon.points[i][1], polygon.points[i + 1][0], polygon.points[i + 1][1], rescolor);
}


function innerin(polygon, s, curarr, cutter, bb, kk, gg){
    for (var j = 1; j < polygon.amount; j++){
        var t = Intersectivitely([s, polygon.points[j]], [cutter.points[bb], cutter.points[kk]], cutter.points[gg]);
        if (t)
            curarr.push(t);

        s = polygon.points[j];
        if (Visibility(s, cutter.points[bb], cutter.points[kk], cutter.points[gg]))
            curarr.push(s);
    }

    return [s, curarr];
}


/**
 * прокладка/точка входа в модуль
 * @param {user-js object} obj структура с аргументами для функций
 * @param {number} FuncNumber номер функции
 */
export function MainPad(obj, FuncNumber){
    var arrfunc = [cleardots, FILL, ClearIfEmpty, pushpolygondot, pushcutterdot];

    arrfunc[FuncNumber - 1](obj);
}