import { CDA } from "./base_algo.js";

var DOTS = []
var FLAG = 0
var CUTTER = {points:[], color: "", amount: 0};
var BUF = {xn: NaN, yn: NaN, xk: NaN, yk: NaN, amount: 0};
var BUFCUTTER = {points:[], color: "", amount: 0};

function pushline(obj){DOTS.push(Line(obj.xn, obj.yn, obj.xk, obj.yk));}
function cleardots(){DOTS = [];}
function Line(xn, yn, xk, yk){return {xn: xn, yn: yn, xk: xk, yk: yk};}

/**
 * добавление точки отрезка в хранилище
 * @param {user-js object} obj структура с нужными данными
 */
function pushdot(obj){
    if (BUF.amount == 1){
        [BUF.xk, BUF.yk] = [obj.xn, obj.yn];
        [obj.xn, obj.yn, obj.xk, obj.yk] = [BUF.xn, BUF.yn, BUF.xk, BUF.yk];
        pushline(obj);
        [BUF.xn, BUF.yn, BUF.xk, BUF.yk, BUF.amount] = [NaN, NaN, NaN, NaN, 0];
        CDA(obj.xn, obj.yn, obj.xk, obj.yk);
    }
    else
        [BUF.xn, BUF.yn, BUF.amount] = [obj.xn, obj.yn, 1];
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
    CUTTER = {points:[], color: "", amount: 0};
    BUFCUTTER = {points:[], color: "", amount: 0};
    BUF = {xn: NaN, yn: NaN, xk: NaN, yk: NaN, amount: 0};
    FLAG = 0;
}

/**
 * отрисовка последнего ребра
 */
function plotlastedge(){
    var [xn, yn] = [CUTTER.points[0][0], CUTTER.points[0][1]]
    var [xk, yk] = [CUTTER.points[CUTTER.amount - 1][0], CUTTER.points[CUTTER.amount - 1][1]]

    CDA(xn, yn, xk, yk, CUTTER.color);
}

/**
 * получение вектора
 * @param {array of 2 numbers} start начальная точка
 * @param {array of 2 numbers} stop конечная точка
 * @returns array of 2 numbers
 */
function Vector(start, stop){return [stop[0] - start[0], stop[1] - start[1]]}
function MulVector(a, b){return a[0] * b[1] - a[1] * b[0];}
function MulScal  (a, b){return a[0] * b[0] + a[1] * b[1];}

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

    plotlastedge();

    for (let value of DOTS)
        PlotResLine(value, obj.rescolor)
    
    FLAG = 1;
}

/**
 * расчёт нормали
 * @param {array of two numbers} dot1 
 * @param {array of two numbers} dot2 
 * @param {array of two numbers} dot3 
 * @returns array of two numbers
 */
function norm(dot1, dot2, dot3){
    var vector = Vector(dot1, dot2);
    var normal = vector[1] ? [1, -vector[0] / vector[1]] : [0, 1];
    var vecc = Vector(dot2, dot3);

    if (MulScal(vecc, normal) < 0){
        normal[0] = -normal[0];
        normal[1] = -normal[1];
    }

    return normal;
}

/**
 * закраска очередного отрезка
 * @param {user-js object} line отрезок
 * @param {string} rescolor цвет закраски
 */
function PlotResLine(line, rescolor){
    var [begin, end] = [0, 1];
    var [dot1, dot2] = [[line.xn, line.yn], [line.xk, line.yk]];
    var d = [dot2[0] - dot1[0], dot2[1] - dot1[1]];

    for (var i = -2; i < CUTTER.amount - 2; i++){
        var jj = i < 0 ? i + CUTTER.amount : i;

        var gg = CUTTER.points[jj + 2] ? jj + 2 : jj + 2 - CUTTER.amount;
        var kk = CUTTER.points[jj + 1] ? jj + 1 : jj + 1 - CUTTER.amount;

        var normal = norm(CUTTER.points[jj], CUTTER.points[kk], CUTTER.points[gg]);
        var w = [dot1[0] - CUTTER.points[jj][0], dot1[1] - CUTTER.points[jj][1]];
        var ds = MulScal(d, normal);
        var ws = MulScal(w, normal);

        if (ds == 0){
            if (ws < 0)
                return;
            else
                continue;
        }

        var otnoz = -ws / ds;

        if (ds < 0){
            if (otnoz >= 0)
                end = end < otnoz ? end : otnoz;
            else
                return;
        }
        else if (ds > 0){
            if (otnoz <= 1)
                begin = begin > otnoz ? begin : otnoz;
            else
                return;
        }

        if (begin > end)
            break;
    }

    if (begin <= end)
        CDA(Math.round(dot1[0] + d[0] * begin),
            Math.round(dot1[1] + d[1] * begin),
            Math.round(dot1[0] + d[0] * end), 
            Math.round(dot1[1] + d[1] * end), rescolor);
}

/**
 * прокладка/точка входа в модуль
 * @param {user-js object} obj структура с аргументами для функций
 * @param {number} FuncNumber номер функции
 */
export function MainPad(obj, FuncNumber){
    var arrfunc = [pushline, cleardots, FILL, ClearIfEmpty, pushdot, pushcutterdot];

    arrfunc[FuncNumber - 1](obj);
}