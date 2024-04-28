import { CDA } from "./base_algo.js";

var DOTS = []
var FLAG = 0
var CUTTER = {xleft: NaN, xright: NaN, ylow: NaN, yhigh: NaN, color: ""};
var BUF = {xn: NaN, yn: NaN, xk: NaN, yk: NaN, amount: 0};
var BUFCUTTER = {xleft: NaN, xright: NaN, ylow: NaN, yhigh: NaN, color: "", amount: 0};

function pushline(obj){DOTS.push(Line(obj.xn, obj.yn, obj.xk, obj.yk));}
function cleardots(){DOTS = [];}
function Point(x, y){return {x: x, y: y};}
function Line(xn, yn, xk, yk){return {xn: xn, yn: yn, xk: xk, yk: yk};}


function pushdot(obj){
    if (BUF.amount == 1){
        [BUF.xk, BUF.yk] = [obj.xn, obj.yn];
        [obj.xn, obj.yn, obj.xk, obj.yk] = [BUF.xn, BUF.yn, BUF.xk, BUF.yk];
        pushline(obj);
        [BUF.xn, BUF.yn, BUF.xk, BUF.yk, BUF.amount] = [NaN, NaN, NaN, NaN, 0];
        CDA(obj.xn, obj.yn, obj.xk, obj.yk);
    }
    else{
        [BUF.xn, BUF.yn, BUF.amount] = [obj.xn, obj.yn, 1];
    }
}

function pushcutterdot(obj){
    if (BUFCUTTER.amount == 1){
        [BUFCUTTER.xright, BUFCUTTER.yhigh] = [obj.xn, obj.yn];
        [obj.xleft, obj.xright, obj.ylow, obj.yhigh] = [BUFCUTTER.xleft, BUFCUTTER.xright, BUFCUTTER.ylow, BUFCUTTER.yhigh];
        pushcutter(obj);
        [BUFCUTTER.xleft, BUFCUTTER.xright, BUFCUTTER.ylow, BUFCUTTER.yhigh, BUFCUTTER.amount] = [NaN, NaN, NaN, NaN, 0];
    }
    else{
        [BUFCUTTER.xleft, BUFCUTTER.ylow, BUFCUTTER.amount] = [obj.xn, obj.yn, 1];
    }
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
 * проверка данных для закраски перед началом алгоритма
 * @param {user-js struct} obj объект с данными для отрисовки
 * @returns код завершения функции
 */
function CheckPlotData(obj){
    if (obj.border_colour == obj.color){
        alert("Ошибка! Цвет границы и цвет закраски не должны совпадать!");
        return -1;
    }
    if (obj.border_colour == "#ffffff"){
        alert("Ошибка! Цвет границы и цвет фона не должны совпадать!");
        return -1;
    }
    if ("#ffffff" == obj.color){
        alert("Ошибка! Цвет фона и цвет закраски не должны совпадать!");
        return -1;
    }
    if (!ZATRAVKA.x && ZATRAVKA.x != 0){
        alert("Ошибка! нет затравочного пикселя!");
        return -1;
    }

    return 0;
}

/**
 * весь цикл зарисовки после нажатия на кнопку закрасить
 * @param {user-js object} obj данные для рисования 
 */
function FILL(obj){
    //if (CheckPlotData(obj) != 0)
    //    return;
    FillFigure(obj);

    FLAG = 1;
}

/**
 * очистка таблиц и канваса в случае если пользователю уже закрасилось что-то
 */
function ClearIfEmpty(){
    if (FLAG == 1){
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
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

/**
 * получение цвета пикселя
 * @param {number} x 
 * @param {number} y 
 * @returns string цвет пикселя
 */
function GetColorPixel(x, y){
    const canvas = document.getElementById('container');
    var ctx = canvas.getContext("2d");
    var imageData = ctx.getImageData(x, y, 1, 1);
    var data = imageData.data;

    return "#" + componentToHex(data[0]) + componentToHex(data[1]) + componentToHex(data[2]);
}


/*function count_S(T){
    return T.reduce((a, b) => a + b, 0)
}


function count_P(T1, T2){
    var P = 0;
    for (var i = 0; i < T1.length; i++)
        P += (T1[i] * T2[i]);
    return P;
}


function count_T(p, xl, xr, yd, yu){
    var x = p[0];
    var y = p[1];
    var T = [0, 0, 0, 0];

    T[0] = x < xl ? 1 : 0;
    T[1] = x > xr ? 1 : 0;
    T[2] = y < yd ? 1 : 0;
    T[3] = y > yu ? 1 : 0;

    return T;
}



function deepcopy(arr){
    var res = [];

    for (var i = 0; i < arr.length; i++)
        res.push(arr[i]);

    return res;
}


function easy_cut(xl, xr, yd, yu, p1, p2){
    var T1 = count_T(p1, xl, xr, yd, yu);
    var T2 = count_T(p2, xl, xr, yd, yu);

    var FL = 0;

    var S1 = count_S(T1);
    var S2 = count_S(T2);

    var Q = p1;
    var r1 = deepcopy(p1);
    var r2 = deepcopy(p2);

    if ((S1 == 0) && (S2 == 0))
        return B_shtrih(FL, r1, r2);

    var P = count_P(T1, T2);
    if (P != 0)
        return B(r1, r2);

    if (S1 == 0){
        r1 = deepcopy(p1);
        Q = deepcopy(p2);
        i = 2;
        return A(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu, false);
    }

    if (S2 == 0){
        r1 = deepcopy(p2);
        Q = deepcopy(p1);
        i = 2;
        return A(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu, false);
    }

    var i = 0;
    return A(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu);
}

function B_shtrih(FL, p1, p2){
    if (FL == 0)
        return [true, p1, p2];
    else
        return [false, p1, p2];
}


function B(p1, p2){
    return B_shtrih(1, p1, p2);
}

function A_skip_1(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu, m){
    if (m == 0)
        return B(r1, r2);

    if (Q[1] < yd){
        var x = (yd - Q[1]) / m + Q[0];

        if (xl <= x && x <= xr){
            if (i == 1){
                r1[0] = x;
                r1[1] = yd;
            }
            else{
                r2[0] = x;
                r2[1] = yd;
            }
            return A(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu);
        }
    }

    if (Q[1] > yu){
        var x = (yu - Q[1]) / m + Q[0];

        if (xl <= x && x <= xr){
            if (i == 1){
                r1[0] = x;
                r1[1] = yu;
            }
            else{
                r2[0] = x;
                r2[1] = yu;
            }
            return A(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu);
        }
    }

    return B(r1, r2);
}

function A(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu, flag=true){
    if (flag){
        i += 1
        if (i > 2)
            return B_shtrih(FL, r1, r2)

        Q = i == 1 ? p1 : p2;
    }

    if (p1[0] == p2[0])
        return A_skip_1(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu, 99999);

    var m = (p2[1] - p1[1]) / (p2[0] - p1[0]);

    if (Q[0] < xl){
        var y = m * (xl - Q[0]) + Q[1];

        if (yd <= y && y <= yu){
            if (i == 1){
                r1[0] = xl;
                r1[1] = y;
            }
            else{
                r2[0] = xl;
                r2[1] = y;
            }
            return A(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu);
        }
    }

    if (Q[0] > xr){
        var y = m * (xr - Q[0]) + Q[1];

        if (yd <= y && y <= yu){
            if (i == 1){
                r1[0] = xr;
                r1[1] = y;
            }
            else{
                r2[0] = xr;
                r2[1] = y;
            }
            return A(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu);
        }
    }

    return A_skip_1(FL, i, Q, p1, p2, r1, r2, xl, xr, yd, yu, m);
}*/

/**
 * основной алгоритм отрисовки
 * @param {user-js object} obj данные для рисования 
 */
function FillFigure(obj){
    /*for (var i = 0; i < DOTS.length; i++){
        var xl = CUTTER.xleft;
        var xr = CUTTER.xright;
        var yd = CUTTER.ylow;
        var yu = CUTTER.yhigh;
        var p1 = [DOTS[i].xn, DOTS[i].yn];
        var p2 = [DOTS[i].xk, DOTS[i].yk];
        yu, yd = yd, yu

        var visible;
        [visible, p1, p2] = easy_cut(xl, xr, yd, yu, p1, p2);
        console.log(visible);
        console.log(p1[0], p1[1]);
        console.log(p2[0], p2[1]);
        console.log(obj.rescolor);
        CDA(p1[0], p1[1], p2[0], p2[1], obj.rescolor);
       // if (visible)
          //  CDA(DOTS[i].xn, DOTS[i].yn, DOTS[i].xk, DOTS[i].yk, obj.linecolor);
    }*/
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