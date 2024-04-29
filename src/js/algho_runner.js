import { CDA } from "./base_algo.js";

var DOTS = []
var FLAG = 0
var CUTTER = {xleft: NaN, xright: NaN, ylow: NaN, yhigh: NaN, color: ""};
var BUF = {xn: NaN, yn: NaN, xk: NaN, yk: NaN, amount: 0};
var BUFCUTTER = {xleft: NaN, xright: NaN, ylow: NaN, yhigh: NaN, color: "", amount: 0};

function pushline(obj){DOTS.push(Line(obj.xn, obj.yn, obj.xk, obj.yk));}
function cleardots(){DOTS = [];}
function Line(xn, yn, xk, yk){return {xn: xn, yn: yn, xk: xk, yk: yk};}
function ALGO_STRUCT(){return {P1: [0, 0], P2: [0, 0], fl: 0, R1: [0, 0], R2: [0, 0], m: Infinity, I: 0, Pt: [0, 0]};}


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

function pushcutterdot(obj){
    if (BUFCUTTER.amount == 1){
        [BUFCUTTER.xright, BUFCUTTER.yhigh] = [obj.xn, obj.yn];
        [obj.xleft, obj.xright, obj.ylow, obj.yhigh] = [BUFCUTTER.xleft, BUFCUTTER.xright, BUFCUTTER.ylow, BUFCUTTER.yhigh];
        pushcutter(obj);
        [BUFCUTTER.xleft, BUFCUTTER.xright, BUFCUTTER.ylow, BUFCUTTER.yhigh, BUFCUTTER.amount] = [NaN, NaN, NaN, NaN, 0];
    }
    else
        [BUFCUTTER.xleft, BUFCUTTER.ylow, BUFCUTTER.amount] = [obj.xn, obj.yn, 1];
}

function pushcutter(obj){
    if (CUTTER.xleft != NaN){
        CDA(CUTTER.xleft, CUTTER.ylow, CUTTER.xleft, CUTTER.yhigh, "white");
        CDA(CUTTER.xright, CUTTER.ylow, CUTTER.xright, CUTTER.yhigh, "white");
        CDA(CUTTER.xleft, CUTTER.ylow, CUTTER.xright, CUTTER.ylow, "white");
        CDA(CUTTER.xright, CUTTER.yhigh, CUTTER.xleft, CUTTER.yhigh, "white");
    }
    [CUTTER.xleft, CUTTER.xright, CUTTER.ylow, CUTTER.yhigh, CUTTER.color] = [obj.xleft, obj.xright, obj.ylow, obj.yhigh, obj.cuttercolor];

    CDA(obj.xleft, obj.ylow, obj.xleft, obj.yhigh, obj.cuttercolor);
    CDA(obj.xright, obj.ylow, obj.xright, obj.yhigh, obj.cuttercolor);
    CDA(obj.xleft, obj.ylow, obj.xright, obj.ylow, obj.cuttercolor);
    CDA(obj.xright, obj.yhigh, obj.xleft, obj.yhigh, obj.cuttercolor);
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
    CUTTER = {xleft: NaN, xright: NaN, ylow: NaN, yhigh: NaN};
    BUF = {xn: NaN, yn: NaN, xk: NaN, yk: NaN, amount: 0};
    FLAG = 0;
}

/**
 * весь цикл зарисовки после нажатия на кнопку закрасить
 * @param {user-js object} obj данные для рисования 
 */
function FILL(obj){
    [CUTTER.ylow, CUTTER.yhigh] = [CUTTER.yhigh, CUTTER.ylow];
    var rescolor = obj.rescolor /// @typedef string

    for (let value of DOTS)
        PlotResLine(value, rescolor)
    
    FLAG = 1;
}

/**
 * закраска текущего отрезка
 * @param {array of numbers} value координаты текущего отрезка
 * @param {string} rescolor цвет закраски
 */
function PlotResLine(value, rescolor){
    var DATA = ALGO_STRUCT();

    DATA.P1 = [value.xn, value.yn];
    DATA.P2 = [value.xk, value.yk];
    [DATA.fl, DATA.R1, DATA.R2, DATA.m] = [0, COPY(DATA.P1), COPY(DATA.P2), Infinity];

    var code_1 = SearchCode(DATA.P1[0], DATA.P1[1]);
    var code_2 = SearchCode(DATA.P2[0], DATA.P2[1]);
    var [s1, s2] = [Sum(code_1), Sum(code_2)];

    if (!s1 && !s2)
        CDA(DATA.R1[0], DATA.R1[1], DATA.R2[0], DATA.R2[1], rescolor)

    if (BinaryAnd(code_1, code_2)){
        DATA.fl = -1;
        return;
    }

    DATA = CheckInnerEdges(DATA, s1, s2, rescolor);
        
    if (DATA == undefined)
        var DATA = ALGO_STRUCT();
    DATA.I = 0;
    DATA = Next(DATA, rescolor);
}

/**
 * ветка если отрезок лежит внутри
 * @param {user-js object} DATA структура с данными для алгоритма
 * @param {*} s1 сумма
 * @param {*} s2 сумма
 * @param {string} rescolor цвет закраски
 * @returns обновлённая структура с данными
 */
function CheckInnerEdges(DATA, s1, s2, rescolor){
    if (s1 == 0){
        DATA.I = 2;
        DATA.R1 = COPY(DATA.P1);
        DATA.Pt = COPY(DATA.P2);
        DATA = GoLeft(DATA, rescolor);
    }
    if (s2 == 0){
        if (DATA == undefined)
            var DATA = ALGO_STRUCT();
        DATA.I = 2;
        DATA.R1 = COPY(DATA.P2);
        DATA.Pt = COPY(DATA.P1);
        DATA = GoLeft(DATA, rescolor);
    }

    return DATA;
}

/**
 * создание глубокой копии массива
 * @param {array of numbers} arr массив для копирования
 * @returns {array of numbers}
 */
function COPY(arr){
    var res = [];

    for (var i = 0; i < arr.length; i++)
        res.push(arr[i]);

    return res;
}

/**
 * создание бинарного массива для дальнейших вычислений
 * @param {number} x 
 * @param {number} y 
 * @returns массив из 4 чисел
 */
function SearchCode(x, y){
    return [x < CUTTER.xleft ? 1 : 0,
            x > CUTTER.xright ? 1 : 0,
            y < CUTTER.ylow ? 1 : 0,
            y > CUTTER.yhigh ? 1 : 0];
}

/**
 * поиск суммы массива
 * @param {array of numbers} code массив
 * @returns сумма
 */
function Sum(code){
    var s = 0;

    for (let value of code)
        s += value;

    return s;
}

/**
 * реализация логического и(суммы)
 * @param {array of numbers} code1 
 * @param {array of numbers} code2 
 * @returns number
 */
function BinaryAnd(code1, code2){
    var s = 0;

    for (var i = 0; i < code1.length; s += code1[i] * code2[i], i++);

    return s;
}

/**
 * идём влево
 * @param {user-js object} DATA данные для работы алгоритма
 * @param {string} rescolor цвет закраски
 * @returns {user-js object} данные для работы алгоритма
 */
function GoLeft(DATA, rescolor){
    if (DATA.P2[0] == DATA.P1[0])
        DATA = GoUp(DATA, rescolor);
    else{
        DATA.m = (DATA.P2[1] - DATA.P1[1]) / (DATA.P2[0] - DATA.P1[0]);

        if (CUTTER.xleft < DATA.Pt[0])
            DATA = GoRight(DATA, rescolor);
        else{
            var y = DATA.m * (CUTTER.xleft - DATA.Pt[0]) + DATA.Pt[1];

            if (y > CUTTER.yhigh || y < CUTTER.ylow)
                DATA = GoRight(DATA, rescolor);
            else{
                DATA.Pt = [CUTTER.xleft, y];
                DATA = Next(DATA, rescolor);
            }
        }
    }

    return DATA;
}

/**
 * идём вправо
 * @param {user-js object} DATA данные для работы алгоритма
 * @param {string} rescolor цвет закраски
 * @returns {user-js object} данные для работы алгоритма
 */
function GoRight(DATA, rescolor){
    if (CUTTER.xright > DATA.Pt[0])
        DATA = GoUp(DATA, rescolor);
    else{
        var y = DATA.m * (CUTTER.xright - DATA.Pt[0]) + DATA.Pt[1];

        if (y > CUTTER.yhigh || y < CUTTER.ylow)
            DATA = GoUp(DATA, rescolor);
        else{
            DATA.Pt = [CUTTER.xright, y];
            DATA = Next(DATA, rescolor);
        }
    }

    return DATA;
}

/**
 * идём вверх
 * @param {user-js object} DATA данные для работы алгоритма
 * @param {string} rescolor цвет закраски
 * @returns {user-js object} данные для работы алгоритма
 */
function GoUp(DATA, rescolor){
    if (DATA.m == 0)
        DATA = Next(DATA, rescolor);
    else{
        if (CUTTER.yhigh > DATA.Pt[1])
            DATA = GoDown(DATA, rescolor);
        else{
            var x = DATA.Pt[0] + (CUTTER.yhigh - DATA.Pt[1]) / DATA.m;

            if (x < CUTTER.xleft || x > CUTTER.xright)
                DATA = GoDown(DATA, rescolor);
            else{
                DATA.Pt = [x, CUTTER.yhigh];
                DATA = Next(DATA, rescolor);
            }
        }
    }

    return DATA;
}

/**
 * идём вниз
 * @param {user-js object} DATA данные для работы алгоритма
 * @param {string} rescolor цвет закраски
 * @returns {user-js object} данные для работы алгоритма
 */
function GoDown(DATA, rescolor){
    if (CUTTER.ylow < DATA.Pt[1])
        return
    var x = DATA.Pt[0] + (CUTTER.ylow - DATA.Pt[1]) / DATA.m;

    if (x < CUTTER.xleft || x > CUTTER.xright){
        DATA.fl = -1;
        return;
    }
    else{
        DATA.Pt = [x, CUTTER.ylow];
        DATA = Next(DATA, rescolor);
    }

    return DATA;
}

/**
 * попытка закраски
 * @param {user-js object} DATA данные для работы алгоритма
 * @param {string} rescolor цвет закраски
 * @returns {user-js object} данные для работы алгоритма
 */
function Next(DATA, rescolor){
    if (DATA.I != 0){
        if (DATA.I == 1)
            DATA.R1 = COPY(DATA.Pt);
        else
            DATA.R2 = COPY(DATA.Pt);
    }

    DATA.I += 1;
    if (DATA.I > 2)
        CDA(DATA.R1[0], DATA.R1[1], DATA.R2[0], DATA.R2[1], rescolor);
    else{
        if (DATA.I == 1)
            DATA.Pt = COPY(DATA.P1);
        else
            DATA.Pt = COPY(DATA.P2);

        DATA = GoLeft(DATA, rescolor);
    }

    return DATA;
}

/**
 * прокладка/точка входа в модуль
 * @param {user-js object} obj структура с аргументами для функций
 * @param {number} FuncNumber номер функции
 */
export function MainPad(obj, FuncNumber){
    var arrfunc = [pushline, cleardots, FILL, ClearIfEmpty, pushdot, pushcutter, pushcutterdot];

    arrfunc[FuncNumber - 1](obj);
}