import { FunctionPad, SetRect } from "./functions.js";

function is_visible(point){return 0 <= point[0] < width && 0 <= point[1] < height;}

let trans_matrix = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
]

function PrepareForStage(point){
    point.push(1);
    let res = [0, 0, 0, 0];

    for (let i = 0; i < 4; i++){
        for (let j = 0; j < 4; j++)
            res[i] += point[j] * trans_matrix[j][i];
        res[i] *= 40;
    }

    res[0] += width / 2;
    res[1] = height / 2 - res[1];

    return [res[0], res[1], res[2]];
}

/**
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number array} HighHor 
 * @param {number array} LowHor 
 * @param {string} color 
 * @returns 
 */
function SetPoint(x, y, HighHor, LowHor, color){
    if (!is_visible([x, y]))
        return false;

    if (y > HighHor[x]){
        HighHor[x] = y;
        SetRect(x, y, color);
    }
    else if (y < LowHor[x]){
        LowHor[x] = y;
        SetRect(x, y, color);
    }

    return true;
}


/**
 * 
 * @param {number array} p1 
 * @param {number array} p2 
 * @param {number array} HighHor 
 * @param {number array} LowHor 
 * @param {string} color 
 */
function DraHorCur(p1, p2, HighHor, LowHor, color){
    if (p1[0] > p2[0]) 
        [p1, p2] = [p2, p1];

    let dx = p2[0] - p1[0];
    let dy = p2[1] - p1[1];
    let l = dx > dy ? dx : dy;
    dx /= l;
    dy /= l;

    let [x, y] = [p1[0], p1[1]];

    for (let i = 0; i < Math.round(l) + 1 && SetPoint(Math.round(x), y, HighHor, LowHor, color); x += dx, y += dy, i++);
}


/**
 * 
 * @param {function} func 
 * @param {number array} HighHor 
 * @param {number array} LowHor 
 * @param {number} fromx 
 * @param {number} tox 
 * @param {number} stepx 
 * @param {number} z 
 * @param {string} color 
 */
function DrawHor(func, HighHor, LowHor, fromx, tox, stepx, z, color){
    let prev = NaN;

    for (let x = fromx + stepx; x < tox + stepx; x += stepx){
        let cur = PrepareForStage([x, func(x, z), z]);
        if (prev)
            DraHorCur(prev, cur, HighHor, LowHor, color);
        prev = cur;
    }
}

/**
 * очистка канваса
 */
function ClearScene(){
    const canvas = document.getElementById('container');
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = "white"; //* @typefunction string
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}


/**
 * основной алгоритм построения
 * @param {user-js object} obj структура с данными для алгоритма
 */
function HORIZON(obj){
    ClearScene();

    let [fromx, tox, stepx, fromz, toz, stepz, color, f] = [obj.fromx, obj.tox, obj.stepx, obj.fromz, obj.toz, obj.stepz, obj.rescolor, FunctionPad(obj.funcid)];
    let [HighHor, LowHor] = [[], []];

    for (let i = 0; i < width; i++){
        HighHor.push(0);
        LowHor.push(height);
    }

    for (let z = fromz; z < toz + stepz; z += stepz)
        DrawHor(f, HighHor, LowHor, fromx, tox, stepx, z, color);
}

/**
 * генерация новый координат для матрицы
 * @param {array of arrays of numbers} rotmat матрица поворота
 */
function RotateMatrix(rotmat){
    let res = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            for (let k = 0; k < 4; k++)
                res[i][j] += trans_matrix[i][k] * rotmat[k][j];

    for (let i = 0; i < res.length; i++)
        for (let j = 0; j < res[i].length; j++)
            trans_matrix[i][j] = res[i][j];
}


/**
 * поворот относительно оси x
 * @param {user-js object} obj структура с данными для алгоритма
 */
function rotate_x(obj){
    let value = obj.grad / 180 * Math.PI;
    let rotmat = [[ 1, 0, 0, 0 ], [ 0, Math.cos(value), Math.sin(value), 0 ], [ 0, -Math.sin(value), Math.cos(value), 0 ], [ 0, 0, 0, 1 ]];

    RotateMatrix(rotmat)
    HORIZON(obj)
}


/**
 * поворот относительно оси y
 * @param {user-js object} obj структура с данными для алгоритма
 */
function rotate_y(obj){
    let value = obj.grad / 180 * Math.PI;
    let rotmat = [[ Math.cos(value), 0, -Math.sin(value), 0 ], [ 0, 1, 0, 0 ], [ Math.sin(value), 0, Math.cos(value), 0 ], [ 0, 0, 0, 1 ]];

    RotateMatrix(rotmat)
    HORIZON(obj)
}


/**
 * поворот относительно оси z
 * @param {user-js object} obj структура с данными для алгоритма
 */
function rotate_z(obj){
    let value = obj.grad / 180 * Math.PI;
    let rotmat = [[ Math.cos(value), Math.sin(value), 0, 0 ], [ -Math.sin(value), Math.cos(value), 0, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 0, 1 ]];

    RotateMatrix(rotmat)
    HORIZON(obj)
}



/**
 * прокладка/точка входа в модуль
 * @param {user-js object} obj структура с аргументами для функций
 * @param {number} FuncNumber номер функции
 */
export function MainPad(obj, FuncNumber){
    let arrfunc = [HORIZON, rotate_x, rotate_y, rotate_z];

    arrfunc[FuncNumber - 1](obj);
}