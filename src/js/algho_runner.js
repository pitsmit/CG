import { CDA } from "./base_algo.js";

var DOTS = []
var FLAG = 0
var CUTTER = {xleft: NaN, xright: NaN, ylow: NaN, yhigh: NaN, color: ""};
var BUF = {xn: NaN, yn: NaN, xk: NaN, yk: NaN, amount: 0};
var BUFCUTTER = {xleft: NaN, xright: NaN, ylow: NaN, yhigh: NaN, color: "", amount: 0};

function pushline(obj){DOTS.push(Line(obj.xn, obj.yn, obj.xk, obj.yk));}
function cleardots(){DOTS = [];}
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
 * весь цикл зарисовки после нажатия на кнопку закрасить
 * @param {user-js object} obj данные для рисования 
 */
async function FILL(obj){
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


function COPY(arr){
    var res = [];

    for (var i = 0; i < arr.length; i++)
        res.push(arr[i]);

    return res;
}

/**
 * основной алгоритм отрисовки
 * @param {user-js object} obj данные для рисования 
 */
async function FillFigure(obj){
    [CUTTER.ylow, CUTTER.yhigh] = [CUTTER.yhigh, CUTTER.ylow];
    var BIG_STRUCT = {P1: [0, 0], P2: [0, 0], flag: 0, R1: [0, 0], R2: [0, 0], m: 99999999, I: 0, Pt: [0, 0]};
    for (var i = 0; i < DOTS.length; i++){
        BIG_STRUCT.P1 = [DOTS[i].xn, DOTS[i].yn];
        BIG_STRUCT.P2 = [DOTS[i].xk, DOTS[i].yk];

        var code_1 = find_code(BIG_STRUCT.P1[0], BIG_STRUCT.P1[1]);
        var code_2 = find_code(BIG_STRUCT.P2[0], BIG_STRUCT.P2[1]);

        BIG_STRUCT.flag = 0;
        BIG_STRUCT.R1 = COPY(BIG_STRUCT.P1);
        BIG_STRUCT.R2 = COPY(BIG_STRUCT.P2);
        BIG_STRUCT.m = 9999999999999;

        var [s1, s2] = [find_sum(code_1), find_sum(code_2)];

        if (!s1 && !s2){
            CDA(BIG_STRUCT.R1[0], BIG_STRUCT.R1[1], BIG_STRUCT.R2[0], BIG_STRUCT.R2[1], obj.rescolor)
        }

        if (logic_and(code_1, code_2)){
            BIG_STRUCT.flag = -1;
            continue;
        }

        if (s1 == 0){
            BIG_STRUCT.I = 2;
            BIG_STRUCT.R1 = COPY(BIG_STRUCT.P1);
            BIG_STRUCT.Pt = COPY(BIG_STRUCT.P2);
            BIG_STRUCT = check_left_cross(BIG_STRUCT, obj);
        }
        if (s2 == 0){
            console.log(BIG_STRUCT);
            BIG_STRUCT.I = 2;
            BIG_STRUCT.R1 = COPY(BIG_STRUCT.P2);
            BIG_STRUCT.Pt = COPY(BIG_STRUCT.P1);
            BIG_STRUCT = check_left_cross(BIG_STRUCT, obj);
        }

        BIG_STRUCT.I = 0;
        BIG_STRUCT = next_point(BIG_STRUCT, obj);
    }
    [CUTTER.ylow, CUTTER.yhigh] = [CUTTER.yhigh, CUTTER.ylow];
}


function find_code(x, y){
    var code = [0, 0, 0, 0];

    if (x < CUTTER.xleft)
        code[0] = 1;
    if (x > CUTTER.xright)
        code[1] = 1;
    if (y < CUTTER.ylow)
        code[2] = 1;
    if (y > CUTTER.yhigh)
        code[3] = 1;

    return code
}

function find_sum(code){
    var s = 0;
    for (var i = 0; i < code.length; i++)
        s += code[i];

    return s;
}

function logic_and(code_1, code_2){
    var s = 0;
    for (var i = 0; i < code_1.length; i++)
        s += code_1[i] * code_2[i];

    return s;
}

function check_left_cross(BIG_STRUCT, obj){
    if (BIG_STRUCT.P2[0] == BIG_STRUCT.P1[0])
        BIG_STRUCT = check_up_cross(BIG_STRUCT, obj);
    else{
        BIG_STRUCT.m = (BIG_STRUCT.P2[1] - BIG_STRUCT.P1[1]) / (BIG_STRUCT.P2[0] - BIG_STRUCT.P1[0])

        if (CUTTER.xleft < BIG_STRUCT.Pt[0])
            BIG_STRUCT = check_right_cross(BIG_STRUCT, obj)
        else{
            var y = BIG_STRUCT.m * (CUTTER.xleft - BIG_STRUCT.Pt[0]) + BIG_STRUCT.Pt[1]

            if (y > CUTTER.yhigh || y < CUTTER.ylow)
                BIG_STRUCT = check_right_cross(BIG_STRUCT, obj)
            else{
                BIG_STRUCT.Pt = [CUTTER.xleft, y]
                BIG_STRUCT = next_point(BIG_STRUCT, obj)
            }
        }
    }

    return BIG_STRUCT
}

function check_right_cross(BIG_STRUCT, obj){
    if (CUTTER.xright > BIG_STRUCT.Pt[0])
        BIG_STRUCT = check_up_cross(BIG_STRUCT, obj)
    else{
        var y = BIG_STRUCT.m * (CUTTER.xright - BIG_STRUCT.Pt[0]) + BIG_STRUCT.Pt[1]

        if (y > CUTTER.yhigh || y < CUTTER.ylow)
            BIG_STRUCT = check_up_cross(BIG_STRUCT, obj)
        else{
            BIG_STRUCT.Pt = [CUTTER.xright, y]

            BIG_STRUCT = next_point(BIG_STRUCT, obj)
        }
    }

    return BIG_STRUCT
}

function check_up_cross(BIG_STRUCT, obj){
    if (BIG_STRUCT.m == 0)
        BIG_STRUCT = next_point(BIG_STRUCT, obj)
    else{
        if (CUTTER.yhigh > BIG_STRUCT.Pt[1])
            BIG_STRUCT = check_down_cross(BIG_STRUCT, obj)
        else{
            var x = BIG_STRUCT.Pt[0] + (CUTTER.yhigh - BIG_STRUCT.Pt[1]) / BIG_STRUCT.m

            if (x < CUTTER.xleft || x > CUTTER.xright)
                BIG_STRUCT = check_down_cross(BIG_STRUCT, obj)
            else{
                BIG_STRUCT.Pt = [x, CUTTER.yhigh]

                BIG_STRUCT = next_point(BIG_STRUCT, obj)
            }
        }
    }

    return BIG_STRUCT
}

function check_down_cross(BIG_STRUCT, obj){
    if (CUTTER.ylow < BIG_STRUCT.Pt[1])
        return
    var x = BIG_STRUCT.Pt[0] + (CUTTER.ylow - BIG_STRUCT.Pt[1]) / BIG_STRUCT.m

    if (x < CUTTER.xleft || x > CUTTER.xright){
        BIG_STRUCT.flag = -1
        return
    }
    else{
        BIG_STRUCT.Pt = [x, CUTTER.ylow]

        BIG_STRUCT = next_point(BIG_STRUCT, obj)
    }

    return BIG_STRUCT
}

function next_point(BIG_STRUCT, obj){
    if (BIG_STRUCT.I != 0){
        if (BIG_STRUCT.I == 1)
            BIG_STRUCT.R1 = COPY(BIG_STRUCT.Pt)
        else
            BIG_STRUCT.R2 = COPY(BIG_STRUCT.Pt)
    }

    BIG_STRUCT.I += 1
    if (BIG_STRUCT.I > 2)
        CDA(BIG_STRUCT.R1[0], BIG_STRUCT.R1[1], BIG_STRUCT.R2[0], BIG_STRUCT.R2[1], obj.rescolor)
    else{
        if (BIG_STRUCT.I == 1)
            BIG_STRUCT.Pt = COPY(BIG_STRUCT.P1)
        else
            BIG_STRUCT.Pt = COPY(BIG_STRUCT.P2)

        BIG_STRUCT = check_left_cross(BIG_STRUCT, obj)
    }

    return BIG_STRUCT
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